/**
 * router-rn 接口都改为require 引入， 单页不引用的router
 * 
 */
let routerObj: any = {}
try {
  routerObj = require('@tarojs/router-rn')
  // eslint-disable-next-line
} catch (e) {}

function getApi (key){
  if (!routerObj?.[key]) {
    return () => {
      console.error(`Single page can not support ${key}, if you have multiple pages configured, you can try restart and reset cache`)
    }
  }
  return routerObj?.[key]
}

export const rnNavigationRef = routerObj?.navigationRef  ?? null
export const PageProvider = routerObj?.PageProvider  ?? null

export const getRouteEventChannel =  getApi('getRouteEventChannel')
export const getCurrentRoute = getApi('getCurrentRoute')
export const isTabPage = getApi('isTabPage')

export const createRouter = getApi('createRouter')
export const getInitOptions =  getApi('getInitOptions')

export const hideNavigationBarLoading = getApi('hideNavigationBarLoading')
export const hideTabBar = getApi('hideTabBar')
export const hideTabBarRedDot = getApi('hideTabBarRedDot')
export const navigateBack = getApi('navigateBack')
export const navigateTo = getApi('navigateTo')
export const redirectTo = getApi('redirectTo') 
export const reLaunch = getApi('reLaunch')
export const switchTab = getApi('switchTab')
export const removeTabBarBadge = getApi('removeTabBarBadge') 
export const setNavigationBarColor = getApi('setNavigationBarColor')
export const setNavigationBarTitle = getApi('setNavigationBarTitle')
export const setTabBarBadge = getApi('setTabBarBadge')
export const setTabBarItem = getApi('setTabBarItem')
export const setTabBarStyle = getApi('setTabBarStyle')
export const showNavigationBarLoading = getApi('showNavigationBarLoading')
export const showTabBar = getApi('showTabBar')
export const showTabBarRedDot = getApi('showTabBarRedDot')





