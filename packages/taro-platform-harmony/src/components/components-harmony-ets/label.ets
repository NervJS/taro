import { bindInstanceToNode, Current, eventHandler, getComponentEventCallback, VISIBLE_CHANGE_EVENT_NAME, initComponentNodeInfo, getPageScrollerOrNode, AREA_CHANGE_EVENT_NAME,
  TaroAny } from '@tarojs/runtime'

import { createNode } from './render'
import TaroComponentWrapper from './base'
import { TOUCH_EVENT_MAP } from './utils/constant/event'
import { FlexManager } from './utils/FlexManager'
import { getNormalAttributes, shouldBindEvent, getNodeThresholds, bindAnimation } from './utils/helper'

import type { TaroLabelElement, TaroElement } from './element'
import type { TaroStyleType } from '@tarojs/runtime'

@Extend(Flex)
function attrs (style: TaroStyleType) {
  .id(style.id)
  .key(style.id)
  .padding(style.padding)
  .margin(style.margin)
  .width(style.width)
  .height(style.height)
  .constraintSize(style.constraintSize)
  .flexGrow(style.flexGrow)
  .flexShrink(style.flexShrink)
  .flexBasis(style.flexBasis)
  .alignSelf(style.alignSelf)
  .backgroundColor(style.backgroundColor)
  .backgroundImage(style.backgroundImage, style.backgroundRepeat)
  .backgroundImageSize(style.backgroundImageSize)
  .rotate(style.rotate)
  .scale(style.scale)
  .translate(style.translate)
  .transform(style.transform)
  .borderStyle(style.borderStyle)
  .borderWidth(style.borderWidth)
  .borderColor(style.borderColor)
  .borderRadius(style.borderRadius)
  .linearGradient(style.linearGradient)
  .zIndex(style.zIndex)
  .opacity(style.opacity)
  .clip(style.clip)
}

@Component
export default struct TaroLabel {
  nodeInfoMap: TaroAny = {}

  @Styles visibleChangeEvent () {
    .onVisibleAreaChange(getNodeThresholds(this.node) || [0.0, 1.0], getComponentEventCallback(this.node, VISIBLE_CHANGE_EVENT_NAME))
  }

  @ObjectLink node: TaroLabelElement

  aboutToAppear () {
    initComponentNodeInfo(this, this.node)
    bindInstanceToNode(this.node, this)
    // 绑定动画
    bindAnimation(this.node)
  }

  @Styles defaultEvent () {
    .onClick((e: ClickEvent) => {
      const firstChild = this.node.childNodes[0] as TaroElement | null
      const id: string = this.node._attrs.for || firstChild?._attrs.id || firstChild?._nid || ''
      this.handleTargetChange(id)
      eventHandler(e, 'click', this.node)
    })
    .onTouch(shouldBindEvent((e: TouchEvent) => eventHandler(e, TOUCH_EVENT_MAP.get(e.type), this.node), this.node, TOUCH_EVENT_MAP.values()))
    .onAreaChange(getComponentEventCallback(this.node, AREA_CHANGE_EVENT_NAME, res => {
      const eventResult: TaroAny = res.eventResult
      this.nodeInfoMap[this.node._nid].areaInfo = eventResult[1]
    }))
  }

  handleTargetChange (id: string) {
    const taro: TaroAny = Current.taro
    const page: TaroAny = taro.getCurrentInstance().page
    const currentPageNode: TaroElement = getPageScrollerOrNode(page.node, page)
    const node: TaroElement | null = currentPageNode.getElementById(id)

    if (!node || !node._instance) return

    if (['BUTTON', 'CHECKBOX', 'RADIO', 'SWITCH', 'INPUT'].includes(node.tagName)) {
      const instance: TaroAny = node._instance
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
        ForEach(this.node.childNodes, (item: TaroElement) => {
          createNode(item)
        }, (item: TaroElement) => item._nid)
      }
      .attrs(getNormalAttributes(this.node))
      .defaultEvent()
      .visibleChangeEvent()
    }
  }
}
