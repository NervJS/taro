/**
 * 方案二 · app-shim —— 占位 framework-runtime + 占位 @tarojs/taro
 *
 * 业务 app.js 产物真实调用序列（顶层同步）：
 *   var o = SHARED["@tarojs/plugin-framework-react/dist/runtime"]
 *   var x = o.createReactApp(App, React, ReactDOM, config)   // 此刻 framework 是占位
 *   x.onLaunch()                                             // 立即调返回对象的 onLaunch
 *   i.initPxTransform({...})                                 // 占位 taro
 *
 * 故占位 createReactApp 必须同步返回一个 appObj（生命周期/mount 全排队），存下 App+config；
 * 真 react 到达后由 provider 用真身 react 重跑 createReactApp，flush 队列。
 */
function install (shared, Current) {
  // 方案一（host）：framework.createReactApp 已是真身 → 无需占位。
  var fwReal = shared['@tarojs/plugin-framework-react/dist/runtime']
  if (fwReal && typeof fwReal.createReactApp === 'function' && !fwReal.__isPlaceholder) {
    shared.__reactAlreadyReal = true
    return
  }

  var realApp = null
  var queue = []
  function whenReal (fn) { realApp ? fn(realApp) : queue.push(fn) }

  var LIFECYCLES = ['onLaunch', 'onShow', 'onHide', 'onError', 'onPageNotFound', 'onUnhandledRejection']
  var placeholderApp = { __isTaroPlaceholder: true }
  LIFECYCLES.forEach(function (name) {
    placeholderApp[name] = function () {
      var args = arguments; var self = this
      whenReal(function (real) { if (typeof real[name] === 'function') real[name].apply(self, args) })
    }
  })
  placeholderApp.mount = function (c, id, cb) { whenReal(function (r) { r.mount(c, id, cb) }) }
  placeholderApp.unmount = function (id, cb) { whenReal(function (r) { r.unmount(id, cb) }) }
  placeholderApp.render = function (cb) { whenReal(function (r) { r.render && r.render(cb) }) }

  Current.app = placeholderApp
  shared.__TARO_placeholderApp = placeholderApp

  // 占位 framework-runtime：mutate 填进 shared 同一对象
  var fwPlaceholder = shared['@tarojs/plugin-framework-react/dist/runtime']
  if (!fwPlaceholder) { fwPlaceholder = {}; shared['@tarojs/plugin-framework-react/dist/runtime'] = fwPlaceholder }
  fwPlaceholder.__isPlaceholder = true
  fwPlaceholder.createReactApp = function (App, _react, _dom, config) {
    // 业务传入的 _react/_dom 是占位，弃用；只捕获 App + config
    shared.__appBootstrap = { App: App, config: config }
    return placeholderApp
  }

  // 占位 @tarojs/taro：initPxTransform 存参
  var taroPlaceholder = shared['@tarojs/taro']
  if (!taroPlaceholder) { taroPlaceholder = {}; shared['@tarojs/taro'] = taroPlaceholder }
  taroPlaceholder.initPxTransform = function (opts) { shared.__pxTransformOpts = opts }

  // provider 就绪后调用：用真身 react 重跑 createReactApp + flush
  shared.__activateReal = function (realFramework) {
    var boot = shared.__appBootstrap
    if (boot) {
      var realAppObj = realFramework.createReactApp(
        boot.App, shared.react, shared['react-dom'], boot.config
      )
      realApp = realAppObj // createReactApp 内部已 Current.app = realAppObj
      shared.__TARO_placeholderApp = null
      var q = queue; queue = []
      q.forEach(function (fn) { fn(realApp) })
    }
  }
}

module.exports = { install: install }
