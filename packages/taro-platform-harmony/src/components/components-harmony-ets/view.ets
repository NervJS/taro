import { eventHandler } from '@tarojs/runtime'

import { createNode } from './render'
import TaroComponentWrapper from './base'
import { TOUCH_EVENT_MAP } from './utils/constant/event'
import { FlexManager } from './utils/FlexManager'
import { bindInstanceToNode, getNormalAttributes, shouldBindEvent } from './utils/helper'

import type { TaroViewElement } from '@tarojs/runtime'

@Extend(Flex)
function attrs ({
  flexSize,
  alignSelf,
  size,
  margin,
  padding,
  linearGradient,
  zIndex,
  border,
  borderRadius,
  opacity,
  backgroundColor,
  backgroundImage,
  backgroundImageSize,
  constraintSize
 }) {
  .constraintSize(constraintSize)
  .flexGrow(flexSize[0])
  .flexShrink(flexSize[1])
  .flexBasis(flexSize[2])
  .alignSelf(alignSelf)
  .size(size)
  .margin(margin)
  .padding(padding)
  .linearGradient(linearGradient)
  .zIndex(zIndex)
  .border(border)
  .borderRadius(borderRadius)
  .opacity(opacity)
  .backgroundColor(backgroundColor)
  .backgroundImage(backgroundImage)
  .backgroundImageSize(backgroundImageSize)
}

@Component
struct TaroView {
  info: Area = null

  @State thresholds: number[] = []

  @Styles visibleChangeEvent () {
    .onVisibleAreaChange(this.thresholds || [0.0, 1.0], (isVisible: boolean, currentRatio: number) => {
      this.visableChange(isVisible, currentRatio)
    })
  }

  @ObjectLink node: TaroViewElement

  aboutToAppear () {
    bindInstanceToNode(this.node, this)
  }

  @Styles defaultEvent () {
    .onClick(shouldBindEvent((e: ClickEvent) => eventHandler(e, 'click', this.node), this.node, ['click']))
    .onTouch(shouldBindEvent((e: TouchEvent) => eventHandler(e, TOUCH_EVENT_MAP[e.type], this.node), this.node, Object.values(TOUCH_EVENT_MAP)))
    .onAreaChange((_: Area, areaResult: Area) => {
      this.info = areaResult
    })
  }
  build() {
    TaroComponentWrapper({ node: this.node }) {
      if (!this.thresholds.length) {
        Flex(FlexManager.flexOptions(this.node)) {
          ForEach(this.node.childNodes, item => {
            createNode(item)
          }, item => item._nid)
        }
        .attrs(getNormalAttributes(this.node))
        .defaultEvent()
        .clip(true)
      } else {
        Flex(FlexManager.flexOptions(this.node)) {
          ForEach(this.node.childNodes, item => {
            createNode(item)
          }, item => item._nid)
        }
        .attrs(getNormalAttributes(this.node))
        .defaultEvent()
        .clip(true)
        .visibleChangeEvent()
      }
    }
  }
}

export default TaroView
