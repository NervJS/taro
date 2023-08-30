import Taro from '@tarojs/api'

import { permanentlyNotSupport } from '../../../utils'
import { CallbackManager } from '../../../utils/handler'

export class InnerAudioContext implements Taro.InnerAudioContext {
  Instance?: HTMLAudioElement
  errorStack: CallbackManager
  stopStack: CallbackManager
  __startTime = 0
  __isFirstPlay = true

  constructor () {
    this.Instance = new Audio()
    this.errorStack = new CallbackManager()
    this.stopStack = new CallbackManager()
    this.Instance.onerror = this.errorStack.trigger

    Taro.eventCenter.on('__taroRouterChange', () => { this.stop() })
    this.onPlay(() => {
      if (this.__isFirstPlay) {
        this.__isFirstPlay = false
        this.seek(this.startTime)
      }
    })
  }

  set autoplay (e) { this.setProperty('autoplay', e) }
  get autoplay () { return this.Instance?.autoplay || false }
  get buffered () { return this.Instance?.buffered.length || 0 }
  get currentTime () { return this.Instance?.currentTime || 0 }
  set currentTime (e) { this.seek(e) }
  get duration () { return this.Instance?.duration || 0 }
  set loop (e) { this.setProperty('loop', e) }
  get loop () { return this.Instance?.loop || false }
  get paused () { return this.Instance?.paused ?? true }
  set src (e) { this.setProperty('src', e) }
  get src () { return this.Instance?.src || '' }
  set volume (e) { this.setProperty('volume', e) }
  get volume () { return this.Instance?.volume || 0 }
  set playbackRate (e) { this.setProperty('playbackRate', e) }
  get playbackRate () { return this.Instance?.playbackRate || 0 }
  set obeyMuteSwitch (_e) { permanentlyNotSupport('InnerAudioContext.obeyMuteSwitch')() }
  get obeyMuteSwitch () { return true }
  set startTime (e) { this.__startTime = e }
  get startTime () { return this.__startTime || 0 }
  set referrerPolicy (e) { this.Instance?.setAttribute('referrerpolicy', e) }
  get referrerPolicy () { return this.Instance?.getAttribute('referrerpolicy') || 'origin' }

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
      this.Instance = undefined
    }
  }

  onCanplay = (callback: Taro.InnerAudioContext.OnCanplayCallback = () => {}) => this.Instance?.addEventListener('canplay', callback as any)
  onPlay = (callback: Taro.InnerAudioContext.OnPlayCallback = () => {}) => this.Instance?.addEventListener('play', callback as any)
  onPause = (callback: Taro.InnerAudioContext.OnPauseCallback = () => {}) => this.Instance?.addEventListener('pause', callback as any)
  onStop = (callback: Taro.InnerAudioContext.OnStopCallback = () => {}) => this.stopStack.add(callback)
  onEnded = (callback: Taro.InnerAudioContext.OnEndedCallback = () => {}) => this.Instance?.addEventListener('ended', callback as any)
  onTimeUpdate = (callback: Taro.InnerAudioContext.OnTimeUpdateCallback = () => {}) => this.Instance?.addEventListener('timeupdate', callback as any)
  onError = (callback: Taro.InnerAudioContext.OnErrorCallback) => this.errorStack.add(callback)
  onWaiting = (callback: Taro.InnerAudioContext.OnWaitingCallback = () => {}) => this.Instance?.addEventListener('waiting', callback as any)
  onSeeking = (callback: Taro.InnerAudioContext.OnSeekingCallback = () => {}) => this.Instance?.addEventListener('seeking', callback as any)
  onSeeked = (callback: Taro.InnerAudioContext.OnSeekedCallback = () => {}) => this.Instance?.addEventListener('seeked', callback as any)
  offCanplay = (callback: Taro.InnerAudioContext.OnCanplayCallback = () => {}) => this.Instance?.removeEventListener('canplay', callback as any)
  offPlay = (callback: Taro.InnerAudioContext.OnPlayCallback = () => {}) => this.Instance?.removeEventListener('play', callback as any)
  offPause = (callback: Taro.InnerAudioContext.OnPauseCallback = () => {}) => this.Instance?.removeEventListener('pause', callback as any)
  offStop = (callback: Taro.InnerAudioContext.OnStopCallback = () => {}) => this.stopStack.remove(callback)
  offEnded = (callback: Taro.InnerAudioContext.OnEndedCallback = () => {}) => this.Instance?.removeEventListener('ended', callback as any)
  offTimeUpdate = (callback: Taro.InnerAudioContext.OnTimeUpdateCallback = () => {}) => this.Instance?.removeEventListener('timeupdate', callback as any)
  offError = (callback: Taro.InnerAudioContext.OnErrorCallback = () => {}) => this.errorStack.remove(callback)
  offWaiting = (callback: Taro.InnerAudioContext.OnWaitingCallback = () => {}) => this.Instance?.removeEventListener('waiting', callback as any)
  offSeeking = (callback: Taro.InnerAudioContext.OnSeekingCallback = () => {}) => this.Instance?.removeEventListener('seeking', callback as any)
  offSeeked = (callback: Taro.InnerAudioContext.OnSeekedCallback = () => {}) => this.Instance?.removeEventListener('seeked', callback as any)
}
