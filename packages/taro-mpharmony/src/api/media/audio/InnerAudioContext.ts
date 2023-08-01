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
      document.body.removeChild(this.Instance)
      this.Instance = undefined
    }
  }

  onCanplay = (callback = () => {}) => this.Instance?.addEventListener('canplay', callback)
  onPlay = (callback = () => {}) => this.Instance?.addEventListener('play', callback)
  onPause = (callback = () => {}) => this.Instance?.addEventListener('pause', callback)
  onStop = (callback = () => {}) => this.stopStack.add(callback)
  onEnded = (callback = () => {}) => this.Instance?.addEventListener('ended', callback)
  onTimeUpdate = (callback = () => {}) => this.Instance?.addEventListener('timeupdate', callback)
  onError = (callback?: ((res: Taro.InnerAudioContext.onErrorDetail) => void)) => this.errorStack.add(callback)
  onWaiting = (callback = () => {}) => this.Instance?.addEventListener('waiting', callback)
  onSeeking = (callback = () => {}) => this.Instance?.addEventListener('seeking', callback)
  onSeeked = (callback = () => {}) => this.Instance?.addEventListener('seeked', callback)
  offCanplay = (callback = () => {}) => this.Instance?.removeEventListener('canplay', callback)
  offPlay = (callback = () => {}) => this.Instance?.removeEventListener('play', callback)
  offPause = (callback = () => {}) => this.Instance?.removeEventListener('pause', callback)
  offStop = (callback = () => {}) => this.stopStack.remove(callback)
  offEnded = (callback = () => {}) => this.Instance?.removeEventListener('ended', callback)
  offTimeUpdate = (callback = () => {}) => this.Instance?.removeEventListener('timeupdate', callback)
  offError = (callback = () => {}) => this.errorStack.remove(callback)
  offWaiting = (callback = () => {}) => this.Instance?.removeEventListener('waiting', callback)
  offSeeking = (callback = () => {}) => this.Instance?.removeEventListener('seeking', callback)
  offSeeked = (callback = () => {}) => this.Instance?.removeEventListener('seeked', callback)
}
