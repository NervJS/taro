import { eventHandler, createTaroEvent, getComponentEventCallback, AREA_CHANGE_EVENT_NAME, VISIBLE_CHANGE_EVENT_NAME } from '@tarojs/runtime'
import { createLazyChildren } from './render'
import { BUTTON_THEME_COLOR } from './utils/constant/style'
import { TOUCH_EVENT_MAP } from './utils/constant/event'
import { getNormalAttributes, shouldBindEvent, getNodeThresholds } from './utils/helper'

import type { TaroAny, TaroEvent, TaroButtonElement, TaroStyleType } from '@tarojs/runtime'

@Extend(Button)
function attrs (style: TaroStyleType) {
  .id(style.id)
  .key(style.id)
  .padding(style.padding)
  .margin(style.margin)
  .width(style.width)
  .height(style.height)
  .constraintSize(style.constraintSize)
  .flexGrow(style.flexGrow)
  .flexShrink(style.flexShrink)
  .flexBasis(style.flexBasis)
  .alignSelf(style.alignSelf)
  .backgroundColor(style.backgroundColor)
  .backgroundImage(style.backgroundImage, style.backgroundRepeat)
  .backgroundImageSize(style.backgroundImageSize)
  .rotate(style.rotate)
  .scale(style.scale)
  .translate(style.translate)
  .transform(style.transform)
  .borderStyle(style.borderStyle)
  .borderWidth(style.borderWidth)
  .borderColor(style.borderColor)
  .borderRadius(style.borderRadius)
  .linearGradient(style.linearGradient)
  .zIndex(style.zIndex)
  .opacity(style.opacity)
  .clip(style.clip)
}

@Extend(Button)
function themeStyles(style: TaroStyleType) {
  .border({
    width: 1,
    color: style.backgroundColor
  })
  .fontColor(style.color)
  .opacity(style.opacity)
  .backgroundColor(style.backgroundColor)
}

function getThemeAttributes (node: TaroButtonElement): TaroStyleType {
  const hmStyle = node.hmStyle
  const _attrs = node._attrs
  const isPlain: boolean = _attrs.plain || false
  const isDisabled: boolean = _attrs.disabled || false
  const type: string = _attrs.type || 'default'

  return {
    opacity: isDisabled ? 0.4 : 1,
    backgroundColor: isPlain ? Color.Transparent : (hmStyle.backgroundColor || BUTTON_THEME_COLOR.get(type).background),
    color: hmStyle.color || BUTTON_THEME_COLOR.get(type).text,
  }
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
  .attrs(getNormalAttributes(node))
  .themeStyles(getThemeAttributes(node))
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
