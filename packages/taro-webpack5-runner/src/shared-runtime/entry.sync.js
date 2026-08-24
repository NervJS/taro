/* global __TARO_GLOBAL_OBJECT__, __TARO_SHARED_GLOBAL__, __TARO_SHARED_ASYNC_REQUEST__, __TARO_RUNTIME_VERSION__ */
/**
 * 共享运行时（split 模式） · 同步核（sync-core）入口
 *
 * 随业务包，在业务 app.js 顶层被同步 require。职责：
 *   1. 同步填「页面注册必需」的真身：@tarojs/runtime + @tarojs/shared + 平台 runtime
 *   2. react 本体进同步核（业务 app.js 顶层 `class App extends React.Component` 需它同步就位）
 *   3. 为异步才到的包预放占位对象（react-dom/framework/taro），真身到达后原地 mutate 同一对象
 *   4. 装 Current.app 占位 shim（app-shim）
 *   5. require.async 拉 shared-async 子包，到达后激活真身
 *
 * 多业务包共享（共享运行时核心价值场景）：同一宿主小程序可集成多个独立编译的 Taro 业务包，
 * 各业务包 app.js 顶层都会 require 本文件（每包产物 outputDir 根各一份，模块 CJS 缓存作用域
 * 仅限本包，跨包不共享）。首包 require 时完整执行装占位 + 触发异步核；后续包 require 时通过
 * shared.__syncCoreInstalled 幂等守卫**整体早退**，不重装占位、不重置 Current.app、不重复触发
 * require.async（webpack require.async 有内部缓存亦无副作用）。
 *
 * 架构约束——后加载业务包 App 胜出（last-writer）：
 * 后续业务包 app.js 顶层 `createReactApp(App_N, ...)` 仍会执行：
 *   - 若异步核尚未激活： fw.createReactApp 是占位版，`shared.__appBootstrap` 被覆盖为
 *     最后一包的 App+config，异步核激活时 __activateReal 用最后一包的 App 建 realAppObj。
 *   - 若异步核已激活： fw.createReactApp 已被 provider fill 为真身，后续调用直接进 framework
 *     的原生 createReactApp，内部 `Current.app = new_appObj` 无守卫覆盖（见
 *     packages/taro-framework-react/src/runtime/connect.ts:434)。
 * 此语义**与 Taro 单份 runtime 内 framework createReactApp 原生行为一致**——不是共享运行时
 * 引入的新约束，而是保持与非共享模式的语义连续。非共享模式下每包各自一份 Current 实例
 * (packages/taro-runtime/src/current.ts:20)，跨包不交互；共享模式下多包塞进一份 Current
 * 时，按原生"就近赋值"语义，最后加载的包成为当前活跃 App。
 *
 * Caveat: mount 队列错位。app-shim 的 whenReal 队列缓存了页面 mount/lifecycle，若 A 页面已
 * 入队、B 后加载成为 last-writer，__activateReal 用 B 的 App 建 realAppObj，A 的页面挂到
 * B 的 AppWrapper 上。此矛盾根源是"多包共用一个 AppWrapper"，无论 first/last 策略都存在，
 * 真正的解是多 App 隔离（按业务包路由分派 + 多 App 表），属于后续独立扩展。
 *
 * 全局对象 / 全局名 / 异步核请求路径由 DefinePlugin 注入的宏提供（单一来源为 constants.ts + globalObject 配置）：
 *   __TARO_GLOBAL_OBJECT__        全局对象标识符（标识符，非字符串），如 wx
 *   __TARO_SHARED_GLOBAL__        全局键名（字符串），如 '__TARO_RT_ASYNC_V1__'
 *   __TARO_SHARED_ASYNC_REQUEST__ 异步核 require.async 目标（字符串），如 'shared-async-v1/index'
 *   __TARO_RUNTIME_VERSION__      运行时协议版本号（数值），供异步核做版本一致性校验
 *
 * 注：本文件由 runner 的 provider 子构建打包，react/@tarojs/* 从用户项目 node_modules 解析。
 */
