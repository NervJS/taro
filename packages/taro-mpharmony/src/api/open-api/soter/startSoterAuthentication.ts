import Taro from '@tarojs/api'

import { getParameterError, shouldBeObject } from '../../../utils'
import { MethodHandler } from '../../../utils/handler'

/**
 * 开始 SOTER 生物认证。
 * 
 * @canUse startSoterAuthentication
 * @__object [challenge, requestAuthModes, authContent]
 * @__success [authMode, errCode, resultJSON, resultJSONSignature]
 */
export const startSoterAuthentication: typeof Taro.startSoterAuthentication = (options) => {
  const name = 'startSoterAuthentication'

  // options must be an Object
  const isObject = shouldBeObject(options)
  if (!isObject.flag) {
    const res = { errMsg: `${name}:fail ${isObject.msg}` }
    console.error(res.errMsg)
    return Promise.reject(res)
  }

  const { challenge, requestAuthModes, authContent, success, fail, complete } = options
  const handle = new MethodHandler<{
    authMode?: string
    errCode?: number
    errMsg?: string
    resultJSON?: string
    resultJSONSignature?: string
  }>({ name, success, fail, complete })

  if (typeof challenge !== 'string') {
    return handle.fail({
      errMsg: getParameterError({
        para: 'challenge',
        correct: 'String',
        wrong: challenge,
      }),
    })
  }

  if (typeof requestAuthModes !== 'object') {
    return handle.fail({
      errMsg: getParameterError({
        para: 'requestAuthModes',
        correct: 'object',
        wrong: requestAuthModes,
      }),
    })
  }

  // @ts-ignore
  const ret = native.startSoterAuthentication({
    phoneNumber: challenge,
    requestAuthModes: requestAuthModes,
    authContent: authContent,
    success: (res: any) => {
      return handle.success(res)
    },
    fail: (err: any) => {
      return handle.fail(err)
    },
  })
  return ret
}
