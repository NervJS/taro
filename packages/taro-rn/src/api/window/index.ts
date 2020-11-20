import { Dimensions, ScaledSize } from 'react-native'
import { createCallbackManager } from '../../utils'

const callbackManager = createCallbackManager()

const resizeListener = ({ window }: { window: ScaledSize }) => {
  callbackManager.trigger({
    windowWidth: window.width,
    windowHeight: window.height
  })
}

/**
 * @typedef {Object} WindowResizeParam
 * @property {number} windowWidth 变化后的窗口宽度，单位 px
 * @property {number} windowHeight 变化后的窗口高度，单位 px
 */

/**
 * 监听窗口尺寸变化事件
 * @param {(size: WindowResizeParam) => void} callback 窗口尺寸变化事件的回调函数
 */
export const onWindowResize = (callback: Taro.onWindowResize.Callback):void => {
  callbackManager.add(callback)
  if (callbackManager.count() === 1) {
    Dimensions.addEventListener('change', resizeListener)
  }
}

/**
 * 取消监听窗口尺寸变化事件
 * @param {(size: WindowResizeParam) => void} callback 窗口尺寸变化事件的回调函数
 */
export const offWindowResize = (callback: Taro.offWindowResize.Callback):void => {
  callbackManager.remove(callback)
  if (callbackManager.count() === 0) {
    Dimensions.removeEventListener('change', resizeListener)
  }
}
