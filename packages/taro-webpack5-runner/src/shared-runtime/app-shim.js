/**
 * 共享运行时（split 模式） · app-shim —— 占位 framework-runtime + 占位 @tarojs/taro
 *
 * 业务 app.js 产物真实调用序列（顶层同步执行）：
 *   var o = SHARED["@tarojs/plugin-framework-react/dist/runtime"]
 *   var x = o.createReactApp(App, React, ReactDOM, config)   // 此刻 framework 是占位
 *   x.onLaunch()                                             // 立即调返回对象的 onLaunch
 *   i.initPxTransform({...})                                 // 占位 taro
 *
 * 故占位 createReactApp 必须同步返回 appObj（生命周期/mount 全排队），存下 App+config；
 * 异步核到达后由 provider 用真身 react 重跑 createReactApp、flush 队列。
 *
 * 命令式 API 未就位保护：@tarojs/taro 命令式 API（getSystemInfoSync/showToast 等）在异步核，
 * 同步核阶段只是占位。业务在异步核到位前（尤其模块顶层）同步调用会拿到 undefined 静默失效。
 * 故给占位包一层 Proxy：未就位时访问未知成员，
 *   - 打印醒目告警（含成员名 + 修复建议），每成员只警告一次，避免刷屏；
 *   - 返回链式安全的空操作值（可当函数调用、可继续读属性/链式调用），不抛错、不崩页面。
 * 关键：绝不 throw —— app.js 初始化早于任何异步加载，抛错会直接崩 app（连 webpack 模块 interop
 * 读 __esModule 都会触发），且会打断业务用 `?.`/`|| {}` 写的容错代码。异步核 fill 真身后，
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

/**
 * 链式安全的空操作值：既能被当函数调用（返回自身），读任意属性也返回自身。
 * 使 `Taro.getSystemInfoSync().screenWidth`、`Taro.a().b().c` 这类未就位链式调用不崩，
 * 全程返回 noop（noop 本身可被 `?.`/`|| {}` 容错）。
 *
 * 关键：基元强制转换（字符串拼接 / 模板串 / Number()）绝不能抛。JS 引擎转对象为基元时会读
 * Symbol.toPrimitive / valueOf / toString，若它们返回非函数（undefined）会抛
 * "Cannot convert object to primitive value" —— 故这几个键必须返回产出基元的函数。
 */
function makeChainableNoop () {
  if (typeof Proxy === 'undefined') {
    // 兜底：环境无 Proxy 则退回裸函数（仅单层安全）
    return function () { return undefined }
  }
  var toEmpty = function () { return '' } // 基元转换回退：统一产出空字符串
  var NOOP // 前置声明：Proxy handler 需在 NOOP 定义前引用它（get/apply 返回自身实现链式）
  var noop = function () { return NOOP }
  NOOP = new Proxy(noop, {
    get: function (_t, key) {
      // 基元强制转换钩子：返回产出空串的函数，保证 '' + NOOP / `${NOOP}` / Number(NOOP) 不抛
      if (key === Symbol.toPrimitive || key === 'toString' || key === 'valueOf') return toEmpty
      // 其余框架/JS 内部属性放行为 undefined，避免干扰 interop（如 then/__esModule 被误判）
      if (INTERNAL_PASS[key]) return undefined
      if (typeof key === 'symbol') return undefined
      return NOOP // 任意属性访问返回自身，支持无限链式
    },
    apply: function () { return NOOP }, // 调用返回自身，支持链式调用
  })
  return NOOP
}

