import { camelCase } from 'lodash'
import { TaroTabBarConfig, CallbackResult, OptionsFunc } from './types'

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

export function isFunction (obj: unknown): boolean {
  return typeof obj === 'function'
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
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
