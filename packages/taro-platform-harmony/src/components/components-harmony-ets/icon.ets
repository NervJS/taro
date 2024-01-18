import { eventHandler, convertNumber2VP, getComponentEventCallback, AREA_CHANGE_EVENT_NAME, VISIBLE_CHANGE_EVENT_NAME, convertNumber2PX } from '@tarojs/runtime'

import commonStyleModify from './style'
import { getNormalAttributes, shouldBindEvent, getNodeThresholds } from './utils/helper'

import type { TaroIconElement, TaroAny } from '@tarojs/runtime'

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
    .attributeModifier(commonStyleModify.setNode(node))
    .size({
      width: convertNumber2VP(Number(node._attrs.size) || 23),
      height: convertNumber2VP(Number(node._attrs.size) || 23),
    })
    .width(getNormalAttributes(node).width || convertNumber2PX(23))
    .height(getNormalAttributes(node).height || convertNumber2PX(23))
    .onComplete(e => eventHandler(e, 'complete', node))
    .onClick(shouldBindEvent((e: ClickEvent) => eventHandler(e, 'click', node), node, ['click']))
    .onVisibleAreaChange(getNodeThresholds(node) || [0.0, 1.0], getComponentEventCallback(node, VISIBLE_CHANGE_EVENT_NAME))
    .onAreaChange(getComponentEventCallback(node, AREA_CHANGE_EVENT_NAME, (res: TaroAny) => {
      node._nodeInfo.areaInfo = res[1]
    }))
}
