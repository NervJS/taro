import Taro from '@tarojs/api'
import { history } from '@tarojs/router'

import { getApp, getCurrentInstance, getCurrentPages, navigateBack, navigateTo, nextTick, redirectTo, reLaunch, switchTab } from '../api'
import { permanentlyNotSupport } from '../utils'

const {
  Behavior,
  getEnv,
  ENV_TYPE,
  Link,
  interceptors,
  getInitPxTransform,
  Current,
  options,
  eventCenter,
  Events,
  preload
} = Taro as any

const taro: typeof Taro = {
  // @ts-ignore
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
  reLaunch,
  redirectTo,
  getCurrentPages,
  switchTab
}

const initPxTransform = getInitPxTransform(taro)

const requirePlugin = permanentlyNotSupport('requirePlugin')

const pxTransform = function (size) {
  // @ts-ignore
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
// @ts-ignore
taro.canIUseWebp = canIUseWebp

export default taro

export {
  Behavior,
  canIUseWebp,
  Current,
  ENV_TYPE,
  eventCenter,
  Events,
  getEnv,
  history,
  initPxTransform,
  interceptors,
  Link,
  options,
  preload,
  pxTransform,
  requirePlugin
}
