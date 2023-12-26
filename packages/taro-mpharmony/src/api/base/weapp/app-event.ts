import Taro from '@tarojs/api'
import { safeExecute } from '@tarojs/runtime'
import { isNil } from 'lodash'
import { parse } from 'query-string'

import { CallbackManager } from '../../../utils/handler'

const unhandledRejectionCallbackManager = new CallbackManager<[Taro.onUnhandledRejection.Result]>()
const themeChangeCallbackManager = new CallbackManager<[Taro.onThemeChange.Result]>()
const pageNotFoundCallbackManager = new CallbackManager<[Taro.onPageNotFound.Result]>()
const errorCallbackManager = new CallbackManager<Parameters<Taro.onError.Callback>>()
const appShowCallbackManager = new CallbackManager<[Taro.onAppShow.CallbackResult]>()
const appHideCallbackManager = new CallbackManager<[Taro.onAppShow.CallbackResult]>()

const unhandledRejectionListener = (res: PromiseRejectionEvent) => {
  unhandledRejectionCallbackManager.trigger(res)
}

let themeMatchMedia: MediaQueryList | null = null
const themeChangeListener = (res: MediaQueryListEvent) => {
  themeChangeCallbackManager.trigger({
    theme: res.matches ? 'dark' : 'light',
  })
}

const pageNotFoundListener = (res: Taro.onPageNotFound.Result) => {
  pageNotFoundCallbackManager.trigger(res)
}

const errorListener = (res: ErrorEvent) => {
  // @ts-ignore
  errorCallbackManager.trigger(res.stack || res.message || res)
}

const getApp = () => {
  const path = Taro.Current.page?.path
  return {
    /** 小程序切前台的路径 */
    path: path?.substring(0, path.indexOf('?')) || '',
    /** 小程序切前台的 query 参数 */
    query: parse(location.search),
    /** 来源信息。 */
    referrerInfo: {},
    /** 小程序切前台的[场景值](https://developers.weixin.qq.com/miniprogram/dev/framework/app-service/scene.html) */
    scene: 0,
    /** shareTicket，详见[获取更多转发信息](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/share.html) */
    shareTicket: '',
  }
}

/**
 * 监听未处理的Promise拒绝事件
 * 
 * @canUse onUnhandledRejection
 * @__callback [reason, promise]
 */
export const onUnhandledRejection: typeof Taro.onUnhandledRejection = (callback) => {
  unhandledRejectionCallbackManager.add(callback)
  if (unhandledRejectionCallbackManager.count() === 1) {
    window.addEventListener('unhandledrejection', unhandledRejectionListener)
  }
}

/**
 * 监听系统主题改变事件
 * 
 * @canUse onThemeChange
 * @__callback [theme[light, dark]]
 */
export const onThemeChange: typeof Taro.onThemeChange = (callback) => {
  themeChangeCallbackManager.add(callback)
  if (themeChangeCallbackManager.count() === 1) {
    if (isNil(themeMatchMedia)) {
      themeMatchMedia = window.matchMedia('(prefers-color-scheme: light)')
    }
    themeMatchMedia.addEventListener('change', themeChangeListener)
  }
}

/**
 * 监听程序要打开的页面不存在事件
 * 
 * @canUse onPageNotFound
 * @__callback [isEntryPage, path, query]
 */
export const onPageNotFound: typeof Taro.onPageNotFound = (callback) => {
  pageNotFoundCallbackManager.add(callback)
  if (pageNotFoundCallbackManager.count() === 1) {
    Taro.eventCenter.on('__taroRouterNotFound', pageNotFoundListener)
  }
}

/**
 * 监听小程序错误事件
 * 
 * @canUse onError
 */
export const onError: typeof Taro.onError = (callback) => {
  errorCallbackManager.add(callback)
  if (errorCallbackManager.count() === 1) {
    window.addEventListener('error', errorListener)
  }
}

/**
 * 监听音频中断结束事件
 * 
 * @canNotUse onAudioInterruptionEnd
 */
export { onAudioInterruptionEnd } from '@tarojs/taro-h5'

