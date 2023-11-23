import Taro from '@tarojs/api'

import { AudioContext } from './AudioContext'
import { InnerAudioContext } from './InnerAudioContext'

/**
 * 结束播放语音
 * 
 * @canNotUse stopVoice
 */
export { stopVoice } from '@tarojs/taro-h5'

/**
 * 设置 InnerAudioContext项
 * 
 * @canNotUse setInnerAudioOption
 */
export { setInnerAudioOption } from '@tarojs/taro-h5'

/**
 * 开始播放语音
 * 
 * @canNotUse playVoice
 */
export { playVoice } from '@tarojs/taro-h5'

/**
 * 暂停正在播放的语音
 * 
 * @canNotUse pauseVoice
 */
export { pauseVoice } from '@tarojs/taro-h5'

/**
 * 获取当前支持的音频输入源
 * 
 * @canNotUse getAvailableAudioSources
 */
export { getAvailableAudioSources } from '@tarojs/taro-h5'

/**
 * 创建 WebAudio 上下文
 * 
 * @canNotUse createWebAudioContext
 */
export { createWebAudioContext } from '@tarojs/taro-h5'

/**
 * 创建媒体音频播放器对象 MediaAudioPlayer 对象
 * 
 * @canNotUse createMediaAudioPlayer
 */
export { createMediaAudioPlayer } from '@tarojs/taro-h5'

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