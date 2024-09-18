import Taro from '@tarojs/api'

import native from '../../NativeApi'
import { shouldBeObject } from '../../utils'
import { MethodHandler } from '../../utils/handler'

/**
 * 获取本机支持的 SOTER 生物认证方式
 *
 * @canUse checkIsSupportSoterAuthentication
 * @__success [supportMode]
 */
export const checkIsSupportSoterAuthentication: typeof Taro.checkIsSupportSoterAuthentication = (options) => {
  const name = 'checkIsSupportSoterAuthentication'

  // options must be an Object
  const isObject = shouldBeObject(options)
  if (!isObject.flag) {
    const res = { errMsg: `${name}:fail ${isObject.msg}` }
    console.error(res.errMsg)
    return Promise.reject(res)
  }

  const { success, fail, complete } = options as Exclude<typeof options, undefined>
  const handle = new MethodHandler<{
    supportMode?: object
    errMsg?: string
  }>({ name, success, fail, complete })

  return new Promise<Taro.checkIsSupportSoterAuthentication.SuccessCallbackResult>((resolve, reject) => {
    native.checkIsSupportSoterAuthentication({
      success: (res: any) => {
        handle.success(res, { resolve, reject })
      },
      fail: (err: any) => {
        handle.fail(err, { resolve, reject })
      },
    })
  })
}
