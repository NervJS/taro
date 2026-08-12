/* global __TARO_GLOBAL_OBJECT__, __TARO_SHARED_GLOBAL__, __TARO_RUNTIME_VERSION__ */
/**
 * 方案二 split · async-provider —— 落在 shared-async 子包，被 require.async 加载后执行。
 * 把 react 协调链 + framework + api 真身原地 mutate 进同步核预放的占位对象（保引用），再 flush。
 *
 * 分工（关键）：
 *   - react / react/jsx-runtime / @tarojs/runtime / @tarojs/shared / 平台 runtime
 *     由 webpack config external 到全局（读同步核那份），避免双实例（react/document 双份）。
 *   - react-reconciler / scheduler / react-dom(reconciler 适配) / framework / @tarojs/api
 *     真实打进本异步核 bundle，并在此注册到全局，供业务包读取。
 *
 * 全局名 / 版本号由 DefinePlugin 注入的宏提供（单一来源为 constants.ts）。
 */

// React 页面/App 生命周期 hook 名称约定：`use[A-Z]` 前缀（与 B6 scan-imperative-api 同款约定）。
// 用正则动态从 framework runtime 导出中提取所有匹配项，避免维护硬编码清单——framework 新增/重命名
// hook 时零改动，天然消除跨版本漂移（曾在 PoC 阶段两处硬编码列表漂移过）。
var REACT_HOOK_NAME_RE = /^use[A-Z]/

function fill (target, real) {
  if (!target || !real) return
  Object.keys(real).forEach(function (k) { target[k] = real[k] })
  if (real.default && !target.default) target.default = real.default
}

function share (shared, name, mod) { if (!shared[name]) shared[name] = mod }

