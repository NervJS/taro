// 从 API Version 7 开始支持。
import { isString } from '@tarojs/shared'

import { getParameterError, MethodHandler, object2String, shouldBeObject } from '../utils'

import type Taro from '@tarojs/taro/types'

export const makePhoneCall: typeof Taro.makePhoneCall = (options) => {
  // options must be an Object
  const isObject = shouldBeObject(options)
  if (!isObject.flag) {
    const res = { errMsg: `makePhoneCall:fail ${isObject.msg}` }
    console.error(res.errMsg)
    return Promise.reject(res)
  }

  const { phoneNumber, success, fail, complete } = options
  const handle = new MethodHandler({ name: 'makePhoneCall', success, fail, complete })

  if (!isString(phoneNumber)) {
    return handle.fail({
      errMsg: getParameterError({
        para: 'phoneNumber',
        correct: 'String',
        wrong: phoneNumber
      })
    })
  }

  return new Promise((resolve, reject) => {
    try {
      get('NativePackageManager').loadLibrary('@ohos.telephony.call', [['makeCall', phoneNumber]]).then(() => {
        return handle.success({}, { resolve, reject })
      })
    } catch (err) {
      console.error('Failed to makePhoneCall. Cause: ' + JSON.stringify(err))
      return handle.fail({
        errMsg: object2String(err)
      }, { resolve, reject })
    }
  })
}