// F6 native-components 占位描述符构造器。
// native-comp 产物顶层同步调 fw.createNativeComponentConfig(Component, react, reactDOM, config)，
// 把返回值传给 WeChat Component() 注册。同步核阶段 framework/reactDOM 是占位，无法立刻建真描述符；
// 故返回一个「形状与真描述符一致」的占位描述符——WeChat 注册所需的
// created/attached/ready/detached/pageLifetimes/methods/properties 全部就位，每个都是 deferred
// 转发器：真描述符（record.realObj）到位则转发到对应方法，否则按调用顺序缓存到 record.pending，
// 异步核到达时由 shared.__replayNativeCompConfigs 用真身重建描述符并按序重放。
//
// 关键：WeChat 要求 Component() 在模块顶层同步调用且描述符形状完整，故不能延迟注册，只能
// 「同步返回占位描述符 + 生命周期延迟到真身」。这是 createReactApp 占位的 native 版对应物。
function makePlaceholderNativeComp (record, componentConfig, Component) {
  // deferred(getReal)：返回转发器——真描述符就绪则调其对应方法，否则按序缓存（生命周期顺序即数组顺序）。
  // 生命周期返回值 WeChat 忽略；onShareAppMessage/onShareTimeline 有返回值但仅用户点击触发（必在
  // 异步核之后，realObj 已就位），故缓存分支丢返回值无害。
  function deferred (getReal) {
    return function () {
      var args = arguments; var self = this
      if (record.realObj) {
        var fn = getReal(record.realObj)
        return typeof fn === 'function' ? fn.apply(self, args) : undefined
      }
      record.pending.push({ getReal: getReal, self: self, args: args })
    }
  }
  var obj = {
    options: componentConfig,
    properties: {
      props: {
        type: null,
        value: null,
        observer: deferred(function (r) { return r.properties && r.properties.props && r.properties.props.observer }),
      },
    },
    created: deferred(function (r) { return r.created }),
    attached: deferred(function (r) { return r.attached }),
    ready: deferred(function (r) { return r.ready }),
    detached: deferred(function (r) { return r.detached }),
    pageLifetimes: {
      show: deferred(function (r) { return r.pageLifetimes && r.pageLifetimes.show }),
      hide: deferred(function (r) { return r.pageLifetimes && r.pageLifetimes.hide }),
    },
    methods: {
      eh: deferred(function (r) { return r.methods && r.methods.eh }),
      onLoad: deferred(function (r) { return r.methods && r.methods.onLoad }),
      onUnload: deferred(function (r) { return r.methods && r.methods.onUnload }),
    },
  }
  // 分享生命周期：真描述符按 Component 声明条件添加；占位期用同一条件补 deferred 转发器，
  // 保证 WeChat 注册时右上角分享按钮选项与真身一致（否则真身到位也补不回注册期已定的选项）。
  var hasShareMsg = Component && (Component.onShareAppMessage || (Component.prototype && Component.prototype.onShareAppMessage) || Component.enableShareAppMessage)
  if (hasShareMsg) {
    obj.methods.onShareAppMessage = deferred(function (r) { return r.methods && r.methods.onShareAppMessage })
  }
  var hasShareTimeline = Component && (Component.onShareTimeline || (Component.prototype && Component.prototype.onShareTimeline) || Component.enableShareTimeline)
  if (hasShareTimeline) {
    obj.methods.onShareTimeline = deferred(function (r) { return r.methods && r.methods.onShareTimeline })
  }
  // 支付宝别名：真描述符在 alipay 下设 onInit/didMount/didUpdate/didUnmount。占位期同 gate 补转发器。
  // process.env.TARO_ENV 由 build-shared-runtime 的 DefinePlugin 注入，非 alipay 时整段被 DCE 移除。
  if (process.env.TARO_ENV === 'alipay') {
    obj.onInit = deferred(function (r) { return r.onInit })
    obj.didMount = deferred(function (r) { return r.didMount })
    obj.didUpdate = deferred(function (r) { return r.didUpdate })
    obj.didUnmount = deferred(function (r) { return r.didUnmount })
  }
  return obj
}

// 给占位对象包 Proxy：未就位时访问未知成员 → 醒目告警（每成员一次）+ 返回链式安全空操作，绝不抛错。
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
          '共享运行时下命令式 API 在运行时核加载完成前（尤其模块顶层）被调用，本次返回空操作、不生效。' +
          '请挪到组件函数体内 / useReady / useEffect / 事件回调，或改用异步版 API；' +
          '也可在宿主用 preloadRule 预下载运行时分包以缩小窗口。'
        )
      }
      return makeChainableNoop() // 返回链式安全空操作：Taro.getSystemInfoSync().x 不崩
    },
  })
}

