import {
  ENV_TYPE,
  eventCenter,
  Events,
  getEnv,
  initPxTransform as originalInitPxTransform,
  /* eslint-disable-next-line camelcase */
  internal_safe_get,
  /* eslint-disable-next-line camelcase */
  internal_safe_set,
  render
} from '@tarojs/taro'
import Nerv from 'nervjs'

import { permanentlyNotSupport } from '../api/utils'

const taro = {
  getEnv,
  ENV_TYPE,
  Events,
  eventCenter,
  render,
  internal_safe_set,
  internal_safe_get
}

class Component extends Nerv.Component {
  get $router () {
    return taro.getRouter()
  }
  set $router (args) {
    console.warn('Property "$router" is read-only.')
  }

  get $app () {
    return taro.getApp()
  }

  set $app (app) {
    console.warn('Property "$app" is read-only.')
  }
}

class PureComponent extends Nerv.PureComponent {
  get $router () {
    return taro.getRouter()
  }
  set $router (args) {
    console.warn('Property "$router" is read-only.')
  }

  get $app () {
    return taro.getApp()
  }

  set $app (app) {
    console.warn('Property "$app" is read-only.')
  }
}

const initPxTransform = originalInitPxTransform.bind(taro)
const requirePlugin = permanentlyNotSupport('requirePlugin')
const _set$app = function (app) {
  taro._$app = app
}
const getApp = function () {
  return taro._$app
}
const _set$router = function (router) {
  taro._$router = router
}
const getRouter = function () {
  return taro._$router
}
const pxTransform = function (size) {
  const { designWidth } = taro.config
  return Math.ceil((parseInt(size, 10) / 40 * 640 / designWidth) * 10000) / 10000 + 'rem'
}
const canIUseWebp = function () {
  const canvas = document.createElement('canvas')
  return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0
}

taro.Component = Component
taro.PureComponent = PureComponent
taro.initPxTransform = initPxTransform
taro.requirePlugin = requirePlugin
taro._set$app = _set$app
taro.getApp = getApp
taro._set$router = _set$router
taro.getRouter = getRouter
taro.pxTransform = pxTransform
taro.canIUseWebp = canIUseWebp

export default taro

export {
  getEnv,
  ENV_TYPE,
  Events,
  eventCenter,
  render,
  /* eslint-disable-next-line camelcase */
  internal_safe_set,
  /* eslint-disable-next-line camelcase */
  internal_safe_get,
  Component,
  initPxTransform,
  requirePlugin,
  _set$app,
  getApp,
  getRouter,
  pxTransform,
  canIUseWebp
}
