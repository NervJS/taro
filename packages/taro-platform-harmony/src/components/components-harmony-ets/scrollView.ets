import { eventHandler } from '../runtime'

import { createNode } from './render'
import TaroComponentWrapper from './base'
import { createTaroEvent } from './utils/events'
import { bindInstanceToNode, getNormalAttributes, converVP2PX } from './utils/helper'

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
 constraintSize
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
 constraintSize
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
}

@Component
struct TaroScrollView {
  info: Area = null

  @State thresholds: number[] = []

  @Styles visibleChangeEvent () {
    .onVisibleAreaChange(this.thresholds || [0.0, 1.0], (isVisible: boolean, currentRatio: number) => {
      this.visableChange(isVisible, currentRatio)
    })
  }

  scroller: Scroller = new Scroller()

  @ObjectLink node: TaroViewElement

  aboutToAppear () {
    bindInstanceToNode(this.node, this)
  }

  @Styles defaultEvent () {
    .onClick((e: ClickEvent) => eventHandler(e, 'click', this.node))
    .onAreaChange((_: Area, areaResult: Area) => {
      this.info = areaResult
    })
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
            .attrs(getNormalAttributes(this.node))
            .height(getNormalAttributes(this.node).size.height)
          }
          .width(getNormalAttributes(this.node).size.width)
          .scrollable(ScrollDirection.Horizontal)
          .defaultEvent()
          .onScroll((xOffset: number, yOffset: number) => {
            const { xOffset: currentXOffset, yOffset: currentYOffset } = this.scroller.currentOffset()
            const value = {
              deltaX: converVP2PX(xOffset),
              deltaY: converVP2PX(yOffset),
              scrollLeft: converVP2PX(currentXOffset),
              scrollHeight: converVP2PX(currentYOffset)
            }
            const event = createTaroEvent('scroll', { detail: { ...value } }, this.node)
            eventHandler(event, 'scroll', this.node)
          })
        } else {
          Scroll(this.scroller) {
            Column() {
              ForEach(this.node.childNodes, item => {
                createNode(item)
              }, item => item._nid)
            }
            .width(getNormalAttributes(this.node).size.width)
            .attrs(getNormalAttributes(this.node))
          }
          .height(getNormalAttributes(this.node).size.height)
          .scrollable(ScrollDirection.Vertical)
          .defaultEvent()
          .onScroll((xOffset: number, yOffset: number) => {
            const { xOffset: currentXOffset, yOffset: currentYOffset } = this.scroller.currentOffset()
            const value = {
              deltaX: converVP2PX(xOffset),
              deltaY: converVP2PX(yOffset),
              scrollLeft: converVP2PX(currentXOffset),
              scrollHeight: converVP2PX(currentYOffset)
            }
            const event = createTaroEvent('scroll', { detail: { ...value } }, this.node)
            eventHandler(event, 'scroll', this.node)
          })
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
            .attrs(getNormalAttributes(this.node))
            .height(getNormalAttributes(this.node).size.height)
          }
          .width(getNormalAttributes(this.node).size.width)
          .scrollable(ScrollDirection.Horizontal)
          .defaultEvent()
          .onScroll((xOffset: number, yOffset: number) => {
            const { xOffset: currentXOffset, yOffset: currentYOffset } = this.scroller.currentOffset()
            const value = {
              deltaX: converVP2PX(xOffset),
              deltaY: converVP2PX(yOffset),
              scrollLeft: converVP2PX(currentXOffset),
              scrollHeight: converVP2PX(currentYOffset)
            }
            const event = createTaroEvent('scroll', { detail: { ...value } }, this.node)
            eventHandler(event, 'scroll', this.node)
          })
          .visibleChangeEvent()
        } else {
          Scroll(this.scroller) {
            Column() {
              ForEach(this.node.childNodes, item => {
                createNode(item)
              }, item => item._nid)
            }
            .width(getNormalAttributes(this.node).size.width)
            .attrs(getNormalAttributes(this.node))
          }
          .height(getNormalAttributes(this.node).size.height)
          .scrollable(ScrollDirection.Vertical)
          .defaultEvent()
          .onScroll((xOffset: number, yOffset: number) => {
            const { xOffset: currentXOffset, yOffset: currentYOffset } = this.scroller.currentOffset()
            const value = {
              deltaX: converVP2PX(xOffset),
              deltaY: converVP2PX(yOffset),
              scrollLeft: converVP2PX(currentXOffset),
              scrollHeight: converVP2PX(currentYOffset)
            }
            const event = createTaroEvent('scroll', { detail: { ...value } }, this.node)
            eventHandler(event, 'scroll', this.node)
          })
          .visibleChangeEvent()
        }
      }
    }
  }
}

export default TaroScrollView
