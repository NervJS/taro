import { Keyboard } from 'react-native'
import { createCallbackManager } from '../utils'

const hideKeyboard = (opts: Taro.hideKeyboard.Option = {}): void => {
  const { success, fail, complete } = opts
  try {
    Keyboard.dismiss()
    const res = { errMsg: 'hideKeyboard:ok' }
    success && success(res)
    complete && complete(res)
  } catch (err) {
    const res = { errMsg: err.message }
    fail && fail(res)
    complete && complete(res)
  }
}

const callbackManager = createCallbackManager()

const keyboardHeightListener = (e) => {
  callbackManager.trigger(e.endCoordinates.height)
}

/**
 * 监听键盘高度变化
 * @param {(height: number) => void} callback 键盘高度变化事件的回调函数
 */
const onKeyboardHeightChange = (callback: Taro.onKeyboardHeightChange.Callback): void => {
  callbackManager.add(callback)
  if (callbackManager.count() === 1) {
    Keyboard.addListener('keyboardDidShow', keyboardHeightListener)
    Keyboard.addListener('keyboardDidHide', keyboardHeightListener)
  }
}

/**
 * 取消监听键盘高度变化事件
 * @param {(height: number) => void} callback 键盘高度变化事件的回调函数
 */
const offKeyboardHeightChange = (callback: Taro.onKeyboardHeightChange.Callback): void => {
  callbackManager.remove(callback)
  if (callbackManager.count() === 0) {
    Keyboard.removeListener('keyboardDidShow', keyboardHeightListener)
    Keyboard.removeListener('keyboardDidHide', keyboardHeightListener)
  }
}

export {
  onKeyboardHeightChange,
  offKeyboardHeightChange,
  hideKeyboard
}
