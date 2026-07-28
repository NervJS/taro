/** 共享运行时相关常量 */

/** 同步核产物文件名（不含 .js），emit 到 outputDir 根，随业务包 */
export const SHARED_SYNC_CORE_NAME = 'taro-shared-sync'

/** 方案一 host 全量运行时核文件名（不含 .js），emit 到 outputDir 根 */
export const SHARED_HOST_CORE_NAME = 'taro-core'

/** react 异步共享子包 root（app.json subPackages 注册；require.async 目标）。split / async-host 两模式共用同一子包目录（互斥，不会同时产出）。 */
export const SHARED_ASYNC_ROOT = 'shared-async'

/** 实验 async-host：全量运行时 provider 产物文件名（不含 .js），emit 到 SHARED_ASYNC_ROOT 下 */
export const SHARED_ASYNC_HOST_PROVIDER_NAME = 'async-host-provider'

/** 挂运行时的全局对象名（wx 下）。三模式分名，共存零冲突。 */
export const SHARED_GLOBAL_HOST = '__TARO_RT__' // 方案一 host / 实验 async-host（同名，语义一致：全量核挂载点）
export const SHARED_GLOBAL_ASYNC = '__TARO_RT_ASYNC__' // 方案二 split
