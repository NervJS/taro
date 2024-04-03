import { eventHandler, getComponentEventCallback, AREA_CHANGE_EVENT_NAME, VISIBLE_CHANGE_EVENT_NAME } from '@tarojs/runtime'

import commonStyleModify from './style'
import { shouldBindEvent, getNodeThresholds } from './utils/helper'

import type { TaroImageElement, TaroAny } from '@tarojs/runtime'

export function getImageMode (mode: string): ImageFit {
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
  @Builder customBuilder() {}
  @BuilderParam createLazyChildren: (node: TaroImageElement) => void = this.customBuilder
  @ObjectLink node: TaroImageElement
  @State overwriteStyle: Record<string, TaroAny> = {}

  aboutToAppear(): void {
    if (this.node) {
      this.node._instance = this
    }
  }

  build() {
    if (this.node?.hmStyle?.display !== 'none') {
      Image(this.node.getAttribute('src'))
        .onClick(shouldBindEvent((e: ClickEvent) => eventHandler(e, 'click', this.node), this.node, ['click']))
        .onAreaChange(getComponentEventCallback(this.node, AREA_CHANGE_EVENT_NAME, (res: TaroAny) => {
          this.node._nodeInfo.areaInfo = res[1]
        }))
        .objectFit(getImageMode(this.node.getAttribute('mode')))
        .attributeModifier(commonStyleModify.setNode(this.node).setAnimationStyle(this.overwriteStyle))
        .onComplete(e => eventHandler(e, 'complete', this.node))
        .onVisibleAreaChange(getNodeThresholds(this.node) || [0.0, 1.0], getComponentEventCallback(this.node, VISIBLE_CHANGE_EVENT_NAME))
    }
  }
}
