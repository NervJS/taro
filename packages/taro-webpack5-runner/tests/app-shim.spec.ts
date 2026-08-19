import { describe, expect, it, vi } from 'vitest'

import { guardPlaceholder, install, makeChainableNoop } from '../src/shared-runtime/app-shim'

describe('makeChainableNoop（P3：未就位命令式 API 链式调用不崩）', () => {
  it('可被当函数调用', () => {
    const noop = makeChainableNoop()
    expect(() => noop()).not.toThrow()
  })

  it('调用后可继续读属性（Taro.getSystemInfoSync().screenWidth 不崩）', () => {
    const noop = makeChainableNoop()
    expect(() => noop().screenWidth).not.toThrow()
    expect(() => noop().a.b.c).not.toThrow()
  })

  it('支持无限链式调用（Taro.a().b().c() 不崩）', () => {
    const noop = makeChainableNoop()
    expect(() => noop().a().b().c()).not.toThrow()
  })

  it('内部/interop 属性返回 undefined，不干扰模块 interop', () => {
    const noop = makeChainableNoop()
    expect(noop.__esModule).toBeUndefined()
    expect(noop.then).toBeUndefined()
  })

  it('基元强制转换不抛错（字符串拼接/模板串/Number）', () => {
    const noop = makeChainableNoop()
    // 链式结果被基元转换：'w=' + Taro.getSystemInfoSync().screenWidth 不崩
    expect(() => 'w=' + noop().screenWidth).not.toThrow()
    expect(() => `${noop()}`).not.toThrow()
    expect(() => Number(noop())).not.toThrow()
    expect(() => String(noop().a.b)).not.toThrow()
  })
})

describe('guardPlaceholder（未就位保护：告警 + 空操作，绝不抛错）', () => {
  it('访问未知命令式 API：告警一次 + 返回链式安全空操作', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const taro = guardPlaceholder({ initPxTransform: () => {} }, 'Taro', { initPxTransform: true }, () => false)

    // 未就位调用命令式 API 不抛错
    expect(() => taro.showToast({ title: 'x' })).not.toThrow()
    // 链式也不崩
    expect(() => taro.getSystemInfoSync().screenWidth).not.toThrow()

    // 同一成员重复访问只告警一次（showToast 已在上面告警过）
    warn.mockClear()
    taro.showToast()
    taro.showToast()
    expect(warn).not.toHaveBeenCalled()

    warn.mockRestore()
  })

  it('已存在的成员正常返回，不告警', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const fn = vi.fn()
    const taro = guardPlaceholder({ initPxTransform: fn }, 'Taro', { initPxTransform: true }, () => false)
    taro.initPxTransform({ designWidth: 750 })
    expect(fn).toHaveBeenCalled()
    expect(warn).not.toHaveBeenCalled()
    warn.mockRestore()
  })

  it('真身已就位（realFlag=true）：未知 key 走原生 undefined，不告警不干预', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const taro = guardPlaceholder({}, 'Taro', null, () => true)
    expect(taro.someTypo).toBeUndefined()
    expect(warn).not.toHaveBeenCalled()
    warn.mockRestore()
  })
})

