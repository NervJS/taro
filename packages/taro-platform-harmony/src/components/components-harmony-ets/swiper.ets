import { eventHandler, getComponentEventCallback, AREA_CHANGE_EVENT_NAME, VISIBLE_CHANGE_EVENT_NAME, createTaroEvent } from '@tarojs/runtime'

import { createLazyChildren } from './render'
import { getNodeThresholds, getNormalAttributes, shouldBindEvent } from './utils/helper'

import type { TaroStyleType, TaroSwiperElement, TaroEvent, TaroAny } from '@tarojs/runtime'

interface SwiperAttrs {
  index?: number
  loop?: boolean
  duration?: number
  interval?: number
  vertical?: boolean
  autoPlay?: boolean
  indicator?: boolean
}

@Extend(Swiper)
function swiperStyle (style: TaroStyleType) {
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

@Extend(Swiper)
function swiperAttr (attr: SwiperAttrs) {
  .index(attr.index)
  .loop(attr.loop)
  .duration(attr.duration)
  .interval(attr.interval)
  .vertical(attr.vertical)
  .autoPlay(attr.autoPlay)
  .indicator(attr.indicator)
}

function getSwiperAttributes (node: TaroSwiperElement): SwiperAttrs {
  const _attrs = node._attrs
  const swiperAttrs: SwiperAttrs = {}
  swiperAttrs.index = _attrs.current || 0
  swiperAttrs.loop = _attrs.circular || false
  swiperAttrs.duration = _attrs.duration || 500
  swiperAttrs.interval = _attrs.interval || 5000
  swiperAttrs.vertical = _attrs.vertical || false
  swiperAttrs.autoPlay = _attrs.autoplay || false
  swiperAttrs.indicator = _attrs.indicatorDots || false
  return swiperAttrs
}

@Builder
export default function TaroSwiper (node: TaroSwiperElement) {
  Swiper(node.controller) {
    createLazyChildren(node)
  }
  .swiperStyle(getNormalAttributes(node))
  .swiperAttr(getSwiperAttributes(node))
  .indicatorStyle({
    color: node.getAttribute('indicatorColor'),
    selectedColor:  node.getAttribute('indicatorActiveColor')
  })
  .onChange((index: number) => {
    const event: TaroEvent = createTaroEvent('change', { detail: { current: index } }, node)
    eventHandler(event, 'change', node)
  })
  .onClick(shouldBindEvent((e: ClickEvent) => eventHandler(e, 'click', node), node, ['click']))
  .onAreaChange(getComponentEventCallback(node, AREA_CHANGE_EVENT_NAME, (res: TaroAny) => {
    node._nodeInfo.areaInfo = res[1]
  }))
  .onVisibleAreaChange(getNodeThresholds(node) || [0.0, 1.0], getComponentEventCallback(node, VISIBLE_CHANGE_EVENT_NAME))
}
