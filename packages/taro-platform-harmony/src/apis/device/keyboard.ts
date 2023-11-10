import { Current, window } from '@tarojs/runtime'
import Taro from '@tarojs/taro'

import { temporarilyNotSupport } from '../utils'
import { CallbackManager } from '../utils/handler'

const callbackManager = new CallbackManager()

const resizeListener = (height) => {
  callbackManager.trigger({
    height,
  })
}

let topWindow: ReturnType<typeof window.__ohos.findWindow>

/**
 * 监听窗口尺寸变化事件
 */
export const onKeyboardHeightChange: typeof Taro.onKeyboardHeightChange = callback => {
  callbackManager.add(callback)
  if (callbackManager.count() === 1) {
    (Current as any).contextPromise
      .then(context => {
        const win = window.__ohos.getTopWindow(context)
        win.then(mainWindow => {
          topWindow = mainWindow
          topWindow.on('keyboardHeightChange', resizeListener)
        })
      })
  }
}

/**
 * 取消监听窗口尺寸变化事件
 */
export const offKeyboardHeightChange: typeof Taro.offKeyboardHeightChange = callback => {
  callbackManager.remove(callback)
  if (callbackManager.count() === 0) {
    topWindow?.off('keyboardHeightChange', resizeListener)
  }
}

export const hideKeyboard = /* @__PURE__ */ temporarilyNotSupport('hideKeyboard')
export const getSelectedTextRange = /* @__PURE__ */ temporarilyNotSupport('getSelectedTextRange')
