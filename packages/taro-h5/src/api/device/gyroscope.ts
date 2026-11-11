import Taro from '@tarojs/api'
import throttle from 'lodash-es/throttle'

import { CallbackManager, MethodHandler } from '../../utils/handler'

const callbackManager = new CallbackManager()
let gyroscopeListener: ReturnType<typeof throttle> | undefined

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

/** Note: devicemotion 事件中 rotationRate 的单位为 deg/s，小程序端陀螺仪数据的单位为 rad/s */
const DEG_TO_RAD = Math.PI / 180

/**
 * 停止监听陀螺仪数据。
 */
export const stopGyroscope: typeof Taro.stopGyroscope = ({ success, fail, complete } = {}) => {
  const handle = new MethodHandler({ name: 'stopGyroscope', success, fail, complete })
  try {
    if (gyroscopeListener) {
      window.removeEventListener('devicemotion', gyroscopeListener, true)
      gyroscopeListener.cancel()
      gyroscopeListener = undefined
    }
    return handle.success()
  } catch (e) {
    return handle.fail({ errMsg: e.message })
  }
}

/**
 * 开始监听陀螺仪数据。
 */
export const startGyroscope: typeof Taro.startGyroscope = ({ interval = 'normal', success, fail, complete } = {}) => {
  const handle = new MethodHandler({ name: 'startGyroscope', success, fail, complete })
  try {
    if (window.DeviceMotionEvent) {
      const intervalObj = INTERVAL_MAP[interval]
      if (gyroscopeListener) {
        stopGyroscope()
      }
      /**
       * Note: rotationRate 的 alpha、beta、gamma 分别为设备绕 z、x、y 轴旋转的角速度
       * @see https://w3c.github.io/deviceorientation/#devicemotion
       */
      gyroscopeListener = throttle((evt: DeviceMotionEvent) => {
        const rotationRate = evt.rotationRate
        callbackManager.trigger({
          x: (rotationRate?.beta || 0) * DEG_TO_RAD,
          y: (rotationRate?.gamma || 0) * DEG_TO_RAD,
          z: (rotationRate?.alpha || 0) * DEG_TO_RAD
        })
      }, intervalObj.interval)
      window.addEventListener('devicemotion', gyroscopeListener, true)
    } else {
      throw new Error('gyroscope is not supported')
    }
    return handle.success()
  } catch (e) {
    return handle.fail({ errMsg: e.message })
  }
}

/**
 * 监听陀螺仪数据变化事件。频率根据 Taro.startGyroscope() 的 interval 参数。可以使用 Taro.stopGyroscope() 停止监听。
 */
export const onGyroscopeChange: typeof Taro.onGyroscopeChange = callback => {
  callbackManager.add(callback)
}

/**
 * 取消监听陀螺仪数据变化事件，参数为空，则取消所有的事件监听。
 */
export const offGyroscopeChange: typeof Taro.offGyroscopeChange = callback => {
  callbackManager.remove(callback)
}
