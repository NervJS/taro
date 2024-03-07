import Taro from '@tarojs/api'

import { AudioContext } from './AudioContext'
import { InnerAudioContext } from './InnerAudioContext'

/**
 * 创建内部 audio 上下文 InnerAudioContext 对象。
 *
 * @canUse createInnerAudioContext
 */
// @ts-ignore
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
