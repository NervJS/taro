import Taro from '@tarojs/api'
import { shouldBeObject } from 'src/utils'

import native from '../../NativeApi'

/**
 * 调起客户端小程序设置界面，返回用户设置的操作结果
 *
 * @canUse openSetting
 * @__object [withSubscriptions]
 * @__success [authSetting, subscriptionsSetting]
 */
export const openSetting: typeof Taro.openSetting = function (options) {
  const name = 'openSetting'
  // options must be an Object
  const isValid = shouldBeObject(options).flag || typeof options === undefined
  if (!isValid) {
    const res = { errMsg: `${name}:fail invalid params` }
    console.error(res.errMsg)
    return Promise.reject(res)
  }

  return native.openSetting(options)
}
