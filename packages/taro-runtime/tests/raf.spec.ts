import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'

describe('raf', () => {
  const originalPlatform = process.env.TARO_PLATFORM

  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    process.env.TARO_PLATFORM = originalPlatform
    vi.unstubAllGlobals()
    vi.resetModules()
    vi.useRealTimers()
  })

  test('caf(raf(cb)) prevents cb when only requestAnimationFrame exists', async () => {
    const fakeRaf = vi.fn((_cb: FrameRequestCallback) => 12345)
    vi.stubGlobal('requestAnimationFrame', fakeRaf)
    // cancelAnimationFrame intentionally missing

    process.env.TARO_PLATFORM = 'web'
    vi.resetModules()

    const { caf, raf } = await import('../src/bom/raf')

    const cb = vi.fn()
    const id = raf(cb)
    caf(id)

    // Should use timer fallback since cancelAnimationFrame is missing
    expect(fakeRaf).not.toHaveBeenCalled()

    vi.advanceTimersByTime(100)
    expect(cb).not.toHaveBeenCalled()
  })

  test('caf(raf(cb)) prevents cb when only cancelAnimationFrame exists', async () => {
    const fakeCaf = vi.fn()
    vi.stubGlobal('cancelAnimationFrame', fakeCaf)
    // requestAnimationFrame intentionally missing

    process.env.TARO_PLATFORM = 'web'
    vi.resetModules()

    const { caf, raf } = await import('../src/bom/raf')

    const cb = vi.fn()
    const id = raf(cb)
    caf(id)

    // Should use timer fallback since requestAnimationFrame is missing
    expect(fakeCaf).not.toHaveBeenCalled()

    vi.advanceTimersByTime(100)
    expect(cb).not.toHaveBeenCalled()
  })

  test('caf(raf(cb)) prevents cb when neither requestAnimationFrame nor cancelAnimationFrame exist', async () => {
    expect(typeof requestAnimationFrame).toBe('undefined')
    expect(typeof cancelAnimationFrame).toBe('undefined')

    process.env.TARO_PLATFORM = 'web'
    vi.resetModules()

    const { caf, raf } = await import('../src/bom/raf')

    const cb = vi.fn()
    const id = raf(cb)
    caf(id)

    vi.advanceTimersByTime(100)
    expect(cb).not.toHaveBeenCalled()
  })

  test('caf(raf(cb)) prevents cb when both native implementations exist', async () => {
    let wasCancelled = false
    const fakeRaf = vi.fn((_cb: FrameRequestCallback) => {
      return 42
    })
    const fakeCaf = vi.fn((id: number) => {
      if (id === 42) wasCancelled = true
    })
    vi.stubGlobal('requestAnimationFrame', fakeRaf)
    vi.stubGlobal('cancelAnimationFrame', fakeCaf)

    process.env.TARO_PLATFORM = 'web'
    vi.resetModules()

    const { caf, raf } = await import('../src/bom/raf')

    const cb = vi.fn()
    const id = raf(cb)
    caf(id)

    // Should use native implementations
    expect(fakeRaf).toHaveBeenCalledWith(cb)
    expect(fakeCaf).toHaveBeenCalledWith(42)
    expect(wasCancelled).toBe(true)
  })

  test('uses timer fallback for non-web platform even if native APIs exist', async () => {
    const fakeRaf = vi.fn((_cb: FrameRequestCallback) => 12345)
    const fakeCaf = vi.fn()
    vi.stubGlobal('requestAnimationFrame', fakeRaf)
    vi.stubGlobal('cancelAnimationFrame', fakeCaf)

    process.env.TARO_PLATFORM = 'mini'
    vi.resetModules()

    const { caf, raf } = await import('../src/bom/raf')

    const cb = vi.fn()
    const id = raf(cb)
    caf(id)

    // Should use timer fallback for non-web platform
    expect(fakeRaf).not.toHaveBeenCalled()
    expect(fakeCaf).not.toHaveBeenCalled()

    vi.advanceTimersByTime(100)
    expect(cb).not.toHaveBeenCalled()
  })

  test('timer fallback executes callback when not cancelled', async () => {
    process.env.TARO_PLATFORM = 'web'
    vi.resetModules()

    const { raf } = await import('../src/bom/raf')

    const cb = vi.fn()
    raf(cb)

    expect(cb).not.toHaveBeenCalled()
    vi.advanceTimersByTime(20)
    expect(cb).toHaveBeenCalledTimes(1)
  })
})
