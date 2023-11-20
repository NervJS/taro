import Taro from '@tarojs/api'

import { getParameterError, shouldBeObject } from '../../../utils'
import { MethodHandler } from '../../../utils/handler'

/**
 * 获取设备内是否录入如指纹等生物信息的接口
 * 
 * @canUse checkIsSoterEnrolledInDevice
 * @__object [checkAuthMode]
 * @__success [isEnrolled, errMsg]
 */
export const checkIsSoterEnrolledInDevice: typeof Taro.checkIsSoterEnrolledInDevice = (options) => {
  const name = 'checkIsSoterEnrolledInDevice'

  return new Promise((resolve, reject) => {
    // options must be an Object
    const isObject = shouldBeObject(options)
    if (!isObject.flag) {
      const res = { errMsg: `${name}:fail ${isObject.msg}` }
      console.error(res.errMsg)
      return Promise.reject(res)
    }

    const { checkAuthMode, success, fail, complete } = options as Exclude<typeof options, undefined>
    const handle = new MethodHandler<{
      isEnrolled?: boolean
      errMsg?: string
    }>({ name, success, fail, complete })

    if (typeof checkAuthMode !== 'object') {
      return handle.fail(
        {
          errMsg: getParameterError({
            para: 'checkAuthMode',
            correct: 'object',
            wrong: checkAuthMode,
          }),
        },
        { resolve, reject }
      )
    }

    // @ts-ignore
    const ret = native.checkIsSoterEnrolledInDevice({
      success: (res: any) => {
        return handle.success(res)
      },
      fail: (err: any) => {
        return handle.fail(err)
      },
    })
    return ret
  })
}
