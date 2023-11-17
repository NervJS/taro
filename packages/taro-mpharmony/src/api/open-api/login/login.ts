import Taro from '@tarojs/taro'
import { shouldBeObject } from 'src/utils'
import { MethodHandler } from 'src/utils/handler'

/**
 * 调用接口获取登录凭证（code）
 *  
 * @canUse login
 * @__object [timeout] 
 * @__success [code]
 */
export const login: typeof Taro.login = (options) => {
  const name = 'login'

  // options must be an Object
  const isObject = shouldBeObject(options)
  if (!isObject.flag) {
    const res = { errMsg: `${name}:fail ${isObject.msg}` }
    console.error(res.errMsg)
    return Promise.reject(res)
  }

  const { timeout, success, fail, complete } = options as Exclude<typeof options, undefined>
  const handle = new MethodHandler({ name, success, fail, complete })

  let loginPromise = new Promise((resolve, reject) => {
    // @ts-ignore
    native.login({
      success: (res: any) => {
        resolve(res)
      },
      fail: (err: any) => {
        reject(err)
      },
    })
  })
  if (typeof timeout === 'number' && timeout >= 0) {
    const timeoutPromise = new Promise((_resolve, reject) => {
      setTimeout(() => reject(new Error('timeout')), timeout)
    })
    loginPromise = Promise.race([loginPromise, timeoutPromise])
  }
  return loginPromise.then(
    (res: any) => handle.success(res),
    (err) => {
      if (err instanceof Error) {
        return handle.fail({ errMsg: err.message })
      } else {
        const { errMsg, errCode: code } = err
        return handle.fail({ errMsg, code })
      }
    }
  )
}
