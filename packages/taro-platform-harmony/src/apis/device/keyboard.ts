import { window } from '@tarojs/runtime'
import Taro from '@tarojs/taro'

import { temporarilyNotSupport } from '../utils'
import { CallbackManager } from '../utils/handler'

const callbackManager = new CallbackManager()

const resizeListener = (data) => {
  callbackManager.trigger({
    ...data,
    // windowWidth: window.screen.width,
    // windowHeight: window.screen.height
  })
}

/**
 * 监听窗口尺寸变化事件
 */
export const onKeyboardHeightChange: typeof Taro.onKeyboardHeightChange = callback => {
  callbackManager.add(callback)
  if (callbackManager.count() === 1) {
    window.addEventListener('keyboardHeightChange', resizeListener)
  }
}

/**
 * 取消监听窗口尺寸变化事件
 */
export const offKeyboardHeightChange: typeof Taro.offKeyboardHeightChange = callback => {
  callbackManager.remove(callback)
  if (callbackManager.count() === 0) {
    window.removeEventListener('keyboardHeightChange', resizeListener)
  }
}

export const hideKeyboard = /* @__PURE__ */ temporarilyNotSupport('hideKeyboard')
export const getSelectedTextRange = /* @__PURE__ */ temporarilyNotSupport('getSelectedTextRange')
