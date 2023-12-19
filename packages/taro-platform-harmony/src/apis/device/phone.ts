// 从 API Version 7 开始支持。
import call from '@ohos.telephony.call'
import { isString } from '@tarojs/shared'

import { getParameterError, object2String, shouldBeObject } from '../utils'
import { MethodHandler } from '../utils/handler'

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
    call.makeCall(phoneNumber, err => {
      if (err) {
        console.error('Failed to makePhoneCall. Cause: ' + JSON.stringify(err))
        return handle.fail({
          errMsg: object2String(err)
        }, { resolve, reject })
      } else {
        return handle.success({}, { resolve, reject })
      }
    })
  })
}
