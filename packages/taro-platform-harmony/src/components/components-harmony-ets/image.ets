import { eventHandler } from '@tarojs/runtime'

import TaroComponentWrapper from './base'
import { bindInstanceToNode, getNormalAttributes, shouldBindEvent } from './utils/helper'

import type { TaroImageElement } from '@tarojs/runtime'

@Extend(Image)
function attrs ({
   flexSize,
   alignSelf,
   size,
   margin,
   padding,
   zIndex,
   backgroundColor,
   borderRadius,
   constraintSize
}) {
  .constraintSize(constraintSize)
  .size(size)
  .zIndex(zIndex)
  .margin(margin)
  .padding(padding)
  .alignSelf(alignSelf)
  .flexGrow(flexSize[0])
  .flexShrink(flexSize[1])
  .flexBasis(flexSize[2])
  .backgroundColor(backgroundColor)
  .borderRadius(borderRadius)
}


@Component
struct TaroImage {
  info: Area = null

  @State thresholds: number[] = []

  @Styles visibleChangeEvent () {
    .onVisibleAreaChange(this.thresholds || [0.0, 1.0], (isVisible: boolean, currentRatio: number) => {
      this.visableChange(isVisible, currentRatio)
    })
  }

  @ObjectLink node: TaroImageElement

  aboutToAppear () {
    bindInstanceToNode(this.node, this)
  }

  @Styles defaultEvent () {
    .onClick(shouldBindEvent((e: ClickEvent) => eventHandler(e, 'click', this.node), this.node, ['click']))
    .onAreaChange((_: Area, areaResult: Area) => {
      this.info = areaResult
    })
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
        .attrs(getNormalAttributes(this.node))
        .onComplete(e => eventHandler(e, 'complete', this.node))
      } else {
        Image(this.node.getAttribute('src'))
        .defaultEvent()
        .objectFit(ImageFit.Contain)
        .attrs(getNormalAttributes(this.node))
        .onComplete(e => eventHandler(e, 'complete', this.node))
        .visibleChangeEvent()
      }
    }
  }
}

export default TaroImage
