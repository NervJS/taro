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

export * from './system'
export * from './weapp/app-event'
export * from './weapp/life-cycle'