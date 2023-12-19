import { Current } from '@tarojs/runtime'

import { callAsyncSuccess } from '../utils'

import type Taro from '@tarojs/taro/types'

export const startPullDownRefresh: typeof Taro.startPullDownRefresh = function (options) {
  return new Promise(resolve => {
    const taro = (Current as any).taro
    const page = taro.getCurrentInstance().page

    if (page.isRefreshing instanceof Array) {
      const index = page.tabBarCurrentIndex || 0
      page.isRefreshing[index] = true
    } else {
      page.isRefreshing = true
    }

    const res = { errMsg: 'startPullDownRefresh:ok' }
    page.$set?.('isRefreshing', true)
    callAsyncSuccess(resolve, res, options)
  })
}

export const stopPullDownRefresh: typeof Taro.stopPullDownRefresh = function (options) {
  return new Promise(resolve => {
    const taro = (Current as any).taro
    const page = taro.getCurrentInstance().page

    if (page.isRefreshing instanceof Array) {
      const index = page.tabBarCurrentIndex || 0
      page.isRefreshing[index] = false
    } else {
      page.isRefreshing = false
    }

    const res = { errMsg: 'stopPullDownRefresh:ok' }
    page.$set?.('isRefreshing', false)
    callAsyncSuccess(resolve, res, options)
  })
}
