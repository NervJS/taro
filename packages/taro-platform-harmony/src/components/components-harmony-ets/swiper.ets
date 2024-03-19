import { eventHandler, getComponentEventCallback, AREA_CHANGE_EVENT_NAME, VISIBLE_CHANGE_EVENT_NAME, createTaroEvent } from '@tarojs/runtime'

import commonStyleModify from './style'
import { getNodeThresholds, shouldBindEvent } from './utils/helper'

import type { TaroSwiperElement, TaroEvent, TaroAny } from '@tarojs/runtime'

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

@Component
export default struct TaroSwiper {
  @Builder customBuilder() {}
  @BuilderParam createLazyChildren: (node: TaroSwiperElement) => void = this.customBuilder
  @ObjectLink node: TaroSwiperElement
  @State overwriteStyle: Record<string, TaroAny> = {}

  aboutToAppear(): void {
    if (this.node) {
      this.node._instance = this
    }
  }

  build () {
    if (this.node.hmStyle?.display !== 'none') {
      Swiper(this.node.controller) {
        this.createLazyChildren(this.node)
      }
        .attributeModifier(commonStyleModify.setNode(this.node).setAnimationStyle(this.overwriteStyle))
        .swiperAttr(getSwiperAttributes(this.node))
        .indicatorStyle({
          color: this.node.getAttribute('indicatorColor'),
          selectedColor:  this.node.getAttribute('indicatorActiveColor')
        })
        .onChange((index: number) => {
          const event: TaroEvent = createTaroEvent('change', { detail: { current: index } }, this.node)
          eventHandler(event, 'change', this.node)
        })
        .onClick(shouldBindEvent((e: ClickEvent) => eventHandler(e, 'click', this.node), this.node, ['click']))
        .onAreaChange(getComponentEventCallback(this.node, AREA_CHANGE_EVENT_NAME, (res: TaroAny) => {
          this.node._nodeInfo.areaInfo = res[1]
        }))
        .onVisibleAreaChange(getNodeThresholds(this.node) || [0.0, 1.0], getComponentEventCallback(this.node, VISIBLE_CHANGE_EVENT_NAME))
    }
  }
}
