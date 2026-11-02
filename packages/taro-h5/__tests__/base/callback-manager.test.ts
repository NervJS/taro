import { offNetworkStatusChange, onNetworkStatusChange } from '../../src/api/device/network'
import { CallbackManager } from '../../src/utils/handler'

describe('CallbackManager dispatch', () => {
  test('notifies the next callback when a callback removes itself', () => {
    const manager = new CallbackManager()
    const calls: string[] = []
    const first = () => { calls.push('first'); manager.remove(first) }
    const second = () => calls.push('second')
    manager.add(first)
    manager.add(second)
    manager.trigger()
    expect(calls).toEqual(['first', 'second'])
    expect(manager.count()).toBe(1)
    manager.trigger()
    expect(calls).toEqual(['first', 'second', 'second'])
  })

  test('removal of a later callback takes effect on the next dispatch', () => {
    const manager = new CallbackManager()
    const second = jest.fn()
    manager.add(() => manager.remove(second))
    manager.add(second)
    manager.trigger()
    expect(second).toHaveBeenCalledTimes(1)
    manager.trigger()
    expect(second).toHaveBeenCalledTimes(1)
  })

  test('removing an earlier callback does not skip the next callback', () => {
    const manager = new CallbackManager()
    const first = jest.fn()
    const third = jest.fn()
    manager.add(first)
    manager.add(() => manager.remove(first))
    manager.add(third)
    manager.trigger()
    expect(third).toHaveBeenCalledTimes(1)
  })

  test.each(['clear', 'remove'] as const)('%s during dispatch keeps the current snapshot', method => {
    const manager = new CallbackManager()
    const second = jest.fn()
    manager.add(() => manager[method]())
    manager.add(second)
    manager.trigger()
    expect(second).toHaveBeenCalledTimes(1)
    expect(manager.count()).toBe(0)
    manager.trigger()
    expect(second).toHaveBeenCalledTimes(1)
  })

  test('callbacks added during dispatch start on the next dispatch', () => {
    const manager = new CallbackManager()
    const added = jest.fn()
    const first = () => { manager.remove(first); manager.add(added) }
    const second = jest.fn()
    manager.add(first)
    manager.add(second)
    manager.trigger()
    expect(second).toHaveBeenCalledTimes(1)
    expect(added).not.toHaveBeenCalled()
    manager.trigger()
    expect(second).toHaveBeenCalledTimes(2)
    expect(added).toHaveBeenCalledTimes(1)
  })

  test('preserves object callback context and arguments during self removal', () => {
    const manager = new CallbackManager<[string, number]>()
    const ctx = { name: 'context' }
    const entry = { callback: jest.fn(), ctx }
    const callback = entry.callback
    callback.mockImplementation(function (this: typeof ctx, text: string, count: number) {
      expect(this).toBe(ctx)
      expect([text, count]).toEqual(['value', 2])
      manager.remove(entry)
    })
    const second = jest.fn()
    manager.add(entry)
    manager.add(second)
    manager.trigger('value', 2)
    expect(callback).toHaveBeenCalledTimes(1)
    expect(second).toHaveBeenCalledWith('value', 2)
    manager.trigger('next', 3)
    expect(callback).toHaveBeenCalledTimes(1)
    expect(second).toHaveBeenLastCalledWith('next', 3)
  })

  test('a nested dispatch sees the updated subscription list', () => {
    const manager = new CallbackManager()
    const calls: string[] = []
    const first = () => {
      calls.push('first')
      manager.remove(first)
      manager.trigger()
    }
    manager.add(first)
    manager.add(() => calls.push('second'))
    manager.trigger()
    expect(calls).toEqual(['first', 'second', 'second'])
  })

  test('keeps duplicate registrations and removes only one registration', () => {
    const manager = new CallbackManager()
    const callback = jest.fn()
    manager.add(callback)
    manager.add(callback)
    manager.trigger()
    expect(callback).toHaveBeenCalledTimes(2)
    manager.remove(callback)
    manager.trigger()
    expect(callback).toHaveBeenCalledTimes(3)
  })

  test('ignores unknown removals and empty dispatches', () => {
    const manager = new CallbackManager()
    manager.trigger()
    const callback = jest.fn()
    manager.add(callback)
    manager.remove(jest.fn())
    manager.trigger()
    expect(callback).toHaveBeenCalledTimes(1)
  })

  test('preserves callback exception propagation', () => {
    const manager = new CallbackManager()
    const error = new Error('callback error')
    const second = jest.fn()
    manager.add(() => { throw error })
    manager.add(second)
    expect(() => manager.trigger()).toThrow(error)
    expect(second).not.toHaveBeenCalled()
  })
})

describe('network status subscription mutation', () => {
  const connectionDescriptor = Object.getOwnPropertyDescriptor(navigator, 'connection')
  let connection: EventTarget

  beforeEach(() => {
    connection = Object.assign(new EventTarget(), { effectiveType: '4g' })
    Object.defineProperty(navigator, 'connection', { configurable: true, value: connection })
    offNetworkStatusChange()
  })

  afterEach(() => {
    offNetworkStatusChange()
    if (connectionDescriptor) Object.defineProperty(navigator, 'connection', connectionDescriptor)
    else delete (navigator as any).connection
  })

  test('self unsubscribe does not hide a network change from the next subscriber', async () => {
    const first = jest.fn(() => offNetworkStatusChange(first))
    const second = jest.fn()
    onNetworkStatusChange(first)
    onNetworkStatusChange(second)
    connection.dispatchEvent(new Event('change'))
    await Promise.resolve()
    expect(first).toHaveBeenCalledTimes(1)
    expect(second).toHaveBeenCalledWith({ networkType: '4g', isConnected: true })
    connection.dispatchEvent(new Event('change'))
    await Promise.resolve()
    expect(first).toHaveBeenCalledTimes(1)
    expect(second).toHaveBeenCalledTimes(2)
  })

  test('new subscribers wait until the next network event', async () => {
    const added = jest.fn()
    const first = () => { offNetworkStatusChange(first); onNetworkStatusChange(added) }
    const second = jest.fn()
    onNetworkStatusChange(first)
    onNetworkStatusChange(second)
    connection.dispatchEvent(new Event('change'))
    await Promise.resolve()
    expect(second).toHaveBeenCalledTimes(1)
    expect(added).not.toHaveBeenCalled()
    connection.dispatchEvent(new Event('change'))
    await Promise.resolve()
    expect(second).toHaveBeenCalledTimes(2)
    expect(added).toHaveBeenCalledTimes(1)
  })
})
