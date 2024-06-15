import { eventHandler, convertNumber2VP, getComponentEventCallback, AREA_CHANGE_EVENT_NAME, VISIBLE_CHANGE_EVENT_NAME, convertNumber2PX } from '@tarojs/runtime'

import commonStyleModify from './style'
import { shouldBindEvent, getNodeThresholds } from './utils/helper'

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

@Component
export default struct TaroIcon {
  @Builder customBuilder() {}
  @BuilderParam createLazyChildren: (node: TaroIconElement, layer?: number) => void = this.customBuilder
  @ObjectLink node: TaroIconElement
  @State overwriteStyle: Record<string, TaroAny> = {}

  aboutToAppear(): void {
    if (this.node) {
      this.node._instance = this
    }
  }

  build() {
    Image(getIconData(this.node))
      .objectFit(ImageFit.Contain)
      .fillColor(this.node._attrs.color || ICON_COLOR_MAP[this.node._attrs.type] || Color.Black)
      .attributeModifier(commonStyleModify.setNode(this.node).setAnimationStyle(this.overwriteStyle))
      .size({
        width: Number(this.node._attrs.size) || 23,
        height: Number(this.node._attrs.size) || 23
      })
      .onComplete(e => { eventHandler(e, 'complete', this.node) })
      .onClick(shouldBindEvent((e: ClickEvent) => { eventHandler(e, 'click', this.node) }, this.node, ['click']))
      .onVisibleAreaChange(getNodeThresholds(this.node) || [0.0, 1.0], getComponentEventCallback(this.node, VISIBLE_CHANGE_EVENT_NAME))
      .onAreaChange(getComponentEventCallback(this.node, AREA_CHANGE_EVENT_NAME, (res: TaroAny) => {
        this.node._nodeInfo.areaInfo = res[1]
      }))
  }
}

