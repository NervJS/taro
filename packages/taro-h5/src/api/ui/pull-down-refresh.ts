import Taro from '@tarojs/api'

import { MethodHandler } from '../../utils/handler'
/**
 * 开始下拉刷新。调用后触发下拉刷新动画，效果与用户手动下拉刷新一致。
 */
export const startPullDownRefresh: typeof Taro.startPullDownRefresh = function ({ success, fail, complete } = {}) {
  const handle = new MethodHandler({ name: 'startPullDownRefresh', success, fail, complete })
  return new Promise((resolve, reject) => {
    Taro.eventCenter.trigger('__taroStartPullDownRefresh', {
      successHandler: (res = {}) => handle.success(res, { resolve, reject }),
      errorHandler: (res = {}) => handle.fail(res, { resolve, reject })
    })
  })
}

/**
 * 停止当前页面下拉刷新。
 */
export const stopPullDownRefresh: typeof Taro.stopPullDownRefresh = function ({ success, fail, complete } = {}) {
  const handle = new MethodHandler({ name: 'stopPullDownRefresh', success, fail, complete })
  return new Promise((resolve, reject) => {
    Taro.eventCenter.trigger('__taroStopPullDownRefresh', {
      successHandler: (res = {}) => handle.success(res, { resolve, reject }),
      errorHandler: (res = {}) => handle.fail(res, { resolve, reject })
    })
  })
}
