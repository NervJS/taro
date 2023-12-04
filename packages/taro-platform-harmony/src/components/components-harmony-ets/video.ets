import { bindInstanceToNode, bindAnimation, AREA_CHANGE_EVENT_NAME, eventHandler, getComponentEventCallback, VISIBLE_CHANGE_EVENT_NAME, initComponentNodeInfo, getPageScrollerOrNode,
  TaroEvent } from '@tarojs/runtime'
import { capitalize } from "@tarojs/shared"

import TaroComponentWrapper from './base'
import { TOUCH_EVENT_MAP } from './utils/constant/event'
import { createTaroEvent } from './utils/events'
import { getNormalAttributes, shouldBindEvent, getNodeThresholds } from './utils/helper'

import type { TaroViewElement, TaroElement } from './element'
import type { TaroStyleType, CompType } from './type'
import type { TaroAny } from './utils/type'
import { extend } from '@tarojs/runtime/dist/runtime.esm'

@Extend(Video)
function attrs (style: TaroStyleType) {
  .id(style.id)
  .key(style.id)
  .padding(style.padding)
  .margin(style.margin)
  .width(style.width)
  .height(style.height)
  .constraintSize(style.constraintSize)
  .flexGrow(style.flexGrow)
  .flexShrink(style.flexShrink)
  .flexBasis(style.flexBasis)
  .alignSelf(style.alignSelf)
  .backgroundColor(style.backgroundColor)
  .backgroundImage(style.backgroundImage, style.backgroundRepeat)
  .backgroundImageSize(style.backgroundImageSize)
  .rotate(style.rotate)
  .scale(style.scale)
  .translate(style.translate)
  .transform(style.transform)
  .borderStyle(style.borderStyle)
  .borderWidth(style.borderWidth)
  .borderColor(style.borderColor)
  .borderRadius(style.borderRadius)
  .linearGradient(style.linearGradient)
  .zIndex(style.zIndex)
  .opacity(style.opacity)
  .clip(style.clip)
}

@Extend(Video)
function props(attr: CompType.Video.Attrs) {
  .muted(attr.muted)
  .autoPlay(attr.autoPlay)
  .controls(attr.controls)
  .objectFit(attr.objectFit)
  .loop(attr.loop)
}

@Component
export default struct TaroVideo {
  nodeInfoMap: TaroAny = {}

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
    .onTouch(shouldBindEvent((e: TouchEvent) => eventHandler(e, TOUCH_EVENT_MAP.get(e.type), this.node), this.node, TOUCH_EVENT_MAP.values()))
    .onAreaChange(getComponentEventCallback(this.node, AREA_CHANGE_EVENT_NAME, res => {
      const eventResult: TaroAny = res.eventResult
      this.nodeInfoMap[this.node._nid].areaInfo = eventResult[1]
    }))
  }

  emitEvent = (type: string, detail?: TaroAny) => {
    const event: TaroEvent = createTaroEvent(type, { detail }, this.node)
    event.stopPropagation()
    eventHandler(event, type, this.node)
  }


  getVideoData (): CompType.Video.Options {
    const src: string = this.node._attrs.src
    const poster: string = this.node._attrs.poster
    return {
      src,
      previewUri: poster,
      controller: this.controller
    }
  }

  getVideoProps (): CompType.Video.Attrs {
    const muted: boolean = this.node._attrs.muted
    const autoPlay: boolean = this.node._attrs.autoplay
    const controls: boolean = this.node._attrs.controls || false
    const objectFit: ImageFit = this.node._attrs.objectFit = ImageFit.Contain
    const loop: boolean = this.node._attrs.loop
    return {
      muted,
      controls,
      objectFit,
      loop,
      autoPlay
    }
  }

  handleUpdate (e: TaroAny) {
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
        .onStart(shouldBindEvent(() => { this.emitEvent('play') }, this.node, ['play']))
        .onPause(shouldBindEvent(() => { this.emitEvent('pause') }, this.node, ['pause']))
        .onFinish(shouldBindEvent(() => { this.emitEvent('ended') }, this.node, ['ended']))
        .onError(shouldBindEvent(() => { this.emitEvent('error') }, this.node, ['error']))
        .onUpdate((e) => { this.handleUpdate(e) })
        .onPrepared(shouldBindEvent((e: TaroAny) => { this.emitEvent('loadedMetaData', { duration: e.duration }) }, this.node, ['loadedmetadata']))
        .onSeeking(shouldBindEvent((e: TaroAny) => { this.emitEvent('seeking', { duration: e.time }) }, this.node, ['seeking']))
        .onSeeked(shouldBindEvent(() => { this.emitEvent('seeked') }, this.node, ['seeked']))
        .onFullscreenChange(shouldBindEvent((e: TaroAny) => { this.emitEvent('fullScreenChange', { fullScreen: e.fullscreen}) }, this.node, ['fullscreenchange']))
    }
  }
}
