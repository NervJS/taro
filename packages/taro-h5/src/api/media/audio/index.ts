import Taro from '@tarojs/api'

import { temporarilyNotSupport } from '../../../utils'
import { InnerAudioContext } from './InnerAudioContext'

// 音频

export const stopVoice = /* @__PURE__ */ temporarilyNotSupport('stopVoice')
export const setInnerAudioOption = /* @__PURE__ */ temporarilyNotSupport('setInnerAudioOption')
export const playVoice = /* @__PURE__ */ temporarilyNotSupport('playVoice')
export const pauseVoice = /* @__PURE__ */ temporarilyNotSupport('pauseVoice')
export const getAvailableAudioSources = /* @__PURE__ */ temporarilyNotSupport('getAvailableAudioSources')
export const createWebAudioContext: typeof Taro.createWebAudioContext = () => {
  if (typeof AudioContext === 'undefined') {
    throw new Error('createWebAudioContext:fail AudioContext is not supported')
  }
  return new AudioContext()
}
export const createMediaAudioPlayer = /* @__PURE__ */ temporarilyNotSupport('createMediaAudioPlayer')

/**
 * 创建内部 audio 上下文 InnerAudioContext 对象。
 */
export const createInnerAudioContext: typeof Taro.createInnerAudioContext = () => new InnerAudioContext()

export const createAudioContext = /* @__PURE__ */ temporarilyNotSupport('createAudioContext')
