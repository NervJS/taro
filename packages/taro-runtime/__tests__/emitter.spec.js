import { Events } from '../dist/runtime.esm'

describe('emitter', () => {
  it('single listener', () => {
    const events = new Events()

    const listener1 = jest.fn()

    events.on('foo', listener1)
    events.trigger('foo')
    expect(listener1).toBeCalledTimes(1)

    events.trigger('foo')
    expect(listener1).toBeCalledTimes(2)

    events.off('foo')
    events.trigger('foo')
    expect(listener1).toBeCalledTimes(2)

    const args = ['hello', 'world']
    const listener2 = jest.fn((...receivedArgs) => {
      for (let i = 0; i < args.length; i++) {
        expect(receivedArgs[i]).toBe(args[i])
      }
    })
    events.once('foo', listener2)
    events.trigger('foo', ...args)
  })

  it('multipue listeners', () => {
    const events = new Events()

    const listener1 = jest.fn()
    const listener2 = jest.fn()
    const listener3 = jest.fn()

    events.on('foo', listener1)
    events.on('foo', listener2)
    events.on('foo', listener3)
    events.trigger('foo')
    expect(listener1).toBeCalledTimes(1)
    expect(listener2).toBeCalledTimes(1)
    expect(listener3).toBeCalledTimes(1)

    events.trigger('foo')
    expect(listener1).toBeCalledTimes(2)
    expect(listener2).toBeCalledTimes(2)
    expect(listener3).toBeCalledTimes(2)

    events.off('foo', listener1)
    events.trigger('foo')
    expect(listener1).toBeCalledTimes(2)
    expect(listener2).toBeCalledTimes(3)
    expect(listener3).toBeCalledTimes(3)

    events.off('foo')
    events.trigger('foo')
    expect(listener1).toBeCalledTimes(2)
    expect(listener2).toBeCalledTimes(3)
    expect(listener3).toBeCalledTimes(3)
  })

  it('off all', () => {
    const events = new Events()

    const listener1 = jest.fn()
    const listener2 = jest.fn()
    const listener3 = jest.fn()

    events.on('foo1', listener1)
    events.on('foo1', listener2)
    events.on('foo2', listener3)
    events.off()
    events.trigger('foo1')
    events.trigger('foo2')
    expect(listener1).toBeCalledTimes(0)
    expect(listener2).toBeCalledTimes(0)
    expect(listener3).toBeCalledTimes(0)
  })

  it('modify in trigger', () => {
    const events = new Events()

    const listener1 = jest.fn(() => {
      events.on('foo', listener2)
      events.on('foo', listener3)
      events.off('foo', listener1)
    })
    const listener2 = jest.fn(() => {
      events.off('foo', listener2)
    })
    const listener3 = jest.fn(() => {
      events.off('foo', listener3)
    })

    events.on('foo', listener1)
    events.trigger('foo')
    expect(listener1).toBeCalledTimes(1)
    expect(listener2).toBeCalledTimes(0)
    expect(listener3).toBeCalledTimes(0)

    events.trigger('foo')
    expect(listener1).toBeCalledTimes(1)
    expect(listener2).toBeCalledTimes(1)
    expect(listener3).toBeCalledTimes(1)
  })

  it('once', () => {
    const events = new Events()

    const listener1 = jest.fn()
    events.once('foo', listener1)
    events.trigger('foo')
    events.trigger('foo')
    events.trigger('foo')
    expect(listener1).toBeCalledTimes(1)

    const listener2 = jest.fn()
    events.once('foo', listener2)
    events.off('foo', listener2)
    events.trigger('foo')
    expect(listener2).toBeCalledTimes(0)

    const args = ['hello', 'world']
    const listener3 = jest.fn((...receivedArgs) => {
      for (let i = 0; i < args.length; i++) {
        expect(receivedArgs[i]).toBe(args[i])
      }
    })
    events.once('foo', listener3)
    events.trigger('foo', ...args)
  })

  it('symbols', () => {
    const events = new Events()

    const listener1 = jest.fn()
    const foo = Symbol('foo')
    events.on(foo, listener1)
    events.trigger(foo)
    expect(listener1).toBeCalledTimes(1)

    events.off(foo)
    events.trigger(foo)
    expect(listener1).toBeCalledTimes(1)

    const listener2 = jest.fn()
    events.on(foo, listener2)
    events.off()
    events.trigger(foo)
    expect(listener2).toBeCalledTimes(0)
  })
})
