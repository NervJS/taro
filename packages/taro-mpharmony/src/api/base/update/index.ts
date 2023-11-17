import { temporarilyNotSupport } from '../../../utils'

/**
 * 更新客户端版本
 * 
 * @canNotUse updateWeChatApp
 */
export const updateWeChatApp = /* @__PURE__ */ temporarilyNotSupport('updateWeChatApp')

// 获取全局唯一的版本更新管理器，用于管理小程序更新
export * from './getUpdateManager'