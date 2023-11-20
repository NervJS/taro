import { temporarilyNotSupport } from '../../../utils'

/**
 * 检查登录态是否过期
 * 
 * @canNotUse checkSession
 */
export const checkSession = /* @__PURE__ */ temporarilyNotSupport('checkSession')

/**
 * 该接口仅在小程序插件中可调用，调用接口获得插件用户标志凭证（code）
 * 
 * @canNotUse pluginLogin
 */
export const pluginLogin = /* @__PURE__ */ temporarilyNotSupport('pluginLogin')

export * from './login'