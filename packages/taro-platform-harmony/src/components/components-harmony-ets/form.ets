import { AREA_CHANGE_EVENT_NAME, eventHandler, getComponentEventCallback, VISIBLE_CHANGE_EVENT_NAME } from '@tarojs/runtime'

import commonStyleModify, { rowModify, columnModify } from './style'

import { TOUCH_EVENT_MAP } from './utils/constant/event'
import { FlexManager } from './utils/flexManager'
import { shouldBindEvent, getNodeThresholds } from './utils/helper'

import type { TaroAny, TaroFormElement } from '@tarojs/runtime'

@Component
export default struct TaroForm {
  @Builder customBuilder() {}
  @BuilderParam createLazyChildren: (node: TaroFormElement, layer?: number) => void = this.customBuilder
  @ObjectLink node: TaroFormElement

  @State overwriteStyle: Record<string, TaroAny> = {}

  aboutToAppear(): void {
    if (this.node) {
      this.node._instance = this
    }
  }

  build() {
    if (FlexManager.useFlexLayout(this.node)) {
      Flex(FlexManager.flexOptions(this.node)) {
        this.createLazyChildren(this.node, 0)
      }
      .attributeModifier(commonStyleModify.setNode(this.node).setAnimationStyle(this.overwriteStyle))
      .onClick(shouldBindEvent((e: ClickEvent) => { eventHandler(e, 'click', this.node) }, this.node, ['click']))
      .onTouch(shouldBindEvent((e: TouchEvent) => { eventHandler(e, TOUCH_EVENT_MAP.get(e.type), this.node) }, this.node, TOUCH_EVENT_MAP.values()))
      .onAreaChange(getComponentEventCallback(this.node, AREA_CHANGE_EVENT_NAME, (res: TaroAny) => {
        this.node._nodeInfo.areaInfo = res[1]
      }))
      .onVisibleAreaChange(getNodeThresholds(this.node) || [0.0, 1.0], getComponentEventCallback(this.node, VISIBLE_CHANGE_EVENT_NAME))
    } else if (FlexManager.isFlexNode(this.node) && FlexManager.direction(this.node) !== FlexDirection.Column) {
      Row() {
        this.createLazyChildren(this.node, 0)
      }
      .attributeModifier(rowModify.setNode(this.node).setAnimationStyle(this.overwriteStyle))
      .onClick(shouldBindEvent((e: ClickEvent) => { eventHandler(e, 'click', this.node) }, this.node, ['click']))
      .onTouch(shouldBindEvent((e: TouchEvent) => { eventHandler(e, TOUCH_EVENT_MAP.get(e.type), this.node) }, this.node, TOUCH_EVENT_MAP.values()))
      .onAreaChange(getComponentEventCallback(this.node, AREA_CHANGE_EVENT_NAME, (res: TaroAny) => {
        this.node._nodeInfo.areaInfo = res[1]
      }))
      .onVisibleAreaChange(getNodeThresholds(this.node) || [0.0, 1.0], getComponentEventCallback(this.node, VISIBLE_CHANGE_EVENT_NAME))
    } else {
      Column() {
        this.createLazyChildren(this.node, 0)
      }
      .attributeModifier(columnModify.setNode(this.node).setAnimationStyle(this.overwriteStyle))
      .onClick(shouldBindEvent((e: ClickEvent) => { eventHandler(e, 'click', this.node) }, this.node, ['click']))
      .onTouch(shouldBindEvent((e: TouchEvent) => { eventHandler(e, TOUCH_EVENT_MAP.get(e.type), this.node) }, this.node, TOUCH_EVENT_MAP.values()))
      .onAreaChange(getComponentEventCallback(this.node, AREA_CHANGE_EVENT_NAME, (res: TaroAny) => {
        this.node._nodeInfo.areaInfo = res[1]
      }))
      .onVisibleAreaChange(getNodeThresholds(this.node) || [0.0, 1.0], getComponentEventCallback(this.node, VISIBLE_CHANGE_EVENT_NAME))
    }
  }
}
