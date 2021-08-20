/*!
* Licensed to the O2Team under one
* or more contributor license agreements.  See the NOTICE file
* distributed with this work for additional information
* regarding copyright ownership.  The ASF licenses this file
* to you under the Apache License, Version 2.0 (the
* "License"); you may not use this file except in compliance
* with the License.  You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied.  See the License for the
* specific language governing permissions and limitations
* under the License.
*/

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
