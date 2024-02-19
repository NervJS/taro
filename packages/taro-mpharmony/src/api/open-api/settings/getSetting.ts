import Taro from '@tarojs/api'
import { shouldBeObject } from 'src/utils'

import native from '../../NativeApi'

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

  // @ts-ignore
  return native.getSetting(options)

}