describe('install 幂等（F2:多业务包不覆盖首包 Current.app）', () => {
  it('首次 install：正常装占位,__appShimInstalled 置位', () => {
    const shared: any = {}
    const Current: any = { app: null }
    install(shared, Current)
    expect(shared.__appShimInstalled).toBe(true)
    expect(shared['@tarojs/plugin-framework-react/dist/runtime']).toBeDefined()
    expect(shared['@tarojs/taro']).toBeDefined()
    expect(shared['react-dom']).toBeDefined()
    // Current.app 被设为占位（有 __isTaroPlaceholder 标记）
    expect(Current.app.__isTaroPlaceholder).toBe(true)
  })

  it('已装状态下再调 install：整体早退,不覆盖已存在的 Current.app（多包场景核心）', () => {
    // 模拟首包已装并激活的状态
    const firstRealApp = { name: 'firstBusinessPkgApp', __isReal: true }
    const shared: any = {
      __appShimInstalled: true, // 首包已装的标记
      __rtActivated: true,
      '@tarojs/plugin-framework-react/dist/runtime': { createReactApp: () => firstRealApp },
      '@tarojs/taro': { existing: true },
      'react-dom': { existing: true },
    }
    const Current: any = { app: firstRealApp }

    // 第二包 require 同步核 → 若绕过 entry.sync 的守卫直接调 install（纵深防御场景）
    install(shared, Current)

    // Current.app 未被覆盖回占位
    expect(Current.app).toBe(firstRealApp)
    expect(Current.app.__isReal).toBe(true)
    // 已有占位对象未被替换/清空
    expect(shared['@tarojs/taro'].existing).toBe(true)
    expect(shared['react-dom'].existing).toBe(true)
  })

  it('last-writer:createReactApp 两次调用(A 后 B),__appBootstrap 保留 B', () => {
    // 场景:pkg A app.js 顶层 createReactApp(App_A);随后 pkg B 调用 createReactApp(App_B)。
    // last-writer 语义:后到者覆盖 __appBootstrap,与 Taro 单份 runtime 里 framework
    // createReactApp 原生行为一致(Current.app = appObj 无守卫赋值)。
    const shared: any = {}
    const Current: any = { app: null }
    install(shared, Current)

    const fwPlaceholder = shared['@tarojs/plugin-framework-react/dist/runtime']
    const App_A = { tag: 'A' }
    const App_B = { tag: 'B' }
    const config_A = { pages: ['A/index'] }
    const config_B = { pages: ['B/index'] }

    // pkg A 先调
    const app1 = fwPlaceholder.createReactApp(App_A, null, null, config_A)
    expect(shared.__appBootstrap.App).toBe(App_A)
    expect(shared.__appBootstrap.config).toBe(config_A)

    // pkg B 后调:__appBootstrap 应被 B 覆盖(last-writer)
    const app2 = fwPlaceholder.createReactApp(App_B, null, null, config_B)
    expect(shared.__appBootstrap.App).toBe(App_B) // 关键:变成 B
    expect(shared.__appBootstrap.config).toBe(config_B) // 关键:变成 B
    // 两次调用返回同一个 placeholderApp(占位对象是 install 一次装的共享实例)
    expect(app1).toBe(app2)
  })

  it('F5 pkgApps:createReactApp 存 pkgId,__activateReal 按 pkgId 存表', () => {
    // 场景:pkg A app.js 顶部注入 __currentPkgId='A' 后调 createReactApp;pkg B 同理但 pkgId='B'。
    // 每次 __activateReal 应把 realApp 存进 shared.__pkgApps[pkgId],两个 key 独立不覆盖。
    const shared: any = {}
    const Current: any = { app: null }
    install(shared, Current)

    // 模拟 pkg A app.js 顶部注入 pkgId
    shared.__currentPkgId = 'A'
    const fwPlaceholder = shared['@tarojs/plugin-framework-react/dist/runtime']
    fwPlaceholder.createReactApp({ tag: 'App_A' }, null, null, { pages: ['A/index'] })
    expect(shared.__appBootstrap.pkgId).toBe('A')

    // 模拟异步核激活(mock realFramework 建 realApp_A)
    const realApp_A = { tag: 'real_A' }
    const mockRealFramework = { createReactApp: () => realApp_A }
    shared.__activateReal(mockRealFramework)
    expect(shared.__pkgApps.A).toBe(realApp_A) // A 存表
  })

  it('F5 pkgApps:两包独立存表,不互相覆盖(隔离维度关键断言)', () => {
    // 场景:同一宿主内 A 与 B 两包分别 activate。虽然 Current.app 是 last-writer,
    // __pkgApps 表两个 key 应各自保留 realApp,供 page loader onLoad 前查回。
    const sharedA: any = {}
    const CurrentA: any = { app: null }
    install(sharedA, CurrentA)

    // pkg A activate
    sharedA.__currentPkgId = 'pkg-a'
    sharedA['@tarojs/plugin-framework-react/dist/runtime'].createReactApp({ tag: 'A' }, null, null, {})
    const realApp_A = { name: 'realA' }
    sharedA.__activateReal({ createReactApp: () => realApp_A })
    expect(sharedA.__pkgApps['pkg-a']).toBe(realApp_A)

    // 模拟 pkg B 之后 activate(共享同一 shared 对象——因幂等 install 早退,
    // 但 __appBootstrap/__pkgApps 由业务代码直接写,不受 install 幂等影响)
    sharedA.__currentPkgId = 'pkg-b'
    sharedA['@tarojs/plugin-framework-react/dist/runtime'].createReactApp({ tag: 'B' }, null, null, {})
    const realApp_B = { name: 'realB' }
    sharedA.__activateReal({ createReactApp: () => realApp_B })
    expect(sharedA.__pkgApps['pkg-b']).toBe(realApp_B)

    // 关键:pkg-a 的 realApp 未被覆盖(隔离维度)
    expect(sharedA.__pkgApps['pkg-a']).toBe(realApp_A)
    expect(sharedA.__pkgApps['pkg-a']).not.toBe(realApp_B)
  })
})

