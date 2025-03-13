import sensor from '@ohos.sensor'

import { eventCenter } from '../../emitter/emitter'
import { CallbackManager } from '../../utils/handler'

import type { TaroAny } from '@tarojs/runtime'
import type { IEtsMethodsOptions } from '../../index'

const callbackManager = new CallbackManager()
let devicemotionListener: TaroAny

const GRAVITY_CONSTANT = 9.8 // 1g = 9.8m/s²

const stopAccelerometerCore = (): void => {
  sensor.off(sensor.SensorType.SENSOR_TYPE_ID_ACCELEROMETER, devicemotionListener)
}

/**
 * 停止监听加速度数据。
 */
export const stopAccelerometer = (option: IEtsMethodsOptions): TaroAny => {
  const res: TaroAny = {}
  const errorHandler: TaroAny = option.errorHandler
  const successHandler: TaroAny = option.successHandler
  try {
    stopAccelerometerCore()
    successHandler(res)
  } catch (e) {
    res.errMsg = e.message
    errorHandler(res)
  }
}

const GAME: TaroAny = {
  interval: 20 * 1000 * 1000,
  frequency: 50
}
const UI: TaroAny = {
  interval: 60 * 1000 * 1000,
  frequency: 16.67
}
const NORMAL: TaroAny = {
  interval: 200 * 1000 * 1000,
  frequency: 5
}
const INTERVAL_MAP: TaroAny = {
  game: GAME,
  ui: UI,
  normal: NORMAL
}

/**
 * 开始监听加速度数据。
 */
export const startAccelerometer = (option: IEtsMethodsOptions): TaroAny => {
  const interval: TaroAny = option?.args?.[0]
  const errorHandler: TaroAny = option.errorHandler
  const successHandler: TaroAny = option.successHandler
  try {
    const intervalObj: TaroAny = INTERVAL_MAP[interval]
    if (devicemotionListener) {
      stopAccelerometerCore()
    }
    sensor.on(sensor.SensorType.SENSOR_TYPE_ID_ACCELEROMETER, (data) => {
      eventCenter.trigger('__TaroStartAccelerometer', {
        x: data?.x / GRAVITY_CONSTANT || 0,
        y: data?.y / GRAVITY_CONSTANT || 0,
        z: data?.z / GRAVITY_CONSTANT || 0
      })
    }, {
      interval: intervalObj.interval,
    })
    successHandler()
  } catch (e) {
    errorHandler({ errMsg: e.message })
  }
}
