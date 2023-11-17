import { temporarilyNotSupport } from '../../utils'

/**
 * Taro.getExtConfig 的同步版本
 * 
 * @canNotUse getExtConfigSync
 */
export const getExtConfigSync = /* @__PURE__ */ temporarilyNotSupport('getExtConfigSync')

/**
 * 获取第三方平台自定义的数据字段
 * 
 * @canNotUse getExtConfig
 */
export const getExtConfig = /* @__PURE__ */ temporarilyNotSupport('getExtConfig')
