/*
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

import Taro from '@tarojs/api'

import {
  history,
  navigateBack,
  navigateTo,
  createRouter,
  reLaunch,
  redirectTo,
  getCurrentPages,
  switchTab
} from '@tarojs/router'
import { permanentlyNotSupport } from '../api/utils'

const {
  Behavior,
  getEnv,
  ENV_TYPE,
  Link,
  interceptors,
  getInitPxTransform,
  Current,
  getCurrentInstance,
  options,
  nextTick,
  eventCenter,
  Events,
  preload,
  useDidShow,
  useDidHide,
  usePullDownRefresh,
  useReachBottom,
  usePageScroll,
  useResize,
  useShareAppMessage,
  useTabItemTap,
  useTitleClick,
  useOptionMenuClick,
  usePullIntercept,
  useShareTimeline,
  useAddToFavorites,
  useReady,
  useRouter
} = Taro

const taro = {
  Behavior,
  getEnv,
  ENV_TYPE,
  Link,
  interceptors,
  Current,
  getCurrentInstance,
  options,
  nextTick,
  eventCenter,
  Events,
  preload,
  history,
  navigateBack,
  navigateTo,
  createRouter,
  reLaunch,
  redirectTo,
  getCurrentPages,
  switchTab,
  useDidShow,
  useDidHide,
  usePullDownRefresh,
  useReachBottom,
  usePageScroll,
  useResize,
  useShareAppMessage,
  useTabItemTap,
  useTitleClick,
  useOptionMenuClick,
  usePullIntercept,
  useShareTimeline,
  useAddToFavorites,
  useReady,
  useRouter
}

const initPxTransform = getInitPxTransform(taro)

const requirePlugin = permanentlyNotSupport('requirePlugin')
const getApp = function () {
  return taro._$app
}

const pxTransform = function (size) {
  const { designWidth } = taro.config
  return Math.ceil((((parseInt(size, 10) / 40) * 640) / designWidth) * 10000) / 10000 + 'rem'
}
const canIUseWebp = function () {
  const canvas = document.createElement('canvas')
  return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0
}

taro.requirePlugin = requirePlugin
taro.getApp = getApp
taro.pxTransform = pxTransform
taro.initPxTransform = initPxTransform
taro.canIUseWebp = canIUseWebp

export default taro

export {
  Behavior,
  getEnv,
  ENV_TYPE,
  Link,
  interceptors,
  initPxTransform,
  Current,
  getCurrentInstance,
  options,
  nextTick,
  eventCenter,
  Events,
  preload,
  requirePlugin,
  getApp,
  pxTransform,
  canIUseWebp,
  history,
  navigateBack,
  navigateTo,
  createRouter,
  reLaunch,
  redirectTo,
  getCurrentPages,
  switchTab,
  useDidShow,
  useDidHide,
  usePullDownRefresh,
  useReachBottom,
  usePageScroll,
  useResize,
  useShareAppMessage,
  useTabItemTap,
  useTitleClick,
  useOptionMenuClick,
  usePullIntercept,
  useShareTimeline,
  useAddToFavorites,
  useReady,
  useRouter
}
