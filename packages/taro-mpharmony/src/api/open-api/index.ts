import { temporarilyNotSupport } from '../../utils'

/**
 * 获取视频号直播卡片/视频卡片的分享来源
 * 
 * @canNotUse getChannelsShareKey
 */
export const getChannelsShareKey = /* @__PURE__ */ temporarilyNotSupport('getChannelsShareKey')

/**
 * 请求用户授权与设备（组）间进行音视频通话
 * 
 * @canNotUse requestDeviceVoIP
 */
export const requestDeviceVoIP = /* @__PURE__ */ temporarilyNotSupport('requestDeviceVoIP')

/**
 * 查询当前用户授权的音视频通话设备（组）信息
 * 
 * @canNotUse getDeviceVoIPList
 */
export const getDeviceVoIPList = /* @__PURE__ */ temporarilyNotSupport('getDeviceVoIPList')

/**
 * 模拟隐私接口调用，并触发隐私弹窗逻辑
 * 
 * @canNotUse requirePrivacyAuthorize
 */
export const requirePrivacyAuthorize = /* @__PURE__ */ temporarilyNotSupport('requirePrivacyAuthorize')

/**
 * 跳转至隐私协议页面
 * 
 * @canNotUse openPrivacyContract
 */
export const openPrivacyContract = /* @__PURE__ */ temporarilyNotSupport('openPrivacyContract')

/**
 * 监听隐私接口需要用户授权事件。
 * 
 * @canNotUse onNeedPrivacyAuthorization
 */
export const onNeedPrivacyAuthorization = /* @__PURE__ */ temporarilyNotSupport('onNeedPrivacyAuthorization')

/**
 * 查询隐私授权情况。
 * 
 * @canNotUse getPrivacySetting
 */
export const getPrivacySetting = /* @__PURE__ */ temporarilyNotSupport('getPrivacySetting')

export * from './account'
export * from './address'
export * from './authorize'
export * from './card'
export * from './channels-live'
export * from './customer-service'
export * from './facial'
export * from './favorites'
export * from './group'
export * from './invoice'
export * from './license-plate'
export * from './login'
export * from './red-package'
export * from './settings'
export * from './soter'
export * from './subscribe-message'
export * from './user-info'
export * from './werun'