function install (shared, Current) {
  // 纵深防御：即使 entry.sync 的 __syncCoreInstalled 守卫被绕过（如 install 被直接调用），
  // 也不重复覆盖 Current.app / 占位对象。首包胜出的架构约束见 entry.sync.js 顶部说明。
  if (shared.__appShimInstalled) return
  shared.__appShimInstalled = true

  var realApp = null
  var queue = []
  function whenReal (fn) { realApp ? fn(realApp) : queue.push(fn) }

  var LIFECYCLES = ['onLaunch', 'onShow', 'onHide', 'onError', 'onPageNotFound', 'onUnhandledRejection']
  var placeholderApp = { __isTaroPlaceholder: true }
  LIFECYCLES.forEach(function (name) {
    placeholderApp[name] = function () {
      var args = arguments; var self = this
      whenReal(function (real) {
        if (typeof real[name] !== 'function') return
        // blended/newBlended 模式下 taro-loader 生成的是无参 `app.onLaunch()`（见本文件头文档
        // 与 taro-loader/src/app.ts）。vanilla 下它在任何页面 onLoad 之前同步执行，其真身 ONLAUNCH
        // 内部无条件 `setRouterParams(undefined)` 设的空路由（{params:undefined}）必然被后续页面
        // onLoad 的 setCurrentRouter 用真实参数覆盖，无害。但共享运行时把这次调用推迟进 queue，
        // 与页面 mount 一起等异步核就位后 flush，且 onLaunch 排在 mount 前 → 变成"页面 onLoad 已
        // 用真实参数设好 Current.router → onLaunch 重放用 undefined 覆盖回空 → 才 mount 渲染，
        // useRouter() 读到 {params:undefined} → Object.keys(undefined) 崩"。
        // 修复：仅 onLaunch 且本次确实无参（精确匹配该过场调用，不碰任何传参场景）时，重放前后
        // 比对 Current.router——若重放把已存在的真实路由污染成 params===undefined，则还原。
        if (name === 'onLaunch' && args.length === 0 && Current) {
          var routerBefore = Current.router
          real[name].apply(self, args)
          var routerAfter = Current.router
          if (routerBefore && routerBefore.params !== undefined &&
              routerAfter && routerAfter.params === undefined) {
            Current.router = routerBefore
          }
          return
        }
        real[name].apply(self, args)
      })
    }
  })
  placeholderApp.mount = function (c, id, cb) { whenReal(function (r) { r.mount(c, id, cb) }) }
  placeholderApp.unmount = function (id, cb) { whenReal(function (r) { r.unmount(id, cb) }) }
  placeholderApp.render = function (cb) { whenReal(function (r) { r.render && r.render(cb) }) }

  Current.app = placeholderApp
  shared.__TARO_placeholderApp = placeholderApp

  // 占位 framework-runtime：mutate 填进 shared 同一对象（保引用，真身到达后原地覆盖）
  var fwPlaceholder = shared['@tarojs/plugin-framework-react/dist/runtime']
  if (!fwPlaceholder) { fwPlaceholder = {}; shared['@tarojs/plugin-framework-react/dist/runtime'] = fwPlaceholder }
  fwPlaceholder.__isPlaceholder = true
  fwPlaceholder.createReactApp = function (App, _react, _dom, config) {
    // 业务传入的 _react/_dom 是占位，弃用；只捕获 App + config。
    // 多业务包 last-writer 语义：后加载的业务包会覆盖 __appBootstrap 与最终 Current.app，
    // 与 Taro 单份 runtime 内 framework `createReactApp` 无守卫赋值的原生行为一致
    // （见 packages/taro-framework-react/src/runtime/connect.ts:434 `Current.app = appObj`)。
    //
    // F5 多包 App 隔离：同时记 pkgId，__activateReal 建 realApp 后按 pkgId 存进 __pkgApps 表，
    // 供 page loader 每次 onLoad 前查回本包 App（即使 Current.app 被 last-writer 换走，
    // 本包页面 mount 前仍能恢复到本包 App)。pkgId 由 app loader 顶部注入 shared.__currentPkgId。
    shared.__appBootstrap = {
      App: App,
      config: config,
      pkgId: shared.__currentPkgId,
    }
    return placeholderApp
  }

  // F6 native-components 占位：native-comp 产物顶层同步调 createNativeComponentConfig 建描述符传给
  // Component()。同步核阶段无法建真描述符（reactDOM/framework 是占位），故返回占位描述符（形状完整、
  // 生命周期延迟转发），并把 record 登记到 shared.__nativeCompConfigs；异步核到位后 replay 用真身重建。
  shared.__nativeCompConfigs = shared.__nativeCompConfigs || []
  fwPlaceholder.createNativeComponentConfig = function (Component, _react, _reactDom, componentConfig) {
    var record = { Component: Component, config: componentConfig, realObj: null, pending: [] }
    shared.__nativeCompConfigs.push(record)
    return makePlaceholderNativeComp(record, componentConfig, Component)
  }

  // 异步核 fill 真身后调用：用真身 framework.createNativeComponentConfig 为每个已注册的 native-comp
  // 建真描述符，存入 record.realObj，并按调用顺序重放占位期缓存的生命周期调用（created→attached→…)。
  // 真身 reactDOM 走 shared['react-dom']（已被 provider fill)；react 走同步核的 shared.react。
  shared.__replayNativeCompConfigs = function (realFramework) {
    if (typeof realFramework.createNativeComponentConfig !== 'function') return
    var records = shared.__nativeCompConfigs || []
    records.forEach(function (record) {
      if (record.realObj) return
      record.realObj = realFramework.createNativeComponentConfig(
        record.Component, shared.react, shared['react-dom'], record.config
      )
      var pending = record.pending; record.pending = []
      pending.forEach(function (call) {
        var fn = call.getReal(record.realObj)
        if (typeof fn === 'function') fn.apply(call.self, call.args)
      })
    })
  }

  // 占位 @tarojs/taro：initPxTransform 存参；其余命令式 API 走 guardPlaceholder（未就位时告警+空操作）。
  // 异步核激活时先置 shared.__rtActivated=true（realFlag 依据），再 fill 真身命令式 API：
  //   - 置位后 provider 自身对 taroObj 的读/写（含读 showToast 判断 initNativeApi）不会误触发保护；
  //   - 业务在异步核到位前（模块顶层/onLoad 早期）的调用此时 __rtActivated 仍为 false → 告警+空操作。
  var taroBase = { initPxTransform: function (opts) { shared.__pxTransformOpts = opts } }
  var taroReady = function () { return !!shared.__rtActivated }
  shared['@tarojs/taro'] = guardPlaceholder(taroBase, 'Taro', TARO_PLACEHOLDER_WHITELIST, taroReady)

  // 占位 react-dom（真身=@tarojs/react reconciler，随异步核到）：同样 Proxy 守护。
  // 正常 Taro 产物顶层不直接调 ReactDOM，仅传给 createReactApp（占位版弃用它）；
  // 守护是为兜住业务顶层直接 ReactDOM.render/createRoot 的边缘写法，给可读告警。
  var reactDomBase = {}
  var reactDomReady = function () { return !!shared.__rtActivated }
  shared['react-dom'] = guardPlaceholder(reactDomBase, 'ReactDOM', null, reactDomReady)

  // provider 就绪后调用：用真身 framework 重跑 createReactApp + flush 队列。
  shared.__activateReal = function (realFramework) {
    var boot = shared.__appBootstrap
    if (!boot) return
    var realAppObj = realFramework.createReactApp(
      boot.App, shared.react, shared['react-dom'], boot.config
    )
    realApp = realAppObj // createReactApp 内部已 Current.app = realAppObj
    shared.__TARO_placeholderApp = null
    // F5 多包 App 隔离：按 pkgId 存表，供 page loader 每次 onLoad 前查回本包 App。
    if (boot.pkgId) {
      shared.__pkgApps = shared.__pkgApps || {}
      shared.__pkgApps[boot.pkgId] = realAppObj
    }
    var q = queue; queue = []
    q.forEach(function (fn) { fn(realApp) })
  }
}

module.exports = { install: install }
// 导出纯函数供单测（不影响运行时使用；模板仍只调 install）
module.exports.makeChainableNoop = makeChainableNoop
module.exports.guardPlaceholder = guardPlaceholder
