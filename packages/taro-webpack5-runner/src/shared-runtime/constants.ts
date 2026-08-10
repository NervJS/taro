/** 共享运行时（方案二 split）相关常量 */

/**
 * 运行时共享协议版本号（手动维护的破坏性变更计数，与 Taro 包版本无关）。
 * 仅当挂到全局的运行时接口发生破坏性变更时才 +1。
 * 全局名与异步核子包名都由它拼出，bump 时只改这一处：
 * 老业务包仍读旧版本全局名、V1/V2 provider 子包不撞名，可在同一宿主真隔离共存。
 */
export const RUNTIME_GLOBAL_VERSION = 1

/**
 * 挂运行时的全局对象名（wx 下）。业务包 external 目标 + 同步核/异步核挂载点。
 * 形如 __TARO_RT_ASYNC_V1__。
 */
export const SHARED_GLOBAL_ASYNC = `__TARO_RT_ASYNC_V${RUNTIME_GLOBAL_VERSION}__`

/**
 * 同步核产物文件名（不含 .js），emit 到 outputDir 根，随业务包。
 * 业务包 app.js 顶层同步 require 它，先于任何页面注册执行。
 */
export const SHARED_SYNC_CORE_NAME = 'taro-shared-sync'

/**
 * 异步核共享子包 root（app.json subPackages 注册；require.async 目标）。
 * 全局共享一份，形如 shared-async-v1。
 */
export const SHARED_ASYNC_ROOT = `shared-async-v${RUNTIME_GLOBAL_VERSION}`

/** 异步核 provider 产物文件名（不含 .js），emit 到 SHARED_ASYNC_ROOT 下。 */
export const SHARED_ASYNC_PROVIDER_NAME = 'async-provider'
