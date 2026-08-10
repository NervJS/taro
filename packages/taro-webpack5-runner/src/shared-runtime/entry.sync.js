/* global __TARO_GLOBAL_OBJECT__, __TARO_SHARED_GLOBAL__, __TARO_SHARED_ASYNC_REQUEST__, __TARO_RUNTIME_VERSION__ */
/**
 * 方案二 split · 同步核（sync-core）入口
 *
 * 随业务包，在业务 app.js 顶层被同步 require。职责：
 *   1. 同步填「页面注册必需」的真身：@tarojs/runtime + @tarojs/shared + 平台 runtime
 *   2. react 本体进同步核（业务 app.js 顶层 `class App extends React.Component` 需它同步就位）
 *   3. 为异步才到的包预放占位对象（react-dom/framework/taro），真身到达后原地 mutate 同一对象
 *   4. 装 Current.app 占位 shim（app-shim）
 *   5. require.async 拉 shared-async 子包，到达后激活真身
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
function share (name, mod) { if (!shared[name]) shared[name] = mod }

// 记录本同步核编译时的运行时协议版本，供异步核校验（避免同步核与异步核跨版本错配）
shared.__rtVersion = __TARO_RUNTIME_VERSION__

// ---- 1. 同步真身 ----
var runtime = require('@tarojs/runtime')
var platformRuntime = require('@tarojs/plugin-platform-weapp/dist/runtime')
// 副作用：mergeReconciler / mergeInternalComponents
share('@tarojs/runtime', runtime)
share('@tarojs/shared', require('@tarojs/shared'))

share('@tarojs/plugin-platform-weapp/dist/runtime', platformRuntime)

var Current = runtime.Current

// ---- 2. react 本体进同步核（仅 ~9KB）----
// 单一真理源：externals.ts::SYNC_REACT_MEMBERS。webpack CommonJS 静态分析要求 require 参数为
// 字面量字符串（否则模块无法被打包），故此处不能用宏展开或数组遍历——改这三行时必须同步
// externals.ts 里的 SYNC_REACT_MEMBERS 常量，两处一致。
share('react', require('react'))
share('react/jsx-runtime', require('react/jsx-runtime'))
// 开发模式下自动 JSX runtime 会请求 react/jsx-dev-runtime，一并同步注册，避免 dev 构建拿到 undefined。
share('react/jsx-dev-runtime', require('react/jsx-dev-runtime'))

// ---- 3+4. framework-runtime / @tarojs/taro / react-dom 占位（带排队与未就位保护）----
require('./app-shim.js').install(shared, Current)

// ---- 5. 触发异步核加载：require.async 拉 shared-async 子包，到达后激活真身 ----
// 小程序只支持 require.async(注册过的分包路径)，不支持 import().then。
// 该请求由 webpack config 配成 promise-external，编译成 require.async(相对路径)。
require(__TARO_SHARED_ASYNC_REQUEST__).then(function () {
  if (typeof shared.__activateAsync === 'function') {
    shared.__activateAsync()
  } else {
    console.error('[taro-shared] shared-async 已加载但 __activateAsync 缺失')
  }
}).catch(function (e) {
  console.error('[taro-shared] require.async shared-async 失败 >>>', (e && e.errMsg) || (e && e.message) || e)
})
