import { eventHandler } from '@tarojs/runtime'

import TaroComponentWrapper from './base'
import { bindInstanceToNode, getNormalAttributes } from './utils/helper'

import type { TaroViewElement } from '@tarojs/runtime'

@Extend(RichText)
function attrs ({
  size,
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
  .constraintSize(constraintSize)
  .size(size)
  .margin(margin)
  .padding(padding)
  .linearGradient(linearGradient)
  .zIndex(zIndex)
  .borderRadius(borderRadius)
  .opacity(opacity)
  .backgroundColor(backgroundColor)
  .backgroundImage(backgroundImage)
  .backgroundImageSize(backgroundImageSize)
}

@Component
struct TaroRichText {

  info: Area = null

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
      RichText(this.node._attrs.nodes) 
        .attrs(getNormalAttributes(this.node))
        .defaultEvent()
    }
  }
}

export default TaroRichText
