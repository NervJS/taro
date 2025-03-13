import { eventCenter } from '@tarojs/runtime'

import { CallbackManager, ETS_METHODS_TRIGGER_EVENTNAME, MethodHandler } from '../utils'

import type Taro from '@tarojs/taro/types'

const callbackManager = new CallbackManager()

eventCenter.on('__TaroStartAccelerometer', (data) => {
  callbackManager.trigger(data)
})

export const stopAccelerometer: typeof Taro.stopAccelerometer = function (options: any = {}) {
  const name = 'stopAccelerometer'
  const { success, fail, complete } = options
  const handle = new MethodHandler({ name, success, fail, complete })
  return new Promise((resolve, reject) => {
    eventCenter.trigger(ETS_METHODS_TRIGGER_EVENTNAME, {
      name,
      args: [options],
      scope: 'apis',
      type: 'method',
      successHandler: (res = {}) => handle.success(res, { resolve, reject }),
      errorHandler: (res = {}) => handle.fail(res, { resolve, reject }),
    })
  })
}

export const startAccelerometer: typeof Taro.startAccelerometer = function (options: any = {}) {
  const name = 'startAccelerometer'
  const { interval = 'normal', success, fail, complete } = options
  const handle = new MethodHandler({ name, success, fail, complete })
  return new Promise((resolve, reject) => {
    eventCenter.trigger(ETS_METHODS_TRIGGER_EVENTNAME, {
      name,
      args: [interval],
      scope: 'apis',
      type: 'method',
      successHandler: (res = {}) => handle.success(res, { resolve, reject }),
      errorHandler: (res = {}) => handle.fail(res, { resolve, reject }),
    })
  })
}

export const onAccelerometerChange: typeof Taro.onAccelerometerChange = function (callback: any) {
  callbackManager.add(callback)
}

export const offAccelerometerChange: typeof Taro.offAccelerometerChange = function (callback: any) {
  callbackManager.remove(callback)
}
