import { eventHandler, getComponentEventCallback, AREA_CHANGE_EVENT_NAME, VISIBLE_CHANGE_EVENT_NAME } from '@tarojs/runtime'

import commonStyleModify from './style'
import { getNormalAttributes, shouldBindEvent, getNodeThresholds } from './utils/helper'

import type { TaroImageElement, TaroAny, TaroStyleType } from '@tarojs/runtime'

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

@Component
export default struct TaroImage {
  @ObjectLink node: TaroImageElement

  build() {
    Image(this.node.getAttribute('src'))
      .onClick(shouldBindEvent((e: ClickEvent) => eventHandler(e, 'click', this.node), this.node, ['click']))
      .onAreaChange(getComponentEventCallback(this.node, AREA_CHANGE_EVENT_NAME, (res: TaroAny) => {
        this.node._nodeInfo.areaInfo = res[1]
      }))
      .objectFit(getImageMode(this.node.getAttribute('mode')))
      .attributeModifier(commonStyleModify.setNode(this.node))
      .onComplete(e => eventHandler(e, 'complete', this.node))
      .onVisibleAreaChange(getNodeThresholds(this.node) || [0.0, 1.0], getComponentEventCallback(this.node, VISIBLE_CHANGE_EVENT_NAME))
  }
}