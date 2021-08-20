/*!
* Licensed to the O2Team under one
* or more contributor license agreements.  See the NOTICE file
* distributed with this work for additional information
* regarding copyright ownership.  The ASF licenses this file
* to you under the Apache License, Version 2.0 (the
* "License"); you may not use this file except in compliance
* with the License.  You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied.  See the License for the
* specific language governing permissions and limitations
* under the License.
*/

import { successHandler, errorHandler, setTabConfig } from './utils/index'
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
  setTabConfig('tabBarVisible', true)
  setTabConfig('needAnimate', animation)
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
  setTabConfig('tabBarVisible', false)
  setTabConfig('needAnimate', animation)
  try {
    navigationRef.current?.setOptions({
      tabBarVisible: false
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
    // 会直接更新当前调用的tab,只是为了触发导航的tabbar的更新
    navigationRef.current?.setOptions({
      tabBarIcon: null
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
  setTabConfig('tabStyle', { backgroundColor, borderStyle, color, selectedColor })
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
