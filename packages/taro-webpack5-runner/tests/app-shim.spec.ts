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
