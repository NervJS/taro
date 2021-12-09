import Taro from '@tarojs/api'
import { CallbackManager } from '../../utils/handler'

const callbackManager = new CallbackManager()

const resizeListener = () => {
  callbackManager.trigger({
    windowWidth: window.screen.width,
    windowHeight: window.screen.height
  })
}

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
