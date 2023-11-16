import { bindInstanceToNode, bindAnimation, Current, eventHandler, getComponentEventCallback, VISIBLE_CHANGE_EVENT_NAME, initComponentNodeInfo, getPageScrollerOrNode } from '@tarojs/runtime'

import { createNode } from './render'
import TaroComponentWrapper from './base'
import { TOUCH_EVENT_MAP } from './utils/constant/event'
import { FlexManager } from './utils/FlexManager'
import { createTaroEvent } from './utils/events'
import { getNormalAttributes, shouldBindEvent, getNodeThresholds } from './utils/helper'

import type { TaroViewElement } from '@tarojs/runtime'



@Extend(Flex)
function attrs ({
  id,
  flexBasis,
  flexGrow,
  flexShrink,
  alignSelf,
  clip,
  width,
  height,
  margin,
  padding,
  linearGradient,
  zIndex,
  borderStyle,
  borderWidth,
  borderColor,
  borderRadius,
  opacity,
  backgroundColor,
  backgroundImage,
  backgroundRepeat,
  backgroundImageSize,
  constraintSize,
  rotate,
  scale,
  translate,
  transform,
 }) {
  .id(id)
  .key(id)
  .constraintSize(constraintSize)
  .flexGrow(flexGrow)
  .flexShrink(flexShrink)
  .flexBasis(flexBasis)
  .alignSelf(alignSelf)
  .width(width)
  .height(height)
  .margin(margin)
  .padding(padding)
  .linearGradient(linearGradient)
  .zIndex(zIndex)
  .borderStyle(borderStyle)
  .borderWidth(borderWidth)
  .borderColor(borderColor)
  .borderRadius(borderRadius)
  .opacity(opacity)
  .backgroundColor(backgroundColor)
  .backgroundImage(backgroundImage, backgroundRepeat)
  .backgroundImageSize(backgroundImageSize)
  .rotate(rotate)
  .scale(scale)
  .translate(translate)
  .transform(transform)
  .clip(clip)
}


@Component
struct TaroForm {
  nodeInfoMap: any = {}

  eventMap: any = {}

  @Styles visibleChangeEvent () {
    .onVisibleAreaChange(getNodeThresholds(this.node) || [0.0, 1.0], getComponentEventCallback(this.node, VISIBLE_CHANGE_EVENT_NAME))
  }

  @ObjectLink node: TaroViewElement

  aboutToAppear () {
    initComponentNodeInfo(this, this.node)
    bindInstanceToNode(this.node, this)
    // 绑定动画
    bindAnimation(this.node)

    // 监听submit
    this.node.addEventListener('submit-btn', (e: any) => {
      e.stopPropagation()

      // TODO： 💩减少获取dom的次数，增加querySelector一次过拿很多个
      const formResult = {}
      // input
      this.node.getElementsByTagName('INPUT').forEach((item: any) => {
        formResult[item.name] = item.value
      })
      // slider
      this.node.getElementsByTagName('SLIDER').forEach((item: any) => {
        formResult[item.name] = item.value
      })
      // switch
      this.node.getElementsByTagName('SWITCH').forEach((item: any) => {
        formResult[item.name] = item.value
      })
      // radio
      this.node.getElementsByTagName('RADIO-GROUP').forEach((item: any) => {
        formResult[item.name] = item.value
      })
      // checkbox
      this.node.getElementsByTagName('CHECKBOX-GROUP').forEach((item: any) => {
        formResult[item.name] = item.value
      })
      // picker
      this.node.getElementsByTagName('PICKER').forEach((item: any) => {
        formResult[item.name] = item.value
      })

      const event = createTaroEvent('submit', { detail: { value: formResult } }, this.node)
      eventHandler(event, 'submit', this.node)
    })

    this.node.addEventListener('reset-btn', (e) => {
      // TODO： 减少获取dom的次数，增加querySelector一次过拿很多个
      e.stopPropagation()
      this.node.getElementsByTagName('INPUT').forEach((item: any) => {
        item.value = item._attrs.value
      })
      this.node.getElementsByTagName('SLIDER').forEach((item: any) => {
        item.value = item._attrs.value
      })
      this.node.getElementsByTagName('SWITCH').forEach((item: any) => {
        item.value = item._attrs.checked
      })
      this.node.getElementsByTagName('RADIO-GROUP').forEach((item: any) => {
        item._instance.reset()
      })
      this.node.getElementsByTagName('CHECKBOX-GROUP').forEach((item: any) => {
        item._instance.reset()
      })
      this.node.getElementsByTagName('PICKER').forEach((item: any) => {
        item.value = item._attrs.value
      })
    })
  }

  @Styles defaultEvent () {
    .onClick(shouldBindEvent((e: ClickEvent) => eventHandler(e, 'click', this.node), this.node, ['click']))
    .onTouch(shouldBindEvent((e: TouchEvent) => eventHandler(e, TOUCH_EVENT_MAP[e.type], this.node), this.node, Object.values(TOUCH_EVENT_MAP)))
    .onAreaChange(getComponentEventCallback('areaChange', ({ eventResult }) => {
      const [_, areaResult] = eventResult

      this.nodeInfoMap[this.node._nid].areaInfo = areaResult
    }, this))
  }

  build() {
    TaroComponentWrapper({ node: this.node }) {
      Flex(FlexManager.flexOptions(this.node)) {
        ForEach(this.node.childNodes, item => {
          createNode(item)
        }, item => item._nid)
      }
      .attrs(getNormalAttributes(this.node))
      .defaultEvent()
      .visibleChangeEvent()
    }
  }
}

export default TaroForm
