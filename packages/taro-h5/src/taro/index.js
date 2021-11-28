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
  preload
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
  switchTab
}

const initPxTransform = getInitPxTransform(taro)

const requirePlugin = permanentlyNotSupport('requirePlugin')
const getApp = function () {
  return getCurrentInstance().app
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
  switchTab
}
