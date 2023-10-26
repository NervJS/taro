// @ts-nocheck

import router from '@ohos.router'
// eslint-disable-next-line import/no-duplicates
import { window } from '@tarojs/runtime'
// eslint-disable-next-line import/no-duplicates
import { eventCenter } from '@tarojs/runtime/dist/runtime.esm'
import { queryToJson } from '@tarojs/shared'

import { callAsyncFail, callAsyncSuccess } from '../utils'
import { IAsyncParams } from '../utils/types'

import type Taro from '@tarojs/taro'

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

const TARO_TABBAR_PAGE_PATH = 'taro_tabbar'
function isTabPage (url: string): boolean {
  return window.__taroAppConfig.tabBar?.list?.some(item => item.pagePath === url)
}

function parseURL (raw = ''): [string, Record<string, unknown>] {
  const [urlStr, queryStr = ''] = raw.split('?')
  const query: Record<string, unknown> = queryToJson(queryStr)
  let url = urlStr.replace(/^\//, '')
  if (isTabPage(url)) {
    query.$page = url
    url = TARO_TABBAR_PAGE_PATH
  }
  return [url, query]
}

// 生命周期
const getLaunchOptionsSync = () => launchOptions
const getEnterOptionsSync = () => launchOptions

const getRouterFunc = (method): NavigateTo => {
  const methodName = method === 'navigateTo' ? 'pushUrl' : 'replaceUrl'

  return function (options) {
    const [url, params = {}] = parseURL(options.url)

    return new Promise((resolve, reject) => {
      router[methodName]({
        url,
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
      const [url] = parseURL(options.url)
      router.back({ url })
    }

    const res = { errMsg: 'navigateBack:ok' }
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

const switchTab: SwitchTab = (options) => {
  return new Promise((resolve, reject) => {
    const stack = AppStorage.prop('__TARO_PAGE_STACK').get()
    const [url, params] = parseURL(options.url)

    if (url !== TARO_TABBAR_PAGE_PATH) {
      const res = { errMsg: 'switchTab:failed' }
      callAsyncFail(reject, res, options)
      return
    }

    if (stack[stack.length - 1]?.path === url) {
      // Note: 当前为 Tab 页时，触发 switch 事件
      eventCenter.trigger('__taroSwitchTab', { url, params })
      router.getLength() > 1 && router.clear()
    } else if (stack.some(item => item.path === url)) {
      // Note: 寻找路由栈中的 Tab 页，如果找到，则使用 navigateBack
      router.back({ url, params })
      router.getLength() > 1 && router.clear()
    } else {
      // Note: 未找到页面时，使用 reLaunch
      reLaunch({ url: options.url })
    }

    const res = { errMsg: 'switchTab:ok' }
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
