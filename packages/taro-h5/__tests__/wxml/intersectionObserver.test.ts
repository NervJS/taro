import { Current } from '@tarojs/runtime'

import { TaroH5IntersectionObserver } from '../../src/api/wxml/IntersectionObserver'

jest.mock('../../src/utils', () => ({
  // 与框架 getDOMNode hook 行为一致：传元素返回元素本身，不传回 document
  findDOM: (inst?: any) => inst ?? document
}))

const nextTick = () => new Promise<void>(resolve => setTimeout(resolve, 200))

describe('IntersectionObserver', () => {
  let observeMock: jest.Mock
  let unobserveMock: jest.Mock
  let disconnectMock: jest.Mock
  let lastOptions: IntersectionObserverInit | undefined
  let lastCallback: (entries: any[]) => void
  let warnSpy: jest.SpyInstance

  const fakeEntry = (target: Element, intersectionRatio: number) => ({
    target,
    intersectionRatio,
    boundingClientRect: {},
    intersectionRect: {},
    rootBounds: null
  })

  beforeEach(() => {
    observeMock = jest.fn()
    unobserveMock = jest.fn()
    disconnectMock = jest.fn()
    lastOptions = undefined
    lastCallback = () => {}

    class MockIntersectionObserver {
      constructor (cb: any, options: any) {
        lastCallback = cb
        lastOptions = options
      }

      observe = observeMock
      unobserve = unobserveMock
      disconnect = disconnectMock
      takeRecords () { return [] }
    }
    (globalThis as any).IntersectionObserver = MockIntersectionObserver

    document.body.innerHTML = ''
    ;(window as any).__taroAppConfig = undefined
    ;(Current as any).page = null
    warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {})
  })

  afterEach(() => {
    warnSpy.mockRestore()
  })

  afterAll(() => {
    delete (globalThis as any).IntersectionObserver
  })

  test('observe 支持 container 自身命中（scope 传元素自身）', async () => {
    document.body.innerHTML = '<div id="wrapper"><div id="target"></div></div>'
    ;(window as any).__taroAppConfig = { usingWindowScroll: true }
    const target = document.getElementById('target')!
    const observer = new TaroH5IntersectionObserver(target as any, { thresholds: [0.5] })
    const cb = jest.fn()
    observer.relativeToViewport().observe('#target', cb)

    await nextTick()

    expect(observeMock).toHaveBeenCalledTimes(1)
    expect(observeMock).toHaveBeenCalledWith(target)
  })

  test('observe 查不到目标时输出 warn 且不观察', async () => {
    document.body.innerHTML = '<div id="wrapper"><div id="target"></div></div>'
    ;(window as any).__taroAppConfig = { usingWindowScroll: true }
    const observer = new TaroH5IntersectionObserver(null as any, {})
    observer.relativeToViewport().observe('#missing', jest.fn())

    await nextTick()

    expect(observeMock).not.toHaveBeenCalled()
    expect(warnSpy).toHaveBeenCalledWith(
      'IntersectionObserver.observe:fail cannot find the node for selector "#missing"'
    )
  })

  test('observe 后立即 disconnect，nextTick 回调不再观察', async () => {
    document.body.innerHTML = '<div id="wrapper"><div id="target"></div></div>'
    ;(window as any).__taroAppConfig = { usingWindowScroll: true }
    const observer = new TaroH5IntersectionObserver(null as any, {})
    observer.relativeToViewport().observe('#target', jest.fn())
    observer.disconnect()

    await nextTick()

    expect(observeMock).not.toHaveBeenCalled()
  })

  test('relativeToViewport 默认模式参照当前页 .taro_page', () => {
    (Current as any).page = { path: '/pages/index/index?stamp=0' }
    document.body.innerHTML = `
      <div class="taro_router">
        <div id="/pages/index/index?stamp=0" class="taro_page taro_page_show" style="overflow-y: scroll;"></div>
      </div>`
    const observer = new TaroH5IntersectionObserver(null as any, {})
    observer.relativeToViewport()

    expect(lastOptions?.root).toBe(document.querySelector('.taro_page'))
  })

  test('relativeToViewport usingWindowScroll 模式参照浏览器视口（root 为 null）', () => {
    (window as any).__taroAppConfig = { usingWindowScroll: true }
    ;(Current as any).page = { path: '/pages/index/index' }
    document.body.innerHTML = `
      <div class="taro_router">
        <div id="/pages/index/index" class="taro_page taro_page_show"></div>
      </div>`
    const observer = new TaroH5IntersectionObserver(null as any, {})
    observer.relativeToViewport()

    expect(lastOptions?.root).toBeNull()
  })

  test('relativeToViewport 页面元素无滚动样式时参照浏览器视口（windowScroll 兜底判断）', () => {
    (Current as any).page = { path: '/pages/index/index' }
    document.body.innerHTML = `
      <div class="taro_router">
        <div id="/pages/index/index" class="taro_page taro_page_show"></div>
      </div>`
    const observer = new TaroH5IntersectionObserver(null as any, {})
    observer.relativeToViewport()

    expect(lastOptions?.root).toBeNull()
  })

  test('relativeToViewport 无法按 path 命中时，fallback 取最后一个非 shade 页面', () => {
    document.body.innerHTML = `
      <div class="taro_router">
        <div id="page-1" class="taro_page taro_page_show taro_page_shade" style="overflow-y: scroll;"></div>
        <div id="page-2" class="taro_page taro_page_show" style="overflow-y: scroll;"></div>
      </div>`
    const observer = new TaroH5IntersectionObserver(null as any, {})
    observer.relativeToViewport()

    expect(lastOptions?.root).toBe(document.getElementById('page-2'))
  })

  test('relativeTo 查不到参照节点时输出 warn 并回退视口', () => {
    const observer = new TaroH5IntersectionObserver(null as any, {})
    observer.relativeTo('#missing')

    expect(warnSpy).toHaveBeenCalledWith(
      'IntersectionObserver.relativeTo:fail cannot find the node for selector "#missing"'
    )
    expect(lastOptions?.root).toBeNull()
  })

  test('回调透传：首帧跨过 threshold 触发，后续继续触发', async () => {
    document.body.innerHTML = '<div id="wrapper"><div id="target"></div></div>'
    ;(window as any).__taroAppConfig = { usingWindowScroll: true }
    const observer = new TaroH5IntersectionObserver(null as any, { thresholds: [0.5] })
    const cb = jest.fn()
    const target = document.getElementById('target')!
    observer.relativeToViewport().observe('#target', cb)

    await nextTick()

    lastCallback([fakeEntry(target, 1)])
    expect(cb).toHaveBeenCalledTimes(1)
    expect(cb.mock.calls[0][0].id).toBe('target')

    lastCallback([fakeEntry(target, 0.6)])
    expect(cb).toHaveBeenCalledTimes(2)
  })

  test('首帧未跨过 threshold 时仍按 initialRatio 语义被过滤', async () => {
    document.body.innerHTML = '<div id="wrapper"><div id="target"></div></div>'
    ;(window as any).__taroAppConfig = { usingWindowScroll: true }
    const observer = new TaroH5IntersectionObserver(null as any, { thresholds: [0.5] })
    const cb = jest.fn()
    const target = document.getElementById('target')!
    observer.relativeToViewport().observe('#target', cb)

    await nextTick()

    // 首帧 ratio=0 与 initialRatio=0 相等，应被过滤（对齐微信小程序）
    lastCallback([fakeEntry(target, 0)])
    expect(cb).not.toHaveBeenCalled()

    // 后续跨过阈值正常触发
    lastCallback([fakeEntry(target, 0.7)])
    expect(cb).toHaveBeenCalledTimes(1)
  })
})
