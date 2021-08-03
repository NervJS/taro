import { Keyboard } from 'react-native'
import { createCallbackManager } from '../utils'

const hideKeyboard = (opts: Taro.hideKeyboard.Option = {}): void => {
  const { success, fail, complete } = opts
  try {
    Keyboard.dismiss()
    const res = { errMsg: 'hideKeyboard:ok' }
    success?.(res)
    complete?.(res)
  } catch (err) {
    const res = { errMsg: err.message }
    fail?.(res)
    complete?.(res)
  }
}

const _cbManager = createCallbackManager()
let _hasListener = false

const keyboardHeightListener = (e) => {
  _cbManager.trigger({ height: e.endCoordinates.height })
}

/**
 * 监听键盘高度变化
 * @param {(height: number) => void} callback 键盘高度变化事件的回调函数
 */
const onKeyboardHeightChange = (callback: Taro.onKeyboardHeightChange.Callback): void => {
  _cbManager.add(callback)
  if (!_hasListener) {
    Keyboard.addListener("keyboardDidShow", keyboardHeightListener)
    Keyboard.addListener("keyboardDidHide", keyboardHeightListener)
    _hasListener = true
  }
}

/**
 * 取消监听键盘高度变化事件
 * @param {(height: number) => void} callback 键盘高度变化事件的回调函数
 */
const offKeyboardHeightChange = (callback?: Taro.onKeyboardHeightChange.Callback): void => {
  if (callback && typeof callback === 'function') {
    _cbManager.remove(callback)
  } else if (callback === undefined) {
    _cbManager.clear()
  } else {
    console.warn('offKeyboardHeightChange failed')
  }
  if (_cbManager.count() === 0) {
    Keyboard.removeAllListeners('keyboardDidShow')
    Keyboard.removeAllListeners('keyboardDidHide')
    _hasListener = false
  }
}

export {
  onKeyboardHeightChange,
  offKeyboardHeightChange,
  hideKeyboard
}
