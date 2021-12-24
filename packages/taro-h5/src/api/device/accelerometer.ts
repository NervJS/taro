import Taro from '@tarojs/api'
import { CallbackManager, MethodHandler } from '../utils/handler'

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

const getDevicemotionListener = interval => {
  let lock
  let timer
  return evt => {
    if (lock) return
    lock = true
    timer && clearTimeout(timer)
    callbackManager.trigger({
      x: evt.acceleration.x || 0,
      y: evt.acceleration.y || 0,
      z: evt.acceleration.z || 0
    })
    timer = setTimeout(() => { lock = false }, interval)
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
      devicemotionListener = getDevicemotionListener(intervalObj.interval)
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
