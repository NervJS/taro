import { Current } from '@tarojs/runtime'

import { callAsyncSuccess, temporarilyNotSupport } from '../../utils'

import type Taro from '@tarojs/taro/types'

export const setNavigationBarTitle: typeof Taro.setNavigationBarTitle = function (options) {
  return new Promise(resolve => {
    const taro = (Current as any).taro
    const page = taro.getCurrentInstance().page
    const res = { errMsg: 'setNavigationBarTitle:ok' }

    page.$set?.('taroNavBar.title', options.title)
    callAsyncSuccess(resolve, res, options)
  })
}

export const setNavigationBarColor: typeof Taro.setNavigationBarColor = function (options) {
  return new Promise(resolve => {
    const taro = (Current as any).taro
    const page = taro.getCurrentInstance().page
    const { frontColor, backgroundColor } = options
    const res = { errMsg: 'setNavigationBarColor:ok' }

    page.$set?.('taroNavBar.textStyle', frontColor)
    page.$set?.('taroNavBar.background', backgroundColor)
    callAsyncSuccess(resolve, res, options)
  })
}

export const showNavigationBarLoading = temporarilyNotSupport('showNavigationBarLoading')
export const hideNavigationBarLoading = temporarilyNotSupport('hideNavigationBarLoading')
export const hideHomeButton = temporarilyNotSupport('hideHomeButton')
