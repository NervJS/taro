import { Events } from '../dist/runtime.esm'

describe('emitter', () => {
  const events = new Events()

  it('once', () => {
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
    events.trigger.apply('foo', args)
  })
})
