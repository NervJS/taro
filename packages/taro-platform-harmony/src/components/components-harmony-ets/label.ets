import { Current, eventHandler, getComponentEventCallback, VISIBLE_CHANGE_EVENT_NAME, getPageScrollerOrNode, AREA_CHANGE_EVENT_NAME } from '@tarojs/runtime'

import { createLazyChildren } from './render'
import { TOUCH_EVENT_MAP } from './utils/constant/event'
import { FlexManager } from './utils/FlexManager'
import { getNormalAttributes, shouldBindEvent, getNodeThresholds } from './utils/helper'

import type { TaroStyleType, TaroLabelElement, TaroElement, TaroAny, TaroRadioElement, TaroCheckboxElement } from '@tarojs/runtime'

@Extend(Flex)
function attrs (style: TaroStyleType) {
  .id(style.id)
  .key(style.id)
  .flexGrow(style.flexGrow)
  .flexShrink(style.flexShrink)
  .flexBasis(style.flexBasis)
  .alignSelf(style.alignSelf)
  .padding({
    top: style.paddingTop,
    right: style.paddingRight,
    bottom: style.paddingBottom,
    left: style.paddingLeft
  })
  .margin({
    top: style.marginTop,
    right: style.marginRight,
    bottom: style.marginBottom,
    left: style.marginLeft
  })
  .width(style.width)
  .height(style.height)
  .constraintSize({
    minWidth: style.minWidth,
    maxWidth: style.maxWidth,
    minHeight: style.minHeight,
    maxHeight: style.maxHeight
  })
  .backgroundColor(style.backgroundColor)
  .backgroundImage(style.backgroundImage?.src, style.backgroundRepeat)
  .backgroundImageSize(style.backgroundSize)
  .backgroundImagePosition(style.backgroundPosition)
  .borderStyle({
    top: style.borderTopStyle,
    right: style.borderRightStyle,
    bottom: style.borderBottomStyle,
    left: style.borderLeftStyle
  })
  .borderWidth({
    top: style.borderTopWidth,
    right: style.borderRightWidth,
    bottom: style.borderBottomWidth,
    left: style.borderLeftWidth
  })
  .borderColor({
    top: style.borderTopColor,
    right: style.borderRightColor,
    bottom: style.borderBottomColor,
    left: style.borderLeftColor
  })
  .borderRadius({
    topLeft: style.borderTopLeftRadius,
    topRight: style.borderTopRightRadius,
    bottomLeft: style.borderBottomLeftRadius,
    bottomRight: style.borderBottomRightRadius
  })
  .zIndex(style.zIndex)
  .opacity(style.opacity)
  .linearGradient(style.linearGradient)
  .clip(style.overflow)
  .rotate({ centerX: style.transformOrigin?.x, centerY: style.transformOrigin?.y, angle: 0 })
  .scale({ centerX: style.transformOrigin?.x, centerY: style.transformOrigin?.y })
  .transform(style.transform)
}

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
  Flex(FlexManager.flexOptions(node)) {
    createLazyChildren(node)
  }
  .attrs(getNormalAttributes(node))
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
}
