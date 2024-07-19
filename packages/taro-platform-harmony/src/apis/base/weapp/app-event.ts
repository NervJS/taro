import errorManager from '@ohos.app.ability.errorManager'

import { temporarilyNotSupport } from '../../utils'
import { CallbackManager } from '../../utils/handler'

import type Taro from '@tarojs/taro/types'

const unhandledRejectionCallbackManager = new CallbackManager<[Taro.onUnhandledRejection.Result]>()
const errorCallbackManager = new CallbackManager<Parameters<Taro.onError.Callback>>()

const unhandledRejectionListener = (res: PromiseRejectionEvent) => {
  unhandledRejectionCallbackManager.trigger(res)
}

const errorListener = (res: ErrorEvent) => {
  // @ts-ignore
  errorCallbackManager.trigger(res.stack || res.message || res)
}

// 应用级事件
export const onUnhandledRejection: typeof Taro.onUnhandledRejection = callback => {
  unhandledRejectionCallbackManager.add(callback)
  if (unhandledRejectionCallbackManager.count() === 1) {
    errorManager.on('error', {
      unhandledRejectionListener
    })
  }
}

export const onThemeChange = /* @__PURE__ */ temporarilyNotSupport('onThemeChange')
export const onPageNotFound = /* @__PURE__ */ temporarilyNotSupport('onPageNotFound')
export const onLazyLoadError = /* @__PURE__ */ temporarilyNotSupport('onLazyLoadError')

export const onError: typeof Taro.onError = callback => {
  errorCallbackManager.add(callback)
  if (errorCallbackManager.count() === 1) {
    errorManager.on('error', {
      onException: errorListener
    })
  }
}

export const onAudioInterruptionEnd = /* @__PURE__ */ temporarilyNotSupport('onAudioInterruptionEnd')
export const onAudioInterruptionBegin = /* @__PURE__ */ temporarilyNotSupport('onAudioInterruptionBegin')

export const onAppShow = /* @__PURE__ */ temporarilyNotSupport('onAppShow')
export const onAppHide = /* @__PURE__ */ temporarilyNotSupport('onAppHide')

export const offUnhandledRejection: typeof Taro.offUnhandledRejection = callback => {
  unhandledRejectionCallbackManager.remove(callback)
  if (unhandledRejectionCallbackManager.count() === 0) {
    errorManager.off('error', {
      unhandledRejectionListener
    })
  }
}

export const offThemeChange = /* @__PURE__ */ temporarilyNotSupport('offThemeChange')
export const offPageNotFound = /* @__PURE__ */ temporarilyNotSupport('offPageNotFound')
export const offLazyLoadError = /* @__PURE__ */ temporarilyNotSupport('offLazyLoadError')

export const offError: typeof Taro.offError = callback => {
  errorCallbackManager.remove(callback)
  if (errorCallbackManager.count() === 0) {
    errorManager.off('error', {
      onException: errorListener
    })
  }
}

export const offAudioInterruptionEnd = /* @__PURE__ */ temporarilyNotSupport('offAudioInterruptionEnd')
export const offAudioInterruptionBegin = /* @__PURE__ */ temporarilyNotSupport('offAudioInterruptionBegin')

export const offAppShow = /* @__PURE__ */ temporarilyNotSupport('offAppShow')
export const offAppHide = /* @__PURE__ */ temporarilyNotSupport('offAppHide')
