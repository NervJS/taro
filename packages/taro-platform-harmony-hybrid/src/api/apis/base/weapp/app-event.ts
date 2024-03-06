import Taro from '@tarojs/api'
import { safeExecute } from '@tarojs/runtime'
import { parse } from 'query-string'

import { CallbackManager } from '../../utils/handler'

const appShowCallbackManager = new CallbackManager<[Taro.onAppShow.CallbackResult]>()
const appHideCallbackManager = new CallbackManager<[Taro.onAppShow.CallbackResult]>()

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
