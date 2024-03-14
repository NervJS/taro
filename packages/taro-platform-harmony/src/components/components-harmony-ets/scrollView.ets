import { eventHandler, getComponentEventCallback, AREA_CHANGE_EVENT_NAME, VISIBLE_CHANGE_EVENT_NAME, createTaroEvent } from '@tarojs/runtime'

import { rowModify, columnModify } from './style'
import PseduoChildren from './pseudo'
import { FlexManager } from './utils/FlexManager'
import { TOUCH_EVENT_MAP } from './utils/constant/event'
import { getNodeThresholds, getStyleAttr, shouldBindEvent } from './utils/helper'

import type { TaroAny, TaroScrollViewElement, TaroEvent } from '@tarojs/runtime'

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

function getScrollable (node: TaroScrollViewElement) {
  const _attrs = node._attrs

  return _attrs.scrollX ? ScrollDirection.Horizontal : ScrollDirection.Vertical
}

function handleScrollEvent (node: TaroScrollViewElement, eventName = 'scroll', xOffset?: number, yOffset?: number) {
  const currentOffset = node.scroller.currentOffset() as ScrollViewCurrentOffset
  const currentXOffset = currentOffset.xOffset
  const currentYOffset = currentOffset.yOffset
  const value: ScrollViewEvent = {
    deltaX: vp2px(xOffset),
    deltaY: vp2px(yOffset),
    scrollLeft: vp2px(currentXOffset),
    scrollTop: vp2px(currentYOffset),
    scrollWidth: vp2px(Number(node._nodeInfo?._scroll?.width)),
    scrollHeight: vp2px(Number(node._nodeInfo?._scroll?.height)),
  }
  const event: TaroEvent = createTaroEvent(eventName, { detail: value }, node)

  eventHandler(event, eventName, node)
}

@Component
export default struct TaroScrollView {
  @Builder customBuilder() {}
  @BuilderParam createLazyChildren: (node: TaroScrollViewElement) => void = this.customBuilder
  @ObjectLink node: TaroScrollViewElement

  build () {
    if (this.node.hmStyle?.display !== 'none') {
      Scroll(this.node.scroller) {
        if (this.node._attrs.scrollX) {
          Row() {
            if (this.node._pseudo_before || this.node._pseudo_after) {
              PseduoChildren({ node: this.node, createLazyChildren: this.createLazyChildren })
            } else {
              this.createLazyChildren(this.node)
            }
          }
          .attributeModifier(rowModify.setNode(this.node))
          .width(null)
          .onAreaChange(shouldBindEvent((_: Area, areaResult: Area) => {
            this.node._nodeInfo._scroll = areaResult
          }, this.node, ['scroll', 'scrollstart', 'scrollend']))
          .alignItems(FlexManager.flexOptions(this.node).alignItems as VerticalAlign)
          .justifyContent(FlexManager.flexOptions(this.node).justifyContent)
          .flexGrow(0).flexShrink(0)
        } else {
          Column() {
            if (this.node._pseudo_before || this.node._pseudo_after) {
              PseduoChildren({ node: this.node, createLazyChildren: this.createLazyChildren })
            } else {
              this.createLazyChildren(this.node)
            }
          }
          .attributeModifier(columnModify.setNode(this.node))
          .height(null)
          .alignItems(HorizontalAlign.Start)
          .onAreaChange(shouldBindEvent((_: Area, areaResult: Area) => {
            this.node._nodeInfo._scroll = areaResult
          }, this.node, ['scroll', 'scrollstart', 'scrollend']))
          .alignItems(FlexManager.flexOptions(this.node).alignItems as HorizontalAlign)
          .justifyContent(FlexManager.flexOptions(this.node).justifyContent)
          .flexGrow(0).flexShrink(0)
        }
      }
      .width(getStyleAttr(this.node, 'width'))
      .height(getStyleAttr(this.node, 'height'))
      .flexGrow(this.node.hmStyle?.flexGrow)
      .flexShrink(this.node.hmStyle?.flexShrink)
      .scrollable(getScrollable(this.node))
      .scrollBar(getAttributes(this.node).scrollBar)
      .onClick(shouldBindEvent((e: ClickEvent) => eventHandler(e, 'click', this.node), this.node, ['click']))
      .onTouch(shouldBindEvent((e: TouchEvent) => eventHandler(e, TOUCH_EVENT_MAP.get(e.type), this.node), this.node, TOUCH_EVENT_MAP.values()))
      .onAreaChange(getComponentEventCallback(this.node, AREA_CHANGE_EVENT_NAME, (res: TaroAny) => {
        this.node._nodeInfo.areaInfo = res[1]
      }))
      .onScroll(shouldBindEvent(() => { handleScrollEvent(this.node, 'scroll') }, this.node, ['scroll']))
      .onScrollStart(shouldBindEvent(() => { handleScrollEvent(this.node, 'scrollstart') }, this.node, ['scrollstart']))
      .onScrollStop(shouldBindEvent(() => { handleScrollEvent(this.node, 'scrollend') }, this.node, ['scrollend']))
      .onVisibleAreaChange(getNodeThresholds(this.node) || [0.0, 1.0], getComponentEventCallback(this.node, VISIBLE_CHANGE_EVENT_NAME))
      .onReachEnd(shouldBindEvent(() => { handleScrollEvent(this.node, 'scrolltolower') }, this.node, ['scrolltolower']))
    }
  }
}
