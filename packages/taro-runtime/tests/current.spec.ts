import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'

import { Current, getCurrentInstance } from '../src/current'

describe('getCurrentInstance', () => {
  const fakeApp = { __app: true }
  const fakeRouter = { path: '/pages/index', $taroPath: '0' } as any
  const fakePage = { __page: true } as any

  beforeEach(() => {
    Current.app = fakeApp as any
    Current.router = fakeRouter
    Current.page = fakePage
    Current.preloadData = undefined
  })

  afterEach(() => {
    Current.app = null
    Current.router = null
    Current.page = null
    Current.preloadData = undefined
    vi.unstubAllGlobals()
  })

  test('returns global Current when getCurrentPage is undefined', () => {
    expect(getCurrentInstance()).toBe(Current)
  })

  test('returns global Current when getCurrentPage throws', () => {
    vi.stubGlobal('getCurrentPage', () => { throw new Error('boom') })
    expect(getCurrentInstance()).toBe(Current)
  })

  test('returns global Current when current page is not frameset-enabled', () => {
    vi.stubGlobal('getCurrentPage', () => ({ _isFramesetEnabled: false }))
    expect(getCurrentInstance()).toBe(Current)
  })

  test('returns global Current when _isFramesetEnabled is missing', () => {
    vi.stubGlobal('getCurrentPage', () => ({}))
    expect(getCurrentInstance()).toBe(Current)
  })

  test('creates and caches a snapshot on first frameset access', () => {
    const page: any = { _isFramesetEnabled: true }
    vi.stubGlobal('getCurrentPage', () => page)

    const snapshot = getCurrentInstance()
    expect(snapshot).not.toBe(Current)
    expect(snapshot.app).toBe(fakeApp)
    expect(snapshot.router).toBe(fakeRouter)
    expect(snapshot.page).toBe(fakePage)
    // 缓存到 page._taroInstance
    expect(page._taroInstance).toBe(snapshot)
  })

  test('reuses the same snapshot on subsequent frameset access (??= semantics)', () => {
    const page: any = { _isFramesetEnabled: true }
    vi.stubGlobal('getCurrentPage', () => page)

    const first = getCurrentInstance()
    const second = getCurrentInstance()
    expect(second).toBe(first)
  })

  test('snapshot freezes app/router/page at creation time, isolating later Current changes', () => {
    const page: any = { _isFramesetEnabled: true }
    vi.stubGlobal('getCurrentPage', () => page)

    const snapshot = getCurrentInstance()
    // 快照创建后变更全局 Current
    const newApp = { __app: 'changed' }
    const newRouter = { path: '/pages/other', $taroPath: '1' } as any
    const newPage = { __page: 'changed' } as any
    Current.app = newApp as any
    Current.router = newRouter
    Current.page = newPage

    // 快照字段保持创建时刻的固化值
    expect(snapshot.app).toBe(fakeApp)
    expect(snapshot.router).toBe(fakeRouter)
    expect(snapshot.page).toBe(fakePage)
  })

  test('preloadData getter proxies back to Current.preloadData', () => {
    const page: any = { _isFramesetEnabled: true }
    vi.stubGlobal('getCurrentPage', () => page)

    const snapshot = getCurrentInstance()
    Current.preloadData = { shared: 1 }
    expect(snapshot.preloadData).toEqual({ shared: 1 })

    Current.preloadData = { shared: 2 }
    expect(snapshot.preloadData).toEqual({ shared: 2 })
  })

  test('preloadData setter proxies back to Current.preloadData', () => {
    const page: any = { _isFramesetEnabled: true }
    vi.stubGlobal('getCurrentPage', () => page)

    const snapshot = getCurrentInstance()
    snapshot.preloadData = { written: true }
    expect(Current.preloadData).toEqual({ written: true })
  })

  test('each frameset page keeps its own isolated snapshot', () => {
    const pageA: any = { _isFramesetEnabled: true }
    const pageB: any = { _isFramesetEnabled: true }
    let current = pageA
    vi.stubGlobal('getCurrentPage', () => current)

    const snapA = getCurrentInstance()
    current = pageB
    const snapB = getCurrentInstance()

    expect(snapA).not.toBe(snapB)
    expect(pageA._taroInstance).toBe(snapA)
    expect(pageB._taroInstance).toBe(snapB)
  })
})
