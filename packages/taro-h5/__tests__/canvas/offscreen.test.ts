import { createOffscreenCanvas } from '@tarojs/taro-h5'

describe('createOffscreenCanvas', () => {
  const original = Object.getOwnPropertyDescriptor(globalThis, 'OffscreenCanvas')

  afterEach(() => {
    if (original) Object.defineProperty(globalThis, 'OffscreenCanvas', original)
    else Reflect.deleteProperty(globalThis, 'OffscreenCanvas')
    jest.restoreAllMocks()
  })

  it('keeps dimensions and context on the native canvas', () => {
    const context = {}
    const backing = { width: 0, height: 0, getContext: jest.fn().mockReturnValue(context) }
    const native = jest.fn().mockReturnValue(backing)
    Object.defineProperty(globalThis, 'OffscreenCanvas', { configurable: true, value: native })

    const canvas = createOffscreenCanvas({ type: '2d', width: 20, height: 10 })
    expect(native).toHaveBeenCalledWith(20, 10)
    expect(canvas.height).toBe(10)
    canvas.width = 30
    expect(backing.width).toBe(30)
    expect(canvas.getContext('webgl')).toBeNull()
    expect(canvas.getContext('2d')).toBe(context)
    expect(backing.getContext).toHaveBeenCalledTimes(1)
    expect(canvas.createImage()).toBeInstanceOf(HTMLImageElement)
  })

  it('falls back to a detached HTML canvas and defaults to WebGL', () => {
    Object.defineProperty(globalThis, 'OffscreenCanvas', { configurable: true, value: undefined })
    const getContext = jest.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null)
    const canvas = createOffscreenCanvas({})
    expect([canvas.width, canvas.height]).toEqual([300, 150])
    expect(canvas.getContext('webgl')).toBeNull()
    expect(getContext).toHaveBeenCalledWith('webgl')
    expect((getContext.mock.instances[0] as HTMLCanvasElement).isConnected).toBe(false)
  })
})
