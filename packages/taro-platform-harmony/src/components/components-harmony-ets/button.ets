import { eventHandler, createTaroEvent, convertNumber2VP, getComponentEventCallback, AREA_CHANGE_EVENT_NAME, VISIBLE_CHANGE_EVENT_NAME } from '@tarojs/runtime'
import commonStyleModify from './style'
import { BUTTON_THEME_COLOR } from './utils/constant/style'
import { TOUCH_EVENT_MAP } from './utils/constant/event'
import { shouldBindEvent, getNodeThresholds } from './utils/helper'

import type { TaroAny, TaroButtonElement, TaroEvent, TaroStyleType } from '@tarojs/runtime'

interface ButtonAttrs {
  disabled?: boolean
}

@Extend(Button)
function attrs(attr: ButtonAttrs) {
  .enabled(!attr.disabled)
}

function getAttributes(node: TaroButtonElement): ButtonAttrs {
  return {
    disabled: node._attrs.disabled || false,
  }
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

function getButtonWidth (node: TaroButtonElement): string | number {
  const isMini = node._attrs.size === 'mini'

  return isMini ? convertNumber2VP(120) : '100%'
}

function getButtonHeight (node: TaroButtonElement): string | number {
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

@Component
export default struct TaroButton {
  @Builder customBuilder() {}
  @BuilderParam createLazyChildren: (node: TaroButtonElement, layer?: number) => void = this.customBuilder
  @ObjectLink node: TaroButtonElement
  @State overwriteStyle: Record<string, TaroAny> = {}

  aboutToAppear(): void {
    if (this.node) {
      this.node._instance = this
    }
  }

  build() {
    Button({ stateEffect: !this.node._attrs.disabled }) {
      if (this.node._attrs.loading) {
        Row() {
          LoadingProgress()
            .width(20).height(20)
            .color(getThemeAttributes(this.node).color)
          this.createLazyChildren(this.node, 0)
        }
      } else {
        this.createLazyChildren(this.node, 0)
      }
    }
    .themeStyles(getThemeAttributes(this.node))
    .attributeModifier(commonStyleModify.setNode(this.node).setAnimationStyle(this.overwriteStyle))
    .attrs(getAttributes(this.node))
    .constraintSize({
      minWidth: this.node.hmStyle?.minWidth || getButtonMinWidth(this.node),
      minHeight: this.node.hmStyle?.minHeight || getButtonMinHeight(this.node),
      maxWidth: this.node.hmStyle?.maxWidth,
      maxHeight: this.node.hmStyle?.maxHeight,
    })
    .type(ButtonType.Normal)
    .onClick((e: ClickEvent) => {
      if (this.node._attrs.formType && ['submit', 'reset'].includes(this.node._attrs.formType)) {
        const eventName = this.node._attrs.formType + '-btn'
        const event: TaroEvent = createTaroEvent(eventName, {}, this.node)
        eventHandler(event, eventName, this.node)
      }
      eventHandler(e, 'click', this.node)
    })
    .onTouch(shouldBindEvent((e: TouchEvent) => { eventHandler(e, TOUCH_EVENT_MAP.get(e.type), this.node) }, this.node, TOUCH_EVENT_MAP.values()))
    .onAreaChange(getComponentEventCallback(this.node, AREA_CHANGE_EVENT_NAME, (res: TaroAny) => {
      this.node._nodeInfo.areaInfo = res[1]
    }))
    .onVisibleAreaChange(getNodeThresholds(this.node) || [0.0, 1.0], getComponentEventCallback(this.node, VISIBLE_CHANGE_EVENT_NAME))
  }
}
