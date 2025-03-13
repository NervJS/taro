import { eventCenter } from '@tarojs/runtime'

import { ETS_METHODS_TRIGGER_EVENTNAME, MethodHandler } from '../utils'

import type Taro from '@tarojs/taro/types'

export const vibrateLong: typeof Taro.vibrateLong = function () {
  const name = 'vibrateLong'
  const handle = new MethodHandler({ name })
  return new Promise((resolve, reject) => {
    eventCenter.trigger(ETS_METHODS_TRIGGER_EVENTNAME, {
      name,
      args: [],
      scope: 'apis',
      type: 'method',
      successHandler: (res = {}) => handle.success(res, { resolve, reject }),
      errorHandler: (res = {}) => handle.fail(res, { resolve, reject }),
    })
  })
}

export const vibrateShort: typeof Taro.vibrateShort = function () {
  const name = 'vibrateShort'
  const handle = new MethodHandler({ name })
  return new Promise((resolve, reject) => {
    eventCenter.trigger(ETS_METHODS_TRIGGER_EVENTNAME, {
      name,
      args: [],
      scope: 'apis',
      type: 'method',
      successHandler: (res = {}) => handle.success(res, { resolve, reject }),
      errorHandler: (res = {}) => handle.fail(res, { resolve, reject }),
    })
  })
}
