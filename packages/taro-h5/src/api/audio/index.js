// import { findRef } from '../utils/index'
import { createCallbackManager } from '../utils/index'
import Taro from '../../taro'

/**
 * @typedef {object} InnerAudioContext
 * @property {string} src 音频资源的地址，用于直接播放。2.2.3 开始支持云文件ID
 * @property {number} [startTime=0] 开始播放的位置（单位：s），默认为 0
 * @property {boolean} [autoplay=false] 是否自动开始播放，默认为 false
 * @property {boolean} [loop=false] 是否循环播放，默认为 false
 * @property {boolean} [obeyMuteSwitch=true] 是否遵循系统静音开关，默认为 true。当此参数为 false 时，即使用户打开了静音开关，也能继续发出声音。从 2.3.0 版本开始此参数不生效，使用 wx.setInnerAudioOption 接口统一设置。
 * @property {number} [volume=1] 音量。范围 0~1。默认为 1
 * @property {number} duration 当前音频的长度（单位 s）。只有在当前有合法的 src 时返回（只读）
 * @property {number} currentTime 当前音频的播放位置（单位 s）。只有在当前有合法的 src 时返回，时间保留小数点后 6 位（只读）
 * @property {boolean} paused 当前是是否暂停或停止状态（只读）
 * @property {number} buffered 音频缓冲的时间点，仅保证当前播放时间点到此时间点内容已缓冲（只读）
 * @property {() => void} play() 播放
 * @property {() => void} pause() 暂停。暂停后的音频再播放会从暂停处开始播放
 * @property {() => void} stop() 停止。停止后的音频再播放会从头开始播放。
 * @property {(position: number) => void} seek(number position) 跳转到指定位置
 * @property {() => void} destroy() 销毁当前实例
 * @property {(callback: function) => void} offCanplay(function callback) 取消监听音频进入可以播放状态的事件
 * @property {(callback: function) => void} offEnded(function callback) 取消监听音频自然播放至结束的事件
 * @property {(callback: function) => void} offError(function callback) 取消监听音频播放错误事件
 * @property {(callback: function) => void} offPause(function callback) 取消监听音频暂停事件
 * @property {(callback: function) => void} offPlay(function callback) 取消监听音频播放事件
 * @property {(callback: function) => void} offSeeked(function callback) 取消监听音频完成跳转操作的事件
 * @property {(callback: function) => void} offSeeking(function callback) 取消监听音频进行跳转操作的事件
 * @property {(callback: function) => void} offStop(function callback) 取消监听音频停止事件
 * @property {(callback: function) => void} offTimeUpdate(function callback) 取消监听音频播放进度更新事件
 * @property {(callback: function) => void} offWaiting(function callback) 取消监听音频加载中事件
 * @property {(callback: function) => void} onCanplay(function callback) 监听音频进入可以播放状态的事件。但不保证后面可以流畅播放
 * @property {(callback: function) => void} onEnded(function callback) 监听音频自然播放至结束的事件
 * @property {(callback: function) => void} onError(function callback) 监听音频播放错误事件
 * @property {(callback: function) => void} onPause(function callback) 监听音频暂停事件
 * @property {(callback: function) => void} onPlay(function callback) 监听音频播放事件
 * @property {(callback: function) => void} onSeeked(function callback) 监听音频完成跳转操作的事件
 * @property {(callback: function) => void} onSeeking(function callback) 监听音频进行跳转操作的事件
 * @property {(callback: function) => void} onStop(function callback) 监听音频停止事件
 * @property {(callback: function) => void} onTimeUpdate(function callback) 监听音频播放进度更新事件
 * @property {(callback: function) => void} onWaiting(function callback) 监听音频加载中事件。当音频因为数据不足，需要停下来加载时会触发
 */

/**
 * 创建内部 audio 上下文 InnerAudioContext 对象。
 * @returns {InnerAudioContext}
 */
export const createInnerAudioContext = () => {
  /** @type {HTMLAudioElement} */
  let audioEl = new Audio()

  /** @type {InnerAudioContext} */
  const iac = {}

  const callbackManagers = {
    error: createCallbackManager(),
    stop: createCallbackManager()
  }

  iac.play = () => audioEl.play()
  iac.pause = () => audioEl.pause()
  iac.stop = () => {
    iac.pause()
    iac.seek(0)
    callbackManagers.stop.trigger()
  }
  iac.seek = position => {
    audioEl.currentTime = position
  }
  /**
   * @todo destroy得并不干净
   */
  iac.destroy = () => {
    iac.stop()
    document.body.removeChild(audioEl)
    audioEl = null
  }

  const simpleProperties = [ 'src', 'autoplay', 'loop', 'volume', 'duration', 'currentTime', 'buffered', 'paused' ]
  simpleProperties.forEach(propertyName => {
    Object.defineProperty(iac, propertyName, {
      get: () => audioEl[propertyName],
      set (value) { audioEl[propertyName] = value }
    })
  })

  Object.defineProperty(iac, 'startTime', {
    value: 0
  })
  Object.defineProperty(iac, 'obeyMuteSwitch', {
    value: true
  })

  const simpleEvents = [
    'Canplay',
    'Ended',
    'Pause',
    'Play',
    'Seeked',
    'Seeking',
    'TimeUpdate',
    'Waiting'
  ]
  const simpleListenerTuples = [
    ['on', audioEl.addEventListener],
    ['off', audioEl.removeEventListener]
  ]

  simpleEvents.forEach(eventName => {
    simpleListenerTuples.forEach(([eventNamePrefix, listenerFunc]) => {
      Object.defineProperty(iac, `${eventNamePrefix}${eventName}`, {
        get () {
          return callback => listenerFunc.call(audioEl, eventName.toLowerCase(), callback)
        }
      })
    })
  })

  const customEvents = [ 'Stop', 'Error' ]
  const customListenerTuples = [
    ['on', 'add'],
    ['off', 'remove']
  ]

  customEvents.forEach(eventName => {
    customListenerTuples.forEach(([eventNamePrefix, actionName]) => {
      Object.defineProperty(iac, `${eventNamePrefix}${eventName}`, {
        get () {
          return callback => callbackManagers[eventName.toLowerCase()][actionName](callback)
        }
      })
    })
  })

  Taro.eventCenter.on('__taroRouterChange', () => { iac.stop() })

  return iac
}

/**
 * @typedef {object} AudioContext
 * @property {(src: string) => void} setSrc 设置音频地址
 * @property {() => void} play 播放音频。
 * @property {() => void} pause 暂停音频。
 * @property {(position: number) => void} seek(number position) 跳转到指定位置。
 */

/**
 * 创建 audio 上下文 AudioContext 对象。
 * @param {string} id <audio> 组件的 id
 * @param {Object} this 在自定义组件下，当前组件实例的this，以操作组件内 <audio> 组件
 * @returns {AudioContext}
 */
// export const createAudioContext = (id, componentInstance) => {
//   const refId = `__taroref_${id}`
//   const audioComponent = findRef(refId, componentInstance)
//   return audioComponent

//   /** @type {AudioContext} */
//   // const audioContext = {}
// }
