import sensor from '@ohos.sensor'

import { CallbackManager, MethodHandler } from '../utils'

import type Taro from '@tarojs/taro/types'

const callbackManager = new CallbackManager()
let devicemotionListener

/**
 * 停止监听加速度数据。
 */
export const stopGyroscope: typeof Taro.stopGyroscope = ({ success, fail, complete } = {}) => {
  const res: Partial<TaroGeneral.CallbackResult> = {}
  const handle = new MethodHandler({ name: 'stopGyroscope', success, fail, complete })
  try {
    sensor.off(sensor.SensorType.SENSOR_TYPE_ID_GYROSCOPE, devicemotionListener)
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
export const startGyroscope: typeof Taro.startGyroscope = ({ interval = 'normal', success, fail, complete } = {}) => {
  const handle = new MethodHandler({ name: 'startGyroscope', success, fail, complete })
  try {
    const intervalObj = INTERVAL_MAP[interval]
    if (devicemotionListener) {
      stopGyroscope()
    }
    sensor.on(sensor.SensorType.SENSOR_TYPE_ID_GYROSCOPE, (data) => {
      callbackManager.trigger({
        x: data?.x || 0,
        y: data?.y || 0,
        z: data?.z || 0
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
 * 监听加速度数据事件。频率根据 Taro.startGyroscope() 的 interval 参数。可使用 Taro.stopGyroscope() 停止监听。
 */
export const onGyroscopeChange: typeof Taro.onGyroscopeChange = callback => {
  callbackManager.add(callback)
}

/**
 * 取消监听加速度数据事件，参数为空，则取消所有的事件监听
 */
export const offGyroscopeChange: typeof Taro.offGyroscopeChange = callback => {
  callbackManager.remove(callback)
}
