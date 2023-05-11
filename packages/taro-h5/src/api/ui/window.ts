import Taro from '@tarojs/api'

import { temporarilyNotSupport } from '../../utils'
import { CallbackManager } from '../../utils/handler'

const callbackManager = new CallbackManager()

const resizeListener = () => {
  callbackManager.trigger({
    windowWidth: window.screen.width,
    windowHeight: window.screen.height
  })
}

/**
 * 设置窗口大小，该接口仅适用于 PC 平台，使用细则请参见指南
 */
export const setWindowSize = temporarilyNotSupport('setWindowSize')

/**
 * 监听窗口尺寸变化事件
 */
export const onWindowResize: typeof Taro.onWindowResize = callback => {
  callbackManager.add(callback)
  if (callbackManager.count() === 1) {
    window.addEventListener('resize', resizeListener)
  }
}

/**
 * 取消监听窗口尺寸变化事件
 */
export const offWindowResize: typeof Taro.offWindowResize = callback => {
  callbackManager.remove(callback)
  if (callbackManager.count() === 0) {
    window.removeEventListener('resize', resizeListener)
  }
}

export const checkIsPictureInPictureActive = temporarilyNotSupport('checkIsPictureInPictureActive')
