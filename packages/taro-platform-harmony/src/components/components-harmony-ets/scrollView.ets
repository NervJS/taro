import { eventHandler, getComponentEventCallback, AREA_CHANGE_EVENT_NAME, VISIBLE_CHANGE_EVENT_NAME, createTaroEvent } from '@tarojs/runtime'

import commonStyleModify from './style'
import { createLazyChildren } from './render'
import { FlexManager } from './utils/FlexManager'
import { TOUCH_EVENT_MAP } from './utils/constant/event'
import { getNodeThresholds, getNormalAttributes, shouldBindEvent } from './utils/helper'

import type { TaroAny, TaroStyleType, TaroScrollViewElement, TaroEvent } from '@tarojs/runtime'

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
    scrollWidth: vp2px(Number(node._scroll?.width)),
    scrollHeight: vp2px(Number(node._scroll?.height)),
  }
  const event: TaroEvent = createTaroEvent(eventName, { detail: value }, node)

  eventHandler(event, eventName, node)
}

@Extend(Row)
function rowAttrs (style: TaroStyleType) {
  .constraintSize({
    minWidth: style.minWidth || style.width,
    maxWidth: style.maxWidth,
    minHeight: style.minHeight,
    maxHeight: style.maxHeight
  })
}

@Extend(Column)
function columnAttrs (style: TaroStyleType) {
  .constraintSize({
    minWidth: style.minWidth,
    maxWidth: style.maxWidth,
    minHeight: style.minHeight || style.height,
    maxHeight: style.maxHeight
  })
}

@Builder
export default function TaroScrollView (node: TaroScrollViewElement) {
    Scroll(node.scroller) {
      if (node._attrs.scrollX) {
        Row() {
          createLazyChildren(node)
        }
        .attributeModifier(commonStyleModify.setNode(node))
        .rowAttrs(getNormalAttributes(node))
        .width(null)
        .onAreaChange(shouldBindEvent((_: Area, areaResult: Area) => {
          node._scroll = areaResult
        }, node, ['scroll', 'scrollstart', 'scrollend']))
        .alignItems(FlexManager.flexOptions(node).alignItems as VerticalAlign)
        .justifyContent(FlexManager.flexOptions(node).justifyContent)
        .flexGrow(0).flexShrink(0)
      } else {
        Column() {
          createLazyChildren(node)
        }
        .attributeModifier(commonStyleModify.setNode(node))
        .columnAttrs(getNormalAttributes(node))
        .height(null)
        .alignItems(HorizontalAlign.Start)
        .onAreaChange(shouldBindEvent((_: Area, areaResult: Area) => {
          node._scroll = areaResult
        }, node, ['scroll', 'scrollstart', 'scrollend']))
        .alignItems(FlexManager.flexOptions(node).alignItems as HorizontalAlign)
        .justifyContent(FlexManager.flexOptions(node).justifyContent)
        .flexGrow(0).flexShrink(0)
      }
    }
    .width(getNormalAttributes(node).width)
    .height(getNormalAttributes(node).height)
    .flexGrow(getNormalAttributes(node).flexGrow)
    .flexShrink(getNormalAttributes(node).flexShrink)
    .scrollable(getScrollable(node))
    .scrollBar(getAttributes(node).scrollBar)
    .onClick(shouldBindEvent((e: ClickEvent) => eventHandler(e, 'click', node), node, ['click']))
    .onTouch(shouldBindEvent((e: TouchEvent) => eventHandler(e, TOUCH_EVENT_MAP.get(e.type), node), node, TOUCH_EVENT_MAP.values()))
    .onAreaChange(getComponentEventCallback(node, AREA_CHANGE_EVENT_NAME, (res: TaroAny) => {
      node._nodeInfo.areaInfo = res[1]
    }))
    .onScroll(shouldBindEvent(() => { handleScrollEvent(node, 'scroll') }, node, ['scroll']))
    .onScrollStart(shouldBindEvent(() => { handleScrollEvent(node, 'scrollstart') }, node, ['scrollstart']))
    .onScrollStop(shouldBindEvent(() => { handleScrollEvent(node, 'scrollend') }, node, ['scrollend']))
    .onVisibleAreaChange(getNodeThresholds(node) || [0.0, 1.0], getComponentEventCallback(node, VISIBLE_CHANGE_EVENT_NAME))
}
