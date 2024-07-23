import inputMethodEngine from '@ohos.inputMethodEngine'
import { Current, window } from '@tarojs/runtime'

import { temporarilyNotSupport } from '../utils'
import { CallbackManager, MethodHandler } from '../utils/handler'

import type Taro from '@tarojs/taro/types'

const callbackManager = new CallbackManager()

const resizeListener = (height) => {
  callbackManager.trigger({
    height,
  })
}

let topWindow: ReturnType<typeof window.__ohos.getLastWindow>

export const onKeyboardHeightChange: typeof Taro.onKeyboardHeightChange = callback => {
  callbackManager.add(callback)
  if (callbackManager.count() === 1) {
    (Current as any).contextPromise
      .then(context => {
        const win = window.__ohos.getLastWindow(context)
        win.then(mainWindow => {
          topWindow = mainWindow
          topWindow.on('keyboardHeightChange', resizeListener)
        })
      })
  }
}

export const offKeyboardHeightChange: typeof Taro.offKeyboardHeightChange = callback => {
  callbackManager.remove(callback)
  if (callbackManager.count() === 0) {
    topWindow?.off('keyboardHeightChange', resizeListener)
  }
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
