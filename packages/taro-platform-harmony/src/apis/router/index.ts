import router from '@ohos.router'
import { eventCenter } from '@tarojs/runtime/dist/runtime.esm'
import { queryToJson } from '@tarojs/shared'

import { callAsyncFail, callAsyncSuccess } from '../utils'
import { IAsyncParams } from '../utils/types'

import type Taro from '@tarojs/taro'

declare const getApp: any

type ReLaunch = typeof Taro.reLaunch
type SwitchTab = typeof Taro.switchTab
type NavigateTo = typeof Taro.navigateTo

const launchOptions: Taro.getLaunchOptionsSync.LaunchOptions = {
  path: '',
  query: {},
  scene: 0,
  shareTicket: '',
  referrerInfo: {}
}

function initLaunchOptions (options = {}) {
  Object.assign(launchOptions, options)
}

eventCenter.once('__taroRouterLaunch', initLaunchOptions)

// 生命周期
const getLaunchOptionsSync = () => launchOptions
const getEnterOptionsSync = () => launchOptions

const getRouterFunc = (method): NavigateTo => {
  const methodName = method === 'navigateTo' ? 'pushUrl' : 'replaceUrl'

  return function (options) {
    const [uri, queryString = ''] = options.url.split('?')
    const params = queryToJson(queryString)

    return new Promise((resolve, reject) => {
      router[methodName]({
        url: uri.replace(/^\//, ''),
        params
      }, (error) => {
        const res: { code?: number, errMsg: string } = { errMsg: `${method}:ok` }
        if (error) {
          const { code, message } = error
          res.code = code
          res.errMsg = `${method}:failed, ${message}`
          callAsyncFail(reject, res, options)

          return
        }

        callAsyncSuccess(resolve, res, options)
      })
    })
  }
}

const navigateTo = getRouterFunc('navigateTo')
const redirectTo = getRouterFunc('redirectTo')

interface INavigateBackParams extends IAsyncParams {
  url?: string
}
function navigateBack (options: INavigateBackParams): Promise<any> {
  return new Promise(resolve => {
    if (!options?.url) {
      router.back()
    } else {
      let [url] = options.url.split('?')
      url = url.replace(/^\//, '')
      router.back({ url })
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
  getEnterOptionsSync,
  getLaunchOptionsSync,
  getLength,
  getState,
  navigateBack,
  navigateTo,
  redirectTo,
  reLaunch,
  switchTab
}
