/* 
 *  MIT License
 *  
 *  Copyright (c) 2018 O2Team
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
function startAccelerometer(opts: Taro.startAccelerometer.Option = {}): Promise<TaroGeneral.CallbackResult> {
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
function stopAccelerometer(opts: Taro.stopAccelerometer.Option = {}): Promise<TaroGeneral.CallbackResult> {
  const { success, fail, complete } = opts
  const res = { errMsg: 'stopAccelerometer:ok' }
  try {
    _listener && _listener.remove()
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
