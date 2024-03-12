import { eventHandler, getComponentEventCallback, AREA_CHANGE_EVENT_NAME, VISIBLE_CHANGE_EVENT_NAME } from '@tarojs/runtime'

import { rowModify, columnModify } from './style'
import PseduoChildren from './pseudo'
import { TOUCH_EVENT_MAP } from './utils/constant/event'
import { FlexManager } from './utils/flexManager'
import { getNodeThresholds, shouldBindEvent } from './utils/helper'

import type { TaroViewElement, TaroAny } from '@tarojs/runtime'

@Component
export default struct TaroView {
  @Builder customBuilder() {}
  @BuilderParam createLazyChildren: (node: TaroViewElement) => void = this.customBuilder
  @ObjectLink node: TaroViewElement

  build () {
    if (this.node.hmStyle?.display !== 'none') {
      if (FlexManager.isFlexNode(this.node) && FlexManager.flexOptions(this.node).direction !== FlexDirection.Column) {
        Row() {
          if (this.node._pseudo_before || this.node._pseudo_after) {
            PseduoChildren({ node: this.node })
          } else {
            this.createLazyChildren(this.node)
          }
        }
        .attributeModifier(rowModify.setNode(this.node))
        .onClick(shouldBindEvent((e: ClickEvent) => eventHandler(e, 'click', this.node), this.node, ['click']))
        .onTouch(shouldBindEvent((e: TouchEvent) => eventHandler(e, TOUCH_EVENT_MAP.get(e.type), this.node), this.node, TOUCH_EVENT_MAP.values()))
        .onAreaChange(getComponentEventCallback(this.node, AREA_CHANGE_EVENT_NAME, (res: TaroAny) => {
          this.node._nodeInfo.areaInfo = res[1]
        }))
        .onVisibleAreaChange(getNodeThresholds(this.node) || [0.0, 1.0], getComponentEventCallback(this.node, VISIBLE_CHANGE_EVENT_NAME))
        .alignItems(FlexManager.flexOptions(this.node).alignItems as VerticalAlign)
        .justifyContent(FlexManager.flexOptions(this.node).justifyContent)
      } else {
        Column() {
          if (this.node._pseudo_before || this.node._pseudo_after) {
            PseduoChildren({ node: this.node })
          } else {
            this.createLazyChildren(this.node)
          }
        }
        .attributeModifier(columnModify.setNode(this.node))
        .onClick(shouldBindEvent((e: ClickEvent) => eventHandler(e, 'click', this.node), this.node, ['click']))
        .onTouch(shouldBindEvent((e: TouchEvent) => eventHandler(e, TOUCH_EVENT_MAP.get(e.type), this.node), this.node, TOUCH_EVENT_MAP.values()))
        .onAreaChange(getComponentEventCallback(this.node, AREA_CHANGE_EVENT_NAME, (res: TaroAny) => {
          this.node._nodeInfo.areaInfo = res[1]
        }))
        .onVisibleAreaChange(getNodeThresholds(this.node) || [0.0, 1.0], getComponentEventCallback(this.node, VISIBLE_CHANGE_EVENT_NAME))
        .alignItems(FlexManager.flexOptions(this.node).alignItems as HorizontalAlign)
        .justifyContent(FlexManager.flexOptions(this.node).justifyContent)
      }
    }
  }
}
