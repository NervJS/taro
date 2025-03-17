import inputMethodEngine from '@ohos.inputMethodEngine'
import { CallbackManager, MethodHandler } from '@tarojs/plugin-platform-harmony-ets/dist/apis/utils/handler'
import { Current, window } from '@tarojs/runtime'

import { temporarilyNotSupport } from '../utils'

import type Taro from '@tarojs/taro/types'

const callbackManager = new CallbackManager()

const resizeListener = (height) => {
  callbackManager.trigger({
    height: px2vp(height)
  })
}

let topWindow: ReturnType<typeof window.__ohos.getLastWindow>

(Current as any).contextPromise.then(context => {
  const win = window.__ohos.getLastWindow(context)
  win.then(mainWindow => {
    topWindow = mainWindow
    topWindow.on('keyboardHeightChange', resizeListener)
  })
})

export const onKeyboardHeightChange: typeof Taro.onKeyboardHeightChange = callback => {
  callbackManager.add(callback)
}

export const offKeyboardHeightChange: typeof Taro.offKeyboardHeightChange = callback => {
  callbackManager.remove(callback)
}

// @ts-ignore
let keyboardController: inputMethodEngine.KeyboardController
inputMethodEngine.getInputMethodAbility()
  // FIXME 当前事件无效，等待鸿蒙方面沟通
  .on('inputStart', (kbController) => {
    keyboardController = kbController
  })

export const hideKeyboard: typeof Taro.hideKeyboard = function (options) {
  const { success, fail, complete } = options || {}
  const handle = new MethodHandler({ name: 'hideKeyboard', success, fail, complete })
  return new Promise((resolve, reject) => {
    keyboardController?.hide((err) => {
      if (err) {
        return handle.fail({
          errMsg: err,
        }, { resolve, reject })
      }
      return handle.success({}, { resolve, reject })
    })
  })
}

export const getSelectedTextRange = /* @__PURE__ */ temporarilyNotSupport('getSelectedTextRange')
