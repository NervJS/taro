// RootNavigation.js
import { NavigationContainerRef, StackActions } from '@react-navigation/native'
import { camelCase } from 'lodash'
import * as React from 'react'

import { getTabBarPages, handleUrl, setTabInitRoute, updateCurrentJumpUrl, updateJumpAnimate } from './utils/index'
import { BaseOption, CallbackResult } from './utils/types'


type NavigateMethod = 'navigateTo' | 'redirectTo' | 'navigateBack' | 'switchTab' | 'reLaunch'

interface NavigateOption extends BaseOption {
  url: string
  events?: Record<string, any>
}

interface NavigateBackOption extends BaseOption {
  delta?: number
}

interface NavigateRef extends NavigationContainerRef<ReactNavigation.RootParamList> {
  setOptions: (obj: any) => void
  navigateConfig: (obj: any) => void
}

let routeEvtChannel

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

export function navigate (option: NavigateOption | NavigateBackOption, method: NavigateMethod): Promise<CallbackResult> {
  const { success, complete, fail } = option
  let errMsg
  let routeParam
  const path = (option as NavigateOption).url
  if (path) {
    routeParam = handleUrl(path)
    updateCurrentJumpUrl(path)
  }
  updateJumpAnimate(true)
  try {
    if (method === 'navigateTo') {
      navigationRef.current?.dispatch(StackActions.push(routeParam.pageName, routeParam.params))
    } else if (method === 'redirectTo') {
      updateJumpAnimate(false)
      navigationRef.current?.dispatch(StackActions.replace(routeParam.pageName, routeParam.params))
    } else if (method === 'switchTab' || (method === 'reLaunch' && isTabPage(path))) {
      const states = navigationRef.current?.getRootState()
      if (states?.routes[0].name !== 'tabNav') {
        states && states?.routes.length > 1 && navigationRef.current?.dispatch(StackActions.popToTop())
        navigationRef.current?.dispatch(StackActions.replace('tabNav'))
        setTabInitRoute(routeParam.pageName)
      } else {
        navigationRef.current?.navigate(routeParam.pageName as never, routeParam.params as never)
      }
    } else if (method === 'navigateBack') {
      const number = (option as NavigateBackOption).delta ? (option as NavigateBackOption).delta : 1
      const states = navigationRef.current?.getRootState()
      if (states?.index === 0) {
        errMsg = 'navigateBack:fail cannot navigate back at first page.'
      } else {
        const index = number && ((states && states.index < number) ? states?.index : number)
        navigationRef.current?.dispatch(StackActions.pop(index))
      }
    } else if (method === 'reLaunch') {
      if (isTabPage()) {
        // tabbar to stack page
        navigationRef.current?.dispatch(StackActions.replace(routeParam.pageName, routeParam.params))
      } else {
        // stack to stack page
        const states = navigationRef.current?.getRootState()
        if (states?.index !== 0) {
          navigationRef.current?.dispatch(StackActions.popToTop())
        }
        navigationRef.current?.dispatch(StackActions.replace(routeParam.pageName, routeParam.params))
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
      if (method === 'navigateTo') {
        routeEvtChannel.addEvents((option as NavigateOption).events)
        msg.eventChannel = routeEvtChannel
      }
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
    pageName = camelCase((path.startsWith('/') ? path : `/${path}`).split('?')[0])
  } else {
    const route: Record<string, any> = navigationRef.current?.getCurrentRoute() || {}
    pageName = route?.name || ''
  }
  return tabPages.indexOf(pageName) !== -1
}

export function getCurrentRoute () {
  const routeState = navigationRef.current?.getRootState()
  const routes = routeState?.routes
  const routeKeys: string[] = []
  if (routes) {
    routes.forEach(item => {
      if (item.name === 'tabNav') {
        const index = item.state?.index ?? 0
        const tabRoutes: Record<string, any>[] = item.state?.routes ?? []
        tabRoutes?.[index] && routeKeys.push(tabRoutes[index].key)
      } else {
        routeKeys.push(item.key)
      }
    })
  }
  return routeKeys
}

export const getRouteEventChannel = (routeChannel) => {
  routeEvtChannel = routeChannel
}