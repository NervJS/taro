import { queryToJson } from '@tarojs/shared'

import { callAsyncSuccess } from '../utils'
import { IAsyncParams } from '../utils/types'

import type Taro from '@tarojs/taro'

const router = require('@system.router')

declare const getApp: any

type ReLaunch = typeof Taro.reLaunch
type SwitchTab = typeof Taro.switchTab
type NavigateTo = typeof Taro.navigateTo

const getRouterFunc = (method): NavigateTo => {
  const methodName = method === 'navigateTo' ? 'push' : 'replace'

  return function (options) {
    const [uri, queryString = ''] = options.url.split('?')
    const params = queryToJson(queryString)

    return new Promise(resolve => {
      router[methodName]({
        uri: uri.replace(/^\//, ''),
        params
      })
      const res = { errMsg: `${method}:ok` }
      callAsyncSuccess(resolve, res, options)
    })
  }
}

const navigateTo = getRouterFunc('navigateTo')
const redirectTo = getRouterFunc('redirectTo')

interface INavigateBackParams extends IAsyncParams {
  url?: string
}
function navigateBack (options: INavigateBackParams): Promise<TaroGeneral.CallbackResult> {
  return new Promise(resolve => {
    if (!options?.url) {
      router.back()
    } else {
      let [uri] = options.url.split('?')
      uri = uri.replace(/^\//, '')
      router.back({ uri })
    }

    const res = { errMsg: 'navigateBack:ok' }
    callAsyncSuccess(resolve, res, options)
  })
}

const switchTab: SwitchTab = (options) => {
  return new Promise(resolve => {
    const app = getApp()
    const pages = app.pageStack
    let [uri] = options.url.split('?')
    uri = uri.replace(/^\//, '')

    for (let i = 0; i < pages.length; i++) {
      const item = pages[i]
      if (item === uri) {
        return router.back({
          uri: item
        })
      }
    }
    navigateTo({ url: options.url })

    const res = { errMsg: 'switchTab:ok' }
    callAsyncSuccess(resolve, res, options)
  })
}

const reLaunch: ReLaunch = (options) => {
  return new Promise(resolve => {
    redirectTo({ url: options.url })
    router.clear()
    const res = { errMsg: 'reLaunch:ok' }
    callAsyncSuccess(resolve, res, options)
  })
}

const getLength = () => {
  return router.getLength()
}

const getState = () => {
  return router.getState()
}

export {
  getLength,
  getState,
  navigateBack,
  navigateTo,
  redirectTo,
  reLaunch,
  switchTab
}
