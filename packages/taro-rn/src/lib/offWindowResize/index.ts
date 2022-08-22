import { Dimensions } from 'react-native'
import { callbackManager, resizeListener } from '../window'

/**
 * 取消监听窗口尺寸变化事件
 * @param {(size: WindowResizeParam) => void} callback 窗口尺寸变化事件的回调函数
 */
export const offWindowResize = (callback: Taro.offWindowResize.Callback): void => {
  callbackManager.remove(callback)
  if (callbackManager.count() === 0) {
    Dimensions.removeEventListener('change', resizeListener)
  }
}
