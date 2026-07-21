/** 方案二 split 共享运行时相关常量 */

/** 同步核产物文件名（不含 .js），emit 到 outputDir 根，随业务包 */
export const SHARED_SYNC_CORE_NAME = 'taro-shared-sync'

/** 方案一 host 全量运行时核文件名（不含 .js），emit 到 outputDir 根 */
export const SHARED_HOST_CORE_NAME = 'taro-core'

/** react 异步共享子包 root（app.json subPackages 注册；require.async 目标） */
export const SHARED_ASYNC_ROOT = 'shared-async'

/** 挂运行时的全局对象名（wx 下）。两方案分名，共存零冲突。 */
export const SHARED_GLOBAL_HOST = '__TARO_RT__' // 方案一 host
export const SHARED_GLOBAL_ASYNC = '__TARO_RT_ASYNC__' // 方案二 split
