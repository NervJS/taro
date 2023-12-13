import { bindInstanceToNode, eventHandler, getComponentEventCallback, AREA_CHANGE_EVENT_NAME, VISIBLE_CHANGE_EVENT_NAME, initComponentNodeInfo,
  TaroEvent, TaroAny, createTaroEvent } from '@tarojs/runtime'

import { createNode } from './render'
import TaroComponentWrapper from './base'
import { TOUCH_EVENT_MAP } from './utils/constant/event'
import { FlexManager } from './utils/FlexManager'
import { getNodeThresholds, getNormalAttributes, shouldBindEvent, bindAnimation } from './utils/helper'

import type { TaroSwiperElement, TaroSwiperItemElement, TaroElement } from './element'
import type { TaroStyleType } from '@tarojs/runtime'

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

@Component
export struct TaroSwiper {
  private swiperController: SwiperController = new SwiperController()

  nodeInfoMap: TaroAny = {}

  @ObjectLink node: TaroSwiperElement

  @Styles visibleChangeEvent () {
    .onVisibleAreaChange(getNodeThresholds(this.node) || [0.0, 1.0], getComponentEventCallback(this.node, VISIBLE_CHANGE_EVENT_NAME))
  }

  aboutToAppear () {
    initComponentNodeInfo(this, this.node)
    bindInstanceToNode(this.node, this)
    // 绑定动画
    bindAnimation(this.node)
  }

  @Styles defaultEvent () {
    .onClick(shouldBindEvent((e: ClickEvent) => eventHandler(e, 'click', this.node), this.node, ['click']))
    .onAreaChange(getComponentEventCallback(this.node, AREA_CHANGE_EVENT_NAME, res => {
      const eventResult: TaroAny = res.eventResult
      this.nodeInfoMap[this.node._nid].areaInfo = eventResult[1]
    }))
  }

  build() {
    TaroComponentWrapper({ node: this.node }) {
      Swiper(this.swiperController) {
        ForEach(this.node.childNodes, (item: TaroElement) => {
          createNode(item)
        }, (item: TaroElement) => item._nid)
      }
      .swiperStyle(getNormalAttributes(this.node))
      .swiperAttr(getSwiperAttributes(this.node))
      .defaultEvent()
      .indicatorStyle({
        color: this.node.getAttribute('indicatorColor'),
        selectedColor:  this.node.getAttribute('indicatorActiveColor')
      })
      .onChange((index: number) => {
        const event: TaroEvent = createTaroEvent('change', { detail: { current: index } }, this.node)
        eventHandler(event, 'change', this.node)
      })
      .visibleChangeEvent()
    }
  }
}

@Extend(Flex)
function flexStyle (style: TaroStyleType) {
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

function getAttributes (node: TaroSwiperItemElement) {
  const _attrs = node._attrs
  const _nid = node._nid
  const style = getNormalAttributes(node)
  style.id = _attrs.itemId || _attrs.id || _nid
  return style
}

@Component
export struct TaroSwiperItem {
  nodeInfoMap: TaroAny = {}

  @Styles visibleChangeEvent () {
    .onVisibleAreaChange(getNodeThresholds(this.node) || [0.0, 1.0], getComponentEventCallback(this.node, VISIBLE_CHANGE_EVENT_NAME))
  }

  @ObjectLink node: TaroSwiperItemElement

  aboutToAppear () {
    initComponentNodeInfo(this, this.node)
    bindInstanceToNode(this.node, this)
    // 绑定动画
    bindAnimation(this.node)
  }

  @Styles defaultEvent () {
    .onClick(shouldBindEvent((e: ClickEvent) => eventHandler(e, 'click', this.node), this.node, ['click']))
    .onTouch(shouldBindEvent((e: TouchEvent) => eventHandler(e, TOUCH_EVENT_MAP.get(e.type), this.node), this.node, TOUCH_EVENT_MAP.values()))
    .onAreaChange(getComponentEventCallback(this.node, AREA_CHANGE_EVENT_NAME, res => {
      const eventResult: TaroAny = res.eventResult
      this.nodeInfoMap[this.node._nid].areaInfo = eventResult[1]
    }))
  }

  build() {
    TaroComponentWrapper({ node: this.node }) {
      Flex(FlexManager.flexOptions(this.node)) {
        ForEach(this.node.childNodes, (item: TaroElement) => {
          createNode(item)
        }, (item: TaroElement) => item._nid)
      }
      .flexStyle(getAttributes(this.node))
      .defaultEvent()
      .visibleChangeEvent()
    }
  }
}
