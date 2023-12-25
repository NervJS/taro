import { eventHandler, getComponentEventCallback, AREA_CHANGE_EVENT_NAME, VISIBLE_CHANGE_EVENT_NAME, createTaroEvent } from '@tarojs/runtime'

import { getNodeThresholds, shouldBindEvent, getNormalAttributes } from './utils/helper'

import type { TaroAny, TaroSliderElement, TaroStyleType, TaroEvent } from '@tarojs/runtime'

interface SliderAttrs {
  selectedColor?: ResourceColor
  trackColor?: ResourceColor
  trackThickness?: Length
  blockColor?: ResourceColor
}

@Extend(Slider)
function style (style: TaroStyleType) {
  .id(style.id)
  .key(style.id)
  .flexGrow(style.flexGrow)
  .flexShrink(style.flexShrink)
  .flexBasis(style.flexBasis)
  .alignSelf(style.alignSelf)
  .padding({
    top: style.paddingTop,
    right: style.paddingRight,
    bottom: style.paddingBottom,
    left: style.paddingLeft
  })
  .margin({
    top: style.marginTop,
    right: style.marginRight,
    bottom: style.marginBottom,
    left: style.marginLeft
  })
  .width(style.width)
  .height(style.height)
  .constraintSize({
    minWidth: style.minWidth,
    maxWidth: style.maxWidth,
    minHeight: style.minHeight,
    maxHeight: style.maxHeight
  })
  .backgroundColor(style.backgroundColor)
  .backgroundImage(style.backgroundImage?.src, style.backgroundRepeat)
  .backgroundImageSize(style.backgroundSize)
  .backgroundImagePosition(style.backgroundPosition)
  .borderStyle({
    top: style.borderTopStyle,
    right: style.borderRightStyle,
    bottom: style.borderBottomStyle,
    left: style.borderLeftStyle
  })
  .borderWidth({
    top: style.borderTopWidth,
    right: style.borderRightWidth,
    bottom: style.borderBottomWidth,
    left: style.borderLeftWidth
  })
  .borderColor({
    top: style.borderTopColor,
    right: style.borderRightColor,
    bottom: style.borderBottomColor,
    left: style.borderLeftColor
  })
  .borderRadius({
    topLeft: style.borderTopLeftRadius,
    topRight: style.borderTopRightRadius,
    bottomLeft: style.borderBottomLeftRadius,
    bottomRight: style.borderBottomRightRadius
  })
  .zIndex(style.zIndex)
  .opacity(style.opacity)
  .linearGradient(style.linearGradient)
  .clip(style.overflow)
  .rotate({ centerX: style.transformOrigin?.x, centerY: style.transformOrigin?.y, angle: 0 })
  .scale({ centerX: style.transformOrigin?.x, centerY: style.transformOrigin?.y })
  .transform(style.transform)
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
  node: TaroSliderElement | null = null

  @State value: number = 0

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
      .style(getNormalAttributes(node))
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
      .onClick(shouldBindEvent((e: ClickEvent) => eventHandler(e, 'click', this.node), this.node, ['click']))
      .onAreaChange(getComponentEventCallback(this.node, AREA_CHANGE_EVENT_NAME, (res: TaroAny) => {
        if (this.node) {
          this.node._nodeInfo.areaInfo = res[1]
        }
      }))
      .onVisibleAreaChange(getNodeThresholds(this.node) || [0.0, 1.0], getComponentEventCallback(this.node, VISIBLE_CHANGE_EVENT_NAME))
  }

  build() {
    if (this.node) {
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
}