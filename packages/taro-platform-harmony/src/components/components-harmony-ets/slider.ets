import { bindInstanceToNode, eventHandler, getComponentEventCallback, AREA_CHANGE_EVENT_NAME, VISIBLE_CHANGE_EVENT_NAME, initComponentNodeInfo,
  TaroEvent, TaroAny, createTaroEvent } from '@tarojs/runtime'

import TaroComponentWrapper from './base'
import { getNodeThresholds, shouldBindEvent, getNormalAttributes } from './utils/helper'

import type { TaroSliderElement } from './element'
import type { TaroStyleType } from './type'

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

@Component
export default struct TaroSlider {
  nodeInfoMap: TaroAny = {}

  @ObjectLink node: TaroSliderElement

  @State value: number = 0

  @Styles visibleChangeEvent () {
    .onVisibleAreaChange(getNodeThresholds(this.node) || [0.0, 1.0], getComponentEventCallback(this.node, VISIBLE_CHANGE_EVENT_NAME))
  }

  aboutToAppear () {
    initComponentNodeInfo(this, this.node)
    bindInstanceToNode(this.node, this)

    this.value = Number(this.node._attrs.value || 0)
  }

  @Styles defaultEvent () {
    .onClick(shouldBindEvent((e: ClickEvent) => eventHandler(e, 'click', this.node), this.node, ['click']))
    .onAreaChange(getComponentEventCallback(this.node, AREA_CHANGE_EVENT_NAME, res => {
      const eventResult: TaroAny = res.eventResult
      this.nodeInfoMap[this.node._nid].areaInfo = eventResult[1]
    }))
  }

  @Builder createSlider () {
    Slider({
      min: Number(this.node._attrs.min || 0),
      max: Number(this.node._attrs.max || 100),
      value: this.value,
      step: Number(this.node._attrs.step || 1),
      style: SliderStyle.OutSet,
      direction: Axis.Horizontal
    })
      .defaultEvent()
      .style(getNormalAttributes(this.node))
      .attrs(getAttributes(this.node))
      .width(!!this.node._attrs.showValue ? '90%' : '100%')
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
            const event: TaroEvent = createTaroEvent('change', { detail: { value: this.value } }, this.node)
            eventHandler(event, 'change', this.node)
          } else if (mode === SliderChangeMode.Moving) {
            const event: TaroEvent = createTaroEvent('changing', { detail: { value: this.value } }, this.node)
            eventHandler(event, 'changing', this.node)
          }
        }
      })
      .visibleChangeEvent()
  }

  build() {
    TaroComponentWrapper({ node: this.node }) {
      if (!!this.node._attrs.showValue) {
        Row() {
          this.createSlider()
          Text(Number(this.value).toFixed(0))
            .width('10%')
            .textAlign(TextAlign.Center)
            .opacity(!!this.node._attrs.disabled ? 0.4 : 1)
        }
      } else {
        this.createSlider()
      }
    }
  }
}
