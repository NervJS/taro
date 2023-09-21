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
    activeColor: _attrs.activeColor || _attrs.selectedColor || '#1aad19',
    backgroundColor: _attrs.backgroundColor || _attrs.color || '#e9e9e9',
    blockSize: _attrs.blockSize,
    blockColor: _attrs.blockColor || '#ffffff',
    disabled: !!_attrs.disabled,
    showValue: !!_attrs.showValue,
  }
}

@Extend(Slider)
function themeStyles(isDisabled: boolean) {
  .opacity(isDisabled ? 0.4 : 1)
}

@Component
struct TaroSlider {
  info: Area = null

  @ObjectLink node: TaroViewElement

  @State value: number = 0

  aboutToAppear () {
    bindInstanceToNode(this.node, this)
    this.value = Number(this.node._attrs.value || 0)
  }

  @Styles defaultEvent () {
    .onClick((e: ClickEvent) => !this.node._attrs.disabled && eventHandler(e, 'click', this.node))
    .onAreaChange((_: Area, areaResult: Area) => {
      this.info = areaResult
    })
  }

  @Builder createSlider ($$: { width: string }) {
    Slider({
      min: Number(this.node._attrs.min || 0),
      max: Number(this.node._attrs.max || 100),
      value: this.value,
      step: Number(this.node._attrs.step || 1),
      style: SliderStyle.OutSet,
      direction: Axis.Horizontal
    })
      .defaultEvent()
      .attrs(getAttributes(this.node))
      .width($$.width)
      .themeStyles(!!this.node._attrs.disabled)
      .onChange((value: number, mode: SliderChangeMode) => {
        if (!!this.node._attrs.disabled) {
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
      if (!!this.node._attrs.showValue) {
        Row() {
          this.createSlider({ width: '90%' })
          Text(Number(this.value).toFixed(0))
            .width('10%')
            .textAlign(TextAlign.Center)
            .opacity(!!this.node._attrs.disabled ? 0.4 : 1)
        }
      } else {
        this.createSlider({ width: '100%' })
      }
    }
  }
}

export default TaroSlider
