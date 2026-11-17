import Taro from '@tarojs/api'

import { getParameterError, shouldBeObject } from '../../utils'
import { MethodHandler } from '../../utils/handler'

/** 单次最多可生成的随机数字节数 */
const MAX_LENGTH = 1048576
/** Note: crypto.getRandomValues 单次最多只能填充 65536 字节，超出会抛出 QuotaExceededError */
const MAX_CHUNK_LENGTH = 65536

// 加密
/**
 * 获取密码学安全随机数
 */
export const getRandomValues: typeof Taro.getRandomValues = (options) => {
  const name = 'getRandomValues'
  // options must be an Object
  const isObject = shouldBeObject(options)
  if (!isObject.flag) {
    const res = { errMsg: `${name}:fail ${isObject.msg}` }
    console.error(res.errMsg)
    return Promise.reject(res)
  }

  const { length, success, fail, complete } = options
  const handle = new MethodHandler<Taro.UserCryptoManager.getRandomValues.SuccessCallbackResult>({ name, success, fail, complete })

  if (typeof length !== 'number') {
    return handle.fail({
      errMsg: getParameterError({
        para: 'length',
        correct: 'Number',
        wrong: length
      })
    })
  }

  if (!Number.isInteger(length) || length <= 0 || length > MAX_LENGTH) {
    return handle.fail({ errMsg: `parameter error: parameter.length should be an integer between 1 and ${MAX_LENGTH}` })
  }

  if (typeof window.crypto?.getRandomValues !== 'function') {
    return handle.fail({ errMsg: 'crypto.getRandomValues is not supported' })
  }

  try {
    const randomValues = new ArrayBuffer(length)
    for (let offset = 0; offset < length; offset += MAX_CHUNK_LENGTH) {
      window.crypto.getRandomValues(new Uint8Array(randomValues, offset, Math.min(MAX_CHUNK_LENGTH, length - offset)))
    }
    return handle.success({ randomValues })
  } catch (e) {
    return handle.fail({ errMsg: e.message })
  }
}
