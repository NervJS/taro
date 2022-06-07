import Taro from '@tarojs/api'
import { parse } from 'query-string'

import { temporarilyNotSupport } from '../../../utils'
import { CallbackManager } from '../../../utils/handler'

const appShowCallbackManager = new CallbackManager()
const appHideCallbackManager = new CallbackManager()

const getApp = () => {
  const path = Taro.Current.page?.path
  return {
    /** 小程序切前台的路径 */
    path: path?.substring(0, path.indexOf('?')),
    /** 小程序切前台的 query 参数 */
    query: parse(location.search),
    /** 来源信息。 */
    referrerInfo: {},
    /** 小程序切前台的[场景值](https://developers.weixin.qq.com/miniprogram/dev/framework/app-service/scene.html) */
    scene: 0,
    /** shareTicket，详见[获取更多转发信息](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/share.html) */
    shareTicket: ''
  }
}

const appShowListener = () => {
  if (document.visibilityState !== 'hidden') {
    appShowCallbackManager.trigger(getApp())
  }
}

const appHideListener = () => {
  if (document.visibilityState === 'hidden') {
    appHideCallbackManager.trigger(getApp())
  }
}

// 应用级事件
export const onUnhandledRejection = temporarilyNotSupport('onUnhandledRejection')
export const onThemeChange = temporarilyNotSupport('onThemeChange')
export const onPageNotFound = temporarilyNotSupport('onPageNotFound')
export const onError = temporarilyNotSupport('onError')
export const onAudioInterruptionEnd = temporarilyNotSupport('onAudioInterruptionEnd')
export const onAudioInterruptionBegin = temporarilyNotSupport('onAudioInterruptionBegin')

export const onAppShow: typeof Taro.onAppShow = callback => {
  appShowCallbackManager.add(callback)
  if (appShowCallbackManager.count() === 1) {
    window.addEventListener('visibilitychange', appShowListener)
  }
}

export const onAppHide: typeof Taro.onAppHide = callback => {
  appHideCallbackManager.add(callback)
  if (appHideCallbackManager.count() === 1) {
    window.addEventListener('visibilitychange', appHideListener)
  }
}

export const offUnhandledRejection = temporarilyNotSupport('offUnhandledRejection')
export const offThemeChange = temporarilyNotSupport('offThemeChange')
export const offPageNotFound = temporarilyNotSupport('offPageNotFound')
export const offError = temporarilyNotSupport('offError')
export const offAudioInterruptionEnd = temporarilyNotSupport('offAudioInterruptionEnd')
export const offAudioInterruptionBegin = temporarilyNotSupport('offAudioInterruptionBegin')

export const offAppShow: typeof Taro.offWindowResize = callback => {
  appShowCallbackManager.remove(callback)
  if (appShowCallbackManager.count() === 0) {
    window.removeEventListener('visibilitychange', appShowListener)
  }
}

export const offAppHide: typeof Taro.offWindowResize = callback => {
  appHideCallbackManager.remove(callback)
  if (appHideCallbackManager.count() === 0) {
    window.removeEventListener('visibilitychange', appHideListener)
  }
}
