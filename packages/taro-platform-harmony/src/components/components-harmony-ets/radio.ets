import { eventHandler, getComponentEventCallback, AREA_CHANGE_EVENT_NAME, VISIBLE_CHANGE_EVENT_NAME, createTaroEvent } from '@tarojs/runtime'

import { createLazyChildren } from './render'
import { TOUCH_EVENT_MAP } from './utils/constant/event'
import { FlexManager } from './utils/FlexManager'
import { shouldBindEvent, getNormalAttributes, getNodeThresholds } from './utils/helper'

import type { TaroEvent, TaroAny, TaroStyleType, HarmonyType, TaroRadioGroupElement, TaroRadioElement } from '@tarojs/runtime'

interface RadioAttrs {
  radioStyle?: HarmonyType.RadioStyle
  themeStyles?: boolean
}

@Extend(Radio)
function style (style: TaroStyleType) {
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
  .backgroundImagePosition(style.backgroundImagePosition)
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

@Extend(Radio)
function radioAttr (attr: RadioAttrs) {
  .radioStyle(attr.radioStyle)
  .themeStyles(attr.themeStyles)
}

function getAttributes (node: TaroRadioElement): RadioAttrs {
  const radioAttrs: RadioAttrs = {}
  radioAttrs.radioStyle = {
    checkedBackgroundColor: node._attrs.color || '#1aad19'
  }
  radioAttrs.themeStyles = !!node._attrs.disabled
  return radioAttrs
}

@Extend(Radio)
function themeStyles(isDisabled: boolean) {
  .opacity(isDisabled ? 0.4 : 1)
}

@Builder
export function TaroRadio (node: TaroRadioElement) {
  Stack() {
    Row() {
      Radio({
        group: node.group || node.parentNode?._nid || '',
        value: node._attrs.value || '',
      })
        .checked(node.checked)
        .style(getNormalAttributes(node))
        .radioAttr(getAttributes(node))
        .onChange((value: boolean) => {
          if (!!node?._attrs.disabled) {
            node.updateComponent()
          } else {
            node.updateCheckedValue(value)

            if (value) {
              const event: TaroEvent = createTaroEvent('change', { detail: { value: node?._attrs.value } }, node)
              eventHandler(event, 'change', node)
            }
          }
        })
        .onClick(shouldBindEvent((e: ClickEvent) => eventHandler(e, 'click', node), node, ['click']))
        .onAreaChange(getComponentEventCallback(node, AREA_CHANGE_EVENT_NAME, (res: TaroAny) => {
          node._nodeInfo.areaInfo = res[1]
        }))
        .onVisibleAreaChange(getNodeThresholds(node) || [0.0, 1.0], getComponentEventCallback(node, VISIBLE_CHANGE_EVENT_NAME))
      Text(node.textContent)
        .textAlign(TextAlign.Center)
        .opacity(!!node?._attrs.disabled ? 0.4 : 1)
    }
    .onClick(() => {
      if (!node._checked && !node?._attrs.disabled) {
        node.checked = !node.checked
      }
    })
  }
}

@Extend(Flex)
function radioGroupAttrs (style: TaroStyleType) {
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
  .backgroundImagePosition(style.backgroundImagePosition)
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


@Component
export struct TaroRadioGroup {
  node: TaroRadioGroupElement | null = null

  @Styles visibleChangeEvent () {
    .onVisibleAreaChange(getNodeThresholds(this.node) || [0.0, 1.0], getComponentEventCallback(this.node, VISIBLE_CHANGE_EVENT_NAME))
  }

  aboutToAppear () {
    if (this.node) {
      const childList = this.node.getElementsByTagName<TaroRadioElement>('RADIO')
      childList.forEach(element => {
        element.group = this.node?._attrs.name || this.node?._nid
      })
      // 阻止事件冒泡传递上去
      this.node.addEventListener('change', (e: TaroEvent) => e.stopPropagation())
    }
  }

  @Styles defaultEvent () {
    .onClick(shouldBindEvent((e: ClickEvent) => eventHandler(e, 'click', this.node), this.node, ['click']))
    .onTouch(shouldBindEvent((e: TouchEvent) => eventHandler(e, TOUCH_EVENT_MAP.get(e.type), this.node), this.node, TOUCH_EVENT_MAP.values()))
    .onAreaChange(getComponentEventCallback(this.node, AREA_CHANGE_EVENT_NAME, (res: TaroAny) => {
      if (this.node) {
        this.node._nodeInfo.areaInfo = res[1]
      }
    }))
  }

  build() {
    if (this.node) {
      Flex(FlexManager.flexOptions(this.node)) {
        createLazyChildren(this.node)
      }
      .radioGroupAttrs(getNormalAttributes(this.node))
      .defaultEvent()
      .visibleChangeEvent()
    }
  }
}
