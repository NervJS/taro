import { eventHandler, getComponentEventCallback, AREA_CHANGE_EVENT_NAME } from '@tarojs/runtime'

import { createNode } from './render'
import TaroComponentWrapper from './base'
import { TOUCH_EVENT_MAP } from './utils/constant/event'
import { createTaroEvent } from './utils/events'
import { bindInstanceToNode, bindAnimation, convertVP2PX, getNormalAttributes, shouldBindEvent, getNodeVisibleChange } from './utils/helper'

import type { TaroScrollViewElement, TaroViewElement } from '../runtime'

@Extend(Row)
function attrs ({
  id,
  flexBasis,
  flexGrow,
  flexShrink,
  alignSelf,
  clip,
  width,
  height,
  margin,
  padding,
  linearGradient,
  zIndex,
  borderStyle,
  borderWidth,
  borderColor,
  borderRadius,
  opacity,
  backgroundColor,
  backgroundImage,
  backgroundRepeat,
  backgroundImageSize,
  constraintSize,
  rotate,
  scale,
  translate,
  transform,
}) {
  .id(id)
  .flexGrow(flexGrow)
  .flexShrink(flexShrink)
  .flexBasis(flexBasis)
  .alignSelf(alignSelf)
  .width(width)
  .height(height)
  .constraintSize(constraintSize)
  .margin(margin)
  .padding(padding)
  .linearGradient(linearGradient)
  .zIndex(zIndex)
  .borderStyle(borderStyle)
  .borderWidth(borderWidth)
  .borderColor(borderColor)
  .borderRadius(borderRadius)
  .opacity(opacity)
  .backgroundColor(backgroundColor)
  .backgroundImage(backgroundImage, backgroundRepeat)
  .backgroundImageSize(backgroundImageSize)
  .rotate(rotate)
  .scale(scale)
  .translate(translate)
  .transform(transform)
  .clip(clip)
}
@Extend(Column)
function attrs ({
  id,
  flexBasis,
  flexGrow,
  flexShrink,
  alignSelf,
  clip,
  width,
  height,
  margin,
  padding,
  linearGradient,
  zIndex,
  borderStyle,
  borderWidth,
  borderColor,
  borderRadius,
  opacity,
  backgroundColor,
  backgroundImage,
  backgroundRepeat,
  backgroundImageSize,
  constraintSize,
  rotate,
  scale,
  translate,
  transform,
}) {
  .id(id)
  .flexGrow(flexGrow)
  .flexShrink(flexShrink)
  .flexBasis(flexBasis)
  .alignSelf(alignSelf)
  .width(width)
  .height(height)
  .constraintSize(constraintSize)
  .margin(margin)
  .padding(padding)
  .linearGradient(linearGradient)
  .zIndex(zIndex)
  .borderStyle(borderStyle)
  .borderWidth(borderWidth)
  .borderColor(borderColor)
  .borderRadius(borderRadius)
  .opacity(opacity)
  .backgroundColor(backgroundColor)
  .backgroundImage(backgroundImage, backgroundRepeat)
  .backgroundImageSize(backgroundImageSize)
  .rotate(rotate)
  .scale(scale)
  .translate(translate)
  .transform(transform)
  .clip(clip)
}

function getAttributes (node: TaroViewElement) {
  const { _attrs = {} } = node
  return {
    showScrollbar: typeof _attrs.showScrollbar === 'boolean'
      ? _attrs.showScrollbar ? BarState.On : BarState.Off
      : BarState.Auto,
  }
}

function handleScrollEvent (eventName = 'scroll', xOffset?: number, yOffset?: number) {
    const { xOffset: currentXOffset, yOffset: currentYOffset } = this.scroller.currentOffset()
    const value = {
      deltaX: convertVP2PX(xOffset),
      deltaY: convertVP2PX(yOffset),
      scrollLeft: convertVP2PX(currentXOffset),
      scrollTop: convertVP2PX(currentYOffset),
      scrollWidth: convertVP2PX(this.wrapper?.width),
      scrollHeight: convertVP2PX(this.wrapper?.height),
    }
    const event = createTaroEvent(eventName, { detail: { ...value } }, this.node)
    eventHandler(event, eventName, this.node)
}

