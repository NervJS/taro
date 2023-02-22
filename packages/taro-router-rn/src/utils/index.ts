/* 
 *  MIT License
 *  
 *  Copyright (c) 2018 O2Team
 *  
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *  
 *  The above copyright notice and this permission notice shall be included in all
 *  copies or substantial portions of the Software.
 *  
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 */

import { camelCase } from 'lodash'
import { parseUrl } from 'query-string'

import { CallbackResult, OptionsFunc, TaroTabBarConfig } from './types'

const globalAny: any = global

export function isUrl (str: string): boolean {
  const protocolAndDomainRE = /^(?:\w+:)?\/\/(\S+)$/

  const localhostDomainRE = /^localhost[:?\d]*(?:[^:?\d]\S*)?$/
  const nonLocalhostDomainRE = /^[^\s.]+\.\S{2,}$/
  if (typeof str !== 'string') {
    return false
  }

  const match = str.match(protocolAndDomainRE)
  if (!match) {
    return false
  }

  const everythingAfterProtocol = match[1]
  if (!everythingAfterProtocol) {
    return false
  }

  if (localhostDomainRE.test(everythingAfterProtocol) ||
        nonLocalhostDomainRE.test(everythingAfterProtocol)) {
    return true
  }

  return false
}

export function isFunction (o: unknown): o is (...args: any[]) => any {
  return typeof o === 'function'
}

export function isEmptyObject (obj: any): boolean {
  if (obj == null) {
    return true
  }
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      return false
    }
  }
  return true
}

export function successHandler (success: OptionsFunc | undefined, complete: OptionsFunc | undefined): any {
  return function (res: CallbackResult) {
    success && isFunction(success) && success(res)
    complete && isFunction(complete) && complete(res)
    return Promise.resolve(res)
  }
}

export function errorHandler (fail: OptionsFunc | undefined, complete: OptionsFunc | undefined): any {
  return function (res: CallbackResult) {
    fail && isFunction(fail) && fail(res)
    complete && isFunction(complete) && complete(res)
    return Promise.reject(res)
  }
}

export function getTabItemConfig (index: number, key: string): any {
  const _taroTabBarIconConfig = globalAny.__taroTabBarIconConfig as TaroTabBarConfig
  const _taroTabItems = _taroTabBarIconConfig.tabItems
  return _taroTabItems[index] && _taroTabItems[index][key]
}

export function getTabConfig (key: string): any {
  const _taroTabBarIconConfig = globalAny.__taroTabBarIconConfig as TaroTabBarConfig
  return _taroTabBarIconConfig[key]
}

export function setTabConfig (key: string, value: unknown) {
  const tabBarConfig = globalAny.__taroTabBarIconConfig
  tabBarConfig[key] = value
  globalAny.__taroTabBarIconConfig = tabBarConfig
}

export function setTabInitRoute (routeName: string) {
  globalAny.__taroTabInitRoute = routeName
}

export function getTabInitRoute (): string {
  return globalAny.__taroTabInitRoute || ''
}

export function getTabVisible (): boolean {
  return getTabConfig('tabBarVisible')
}

export function getDefalutTabItem (index: number): Record<string, unknown> {
  const _taroAppConfig = globalAny.__taroAppConfig || {}
  const tabBar = _taroAppConfig?.appConfig?.tabBar || []
  return tabBar?.list[index] || {}
}

// camelCase之后的页面
export function getTabBarPages (): string[] {
  const tabBar = globalAny.__taroAppConfig?.appConfig?.tabBar || {}
  if (isEmptyObject(tabBar)) return []
  const pages: string[] = []
  tabBar?.list.forEach((item: { pagePath: string }) => {
    const path = item.pagePath.startsWith('/') ? item.pagePath : `/${item.pagePath}`
    pages.push(camelCase(path))
  })
  return pages
}

// 处理url转换成pageName与params
export function handleUrl (url: string): Record<string, any> {
  const path = url.split('?')[0]
  const pageName = camelCase(path.startsWith('/') ? path : `/${path}`)
  const params = parseUrl(url.startsWith('/') ? url.substr(1) : url).query || {}
  return {
    pageName,
    params
  }
}
