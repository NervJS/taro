import { successHandler, errorHandler } from './utils/index'
import { CallbackResult, TaroTabBarConfig, BaseOption } from './utils/types'
import { navigationRef } from './rootNavigation'

const globalAny: any = global
const INIT_TABBAR_ICON_CONFIG: TaroTabBarConfig = {
  needAnimate: true,
  tabBarVisible: true,
  tabStyle: {},
  tabItems: {}
}
globalAny.__taroTabBarIconConfig = INIT_TABBAR_ICON_CONFIG
interface TabBarBadge extends BaseOption {
  index: number,
  text?: number | string
}

interface TabBarRedDot extends BaseOption {
  index: number,
}

interface TabBarItem extends BaseOption {
  index: number,
  text?: string,
  iconPath?: string,
  selectedIconPath?: string,
}

interface TabBarOptions extends BaseOption {
  animation?: boolean
}

interface TabBarStyleOption extends BaseOption {
  backgroundColor?: string,
  borderStyle?: 'white' | 'black',
  color?: string,
  selectedColor?: string
}

function setTabBarItemConfig (index, obj) {
  const tabBarConfig = globalAny.__taroTabBarIconConfig
  const items = tabBarConfig.tabItems[index] || {}
  tabBarConfig.tabItems[index] = Object.assign({}, items, obj)
  globalAny.__taroTabBarIconConfig = tabBarConfig
}

export function showTabBar (options: TabBarOptions = {}): Promise<CallbackResult> {
  const { fail, success, complete, animation = true } = options
  let msg
  const tabBarConfig = globalAny.__taroTabBarIconConfig
  tabBarConfig.tabBarVisible = true
  tabBarConfig.needAnimate = animation
  globalAny.__taroTabBarIconConfig = tabBarConfig
  try {
    navigationRef.current?.setOptions({
      tabBarVisible: true
    })
  } catch (error) {
    msg = error
    return errorHandler(fail, complete)({ errMsg: msg })
  }
  msg = 'showTabBar:ok'
  return successHandler(success, complete)({ errMsg: msg })
}

export function hideTabBar (options: TabBarOptions = {}): Promise<CallbackResult> {
  const { fail, success, complete, animation = true } = options
  let msg
  const tabBarConfig = globalAny.__taroTabBarIconConfig
  tabBarConfig.tabBarVisible = false
  tabBarConfig.needAnimate = animation
  globalAny.__taroTabBarIconConfig = tabBarConfig
  try {
    navigationRef.current?.setOptions({
      tabBarVisible: true
    })
  } catch (error) {
    msg = error
    return errorHandler(fail, complete)({ errMsg: msg })
  }
  msg = 'hideTabBar:ok'
  return successHandler(success, complete)({ errMsg: msg })
}

export function showTabBarRedDot (options: TabBarRedDot): Promise<CallbackResult> {
  const { index, fail, success, complete } = options
  let msg
  setTabBarItemConfig(index, { showRedDot: true })
  try {
    navigationRef.current?.setOptions({
      tabBarIcon: null
    })
  } catch (error) {
    msg = error
    return errorHandler(fail, complete)({ errMsg: msg })
  }
  msg = 'showTabBarRedDot:ok'
  return successHandler(success, complete)({ errMsg: msg })
}

export function hideTabBarRedDot (options: TabBarRedDot): Promise<CallbackResult> {
  const { index, fail, success, complete } = options
  let msg
  setTabBarItemConfig(index, { showRedDot: false })
  try {
    navigationRef.current?.setOptions({
      tabBarIcon: null
    })
  } catch (error) {
    msg = error
    return errorHandler(fail, complete)({ errMsg: msg })
  }
  msg = 'hideTabBarRedDot:ok'
  return successHandler(success, complete)({ errMsg: msg })
}

export function setTabBarBadge (options: TabBarBadge): Promise<CallbackResult> {
  const { index, text, complete, fail, success } = options
  let msg
  setTabBarItemConfig(index, { tabBarBadge: text })
  try {
    navigationRef.current?.setOptions({
      tabBarBadge: text
    })
  } catch (error) {
    msg = error
    return errorHandler(fail, complete)({ errMsg: msg })
  }
  msg = 'setTabBarBadge:ok'
  return successHandler(success, complete)({ errMsg: msg })
}

export function removeTabBarBadge (options: TabBarBadge): Promise<CallbackResult> {
  const { index, fail, success, complete } = options
  let msg = ''
  setTabBarItemConfig(index, { tabBarBadge: null })
  try {
    navigationRef.current?.setOptions({
      tabBarBadge: null
    })
  } catch (error) {
    msg = error
    return errorHandler(fail, complete)({ errMsg: msg })
  }
  msg = 'removeTabBarBadge:ok'
  return successHandler(success, complete)({ errMsg: msg })
}

export function setTabBarItem (options: TabBarItem): Promise<CallbackResult> {
  const { fail, complete, success, index, text, iconPath, selectedIconPath } = options
  let msg
  setTabBarItemConfig(index, {
    tabBarLabel: text,
    iconPath: iconPath,
    selectedIconPath: selectedIconPath
  })
  try {
    navigationRef.current?.setOptions({
      tabBarLabel: text
    })
  } catch (error) {
    msg = error
    return errorHandler(fail, complete)({ errMsg: msg })
  }
  msg = 'setTabBarItem:ok'
  return successHandler(success, complete)({ errMsg: msg })
}

export function setTabBarStyle (option: TabBarStyleOption): Promise<CallbackResult> {
  const { backgroundColor, borderStyle, color, selectedColor, fail, success, complete } = option
  let msg
  const tabBarConfig = globalAny.__taroTabBarIconConfig
  tabBarConfig.tabStyle = { backgroundColor, borderStyle, color, selectedColor }
  globalAny.__taroTabBarIconConfig = tabBarConfig
  try {
    // 设置tabBarIcon 只是为了触发导航的tabbar的更新
    navigationRef.current?.setOptions({
      tabBarIcon: null
    })
  } catch (error) {
    msg = error
    return errorHandler(fail, complete)({ errMsg: msg })
  }
  msg = 'setTabBarStyle:ok'
  return successHandler(success, complete)({ errMsg: msg })
}
