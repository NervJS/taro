import { eventHandler } from '../runtime'

import { createNode } from './render'
import TaroComponentWrapper from './base'
import { createTaroEvent } from './utils/events'
import { bindInstanceToNode, bindAnimation, convertVP2PX, getNormalAttributes, shouldBindEvent, getNodeAreaChange } from './utils/helper'

import type { TaroViewElement } from '../runtime'

@Extend(Row)
function attrs ({
 flexSize,
 margin,
 padding,
 linearGradient,
 zIndex,
 borderRadius,
 opacity,
 backgroundColor,
 backgroundImage,
 backgroundImageSize,
 constraintSize,
 rotate,
 scale,
 translate,
 transform
}) {
  .flexGrow(flexSize[0])
  .constraintSize(constraintSize)
  .margin(margin)
  .zIndex(zIndex)
  .padding(padding)
  .opacity(opacity)
  .borderRadius(borderRadius)
  .linearGradient(linearGradient)
  .backgroundColor(backgroundColor)
  .backgroundImage(backgroundImage)
  .backgroundImageSize(backgroundImageSize)
  .rotate(rotate)
  .scale(scale)
  .translate(translate)
  .transform(transform)
}

@Extend(Column)
function attrs ({
 flexSize,
 margin,
 padding,
 linearGradient,
 zIndex,
 borderRadius,
 opacity,
 backgroundColor,
 backgroundImage,
 backgroundImageSize,
 constraintSize,
 rotate,
 scale,
 translate,
 transform
}) {
  .flexGrow(flexSize[0])
  .constraintSize(constraintSize)
  .margin(margin)
  .zIndex(zIndex)
  .padding(padding)
  .opacity(opacity)
  .borderRadius(borderRadius)
  .linearGradient(linearGradient)
  .backgroundColor(backgroundColor)
  .backgroundImage(backgroundImage)
  .backgroundImageSize(backgroundImageSize)
  .rotate(rotate)
  .scale(scale)
  .translate(translate)
  .transform(transform)
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
      scrollWidth: convertVP2PX(this.wrapper.width),
      scrollHeight: convertVP2PX(this.wrapper.height),
    }
    const event = createTaroEvent(eventName, { detail: { ...value } }, this.node)
    eventHandler(event, eventName, this.node)
}

@Component
struct TaroScrollView {
  info: Area = null
  wrapper: Area = null

  @State thresholds: number[] = []

  @State overwriteStyle: Record<string, any> = {}

  @Styles visibleChangeEvent () {
    .onVisibleAreaChange(this.thresholds || [0.0, 1.0], (isVisible: boolean, currentRatio: number) => {
      this.visableChange?.(isVisible, currentRatio)
    })
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
  }

  @Styles defaultEvent () {
    .onClick(shouldBindEvent((e: ClickEvent) => eventHandler(e, 'click', this.node), this.node, ['click']))
    .onAreaChange(getNodeAreaChange((areaResult: Area) => {
      this.info = areaResult
    }, this))
  }

  @Styles defaultContainerEvent () {
    .onAreaChange(shouldBindEvent((areaResult: Area) => {
      this.wrapper = areaResult
    }, this.node, ['scroll', 'scrollstart', 'scrollend']))
  }

  build() {
    TaroComponentWrapper({ node: this.node }) {
      // Copy 额外增加visibleChangeEvent
      if (!this.thresholds.length) {
        if (this.node._attrs.scrollX) {
          Scroll(this.scroller) {
            Row() {
              ForEach(this.node.childNodes, item => {
                createNode(item)
              }, item => item._nid)
            }
            .attrs(getNormalAttributes(this.node, this.overwriteStyle))
            .height(getNormalAttributes(this.node).size.height)
            .defaultContainerEvent()
          }
          .width(getNormalAttributes(this.node).size.width)
          .flexGrow(getNormalAttributes(this.node).flexSize[0])
          .scrollable(ScrollDirection.Horizontal)
          .scrollBar(getAttributes(this.node).showScrollbar)
          .defaultEvent()
          .onScroll(handleScrollEvent.bind(this, 'scroll'))
          .onScrollStart(handleScrollEvent.bind(this, 'scrollStart'))
          .onScrollStop(handleScrollEvent.bind(this, 'scrollEnd'))
        } else {
          Scroll(this.scroller) {
            Column() {
              ForEach(this.node.childNodes, item => {
                createNode(item)
              }, item => item._nid)
            }
            .width(getNormalAttributes(this.node).size.width)
            .attrs(getNormalAttributes(this.node, this.overwriteStyle))
            .defaultContainerEvent()
          }
          .height(getNormalAttributes(this.node).size.height)
          .flexGrow(getNormalAttributes(this.node).flexSize[0])
          .scrollable(ScrollDirection.Vertical)
          .scrollBar(getAttributes(this.node).showScrollbar)
          .defaultEvent()
          .onScroll(handleScrollEvent.bind(this, 'scroll'))
          .onScrollStart(handleScrollEvent.bind(this, 'scrollStart'))
          .onScrollStop(handleScrollEvent.bind(this, 'scrollEnd'))
        }
      }
      else {
        if (this.node._attrs.scrollX) {
          Scroll(this.scroller) {
            Row() {
              ForEach(this.node.childNodes, item => {
                createNode(item)
              }, item => item._nid)
            }
            .attrs(getNormalAttributes(this.node, this.overwriteStyle))
            .height(getNormalAttributes(this.node).size.height)
            .defaultContainerEvent()
          }
          .width(getNormalAttributes(this.node).size.width)
          .scrollable(ScrollDirection.Horizontal)
          .scrollBar(getAttributes(this.node).showScrollbar)
          .defaultEvent()
          .onScroll(handleScrollEvent.bind(this, 'scroll'))
          .onScrollStart(handleScrollEvent.bind(this, 'scrollStart'))
          .onScrollStop(handleScrollEvent.bind(this, 'scrollEnd'))
          .visibleChangeEvent()
        } else {
          Scroll(this.scroller) {
            Column() {
              ForEach(this.node.childNodes, item => {
                createNode(item)
              }, item => item._nid)
            }
            .width(getNormalAttributes(this.node).size.width)
            .attrs(getNormalAttributes(this.node, this.overwriteStyle))
            .defaultContainerEvent()
          }
          .height(getNormalAttributes(this.node).size.height)
          .scrollable(ScrollDirection.Vertical)
          .scrollBar(getAttributes(this.node).showScrollbar)
          .defaultEvent()
          .onScroll(handleScrollEvent.bind(this, 'scroll'))
          .onScrollStart(handleScrollEvent.bind(this, 'scrollStart'))
          .onScrollStop(handleScrollEvent.bind(this, 'scrollEnd'))
          .visibleChangeEvent()
        }
      }
    }
  }
}

export default TaroScrollView
