/**
 * 方案二 · async-provider —— 落在 shared-async 子包，被 require.async 加载后执行
 * 把 react+framework+api 真身【原地 mutate】进同步核预放的占位对象（保引用），再 flush。
 *
 * 注：react/react-dom(jsx-runtime)/@tarojs/runtime/@tarojs/shared/平台runtime 由 webpack config
 * external 到 wx.__TARO_SHARED__（读同步核那份），避免打包副本导致双实例（react/document 双份）。
 */
function fill (target, real) {
  if (!target || !real) return
  Object.keys(real).forEach(function (k) { target[k] = real[k] })
  if (real.default && !target.default) target.default = real.default
}

function activate () {
  var shared = wx.__TARO_SHARED__

  var reactDom = require('@tarojs/react') // 小程序下 react-dom = reconciler
  var framework = require('@tarojs/plugin-framework-react/dist/runtime')
  var taro = require('@tarojs/taro') // 触发 initNativeApi（平台 runtime 已同步注册）

  fill(shared['react-dom'], reactDom)

  var fw = shared['@tarojs/plugin-framework-react/dist/runtime']
  fill(fw, framework)

  var taroObj = shared['@tarojs/taro']
  fill(taroObj, taro)
  var REACT_HOOKS = [
    'useAddToFavorites', 'useDidHide', 'useDidShow', 'useError', 'useLaunch',
    'useLoad', 'useOptionMenuClick', 'useKeyboardHeight', 'usePageNotFound',
    'usePageScroll', 'usePullDownRefresh', 'usePullIntercept', 'useReachBottom',
    'useReady', 'useResize', 'useRouter', 'useSaveExitState', 'useShareAppMessage',
    'useShareTimeline', 'useTabItemTap', 'useTitleClick', 'useScope',
    'useUnhandledRejection', 'useUnload'
  ]
  REACT_HOOKS.forEach(function (n) { if (framework[n]) taroObj[n] = framework[n] })

  // 平台 API 兜底
  var runtime = shared['@tarojs/runtime']
  if (typeof taroObj.showToast !== 'function' && runtime.hooks && runtime.hooks.isExist('initNativeApi')) {
    runtime.hooks.call('initNativeApi', taroObj)
  }

  // 补跑 initPxTransform（同步核占位阶段存的参数）
  if (shared.__pxTransformOpts && typeof taro.initPxTransform === 'function') {
    taro.initPxTransform(shared.__pxTransformOpts)
  }

  // 建真 appObj + flush 队列
  if (typeof shared.__activateReal === 'function') {
    shared.__activateReal(fw)
  }
}

// 被同步核 require.async 加载时，把 activate 挂到全局供 bootstrap 回调
wx.__TARO_SHARED__.__activateAsync = activate

module.exports = { activate: activate }
