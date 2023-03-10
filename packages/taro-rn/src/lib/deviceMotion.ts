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

import Taro from '@tarojs/taro'
import { DeviceMotion } from 'expo-sensors'
import { createCallbackManager, successHandler, errorHandler } from '../utils'

const _cbManager = createCallbackManager()
let _listener: any

const intervalMap: any = {
  game: 20,
  ui: 60,
  normal: 200
}

function onDeviceMotionChange (fnc: Taro.onDeviceMotionChange.Callback): void {
  _cbManager.add(fnc)
}

function offDeviceMotionChange(fnc: Taro.onDeviceMotionChange.Callback): void {
  if (fnc && typeof fnc === 'function') {
    _cbManager.remove(fnc)
  } else if (fnc === undefined) {
    _cbManager.clear()
  } else {
    console.warn('offDeviceMotionChange failed')
  }
}

/**
 * 开始监听设备方向的变化
 * @param object
 * @param {string} [object.interval='normal'] - 监听设备方向的变化回调函数的执行频率
 */
function startDeviceMotionListening (object: Taro.startDeviceMotionListening.Option = {}): Promise<TaroGeneral.CallbackResult> {
  const { interval = 'normal', success, fail, complete } = object
  const res = { errMsg: 'startDeviceMotionListening:ok' }
  try {
    // 适配微信小程序行为：重复 start 失败
    if (_listener) {
      console.error('startDeviceMotionListening:fail')
      throw new Error('startDeviceMotionListening:fail')
    }
    _listener = DeviceMotion.addListener((res) => {
      const { rotation } = res
      _cbManager.trigger(rotation)
    })
    DeviceMotion.setUpdateInterval(intervalMap[interval] || intervalMap.normal)
    
    return successHandler(success, complete)(res)
  } catch (error) {
    res.errMsg = 'startDeviceMotionListening:fail'
    return errorHandler(fail, complete)(res)
  }
}

/**
 * 停止监听设备方向的变化
 * @param object
 */
function stopDeviceMotionListening (object: Taro.stopDeviceMotionListening.Option = {}): Promise<TaroGeneral.CallbackResult> {
  const { success, fail, complete } = object
  const res = { errMsg: 'stopDeviceMotionListening:ok' }
  try {
    _listener.remove()
    _listener = null

    return successHandler(success, complete)(res)
  } catch (error) {
    res.errMsg = 'stopDeviceMotionListening:fail'
    return errorHandler(fail, complete)(res)
  }
}

export {
  onDeviceMotionChange,
  offDeviceMotionChange,
  startDeviceMotionListening,
  stopDeviceMotionListening
}
