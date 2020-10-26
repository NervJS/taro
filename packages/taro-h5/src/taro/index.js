import Taro from '@tarojs/api'
import { history, navigateBack, navigateTo, createRouter, reLaunch, redirectTo, getCurrentPages, switchTab } from '@tarojs/router'
import { permanentlyNotSupport } from '../api/utils'

const {
  ENV_TYPE,
  eventCenter,
  Events,
  getEnv,
  initPxTransform: originalInitPxTransform,
  render,
  interceptors,
  Current,
  ...rest
} = Taro

const taro = {
  ...rest,
  getEnv,
  ENV_TYPE,
  Events,
  eventCenter,
  Current,
  render,
  history,
  navigateBack,
  navigateTo,
  createRouter,
  reLaunch,
  redirectTo,
  getCurrentPages,
  switchTab
}

const initPxTransform = originalInitPxTransform.bind(taro)
const requirePlugin = permanentlyNotSupport('requirePlugin')
const getApp = function () {
  return taro._$app
}

/**
 * RouterParams
 *
 * @typedef {Object} RouterParams
 * @property {string} path 小程序切前台的路径
 * @property {number} scene 小程序切前台的场景值
 * @property {Object} query 小程序切前台的 query 参数
 * @property {string} shareTicket shareTicket，详见获取更多转发信息
 * @property {Object} referrerInfo 来源信息。从另一个小程序、公众号或 App 进入小程序时返回。否则返回 {}。(参见后文注意)
 */

const pxTransform = function (size, designWidth) {
  if (designWidth == null) {
    throw new Error('pxTransform 函数在 H5 中运行需要把配置中的 `designWidth` 作为第二个参数传入')
  }
  return Math.ceil((((parseInt(size, 10) / 40) * 640) / designWidth) * 10000) / 10000 + 'rem'
}
const canIUseWebp = function () {
  const canvas = document.createElement('canvas')
  return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0
}

taro.initPxTransform = initPxTransform
taro.requirePlugin = requirePlugin
taro.getApp = getApp
taro.pxTransform = pxTransform
taro.canIUseWebp = canIUseWebp
taro.interceptors = interceptors

export default taro

export {
  getEnv,
  ENV_TYPE,
  Events,
  eventCenter,
  render,
  initPxTransform,
  requirePlugin,
  getApp,
  pxTransform,
  canIUseWebp,
  interceptors,
  history,
  navigateBack,
  navigateTo,
  createRouter,
  reLaunch,
  redirectTo,
  getCurrentPages,
  switchTab
}
