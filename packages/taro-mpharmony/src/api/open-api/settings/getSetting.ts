import Taro from '@tarojs/api'
import { shouldBeObject } from 'src/utils'
import { MethodHandler } from 'src/utils/handler'

/**
 * 获取用户的当前设置
 * 
 * @canUse getSetting
 * @__object [withSubscriptions]
 * @__success [authSetting, subscriptionsSetting, miniprogramAuthSetting]
 */
export const getSetting: typeof Taro.getSetting = function (options) {
  const name = 'getSetting'

  // options must be an Object
  const isValid = shouldBeObject(options).flag || typeof options === undefined
  if (!isValid) {
    const res = { errMsg: `${name}:fail invalid params` }
    console.error(res.errMsg)
    return Promise.reject(res)
  }

  const { success, fail, complete, ...otherOptions } = options as Exclude<typeof options, undefined>

  const handle = new MethodHandler<{
    authSetting: Taro.AuthSetting
    subscriptionsSetting?: Taro.SubscriptionsSetting
    miniprogramAuthSetting: Taro.AuthSetting
    errMsg?: string
  }>({ name, success, fail, complete })

  // @ts-ignore
  return native.getSetting(otherOptions).then(
    (res: any) => {
      const result: Taro.getSetting.SuccessCallbackResult = {
        authSetting: res.authSetting,
        subscriptionsSetting: res.subscriptionsSetting || {},
        miniprogramAuthSetting: {},
        errMsg: res.errMsg,
      }
      handle.success(result)
      // handle.success(res)
    },
    (res: any) => {
      handle.fail(res)
    }
  )
}