function activate () {
  var GLOBAL_KEY = __TARO_SHARED_GLOBAL__
  var shared = __TARO_GLOBAL_OBJECT__[GLOBAL_KEY] || (__TARO_GLOBAL_OBJECT__[GLOBAL_KEY] = {})

  // 占位就绪守卫：正常时序下同步核已跑（runtime/占位齐全）。若 activate 早于同步核
  // （如宿主 onLaunch 主动 require.async 预热），此时占位对象尚不存在——只登记，不 fill，
  // 真正 fill 仍由业务页同步核的 require.async().then(__activateAsync) 触发。
  if (!shared['@tarojs/runtime'] || !shared['@tarojs/taro']) {
    return
  }
  // 幂等：避免重复激活（预热 + 正常触发各调一次）
  if (shared.__rtActivated) return

  // 版本一致性校验 fail-fast：同步核与异步核必须同一运行时协议版本，否则接口可能错配。
  if (shared.__rtVersion !== __TARO_RUNTIME_VERSION__) {
    throw new Error(
      '[taro-shared] 运行时协议版本不一致：同步核 v' + shared.__rtVersion +
      ' 与异步核 v' + __TARO_RUNTIME_VERSION__ + ' 不匹配。请确保业务包与共享运行时用同一版本重新编译。'
    )
  }

  // 先置激活标记：占位 Proxy 的 realFlag 依赖它。置位后 provider 自身对占位对象的
  // 读写（含下方读 taroObj.showToast）不会被 Proxy 拦截。
  shared.__rtActivated = true

  // react 协调链真身：react-dom(小程序下=@tarojs/react reconciler 适配)
  var reactDom = require('@tarojs/react')
  var framework = require('@tarojs/plugin-framework-react/dist/runtime')
  var taro = require('@tarojs/taro') // 触发 initNativeApi（平台 runtime 已同步注册）

  // 注册 reconciler / scheduler 到全局：业务包 external 了这两个，真身在本异步核，必须显式挂全局，
  // 否则业务包 require('react-reconciler')/require('scheduler') 读到 undefined（运行时崩）。
  //
  // 单一真理源：externals.ts::ASYNC_REACT_MEMBERS。webpack CommonJS 静态分析要求 require 参数为
  // 字面量字符串——故此处不能用宏或数组遍历，改动本对时必须同步 externals.ts 的 ASYNC_REACT_MEMBERS。
  share(shared, 'react-reconciler', require('react-reconciler'))
  share(shared, 'scheduler', require('scheduler'))

  // react-dom 真身填进同步核预放的占位对象（保引用）
  fill(shared['react-dom'], reactDom)

  // framework-runtime 真身填进占位。fill 后 fw.createReactApp 指向真身,
  // 后续业务包 app.js 顶层 `createReactApp(App_B, ...)` 直接走真身,内部 last-writer
  // 覆盖 Current.app,与 Taro 单份 runtime 原生语义一致(见 packages/taro-framework-react
  // /src/runtime/connect.ts:434 `Current.app = appObj` 无守卫赋值)。
  var fw = shared['@tarojs/plugin-framework-react/dist/runtime']
  fill(fw, framework)

  // F5 多包 App 隔离:异步核激活后再加载的业务包会直接调 fw.createReactApp 走真身,
  // 但真身不知道 pkgId、不存表。用 wrapper 兜底:走真身 + 按 pkgId 存进 __pkgApps 表,
  // 使异步核激活后加载的包也能被 page loader onLoad 前查回本包 App。
  // (F4 拆掉的 "重定向到首包" 兜底与此不同——那是 first-wins 违反 last-writer;这里只
  // "存表",不改 Current.app 的 last-writer 结果。)
  var realCreateReactApp = fw.createReactApp
  fw.createReactApp = function (App, react, reactDom, config) {
    var realAppObj = realCreateReactApp(App, react, reactDom, config)
    var pkgId = shared.__currentPkgId
    if (pkgId) {
      shared.__pkgApps = shared.__pkgApps || {}
      shared.__pkgApps[pkgId] = realAppObj
    }
    return realAppObj
  }

  // @tarojs/taro 真身填进占位（命令式 API 就位）
  var taroObj = shared['@tarojs/taro']
  fill(taroObj, taro)
  // 合并 framework hooks（useLoad 等）进 @tarojs/taro，业务 `import { useLoad } from '@tarojs/taro'` 才有值。
  // 动态扫 framework 所有 `use[A-Z]*` 导出，避免硬编码清单跨版本漂移。
  Object.keys(framework).forEach(function (n) {
    if (REACT_HOOK_NAME_RE.test(n) && typeof framework[n] === 'function') {
      taroObj[n] = framework[n]
    }
  })

  // 平台 API 兜底：若 taro 命令式 API 尚未注入，触发 initNativeApi
  var runtime = shared['@tarojs/runtime']
  if (typeof taroObj.showToast !== 'function' && runtime.hooks && runtime.hooks.isExist('initNativeApi')) {
    runtime.hooks.call('initNativeApi', taroObj)
  }

  // 补跑 initPxTransform（同步核占位阶段存的参数）
  if (shared.__pxTransformOpts && typeof taro.initPxTransform === 'function') {
    taro.initPxTransform(shared.__pxTransformOpts)
  }

  // 建真 appObj + flush 生命周期/mount 队列。
  // 用真身 framework 建 realAppObj,内部覆盖 Current.app = realAppObj。
  if (typeof shared.__activateReal === 'function') {
    shared.__activateReal(framework)
  }

  // F6 native-components:同步核阶段 native-comp 产物顶层调的是占位 createNativeComponentConfig
  // (app-shim 装的),返回占位描述符、生命周期(created/attached/ready…)全被缓存。此刻真身就位,
  // 用真身 framework.createNativeComponentConfig 为每个已注册组件重建真描述符,并按序重放缓存的
  // 生命周期调用(created 建 Entry → attached 挂载 → ready 触发)。这是 native-comp 能渲染的关键——
  // 缺它则占位描述符只是空转发器,组件永不 mount。
  if (typeof shared.__replayNativeCompConfigs === 'function') {
    shared.__replayNativeCompConfigs(framework)
  }

  // F6 兜底:flush 遗留的 native-comp mount 队列(占位+重放路径下 created 已同步建 Entry,
  // attached 重放时 resolveApp 已能查回 App,此队列通常为空;保留作纵深防御,空队列时无副作用)。
  if (typeof shared.__flushNativeCompQueue === 'function') {
    shared.__flushNativeCompQueue()
  }
}

// 被同步核 require.async 加载时，把 activate 挂到全局供同步核回调。
// 顶层防御：即使全局未初始化（预热早于同步核）也能安全挂载。
(function () {
  var GLOBAL_KEY = __TARO_SHARED_GLOBAL__
  var g = __TARO_GLOBAL_OBJECT__[GLOBAL_KEY] || (__TARO_GLOBAL_OBJECT__[GLOBAL_KEY] = {})
  g.__activateAsync = activate
})()

module.exports = { activate: activate }
