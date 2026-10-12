import { describe, expect, test, vi } from 'vitest'

import { Events } from '../src/event-emitter'

describe('Events', () => {
  test('#once 回调内再次 trigger 同一事件时只执行一次', () => {
    const events = new Events()
    const spy = vi.fn(() => {
      if (spy.mock.calls.length < 10) {
        events.trigger('reenter')
      }
    })

    events.once('reenter', spy)
    events.trigger('reenter')

    expect(spy).toBeCalledTimes(1)
  })

  test('#once 回调报错后监听器也会被解绑', () => {
    const events = new Events()
    const spy = vi.fn(() => {
      throw new Error('boom')
    })

    events.once('throwing', spy)
    expect(() => events.trigger('throwing')).toThrow('boom')
    events.trigger('throwing')

    expect(spy).toBeCalledTimes(1)
  })

  test('#once 只响应一次，并且透传参数 (control)', () => {
    const events = new Events()
    const spy = vi.fn()

    events.once('normal', spy)
    events.trigger('normal', 1, 'two', { three: 3 })
    events.trigger('normal', 4)

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith(1, 'two', { three: 3 })
  })

  test('#once 不影响同一事件上的其它监听器 (control)', () => {
    const events = new Events()
    const onceSpy = vi.fn()
    const onSpy = vi.fn()

    events.once('mixed', onceSpy)
    events.on('mixed', onSpy)
    events.trigger('mixed')
    events.trigger('mixed')

    expect(onceSpy).toBeCalledTimes(1)
    expect(onSpy).toBeCalledTimes(2)
  })

  test('#once 回调内可以重新注册同一事件 (control)', () => {
    const events = new Events()
    const second = vi.fn()
    const first = vi.fn(() => {
      events.once('again', second)
    })

    events.once('again', first)
    events.trigger('again')
    events.trigger('again')
    events.trigger('again')

    expect(first).toBeCalledTimes(1)
    expect(second).toBeCalledTimes(1)
  })

  test('#once 支持 symbol 事件名 (control)', () => {
    const events = new Events()
    const eventName = Symbol('symbol-event')
    const spy = vi.fn()

    events.once(eventName, spy)
    events.trigger(eventName)
    events.trigger(eventName)

    expect(spy).toBeCalledTimes(1)
  })

  test('#once 以 symbol 事件名注册时，回调内再次 trigger 也只执行一次', () => {
    const events = new Events()
    const eventName = Symbol('symbol-reenter')
    const spy = vi.fn(() => {
      if (spy.mock.calls.length < 10) {
        events.trigger(eventName)
      }
    })

    events.once(eventName, spy)
    events.trigger(eventName)

    expect(spy).toBeCalledTimes(1)
  })

  test('#once 以 symbol 事件名注册时，回调报错后也会被解绑', () => {
    const events = new Events()
    const eventName = Symbol('symbol-throwing')
    const spy = vi.fn(() => {
      throw new Error('boom')
    })

    events.once(eventName, spy)
    expect(() => events.trigger(eventName)).toThrow('boom')
    events.trigger(eventName)

    expect(spy).toBeCalledTimes(1)
  })

  test('#once 以多个事件名注册时，回调内 trigger 其中另一个事件也只执行一次', () => {
    const events = new Events()
    const spy = vi.fn(() => {
      if (spy.mock.calls.length < 10) {
        events.trigger('multi-b')
      }
    })

    events.once('multi-a,multi-b', spy)
    events.trigger('multi-a')

    expect(spy).toBeCalledTimes(1)
  })

  test('#once 传入 context 时，回调内再次 trigger 也只执行一次', () => {
    const events = new Events()
    const context = {}
    const spy = vi.fn(() => {
      if (spy.mock.calls.length < 10) {
        events.trigger('ctx')
      }
    })

    events.once('ctx', spy, context)
    events.trigger('ctx')
    events.trigger('ctx')

    expect(spy).toBeCalledTimes(1)
  })

  test('#once 回调内多次 trigger 同一事件时也只执行一次', () => {
    const events = new Events()
    const spy = vi.fn(() => {
      if (spy.mock.calls.length < 5) {
        events.trigger('double')
        events.trigger('double')
      }
    })

    events.once('double', spy)
    events.trigger('double')

    expect(spy).toBeCalledTimes(1)
  })

  test('#once 回调先重复 trigger 再报错时，只执行一次并解绑', () => {
    const events = new Events()
    const spy = vi.fn(() => {
      if (spy.mock.calls.length < 3) {
        events.trigger('reenter-throw')
      }
      throw new Error('boom')
    })

    events.once('reenter-throw', spy)
    expect(() => events.trigger('reenter-throw')).toThrow('boom')
    events.trigger('reenter-throw')

    expect(spy).toBeCalledTimes(1)
  })

  test('#once 传入空回调时，首次 trigger 报错后监听器也会被解绑', () => {
    const events = new Events()

    events.once('falsy', undefined as any)
    expect(() => events.trigger('falsy')).toThrow(TypeError)
    expect(() => events.trigger('falsy')).not.toThrow()
  })

  test('#once 回调抛出的异常对象原样向上抛出 (control)', () => {
    const events = new Events()
    const error = new Error('identity')
    const spy = vi.fn(() => {
      throw error
    })

    events.once('identity', spy)
    let caught: unknown
    try {
      events.trigger('identity')
    } catch (e) {
      caught = e
    }

    expect(caught).toBe(error)
  })

  test('#once 回调内 off 掉全部监听器时解绑不报错 (control)', () => {
    const events = new Events()
    const spy = vi.fn(() => {
      events.off()
    })

    events.once('cleared', spy)
    expect(() => events.trigger('cleared')).not.toThrow()
    events.trigger('cleared')

    expect(spy).toBeCalledTimes(1)
  })

  test('#once 不改变同一事件上 on 监听器的执行顺序 (control)', () => {
    const events = new Events()
    const order: string[] = []

    events.on('order', () => order.push('on-1'))
    events.once('order', () => order.push('once'))
    events.on('order', () => order.push('on-2'))
    events.trigger('order')
    events.trigger('order')

    expect(order).toEqual(['on-1', 'once', 'on-2', 'on-1', 'on-2'])
  })

  test('#once 注册后未触发即被 off 时不会再执行 (control)', () => {
    const events = new Events()
    const spy = vi.fn()

    events.once('removed', spy)
    events.off('removed')
    events.trigger('removed')

    expect(spy).not.toBeCalled()
  })

  test('#once 同一个回调注册两次时各自执行一次 (control)', () => {
    const events = new Events()
    const spy = vi.fn()

    events.once('dup', spy)
    events.once('dup', spy)
    events.trigger('dup')
    events.trigger('dup')

    expect(spy).toBeCalledTimes(2)
  })

  test('#once 回调报错后事件不再残留在监听链上', () => {
    const events = new Events()
    const spy = vi.fn(() => {
      throw new Error('boom')
    })

    events.once('leaked', spy)
    expect(() => events.trigger('leaked')).toThrow('boom')

    expect(events).not.toHaveProperty(['callbacks', 'leaked'])
  })
})
