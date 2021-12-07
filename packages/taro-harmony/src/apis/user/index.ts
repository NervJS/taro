/**
 * 用户相关API， Harmony ACE API 6
 *
 * 1. 华为账号场景介绍文档 @see https://developer.huawei.com/consumer/cn/doc/development/HMSCore-Guides/harmonyos-js-login-0000001151310900
 * 2. 华为账号API参考 @see https://developer.huawei.com/consumer/cn/doc/development/HMSCore-References/harmonyos-js-overview-0000001063532145
 */
import { isFunction } from '@tarojs/shared'
import { IAsyncParams } from '../utils/types'
import { unsupport, callAsyncSuccess, callAsyncFail } from '../utils'

const hmsJSAccount = require('@hmscore/hms-jsb-account')

/**
 * 帐号授权登录
 * @param options
 */
const login = (options) => {
  return new Promise((resolve, reject) => {
    const res: Record<string, any> = {}
    const signInOption = new hmsJSAccount.HuaweiIdAuthParamsHelper().setScope(hmsJSAccount.PROFILE).setAuthorizationCode().build()
    hmsJSAccount.HuaweiIdAuthManager.getAuthApi().getSignInIntent(signInOption)
      .then(result => {
        if (result) {
          res.data = { code: result.serverAuthCode }
          callAsyncSuccess(resolve, res, options)
        } else {
          res.errorMsg = 'signIn result data is null'
          callAsyncFail(reject, res, options)
        }
      })
      .catch(error => {
        res.data = { errMsg: error.errMsg }
        callAsyncFail(reject, res, options)
      })
  })
}

/**
 * 通过Scope数组获取已登录的对应帐号信息(依赖login行为)
 * @param options
 */
function getUserInfo (options: IAsyncParams) {
  const { success, fail, complete } = options
  const res: Record<string, any> = {}

  const result = hmsJSAccount.HuaweiIdAuthManager.getAuthResultWithScopes([hmsJSAccount.PROFILE])

  if (result) {
    res.data = { userInfo: generateUserInfo(result) }
    isFunction(success) && success(res)
  } else {
    res.errorMsg = 'getUserInfo result data is null'
    isFunction(fail) && fail(res)
  }
  isFunction(complete) && complete(res)
}

/**
 * 获取用户信息
 */
const getUserProfile = (options) => {
  return new Promise((resolve, reject) => {
    const res: Record<string, any> = {}
    hmsJSAccount.HuaweiIdAuthManager.addAuthScopes([hmsJSAccount.PROFILE])
      .then(result => {
        if (result) {
          res.data = { userInfo: generateUserInfo(result) }
          callAsyncSuccess(resolve, res, options)
        } else {
          res.errorMsg = 'getUserProfile result data is null'
          callAsyncFail(reject, res, options)
        }
      })
      .catch(error => {
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
