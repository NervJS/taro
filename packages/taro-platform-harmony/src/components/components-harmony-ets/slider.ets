import { eventHandler } from '@tarojs/runtime'

import TaroComponentWrapper from './base'
import { createTaroEvent } from './utils/events'
import { bindInstanceToNode } from './utils/helper'

import type { TaroViewElement } from '../runtime'

@Extend(Slider)
function attrs ({
 activeColor,
 backgroundColor,
 blockSize,
 blockColor,
}) {
  .selectedColor(activeColor)
  .trackColor(backgroundColor)
  .trackThickness(blockSize)
  .blockColor(blockColor)
}

function getAttributes (node: TaroViewElement) {
  const { _attrs = {} } = node
  return {
    min: Number(_attrs.min || 0),
    max: Number(_attrs.max || 100),
    value: Number(_attrs.value || 0),
    step: Number(_attrs.step || 1),
    activeColor: _attrs.activeColor || _attrs.selectedColor || '#1aad19',
    backgroundColor: _attrs.backgroundColor || _attrs.color || '#e9e9e9',
    blockSize: _attrs.blockSize,
    blockColor: _attrs.blockColor || '#ffffff',
    disabled: !!_attrs.disabled,
    showValue: !!_attrs.showValue,
  }
}

@Extend(Slider)
function themeStyles({
  isDisabled,
}) {
  .opacity(isDisabled ? 0.4 : 1)
}

function getThemeAttributes (node: TaroViewElement) {
  const { _attrs } = node
  const isDisabled = _attrs.disabled

  return {
    isDisabled,
  }
}

@Component
struct TaroSlider {
  info: Area = null

  @ObjectLink node: TaroViewElement

  @State value: number = 0

  aboutToAppear () {
    bindInstanceToNode(this.node, this)
    this.value = getAttributes(this.node).value
  }

  @Styles defaultEvent () {
    .onClick((e: ClickEvent) => !getThemeAttributes(this.node).isDisabled && eventHandler(e, 'click', this.node))
    .onAreaChange((_: Area, areaResult: Area) => {
      this.info = areaResult
    })
  }

  @Builder createSlider ($$: { width: string }) {
    Slider({
      min: getAttributes(this.node).min,
      max: getAttributes(this.node).max,
      value: this.value,
      step: getAttributes(this.node).step,
      style: SliderStyle.OutSet,
      direction: Axis.Horizontal
    })
      .defaultEvent()
      .attrs(getAttributes(this.node))
      .width($$.width)
      .themeStyles(getThemeAttributes(this.node))
      .onChange((value: number, mode: SliderChangeMode) => {
        if (getThemeAttributes(this.node).isDisabled) {
          if (mode === SliderChangeMode.End) {
            // FIXME 找下文档是否有强制刷新方法
            this.value = this.value + 0.01
            this.value = this.value - 0.01
          }
        } else {
          this.value = value
          if (mode === SliderChangeMode.End) {
            const event = createTaroEvent('change', { detail: { value: this.value } }, this.node)
            eventHandler(event, 'change', this.node)
          } else if (mode === SliderChangeMode.Moving) {
            const event = createTaroEvent('changing', { detail: { value: this.value } }, this.node)
            eventHandler(event, 'changing', this.node)
          }
        }
      })
  }

  build() {
    TaroComponentWrapper({ node: this.node }) {
      if (getAttributes(this.node).showValue) {
        Row() {
          this.createSlider({ width: '90%' })
          Text(Number(this.value).toFixed(0))
            .width('10%')
            .textAlign(TextAlign.Center)
            .opacity(getThemeAttributes(this.node).isDisabled ? 0.4 : 1)
        }
      } else {
        this.createSlider({ width: '100%' })
      }
    }
  }
}

export default TaroSlider
