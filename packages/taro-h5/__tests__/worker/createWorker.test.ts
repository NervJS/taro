import { createWorker } from '@tarojs/taro-h5'

class NativeWorker extends EventTarget {
  static current: NativeWorker
  postMessage = jest.fn()
  terminate = jest.fn()

  constructor (readonly scriptPath: string) {
    super()
    NativeWorker.current = this
  }
}

describe('createWorker', () => {
  const original = Object.getOwnPropertyDescriptor(globalThis, 'Worker')
  let worker: ReturnType<typeof createWorker>

  beforeEach(() => {
    Object.defineProperty(globalThis, 'Worker', { configurable: true, value: NativeWorker })
  })

  afterEach(() => {
    worker?.terminate()
    if (original) Object.defineProperty(globalThis, 'Worker', original)
    else Reflect.deleteProperty(globalThis, 'Worker')
  })

  it('forwards messages and adapts native message events', () => {
    worker = createWorker('/static/worker.js')
    const native = NativeWorker.current
    const onMessage = jest.fn()
    worker.onMessage(onMessage)
    worker.postMessage({ input: 21 })
    native.dispatchEvent(new MessageEvent('message', { data: { output: 42 } }))
    expect(native.scriptPath).toBe('/static/worker.js')
    expect(native.postMessage).toHaveBeenCalledWith({ input: 21 })
    expect(onMessage).toHaveBeenCalledWith({ message: { output: 42 } })
  })

  it('releases the active worker slot on termination', () => {
    const first = createWorker('/first.js')
    worker = first
    const native = NativeWorker.current
    expect(() => createWorker('/second.js')).toThrow('terminate the active worker')
    first.terminate()
    expect(native.terminate).toHaveBeenCalledTimes(1)
    worker = createWorker('/second.js')
    first.terminate()
    expect(() => createWorker('/third.js')).toThrow('terminate the active worker')
  })

  it('fails synchronously on an invalid path or missing browser support', () => {
    expect(() => createWorker('')).toThrow('non-empty string')
    // Delete the mock so the VM sees an absent global binding.
    Reflect.deleteProperty(globalThis, 'Worker')
    expect(() => createWorker('/worker.js')).toThrow('unavailable')
  })
})
