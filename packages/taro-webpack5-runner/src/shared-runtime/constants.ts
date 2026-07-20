/** 方案二 split 共享运行时相关常量 */

/** 同步核产物文件名（不含 .js），emit 到 outputDir 根，随业务包 */
export const SHARED_SYNC_CORE_NAME = 'taro-shared-sync'

/** react 异步共享子包 root（app.json subPackages 注册；require.async 目标） */
export const SHARED_ASYNC_ROOT = 'shared-async'
