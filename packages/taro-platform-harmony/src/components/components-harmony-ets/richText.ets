import { eventHandler } from '@tarojs/runtime'

import TaroComponentWrapper from './base'
import { bindInstanceToNode, bindAnimation, getNormalAttributes, shouldBindEvent } from './utils/helper'

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
  constraintSize,
  rotate,
  scale,
  translate,
  transform
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
  .rotate(rotate)
  .scale(scale)
  .translate(translate)
  .transform(transform)
}

@Component
struct TaroRichText {

  info: Area = null

  @State overwriteStyle: Record<string, any> = {}

  @ObjectLink node: TaroViewElement

  aboutToAppear () {
    bindInstanceToNode(this.node, this)
    // 绑定动画
    bindAnimation(this.node, (rule) => {
      this.overwriteStyle = rule
    })
  }

  @Styles defaultEvent () {
    .onClick(shouldBindEvent((e: ClickEvent) => eventHandler(e, 'click', this.node), this.node, ['click']))
    .onAreaChange((_: Area, areaResult: Area) => {
      this.info = areaResult
    })
  }

  build() {
    TaroComponentWrapper({ node: this.node }) {
      RichText(this.node._attrs.nodes) 
        .attrs(getNormalAttributes(this.node, this.overwriteStyle))
        .defaultEvent()
    }
  }
}

export default TaroRichText
