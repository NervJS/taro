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

  test('#once 只响应一次，并且透传参数', () => {
    const events = new Events()
    const spy = vi.fn()

    events.once('normal', spy)
    events.trigger('normal', 1, 'two', { three: 3 })
    events.trigger('normal', 4)

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith(1, 'two', { three: 3 })
  })

  test('#once 不影响同一事件上的其它监听器', () => {
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

  test('#once 回调内可以重新注册同一事件', () => {
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

  test('#once 支持 symbol 事件名', () => {
    const events = new Events()
    const eventName = Symbol('symbol-event')
    const spy = vi.fn()

    events.once(eventName, spy)
    events.trigger(eventName)
    events.trigger(eventName)

    expect(spy).toBeCalledTimes(1)
  })
})
