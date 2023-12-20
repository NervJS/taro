import { eventHandler, convertNumber2VP, getComponentEventCallback, AREA_CHANGE_EVENT_NAME, VISIBLE_CHANGE_EVENT_NAME } from '@tarojs/runtime'

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

const ICON_COLOR_MAP: TaroAny = {
  success: Color.Green,
  success_no_circle: Color.Green,
  info: Color.Blue,
  warn: Color.Red,
  waiting: Color.Blue,
  cancel: Color.Red,
  download: Color.Gray,
  search: Color.Gray,
  clear: Color.Gray,
  info_circle: Color.Blue,
  circle: Color.Gray
}

function getIconData (node: TaroIconElement): Resource | null {
  switch (node._attrs.type) {
    case 'success':
      return $r('app.media.success')
    case 'success_no_circle':
      return $r('app.media.success_no_circle')
    case 'info':
      return $r('app.media.info')
    case 'warn':
      return $r('app.media.warn')
    case 'waiting':
      return $r('app.media.waiting')
    case 'cancel':
      return $r('app.media.cancel')
    case 'download':
      return $r('app.media.download')
    case 'search':
      return $r('app.media.search')
    case 'clear':
      return $r('app.media.clear')
    case 'info_circle':
      return $r('app.media.info_circle')
    case 'circle':
      return $r('app.media.circle')
    default:
      return null
  }
}

@Builder
export default function TaroIcon (node: TaroIconElement) {
  Image(getIconData(node))
    .objectFit(ImageFit.Contain)
    .fillColor(node._attrs.color || ICON_COLOR_MAP[node._attrs.type] || Color.Black)
    .attrs(getNormalAttributes(node))
    .size({
      width: convertNumber2VP(Number(node._attrs.size) || 23),
      height: convertNumber2VP(Number(node._attrs.size) || 23),
    })
    .onComplete(e => eventHandler(e, 'complete', node))
    .onClick(shouldBindEvent((e: ClickEvent) => eventHandler(e, 'click', node), node, ['click']))
    .onVisibleAreaChange(getNodeThresholds(node) || [0.0, 1.0], getComponentEventCallback(node, VISIBLE_CHANGE_EVENT_NAME))
    .onAreaChange(getComponentEventCallback(node, AREA_CHANGE_EVENT_NAME, (res: TaroAny) => {
      node._nodeInfo.areaInfo = res[1]
    }))
}
