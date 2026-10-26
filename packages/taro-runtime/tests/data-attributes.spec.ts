import { hooks } from '@tarojs/shared'
import { describe, expect, test, vi } from 'vitest'

import { createEvent, document, MutationObserver } from '../src/index'

describe('removing data attributes', () => {
  test.each([
    ['data-test', 'test'],
    ['data-user-id', 'userId'],
    ['data-order-item-id', 'orderItemId']
  ])('removes %s from attributes and dataset', (attribute, key) => {
    const node = document.createElement('view')
    node.setAttribute(attribute, 'old')
    node.setAttribute('data-keep', 'retained')

    node.removeAttribute(attribute)

    expect(node.hasAttribute(attribute)).toBe(false)
    expect(Object.prototype.hasOwnProperty.call(node.dataset, key)).toBe(false)
    expect(node.dataset).toEqual({ keep: 'retained' })
  })

  test('supports repeated removal and setting the attribute again', () => {
    const node = document.createElement('view')
    node.setAttribute('data-user-id', 'old')
    node.removeAttribute('data-user-id')
    node.removeAttribute('data-user-id')
    expect(node.dataset).toEqual({})

    node.setAttribute('data-user-id', 'new')
    expect(node.getAttribute('data-user-id')).toBe('new')
    expect(node.dataset.userId).toBe('new')
  })

  test('removing an absent attribute preserves the shared empty dataset', () => {
    const node = document.createElement('view')
    const other = document.createElement('view')
    const dataset = node.dataset
    node.removeAttribute('data-missing')
    expect(node.dataset).toBe(dataset)
    expect(other.dataset).toBe(dataset)
    expect(dataset).toEqual({})
  })

  test('removing an ordinary attribute preserves dataset entries', () => {
    const node = document.createElement('view')
    node.setAttribute('data-user-id', 'retained')
    node.setAttribute('user-id', 'ordinary')
    node.removeAttribute('user-id')
    expect(node.hasAttribute('user-id')).toBe(false)
    expect(node.dataset).toEqual({ userId: 'retained' })
  })

  test('preserves the attribute and dataset when a platform hook interrupts removal', () => {
    const node = document.createElement('view')
    node.setAttribute('data-user-id', 'retained')
    const interrupt = vi.fn(() => true)
    hooks.tap('onRemoveAttribute', interrupt)
    try {
      node.removeAttribute('data-user-id')
      expect(interrupt).toHaveBeenCalledWith(node, 'data-user-id')
      expect(node.getAttribute('data-user-id')).toBe('retained')
      expect(node.dataset.userId).toBe('retained')
    } finally {
      hooks.off('onRemoveAttribute', interrupt)
    }
  })

  test('keeps the existing attribute mutation notification', async () => {
    const node = document.createElement('view')
    node.setAttribute('data-user-id', 'old')
    const callback = vi.fn()
    const observer = new MutationObserver(callback)
    observer.observe(node, { attributes: true, attributeOldValue: true })
    try {
      node.removeAttribute('data-user-id')
      await Promise.resolve()
      expect(callback).toHaveBeenCalledTimes(1)
      expect(callback.mock.calls[0][0]).toEqual([
        expect.objectContaining({ target: node, type: 'attributes', attributeName: 'data-user-id', oldValue: 'old' })
      ])
      expect(node.dataset).toEqual({})
    } finally {
      observer.disconnect()
    }
  })

  test.each([false, true])('events omit removed data with a distinct currentTarget: %s', (distinct) => {
    const target = document.createElement('view')
    const currentTarget = distinct ? document.createElement('view') : target
    if (distinct) currentTarget.appendChild(target)
    for (const node of new Set([target, currentTarget])) {
      node.setAttribute('data-user-id', 'old')
      node.setAttribute('data-keep', 'retained')
      node.removeAttribute('data-user-id')
    }
    const listener = vi.fn(event => {
      expect(event.target.dataset).toEqual({ keep: 'retained' })
      expect(event.currentTarget.dataset).toEqual({ keep: 'retained' })
    })
    currentTarget.addEventListener('tap', listener)
    const event = createEvent({
      type: 'tap',
      detail: {},
      target: { dataset: { sid: target.sid, userId: 'old' }, id: '' },
      currentTarget: { dataset: { sid: currentTarget.sid, userId: 'old' }, id: '' }
    }, currentTarget)

    currentTarget.dispatchEvent(event)
    expect(listener).toHaveBeenCalledTimes(1)
  })
})
