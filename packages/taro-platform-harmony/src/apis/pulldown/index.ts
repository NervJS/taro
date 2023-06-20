import { callAsyncSuccess, current } from '../utils'

import type Taro from '@tarojs/taro'

type StartPullDownRefresh = typeof Taro.startPullDownRefresh
type StopPullDownRefresh = typeof Taro.stopPullDownRefresh

export const startPullDownRefresh: StartPullDownRefresh = function (options) {
  return new Promise(resolve => {
    const taro = current.taro
    const page = taro.getCurrentInstance().page
    const res = { errMsg: 'startPullDownRefresh:ok' }

    page.$set('isRefreshing', true)
    callAsyncSuccess(resolve, res, options)
  })
}

export const stopPullDownRefresh: StopPullDownRefresh = function (options) {
  return new Promise(resolve => {
    const taro = current.taro
    const page = taro.getCurrentInstance().page
    const res = { errMsg: 'stopPullDownRefresh:ok' }

    page.$set('isRefreshing', false)
    callAsyncSuccess(resolve, res, options)
  })
}
