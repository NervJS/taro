import { eventHandler, getComponentEventCallback, AREA_CHANGE_EVENT_NAME, VISIBLE_CHANGE_EVENT_NAME, createTaroEvent } from '@tarojs/runtime'

import commonStyleModify from './style'
import PseduoChildren from './pseudo'
import { FlexManager } from './utils/flexManager'
import { TOUCH_EVENT_MAP } from './utils/constant/event'
import { getNodeThresholds, getStyleAttr, shouldBindEvent } from './utils/helper'

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

function getScrollable (node: TaroScrollViewElement) {
  const _attrs = node._attrs
  if (node?.hmStyle?.overflow === "scroll" || node?.hmStyle?.overflow === "auto") {
    return ScrollDirection.Vertical
  }
  if (_attrs.scrollX) {
    return ScrollDirection.Horizontal
  } else if (_attrs.scrollY) {
    return ScrollDirection.Vertical
  } else {
    return ScrollDirection.None
  }
}

function handleScrollEvent (node: TaroScrollViewElement, eventName = 'scroll', xOffset?: number, yOffset?: number) {
  if (!node || !node.scroller) return

  const currentOffset = node.scroller.currentOffset() as ScrollViewCurrentOffset

  if (!currentOffset) return

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
  @BuilderParam createLazyChildren: (node: TaroScrollViewElement, layer?: number) => void = this.customBuilder
  @ObjectLink node: TaroScrollViewElement
  @State overwriteStyle: Record<string, TaroAny> = {}

  aboutToAppear(): void {
    if (this.node) {
      this.node._instance = this
    }
  }

  isScrollX() {
    return this.node._attrs.scrollX || getStyleAttr(this.node, 'overflow') === 'scroll' && getStyleAttr(this.node, 'flexDirection') === FlexDirection.Row
  }

  build () {
    Scroll(this.node.scroller) {
      if (this.isScrollX()) {
        Row() {
          if (this.node._pseudo_before || this.node._pseudo_after) {
            PseduoChildren({ node: this.node, createLazyChildren: this.createLazyChildren })
          } else {
            this.createLazyChildren(this.node, 0)
          }
        }
        .alignItems(FlexManager.alignItems<VerticalAlign>(this.node))
        .justifyContent(FlexManager.justifyContent(this.node))
        .height(getStyleAttr(this.node, 'height'))
        .width(null)
        .onAreaChange(shouldBindEvent((_: Area, areaResult: Area) => {
          this.node._nodeInfo._scroll = areaResult
        }, this.node, ['scroll', 'scrollstart', 'scrollend']))
        .flexGrow(0).flexShrink(0)
      } else {
        Column() {
          if (this.node._pseudo_before || this.node._pseudo_after) {
            PseduoChildren({ node: this.node, createLazyChildren: this.createLazyChildren })
          } else {
            this.createLazyChildren(this.node, 0)
          }
        }
        .alignItems(FlexManager.alignItems<HorizontalAlign>(this.node))
        .justifyContent(FlexManager.justifyContent(this.node))
        .width(getStyleAttr(this.node, 'width'))
        .height(null)
        .onAreaChange(shouldBindEvent((_: Area, areaResult: Area) => {
          this.node._nodeInfo._scroll = areaResult
        }, this.node, ['scroll', 'scrollstart', 'scrollend']))
        .flexGrow(0).flexShrink(0)
      }
    }
    .attributeModifier(commonStyleModify.setNode(this.node).setAnimationStyle(this.overwriteStyle))
    .width(this.isScrollX() ? getStyleAttr(this.node, 'width') : undefined)
    .height(!this.isScrollX() ? getStyleAttr(this.node, 'height') : undefined)
    .align(Alignment.TopStart)
    .clip(true)
    .scrollable(getScrollable(this.node))
    .scrollBar(getAttributes(this.node).scrollBar)
    .onClick(shouldBindEvent((e: ClickEvent) => { eventHandler(e, 'click', this.node) }, this.node, ['click']))
    .onTouch(shouldBindEvent((e: TouchEvent) => { eventHandler(e, TOUCH_EVENT_MAP.get(e.type), this.node) }, this.node, TOUCH_EVENT_MAP.values()))
    .onAreaChange(getComponentEventCallback(this.node, AREA_CHANGE_EVENT_NAME, (res: TaroAny) => {
      this.node._nodeInfo.areaInfo = res[1]
    }))
    .onDidScroll(shouldBindEvent((xOffset: number, yOffset: number) => { handleScrollEvent(this.node, 'scroll', xOffset, yOffset) }, this.node, ['scroll']))
    .onScrollStart(shouldBindEvent(() => { handleScrollEvent(this.node, 'scrollstart') }, this.node, ['scrollstart']))
    .onScrollStop(shouldBindEvent(() => { handleScrollEvent(this.node, 'scrollend') }, this.node, ['scrollend']))
    .onVisibleAreaChange(getNodeThresholds(this.node) || [0.0, 1.0], getComponentEventCallback(this.node, VISIBLE_CHANGE_EVENT_NAME))
    .onReachEnd(shouldBindEvent(() => { handleScrollEvent(this.node, 'scrolltolower') }, this.node, ['scrolltolower']))
  }
}
