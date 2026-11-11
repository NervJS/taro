import { describe, expect, test, vi } from 'vitest'

import { createEvent, document } from '../src/index'

describe('DOM listener mutations during dispatch', () => {
  test('does not repeat the active listener when it removes an earlier registration', () => {
    const node = document.createElement('div')
    const calls: string[] = []
    const first = () => calls.push('first')
    node.addEventListener('tap', first)
    node.addEventListener('tap', () => calls.push('second'))
    node.addEventListener('tap', () => {
      calls.push('third')
      node.removeEventListener('tap', first)
    })
    node.dispatchEvent(createEvent('tap'))
    expect(calls).toEqual(['third', 'second'])
  })

  test('skips a removed registration that has not run yet', () => {
    const node = document.createElement('div')
    const callback = vi.fn()
    node.addEventListener('tap', callback)
    node.addEventListener('tap', () => node.removeEventListener('tap', callback), { once: true })
    node.dispatchEvent(createEvent('tap'))
    expect(callback).not.toHaveBeenCalled()
  })

  test('continues after a listener removes itself and another registration', () => {
    const node = document.createElement('div')
    const calls: string[] = []
    const first = () => calls.push('first')
    const last = () => {
      calls.push('last')
      node.removeEventListener('tap', last)
      node.removeEventListener('tap', first)
    }
    node.addEventListener('tap', first)
    node.addEventListener('tap', () => calls.push('middle'))
    node.addEventListener('tap', last)
    node.dispatchEvent(createEvent('tap'))
    expect(calls).toEqual(['last', 'middle'])
  })

  test('defers a newly registered callback until the next dispatch', () => {
    const node = document.createElement('div')
    const added = vi.fn()
    node.addEventListener('tap', () => node.addEventListener('tap', added), { once: true })
    node.dispatchEvent(createEvent('tap'))
    expect(added).not.toHaveBeenCalled()
    node.dispatchEvent(createEvent('tap'))
    expect(added).toHaveBeenCalledTimes(1)
  })

  test('does not call a removed registration after the same callback is registered again', () => {
    const node = document.createElement('div')
    const callback = vi.fn()
    node.addEventListener('tap', callback)
    node.addEventListener('tap', () => {
      node.removeEventListener('tap', callback)
      node.addEventListener('tap', callback)
    }, { once: true })
    node.dispatchEvent(createEvent('tap'))
    expect(callback).not.toHaveBeenCalled()
    node.dispatchEvent(createEvent('tap'))
    expect(callback).toHaveBeenCalledTimes(1)
  })

  test('nested dispatch uses the updated registrations without adding them to the outer dispatch', () => {
    const node = document.createElement('div')
    const calls: string[] = []
    const removed = () => calls.push('removed')
    node.addEventListener('tap', removed)
    node.addEventListener('tap', () => calls.push('persistent'))
    node.addEventListener('tap', () => {
      calls.push('once')
      node.removeEventListener('tap', removed)
      node.addEventListener('tap', () => calls.push('added'))
      node.dispatchEvent(createEvent('tap'))
    }, { once: true })
    node.dispatchEvent(createEvent('tap'))
    expect(calls).toEqual(['once', 'added', 'persistent', 'persistent'])
  })

  test('removing an already invoked registration preserves the remaining listener', () => {
    const node = document.createElement('div')
    const calls: string[] = []
    const last = () => calls.push('last')
    node.addEventListener('tap', () => calls.push('first'))
    node.addEventListener('tap', () => {
      calls.push('middle')
      node.removeEventListener('tap', last)
    })
    node.addEventListener('tap', last)
    node.dispatchEvent(createEvent('tap'))
    expect(calls).toEqual(['last', 'middle', 'first'])
  })

  test('keeps duplicate callback registrations independent when one is removed', () => {
    const node = document.createElement('div')
    const callback = vi.fn()
    node.addEventListener('tap', callback)
    node.addEventListener('tap', callback)
    node.addEventListener('tap', () => node.removeEventListener('tap', callback), { once: true })
    node.dispatchEvent(createEvent('tap'))
    expect(callback).toHaveBeenCalledTimes(1)
  })

  test('preserves stopImmediatePropagation after removing another listener', () => {
    const node = document.createElement('div')
    const removed = vi.fn()
    const remaining = vi.fn()
    node.addEventListener('tap', removed)
    node.addEventListener('tap', remaining)
    node.addEventListener('tap', event => {
      node.removeEventListener('tap', removed)
      event.stopImmediatePropagation()
    })
    node.dispatchEvent(createEvent('tap'))
    expect(removed).not.toHaveBeenCalled()
    expect(remaining).not.toHaveBeenCalled()
  })

  test('preserves stopPropagation and clears ancestor suppression on the next event', () => {
    const parent = document.createElement('div')
    const node = document.createElement('div')
    parent.appendChild(node)
    const ancestor = vi.fn()
    const removed = vi.fn()
    const remaining = vi.fn()
    parent.addEventListener('tap', ancestor)
    node.addEventListener('tap', removed)
    node.addEventListener('tap', remaining)
    node.addEventListener('tap', event => {
      node.removeEventListener('tap', removed)
      event.stopPropagation()
    }, { once: true })
    const event = createEvent('tap')
    node.dispatchEvent(event)
    parent.dispatchEvent(event)
    expect(remaining).toHaveBeenCalledTimes(1)
    expect(ancestor).not.toHaveBeenCalled()
    parent.dispatchEvent(createEvent('tap'))
    expect(ancestor).toHaveBeenCalledTimes(1)
  })

  test('preserves receiver, event argument, return value and cancellation', () => {
    const node = document.createElement('div')
    const removed = vi.fn()
    const event = createEvent('tap')
    const callback = vi.fn(function (received) {
      expect(this).toBe(node)
      expect(received).toBe(event)
      node.removeEventListener('tap', removed)
      return false
    })
    node.addEventListener('tap', removed)
    node.addEventListener('tap', callback)
    expect(node.dispatchEvent(event)).toBe(true)
    expect(callback).toHaveBeenCalledTimes(1)
    expect(event.defaultPrevented).toBe(true)
    expect(node.dispatchEvent(createEvent('unregistered'))).toBe(false)
  })

  test('propagates callback errors and keeps removals effective', () => {
    const node = document.createElement('div')
    const removed = vi.fn()
    const error = new Error('listener error')
    node.addEventListener('tap', removed)
    node.addEventListener('tap', () => {
      node.removeEventListener('tap', removed)
      throw error
    }, { once: true })
    expect(() => node.dispatchEvent(createEvent('tap'))).toThrow(error)
    expect(() => node.dispatchEvent(createEvent('tap'))).not.toThrow()
    expect(removed).not.toHaveBeenCalled()
  })
})
