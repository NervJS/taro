import { eventCenter } from '@tarojs/runtime'

import { ETS_METHODS_TRIGGER_EVENTNAME, MethodHandler } from '../utils'

import type Taro from '@tarojs/taro/types'

/**
 * 设置系统剪贴板的内容
 */
export const setClipboardData: typeof Taro.setClipboardData = function (options: any = {}) {
  const name = 'setClipboardData'
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

/**
 * 获取系统剪贴板的内容
 */
export const getClipboardData: typeof Taro.getClipboardData = function (options: any = {}) {
  const name = 'getClipboardData'
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
