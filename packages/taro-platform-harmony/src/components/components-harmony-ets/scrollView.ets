import { eventHandler } from '../runtime'

import { createNode } from './render'
import TaroComponentWrapper from './base'
import { bindInstanceToNode, getNormalAttributes } from './utils/helper'

import type { TaroViewElement } from '../runtime'

@Extend(Row)
function attrs ({
 margin,
 padding,
 linearGradient,
 zIndex,
 borderRadius,
 opacity,
 backgroundColor,
 backgroundImage,
 backgroundImageSize,
}) {
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
      } else {
        Scroll(this.scroller) {
          Row() {
            ForEach(this.node.childNodes, item => {
              createNode(item)
            }, item => item._nid)
          }
          .width(getNormalAttributes(this.node).size.width)
          .attrs(getNormalAttributes(this.node))
        }
        .height(getNormalAttributes(this.node).size.height)
        .scrollable(ScrollDirection.Horizontal)
        .defaultEvent()
      }
    }
  }
}

export default TaroScrollView
