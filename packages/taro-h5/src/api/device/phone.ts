import Taro from '@tarojs/api'
import { shouldBeObject, getParameterError } from '../utils'
import { MethodHandler } from '../utils/handler'

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

  if (typeof phoneNumber !== 'string') {
    return handle.fail({
      errMsg: getParameterError({
        para: 'phoneNumber',
        correct: 'String',
        wrong: phoneNumber
      })
    })
  }

  window.location.href = `tel:${phoneNumber}`

  return handle.success()
}
