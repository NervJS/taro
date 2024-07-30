import { eventHandler, getComponentEventCallback, AREA_CHANGE_EVENT_NAME, VISIBLE_CHANGE_EVENT_NAME, createTaroEvent } from '@tarojs/runtime'

import commonStyleModify from './style'
import { getNodeThresholds, shouldBindEvent } from './utils/helper'

import type { TaroAny, TaroEvent, TaroSliderElement } from '@tarojs/runtime'

interface SliderAttrs {
  selectedColor?: ResourceColor
  trackColor?: ResourceColor
  trackThickness?: Length
  blockColor?: ResourceColor
  disabled?: boolean
}

@Extend(Slider)
function attrs (attr: SliderAttrs) {
  .selectedColor(attr.selectedColor)
  .trackColor(attr.trackColor)
  .trackThickness(attr.trackThickness)
  .blockColor(attr.blockColor)
  .enabled(!attr.disabled)
}

function getAttributes (node: TaroSliderElement): SliderAttrs {
  const _attrs = node._attrs
  const sliderAttrs: SliderAttrs = {}
  sliderAttrs.selectedColor = _attrs.activeColor || _attrs.selectedColor || '#1aad19'
  sliderAttrs.trackColor = _attrs.backgroundColor || _attrs.color || '#e9e9e9'
  sliderAttrs.trackThickness = _attrs.blockSize
  sliderAttrs.blockColor = _attrs.blockColor || '#ffffff'
  sliderAttrs.disabled = !!_attrs.disabled
  return sliderAttrs
}

@Extend(Slider)
function themeStyles(isDisabled: boolean) {
  .opacity(isDisabled ? 0.4 : 1)
}

@Component
export default struct TaroSlider {
  @Builder customBuilder() {}
  @BuilderParam createLazyChildren: (node: TaroSliderElement, layer?: number) => void = this.customBuilder
  @ObjectLink node: TaroSliderElement

  @State value: number = 0
  @State overwriteStyle: Record<string, TaroAny> = {}

  aboutToAppear () {
    if (this.node) {
      this.value = this.node.value
      this.node._instance = this

      if (!this.node._isInit) {
        this.node._isInit = true
        this.node._reset = this.node.value || 0
      }
    }
  }

  @Builder createSlider (node: TaroSliderElement) {
    Slider({
      min: Number(node._attrs.min || 0),
      max: Number(node._attrs.max || 100),
      value: this.value,
      step: Number(node._attrs.step || 1),
      style: SliderStyle.OutSet,
      direction: Axis.Horizontal
    })
      .attributeModifier(commonStyleModify.setNode(node).setAnimationStyle(this.overwriteStyle))
      .attrs(getAttributes(node))
      .width(!!node._attrs.showValue ? '90%' : '100%')
      .themeStyles(!!node._attrs.disabled)
      .onChange((value: number, mode: SliderChangeMode) => {
        if (!!node._attrs.disabled) {
          if (mode === SliderChangeMode.End) {
            this.node?.updateComponent()
          }
        } else {
          this.value = value
          this.node?.updateFormWidgetValue(value)

          if (mode === SliderChangeMode.End) {
            const event: TaroEvent = createTaroEvent('change', { detail: { value: this.value } }, node)
            eventHandler(event, 'change', node)
          } else if (mode === SliderChangeMode.Moving) {
            const event: TaroEvent = createTaroEvent('changing', { detail: { value: this.value } }, node)
            eventHandler(event, 'changing', node)
          }
        }
      })
      .onClick(shouldBindEvent((e: ClickEvent) => { eventHandler(e, 'click', this.node) }, this.node, ['click']))
      .onAreaChange(getComponentEventCallback(this.node, AREA_CHANGE_EVENT_NAME, (res: TaroAny) => {
        if (this.node) {
          this.node._nodeInfo.areaInfo = res[1]
        }
      }))
      .onVisibleAreaChange(getNodeThresholds(this.node) || [0.0, 1.0], getComponentEventCallback(this.node, VISIBLE_CHANGE_EVENT_NAME))
  }

  build() {
    if (!!this.node._attrs.showValue) {
      Row() {
        this.createSlider(this.node)
        Text(Number(this.value).toFixed(0))
          .width('10%')
          .textAlign(TextAlign.Center)
          .opacity(!!this.node._attrs.disabled ? 0.4 : 1)
      }
    } else {
      this.createSlider(this.node)
    }
  }
}
