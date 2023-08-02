import { Current } from '@tarojs/runtime'

import { callAsyncSuccess, unsupport } from '../utils'

import type Taro from '@tarojs/taro'

type SetNavigationBarTitle = typeof Taro.setNavigationBarTitle
type SetNavigationBarColor = typeof Taro.setNavigationBarColor

export const setNavigationBarTitle: SetNavigationBarTitle = function (options) {
  return new Promise(resolve => {
    const taro = (Current as any).taro
    const page = taro.getCurrentInstance().page
    const res = { errMsg: 'setNavigationBarTitle:ok' }

    page.$set('taroNavBar.title', options.title)
    callAsyncSuccess(resolve, res, options)
  })
}

export const setNavigationBarColor: SetNavigationBarColor = function (options) {
  return new Promise(resolve => {
    const taro = (Current as any).taro
    const page = taro.getCurrentInstance().page
    const { frontColor, backgroundColor } = options
    const res = { errMsg: 'setNavigationBarColor:ok' }

    page.$set('taroNavBar.textStyle', frontColor)
    page.$set('taroNavBar.background', backgroundColor)
    callAsyncSuccess(resolve, res, options)
  })
}

export function showNavigationBarLoading () {
  process.env.NODE_ENV !== 'production' && unsupport('showNavigationBarLoading')
}

export function hideNavigationBarLoading () {
  process.env.NODE_ENV !== 'production' && unsupport('hideNavigationBarLoading')
}

export function hideHomeButton () {
  process.env.NODE_ENV !== 'production' && unsupport('hideHomeButton')
}
