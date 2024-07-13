import { eventHandler, getComponentEventCallback, AREA_CHANGE_EVENT_NAME, VISIBLE_CHANGE_EVENT_NAME, createTaroEvent } from '@tarojs/runtime'

import commonStyleModify from './style'
import { TOUCH_EVENT_MAP } from './utils/constant/event'
import { getNodeThresholds, shouldBindEvent } from './utils/helper'

import type { TaroAny, TaroEvent, TaroScrollViewElement } from '@tarojs/runtime'

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

function getAttributes (node: TaroScrollViewElement): ScrollViewAttrs {
  const _attrs = node._attrs
  const scrollAttrs: ScrollViewAttrs = {
    scrollBar: typeof _attrs.showScrollbar === 'boolean'
      ? _attrs.showScrollbar ? BarState.On : BarState.Off
      : BarState.Auto
  }
  return scrollAttrs
}

function handleScrollEvent (node: TaroScrollViewElement, eventName = 'scroll', scrollOffset?: number) {
  if (!node || !node.scroller) return
  
  const currentOffset = node.scroller.currentOffset() as ScrollViewCurrentOffset

  if (!currentOffset) return

  const currentXOffset = currentOffset?.xOffset || 0
  const currentYOffset = currentOffset?.yOffset || 0
  const value: ScrollViewEvent = {
    deltaX: vp2px(node._attrs.scrollX ? scrollOffset : 0),
    deltaY: vp2px(node._attrs.scrollX ? 0 : scrollOffset),
    scrollLeft: vp2px(currentXOffset),
    scrollTop: vp2px(currentYOffset),
    scrollWidth: vp2px(Number(node._nodeInfo?._scroll?.width)),
    scrollHeight: vp2px(Number(node._nodeInfo?._scroll?.height)),
  }
  const event: TaroEvent = createTaroEvent(eventName, { detail: value }, node)

  eventHandler(event, eventName, node)
}

@Component
export default struct TaroScrollList {
  @Builder customBuilder() {}
  @BuilderParam createLazyChildren: (node: TaroScrollViewElement, layer?: number) => void = this.customBuilder
  @ObjectLink node: TaroScrollViewElement
  @State overwriteStyle: Record<string, TaroAny> = {}

  aboutToAppear(): void {
    if (this.node) {
      this.node._instance = this
    }
  }

  handleScroll = (scrollOffset: number) => {
    handleScrollEvent(this.node, 'scroll', scrollOffset)
  }

  build() {
    List({
      scroller: this.node.scroller
    }) {
      this.createLazyChildren(this.node, 0)
    }
    .attributeModifier(commonStyleModify.setNode(this.node).setAnimationStyle(this.overwriteStyle))
    .sticky(StickyStyle.Header)
    .listDirection(this.node.getAttribute('scrollX') ? Axis.Horizontal: Axis.Vertical)
    .align(Alignment.TopStart)
    .clip(true)
    .scrollBar(getAttributes(this.node).scrollBar)
    .onScrollIndex((first: number, last: number) => {
      const scrollindexfns = (this.node?.__listeners?.['scrollindex'] || []) as Function[]
      scrollindexfns.forEach(fn => {
        fn({
          first,
          last
        })
      })
    })
    .onClick(shouldBindEvent((e: ClickEvent) => { eventHandler(e, 'click', this.node) }, this.node, ['click']))
    .onTouch(shouldBindEvent((e: TouchEvent) => { eventHandler(e, TOUCH_EVENT_MAP.get(e.type), this.node) }, this.node, TOUCH_EVENT_MAP.values()))
    .onAreaChange(getComponentEventCallback(this.node, AREA_CHANGE_EVENT_NAME, (res: TaroAny) => {
      this.node._nodeInfo.areaInfo = res[1]
    }))
    .onDidScroll(shouldBindEvent((scrollOffset: number) => { handleScrollEvent(this.node, 'scroll', scrollOffset) }, this.node, ['scroll']))
    .onScrollStart(shouldBindEvent(() => { handleScrollEvent(this.node, 'scrollstart') }, this.node, ['scrollstart']))
    .onScrollStop(shouldBindEvent(() => { handleScrollEvent(this.node, 'scrollend') }, this.node, ['scrollend']))
    .onVisibleAreaChange(getNodeThresholds(this.node) || [0.0, 1.0], getComponentEventCallback(this.node, VISIBLE_CHANGE_EVENT_NAME))
    .onReachEnd(shouldBindEvent(() => { handleScrollEvent(this.node, 'scrolltolower') }, this.node, ['scrolltolower']))
  }
}


