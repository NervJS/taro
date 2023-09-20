import { eventHandler } from '@tarojs/runtime'

import TaroComponentWrapper from './base'
import { bindInstanceToNode, getNormalAttributes } from './utils/helper'

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
}) {
  .size(size)
  .zIndex(zIndex)
  .margin(margin)
  .padding(padding)
  .alignSelf(alignSelf)
  .flexGrow(flexSize[0])
  .flexShrink(flexSize[1])
  .flexBasis(flexSize[2])
  .backgroundColor(backgroundColor)
}


@Component
struct TaroImage {
  info: Area = null
  
  @ObjectLink node: TaroImageElement

  aboutToAppear () {
    bindInstanceToNode(this.node, this)
  }

  @Styles defaultEvent () {
    .onClick((e: ClickEvent) => eventHandler(e, 'click', this.node))
    .onAreaChange((_: Area, areaResult: Area) => {
      this.info = areaResult
    })
  }

  @Styles defaultEvent () {
    .onClick(e => eventHandler(e, 'click', this.node))
  }

  build() {
    TaroComponentWrapper({ node: this.node }) {
      Image(this.node.getAttribute('src'))
      .defaultEvent()
      .objectFit(ImageFit.Contain)
      .attrs(getNormalAttributes(this.node))
      .onComplete(e => eventHandler(e, 'complete', this.node))
    }
  }
}

export default TaroImage