/**
 * 监听音频因为受到系统占用而被中断开始事件
 * 
 * @canNotUse onAudioInterruptionBegin
 */
export { onAudioInterruptionBegin } from '@tarojs/taro-h5'


// app 以及 page onShow/onHide 生命周期回调处理
// ---------------------------------------------------
const appPageShowListener = () => {
  if (document.visibilityState !== 'hidden') {
    appShowCallbackManager.trigger(getApp())
    Taro.Current.page?.onShow?.()
  }
}

const appPageHideListener = () => {
  if (document.visibilityState === 'hidden') {
    if (Taro.Current.page?.path) {
      safeExecute(Taro.Current.page?.path, 'onHide')
    }
    appHideCallbackManager.trigger(getApp())
  }
}

window.addEventListener('visibilitychange', appPageShowListener)
window.addEventListener('visibilitychange', appPageHideListener)

appShowCallbackManager.add((opt: any) => {
  Taro.Current.app?.onShow?.(opt)
})

appHideCallbackManager.add(() => {
  Taro.Current.app?.onHide?.()
})

/**
 * 监听小程序切前台事件
 * 
 * @canUse onAppShow
 * @__callback [path, query, scene, shareTicket, referrerInfo]
 */
export const onAppShow: typeof Taro.onAppShow = (callback) => {
  appShowCallbackManager.insert(-1, callback)
}

/**
 * 监听小程序切后台事件
 * 
 * @canUse onAppHide
 */
export const onAppHide: typeof Taro.onAppHide = (callback) => {
  appHideCallbackManager.insert(-1, callback)
}

/**
 * 取消监听小程序切前台事件
 * 
 * @canUse offAppShow
 */
export const offAppShow: typeof Taro.offAppShow = (callback) => {
  appShowCallbackManager.removeEvery(callback)
}

/**
 * 取消监听小程序切后台事件
 * 
 * @canUse offAppHide
 */
export const offAppHide: typeof Taro.offAppHide = (callback) => {
  appHideCallbackManager.removeEvery(callback)
}


/**
 * 取消监听未处理的 Promise 拒绝事件
 * 
 * @canUse offUnhandledRejection
 */
export const offUnhandledRejection: typeof Taro.offUnhandledRejection = (callback) => {
  unhandledRejectionCallbackManager.remove(callback)
  if (unhandledRejectionCallbackManager.count() === 0) {
    window.removeEventListener('unhandledrejection', unhandledRejectionListener)
  }
}

/**
 * 取消监听系统主题改变事件
 * 
 * @canUse offThemeChange
 */
export const offThemeChange: typeof Taro.offThemeChange = (callback) => {
  themeChangeCallbackManager.remove(callback)
  if (themeChangeCallbackManager.count() === 0) {
    if (isNil(themeMatchMedia)) {
      themeMatchMedia = window.matchMedia('(prefers-color-scheme: light)')
    }
    themeMatchMedia.removeEventListener('change', themeChangeListener)
    themeMatchMedia = null
  }
}

/**
 * 取消监听小程序要打开的页面不存在事件
 * 
 * @canUse offPageNotFound
 */
export const offPageNotFound: typeof Taro.offPageNotFound = (callback) => {
  pageNotFoundCallbackManager.remove(callback)
  if (pageNotFoundCallbackManager.count() === 0) {
    Taro.eventCenter.off('__taroRouterNotFound', pageNotFoundListener)
  }
}

/**
 * 取消监听音频播放错误事件
 * 
 * @canUse offError
 */
export const offError: typeof Taro.offError = (callback) => {
  errorCallbackManager.remove(callback)
  if (errorCallbackManager.count() === 0) {
    window.removeEventListener('error', errorListener)
  }
}

/**
 * 取消监听音频中断结束事件
 * 
 * @canNotUse offAudioInterruptionEnd
 */
export { offAudioInterruptionEnd } from '@tarojs/taro-h5'

/**
 * 取消监听音频因为受到系统占用而被中断开始事件
 * 
 * @canNotUse offAudioInterruptionBegin
 */
export { offAudioInterruptionBegin } from '@tarojs/taro-h5'
