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
  .width(style.width)
  .height(style.height)
  .padding({
    top: style.padding?.top,
    left: style.padding?.left || 10,
    right: style.padding?.right || 10,
    bottom: style.padding?.bottom,
  })
  .margin(style.margin)
  .flexGrow(style.flexGrow)
  .flexShrink(style.flexShrink)
  .flexBasis(style.flexBasis)
  .alignSelf(style.alignSelf)
  .backgroundImage(style.backgroundImage, style.backgroundRepeat)
  .backgroundImageSize(style.backgroundImageSize)
  .backgroundImagePosition(style.backgroundImagePosition)
  .rotate(style.rotate)
  .scale(style.scale)
  .translate(style.translate)
  .transform(style.transform)
  .borderStyle(style.borderStyle)
  .linearGradient(style.linearGradient)
  .zIndex(style.zIndex)
  .clip(style.clip)
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
    borderColor: hmStyle.borderColor || getButtonColor(node, BUTTON_THEME_COLOR.get(type).background),
    borderWidth: hmStyle.borderWidth || 1,
    borderRadius: hmStyle.borderRadius || convertNumber2VP(10),
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
    minWidth: node.hmStyle?.constraintSize?.minWidth || getButtonMinWidth(node),
    minHeight: node.hmStyle?.constraintSize?.minHeight || getButtonMinHeight(node),
    maxWidth: node.hmStyle?.constraintSize?.maxWidth,
    maxHeight: node.hmStyle?.constraintSize?.maxHeight,
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
