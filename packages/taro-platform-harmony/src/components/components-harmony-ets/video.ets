import { AREA_CHANGE_EVENT_NAME, eventHandler, getComponentEventCallback, VISIBLE_CHANGE_EVENT_NAME, createTaroEvent } from '@tarojs/runtime'

import commonStyleModify from './style'
import { TOUCH_EVENT_MAP } from './utils/constant/event'
import { shouldBindEvent, getNodeThresholds } from './utils/helper'

import type { TaroAny, TaroEvent, TaroVideoElement } from '@tarojs/runtime'

export interface VideoOptions {
  src?: string | Resource
  previewUri?: string |PixelMap | Resource
  controller?: VideoController
}
export interface VideoAttrs {
  muted?: boolean
  controls?: boolean
  autoPlay?: boolean
  loop?: boolean
  objectFit?: ImageFit
}
export interface VideoUpdateEvent {
  time: number
}

@Extend(Video)
function props(attr: VideoAttrs) {
  .muted(attr.muted)
  .autoPlay(attr.autoPlay)
  .controls(attr.controls)
  .objectFit(attr.objectFit)
  .loop(attr.loop || false)
}

function emitEvent (node: TaroVideoElement, type: string, detail?: TaroAny) {
  const event: TaroEvent = createTaroEvent(type, { detail }, node)

  event.stopPropagation()
  eventHandler(event, type, node)
}

function getVideoData (node: TaroVideoElement): VideoOptions {
  const src = node._attrs.src
  const poster = node._attrs.poster
  return {
    src,
    previewUri: poster,
    controller: node.controller
  }
}

function getObjectFit (node: TaroVideoElement) {
  switch (node._attrs.objectFit) {
    case 'contain': return ImageFit.Contain
    case 'cover': return ImageFit.Cover
    case 'fill': return ImageFit.Fill
    default: return ImageFit.Contain
  }
}

function getVideoProps (node: TaroVideoElement): VideoAttrs {
  const muted: boolean = node._attrs.muted || false
  const autoPlay: boolean = node._attrs.autoplay || false
  const controls: boolean = node._attrs.controls || false
  const objectFit: ImageFit = getObjectFit(node)
  const loop: boolean = node._attrs.loop || false
  return {
    muted,
    controls,
    objectFit,
    loop,
    autoPlay
  }
}

function handleUpdate (node: TaroVideoElement, e: VideoUpdateEvent) {
  node._nodeInfo._currentTime = e.time

  emitEvent(node, 'timeUpdate', { currentTime: e.time})
}

@Component
export default struct TaroVideo {
  @Builder customBuilder() {}
  @BuilderParam createLazyChildren: (node: TaroVideoElement, layer?: number) => void = this.customBuilder
  @ObjectLink node: TaroVideoElement
  @State overwriteStyle: Record<string, TaroAny> = {}

  aboutToAppear(): void {
    if (this.node) {
      this.node._instance = this
    }
  }

  build () {
    Video(getVideoData(this.node))
    .attributeModifier(commonStyleModify.setNode(this.node).setAnimationStyle(this.overwriteStyle))
    .props(getVideoProps(this.node))
    .onStart(shouldBindEvent(() => { emitEvent(this.node, 'play') }, this.node, ['play']))
    .onPause(shouldBindEvent(() => { emitEvent(this.node, 'pause') }, this.node, ['pause']))
    .onFinish(shouldBindEvent(() => { emitEvent(this.node, 'ended') }, this.node, ['ended']))
    .onError(shouldBindEvent(() => { emitEvent(this.node, 'error') }, this.node, ['error']))
    .onUpdate((e) => { handleUpdate(this.node, e) })
    .onPrepared(shouldBindEvent((e: TaroAny) => { emitEvent(this.node, 'loadedMetaData', { duration: e.duration }) }, this.node, ['loadedmetadata']))
    .onSeeking(shouldBindEvent((e: TaroAny) => { emitEvent(this.node, 'seeking', { duration: e.time }) }, this.node, ['seeking']))
    .onSeeked(shouldBindEvent(() => { emitEvent(this.node, 'seeked') }, this.node, ['seeked']))
    .onFullscreenChange(shouldBindEvent((e: TaroAny) => { emitEvent(this.node, 'fullScreenChange', { fullScreen: e.fullscreen}) }, this.node, ['fullscreenchange']))
    .onClick((e: ClickEvent) => { eventHandler(e, 'click', this.node) })
    .onTouch(shouldBindEvent((e: TouchEvent) => { eventHandler(e, TOUCH_EVENT_MAP.get(e.type), this.node) }, this.node, TOUCH_EVENT_MAP.values()))
    .onAreaChange(getComponentEventCallback(this.node, AREA_CHANGE_EVENT_NAME, (res: TaroAny) => {
      this.node._nodeInfo.areaInfo = res[1]
    }))
    .onVisibleAreaChange(getNodeThresholds(this.node) || [0.0, 1.0], getComponentEventCallback(this.node, VISIBLE_CHANGE_EVENT_NAME))
  }

}
