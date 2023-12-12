import { bindScrollTo, bindInstanceToNode, eventHandler, getComponentEventCallback, AREA_CHANGE_EVENT_NAME, VISIBLE_CHANGE_EVENT_NAME, initComponentNodeInfo,
  TaroEvent, TaroAny } from '@tarojs/runtime'

import { createNode } from './render'
import TaroComponentWrapper from './base'
import { TOUCH_EVENT_MAP } from './utils/constant/event'
import { createTaroEvent } from './utils/events'
import { getNodeThresholds, getNormalAttributes, shouldBindEvent, bindAnimation } from './utils/helper'

import type { TaroScrollViewElement, TaroElement } from './element'
import type { TaroStyleType } from '@tarojs/runtime'

interface ScrollViewAttrs {
  scrollBar: BarState
}
interface ScrollViewCurrentOffset {
  xOffset: number
  yOffset: number
}
interface ScrollViewEvent {
  deltaX: number
  deltaY: number
  scrollLeft: number
  scrollTop: number
  scrollWidth: number
  scrollHeight: number
}

@Extend(Row)
function rowAttrs (style: TaroStyleType) {
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

@Extend(Column)
function columnAttrs (style: TaroStyleType) {
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


function getAttributes (node: TaroScrollViewElement): ScrollViewAttrs {
  const _attrs = node._attrs
  const scrollAttrs: ScrollViewAttrs = {
    scrollBar: typeof _attrs.showScrollbar === 'boolean'
      ? _attrs.showScrollbar ? BarState.On : BarState.Off
      : BarState.Auto
  }
  return scrollAttrs
}


@Component
export default struct TaroScrollView {
  nodeInfoMap: TaroAny = {}

  wrapper?: Area

  @Styles visibleChangeEvent () {
    .onVisibleAreaChange(getNodeThresholds(this.node) || [0.0, 1.0], getComponentEventCallback(this.node, VISIBLE_CHANGE_EVENT_NAME))
  }

  scroller: Scroller = new Scroller()

  @ObjectLink node: TaroScrollViewElement

  aboutToAppear () {
    initComponentNodeInfo(this, this.node)
    bindInstanceToNode(this.node, this)
    // 绑定动画
    bindAnimation(this.node)
    bindScrollTo(this.node, this)
  }

  @Styles defaultEvent () {
    .onClick(shouldBindEvent((e: ClickEvent) => eventHandler(e, 'click', this.node), this.node, ['click']))
    .onTouch(shouldBindEvent((e: TouchEvent) => eventHandler(e, TOUCH_EVENT_MAP.get(e.type), this.node), this.node, TOUCH_EVENT_MAP.values()))
    .onAreaChange(getComponentEventCallback(this.node, AREA_CHANGE_EVENT_NAME, res => {
      const eventResult: TaroAny = res.eventResult
      this.nodeInfoMap[this.node._nid].areaInfo = eventResult[1]
    }))
  }

  @Styles defaultContainerEvent () {
    .onAreaChange(shouldBindEvent((areaResult: Area) => {
      this.wrapper = areaResult
    }, this.node, ['scroll', 'scrollstart', 'scrollend']))
  }


  handleScrollEvent (eventName = 'scroll', xOffset?: number, yOffset?: number) {
    const currentOffset: ScrollViewCurrentOffset = this.scroller.currentOffset()
    const currentXOffset = currentOffset.xOffset
    const currentYOffset = currentOffset.yOffset
    const value: ScrollViewEvent = {
      deltaX: vp2px(xOffset),
      deltaY: vp2px(yOffset),
      scrollLeft: vp2px(currentXOffset),
      scrollTop: vp2px(currentYOffset),
      scrollWidth: vp2px(Number(this.wrapper?.width)),
      scrollHeight: vp2px(Number(this.wrapper?.height)),
    }
    const event: TaroEvent = createTaroEvent(eventName, { detail: value }, this.node)
    eventHandler(event, eventName, this.node)
  }

  build() {
    TaroComponentWrapper({ node: this.node }) {
      // Copy 额外增加visibleChangeEvent
      if (this.node._attrs.scrollX) {
        Scroll(this.scroller) {
          Row() {
            ForEach(this.node.childNodes, (item: TaroElement) => {
              createNode(item)
            }, (item: TaroElement) => item._nid)
          }
          .rowAttrs(getNormalAttributes(this.node))
          .width(null)
          .defaultContainerEvent()
        }
        .flexGrow(getNormalAttributes(this.node).flexGrow)
        .scrollable(ScrollDirection.Horizontal)
        .scrollBar(getAttributes(this.node).scrollBar)
        .defaultEvent()
        .onScroll(shouldBindEvent(() => { this.handleScrollEvent('scroll') }, this.node, ['scroll']))
        .onScrollStart(shouldBindEvent(() => { this.handleScrollEvent('scrollstart') }, this.node, ['scrollstart']))
        .onScrollStop(shouldBindEvent(() => { this.handleScrollEvent('scrollend') }, this.node, ['scrollend']))
        .visibleChangeEvent()
      } else {
        Scroll(this.scroller) {
          Column() {
            ForEach(this.node.childNodes, (item: TaroElement) => {
              createNode(item)
            }, (item: TaroElement) => item._nid)
          }
          .columnAttrs(getNormalAttributes(this.node))
          .height(null)
          .defaultContainerEvent()
        }
        .flexGrow(getNormalAttributes(this.node).flexGrow)
        .scrollable(ScrollDirection.Vertical)
        .scrollBar(getAttributes(this.node).scrollBar)
        .defaultEvent()
        .onScroll(shouldBindEvent(() => { this.handleScrollEvent('scroll') }, this.node, ['scroll']))
        .onScrollStart(shouldBindEvent(() => { this.handleScrollEvent('scrollstart') }, this.node, ['scrollstart']))
        .onScrollStop(shouldBindEvent(() => { this.handleScrollEvent('scrollend') }, this.node, ['scrollend']))
        .visibleChangeEvent()
      }
    }
  }
}
