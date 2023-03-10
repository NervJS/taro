/* 
 *  MIT License
 *  
 *  Copyright (c) 2018 O2Team、58.com、other contributors
 *  
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *  
 *  The above copyright notice and this permission notice shall be included in all
 *  copies or substantial portions of the Software.
 *  
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 */

import { Keyboard } from 'react-native'
import { createCallbackManager, errorHandler, successHandler } from '../utils'

const hideKeyboard = (opts: Taro.hideKeyboard.Option = {}): Promise<TaroGeneral.CallbackResult> => {
  const { success, fail, complete } = opts
  try {
    Keyboard.dismiss()
    const res = { errMsg: 'hideKeyboard:ok' }
    return successHandler(success, complete)(res)
  } catch (err) {
    const res = { errMsg: err.message }
    return errorHandler(fail, complete)(res)
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
