import { Current, eventHandler, getComponentEventCallback, VISIBLE_CHANGE_EVENT_NAME, getPageScrollerOrNode, AREA_CHANGE_EVENT_NAME } from '@tarojs/runtime'

import commonStyleModify from './style'
import { createLazyChildren } from './render'
import { TOUCH_EVENT_MAP } from './utils/constant/event'
import { FlexManager } from './utils/FlexManager'
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

@Builder
export default function TaroLabel (node: TaroLabelElement) {
  if (FlexManager.isFlexNode(node) && FlexManager.flexOptions(node).direction !== FlexDirection.Column) {
    Row() {
      createLazyChildren(node)
    }
    .attributeModifier(commonStyleModify.setNode(node))
    .onClick((e: ClickEvent) => {
      const firstChild: TaroElement | null = node.childNodes[0] as TaroElement | null
      const id: string = node._attrs.for || firstChild?._attrs.id || firstChild?._nid || ''
  
      handleTargetChange(id)
      eventHandler(e, 'click', node)
    })
    .onTouch(shouldBindEvent((e: TouchEvent) => eventHandler(e, TOUCH_EVENT_MAP.get(e.type), node), node, TOUCH_EVENT_MAP.values()))
    .onAreaChange(getComponentEventCallback(node, AREA_CHANGE_EVENT_NAME, (res: TaroAny) => {
      node._nodeInfo.areaInfo = res[1]
    }))
    .onVisibleAreaChange(getNodeThresholds(node) || [0.0, 1.0], getComponentEventCallback(node, VISIBLE_CHANGE_EVENT_NAME))
    .alignItems(FlexManager.flexOptions(node).alignItems as VerticalAlign)
    .justifyContent(FlexManager.flexOptions(node).justifyContent)
  } else {
    Column() {
      createLazyChildren(node)
    }
    .attributeModifier(commonStyleModify.setNode(node))
    .onClick((e: ClickEvent) => {
      const firstChild: TaroElement | null = node.childNodes[0] as TaroElement | null
      const id: string = node._attrs.for || firstChild?._attrs.id || firstChild?._nid || ''
  
      handleTargetChange(id)
      eventHandler(e, 'click', node)
    })
    .onTouch(shouldBindEvent((e: TouchEvent) => eventHandler(e, TOUCH_EVENT_MAP.get(e.type), node), node, TOUCH_EVENT_MAP.values()))
    .onAreaChange(getComponentEventCallback(node, AREA_CHANGE_EVENT_NAME, (res: TaroAny) => {
      node._nodeInfo.areaInfo = res[1]
    }))
    .onVisibleAreaChange(getNodeThresholds(node) || [0.0, 1.0], getComponentEventCallback(node, VISIBLE_CHANGE_EVENT_NAME))
    .alignItems(FlexManager.flexOptions(node).alignItems as HorizontalAlign)
    .justifyContent(FlexManager.flexOptions(node).justifyContent)
  }
}
