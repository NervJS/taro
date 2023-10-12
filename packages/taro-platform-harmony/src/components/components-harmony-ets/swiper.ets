import { eventHandler } from '@tarojs/runtime'

import { createNode } from './render'
import TaroComponentWrapper from './base'
import { createTaroEvent } from './utils/events'
import { bindInstanceToNode, getNormalAttributes } from './utils/helper'

import type { TaroViewElement } from '@tarojs/runtime'

@Extend(Swiper)
function attrs ({
  flexSize,
  alignSelf,
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
  .flexGrow(flexSize[0])
  .flexShrink(flexSize[1])
  .flexBasis(flexSize[2])
  .alignSelf(alignSelf)
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
struct TaroSwiper {
  private swiperController: SwiperController = new SwiperController()
  
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
      Swiper(this.swiperController) {
        ForEach(this.node.childNodes, item => {
          createNode(item)
        }, item => item._nid)
      }
      .attrs(getNormalAttributes(this.node))
      .defaultEvent()
      .index(this.node.getAttribute('index') || 0)
      .loop(this.node.getAttribute('loop') || true)
      .duration(this.node.getAttribute('duration') || 400)
      .interval(this.node.getAttribute('interval') || 3000)
      .vertical(this.node.getAttribute('vertical') || false)
      .autoPlay(this.node.getAttribute('autoplay') || false)
      .indicator(this.node.getAttribute('indicatorDots') || false)
      .indicatorStyle({
        color: this.node.getAttribute('indicatorColor'),
        selectedColor:  this.node.getAttribute('indicatorActiveColor')
      })
      .onChange((index: number) => {
        const event = createTaroEvent('change', { detail: { index } }, this.node)
        eventHandler(event, 'change', this.node)
      })
    }
  }
}

export default TaroSwiper
