import Taro from '@tarojs/api'
import { temporarilyNotSupport } from '../../utils'
import { CallbackManager } from '../../utils/handler'

// 音频
class InnerAudioContext implements Taro.InnerAudioContext {
  Instance?: HTMLAudioElement
  errorStack: CallbackManager
  stopStack: CallbackManager

  constructor () {
    this.Instance = new Audio()
    this.errorStack = new CallbackManager()
    this.stopStack = new CallbackManager()

    Taro.eventCenter.on('__taroRouterChange', () => { this.stop() })
  }

  set autoplay (e) { this.setProperty('autoplay', e) }
  get autoplay () { return this.Instance?.autoplay || false }
  get buffered () { return this.Instance?.buffered.length || 0 }
  get currentTime () { return this.Instance?.currentTime || 0 }
  get duration () { return this.Instance?.duration || 0 }
  set loop (e) { this.setProperty('loop', e) }
  get loop () { return this.Instance?.loop || false }
  get paused () { return this.Instance?.paused || true }
  set src (e) { this.setProperty('src', e) }
  get src () { return this.Instance?.src || '' }
  set volume (e) { this.setProperty('volume', e) }
  get volume () { return this.Instance?.volume || 0 }
  set playbackRate (e) { this.setProperty('playbackRate', e) }
  get playbackRate () { return this.Instance?.volume || 0 }
  get obeyMuteSwitch () { return true }
  set startTime (e) { this.setProperty('startTime', e) }
  get startTime () { return this.Instance?.volume || 0 }

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

  onCanplay = (callback = () => {}) => this.Instance?.addEventListener('oncanplay', callback)
  onPlay = (callback = () => {}) => this.Instance?.addEventListener('onplay', callback)
  onPause = (callback = () => {}) => this.Instance?.addEventListener('onpause', callback)
  onStop = (callback = () => {}) => this.stopStack.add(callback)
  onEnded = (callback = () => {}) => this.Instance?.addEventListener('onended', callback)
  onTimeUpdate = (callback = () => {}) => this.Instance?.addEventListener('ontimeUpdate', callback)
  onError = (callback?: ((res: Taro.InnerAudioContext.onErrorDetail) => void)) => this.errorStack.add(callback)
  onWaiting = (callback = () => {}) => this.Instance?.addEventListener('onwaiting', callback)
  onSeeking = (callback = () => {}) => this.Instance?.addEventListener('onseeking', callback)
  onSeeked = (callback = () => {}) => this.Instance?.addEventListener('onseeked', callback)
  offCanplay = (callback = () => {}) => this.Instance?.removeEventListener('offcanplay', callback)
  offPlay = (callback = () => {}) => this.Instance?.removeEventListener('offplay', callback)
  offPause = (callback = () => {}) => this.Instance?.removeEventListener('offpause', callback)
  offStop = (callback = () => {}) => this.stopStack.remove(callback)
  offEnded = (callback = () => {}) => this.Instance?.removeEventListener('offended', callback)
  offTimeUpdate = (callback = () => {}) => this.Instance?.removeEventListener('offtimeUpdate', callback)
  offError = (callback = () => {}) => this.errorStack.remove(callback)
  offWaiting = (callback = () => {}) => this.Instance?.removeEventListener('offwaiting', callback)
  offSeeking = (callback = () => {}) => this.Instance?.removeEventListener('offseeking', callback)
  offSeeked = (callback = () => {}) => this.Instance?.removeEventListener('offseeked', callback)
}

export const stopVoice = temporarilyNotSupport('stopVoice')
export const setInnerAudioOption = temporarilyNotSupport('setInnerAudioOption')
export const playVoice = temporarilyNotSupport('playVoice')
export const pauseVoice = temporarilyNotSupport('pauseVoice')
export const getAvailableAudioSources = temporarilyNotSupport('getAvailableAudioSources')
export const createWebAudioContext = temporarilyNotSupport('createWebAudioContext')
export const createMediaAudioPlayer = temporarilyNotSupport('createMediaAudioPlayer')

/**
 * 创建内部 audio 上下文 InnerAudioContext 对象。
 */
export const createInnerAudioContext: typeof Taro.createInnerAudioContext = () => new InnerAudioContext()

export const createAudioContext = temporarilyNotSupport('createAudioContext')
