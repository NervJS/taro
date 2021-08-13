import { createCallbackManager } from '../utils/index'

const callbackManager = createCallbackManager()

const resizeListener = () => {
  callbackManager.trigger({
    windowWidth: window.screen.width,
    windowHeight: window.screen.height
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
export const onWindowResize = callback => {
  callbackManager.add(callback)
  if (callbackManager.count() === 1) {
    window.addEventListener('resize', resizeListener)
  }
}

/**
 * 取消监听窗口尺寸变化事件
 * @param {(size: WindowResizeParam) => void} callback 窗口尺寸变化事件的回调函数
 */
export const offWindowResize = callback => {
  callbackManager.remove(callback)
  if (callbackManager.count() === 0) {
    window.removeEventListener('resize', resizeListener)
  }
}
