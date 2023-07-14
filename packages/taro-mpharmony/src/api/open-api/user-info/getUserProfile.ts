import Taro from '@tarojs/taro'
import { getParameterError, shouldBeObject } from 'src/utils'
import { MethodHandler } from 'src/utils/handler'

export const getUserProfile: typeof Taro.getUserProfile = (options) => {
  const name = 'getUserProfile'

  return new Promise((resolve, reject) => {
    // options must be an Object
    const isObject = shouldBeObject(options)
    if (!isObject.flag) {
      const res = { errMsg: `${name}:fail ${isObject.msg}` }
      console.error(res.errMsg)
      return Promise.reject(res)
    }
    const {
      lang,
      desc,
      success,
      fail,
      complete
    } = options as Exclude<typeof options, undefined>

    const handle = new MethodHandler({ name, success, fail, complete })

    // options.url must be String
    if (typeof desc !== 'string') {
      return handle.fail({
        errMsg: getParameterError({
          para: 'desc',
          correct: 'string',
          wrong: desc
        })
      }, { resolve, reject })
    }

    // @ts-ignore
    const ret = native.getUserProfile({
      lang: lang,
      desc: desc,
      success: (res: any) => {
        return handle.success(res)
      },
      fail: (err: any) => {
        return handle.fail(err)
      }
    })
    return ret
  })
}
