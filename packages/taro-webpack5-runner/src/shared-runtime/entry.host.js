/**
 * 方案一 · 全量运行时核（host 模式）入口
 *
 * 同步 require 整条 Taro/React 运行时链，全部挂到 wx.__TARO_RT__。
 * 放宿主主包，app.js 顶层同步 require → 之后任何业务子包页面注册/渲染都能同步读到。
 * 无 external、无异步子包、无占位——全同步，最稳。
 *
 * 注：本文件由 runner 的 host 子构建打包，react/@tarojs/* 从【用户项目】node_modules 解析。
 */
var shared = (wx.__TARO_RT__ = wx.__TARO_RT__ || {})
function share (name, mod) { if (!shared[name]) shared[name] = mod }

// 顺序关键：平台 runtime、框架 runtime 的模块副作用注册 initNativeApi hook / 合并 reconciler，
// 必须在 require('@tarojs/taro') 之前，否则 taro 内部 hooks.call('initNativeApi') 挂不上 wx API。
var runtime = require('@tarojs/runtime')
var platformRuntime = require('@tarojs/plugin-platform-weapp/dist/runtime')
var reactRuntime = require('@tarojs/plugin-framework-react/dist/runtime')
var taro = require('@tarojs/taro')

// 合并 React 生命周期 hook 到 taro（正常编译时由 framework 插件做，此处复刻）
var REACT_HOOKS = [
  'useAddToFavorites', 'useDidHide', 'useDidShow', 'useError', 'useLaunch',
  'useLoad', 'useOptionMenuClick', 'useKeyboardHeight', 'usePageNotFound',
  'usePageScroll', 'usePullDownRefresh', 'usePullIntercept', 'useReachBottom',
  'useReady', 'useResize', 'useRouter', 'useSaveExitState', 'useShareAppMessage',
  'useShareTimeline', 'useTabItemTap', 'useTitleClick', 'useScope',
  'useUnhandledRejection', 'useUnload'
]
REACT_HOOKS.forEach(function (name) { if (reactRuntime[name]) taro[name] = reactRuntime[name] })

// 平台 API 兜底
if (typeof taro.showToast !== 'function' && runtime.hooks && runtime.hooks.isExist('initNativeApi')) {
  runtime.hooks.call('initNativeApi', taro)
}

// 与业务包 external 请求串逐一对应
share('@tarojs/runtime', runtime)
share('@tarojs/shared', require('@tarojs/shared'))

share('@tarojs/taro', taro)
share('react', require('react'))
share('react/jsx-runtime', require('react/jsx-runtime'))
share('react-dom', require('@tarojs/react'))
// 小程序下 react-dom = @tarojs/react (reconciler)
share('@tarojs/plugin-framework-react/dist/runtime', reactRuntime)
share('@tarojs/plugin-platform-weapp/dist/runtime', platformRuntime)
