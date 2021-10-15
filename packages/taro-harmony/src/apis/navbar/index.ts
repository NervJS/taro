import { unsupport, current, callAsyncSuccess } from '../utils'

import type Taro from '@tarojs/taro'

type setNavigationBarTitle = typeof Taro.setNavigationBarTitle
type setNavigationBarColor = typeof Taro.setNavigationBarColor

export const setNavigationBarTitle: setNavigationBarTitle = function (options) {
  return new Promise(resolve => {
    const taro = current.taro
    const page = taro.getCurrentInstance().page
    const res = { errMsg: 'setNavigationBarTitle:ok' }

    page.$set('taroNavBar.title', options.title)
    callAsyncSuccess(options, resolve, res)
  })
}

export const setNavigationBarColor: setNavigationBarColor = function (options) {
  return new Promise(resolve => {
    const taro = current.taro
    const page = taro.getCurrentInstance().page
    const { frontColor, backgroundColor } = options
    const res = { errMsg: 'setNavigationBarColor:ok' }

    page.$set('taroNavBar.textStyle', frontColor)
    page.$set('taroNavBar.background', backgroundColor)
    callAsyncSuccess(options, resolve, res)
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
