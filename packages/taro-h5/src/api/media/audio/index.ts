import Taro from '@tarojs/api'
import { temporarilyNotSupport } from '../../utils'
import { InnerAudioContext } from './InnerAudioContext'

// 音频

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
