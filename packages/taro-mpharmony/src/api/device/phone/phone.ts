import Taro from '@tarojs/api'

import { getParameterError, shouldBeObject } from '../../../utils'
import { MethodHandler } from '../../../utils/handler'

/**
 * 拨打电话
 * 
 * @canUse makePhoneCall
 * @__object [phoneNumber]
 */
export const makePhoneCall: typeof Taro.makePhoneCall = (options) => {
  const name = 'makePhoneCall'

  // options must be an Object
  const isObject = shouldBeObject(options)
  if (!isObject.flag) {
    const res = { errMsg: `${name}:fail ${isObject.msg}` }
    console.error(res.errMsg)
    return Promise.reject(res)
  }

  const { phoneNumber, success, fail, complete } = options as Exclude<typeof options, undefined>

  const handle = new MethodHandler<{
    errMsg: string
  }>({ name, success, fail, complete })

  if (typeof phoneNumber !== 'string') {
    return handle.fail({
      errMsg: getParameterError({
        para: 'phoneNumber',
        correct: 'string',
        wrong: phoneNumber,
      }),
    })
  }

  return new Promise((resolve, reject) => {
    // @ts-ignore
    native.makePhoneCall({
      phoneNumber: phoneNumber,
      success: (res: any) => {
        handle.success(res, { resolve, reject })
      },
      fail: (err: any) => {
        handle.fail(err, { resolve, reject })
      },
    })
  })
}
