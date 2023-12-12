import { eventHandler, getComponentEventCallback, AREA_CHANGE_EVENT_NAME, VISIBLE_CHANGE_EVENT_NAME, TaroAny } from '@tarojs/runtime'

import { createNode } from './render'
import { TOUCH_EVENT_MAP } from './utils/constant/event'
import { FlexManager } from './utils/FlexManager'
import { getNodeThresholds, getNormalAttributes, shouldBindEvent } from './utils/helper'

import type { TaroViewElement, TaroElement, TaroImageElement } from '@tarojs/runtime/ets/element'
import type { TaroStyleType } from './type'

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

@Builder
export default function TaroView (node: TaroViewElement) {
  Flex(FlexManager.flexOptions(node as TaroAny)) {
    createNode(node)
  }
  .attrs(getNormalAttributes(node as TaroAny))
  .onClick(shouldBindEvent((e: ClickEvent) => eventHandler(e, 'click', node as TaroAny), node as TaroAny, ['click']))
  .onTouch(shouldBindEvent((e: TouchEvent) => eventHandler(e, TOUCH_EVENT_MAP.get(e.type), node as TaroAny), node as TaroAny, TOUCH_EVENT_MAP.values()))
  .onAreaChange(getComponentEventCallback(node as TaroAny, AREA_CHANGE_EVENT_NAME, res => {
    const eventResult: TaroAny = res.eventResult
    const n: TaroAny = node
    n.areaInfo = eventResult[1]
  }))
  .onVisibleAreaChange(getNodeThresholds(node as TaroAny) || [0.0, 1.0], getComponentEventCallback(node as TaroAny, VISIBLE_CHANGE_EVENT_NAME))
}

// @Component
// struct TaroViewOld {
//   nodeInfoMap: TaroAny = {}
//
//   @Styles visibleChangeEvent () {
//     .onVisibleAreaChange(getNodeThresholds(this.node) || [0.0, 1.0], getComponentEventCallback(this.node, VISIBLE_CHANGE_EVENT_NAME))
//   }
//
//   @ObjectLink node: TaroViewElement
//
//   aboutToAppear () {
//     initComponentNodeInfo(this, this.node)
//     bindInstanceToNode(this.node, this)
//     // 绑定动画
//     bindAnimation(this.node)
//   }
//
//   @Styles defaultEvent () {
//     .onClick(shouldBindEvent((e: ClickEvent) => eventHandler(e, 'click', this.node), this.node, ['click']))
//     .onTouch(shouldBindEvent((e: TouchEvent) => eventHandler(e, TOUCH_EVENT_MAP.get(e.type), this.node), this.node, TOUCH_EVENT_MAP.values()))
//     .onAreaChange(getComponentEventCallback(this.node, AREA_CHANGE_EVENT_NAME, res => {
//       const eventResult: TaroAny = res.eventResult
//       this.nodeInfoMap[this.node._nid].areaInfo = eventResult[1]
//     }))
//   }
//   build() {
//     TaroComponentWrapper({ node: this.node }) {
//       Flex(FlexManager.flexOptions(this.node)) {
//         ForEach(this.node.childNodes, (item: TaroElement) => {
//           createNode(item)
//         }, (item: TaroElement) => item._nid)
//       }
//       .attrs(getNormalAttributes(this.node))
//       .defaultEvent()
//       .visibleChangeEvent()
//     }
//   }
// }
