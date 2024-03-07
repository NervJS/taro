import { Current, eventHandler, getComponentEventCallback, VISIBLE_CHANGE_EVENT_NAME, getPageScrollerOrNode, AREA_CHANGE_EVENT_NAME } from '@tarojs/runtime'

import commonStyleModify from './style'
import { createLazyChildren } from './render'
import { TOUCH_EVENT_MAP } from './utils/constant/event'
import { FlexManager } from './utils/flexManager'
import { getNormalAttributes, shouldBindEvent, getNodeThresholds } from './utils/helper'

import type { TaroLabelElement, TaroElement, TaroAny, TaroRadioElement, TaroCheckboxElement } from '@tarojs/runtime'

function handleTargetChange (id: string) {
  const taro: TaroAny = Current.taro
  const page: TaroAny = taro.getCurrentInstance().page
  const currentPageNode: TaroElement = getPageScrollerOrNode(page.node, page)
  const node: TaroElement | null = currentPageNode.getElementById(id)

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
  @ObjectLink node:TaroLabelElement

  build() {
    if (this.node?.hmStyle?.display !== 'none') {
      if (FlexManager.isFlexNode(this.node) && FlexManager.flexOptions(this.node).direction !== FlexDirection.Column) {
        Row() {
          createLazyChildren(this.node)
        }
        .attributeModifier(commonStyleModify.setNode(this.node))
        .onClick((e: ClickEvent) => {
          const firstChild: TaroElement | null = this.node.childNodes[0] as TaroElement | null
          const id: string = this.node._attrs.for || firstChild?._attrs.id || firstChild?._nid || ''

          handleTargetChange(id)
          eventHandler(e, 'click', this.node)
        })
        .onTouch(shouldBindEvent((e: TouchEvent) => eventHandler(e, TOUCH_EVENT_MAP.get(e.type), this.node), this.node, TOUCH_EVENT_MAP.values()))
        .onAreaChange(getComponentEventCallback(this.node, AREA_CHANGE_EVENT_NAME, (res: TaroAny) => {
          this.node._nodeInfo.areaInfo = res[1]
        }))
        .onVisibleAreaChange(getNodeThresholds(this.node) || [0.0, 1.0], getComponentEventCallback(this.node, VISIBLE_CHANGE_EVENT_NAME))
        .alignItems(FlexManager.flexOptions(this.node).alignItems as VerticalAlign)
        .justifyContent(FlexManager.flexOptions(this.node).justifyContent)
      } else {
        Column() {
          createLazyChildren(this.node)
        }
        .attributeModifier(commonStyleModify.setNode(this.node))
        .onClick((e: ClickEvent) => {
          const firstChild: TaroElement | null = this.node.childNodes[0] as TaroElement | null
          const id: string = this.node._attrs.for || firstChild?._attrs.id || firstChild?._nid || ''

          handleTargetChange(id)
          eventHandler(e, 'click', this.node)
        })
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
