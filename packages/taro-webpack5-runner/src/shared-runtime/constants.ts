/** 共享运行时（split 模式）相关常量 */

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

/**
 * taro-loader 的 runtimePath `post:` 前缀（镜像 taro-loader/src/constants.ts 的 REG_POST）。
 * 这里单独定义而非 import：taro-loader 是编译期 loader 包，跨已编译包 import 常量不稳妥，
 * 且此正则极简、语义固定，就地镜像一份即可。改动时两处保持一致。
 */
export const REG_POST = /^post:/

/**
 * 同步核 entry.sync.js 已静态 require 并 share() 到共享全局的「runtime 类」模块清单。
 * computeMissingRuntimes 用它做差集：platform.runtimePath 里已在此清单的（如平台 runtime）
 * 无需再作为额外入口重复打进同步核。
 *
 * ⚠️ 改动 entry.sync.js 里 require 的平台/运行时模块清单时必须同步此常量
 * （tests/shouldShareExternal.spec.ts 有一致性守护单测防漂移）。
 * 注：react 全家桶虽也在 entry.sync.js 同步 require，但它们不属于 platform.runtimePath
 * （runtimePath 只承载 @tarojs/* 平台与插件 runtime），不会进 computeMissingRuntimes 的输入，
 * 故不必列入此清单。
 */
export const SYNC_CORE_REGISTERED_RUNTIMES: readonly string[] = [
  '@tarojs/runtime',
  '@tarojs/shared',
  '@tarojs/plugin-platform-weapp/dist/runtime',
]
