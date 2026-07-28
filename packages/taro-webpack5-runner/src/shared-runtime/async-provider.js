/**
 * 方案二 · async-provider —— 落在 shared-async 子包，被 require.async 加载后执行
 * 把 react+framework+api 真身【原地 mutate】进同步核预放的占位对象（保引用），再 flush。
 *
 * 注：react/react-dom(jsx-runtime)/@tarojs/runtime/@tarojs/shared/平台runtime 由 webpack config
 * external 到 wx.__TARO_RT_ASYNC__（读同步核那份），避免打包副本导致双实例（react/document 双份）。
 */
function fill (target, real) {
  if (!target || !real) return
  Object.keys(real).forEach(function (k) { target[k] = real[k] })
  if (real.default && !target.default) target.default = real.default
}

function activate () {
  var shared = wx.__TARO_RT_ASYNC__ || (wx.__TARO_RT_ASYNC__ = {})

  // 占位就绪守卫：正常时序下同步核已跑（runtime/占位齐全）。若 activate 早于同步核
  // （如宿主 onLaunch 主动 require.async 预热），此时占位对象尚不存在——只登记，不 fill，
  // 真正 fill 仍由业务页同步核 bootstrap 的 require.async().then(__activateAsync) 触发。
  if (!shared['@tarojs/runtime'] || !shared['@tarojs/taro']) {
    return
  }
  // 幂等：避免重复激活（预热 + 正常触发各调一次）
  if (shared.__rtActivated) return
  // 先置激活标记：占位 Proxy 的 realFlag 依赖它。置位后 provider 自身对占位对象的
  // 读写（含下方读 taroObj.showToast）不会被 Proxy 拦截抛错。
  shared.__rtActivated = true

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

// 被同步核 require.async 加载时，把 activate 挂到全局供 bootstrap 回调。
// 顶层防御：即使全局未初始化（预热早于同步核）也能安全挂载。
// 真正 fill 由业务页同步核 bootstrap 的 require.async().then(__activateAsync) 触发；
// 预热场景即便外部提前调 __activateAsync，activate 内的占位就绪守卫也会安全跳过。
(wx.__TARO_RT_ASYNC__ = wx.__TARO_RT_ASYNC__ || {}).__activateAsync = activate

module.exports = { activate: activate }
