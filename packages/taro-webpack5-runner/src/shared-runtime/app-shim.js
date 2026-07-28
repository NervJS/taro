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
 *
 * 命令式 API 未就位保护：@tarojs/taro 的命令式 API（getSystemInfoSync/showToast 等）在异步核里，
 * 同步核阶段只是占位。若业务在异步核到位前（尤其模块顶层）同步调用，原本会拿到 undefined 静默失效
 * （`undefined is not a function`）。这里给占位包一层 Proxy：未就位时访问未知成员，
 *   - 打印一条【醒目告警】（含成员名 + 修复建议），驱动业务迁移；每个成员只警告一次，避免刷屏；
 *   - 返回一个【空操作函数】（既可被当函数调用返回 undefined，也可被读属性），不抛错、不崩页面。
 * 关键：绝不 throw —— app.js 初始化早于任何异步加载，抛错会直接崩 app（连 webpack 模块 interop
 * 读 __esModule 都会触发），且会打断业务用 `?.`/`|| {}` 写的容错代码。async-provider fill 真身后，
 * 占位对象的键被真身覆盖，Proxy 陷阱不再触发。
 */

// 占位阶段允许同步访问的成员（业务 app.js 顶层会同步用到，非命令式 API）。
var TARO_PLACEHOLDER_WHITELIST = {
  initPxTransform: true,
  // 内部标记 / 探针可能被读取，放行避免误报
  __isTaroPlaceholder: true,
}

// 框架/JS/webpack 内部属性：模块加载与对象操作会无条件读取这些（非业务命令式 API），一律放行为 undefined。
// 关键：webpack interop helper `__webpack_require__.n` 会读 external 模块的 __esModule/default 判断
// 是否 ES module——这发生在业务顶层 `import ReactDOM/Taro` 时，无关业务是否真调用 API。
var INTERNAL_PASS = {
  __esModule: true,
  default: true,
  then: true, // 模块 interop / thenable 检测
  toString: true,
  valueOf: true,
  toJSON: true, // 对象转换 / 序列化
  constructor: true,
  prototype: true,
  __proto__: true,
  nodeType: true, // 部分序列化/DOM 探测
}

// 空操作函数：既能被当函数调用（返回 undefined），读它的属性也不崩。用于未就位成员的安全回退。
function makeNoop () {
  var noop = function () { return undefined }
  return noop
}

// 给占位对象包 Proxy：未就位时访问未知成员 → 醒目告警（每成员一次）+ 返回空操作函数，绝不抛错。
// realFlag() 返回 true 表示真身已 fill（键已被覆盖），此时不干预、走原生取值。
function guardPlaceholder (target, label, whitelist, realFlag) {
  if (typeof Proxy === 'undefined') return target // 兜底：环境无 Proxy 则退回裸对象
  var warned = {}
  return new Proxy(target, {
    get: function (t, key) {
      if (key in t) return t[key]
      if (typeof key === 'symbol') return undefined
      if (INTERNAL_PASS[key]) return undefined // 框架/webpack 内部属性，放行
      if (whitelist && whitelist[key]) return undefined
      if (realFlag && realFlag()) return undefined // 真身已到位：拼错的 key 走原生 undefined，不干预
      if (!warned[key]) {
        warned[key] = true
        console.warn(
          '[taro-shared] ' + label + '.' + String(key) + ' 尚未就位：' +
          '方案二(split)下命令式 API 在异步核加载完成前（尤其模块顶层）被调用，本次返回空操作、不生效。' +
          '请挪到组件函数体内 / useReady / useEffect / 事件回调，或改用异步版 API；' +
          '也可在宿主用 preloadRule 预下载 shared-async 分包以缩小窗口。'
        )
      }
      return makeNoop() // 返回空操作函数：Taro.getSystemInfoSync?.() → undefined，不崩
    },
  })
}

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

  // 占位 @tarojs/taro：initPxTransform 存参；其余命令式 API 走 guardPlaceholder（未就位时告警+空操作）。
  // async-provider 激活时先置 shared.__rtActivated=true（realFlag 依据），再 fill 真身命令式 API：
  //   - 置位后 provider 自身对 taroObj 的读/写（含读 showToast 判断 initNativeApi）不会误触发保护；
  //   - 业务在异步核到位前（模块顶层/onLoad 早期）的调用此时 __rtActivated 仍为 false → 告警+空操作。
  // 注：install 顶部已对 host 模式 early return，此处只在 split 占位场景执行。
  var taroBase = { initPxTransform: function (opts) { shared.__pxTransformOpts = opts } }
  var taroReady = function () { return !!shared.__rtActivated }
  shared['@tarojs/taro'] = guardPlaceholder(taroBase, 'Taro', TARO_PLACEHOLDER_WHITELIST, taroReady)

  // 占位 react-dom（真身=@tarojs/react reconciler，随异步核到）：同样 Proxy 守护。
  // 正常 Taro 产物顶层不直接调 ReactDOM，仅传给 createReactApp（占位版弃用它）；
  // 守护是为兜住业务顶层直接 ReactDOM.render/createRoot 的边缘写法，给可读报错。
  // 真身由 async-provider fill 进底层对象；激活后 realFlag 放行。
  var reactDomBase = {}
  var reactDomReady = function () { return !!shared.__rtActivated }
  shared['react-dom'] = guardPlaceholder(reactDomBase, 'ReactDOM', null, reactDomReady)

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
