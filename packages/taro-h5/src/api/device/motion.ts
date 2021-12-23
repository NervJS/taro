import Taro from '@tarojs/api'
import { CallbackManager, MethodHandler } from '../utils/handler'

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

const getDeviceOrientationListener = interval => {
  let lock
  let timer
  return evt => {
    if (lock) return
    lock = true
    timer && clearTimeout(timer)
    callbackManager.trigger({
      alpha: evt.alpha,
      beta: evt.beta,
      gamma: evt.gamma
    })
    timer = setTimeout(() => { lock = false }, interval)
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
      deviceMotionListener = getDeviceOrientationListener(intervalObj.interval)
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