describe('F6 native-comp 占位 createNativeComponentConfig（真机崩溃回归）', () => {
  it('同步核阶段 createNativeComponentConfig 必须可同步调用（不再 undefined 崩溃）', () => {
    // 真机崩溃根因:native-comp 产物顶层同步调 fw.createNativeComponentConfig,
    // 而占位 framework 只装了 createReactApp → undefined → 崩。修复后必须可同步调。
    const shared: any = {}
    const Current: any = { app: null }
    install(shared, Current)
    const fw = shared['@tarojs/plugin-framework-react/dist/runtime']
    expect(typeof fw.createNativeComponentConfig).toBe('function')
  })

  it('返回 WeChat Component() 所需形状的占位描述符（同步注册不崩）', () => {
    const shared: any = {}
    install(shared, { app: null })
    const fw = shared['@tarojs/plugin-framework-react/dist/runtime']
    const Component = function () {}
    const obj = fw.createNativeComponentConfig(Component, null, null, { isNativeShared: true, pkgId: 'p' })
    // WeChat 注册所需字段齐全且为函数/对象,可安全传给 Component()
    expect(typeof obj.created).toBe('function')
    expect(typeof obj.attached).toBe('function')
    expect(typeof obj.ready).toBe('function')
    expect(typeof obj.detached).toBe('function')
    expect(typeof obj.pageLifetimes.show).toBe('function')
    expect(typeof obj.methods.onLoad).toBe('function')
    expect(obj.options).toEqual({ isNativeShared: true, pkgId: 'p' })
    // 占位期调用生命周期不抛错(真身未就位则缓存)
    expect(() => obj.created.call({})).not.toThrow()
    expect(() => obj.attached.call({})).not.toThrow()
  })

  it('异步核到位后 replay:用真身重建描述符 + 按序重放缓存的生命周期', () => {
    const shared: any = {}
    install(shared, { app: null })
    const fw = shared['@tarojs/plugin-framework-react/dist/runtime']
    const Component = function () {}
    const placeholder = fw.createNativeComponentConfig(Component, null, null, { pkgId: 'p' })

    // 占位期:业务组件 created → attached 被调(真身未就位 → 缓存)
    const ctxCreated: any = { phase: 'created' }
    const ctxAttached: any = { phase: 'attached' }
    placeholder.created.call(ctxCreated)
    placeholder.attached.call(ctxAttached)

    // 构造真身 framework:createNativeComponentConfig 返回记录调用顺序的真描述符
    const callOrder: string[] = []
    const realObj = {
      created () { callOrder.push('created:' + this.phase) },
      attached () { callOrder.push('attached:' + this.phase) },
      ready () {},
      detached () {},
      pageLifetimes: { show () {}, hide () {} },
      methods: { eh () {}, onLoad () {}, onUnload () {} },
    }
    const realFramework = { createNativeComponentConfig: () => realObj }

    // 异步核 activate 时调 replay
    shared.__replayNativeCompConfigs(realFramework)

    // 关键:缓存的 created/attached 按序重放,且 this 绑定正确(带回各自 ctx)
    expect(callOrder).toEqual(['created:created', 'attached:attached'])

    // replay 后真身就位:后续生命周期直接转发到真身,不再缓存
    callOrder.length = 0
    const ctxReady: any = { phase: 'ready-late' }
    placeholder.ready.call(ctxReady) // realObj.ready 是 noop,不 push;验证不抛错即可
    expect(() => placeholder.detached.call({})).not.toThrow()
  })

  it('replay 幂等:record.realObj 已建则跳过,不重复建描述符', () => {
    const shared: any = {}
    install(shared, { app: null })
    const fw = shared['@tarojs/plugin-framework-react/dist/runtime']
    fw.createNativeComponentConfig(function () {}, null, null, {})

    let buildCount = 0
    const realFramework = {
      createNativeComponentConfig: () => { buildCount++; return { methods: {}, pageLifetimes: {} } },
    }
    shared.__replayNativeCompConfigs(realFramework)
    shared.__replayNativeCompConfigs(realFramework) // 再调一次
    expect(buildCount).toBe(1) // 只建一次
  })
})

