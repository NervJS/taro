import { Audio } from 'expo-av'
import { Permissions } from 'react-native-unimodules'
import { askAsyncPermissions, isUrl } from '../utils'

/**
 * InnerAudioContext 实例，可通过 wx.createInnerAudioContext 接口获取实例。
 */
class InnerAudioContext {
  public src: string
  public startTime: number
  public autoplay: boolean
  public loop: boolean
  public obeyMuteSwitch: boolean
  public volume: number
  public duration: number
  public currentTime: number
  public paused: boolean
  public buffered: number
  private soundObject: Audio.Sound
  private offCanplayCallback
  private offEndedCallback
  private offErrorCallback
  private offPauseCallback
  private offPlayCallback
  private offSeekedCallback
  private offSeekingCallback
  private offStopCallback
  private offTimeUpdateCallback
  private offWaitingCallback
  private onCanplayCallback
  private onEndedCallback
  private onErrorCallback
  private onPauseCallback
  private onPlayCallback
  private onSeekedCallback
  private onSeekingCallback
  private onStopCallback
  private onTimeUpdateCallback
  private onWaitingCallback

  constructor () {
    this.soundObject = new Audio.Sound()
  }

  /**
   *  播放
   */
  async play () {
    const status = await askAsyncPermissions(Permissions.AUDIO_RECORDING)

    if (status !== 'granted') {
      const res = {errMsg: `Permissions denied!`}
      return Promise.reject(res)
    }

    try {
      if (!this.src) return {errMsg: `src is undefined`}
      // const source = isUrl(this.src) ? this.src : require(this.src)
      const source = this.src
      // await this.soundObject.loadAsync(source, {}, false)
      await this.soundObject.loadAsync(source as any, {}, false)
      await this.soundObject.playAsync()
    } catch (error) {
      this.onError(error)
    }
  }

  /**
   *  暂停。暂停后的音频再播放会从暂停处开始播放
   */
  async pause () {
    try {
      await this.soundObject.pauseAsync()
    } catch (error) {
      this.onError(error)
    }
  }

  /**
   * 停止。停止后的音频再播放会从头开始播放
   */
  async stop () {
    try {
      await this.soundObject.stopAsync()
    } catch (error) {
      this.onError(error)
    }
  }

  /**
   * 跳转到指定位置
   * @param position - 跳转的时间，单位 s。精确到小数点后 3 位，即支持 ms 级别精确度
   */
  async seek (position: number) {
    const millis = position * 1000
    try {
      await this.soundObject.setPositionAsync(millis)
    } catch (error) {
      this.onError(error)
    }
  }

  /**
   * @todo
   * 销毁当前实例
   */
  destroy () {
    console.log('destroy')
    // this.soundObject = undefined
  }

  /**
   * 监听音频进入可以播放状态的事件。但不保证后面可以流畅播放
   * @param callback
   */
  onCanplay (callback) {
    this.onCanplayCallback = callback
  }

  /**
   * 取消监听音频进入可以播放状态的事件
   * @param callback
   */
  offCanplay (callback) {
    this.offCanplayCallback = callback
  }

  /**
   * 监听音频播放事件
   * @param callback
   */
  onPlay (callback) {
    this.onPlayCallback = callback
  }

  /**
   * 取消监听音频播放事件
   * @param callback
   */
  offPlay (callback) {
    this.offPlayCallback = callback
  }

  /**
   *  监听音频暂停事件
   * @param callback
   */
  onPause (callback) {
    this.onPauseCallback = callback
  }

  /**
   * 取消监听音频暂停事件
   * @param callback
   */
  offPause (callback) {
    this.offPauseCallback = callback
  }

  /**
   * 监听音频停止事件
   * @param callback
   */
  onStop (callback) {
    this.onStopCallback = callback
  }

  /**
   *  取消监听音频停止事件
   * @param callback
   */
  offStop (callback) {
    this.offStopCallback = callback
  }

  /**
   * 监听音频自然播放至结束的事件
   * @param callback
   */
  onEnded (callback) {
    this.onEndedCallback = callback
  }

  /**
   * 取消监听音频自然播放至结束的事件
   * @param callback
   */
  offEnded (callback) {
    this.offEndedCallback = callback
  }

  /**
   * 监听音频播放进度更新事件
   * @param callback
   */
  onTimeUpdate (callback) {
    this.onTimeUpdateCallback = callback
  }

  /**
   * 取消监听音频播放进度更新事件
   * @param callback
   */
  offTimeUpdate (callback) {
    this.offTimeUpdateCallback = callback
  }

  /**
   * 监听音频播放错误事件
   * @param callback
   */
  onError (callback) {
    this.onErrorCallback = callback
  }

  /**
   * 取消监听音频播放错误事件
   * @param callback
   */
  offError (callback) {
    this.offErrorCallback = callback
  }

  /**
   * 监听音频加载中事件。当音频因为数据不足，需要停下来加载时会触发
   * @param callback
   */
  onWaiting (callback) {
    this.onWaitingCallback = callback
  }

  /**
   * 取消监听音频加载中事件
   * @param callback
   */
  offWaiting (callback) {
    this.offWaitingCallback = callback
  }

  /**
   * 监听音频进行跳转操作的事件
   * @param callback
   */
  onSeeking (callback) {
    this.onSeekingCallback = callback
  }

  /**
   * 取消监听音频进行跳转操作的事件
   * @param callback
   */
  offSeeking (callback) {
    this.offSeekingCallback = callback
  }

  /**
   *  监听音频完成跳转操作的事件
   * @param callback
   */
  onSeeked (callback) {
    this.onSeekedCallback = callback
  }

  /**
   * 取消监听音频完成跳转操作的事件
   * @param callback
   */
  offSeeked (callback) {
    this.offSeekedCallback = callback
  }
}

/**
 * 创建 audio 上下文 AudioContext 对象。
 * @param {string} id - audio 组件的 id
 * @param {object} t - 在自定义组件下，当前组件实例的this，以操作组件内 audio 组件
 */
export function createInnerAudioContext (id: string, t: object) {
  return new InnerAudioContext()
}
