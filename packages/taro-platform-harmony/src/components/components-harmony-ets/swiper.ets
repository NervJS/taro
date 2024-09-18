import { eventHandler, getComponentEventCallback, AREA_CHANGE_EVENT_NAME, VISIBLE_CHANGE_EVENT_NAME, createTaroEvent } from '@tarojs/runtime'

import commonStyleModify from './style'
import { getNodeThresholds, shouldBindEvent } from './utils/helper'

import type { TaroAny, TaroEvent, TaroSwiperElement } from '@tarojs/runtime'

interface SwiperAttrs {
  index?: number
  loop?: boolean
  duration?: number
  interval?: number
  vertical?: boolean
  autoPlay?: boolean
  indicator?: boolean
  nextMargin?: Length
  prevMargin?: Length
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
  .nextMargin(attr.nextMargin)
  .prevMargin(attr.prevMargin)
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
  swiperAttrs.nextMargin = _attrs.nextMargin || 0
  swiperAttrs.prevMargin = _attrs.previousMargin || 0
  return swiperAttrs
}

@Component
export default struct TaroSwiper {
  @Builder customBuilder() {}
  @BuilderParam createLazyChildren: (node: TaroSwiperElement, layer?: number) => void = this.customBuilder
  @ObjectLink node: TaroSwiperElement
  @State overwriteStyle: Record<string, TaroAny> = {}

  aboutToAppear(): void {
    if (this.node) {
      this.node._instance = this
    }
  }

  build () {
    Swiper(this.node.controller) {
      this.createLazyChildren(this.node, 0)
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
      .onClick(shouldBindEvent((e: ClickEvent) => { eventHandler(e, 'click', this.node) }, this.node, ['click']))
      .onAreaChange(getComponentEventCallback(this.node, AREA_CHANGE_EVENT_NAME, (res: TaroAny) => {
        this.node._nodeInfo.areaInfo = res[1]
      }))
      .onVisibleAreaChange(getNodeThresholds(this.node) || [0.0, 1.0], getComponentEventCallback(this.node, VISIBLE_CHANGE_EVENT_NAME))
      .onGestureSwipe(shouldBindEvent((index: number, extraInfo: SwiperAnimationEvent) => {
        const currentOffset = extraInfo.currentOffset || 0
        // 判断设置的滚动方向
        const isVertical = this.node._attrs.vertical || false
        let event: TaroEvent
        if (isVertical) {
          event = createTaroEvent('transition', { detail: { dx: 0, dy: vp2px(currentOffset) } }, this.node)
        } else {
          event = createTaroEvent('transition', { detail: { dx: vp2px(currentOffset), dy: 0 } }, this.node)
        }
        eventHandler(event, 'transition', this.node)
      }, this.node, ['transition']))
      .onTouch(shouldBindEvent((event: TouchEvent) => {
        if (event.type === TouchType.Down) {
          eventHandler(event, 'touchStart', this.node)
        }
        if (event.type === TouchType.Up) {
          eventHandler(event, 'touchEnd', this.node)
        }
        if (event.type === TouchType.Move) {
          eventHandler(event, 'touchMove', this.node)
        }
      }, this.node, ['touchstart', 'touchmove', 'touchend']))
  }
}
