/**
 * 环境变量
 *
 * @canUse env
 * @__variable [FRAMEWORK, TARO_ENV, USER_DATA_PATH]
 */
export const env = {
  FRAMEWORK: process.env.FRAMEWORK,
  TARO_ENV: process.env.TARO_ENV,
  TARO_PLATFORM: process.env.TARO_PLATFORM,
  TARO_VERSION: process.env.TARO_VERSION,
  USER_DATA_PATH: 'internal://files',
}

/**
 * 向调试面板中打印日志。console 是一个全局对象，可以直接访问。
 *
 * @canUse console
 * @__class [debug, error, group, groupEnd, info, log, warn]
 */

export * from './system'
export * from './weapp/life-cycle'
