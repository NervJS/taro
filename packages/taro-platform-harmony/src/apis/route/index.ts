import router from '@ohos.router'
import { eventCenter, window } from '@tarojs/runtime'
import { queryToJson } from '@tarojs/shared'

import { callAsyncFail, callAsyncSuccess } from '../utils'

import type Taro from '@tarojs/taro/types'

const TARO_TABBAR_PAGE_PATH = 'taro_tabbar'
function isTabPage (url: string): boolean {
  return window.__taroAppConfig.tabBar?.list?.some(item => item.pagePath === url)
}

function parseURL (raw = ''): [string, Record<string, unknown>] {
  const [urlStr, queryStr = ''] = raw.split('?')
  const query: Record<string, unknown> = queryToJson(queryStr)
  let url = urlStr.replace(/^\//, '')

  // 处理相对路径
  if (url.indexOf('.') === 0) {
    const page = router.getState()
    const parts = page.path.split('/')
    parts.pop()
    url.split('/').forEach((item) => {
      if (item === '.') {
        return
      }
      item === '..' ? parts.pop() : parts.push(item)
    })
    url = parts.join('/')
  }

  if (isTabPage(url)) {
    query.$page = url
    url = TARO_TABBAR_PAGE_PATH
  }
  return [url, query]
}

const getRouterFunc = (method): typeof Taro.navigateTo => {
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

export const navigateTo = getRouterFunc('navigateTo')
export const redirectTo = getRouterFunc('redirectTo')

export function navigateBack (options: Taro.navigateBack.Option & { url?: string }): Promise<any> {
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

export const reLaunch: typeof Taro.reLaunch = (options) => {
  return new Promise(resolve => {
    redirectTo({ url: options.url })
    router.clear()
    const res = { errMsg: 'reLaunch:ok' }
    callAsyncSuccess(resolve, res, options)
  })
}

export const switchTab: typeof Taro.switchTab = (options) => {
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

export const getLength = () => {
  return router.getLength()
}

export const getState = () => {
  return router.getState()
}