function bindScrollTo (node: TaroScrollViewElement, instance: object) {
  if (!node) return

  node._scrollToCb = () => {
    instance.scroller.scrollTo({
      xOffset: node._attrs.scrollLeft || 0,
      yOffset: node._attrs.scrollTop || 0,
    })
  }
}

@Component
struct TaroScrollView {
  nodeInfoMap: any = {}

  wrapper: Area = null

  @State thresholds: number[] | null = null

  @State overwriteStyle: Record<string, any> = {}

  @Styles visibleChangeEvent () {
    .onVisibleAreaChange(this.thresholds || [0.0, 1.0], getNodeVisibleChange(this))
  }

  scroller: Scroller = new Scroller()

  @ObjectLink node: TaroViewElement

  @State isAreaChangeTap: boolean = false

  aboutToAppear () {
    bindInstanceToNode(this.node, this)
    // 绑定动画
    bindAnimation(this.node, (rule) => {
      this.overwriteStyle = rule
    })
    bindScrollTo(this.node, this)

    this.nodeInfoMap[this.node._nid] = {}
    this.nodeInfoMap[this.node._nid].eventMap = {}
    this.nodeInfoMap[this.node._nid].promiseMap = {}
  }

  @Styles defaultEvent () {
    .onClick(shouldBindEvent((e: ClickEvent) => eventHandler(e, 'click', this.node), this.node, ['click']))
    .onTouch(shouldBindEvent((e: TouchEvent) => eventHandler(e, TOUCH_EVENT_MAP[e.type], this.node), this.node, Object.values(TOUCH_EVENT_MAP)))
    .onAreaChange(getComponentEventCallback(AREA_CHANGE_EVENT_NAME, this, ({ eventResult }) => {
      const [_, areaResult] = eventResult
      
      this.nodeInfoMap[this.node._nid].areaInfo = areaResult
    }))
  }

  @Styles defaultContainerEvent () {
    .onAreaChange(shouldBindEvent((areaResult: Area) => {
      this.wrapper = areaResult
    }, this.node, ['scroll', 'scrollstart', 'scrollend']))
  }

  build() {
    TaroComponentWrapper({ node: this.node }) {
      // Copy 额外增加visibleChangeEvent
      if (this.node._attrs.scrollX) {
        Scroll(this.scroller) {
          Row() {
            ForEach(this.node.childNodes, item => {
              createNode(item)
            }, item => item._nid)
          }
          .attrs(getNormalAttributes(this.node, this.overwriteStyle))
          .width(null)
          .defaultContainerEvent()
        }
        .flexGrow(getNormalAttributes(this.node).flexGrow)
        .scrollable(ScrollDirection.Horizontal)
        .scrollBar(getAttributes(this.node).showScrollbar)
        .defaultEvent()
        .onScroll(shouldBindEvent(handleScrollEvent.bind(this, 'scroll'), this.node, ['scroll']))
        .onScrollStart(shouldBindEvent(handleScrollEvent.bind(this, 'scrollstart'), this.node, ['scrollstart']))
        .onScrollStop(shouldBindEvent(handleScrollEvent.bind(this, 'scrollend'), this.node, ['scrollend']))
        .visibleChangeEvent()
      } else {
        Scroll(this.scroller) {
          Column() {
            ForEach(this.node.childNodes, item => {
              createNode(item)
            }, item => item._nid)
          }
          .attrs(getNormalAttributes(this.node, this.overwriteStyle))
          .height(null)
          .defaultContainerEvent()
        }
        .flexGrow(getNormalAttributes(this.node).flexGrow)
        .scrollable(ScrollDirection.Vertical)
        .scrollBar(getAttributes(this.node).showScrollbar)
        .defaultEvent()
        .onScroll(shouldBindEvent(handleScrollEvent.bind(this, 'scroll'), this.node, ['scroll']))
        .onScrollStart(shouldBindEvent(handleScrollEvent.bind(this, 'scrollstart'), this.node, ['scrollstart']))
        .onScrollStop(shouldBindEvent(handleScrollEvent.bind(this, 'scrollend'), this.node, ['scrollend']))
        .visibleChangeEvent()
      }
    }
  }
}

export default TaroScrollView
