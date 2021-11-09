/**
 * 用户相关API， Harmony ACE API 6
 *
 * 1. 华为账号场景介绍文档 @see https://developer.huawei.com/consumer/cn/doc/development/HMSCore-Guides/harmonyos-js-login-0000001151310900
 * 2. 华为账号API参考 @see https://developer.huawei.com/consumer/cn/doc/development/HMSCore-References/harmonyos-js-overview-0000001063532145
 */

import { IAsyncParams } from '../utils/types'
import { unsupport, validateOptions, callAsyncSuccess, callAsyncFail } from '../utils'

const hmsJSAccount = require('@hmscore/hms-jsb-account')

/**
 * 帐号授权登录
 * @param options
 */
function login (options: IAsyncParams) {
  const { res } = validateOptions('login', options)
  const { success, fail, complete } = options

  const signInOption = new hmsJSAccount.HuaweiIdAuthParamsHelper().setScope(hmsJSAccount.PROFILE).setAuthorizationCode().build()
  hmsJSAccount.HuaweiIdAuthManager.getAuthApi().getSignInIntent(signInOption).then((result) => {
    if (result) {
      res.data = { code: result.serverAuthCode }
      typeof success === 'function' && success(res)
    } else {
      res.errorMsg = 'signIn result data is null'
      typeof fail === 'function' && fail(res)
    }
    typeof complete === 'function' && complete(res)
  }).catch((error) => {
    res.data = { errMsg: error.errMsg }
    typeof fail === 'function' && fail(res)
    typeof complete === 'function' && complete(res)
  })
}

/**
 * 通过Scope数组获取已登录的对应帐号信息(依赖login行为)
 * @param options
 */
function getUserInfo (options: IAsyncParams) {
  const { res } = validateOptions('getUserInfo', options)
  const { success, fail, complete } = options

  const result = hmsJSAccount.HuaweiIdAuthManager.getAuthResultWithScopes([hmsJSAccount.PROFILE])

  if (result) {
    res.data = { userInfo: generateUserInfo(result) }
    typeof success === 'function' && success(res)
  } else {
    res.errorMsg = 'signIn result data is null'
    typeof fail === 'function' && fail(res)
  }
  typeof complete === 'function' && complete(res)
}

/**
 * 获取用户信息
 */
const getUserProfile = (options) => {
  const { res } = validateOptions('getUserProfile', options)
  return new Promise((resolve, reject) => {
    hmsJSAccount.HuaweiIdAuthManager.addAuthScopes([hmsJSAccount.PROFILE]).then((result) => {
      if (result) {
        res.data = { userInfo: generateUserInfo(result) }
        callAsyncSuccess(resolve, res, options)
      } else {
        res.errorMsg = 'signIn result data is null'
        callAsyncFail(reject, res, options)
      }
    }).catch((error) => {
      callAsyncFail(reject, error, options)
    })
  })
}

/**
 * 提前向用户发起授权请求
 */
function authorize () {
  process.env.NODE_ENV !== 'production' && unsupport('authorize')
}

/**
 * 获取用户的当前设置
 */
function getSetting () {
  process.env.NODE_ENV !== 'production' && unsupport('getSetting')
}

/**
 * 调起客户端小程序设置界面
 */
function openSetting () {
  process.env.NODE_ENV !== 'production' && unsupport('openSetting')
}

function generateUserInfo (hmsAuthInfo) {
  const userInfo = {
    nickName: String,
    avatarUrl: String,
    gender: Number,
    country: String
  }
  if (hmsAuthInfo) {
    userInfo.nickName = hmsAuthInfo.displayName
    userInfo.avatarUrl = hmsAuthInfo.photoUriString
    userInfo.gender = hmsAuthInfo.gender
    userInfo.country = hmsAuthInfo.country
  }
  return userInfo
}

export {
  login,
  getUserInfo,
  getUserProfile,
  authorize,
  getSetting,
  openSetting
}
