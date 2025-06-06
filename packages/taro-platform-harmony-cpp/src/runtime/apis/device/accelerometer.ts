import sensor from '@ohos.sensor'

import { CallbackManager, MethodHandler } from '../utils/handler'

import type Taro from '@tarojs/taro/types'

const callbackManager = new CallbackManager()
let devicemotionListener

const GRAVITY_CONSTANT = 9.8 // 1g = 9.8m/s²

/**
 * 停止监听加速度数据。
 */
export const stopAccelerometer: typeof Taro.stopAccelerometer = ({ success, fail, complete } = {}) => {
  const res: Partial<TaroGeneral.CallbackResult> = {}
  const handle = new MethodHandler({ name: 'stopAccelerometer', success, fail, complete })
  try {
    sensor.off(sensor.SensorType.SENSOR_TYPE_ID_ACCELEROMETER, devicemotionListener)
    return handle.success(res)
  } catch (e) {
    res.errMsg = e.message
    return handle.fail(res)
  }
}

const INTERVAL_MAP = {
  game: {
    interval: 20 * 1000 * 1000,
    frequency: 50
  },
  ui: {
    interval: 60 * 1000 * 1000,
    frequency: 16.67
  },
  normal: {
    interval: 200 * 1000 * 1000,
    frequency: 5
  }
}

/**
 * 开始监听加速度数据。
 */
export const startAccelerometer: typeof Taro.startAccelerometer = ({ interval = 'normal', success, fail, complete } = {}) => {
  const handle = new MethodHandler({ name: 'startAccelerometer', success, fail, complete })
  try {
    const intervalObj = INTERVAL_MAP[interval]
    if (devicemotionListener) {
      stopAccelerometer()
    }
    sensor.on(sensor.SensorType.SENSOR_TYPE_ID_ACCELEROMETER, (data) => {
      callbackManager.trigger({
        x: data?.x / GRAVITY_CONSTANT || 0,
        y: data?.y / GRAVITY_CONSTANT || 0,
        z: data?.z / GRAVITY_CONSTANT || 0
      })
    }, {
      interval: intervalObj.interval,
    })
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
