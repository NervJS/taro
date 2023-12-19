// 从API Version 7 开始，该接口不再维护，推荐使用新接口'@ohos.brightness'
// 但是 新接口 @ohos.brightness 没有 getValue
import brightness from '@system.brightness'
import { isNumber } from '@tarojs/shared'

import { getParameterError, shouldBeObject, temporarilyNotSupport } from '../utils'
import { MethodHandler } from '../utils/handler'

import type Taro from '@tarojs/taro/types'

// 屏幕
export const setVisualEffectOnCapture = /* @__PURE__ */ temporarilyNotSupport('setVisualEffectOnCapture')

export const setScreenBrightness: typeof Taro.setScreenBrightness = function (options) {
  // options must be an Object
  const isObject = shouldBeObject(options)
  if (!isObject.flag) {
    const res = { errMsg: `setScreenBrightness:fail ${isObject.msg}` }
    console.error(res.errMsg)
    return Promise.reject(res)
  }

  const { value, success, fail, complete } = options
  const handle = new MethodHandler<{ code: unknown }>({ name: 'setScreenBrightness', success, fail, complete })

  if (!isNumber(value)) {
    return handle.fail({
      errMsg: getParameterError({
        para: 'value',
        correct: 'Number',
        wrong: value
      })
    })
  }

  return new Promise((resolve, reject) => {
    brightness.setValue({
      // FIXME 不生效
      value: value >= 0 && value <= 1 ? value * 255 : value,
      success: function () {
        return handle.success({}, { resolve, reject })
      },
      fail: function (data, code) {
        return handle.fail({
          errMsg: data || '',
          code
        }, { resolve, reject })
      }
    })
  })
}

export const setKeepScreenOn = /* @__PURE__ */ temporarilyNotSupport('setKeepScreenOn')
export const onUserCaptureScreen = /* @__PURE__ */ temporarilyNotSupport('onUserCaptureScreen')
export const offUserCaptureScreen = /* @__PURE__ */ temporarilyNotSupport('offUserCaptureScreen')

export const getScreenBrightness: typeof Taro.getScreenBrightness = function (options) {
  const { success, fail, complete } = options || {}
  const handle = new MethodHandler<Taro.getScreenBrightness.SuccessCallbackOption & { code: unknown }>({ name: 'getScreenBrightness', success, fail, complete })

  return new Promise((resolve, reject) => {
    brightness.getValue({
      success: function (data) {
        return handle.success({
          value: data.value
        }, { resolve, reject })
      },
      fail: function (data, code) {
        return handle.fail({
          errMsg: data || '',
          code
        }, { resolve, reject })
      }
    })
  })
}

export const onScreenRecordingStateChanged = /* @__PURE__ */ temporarilyNotSupport('onScreenRecordingStateChanged')
export const offScreenRecordingStateChanged = /* @__PURE__ */ temporarilyNotSupport('offScreenRecordingStateChanged')
export const getScreenRecordingState = /* @__PURE__ */ temporarilyNotSupport('getScreenRecordingState')
