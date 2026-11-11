import { afterEach, describe, expect, test, vi } from 'vitest'

describe('env', () => {
  const originalPlatform = process.env.TARO_PLATFORM

  afterEach(() => {
    process.env.TARO_PLATFORM = originalPlatform
    vi.unstubAllGlobals()
    vi.resetModules()
  })

  test('does not throw when TARO_PLATFORM is web but window/document are missing (Node config load)', async () => {
    expect(typeof window).toBe('undefined')
    expect(typeof document).toBe('undefined')

    process.env.TARO_PLATFORM = 'web'
    vi.resetModules()

    const { default: env } = await import('../src/env')

    expect(env.window).toEqual({})
    expect(env.document).toEqual({})
  })

  test('uses EMPTY_OBJ when TARO_PLATFORM is not web', async () => {
    process.env.TARO_PLATFORM = 'mini'
    vi.resetModules()

    const { default: env } = await import('../src/env')

    expect(env.window).toEqual({})
    expect(env.document).toEqual({})
  })

  test('uses the host window and document when TARO_PLATFORM is web and they exist', async () => {
    const fakeWindow = { location: { href: 'https://example.com' } }
    const fakeDocument = { nodeType: 9 }
    vi.stubGlobal('window', fakeWindow)
    vi.stubGlobal('document', fakeDocument)
    process.env.TARO_PLATFORM = 'web'
    vi.resetModules()

    const { default: env } = await import('../src/env')

    expect(env.window).toBe(fakeWindow)
    expect(env.document).toBe(fakeDocument)
  })

  test('raf does not throw in Node when TARO_PLATFORM is web', async () => {
    expect(typeof requestAnimationFrame).toBe('undefined')
    expect(typeof cancelAnimationFrame).toBe('undefined')

    process.env.TARO_PLATFORM = 'web'
    vi.resetModules()

    const { caf, raf } = await import('../src/bom/raf')

    expect(typeof raf).toBe('function')
    expect(typeof caf).toBe('function')
  })

  test('runtime entry can be loaded in Node when TARO_PLATFORM is web', async () => {
    process.env.TARO_PLATFORM = 'web'
    vi.resetModules()

    await expect(import('../src/index')).resolves.toBeTruthy()
  })
})
