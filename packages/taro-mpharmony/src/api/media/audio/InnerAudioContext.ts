import Taro from '@tarojs/api'

import { permanentlyNotSupport } from '../../../utils'
import { CallbackManager } from '../../../utils/handler'

/**
 * InnerAudioContext 实例
 * 
 * @canUse InnerAudioContext
 * @__class 
 * [play, pause, stop, seek, destroy, onCanplay, onPlay, onPause, onStop, onEnded,\
 * onTimeUpdate, onError, onWaiting, onSeeking, onSeeked, offCanplay, offPlay, offPause, offStop, offEnded,\
 * offTimeUpdate, offError, offWaiting, offSeeking, offSeeked]
 */
export class InnerAudioContext implements Taro.InnerAudioContext {
  Instance?: HTMLAudioElement
  errorStack: CallbackManager
  stopStack: CallbackManager
  __startTime = 0
  __isFirstPlay = true
  MIN_PLAYBACKRATE = 0.5
  MAX_PLAYBACKRATE = 2.0

  constructor () {
    this.Instance = new Audio()
    this.errorStack = new CallbackManager()
    this.stopStack = new CallbackManager()

    Taro.eventCenter.on('__taroRouterChange', () => {
      this.stop()
    })
    this.onPlay(() => {
      if (this.__isFirstPlay) {
        this.__isFirstPlay = false
        this.seek(this.startTime)
      }
    })
    document.body.appendChild(this.Instance)
  }

  set autoplay (e) {
    this.setProperty('autoplay', e)
  }

  get autoplay () {
    return this.Instance?.autoplay || false
  }

  get buffered () {
    return this.Instance?.buffered.length || 0
  }

  get currentTime () {
    return this.Instance?.currentTime || 0
  }

  set currentTime (e) {
    this.seek(e)
  }

  get duration () {
    return this.Instance?.duration || 0
  }

  set loop (e) {
    this.setProperty('loop', e)
  }

  get loop () {
    return this.Instance?.loop || false
  }

  get paused () {
    return this.Instance?.paused ?? true
  }

  set src (e) {
    this.setProperty('src', e)
  }

  get src () {
    return this.Instance?.src || ''
  }

  set volume (e) {
    this.setProperty('volume', e)
  }

  get volume () {
    return this.Instance?.volume || 1
  }

  set playbackRate (e) {
    if (e < this.MIN_PLAYBACKRATE) {
      e = this.MIN_PLAYBACKRATE
    }
    if (e > this.MAX_PLAYBACKRATE) {
      e = this.MAX_PLAYBACKRATE
    }
    this.setProperty('playbackRate', e)
  }

  get playbackRate () {
    return this.Instance?.playbackRate || 1
  }

  set obeyMuteSwitch (_e) {
    permanentlyNotSupport('InnerAudioContext.obeyMuteSwitch')()
  }

  get obeyMuteSwitch () {
    return true
  }

  set startTime (e) {
    this.__startTime = e
  }

  get startTime () {
    return this.__startTime || 0
  }

  set referrerPolicy (e) {
    this.Instance?.setAttribute('referrerpolicy', e)
  }

  get referrerPolicy () {
    return this.Instance?.getAttribute('referrerpolicy') || 'origin'
  }

  private setProperty (key: string, value: unknown) {
    if (this.Instance) {
      this.Instance[key] = value
    }
  }

  play = () => this.Instance?.play()

  pause = () => this.Instance?.pause()

  stop = () => {
    this.pause()
    this.seek(0)
    this.stopStack.trigger()
  }

  seek = (position: number) => {
    if (this.Instance) {
      this.Instance.currentTime = position
    }
  }

  /**
   * @TODO destroy得并不干净
   */
  destroy = () => {
    this.stop()
    if (this.Instance) {
      document.body.removeChild(this.Instance)
      this.Instance = undefined
    }
  }

  canPlayCallback = () => { }

  playCallback = () => { }

  pauseCallback = () => { }

  stopCallback = () => { }

  endedCallback = () => { }

  timeUpdateCallback = () => { }

  waitingCallback = () => { }

  seekingCallback = () => { }

  seekedCallback = () => { }

  errorCallback = () => { }

  onCanplay = (callback: Taro.InnerAudioContext.OnCanplayCallback = this.canPlayCallback) =>
    this.Instance?.addEventListener('canplay', callback as any)

  onPlay = (callback: Taro.InnerAudioContext.OnPlayCallback = this.playCallback) =>
    this.Instance?.addEventListener('play', callback as any)

  onPause = (callback: Taro.InnerAudioContext.OnPauseCallback = this.pauseCallback) =>
    this.Instance?.addEventListener('pause', callback as any)

  onStop = (callback: Taro.InnerAudioContext.OnStopCallback = this.stopCallback) => this.stopStack.add(callback)
  onEnded = (callback: Taro.InnerAudioContext.OnEndedCallback = this.endedCallback) =>
    this.Instance?.addEventListener('ended', callback as any)

  onTimeUpdate = (callback: Taro.InnerAudioContext.OnTimeUpdateCallback = this.timeUpdateCallback) =>
    this.Instance?.addEventListener('timeupdate', callback as any)

  onError = (callback: Taro.InnerAudioContext.OnErrorCallback = this.errorCallback) => this.errorStack.add(callback)
  onWaiting = (callback: Taro.InnerAudioContext.OnWaitingCallback = this.waitingCallback) =>
    this.Instance?.addEventListener('waiting', callback as any)

  onSeeking = (callback: Taro.InnerAudioContext.OnSeekingCallback = this.seekingCallback) =>
    this.Instance?.addEventListener('seeking', callback as any)

  onSeeked = (callback: Taro.InnerAudioContext.OnSeekedCallback = this.seekedCallback) =>
    this.Instance?.addEventListener('seeked', callback as any)

  offCanplay = (callback: Taro.InnerAudioContext.OnCanplayCallback = this.canPlayCallback) =>
    this.Instance?.removeEventListener('canplay', callback as any)

  offPlay = (callback: Taro.InnerAudioContext.OnPlayCallback = this.playCallback) =>
    this.Instance?.removeEventListener('play', callback as any)

  offPause = (callback: Taro.InnerAudioContext.OnPauseCallback = this.pauseCallback) =>
    this.Instance?.removeEventListener('pause', callback as any)

  offStop = (callback: Taro.InnerAudioContext.OnStopCallback = this.stopCallback) => this.stopStack.remove(callback)
  offEnded = (callback: Taro.InnerAudioContext.OnEndedCallback = this.endedCallback) =>
    this.Instance?.removeEventListener('ended', callback as any)

  offTimeUpdate = (callback: Taro.InnerAudioContext.OnTimeUpdateCallback = this.timeUpdateCallback) =>
    this.Instance?.removeEventListener('timeupdate', callback as any)

  offError = (callback: Taro.InnerAudioContext.OnErrorCallback = this.errorCallback) => this.errorStack.remove(callback)
  offWaiting = (callback: Taro.InnerAudioContext.OnWaitingCallback = this.waitingCallback) =>
    this.Instance?.removeEventListener('waiting', callback as any)

  offSeeking = (callback: Taro.InnerAudioContext.OnSeekingCallback = this.seekingCallback) =>
    this.Instance?.removeEventListener('seeking', callback as any)

  offSeeked = (callback: Taro.InnerAudioContext.OnSeekedCallback = this.seekedCallback) =>
    this.Instance?.removeEventListener('seeked', callback as any)
}
