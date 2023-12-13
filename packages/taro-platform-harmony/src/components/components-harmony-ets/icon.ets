import { eventHandler, convertNumber2VP, getComponentEventCallback, AREA_CHANGE_EVENT_NAME, VISIBLE_CHANGE_EVENT_NAME } from '@tarojs/runtime'

import { ICON_SVG_MAP } from './utils/constant/icon'
import { getNormalAttributes, shouldBindEvent, getNodeThresholds } from './utils/helper'

import type { TaroIconElement, TaroAny, TaroStyleType } from '@tarojs/runtime'

@Extend(Image)
function attrs (style: TaroStyleType) {
  .id(style.id)
  .key(style.id)
  .padding(style.padding)
  .margin(style.margin)
  .width(style.width || convertNumber2VP(23))
  .height(style.height || convertNumber2VP(23))
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

function getIconData (node: TaroIconElement) {
  if (!node || !node._attrs) return null

  const type: string = node._attrs.type
  // TODO：等待鸿蒙支持 base64 格式的 svg 图片，或者工程化支持图片资源的迁移
  return ICON_SVG_MAP.get(type) || null
}

@Builder
export default function TaroIcon (node: TaroIconElement) {
  Image(getIconData(node))
    .objectFit(ImageFit.Contain)
    .fillColor(node._attrs.color)
    .attrs(getNormalAttributes(node))
    .onComplete(e => eventHandler(e, 'complete', node))
    .onClick(shouldBindEvent((e: ClickEvent) => eventHandler(e, 'click', node), node, ['click']))
    .onVisibleAreaChange(getNodeThresholds(node) || [0.0, 1.0], getComponentEventCallback(node, VISIBLE_CHANGE_EVENT_NAME))
    .onAreaChange(getComponentEventCallback(node, AREA_CHANGE_EVENT_NAME, (res: TaroAny) => {
      node._nodeInfo.areaInfo = res
    }))
}
