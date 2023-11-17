import Taro from '@tarojs/api'

import { temporarilyNotSupport } from '../../../utils'
import { AudioContext } from './AudioContext'
import { InnerAudioContext } from './InnerAudioContext'

/**
 * 结束播放语音
 * 
 * @canNotUse stopVoice
 */
export const stopVoice = /* @__PURE__ */ temporarilyNotSupport('stopVoice')

/**
 * 设置 InnerAudioContext项
 * 
 * @canNotUse setInnerAudioOption
 */
export const setInnerAudioOption = /* @__PURE__ */ temporarilyNotSupport('setInnerAudioOption')

/**
 * 开始播放语音
 * 
 * @canNotUse playVoice
 */
export const playVoice = /* @__PURE__ */ temporarilyNotSupport('playVoice')

/**
 * 暂停正在播放的语音
 * 
 * @canNotUse pauseVoice
 */
export const pauseVoice = /* @__PURE__ */ temporarilyNotSupport('pauseVoice')

/**
 * 获取当前支持的音频输入源
 * 
 * @canNotUse getAvailableAudioSources
 */
export const getAvailableAudioSources = /* @__PURE__ */ temporarilyNotSupport('getAvailableAudioSources')

/**
 * 创建 WebAudio 上下文
 * 
 * @canNotUse createWebAudioContext
 */
export const createWebAudioContext = /* @__PURE__ */ temporarilyNotSupport('createWebAudioContext')

/**
 * 创建媒体音频播放器对象 MediaAudioPlayer 对象
 * 
 * @canNotUse createMediaAudioPlayer
 */
export const createMediaAudioPlayer = /* @__PURE__ */ temporarilyNotSupport('createMediaAudioPlayer')

/**
 * 创建内部 audio 上下文 InnerAudioContext 对象。
 * 
 * @canUse createInnerAudioContext
 */
export const createInnerAudioContext: typeof Taro.createInnerAudioContext = (options) => {
  if (options && typeof options === 'object' && options.useWebAudioImplement) {
    return new InnerAudioContext()
  } else {
    // @ts-ignore
    return native.createInnerAudioContext()
  }
}

/**
 * 创建 audio 上下文 AudioContext 对象
 * 
 * @canUse createAudioContext
 */
export const createAudioContext: typeof Taro.createAudioContext = () => new AudioContext()

/**
 * AudioBuffer 接口表示存在内存里的一段短小的音频资源
 * 
 * @canNotUse AudioBuffer
 */

/**
 * MediaAudioPlayer 实例
 * 
 * @canNotUse MediaAudioPlayer
 */

/**
 * WebAudioContext 实例
 * 
 * @canNotUse WebAudioContext
 */

/**
 * 一类音频处理模块
 * 
 * @canNotUse WebAudioContextNode
 */