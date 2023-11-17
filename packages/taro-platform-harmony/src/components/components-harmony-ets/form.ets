import { bindInstanceToNode, bindAnimation, Current, eventHandler, getComponentEventCallback, VISIBLE_CHANGE_EVENT_NAME, initComponentNodeInfo, treeToArray } from '@tarojs/runtime'

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

    // 监听submit冒泡
    this.node.addEventListener('submit-btn', (e: any) => {
      e.stopPropagation()
      const formResult = {}
      treeToArray(this.node, (item) => {
        switch (item.nodeName) {
          case 'INPUT':
          case 'SLIDER': 
          case 'SWITCH': 
          case 'RADIO-GROUP':
          case 'CHECKBOX-GROUP': 
          case 'PICKER': {
            formResult[item.name] = item.value
            break
          }
        }
      })
      const event = createTaroEvent('submit', { detail: { value: formResult } }, this.node)
      eventHandler(event, 'submit', this.node)
    })
    // 监听reset冒泡
    this.node.addEventListener('reset-btn', (e) => {
      treeToArray(this.node, (item) => {
        e.stopPropagation()
        switch (item.nodeName) {
          case 'INPUT': {
            item.value = item._attrs.value
            break
          }
          case 'SLIDER': {
            item.value = item._attrs.value
            break
          }
          case 'SWITCH': {
            item.value = item._attrs.checked
            break
          }
          case 'RADIO-GROUP': {
            item._instance.reset()
            break
          }
          case 'CHECKBOX-GROUP': {
            item._instance.reset()
            break
          }
          case 'PICKER': {
            item.value = item._attrs.value
            break
          }
        }
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
