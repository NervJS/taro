import { bindInstanceToNode, bindAnimation, Current, eventHandler, getComponentEventCallback, VISIBLE_CHANGE_EVENT_NAME, initComponentNodeInfo, getPageScrollerOrNode } from '@tarojs/runtime'
import { capitalize } from "@tarojs/shared"

import TaroComponentWrapper from './base'
import { TOUCH_EVENT_MAP } from './utils/constant/event'
import { createTaroEvent } from './utils/events'
import { getNormalAttributes, shouldBindEvent, getNodeThresholds } from './utils/helper'

import type { TaroViewElement } from '@tarojs/runtime'



@Extend(Video)
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



@Extend(Video)
function props({
  muted,
  autoPlay,
  controls,
  objectFit,
  loop
}) {
  .muted(muted)
  .autoPlay(autoPlay)
  .controls(controls)
  .objectFit(objectFit)
  .loop(loop)
}

@Component
struct TaroVideo {
  nodeInfoMap: any = {}

  eventMap: any = {}

  @Styles visibleChangeEvent () {
    .onVisibleAreaChange(getNodeThresholds(this.node) || [0.0, 1.0], getComponentEventCallback(this.node, VISIBLE_CHANGE_EVENT_NAME))
  }

  @ObjectLink node: TaroViewElement

  controller: VideoController = new VideoController()

  aboutToAppear () {
    initComponentNodeInfo(this, this.node)
    bindInstanceToNode(this.node, this)
    // 绑定动画
    bindAnimation(this.node)
  }

  @Styles defaultEvent () {
    .onClick((e: ClickEvent) => {
      eventHandler(e, 'click', this.node)
    })
    .onTouch(shouldBindEvent((e: TouchEvent) => eventHandler(e, TOUCH_EVENT_MAP[e.type], this.node), this.node, Object.values(TOUCH_EVENT_MAP)))
    .onAreaChange(getComponentEventCallback('areaChange', ({ eventResult }) => {
      const [_, areaResult] = eventResult

      this.nodeInfoMap[this.node._nid].areaInfo = areaResult
    }, this))
  }

  emitEvent = (type, detail) => {
    const event = createTaroEvent(type, { detail }, this.node)
    event.stopPropagation()
    eventHandler(event, type, this.node)
  }


  getVideoData () {
    const { src, poster} = this.node._attrs
    return {
      src,
      previewUri: poster,
      controller: this.controller
    }
  }

  getVideoProps () {
    const { muted, autoplay, controls = false, objectFit = 'contain', loop } = this.node._attrs
    return {
      muted,
      controls,
      objectFit: ImageFit[capitalize(objectFit)],
      loop,
      autoPlay: autoplay
    }
  }

  handleUpdate (e) {
    this.nodeInfoMap[this.node._nid].currentTime = e.time
    this.emitEvent('timeUpdate', { currentTime: e.time})
  }

  build() {
    TaroComponentWrapper({ node: this.node }) {
      Video(this.getVideoData())
        .attrs(getNormalAttributes(this.node))
        .props(this.getVideoProps())
        .defaultEvent()
        .visibleChangeEvent()
        .onStart(shouldBindEvent(this.emitEvent.bind(this, 'play'), this.node, ['play']))
        .onPause(shouldBindEvent(this.emitEvent.bind(this, 'pause'), this.node, ['pause']))
        .onFinish(shouldBindEvent(this.emitEvent.bind(this, 'ended'), this.node, ['ended']))
        .onError(shouldBindEvent(this.emitEvent.bind(this, 'error'), this.node, ['error']))
        .onUpdate(this.handleUpdate.bind(this))
        .onPrepared(shouldBindEvent((e) => { this.emitEvent('loadedMetaData', { duration: e.duration}) }, this.node, ['loadedmetadata']))
        .onSeeking(shouldBindEvent((e) => { this.emitEvent('seeking', { duration: e.duration}) }, this.node, ['seeking']))
        .onSeeked(shouldBindEvent(this.emitEvent.bind(this, 'seeked'), this.node, ['seeked']))
        .onFullscreenChange(shouldBindEvent((e) => { this.emitEvent('fullScreenChange', { fullScreen: e.fullscreen}) }, this.node, ['fullscreenchange']))
    }
  }
}

export default TaroVideo
