import { eventHandler, createTaroEvent, convertNumber2VP, getComponentEventCallback, AREA_CHANGE_EVENT_NAME, VISIBLE_CHANGE_EVENT_NAME } from '@tarojs/runtime'
import { createLazyChildren } from './render'
import { BUTTON_THEME_COLOR } from './utils/constant/style'
import { TOUCH_EVENT_MAP } from './utils/constant/event'
import { getNormalAttributes, shouldBindEvent, getNodeThresholds } from './utils/helper'

import type { TaroAny, TaroEvent, TaroButtonElement, TaroStyleType } from '@tarojs/runtime'

@Extend(Button)
function attrs (style: TaroStyleType) {
  .id(style.id)
  .key(style.id)
  .flexGrow(style.flexGrow)
  .flexShrink(style.flexShrink)
  .flexBasis(style.flexBasis)
  .alignSelf(style.alignSelf)
  .padding({
    top: style.paddingTop,
    right: style.paddingRight || 10,
    bottom: style.paddingBottom,
    left: style.paddingLeft || 10
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
  .backgroundImage(style.backgroundImage?.src, style.backgroundRepeat)
  .backgroundImageSize(style.backgroundSize)
  .backgroundImagePosition(style.backgroundPosition)
  .borderStyle({
    top: style.borderTopStyle,
    right: style.borderRightStyle,
    bottom: style.borderBottomStyle,
    left: style.borderLeftStyle
  })
  .zIndex(style.zIndex)
  .linearGradient(style.linearGradient)
  .clip(style.overflow)
  .rotate({ centerX: style.transformOrigin?.x, centerY: style.transformOrigin?.y, angle: 0 })
  .scale({ centerX: style.transformOrigin?.x, centerY: style.transformOrigin?.y })
  .transform(style.transform)
}

@Extend(Button)
function themeStyles(style: TaroStyleType) {
  .fontColor(style.color)
  .opacity(style.opacity)
  .borderColor(style.borderColor)
  .borderWidth(style.borderWidth)
  .borderRadius(style.borderRadius)
  .backgroundColor(style.backgroundColor)
}

export function getButtonColor (node: TaroButtonElement, color: ResourceColor) {
  const _attrs = node._attrs
  const isDisabled: boolean = _attrs.disabled || false
  const isPlain: boolean = _attrs.plain || false
  const type: string = _attrs.type || 'default'

  if (isDisabled && isPlain) {
    return Color.Black
  }

  if (isPlain) {
    return BUTTON_THEME_COLOR.get(type).plainText
  }

  return color
}

function getThemeAttributes (node: TaroButtonElement): TaroStyleType {
  const hmStyle = node.hmStyle
  const _attrs = node._attrs
  const isPlain: boolean = _attrs.plain || false
  const isDisabled: boolean = _attrs.disabled || false
  const type: string = _attrs.type || 'default'

  return {
    borderColor: {
      top: hmStyle.borderTopColor || getButtonColor(node, BUTTON_THEME_COLOR.get(type).background),
      right: hmStyle.borderRightColor || getButtonColor(node, BUTTON_THEME_COLOR.get(type).background),
      bottom: hmStyle.borderBottomColor || getButtonColor(node, BUTTON_THEME_COLOR.get(type).background),
      left: hmStyle.borderLeftColor || getButtonColor(node, BUTTON_THEME_COLOR.get(type).background)
    },
    borderWidth: {
      top: hmStyle.borderTopWidth || 1,
      right: hmStyle.borderRightWidth || 1,
      bottom: hmStyle.borderBottomWidth || 1,
      left: hmStyle.borderLeftWidth || 1
    },
    borderRadius: {
      topLeft: hmStyle.borderTopLeftRadius || convertNumber2VP(10),
      topRight: hmStyle.borderTopRightRadius || convertNumber2VP(10),
      bottomLeft: hmStyle.borderBottomLeftRadius || convertNumber2VP(10),
      bottomRight: hmStyle.borderBottomRightRadius || convertNumber2VP(10)
    },
    opacity: isDisabled ? 0.4 : hmStyle.opacity,
    backgroundColor: isPlain ? Color.Transparent : (hmStyle.backgroundColor || BUTTON_THEME_COLOR.get(type).background),
    color: hmStyle.color || getButtonColor(node, BUTTON_THEME_COLOR.get(type).text),
  }
}

function getButtonWidth (node: TaroButtonElement) {
  const isMini = node._attrs.size === 'mini'

  return isMini ? convertNumber2VP(120) : '100%'
}

function getButtonHeight (node: TaroButtonElement) {
  const isMini = node._attrs.size === 'mini'

  return isMini ? convertNumber2VP(60) : convertNumber2VP(92)
}

function getButtonMinWidth (node: TaroButtonElement): string | number | undefined {
  if (node.hmStyle.width) {
    return undefined
  }

  return getButtonWidth(node)
}

function getButtonMinHeight (node: TaroButtonElement): string | number | undefined {
  if (node.hmStyle.height) {
    return undefined
  }

  return getButtonHeight(node)
}

@Builder
export default function TaroButton (node: TaroButtonElement) {
  Button({ stateEffect: !node._attrs.disabled }) {
    Row() {
      if (node._attrs.loading) {
        LoadingProgress()
        .width(20).height(20)
        .color(getThemeAttributes(node).color)
      }
      createLazyChildren(node)
    }
  }
  .themeStyles(getThemeAttributes(node))
  .attrs(getNormalAttributes(node))
  .constraintSize({
    minWidth: node.hmStyle?.minWidth || getButtonMinWidth(node),
    minHeight: node.hmStyle?.minHeight || getButtonMinHeight(node),
    maxWidth: node.hmStyle?.maxWidth,
    maxHeight: node.hmStyle?.maxHeight,
  })
  .type(ButtonType.Normal)
  .onClick((e: ClickEvent) => {
    if (['submit', 'reset'].includes(node._attrs.formType)) {
      const eventName = node._attrs.formType + '-btn'
      const event: TaroEvent = createTaroEvent(eventName, {}, node)
      eventHandler(event, eventName, node)
    }
    eventHandler(e, 'click', node)
  })
  .onTouch(shouldBindEvent((e: TouchEvent) => eventHandler(e, TOUCH_EVENT_MAP.get(e.type), node), node, TOUCH_EVENT_MAP.values()))
  .onAreaChange(getComponentEventCallback(node, AREA_CHANGE_EVENT_NAME, (res: TaroAny) => {
    node._nodeInfo.areaInfo = res[1]
  }))
  .onVisibleAreaChange(getNodeThresholds(node) || [0.0, 1.0], getComponentEventCallback(node, VISIBLE_CHANGE_EVENT_NAME))
}
