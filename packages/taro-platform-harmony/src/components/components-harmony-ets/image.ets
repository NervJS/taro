import { eventHandler } from '@tarojs/runtime'

import TaroComponentWrapper from './base'
import { bindInstanceToNode, bindAnimation, getNormalAttributes, shouldBindEvent, getNodeAreaChange } from './utils/helper'

import type { TaroImageElement } from '@tarojs/runtime'

@Extend(Image)
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


@Component
struct TaroImage {
  info: Area = null

  @State thresholds: number[] = []

  @State isAreaChangeTap: boolean = false

  @State overwriteStyle: Record<string, any> = {}

  @Styles visibleChangeEvent () {
    .onVisibleAreaChange(this.thresholds || [0.0, 1.0], (isVisible: boolean, currentRatio: number) => {
      this.visibleChange?.(isVisible, currentRatio)
    })
  }

  @ObjectLink node: TaroImageElement

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

  @Styles defaultEvent () {
    .onClick(shouldBindEvent((e: ClickEvent) => eventHandler(e, 'click', this.node), this.node, ['click']))
  }

  build() {
    TaroComponentWrapper({ node: this.node }) {
      if (!this.thresholds.length) {
        Image(this.node.getAttribute('src'))
        .defaultEvent()
        .objectFit(ImageFit.Contain)
        .attrs(getNormalAttributes(this.node, this.overwriteStyle))
        .onComplete(e => eventHandler(e, 'complete', this.node))
      } else {
        Image(this.node.getAttribute('src'))
        .defaultEvent()
        .objectFit(ImageFit.Contain)
        .attrs(getNormalAttributes(this.node, this.overwriteStyle))
        .onComplete(e => eventHandler(e, 'complete', this.node))
        .visibleChangeEvent()
      }
    }
  }
}

export default TaroImage