var GLOBAL_KEY = __TARO_SHARED_GLOBAL__
var shared = (__TARO_GLOBAL_OBJECT__[GLOBAL_KEY] = __TARO_GLOBAL_OBJECT__[GLOBAL_KEY] || {})

// 幂等守卫：首包完整跑；后续包跳过全部装占位/触发异步核逻辑，保护首包已就位的
// runtime/react 真身、Current.app、__rtVersion 不被覆盖。
if (!shared.__syncCoreInstalled) {
  shared.__syncCoreInstalled = true

  // 记录本同步核编译时的运行时协议版本，供异步核校验（避免跨版本错配）。
  // 首包设置，后续包因幂等跳过——多包版本不一时以首包为准。
  shared.__rtVersion = __TARO_RUNTIME_VERSION__

  // 多包 App 隔离表（共享运行时（split 模式） F5）：每个业务包的 realApp 存进 __pkgApps[pkgId]，
  // page loader 产物在 onLoad 前查回本包 App，恢复非共享运行时下"页面永远 mount 到本包 App"
  // 的语义（见 packages/taro-webpack5-runner/docs/shared-runtime-scope.md)。
  shared.__pkgApps = shared.__pkgApps || {}

  // F6 native-components 隔离表：每个 native-comp 业务包的 Entry(App）存进
  // __nativeComponentApps[pkgId]，createNativeComponentConfig 里按 pkgId 查回，
  // 与 __pkgApps 平行（pages 与 native-comps 各自独立表，互不影响）。
  shared.__nativeComponentApps = shared.__nativeComponentApps || {}

  var share = function (name, mod) { if (!shared[name]) shared[name] = mod }

  // ---- 1. 同步真身 ----
  var runtime = require('@tarojs/runtime')
  var platformRuntime = require('@tarojs/plugin-platform-weapp/dist/runtime')
  // 副作用：mergeReconciler / mergeInternalComponents
  share('@tarojs/runtime', runtime)
  share('@tarojs/shared', require('@tarojs/shared'))

  share('@tarojs/plugin-platform-weapp/dist/runtime', platformRuntime)

  var Current = runtime.Current

  // ---- 2. react 本体进同步核（仅 ~9KB）----
  // 单一真理源：externals.ts:：SYNC_REACT_MEMBERS。webpack CommonJS 静态分析要求 require 参数为
  // 字面量字符串（否则模块无法被打包），故此处不能用宏展开或数组遍历——改这三行时必须同步
  // externals.ts 里的 SYNC_REACT_MEMBERS 常量。
  share('react', require('react'))
  share('react/jsx-runtime', require('react/jsx-runtime'))
  // 开发模式下自动 JSX runtime 会请求 react/jsx-dev-runtime，一并同步注册，避免 dev 构建拿到 undefined。
  share('react/jsx-dev-runtime', require('react/jsx-dev-runtime'))

  // ---- 3+4. framework-runtime / @tarojs/taro / react-dom 占位（带排队与未就位保护）----
  require('./app-shim.js').install(shared, Current)

  // ---- 5. 触发异步核加载：require.async 拉 shared-async 子包，到达后激活真身 ----
  // 小程序只支持 require.async（注册过的分包路径），不支持 import().then。
  // 该请求由 webpack config 配成 promise-external，编译成 require.async（相对路径）。
  require(__TARO_SHARED_ASYNC_REQUEST__).then(function () {
    if (typeof shared.__activateAsync === 'function') {
      shared.__activateAsync()
    } else {
      console.error('[taro-shared] shared-async 已加载但 __activateAsync 缺失')
    }
  }).catch(function (e) {
    console.error('[taro-shared] require.async shared-async 失败 >>>', (e && e.errMsg) || (e && e.message) || e)
  })
}
