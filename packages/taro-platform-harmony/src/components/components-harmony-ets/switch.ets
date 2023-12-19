import { eventHandler, getComponentEventCallback, AREA_CHANGE_EVENT_NAME, VISIBLE_CHANGE_EVENT_NAME, createTaroEvent } from '@tarojs/runtime'

import { getNodeThresholds, shouldBindEvent, getNormalAttributes } from './utils/helper'

import type { TaroAny, TaroStyleType, TaroSwitchElement, TaroEvent } from '@tarojs/runtime'

interface SwitchAttrs {
  selectedColor?: ResourceColor
}

@Extend(Toggle)
function styles (style: TaroStyleType) {
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

@Extend(Toggle)
function attrs(attr: SwitchAttrs) {
  .selectedColor(attr.selectedColor)
}

function getAttributes (node: TaroSwitchElement): SwitchAttrs {
  const _attrs = node._attrs
  const switchStyle: SwitchAttrs = {}
  switchStyle.selectedColor = _attrs.color || '#04BE02'
  return switchStyle
}

@Extend(Toggle)
function themeStyles(isDisabled: boolean) {
  .opacity(isDisabled ? 0.4 : 1)
}

@Builder
export default function TaroSwitch (node: TaroSwitchElement) {
  Toggle({
    type: node._attrs.type !== 'checkbox' ? ToggleType.Switch : ToggleType.Checkbox,
    isOn: node.checked,
  })
    .styles(getNormalAttributes(node))
    .attrs(getAttributes(node))
    .themeStyles(!!node._attrs.disabled)
    .onChange((isOn: boolean) => {
      if (!node?._attrs.disabled) {
        const event: TaroEvent = createTaroEvent('change', { detail: { value: isOn } }, node)

        node.updateCheckedValue(isOn)
        eventHandler(event, 'change', node)
      } else {
        node.updateComponent()
      }
    })
    .onClick(shouldBindEvent((e: ClickEvent) => eventHandler(e, 'click', node), node, ['click']))
    .onAreaChange(getComponentEventCallback(node, AREA_CHANGE_EVENT_NAME, (res: TaroAny) => {
      node._nodeInfo.areaInfo = res[1]
    }))
    .onVisibleAreaChange(getNodeThresholds(node) || [0.0, 1.0], getComponentEventCallback(node, VISIBLE_CHANGE_EVENT_NAME))
}
