import { describe, expect, test, vi } from 'vitest'

import { createEvent, document } from '../src/index'

describe('DOM once listeners', () => {
  test('can be cancelled using the original callback', () => {
    const node = document.createElement('div')
    const callback = vi.fn()
    node.addEventListener('tap', callback, { once: true })
    node.removeEventListener('tap', callback)
    node.dispatchEvent(createEvent('tap'))
    expect(callback).not.toHaveBeenCalled()
  })

  test('is removed before synchronous reentry', () => {
    const node = document.createElement('div')
    const callback = vi.fn(() => {
      if (callback.mock.calls.length === 1) node.dispatchEvent(createEvent('tap'))
    })
    node.addEventListener('tap', callback, { once: true })
    node.dispatchEvent(createEvent('tap'))
    expect(callback).toHaveBeenCalledTimes(1)
  })

  test('stays removed when the callback throws', () => {
    const node = document.createElement('div')
    const error = new Error('callback error')
    const callback = vi.fn(() => { throw error })
    node.addEventListener('tap', callback, { once: true })
    expect(() => node.dispatchEvent(createEvent('tap'))).toThrow(error)
    expect(() => node.dispatchEvent(createEvent('tap'))).not.toThrow()
    expect(callback).toHaveBeenCalledTimes(1)
  })

  test('preserves the listener receiver and event argument', () => {
    const node = document.createElement('div')
    const event = createEvent('tap')
    const callback = vi.fn()
    node.addEventListener('tap', callback, { once: true })
    node.dispatchEvent(event)
    node.dispatchEvent(createEvent('tap'))
    expect(callback).toHaveBeenCalledTimes(1)
    expect(callback).toHaveBeenCalledWith(event)
    expect(callback.mock.contexts).toEqual([node])
  })

  test('removes its own registration when a persistent listener uses the same callback', () => {
    const node = document.createElement('div')
    const callback = vi.fn()
    node.addEventListener('tap', callback)
    node.addEventListener('tap', callback, { once: true })
    node.dispatchEvent(createEvent('tap'))
    expect(callback).toHaveBeenCalledTimes(2)
    node.dispatchEvent(createEvent('tap'))
    expect(callback).toHaveBeenCalledTimes(3)
    node.removeEventListener('tap', callback)
    node.dispatchEvent(createEvent('tap'))
    expect(callback).toHaveBeenCalledTimes(3)
  })

  test('cancelling a once listener preserves other listeners and event types', () => {
    const node = document.createElement('div')
    const once = vi.fn()
    const persistent = vi.fn()
    node.addEventListener('tap', once, { once: true })
    node.addEventListener('tap', persistent)
    node.addEventListener('change', once, { once: true })
    node.removeEventListener('tap', once)
    node.dispatchEvent(createEvent('tap'))
    expect(persistent).toHaveBeenCalledTimes(1)
    expect(once).not.toHaveBeenCalled()
    node.dispatchEvent(createEvent('change'))
    expect(once).toHaveBeenCalledTimes(1)
  })

  test('preserves independent once registrations of the same callback', () => {
    const node = document.createElement('div')
    const callback = vi.fn()
    node.addEventListener('tap', callback, { once: true })
    node.addEventListener('tap', callback, { once: true })
    node.dispatchEvent(createEvent('tap'))
    node.dispatchEvent(createEvent('tap'))
    expect(callback).toHaveBeenCalledTimes(2)
  })

  test('supports registering the callback again from inside itself', () => {
    const node = document.createElement('div')
    const callback = vi.fn(() => {
      if (callback.mock.calls.length === 1) node.addEventListener('tap', callback, { once: true })
    })
    node.addEventListener('tap', callback, { once: true })
    node.dispatchEvent(createEvent('tap'))
    expect(callback).toHaveBeenCalledTimes(1)
    node.dispatchEvent(createEvent('tap'))
    node.dispatchEvent(createEvent('tap'))
    expect(callback).toHaveBeenCalledTimes(2)
  })

  test('normalizes event names for cancellation', () => {
    const node = document.createElement('div')
    const callback = vi.fn()
    node.addEventListener('TAP', callback, { once: true })
    node.removeEventListener('Tap', callback)
    node.dispatchEvent(createEvent('tap'))
    expect(callback).not.toHaveBeenCalled()
  })

  test('can cancel both regionchange aliases using the original callback', () => {
    const node = document.createElement('map')
    const callback = vi.fn()
    node.addEventListener('regionchange', callback, { once: true })
    node.removeEventListener('regionchange', callback)
    node.dispatchEvent(createEvent('begin'))
    node.dispatchEvent(createEvent('end'))
    expect(callback).not.toHaveBeenCalled()
  })

  test('keeps begin and end once lifetimes independent for regionchange', () => {
    const node = document.createElement('map')
    const callback = vi.fn()
    node.addEventListener('regionchange', callback, { once: true })
    node.dispatchEvent(createEvent('begin'))
    node.dispatchEvent(createEvent('begin'))
    node.dispatchEvent(createEvent('end'))
    node.dispatchEvent(createEvent('end'))
    expect(callback).toHaveBeenCalledTimes(2)
    expect(callback.mock.calls.map(([event]) => event.type)).toEqual(['begin', 'end'])
  })

  test('preserves persistent listeners when once is false', () => {
    const node = document.createElement('div')
    const callback = vi.fn()
    node.addEventListener('tap', callback, { once: false })
    node.dispatchEvent(createEvent('tap'))
    node.dispatchEvent(createEvent('tap'))
    expect(callback).toHaveBeenCalledTimes(2)
    node.removeEventListener('tap', callback)
    node.dispatchEvent(createEvent('tap'))
    expect(callback).toHaveBeenCalledTimes(2)
  })
})
