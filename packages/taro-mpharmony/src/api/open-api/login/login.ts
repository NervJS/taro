import Taro from '@tarojs/taro'
import { shouldBeObject } from 'src/utils'
import { MethodHandler } from 'src/utils/handler'

export const login: typeof Taro.login = (options) => {
  const name = 'login'

  // options must be an Object
  const isObject = shouldBeObject(options)
  if (!isObject.flag) {
    const res = { errMsg: `${name}:fail ${isObject.msg}` }
    console.error(res.errMsg)
    return Promise.reject(res)
  }
  
  const {
    timeout,
    success,
    fail,
    complete
  } = options as Exclude<typeof options, undefined>

  const handle = new MethodHandler({ name, success, fail, complete })

  // @ts-ignore
  const ret = native.authorize({
    // @ts-ignore
    appid: options.appid,
    // @ts-ignore
    type: options.type || 'code',
    // @ts-ignore
    scope: options.scope || 'scope.baseProfile',
    timeout: timeout,
    success: (res: any) => {
      return handle.success(res)
    },
    fail: (err: any) => {
      return handle.fail(err)
    }
  })
  return ret
}
