import { eventHandler, getComponentEventCallback, AREA_CHANGE_EVENT_NAME, VISIBLE_CHANGE_EVENT_NAME, TaroEvent, createTaroEvent } from '@tarojs/runtime'

import { getNodeThresholds, shouldBindEvent, getNormalAttributes } from './utils/helper'

import type { TaroAny, TaroSliderElement, TaroStyleType } from '@tarojs/runtime'

interface SliderOptions {
  min?: number
  max?: number
  value?: number
  step?: number
  style?: SliderStyle
  direction?: Axis
}
interface SliderAttrs {
  selectedColor?: ResourceColor
  trackColor?: ResourceColor
  trackThickness?: Length
  blockColor?: ResourceColor
}
interface SliderParams {
  width: string
}

@Extend(Slider)
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

@Extend(Slider)
function attrs (attr: SliderAttrs) {
  .selectedColor(attr.selectedColor)
  .trackColor(attr.trackColor)
  .trackThickness(attr.trackThickness)
  .blockColor(attr.blockColor)
}

function getAttributes (node: TaroSliderElement): SliderAttrs {
  const _attrs = node._attrs
  const sliderAttrs: SliderAttrs = {}
  sliderAttrs.selectedColor = _attrs.activeColor || _attrs.selectedColor || '#1aad19'
  sliderAttrs.trackColor = _attrs.backgroundColor || _attrs.color || '#e9e9e9'
  sliderAttrs.trackThickness = _attrs.blockSize
  sliderAttrs.blockColor = _attrs.blockColor || '#ffffff'
  return sliderAttrs
}

@Extend(Slider)
function themeStyles(isDisabled: boolean) {
  .opacity(isDisabled ? 0.4 : 1)
}

@Builder
function createSlider (node: TaroSliderElement) {
  Slider({
    min: Number(node._attrs.min || 0),
    max: Number(node._attrs.max || 100),
    value: node.value,
    step: Number(node._attrs.step || 1),
    style: SliderStyle.OutSet,
    direction: Axis.Horizontal
  })
    .style(getNormalAttributes(node))
    .attrs(getAttributes(node))
    .width(!!node._attrs.showValue ? '90%' : '100%')
    .themeStyles(!!node._attrs.disabled)
    .onChange((value: number, mode: SliderChangeMode) => {
      if (!!node._attrs.disabled) {
        if (mode === SliderChangeMode.End) {
          // FIXME 找下文档是否有强制刷新方法
          node.value = node.value + 0.01
          node.value = node.value - 0.01
        }
      } else {
        node.value = value
        if (mode === SliderChangeMode.End) {
          const event: TaroEvent = createTaroEvent('change', { detail: { value: node.value } }, node)
          eventHandler(event, 'change', node)
        } else if (mode === SliderChangeMode.Moving) {
          const event: TaroEvent = createTaroEvent('changing', { detail: { value: node.value } }, node)
          eventHandler(event, 'changing', node)
        }
      }
    })
    .onClick(shouldBindEvent((e: ClickEvent) => eventHandler(e, 'click', node), node, ['click']))
    .onAreaChange(getComponentEventCallback(node, AREA_CHANGE_EVENT_NAME, (res: TaroAny) => {
      node._nodeInfo.areaInfo = res[1]
    }))
    .onVisibleAreaChange(getNodeThresholds(node) || [0.0, 1.0], getComponentEventCallback(node, VISIBLE_CHANGE_EVENT_NAME))
}

@Builder
export default function TaroSlider (node: TaroSliderElement) {
  if (!!node._attrs.showValue) {
    Row() {
      createSlider(node)
      Text(Number(value).toFixed(0))
        .width('10%')
        .textAlign(TextAlign.Center)
        .opacity(!!node._attrs.disabled ? 0.4 : 1)
    }
  } else {
    createSlider(node)
  }
}
