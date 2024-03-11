import { AREA_CHANGE_EVENT_NAME, eventHandler, getComponentEventCallback, VISIBLE_CHANGE_EVENT_NAME } from '@tarojs/runtime'

import commonStyleModify from './style'
import { TOUCH_EVENT_MAP } from './utils/constant/event'
import { FlexManager } from './utils/flexManager'
import { shouldBindEvent, getNodeThresholds } from './utils/helper'

import type { TaroAny, TaroFormElement } from '@tarojs/runtime'

@Component
export default struct TaroForm {
  @Builder customBuilder() {}
  @BuilderParam createLazyChildren: (node: TaroFormElement) => void = this.customBuilder
  @ObjectLink node: TaroFormElement

  build() {
    if (this.node?.hmStyle?.display !== 'none') {
      if (FlexManager.isFlexNode(this.node) && FlexManager.flexOptions(this.node).direction !== FlexDirection.Column) {
        Row() {
          this.createLazyChildren(this.node)
        }
        .attributeModifier(commonStyleModify.setNode(this.node))
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
          this.createLazyChildren(this.node)
        }
        .attributeModifier(commonStyleModify.setNode(this.node))
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
