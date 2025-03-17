import { AREA_CHANGE_EVENT_NAME, createTaroEvent, eventHandler, getComponentEventCallback, VISIBLE_CHANGE_EVENT_NAME } from '@tarojs/runtime'

import commonStyleModify from './style'
import { getNodeThresholds } from './utils/helper'

import type { TaroAny, TaroEvent, TaroSliderElement } from '@tarojs/runtime'

@Extend(Slider)
function themeStyles(isDisabled: boolean) {
  .opacity(isDisabled ? 0.4 : 1)
}

@ComponentV2
export default struct TaroSlider {
  @Builder customBuilder() {}
  @BuilderParam createLazyChildren: (node: TaroSliderElement) => void = this.customBuilder
  @Param @Require node: TaroSliderElement

  @Local attrMin: number = 0
  @Local attrMax: number = 100
  @Local attrStep: number = 1
  @Local attrDisabled: boolean = false
  @Local attrShowValue: boolean = false
  @Local attrBlockColor?: ResourceColor = '#ffffff'
  @Local attrActiveColor?: ResourceColor = '#1aad19'
  @Local attrSelectedColor?: ResourceColor = '#1aad19'
  @Local attrBackgroundColor?: ResourceColor = '#e9e9e9'
  @Local attrColor?: ResourceColor = '#e9e9e9'
  @Local attrBlockSize?: Length
  @Local value: number = 0

  @Computed get computedSelectedColor () {
    return this.attrActiveColor || this.attrSelectedColor || '#1aad19'
  }

  @Computed get computedTrackColor () {
    return this.attrBackgroundColor || this.attrColor || '#e9e9e9'
  }

  aboutToAppear () {
    if (this.node) {
      this.node._instance = this
      this.attrMin = this.node._attrs?.min ?? this.attrMin
      this.attrMax = this.node._attrs?.max ?? this.attrMax
      this.attrStep = this.node._attrs?.step ?? this.attrStep
      this.attrDisabled = this.node._attrs?.disabled ?? this.attrDisabled
      this.attrShowValue = this.node._attrs?.showValue ?? this.attrShowValue
      this.attrBlockColor = this.node._attrs?.blockColor ?? this.attrBlockColor
      this.attrActiveColor = this.node._attrs?.activeColor ?? this.attrActiveColor
      this.attrSelectedColor = this.node._attrs?.selectedColor ?? this.attrSelectedColor
      this.attrBackgroundColor = this.node._attrs?.backgroundColor ?? this.attrBackgroundColor
      this.attrColor = this.node._attrs?.color ?? this.attrColor
      this.attrBlockSize = this.node._attrs?.blockSize ?? this.attrBlockSize
      this.value = this.node.value ?? this.value

      if (!this.node._isInit) {
        this.node._isInit = true
        this.node._reset = this.node.value || 0
      }
    }
  }

  @Builder createSlider (node: TaroSliderElement) {
    Slider({
      min: Number(this.attrMin || 0),
      max: Number(this.attrMax || 100),
      value: this.value,
      step: Number(this.attrStep || 1),
      style: SliderStyle.OutSet,
      direction: Axis.Horizontal
    })
      .attributeModifier(commonStyleModify.setNode(node))
      .selectedColor(this.computedSelectedColor)
      .trackColor(this.computedTrackColor)
      .trackThickness(this.attrBlockSize)
      .blockColor(this.attrBlockColor || '#ffffff')
      .enabled(!this.attrDisabled)
      .width(!!this.attrShowValue ? '90%' : '100%')
      .themeStyles(!!this.attrDisabled)
      .onChange((value: number, mode: SliderChangeMode) => {
        if (!!this.attrDisabled) {
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
      .onAreaChange(getComponentEventCallback(this.node, AREA_CHANGE_EVENT_NAME, (res: TaroAny) => {
        if (this.node) {
          this.node._nodeInfo.areaInfo = res[1]
        }
      }))
      .onVisibleAreaChange(getNodeThresholds(this.node) || [0.0, 1.0], getComponentEventCallback(this.node, VISIBLE_CHANGE_EVENT_NAME))
  }

  build() {
    if (!!this.attrShowValue) {
      Row() {
        this.createSlider(this.node)
        Text(Number(this.value).toFixed(0))
          .width('10%')
          .textAlign(TextAlign.Center)
          .opacity(!!this.attrDisabled ? 0.4 : 1)
      }
    } else {
      this.createSlider(this.node)
    }
  }
}
