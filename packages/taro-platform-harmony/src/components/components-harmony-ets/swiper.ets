import { bindInstanceToNode, bindAnimation, eventHandler, getComponentEventCallback, AREA_CHANGE_EVENT_NAME, VISIBLE_CHANGE_EVENT_NAME, initComponentNodeInfo } from '@tarojs/runtime'

import { createNode } from './render'
import TaroComponentWrapper from './base'
import { createTaroEvent } from './utils/events'
import { getNodeThresholds, getNormalAttributes, shouldBindEvent } from './utils/helper'

import type { TaroViewElement } from '@tarojs/runtime'

@Extend(Swiper)
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
  .key(id)
  .constraintSize(constraintSize)
  .flexGrow(flexGrow)
  .flexShrink(flexShrink)
  .flexBasis(flexBasis)
  .alignSelf(alignSelf)
  .width(width)
  .height(height)
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
struct TaroSwiper {
  private swiperController: SwiperController = new SwiperController()

  nodeInfoMap: any = {}
  
  @ObjectLink node: TaroViewElement

  @Styles visibleChangeEvent () {
    .onVisibleAreaChange(getNodeThresholds(this.node) || [0.0, 1.0], getComponentEventCallback(this.node, VISIBLE_CHANGE_EVENT_NAME))
  }

  aboutToAppear () {
    initComponentNodeInfo(this, this.node)
    bindInstanceToNode(this.node, this)
    // 绑定动画
    bindAnimation(this.node)
  }

  @Styles defaultEvent () {
    .onClick(shouldBindEvent((e: ClickEvent) => eventHandler(e, 'click', this.node), this.node, ['click']))
    .onAreaChange(getComponentEventCallback(this.node, AREA_CHANGE_EVENT_NAME, ({ eventResult }) => {
      const [_, areaResult] = eventResult
      
      this.nodeInfoMap[this.node._nid].areaInfo = areaResult
    }))
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
      .index(this.node.getAttribute('current') || 0)
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
        const event = createTaroEvent('change', { detail: { current: index } }, this.node)
        eventHandler(event, 'change', this.node)
      })
      .visibleChangeEvent()
    }
  }
}

export default TaroSwiper
