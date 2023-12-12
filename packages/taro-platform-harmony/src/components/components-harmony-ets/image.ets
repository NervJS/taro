import { eventHandler, getComponentEventCallback, AREA_CHANGE_EVENT_NAME, VISIBLE_CHANGE_EVENT_NAME, TaroAny } from '@tarojs/runtime'

import { getNormalAttributes, shouldBindEvent, getNodeThresholds } from './utils/helper'

import type { TaroImageElement } from '@tarojs/runtime'
import type { TaroStyleType } from './type'

@Extend(Image)
function attrs (style: TaroStyleType) {
  .id(style.id)
  .key(style.id)
  .padding(style.padding)
  .margin(style.margin)
  .width(style.width)
  .height(style.height)
  .backgroundColor(style.backgroundColor)
  .constraintSize(style.constraintSize)
  .flexGrow(style.flexGrow)
  .flexShrink(style.flexShrink)
  .flexBasis(style.flexBasis)
  .alignSelf(style.alignSelf)
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

function getImageMode (mode: string): ImageFit {
  switch (mode) {
    case 'aspectFit': return ImageFit.Contain
    case 'aspectFill': return ImageFit.Cover
    case 'scaleToFill': return ImageFit.Fill
    case 'widthFix': return ImageFit.Auto
    case 'heightFix': return ImageFit.Auto
    default: return ImageFit.Contain
  }
}

@Builder
export default function TaroImage (node: TaroImageElement) {
  Image(node.getAttribute('src'))
    .onClick(shouldBindEvent((e: ClickEvent) => eventHandler(e, 'click', node as TaroAny), node as TaroAny, ['click']))
    .onAreaChange(getComponentEventCallback(node as TaroAny, AREA_CHANGE_EVENT_NAME, (res: TaroAny) => {
      const eventResult: TaroAny = res.eventResult

      node._nodeInfo.areaInfo = eventResult[1]
    }))
    .objectFit(getImageMode(node.getAttribute('mode')))
    .attrs(getNormalAttributes(node as TaroAny))
    .onComplete(e => eventHandler(e, 'complete', node as TaroAny))
    .onVisibleAreaChange(getNodeThresholds(node as TaroAny) || [0.0, 1.0], getComponentEventCallback(node as TaroAny, VISIBLE_CHANGE_EVENT_NAME))
}

// @Component
// export default struct TaroImage {
//   nodeInfoMap: TaroAny = {}
//
//   @Styles visibleChangeEvent () {
//     .onVisibleAreaChange(getNodeThresholds(this.node) || [0.0, 1.0], getComponentEventCallback(this.node, VISIBLE_CHANGE_EVENT_NAME))
//   }
//
//   @ObjectLink node: TaroImageElement
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
//     .onAreaChange(getComponentEventCallback(this.node, AREA_CHANGE_EVENT_NAME, res => {
//       const eventResult: TaroAny = res.eventResult
//       this.nodeInfoMap[this.node._nid].areaInfo = eventResult[1]
//     }))
//   }
//
//   build() {
//     TaroComponentWrapper({ node: this.node }) {
//       Image(this.node.getAttribute('src'))
//       .defaultEvent()
//       .objectFit(getImageMode(this.node.getAttribute('mode')))
//       .attrs(getNormalAttributes(this.node))
//       .onComplete(e => eventHandler(e, 'complete', this.node))
//       .visibleChangeEvent()
//     }
//   }
// }
