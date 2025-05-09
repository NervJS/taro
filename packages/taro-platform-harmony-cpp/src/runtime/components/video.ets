import { audio } from '@kit.AudioKit'
import { AREA_CHANGE_EVENT_NAME, createTaroEvent, eventHandler, getComponentEventCallback, VISIBLE_CHANGE_EVENT_NAME } from '@tarojs/runtime'

import commonStyleModify from './style'
import { shouldBindEvent, getNodeThresholds } from './utils/helper'

import type { TaroAny, TaroEvent, TaroVideoElement } from '@tarojs/runtime'

export interface VideoUpdateEvent {
  time: number
}

function emitEvent (node: TaroVideoElement, type: string, detail?: TaroAny) {
  const event: TaroEvent = createTaroEvent(type, { detail }, node)

  event.stopPropagation()
  eventHandler(event, type, node)
}

function handleUpdate (node: TaroVideoElement, e: VideoUpdateEvent) {
  node._nodeInfo._currentTime = e.time

  emitEvent(node, 'timeUpdate', { currentTime: e.time})
}

@ComponentV2
export default struct TaroVideo {
  @Builder customBuilder() {}
  @BuilderParam createLazyChildren: (node: TaroVideoElement) => void = this.customBuilder
  @Param @Require node: TaroVideoElement
  controller: VideoController = new VideoController()
  audioSessionManager: audio.AudioSessionManager | null = null

  @Local attrSrc: string = ''
  @Local attrPoster: string = ''
  @Local attrAutoplay: boolean = false
  @Local attrControls: boolean = false
  @Local attrLoop: boolean = false
  @Local attrMuted: boolean = false
  @Local attrObjectFit: string = ''

  @Computed get computedObjectFit () {
    switch (this.attrObjectFit) {
      case 'contain': return ImageFit.Contain
      case 'cover': return ImageFit.Cover
      case 'fill': return ImageFit.Fill
      default: return ImageFit.Contain
    }
  }

  aboutToAppear(): void {
    let audioManager = audio.getAudioManager()
    this.audioSessionManager = audioManager.getSessionManager()
    this.audioSessionManager?.activateAudioSession({ concurrencyMode: audio.AudioConcurrencyMode.CONCURRENCY_PAUSE_OTHERS })

    if (this.node) {
      this.node._instance = this
      this.node.controller = this.controller
      this.attrSrc = this.node._attrs.src ?? this.attrSrc
      this.attrPoster = this.node._attrs.poster ?? this.attrPoster
      this.attrAutoplay = this.node._attrs.autoplay ?? this.attrAutoplay
      this.attrControls = this.node._attrs.controls ?? this.attrControls
      this.attrLoop = this.node._attrs.loop ?? this.attrLoop
      this.attrMuted = this.node._attrs.muted ?? this.attrMuted
      this.attrObjectFit = this.node._attrs.objectFit ?? this.attrObjectFit
    }
  }

  aboutToDisappear(): void {
    this.audioSessionManager?.deactivateAudioSession()
  }

  refreshAudioSession() {
    this.audioSessionManager?.deactivateAudioSession().then(() => {
      this.audioSessionManager?.activateAudioSession({ concurrencyMode: audio.AudioConcurrencyMode.CONCURRENCY_PAUSE_OTHERS })
    })
  }

  build () {
    Video({
      src: this.attrSrc,
      previewUri: this.attrPoster,
      controller: this.node.controller
    })
      .attributeModifier(commonStyleModify.setNode(this.node))
      .muted(this.attrMuted || false)
      .autoPlay(this.attrAutoplay || false)
      .controls(this.attrControls || false)
      .objectFit(this.computedObjectFit)
      .loop(this.attrLoop || false)
      .onStart(() => {
        this.refreshAudioSession()
        return shouldBindEvent(() => { emitEvent(this.node, 'play') }, this.node, ['play'])
      })
      .onPause(() => {
        this.refreshAudioSession()
        return shouldBindEvent(() => { emitEvent(this.node, 'pause') }, this.node, ['pause'])
      })
      .onFinish(() => {
        this.refreshAudioSession()
        return shouldBindEvent(() => { emitEvent(this.node, 'ended') }, this.node, ['ended'])
      })
      .onError(shouldBindEvent(() => { emitEvent(this.node, 'error') }, this.node, ['error']))
      .onUpdate((e) => { handleUpdate(this.node, e) })
      .onPrepared(shouldBindEvent((e: TaroAny) => { emitEvent(this.node, 'loadedMetaData', { duration: e.duration }) }, this.node, ['loadedmetadata']))
      .onSeeking(shouldBindEvent((e: TaroAny) => { emitEvent(this.node, 'seeking', { duration: e.time }) }, this.node, ['seeking']))
      .onSeeked(shouldBindEvent(() => { emitEvent(this.node, 'seeked') }, this.node, ['seeked']))
      .onFullscreenChange(shouldBindEvent((e: TaroAny) => { emitEvent(this.node, 'fullScreenChange', { fullScreen: e.fullscreen}) }, this.node, ['fullscreenchange']))
      .onAreaChange(getComponentEventCallback(this.node, AREA_CHANGE_EVENT_NAME, (res: TaroAny) => {
        this.node._nodeInfo.areaInfo = res[1]
      }))
      .onVisibleAreaChange(getNodeThresholds(this.node) || [0.0, 1.0], getComponentEventCallback(this.node, VISIBLE_CHANGE_EVENT_NAME))
  }
}
