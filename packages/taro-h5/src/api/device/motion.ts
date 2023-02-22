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
let deviceMotionListener

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
 * 停止监听设备方向的变化。
 */
export const stopDeviceMotionListening: typeof Taro.stopDeviceMotionListening = ({ success, fail, complete } = {}) => {
  const handle = new MethodHandler({ name: 'stopDeviceMotionListening', success, fail, complete })
  try {
    window.removeEventListener('deviceorientation', deviceMotionListener, true)
    return handle.success()
  } catch (e) {
    return handle.fail({ errMsg: e.message })
  }
}

/**
 * 开始监听设备方向的变化。
 */
export const startDeviceMotionListening: typeof Taro.startDeviceMotionListening = ({ interval = 'normal', success, fail, complete } = {}) => {
  const handle = new MethodHandler({ name: 'startDeviceMotionListening', success, fail, complete })
  try {
    const intervalObj = INTERVAL_MAP[interval]
    if (window.DeviceOrientationEvent) {
      if (deviceMotionListener) {
        stopDeviceMotionListening()
      }
      deviceMotionListener = throttle((evt: DeviceOrientationEvent) => {
        callbackManager.trigger({
          alpha: evt.alpha,
          beta: evt.beta,
          gamma: evt.gamma
        })
      }, intervalObj.interval)
      window.addEventListener('deviceorientation', deviceMotionListener, true)
    } else {
      throw new Error('deviceMotion is not supported')
    }
    return handle.success()
  } catch (e) {
    return handle.fail({ errMsg: e.message })
  }
}

/**
 * 监听设备方向变化事件。
 */
export const onDeviceMotionChange: typeof Taro.onDeviceMotionChange = callback => {
  callbackManager.add(callback)
}

/**
 * 取消监听设备方向变化事件，参数为空，则取消所有的事件监听。
 */
export const offDeviceMotionChange: typeof Taro.offDeviceMotionChange = callback => {
  callbackManager.remove(callback)
}
