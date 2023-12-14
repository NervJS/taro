import { AREA_CHANGE_EVENT_NAME, eventHandler, getComponentEventCallback, VISIBLE_CHANGE_EVENT_NAME, TaroEvent, createTaroEvent } from '@tarojs/runtime'

import { TOUCH_EVENT_MAP } from './utils/constant/event'
import { getNormalAttributes, shouldBindEvent, getNodeThresholds } from './utils/helper'

import type { TaroStyleType, TaroAny, TaroVideoElement } from '@tarojs/runtime'

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
  node._currentTime = e.time

  emitEvent(node, 'timeUpdate', { currentTime: e.time})
}

@Builder
export default function TaroVideo (node: TaroVideoElement) {
  Video(getVideoData(node))
    .attrs(getNormalAttributes(node))
    .props(getVideoProps(node))
    .onStart(shouldBindEvent(() => { emitEvent(node, 'play') }, node, ['play']))
    .onPause(shouldBindEvent(() => { emitEvent(node, 'pause') }, node, ['pause']))
    .onFinish(shouldBindEvent(() => { emitEvent(node, 'ended') }, node, ['ended']))
    .onError(shouldBindEvent(() => { emitEvent(node, 'error') }, node, ['error']))
    .onUpdate((e) => { handleUpdate(node, e) })
    .onPrepared(shouldBindEvent((e: TaroAny) => { emitEvent(node, 'loadedMetaData', { duration: e.duration }) }, node, ['loadedmetadata']))
    .onSeeking(shouldBindEvent((e: TaroAny) => { emitEvent(node, 'seeking', { duration: e.time }) }, node, ['seeking']))
    .onSeeked(shouldBindEvent(() => { emitEvent(node, 'seeked') }, node, ['seeked']))
    .onFullscreenChange(shouldBindEvent((e: TaroAny) => { emitEvent(node, 'fullScreenChange', { fullScreen: e.fullscreen}) }, node, ['fullscreenchange']))
    .onClick((e: ClickEvent) => { eventHandler(e, 'click', node) })
    .onTouch(shouldBindEvent((e: TouchEvent) => eventHandler(e, TOUCH_EVENT_MAP.get(e.type), node), node, TOUCH_EVENT_MAP.values()))
    .onAreaChange(getComponentEventCallback(node, AREA_CHANGE_EVENT_NAME, (res: TaroAny) => {
      node._nodeInfo.areaInfo = res[1]
    }))
    .onVisibleAreaChange(getNodeThresholds(node) || [0.0, 1.0], getComponentEventCallback(node, VISIBLE_CHANGE_EVENT_NAME))
}
