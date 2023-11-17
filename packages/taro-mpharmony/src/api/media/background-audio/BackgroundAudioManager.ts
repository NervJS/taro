import Taro from '@tarojs/api'

import { permanentlyNotSupport } from '../../../utils'
import { CallbackManager } from '../../../utils/handler'

/**
 * BackgroundAudioManager 实例
 * 
 * @canUse BackgroundAudioManager
 * @__class 
 * [play, pause, seek, stop, onCanplay, onWaiting, onError, onPlay, onPause, onSeeking,\
 * onSeeked, onEnded, onStop, onTimeUpdate]
 */
export class BackgroundAudioManager implements Taro.BackgroundAudioManager {
  Instance?: HTMLAudioElement
  errorStack: CallbackManager
  stopStack: CallbackManager
  __startTime = 0

  constructor () {
    this.Instance = new Audio()
    this.errorStack = new CallbackManager()
    this.stopStack = new CallbackManager()
    this.Instance.autoplay = true
    this.onPlay(() => {
      if (this.currentTime !== this.startTime) {
        this.seek(this.startTime)
      }
    })
  }

  set src (e) {
    this.setProperty('src', e)
  }

  get src () {
    return this.Instance?.src || ''
  }

  set startTime (e) {
    this.__startTime = e
  }

  get startTime () {
    return this.__startTime || 0
  }

  set title (e) {
    this.dataset('title', e)
  }

  get title () {
    return this.Instance?.dataset.title || ''
  }

  set epname (e) {
    this.dataset('epname', e)
  }

  get epname () {
    return this.Instance?.dataset.epname || ''
  }

  set singer (e) {
    this.dataset('singer', e)
  }

  get singer () {
    return this.Instance?.dataset.singer || ''
  }

  set coverImgUrl (e) {
    this.dataset('coverImgUrl', e)
  }

  get coverImgUrl () {
    return this.Instance?.dataset.coverImgUrl || ''
  }

  set webUrl (e) {
    this.dataset('webUrl', e)
  }

  get webUrl () {
    return this.Instance?.dataset.webUrl || ''
  }

  set protocol (e) {
    this.dataset('protocol', e)
  }

  get protocol () {
    return this.Instance?.dataset.protocol || ''
  }

  set playbackRate (e) {
    this.setProperty('playbackRate', e)
  }

  get playbackRate () {
    return this.Instance?.playbackRate || 0
  }

  get duration () {
    return this.Instance?.duration || 0
  }

  get currentTime () {
    return this.Instance?.currentTime || 0
  }

  get paused () {
    return this.Instance?.paused || false
  }

  get buffered () {
    return this.Instance?.buffered.length || 0
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

  private dataset (key: string, value: string) {
    if (this.Instance) {
      this.Instance.dataset[key] = value
    }
  }

  play = () => this.Instance?.play()

  pause = () => this.Instance?.pause()

  seek = (position: number) => {
    if (this.Instance) {
      this.Instance.currentTime = position
    }
  }

  stop = () => {
    this.pause()
    this.seek(0)
    this.stopStack.trigger()
  }

  onCanplay = (callback = () => {}) => this.Instance?.addEventListener('canplay', callback)
  onWaiting = (callback = () => {}) => this.Instance?.addEventListener('waiting', callback)
  onError = (callback?: (res: Taro.InnerAudioContext.onErrorDetail) => void) => this.errorStack.add(callback)
  onPlay = (callback = () => {}) => this.Instance?.addEventListener('play', callback)
  onPause = (callback = () => {}) => this.Instance?.addEventListener('pause', callback)
  onSeeking = (callback = () => {}) => this.Instance?.addEventListener('seeking', callback)
  onSeeked = (callback = () => {}) => this.Instance?.addEventListener('seeked', callback)

  onEnded = (callback = () => {}) => this.Instance?.addEventListener('ended', callback)
  onStop = (callback = () => {}) => this.stopStack.add(callback)
  onTimeUpdate = (callback = () => {}) => this.Instance?.addEventListener('timeupdate', callback)
  onPrev = permanentlyNotSupport('BackgroundAudioManager.onPrev')
  onNext = permanentlyNotSupport('BackgroundAudioManager.onNext')

  offCanplay = (callback = () => {}) => this.Instance?.removeEventListener('canplay', callback)
  offWaiting = (callback = () => {}) => this.Instance?.removeEventListener('waiting', callback)
  offError = (callback = () => {}) => this.errorStack.remove(callback)
  offPlay = (callback = () => {}) => this.Instance?.removeEventListener('play', callback)
  offPause = (callback = () => {}) => this.Instance?.removeEventListener('pause', callback)
  offSeeking = (callback = () => {}) => this.Instance?.removeEventListener('seeking', callback)
  offSeeked = (callback = () => {}) => this.Instance?.removeEventListener('seeked', callback)

  offEnded = (callback = () => {}) => this.Instance?.removeEventListener('ended', callback)
  offStop = (callback = () => {}) => this.stopStack.remove(callback)
  offTimeUpdate = (callback = () => {}) => this.Instance?.removeEventListener('timeupdate', callback)
  offPrev = permanentlyNotSupport('BackgroundAudioManager.offPrev')
  offNext = permanentlyNotSupport('BackgroundAudioManager.offNext')
}
