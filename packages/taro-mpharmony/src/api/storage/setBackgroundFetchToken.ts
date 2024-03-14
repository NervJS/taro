import Taro from '@tarojs/taro'
import { getParameterError, shouldBeObject } from 'src/utils'
import { MethodHandler } from 'src/utils/handler'

import native from '../NativeApi'

/**
 * 拉取 backgroundFetch 客户端缓存数据
 *
 * @canUse setBackgroundFetchToken
 * @null_implementation
 */
export const setBackgroundFetchToken: typeof Taro.setBackgroundFetchToken = function (options) {
  const name = 'setBackgroundFetchToken'

  // options must be an Object
  const isObject = shouldBeObject(options)
  if (!isObject.flag) {
    const res = { errMsg: `${name}:fail ${isObject.msg}` }
    console.error(res.errMsg)
    return
  }

  const { token, success, fail, complete } = options as Exclude<typeof options, undefined>
  const handle = new MethodHandler({ name, success, fail, complete })

  // token must be String
  if (typeof token !== 'string') {
    return handle.fail({
      errMsg: getParameterError({
        para: 'token',
        correct: 'string',
        wrong: token,
      }),
    })
  }

  return new Promise((resolve, reject) => {
    native.setStorage({
      key: 'setStorageSync',
      data: 'token',
      success: (res: any) => {
        handle.success({ errMsg: res.errMsg }, { resolve,reject })
      },
      fail: (err: any) => {
        handle.fail({ errMsg: err.errMsg }, { resolve,reject })
      }
    })
  })
}
