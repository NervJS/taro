// RootNavigation.js
import * as React from 'react'
import { camelCase } from 'lodash'
import { parseUrl } from 'query-string'
import { StackActions, NavigationContainerRef } from '@react-navigation/native'
import { getTabBarPages } from './utils/index'
import { CallbackResult, BaseOption } from './utils/types'
// import { getOpenerEventChannel } from './getOpenerEventChannel'

type NavigateMethod = 'navigateTo' | 'redirectTo' | 'navigateBack' | 'switchTab' | 'reLaunch'

interface NavigateOption extends BaseOption {
  url: string
}

interface NavigateBackOption extends BaseOption {
  delta?: number
}

interface NavigateRef extends NavigationContainerRef {
  setOptions: (obj: any) => void
}

export const isReadyRef = React.createRef()

export const navigationRef = React.createRef<NavigateRef>()

export function navigateTo (option: NavigateOption): Promise<CallbackResult> {
  return navigate(option, 'navigateTo')
}

export function redirectTo (option: NavigateOption): Promise<CallbackResult> {
  return navigate(option, 'redirectTo')
}

export function navigateBack (option: NavigateBackOption = {}): Promise<CallbackResult> {
  return navigate(option, 'navigateBack')
}

export function switchTab (option: NavigateOption): Promise<CallbackResult> {
  return navigate(option, 'switchTab')
}

export function reLaunch (option: NavigateOption): Promise<CallbackResult> {
  return navigate(option, 'reLaunch')
}

// 处理url转换成pageName与params
export function handleUrl (url: string): Record<string, unknown> {
  const path = url.split('?')[0]
  const pageName = camelCase(path.startsWith('/') ? path : `/${path}`)
  const params = parseUrl(url.startsWith('/') ? url.substr(1) : url).query || {}
  return {
    pageName,
    params
  }
}

export function navigate (option: NavigateOption | NavigateBackOption, method: NavigateMethod): Promise<CallbackResult> {
  const { success, complete, fail } = option
  let errMsg
  let routeParam
  const path = (option as NavigateOption).url
  if (path) {
    routeParam = handleUrl(path)
  }

  try {
    if (method === 'navigateTo') {
      navigationRef.current?.dispatch(StackActions.push(routeParam.pageName, routeParam.params))
    } else if (method === 'redirectTo') {
      navigationRef.current?.dispatch(StackActions.replace(routeParam.pageName, routeParam.params))
    } else if (method === 'switchTab') {
      navigationRef.current?.navigate(routeParam.pageName, routeParam.params)
    } else if (method === 'navigateBack') {
      const number = (option as NavigateBackOption).delta ? (option as NavigateBackOption).delta : 1
      const states = navigationRef.current?.getRootState()
      const index = number && ((states && states.index < number) ? states?.index : number)
      navigationRef.current?.dispatch(StackActions.pop(index))
    } else if (method === 'reLaunch') {
      if (isTabPage()) {
        isTabPage(path)
          ? navigationRef.current?.navigate(routeParam.pageName, routeParam.params)
          : navigationRef.current?.dispatch(StackActions.push(routeParam.pageName, routeParam.params))
      } else {
        navigationRef.current?.dispatch(StackActions.popToTop())
        navigationRef.current?.dispatch(StackActions.push(routeParam.pageName, routeParam.params))
      }
    }
  } catch (error) {
    errMsg = error
  }

  return new Promise((resolve, reject) => {
    if (errMsg) {
      fail && fail({ errMsg })
      complete && complete({ errMsg })
      reject(new Error(errMsg))
    } else {
      const msg: any = {
        errMsg: `${method}:ok`
      }
      // if (method === 'navigateTo') {
      //   msg.eventChannel = getOpenerEventChannel()
      // }
      success && success(msg)
      complete && complete(msg)
      resolve(msg)
    }
  })
}

export function isTabPage (path = ''): boolean {
  const tabPages = getTabBarPages()
  let pageName = ''
  if (path) {
    pageName = camelCase(path.startsWith('/') ? path : `/${path}`)
  } else {
    const route: Record<string, any> = navigationRef.current?.getCurrentRoute() || {}
    pageName = route?.name || ''
  }
  return tabPages.indexOf(pageName) !== -1
}
