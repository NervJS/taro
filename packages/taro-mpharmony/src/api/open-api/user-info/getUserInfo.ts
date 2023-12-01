import Taro from '@tarojs/taro'
import { shouldBeObject } from 'src/utils'
import { MethodHandler } from 'src/utils/handler'

/**
 * 获取用户信息
 * 
 * @canUse getUserInfo
 * @__object [lang, withCredentials]
 * @__success [userInfo]
 */
export const getUserInfo: typeof Taro.getUserInfo = (options) => {
  const name = 'getUserInfo'

  // options must be an Object
  const isObject = shouldBeObject(options)
  if (!isObject.flag) {
    const res = { errMsg: `${name}:fail ${isObject.msg}` }
    console.error(res.errMsg)
    return Promise.reject(res)
  }

  const { lang, withCredentials, success, fail, complete } = options as Exclude<typeof options, undefined>

  const handle = new MethodHandler({ name, success, fail, complete })

  // @ts-ignore
  const ret = native.getUserInfo({
    lang: lang,
    withCredentials: withCredentials,
    success: (res: any) => {
      return handle.success(res)
    },
    fail: (err: any) => {
      return handle.fail(err)
    },
  })
  return ret
}

/**
 * 用户信息
 * 
 * @canUse UserInfo
 * @__class [nickName, avatarUrl]
 */