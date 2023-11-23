/**
 * 检查登录态是否过期
 * 
 * @canNotUse checkSession
 */
export { checkSession } from '@tarojs/taro-h5'

/**
 * 该接口仅在小程序插件中可调用，调用接口获得插件用户标志凭证（code）
 * 
 * @canNotUse pluginLogin
 */
export * from './login'
export { pluginLogin } from '@tarojs/taro-h5'