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

import { Accelerometer } from 'expo-sensors'
import { createCallbackManager, errorHandler, successHandler } from '../utils'

const _cbManager = createCallbackManager()
let _listener: any

const intervalMap: any = {
  game: 20,
  ui: 60,
  normal: 200
}

function offAccelerometerChange(fnc?: Taro.onAccelerometerChange.Callback): void {
  if (fnc && typeof fnc === 'function') {
    _cbManager.remove(fnc)
  } else if (fnc === undefined) {
    _cbManager.clear()
  } else {
    console.warn('offAccelerometerChange failed')
  }
}

function onAccelerometerChange(fnc: Taro.onAccelerometerChange.Callback): void {
  _cbManager.add(fnc)
}

/**
 * 开始监听加速度数据。
 * @param {Object} opts
 * @param {string} [opts.interval='normal'] 监听加速度数据回调函数的执行频率
 */
function startAccelerometer(opts: Taro.startAccelerometer.Option = {}): Promise<Taro.General.CallbackResult> {
  const { interval = 'normal', success, fail, complete } = opts
  const res = { errMsg: 'startAccelerometer:ok' }
  try {
    // 适配微信小程序行为：重复 start 失败
    if (_listener) {
      console.error('startAccelerometer:fail')
      throw new Error('startAccelerometer:fail')
    }
    _listener = Accelerometer.addListener((e: Taro.onAccelerometerChange.Result) => {
      _cbManager.trigger(e)
    })
    Accelerometer.setUpdateInterval(intervalMap[interval])

    return successHandler(success, complete)(res)
  } catch (error) {
    res.errMsg = 'startAccelerometer:fail'
    return errorHandler(fail, complete)(res)
  }
}

/**
 * 停止监听加速度数据
 * @param opts
 */
function stopAccelerometer(opts: Taro.stopAccelerometer.Option = {}): Promise<Taro.General.CallbackResult> {
  const { success, fail, complete } = opts
  const res = { errMsg: 'stopAccelerometer:ok' }
  try {
    _listener.remove()
    _listener = null
    return successHandler(success, complete)(res)
  } catch (error) {
    res.errMsg = 'stopAccelerometer:fail'
    return errorHandler(fail, complete)(res)
  }
}

export {
  onAccelerometerChange,
  offAccelerometerChange,
  startAccelerometer,
  stopAccelerometer
}