describe('blended 无参 onLaunch 重放不污染已就位路由（useRouter().params 崩溃回归）', () => {
  // 真机崩溃根因:blended/newBlended 模式 taro-loader 生成无参 `app.onLaunch()`。共享运行时把它
  // 推迟进 queue，与页面 mount 一起等异步核就位后 flush，且 onLaunch 排在 mount 前。若页面 onLoad
  // 已用真实参数经 setCurrentRouter 设好 Current.router，onLaunch 重放的真身 ONLAUNCH 内部无条件
  // setRouterParams(undefined) 会把它覆盖成 {params:undefined} → 之后 mount 渲染 useRouter() 读到
  // 空态 → Object.keys(undefined) 崩。修复:无参 onLaunch 重放若把已存在真实路由污染成
  // params===undefined，则还原。
  //
  // 真身 ONLAUNCH 的可观察副作用即 setRouterParams(options)：options 为 undefined 时
  // Current.router = { params: undefined }。下面 mock 真身 onLaunch 复刻这一行为。
  // __activateReal(realFramework) 的入参是 framework（含 createReactApp），realApp 是其返回值。
  // queue 里的 onLaunch 转发拿到的 real 即该 realApp。真身 ONLAUNCH 的可观察副作用是
  // setRouterParams(options)：options 为 undefined 时 Current.router = { params: undefined }。
  // 下面 mock 的 realApp.onLaunch 复刻这一行为。
  function makeRealFramework (Current: any) {
    return {
      createReactApp () {
        return {
          __isReal: true,
          onLaunch (options?: any) { Current.router = { params: options?.query } },
          mount () {},
          unmount () {},
        }
      },
    }
  }

  it('页面已设真实路由后，无参 onLaunch 重放不覆盖（还原为真实值）', () => {
    const shared: any = {}
    const Current: any = { app: null, router: null }
    install(shared, Current)

    const fw = shared['@tarojs/plugin-framework-react/dist/runtime']
    fw.createReactApp({ tag: 'App' }, null, null, {})

    // 占位阶段：业务 app.js 顶层无参调 onLaunch()（进 queue，未执行）
    Current.app.onLaunch()
    // 页面 onLoad 先跑：setCurrentRouter 用真实参数设置路由
    Current.router = { params: { id: '123', __type: 'detail' }, path: '/pages/index/index' }

    // 异步核就位：flush queue（重放无参 onLaunch → 真身 setRouterParams(undefined)）
    shared.__activateReal(makeRealFramework(Current))

    // 关键：真实路由未被污染
    expect(Current.router.params).toEqual({ id: '123', __type: 'detail' })
    expect(Current.router.params).not.toBeUndefined()
  })

  it('页面尚未设路由（初始 null）时，无参 onLaunch 重放不还原（与 vanilla 语义一致）', () => {
    const shared: any = {}
    const Current: any = { app: null, router: null }
    install(shared, Current)

    const fw = shared['@tarojs/plugin-framework-react/dist/runtime']
    fw.createReactApp({ tag: 'App' }, null, null, {})

    // 占位阶段无参 onLaunch，且页面还没跑（router 仍是初始 null）
    Current.app.onLaunch()
    shared.__activateReal(makeRealFramework(Current))

    // routerBefore 是 null（params 非"真实值"），不触发还原：保留真身设置结果，
    // 后续页面 onLoad 会用 setCurrentRouter 覆盖，语义与 vanilla 一致，无副作用。
    expect(Current.router).toEqual({ params: undefined })
  })

  it('有参 onLaunch 调用不受收窄逻辑影响（正常传参场景照常覆盖）', () => {
    const shared: any = {}
    const Current: any = { app: null, router: null }
    install(shared, Current)

    const fw = shared['@tarojs/plugin-framework-react/dist/runtime']
    fw.createReactApp({ tag: 'App' }, null, null, {})

    // 页面已设路由
    Current.router = { params: { old: '1' } }
    // 带参 onLaunch（args.length>0，不匹配收窄条件）：应照常走真身
    Current.app.onLaunch({ query: { fresh: '2' } })
    shared.__activateReal(makeRealFramework(Current))

    // 带参场景：真身 setRouterParams({query:{fresh:'2'}}) 正常生效
    expect(Current.router.params).toEqual({ fresh: '2' })
  })
})

