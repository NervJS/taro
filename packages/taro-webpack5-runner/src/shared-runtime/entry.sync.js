/**
 * 方案二 · 同步核（sync-core）入口
 *
 * 随业务包，在业务 app.js 顶层被同步 require。职责：
 *   1. 同步填「页面注册必需」的真身：@tarojs/runtime + @tarojs/shared + 平台 runtime
 *   2. react 本体进同步核（业务 app.js 顶层 `class App extends React.Component` 需它同步就位）
 *   3. 为异步才到的包预放占位对象（react-dom/framework/taro），真身到达后【原地 mutate 同一对象】
 *   4. 装 Current.app 占位 shim（app-shim）
 *   5. bootstrap：require.async 拉 shared-async 子包
 *
 * 注：本文件由 runner 的 provider 子构建打包，react/@tarojs/* 从【用户项目】node_modules 解析。
 */
var shared = (wx.__TARO_RT_ASYNC__ = wx.__TARO_RT_ASYNC__ || {})
function share (name, mod) { if (!shared[name]) shared[name] = mod }

// ---- 1. 同步真身 ----
var runtime = require('@tarojs/runtime')
var platformRuntime = require('@tarojs/plugin-platform-weapp/dist/runtime')
// 副作用：mergeReconciler/mergeInternalComponents
share('@tarojs/runtime', runtime)
share('@tarojs/shared', require('@tarojs/shared'))

share('@tarojs/plugin-platform-weapp/dist/runtime', platformRuntime)

var Current = runtime.Current

// ---- 2. react 本体进同步核（仅 ~9KB）----
share('react', require('react'))
share('react/jsx-runtime', require('react/jsx-runtime'))
// react-dom 占位（真身=@tarojs/react reconciler，异步到）
share('react-dom', {})

// ---- 3+4. framework-runtime / @tarojs/taro 占位（带排队逻辑）----
require('./app-shim.js').install(shared, Current)

// ---- 5. 触发异步加载（若 framework 已在全局=方案一，则同步激活）----
require('./bootstrap.js').ensureAsync(shared)
