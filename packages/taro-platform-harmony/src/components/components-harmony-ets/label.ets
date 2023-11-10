import { Current, eventHandler } from '@tarojs/runtime'
import { findChildNodeWithDFS } from '@tarojs/taro/utils'

import { createNode } from './render'
import TaroComponentWrapper from './base'
import { TOUCH_EVENT_MAP } from './utils/constant/event'
import { FlexManager } from './utils/FlexManager'
import { bindInstanceToNode, bindAnimation, getComponentEventCallback, getNormalAttributes, shouldBindEvent, getNodeVisibleChange } from './utils/helper'

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
struct TaroLabel {
  nodeInfoMap: any = {}

  eventMap: any = {}

  @State isAreaChangeTap: boolean = false

  @State overwriteStyle: Record<string, any> = {}

  @State thresholds: number[] | null = null

  @Styles visibleChangeEvent () {
    .onVisibleAreaChange(this.thresholds || [0.0, 1.0], getNodeVisibleChange(this))
  }

  @ObjectLink node: TaroViewElement

  aboutToAppear () {
    bindInstanceToNode(this.node, this)
    // 绑定动画
    bindAnimation(this.node, (rule) => {
      this.overwriteStyle = rule
    })

    this.nodeInfoMap[this.node._nid] = {}
  }

  @Styles defaultEvent () {
    .onClick((e: ClickEvent) => {
      const firstChild = this.node.childNodes[0]
      const id = this.node._attrs.for || firstChild?._attrs.id || firstChild?._nid
      this.handleTargetChange(id)
      eventHandler(e, 'click', this.node)
    })
    .onTouch(shouldBindEvent((e: TouchEvent) => eventHandler(e, TOUCH_EVENT_MAP[e.type], this.node), this.node, Object.values(TOUCH_EVENT_MAP)))
    .onAreaChange(getComponentEventCallback('areaChange', ({ eventResult }) => {
      const [_, areaResult] = eventResult

      this.nodeInfoMap[this.node._nid].areaInfo = areaResult
    }, this))
  }

  handleTargetChange (id: string) {
    const taro = (Current as any).taro
    const page = taro.getCurrentInstance().page
    const currentPageNode = (page.node instanceof Array) ? page.node[page.currentIndex] : page.node
    const node = findChildNodeWithDFS(currentPageNode, `#${id}`)

    if (!node || !node.instance) return

    if (['BUTTON', 'CHECKBOX', 'RADIO', 'SWITCH', 'INPUT'].includes(node.tagName)) {
      const instance = node.instance
      switch (node.tagName) {
        case 'RADIO':
          if (!instance.checked) {
            instance.checked = !instance.checked
          }
          break
        case 'CHECKBOX':
          instance.checked = !instance.checked
          break
        default:
          focusControl.requestFocus(id)
      }
    }
  }

  build() {
    TaroComponentWrapper({ node: this.node }) {
      Flex(FlexManager.flexOptions(this.node)) {
        ForEach(this.node.childNodes, item => {
          createNode(item)
        }, item => item._nid)
      }
      .attrs(getNormalAttributes(this.node, this.overwriteStyle))
      .defaultEvent()
      .visibleChangeEvent()
    }
  }
}

export default TaroLabel
