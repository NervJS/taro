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

import Taro from '@tarojs/api'

import { throttle } from '../../utils'
import { CallbackManager, MethodHandler } from '../../utils/handler'

const callbackManager = new CallbackManager()
let devicemotionListener

/**
 * 停止监听加速度数据。
 */
export const stopAccelerometer: typeof Taro.stopAccelerometer = ({ success, fail, complete } = {}) => {
  const res: Partial<TaroGeneral.CallbackResult> = {}
  const handle = new MethodHandler({ name: 'stopAccelerometer', success, fail, complete })
  try {
    window.removeEventListener('devicemotion', devicemotionListener, true)
    return handle.success(res)
  } catch (e) {
    res.errMsg = e.message
    return handle.fail(res)
  }
}

const INTERVAL_MAP = {
  game: {
    interval: 20,
    frequency: 50
  },
  ui: {
    interval: 60,
    frequency: 16.67
  },
  normal: {
    interval: 200,
    frequency: 5
  }
}

/**
 * 开始监听加速度数据。
 */
export const startAccelerometer: typeof Taro.startAccelerometer = ({ interval = 'normal', success, fail, complete } = {}) => {
  const handle = new MethodHandler({ name: 'startAccelerometer', success, fail, complete })
  try {
    if (window.DeviceMotionEvent) {
      const intervalObj = INTERVAL_MAP[interval]
      if (devicemotionListener) {
        stopAccelerometer()
      }
      devicemotionListener = throttle((evt: DeviceMotionEvent) => {
        callbackManager.trigger({
          x: evt.acceleration?.x || 0,
          y: evt.acceleration?.y || 0,
          z: evt.acceleration?.z || 0
        })
      }, intervalObj.interval)
      window.addEventListener('devicemotion', devicemotionListener, true)
    } else {
      throw new Error('accelerometer is not supported')
    }
    return handle.success()
  } catch (e) {
    return handle.fail({ errMsg: e.message })
  }
}

/**
 * 监听加速度数据事件。频率根据 Taro.startAccelerometer() 的 interval 参数。可使用 Taro.stopAccelerometer() 停止监听。
 */
export const onAccelerometerChange: typeof Taro.onAccelerometerChange = callback => {
  callbackManager.add(callback)
}

/**
 * 取消监听加速度数据事件，参数为空，则取消所有的事件监听
 */
export const offAccelerometerChange: typeof Taro.offAccelerometerChange = callback => {
  callbackManager.remove(callback)
}
