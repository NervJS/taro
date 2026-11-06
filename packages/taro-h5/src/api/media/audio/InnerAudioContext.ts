import Taro from '@tarojs/api'

import { permanentlyNotSupport } from '../../../utils'
import { CallbackManager } from '../../../utils/handler'

export class InnerAudioContext implements Taro.InnerAudioContext {
  Instance?: HTMLAudioElement
  errorStack: CallbackManager
  stopStack: CallbackManager
  __startTime = 0
  __isFirstPlay = true
  private readonly listeners = new Map<string, Set<EventListener>>()
  private readonly onRouterChange = () => this.stop()
  private readonly onFirstPlay = () => {
    if (this.__isFirstPlay) {
      this.__isFirstPlay = false
      this.seek(this.startTime)
    }
  }

  constructor () {
    this.Instance = new Audio()
    this.errorStack = new CallbackManager()
    this.stopStack = new CallbackManager()
    this.Instance.onerror = this.errorStack.trigger

    Taro.eventCenter.on('__taroRouterChange', this.onRouterChange)
    // Keep internal playback handling separate from removable user listeners.
    this.Instance.addEventListener('play', this.onFirstPlay)
  }

  set autoplay (e) { this.setProperty('autoplay', e) }
  get autoplay () { return this.Instance?.autoplay || false }
  get buffered () {
    const { currentTime = 0, buffered: timeRange } = this.Instance || {}
    if (timeRange) {
      for (let i = 0; i < timeRange.length; i++) {
        if (timeRange.start(i) <= currentTime && timeRange.end(i) >= currentTime) {
          return timeRange.end(i)
        }
      }
    }
    return 0
  }

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

  private addListener (type: string, callback: EventListener) {
    if (!this.Instance) return
    let callbacks = this.listeners.get(type)
    if (!callbacks) {
      callbacks = new Set()
      this.listeners.set(type, callbacks)
    }
    callbacks.add(callback)
    this.Instance.addEventListener(type, callback)
  }

  private removeListener (type: string, callback?: EventListener) {
    const callbacks = this.listeners.get(type)
    if (callback) {
      this.Instance?.removeEventListener(type, callback)
      callbacks?.delete(callback)
    } else {
      callbacks?.forEach(listener => this.Instance?.removeEventListener(type, listener))
      callbacks?.clear()
    }
    if (!callbacks?.size) this.listeners.delete(type)
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

  destroy = () => {
    if (!this.Instance) return

    this.stop()
    Taro.eventCenter.off('__taroRouterChange', this.onRouterChange)
    this.listeners.forEach((_, type) => this.removeListener(type))
    this.Instance.removeEventListener('play', this.onFirstPlay)
    this.Instance.onerror = null
    this.Instance.removeAttribute('src')
    this.errorStack.clear()
    this.stopStack.clear()
    this.Instance = undefined
  }

  onCanplay = (callback: Taro.InnerAudioContext.OnCanplayCallback = () => {}) => this.addListener('canplay', callback as any)
  onPlay = (callback: Taro.InnerAudioContext.OnPlayCallback = () => {}) => this.addListener('play', callback as any)
  onPause = (callback: Taro.InnerAudioContext.OnPauseCallback = () => {}) => this.addListener('pause', callback as any)
  onStop = (callback: Taro.InnerAudioContext.OnStopCallback = () => {}) => this.stopStack.add(callback)
  onEnded = (callback: Taro.InnerAudioContext.OnEndedCallback = () => {}) => this.addListener('ended', callback as any)
  onTimeUpdate = (callback: Taro.InnerAudioContext.OnTimeUpdateCallback = () => {}) => this.addListener('timeupdate', callback as any)
  onError = (callback: Taro.InnerAudioContext.OnErrorCallback) => this.errorStack.add(callback)
  onWaiting = (callback: Taro.InnerAudioContext.OnWaitingCallback = () => {}) => this.addListener('waiting', callback as any)
  onSeeking = (callback: Taro.InnerAudioContext.OnSeekingCallback = () => {}) => this.addListener('seeking', callback as any)
  onSeeked = (callback: Taro.InnerAudioContext.OnSeekedCallback = () => {}) => this.addListener('seeked', callback as any)
  offCanplay = (callback?: Taro.InnerAudioContext.OnCanplayCallback) => this.removeListener('canplay', callback as any)
  offPlay = (callback?: Taro.InnerAudioContext.OnPlayCallback) => this.removeListener('play', callback as any)
  offPause = (callback?: Taro.InnerAudioContext.OnPauseCallback) => this.removeListener('pause', callback as any)
  offStop = (callback?: Taro.InnerAudioContext.OnStopCallback) => this.stopStack.remove(callback)
  offEnded = (callback?: Taro.InnerAudioContext.OnEndedCallback) => this.removeListener('ended', callback as any)
  offTimeUpdate = (callback?: Taro.InnerAudioContext.OnTimeUpdateCallback) => this.removeListener('timeupdate', callback as any)
  offError = (callback?: Taro.InnerAudioContext.OnErrorCallback) => this.errorStack.remove(callback)
  offWaiting = (callback?: Taro.InnerAudioContext.OnWaitingCallback) => this.removeListener('waiting', callback as any)
  offSeeking = (callback?: Taro.InnerAudioContext.OnSeekingCallback) => this.removeListener('seeking', callback as any)
  offSeeked = (callback?: Taro.InnerAudioContext.OnSeekedCallback) => this.removeListener('seeked', callback as any)
}
