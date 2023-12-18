import { eventHandler, getComponentEventCallback, AREA_CHANGE_EVENT_NAME, VISIBLE_CHANGE_EVENT_NAME, createTaroEvent } from '@tarojs/runtime'

import { createLazyChildren } from './render'
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

@Extend(Row)
function rowAttrs (style: TaroStyleType) {
  .id(style.id)
  .key(style.id)
  .padding(style.padding)
  .margin(style.margin)
  .height(style.height)
  .constraintSize({
    minWidth: style?.constraintSize?.minWidth || style.width,
    minHeight: style?.constraintSize?.minHeight,
    maxWidth: style?.constraintSize?.maxWidth,
    maxHeight: style?.constraintSize?.maxHeight,
  })
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
  .constraintSize({
    minWidth: style?.constraintSize?.minWidth,
    minHeight: style?.constraintSize?.minHeight || style.height,
    maxWidth: style?.constraintSize?.maxWidth,
    maxHeight: style?.constraintSize?.maxHeight,
  })
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

function getScrollable (node: TaroScrollViewElement) {
  const _attrs = node._attrs

  return _attrs.scrollX ? ScrollDirection.Horizontal : ScrollDirection.Vertical
}

function handleScrollEvent (node: TaroScrollViewElement, eventName = 'scroll', xOffset?: number, yOffset?: number) {
  const currentOffset: ScrollViewCurrentOffset = node.scroller.currentOffset()
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

@Builder
export default function TaroScrollView (node: TaroScrollViewElement) {
    Scroll(node.scroller) {
      if (node._attrs.scrollX) {
        Row() {
          createLazyChildren(node)
        }
        .width(null)
        .rowAttrs(getNormalAttributes(node))
        .onAreaChange(shouldBindEvent((areaResult: Area) => {
          node._scroll = areaResult
        }, node, ['scroll', 'scrollstart', 'scrollend']))
      } else {
        Column() {
          createLazyChildren(node)
        }
        .height(null)
        .columnAttrs(getNormalAttributes(node))
        .alignItems(HorizontalAlign.Start)
        .onAreaChange(shouldBindEvent((areaResult: Area) => {
          node._scroll = areaResult
        }, node, ['scroll', 'scrollstart', 'scrollend']))
      }
    }
    .width(getNormalAttributes(node).width)
    .height(getNormalAttributes(node).height)
    .flexGrow(getNormalAttributes(node).flexGrow)
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
