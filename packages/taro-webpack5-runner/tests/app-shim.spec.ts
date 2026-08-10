import { describe, expect, it, vi } from 'vitest'

import { guardPlaceholder, makeChainableNoop } from '../src/shared-runtime/app-shim'

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
