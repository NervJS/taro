/* eslint camelcase: [1] */

import {
  ENV_TYPE,
  eventCenter,
  Events,
  getEnv,
  initPxTransform as originalInitPxTransform,
  internal_safe_get,
  internal_safe_set,
  render,
  interceptors
} from '@tarojs/taro'
import Nerv, {
  Children,
  createElement,
  cloneElement,
  nextTick,
  options,
  findDOMNode,
  isValidElement,
  unmountComponentAtNode,
  createPortal,
  unstable_renderSubtreeIntoContainer,
  hydrate,
  createFactory,
  unstable_batchedUpdates,
  version,
  PropTypes,
  createRef,
  forwardRef,
  memo,
  createContext,
  useEffect,
  useLayoutEffect,
  useReducer,
  useState,
  useRef,
  useCallback,
  useMemo,
  useImperativeHandle,
  useContext,
  getHooks,
  Current
} from 'nervjs'

import { permanentlyNotSupport } from '../api/utils'
import { onPageScroll } from '../api/privateApis/onPageScroll'
import { onReachBottom } from '../api/privateApis/onReachBottom'

const taro = {
  getEnv,
  ENV_TYPE,
  Events,
  eventCenter,
  render,
  internal_safe_set,
  internal_safe_get,
  Children,
  createElement,
  cloneElement,
  nextTick,
  options,
  findDOMNode,
  isValidElement,
  unmountComponentAtNode,
  createPortal,
  /* eslint-disable-next-line camelcase */
  unstable_renderSubtreeIntoContainer,
  hydrate,
  createFactory,
  /* eslint-disable-next-line camelcase */
  unstable_batchedUpdates,
  version,
  PropTypes,
  createRef,
  forwardRef,
  memo,
  createContext,
  useEffect,
  useLayoutEffect,
  useReducer,
  useState,
  useRef,
  useCallback,
  useMemo,
  useImperativeHandle,
  useContext
}

class Component extends Nerv.Component {
  get $router () {
    return getRouter()
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

  get $component () {
    return this
  }

  set $component (app) {
    console.warn('Property "$component" is read-only.')
  }
}

class PureComponent extends Nerv.PureComponent {
  get $router () {
    return getRouter()
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

  get $component () {
    return this
  }

  set $component (app) {
    console.warn('Property "$component" is read-only.')
  }
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

/**
 * getRouter
 *
 * @returns {RouterParams} router router参数
 */
const getRouter = function () {
  const { path, params } = taro._$router
  return {
    path,
    scene: 1000,
    params,
    shareTicket: '',
    referrerInfo: {}
  }
}
const pxTransform = function (size) {
  const { designWidth } = taro.config
  return (
    Math.ceil((((parseInt(size, 10) / 40) * 640) / designWidth) * 10000) /
      10000 +
    'rem'
  )
}
const canIUseWebp = function () {
  const canvas = document.createElement('canvas')
  return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0
}

function usePageLifecycle (callback, lifecycle) {
  const hook = getHooks(Current.index++)
  let originalLifecycle
  hook.component = Current.current
  if (!hook.marked) {
    hook.marked = true
    originalLifecycle = hook.component[lifecycle]
  }
  hook.component[lifecycle] = function () {
    originalLifecycle && originalLifecycle.call(hook.component, ...arguments)
    callback && callback.call(hook.component, ...arguments)
  }
}

function useSpecialPageLifecycle (callback, lifecycle, lifeFn) {
  const hook = getHooks(Current.index++)
  let originalLifecycle
  hook.component = Current.current
  if (!hook.marked) {
    hook.marked = true
    originalLifecycle = hook.component[lifecycle]
    const originalDidShow = hook.component['componentDidShow']
    const originalDidHide = hook.component['componentDidHide']
    hook.component['componentDidShow'] = function () {
      originalDidShow && originalDidShow.call(hook.component, ...arguments)
      hook.component._offFn = lifeFn({
        callback: function () {
          originalLifecycle && originalLifecycle.call(hook.component, ...arguments)
          callback && callback.call(hook.component, ...arguments)
        },
        ctx: hook.component
      })
    }
    hook.component['componentDidHide'] = function () {
      originalDidHide && originalDidHide.call(hook.component, ...arguments)
      hook.component._offFn && hook.component._offFn()
    }
  } else {
    hook.component._offFn && hook.component._offFn()
    hook.component._offFn = lifeFn({
      callback: function () {
        originalLifecycle && originalLifecycle.call(hook.component, ...arguments)
        callback && callback.call(hook.component, ...arguments)
      },
      ctx: hook.component
    })
  }
}

function useDidShow (callback) {
  usePageLifecycle(callback, 'componentDidShow')
}

function useDidHide (callback) {
  usePageLifecycle(callback, 'componentDidHide')
}

function usePullDownRefresh (callback) {
  usePageLifecycle(callback, 'onPullDownRefresh')
}

function useReachBottom (callback) {
  useSpecialPageLifecycle(callback, 'onReachBottom', onReachBottom)
}

function usePageScroll (callback) {
  useSpecialPageLifecycle(callback, 'onPageScroll', onPageScroll)
}

function useRouter () {
  const hook = getHooks(Current.index++)
  if (!hook.router) {
    hook.component = Current.current
    hook.router = hook.component.$router
  }
  return hook.router
}

taro.Component = Component
taro.PureComponent = PureComponent
taro.initPxTransform = initPxTransform
taro.requirePlugin = requirePlugin
taro.getApp = getApp
taro.pxTransform = pxTransform
taro.canIUseWebp = canIUseWebp
taro.interceptors = interceptors
taro.useDidShow = useDidShow
taro.useDidHide = useDidHide
taro.usePullDownRefresh = usePullDownRefresh
taro.useReachBottom = useReachBottom
taro.usePageScroll = usePageScroll
taro.useRouter = useRouter

export default taro

export {
  getEnv,
  ENV_TYPE,
  Events,
  eventCenter,
  render,
  internal_safe_set,
  internal_safe_get,
  Children,
  createElement,
  cloneElement,
  options,
  findDOMNode,
  isValidElement,
  unmountComponentAtNode,
  createPortal,
  /* eslint-disable-next-line camelcase */
  unstable_renderSubtreeIntoContainer,
  hydrate,
  createFactory,
  /* eslint-disable-next-line camelcase */
  unstable_batchedUpdates,
  version,
  PropTypes,
  createRef,
  forwardRef,
  memo,
  createContext,
  useEffect,
  useLayoutEffect,
  useReducer,
  useState,
  useRef,
  useCallback,
  useMemo,
  useImperativeHandle,
  useContext,
  useDidShow,
  useDidHide,
  usePullDownRefresh,
  useReachBottom,
  usePageScroll,
  useRouter,

  Component,
  PureComponent,
  initPxTransform,
  requirePlugin,
  getApp,
  pxTransform,
  canIUseWebp,
  interceptors
}
