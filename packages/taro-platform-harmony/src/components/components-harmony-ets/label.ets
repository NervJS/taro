import { Current, eventHandler, getComponentEventCallback, VISIBLE_CHANGE_EVENT_NAME, getPageScrollerOrNode, AREA_CHANGE_EVENT_NAME } from '@tarojs/runtime'

import commonStyleModify, { rowModify, columnModify } from './style'

import { TOUCH_EVENT_MAP } from './utils/constant/event'
import { FlexManager } from './utils/flexManager'
import { shouldBindEvent, getNodeThresholds } from './utils/helper'

import type { TaroAny, TaroElement, TaroCheckboxElement, TaroLabelElement, TaroRadioElement } from '@tarojs/runtime'

function handleTargetChange (id: string) {
  const taro: TaroAny = Current.taro
  const page: TaroAny = taro.getCurrentInstance().page
  const currentPageNode: TaroElement = getPageScrollerOrNode(page?.node, page)
  const node: TaroElement | null = currentPageNode?.getElementById(id)

  if (!node) return

  if (['BUTTON', 'CHECKBOX', 'RADIO', 'SWITCH', 'INPUT'].includes(node.tagName)) {
    switch (node.tagName) {
      case 'RADIO':
        const radioNode: TaroRadioElement = node as TaroRadioElement
        if (!radioNode.checked) {
          radioNode.checked = !radioNode.checked
        }
        break
      case 'CHECKBOX':
        const checkBoxNode: TaroCheckboxElement = node as TaroCheckboxElement
        checkBoxNode.checked = !checkBoxNode.checked
        break
      default:
        focusControl.requestFocus(id)
    }
  }
}

@Component
export default struct TaroLabel {
  @Builder customBuilder() {}
  @BuilderParam createLazyChildren: (node: TaroLabelElement, layer?: number) => void = this.customBuilder
  @ObjectLink node: TaroLabelElement
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
      .onClick((e: ClickEvent) => {
        const firstChild: TaroElement | null = this.node.childNodes[0] as TaroElement | null
        const id: string = this.node._attrs.for || firstChild?._attrs.id || firstChild?._nid.toString() || ''

        handleTargetChange(id)
        eventHandler(e, 'click', this.node)
      })
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
      .onClick((e: ClickEvent) => {
        const firstChild: TaroElement | null = this.node.childNodes[0] as TaroElement | null
        const id: string = this.node._attrs.for || firstChild?._attrs.id || firstChild?._nid.toString() || ''

        handleTargetChange(id)
        eventHandler(e, 'click', this.node)
      })
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
      .onClick((e: ClickEvent) => {
        const firstChild: TaroElement | null = this.node.childNodes[0] as TaroElement | null
        const id: string = this.node._attrs.for || firstChild?._attrs.id || firstChild?._nid.toString() || ''

        handleTargetChange(id)
        eventHandler(e, 'click', this.node)
      })
      .onTouch(shouldBindEvent((e: TouchEvent) => { eventHandler(e, TOUCH_EVENT_MAP.get(e.type), this.node) }, this.node, TOUCH_EVENT_MAP.values()))
      .onAreaChange(getComponentEventCallback(this.node, AREA_CHANGE_EVENT_NAME, (res: TaroAny) => {
        this.node._nodeInfo.areaInfo = res[1]
      }))
      .onVisibleAreaChange(getNodeThresholds(this.node) || [0.0, 1.0], getComponentEventCallback(this.node, VISIBLE_CHANGE_EVENT_NAME))
    }
  }
}
