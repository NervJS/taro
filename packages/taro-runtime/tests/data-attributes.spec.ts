import { hooks } from '@tarojs/shared'
import { describe, expect, test, vi } from 'vitest'

import { createEvent, document, MutationObserver } from '../src/index'

describe('removing data attributes', () => {
  const collidingAttributes = ['data-user-id', 'data-user--id', 'data-user---id']
  const removalOrders = [
    [0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]
  ]

  test.each(removalOrders)('preserves the latest surviving write when removing attributes in order %s, %s, %s', (...order) => {
    for (const rewritten of [-1, 0, 1, 2]) {
      const node = document.createElement('view')
      collidingAttributes.forEach((attribute, index) => node.setAttribute(attribute, ['old', 'middle', 'keep'][index]))
      if (rewritten !== -1) node.setAttribute(collidingAttributes[rewritten], 'rewritten')
      const writes = rewritten === -1 ? [0, 1, 2] : [0, 1, 2].filter(index => index !== rewritten).concat(rewritten)
      const remaining = new Set([0, 1, 2])

      for (const index of order) {
        node.removeAttribute(collidingAttributes[index])
        remaining.delete(index)
        const latest = writes.filter(index => remaining.has(index)).pop()
        if (latest === undefined) {
          expect(Object.prototype.hasOwnProperty.call(node.dataset, 'userId')).toBe(false)
        } else {
          expect(node.dataset.userId).toBe(latest === rewritten ? 'rewritten' : ['old', 'middle', 'keep'][latest])
        }
      }
    }
  })

  test('treats a removed and recreated mapping as the latest write without reordering attributes', () => {
    const node = document.createElement('view')
    collidingAttributes.forEach((attribute, index) => node.setAttribute(attribute, index))
    node.setAttribute(collidingAttributes[0], 'updated')
    expect(node.attributes.map(attribute => attribute.name)).toEqual(collidingAttributes)
    node.removeAttribute(collidingAttributes[0])
    expect(node.dataset.userId).toBe(2)
    node.setAttribute(collidingAttributes[0], 'recreated')
    node.removeAttribute(collidingAttributes[1])
    expect(node.dataset.userId).toBe('recreated')
    node.removeAttribute(collidingAttributes[0])
    expect(node.dataset.userId).toBe(2)
  })

  test.each([undefined, null, false, 0, '', { nested: true }])('restores the actual remaining value: %j', (value) => {
    const node = document.createElement('view')
    node.setAttribute('data-user-id', value)
    node.setAttribute('data-user--id', 'removed')
    node.removeAttribute('data-user--id')
    expect(Object.prototype.hasOwnProperty.call(node.dataset, 'userId')).toBe(true)
    expect(node.dataset.userId).toBe(value)
    node.removeAttribute('data-user-id')
    expect(Object.prototype.hasOwnProperty.call(node.dataset, 'userId')).toBe(false)
  })

  test.each([false, true])('clones write order independently with deep cloning: %s', (deep) => {
    const parent = document.createElement('view')
    const source = document.createElement('view')
    parent.appendChild(source)
    collidingAttributes.forEach((attribute, index) => source.setAttribute(attribute, index))
    source.setAttribute(collidingAttributes[0], 'latest')
    const clone = deep ? parent.cloneNode(true).firstChild! : source.cloneNode()

    clone.removeAttribute(collidingAttributes[2])
    expect(clone.dataset.userId).toBe('latest')
    clone.setAttribute(collidingAttributes[1], 'clone-only')
    source.removeAttribute(collidingAttributes[0])
    expect(source.dataset.userId).toBe(2)
    expect(clone.dataset.userId).toBe('clone-only')
    clone.removeAttribute(collidingAttributes[1])
    expect(clone.dataset.userId).toBe('latest')
    expect(source.getAttribute(collidingAttributes[1])).toBe(1)
  })

  test('leaves write order intact when removal is absent or interrupted', () => {
    const node = document.createElement('view')
    collidingAttributes.forEach((attribute, index) => node.setAttribute(attribute, index))
    node.removeAttribute('data-user----id')
    expect(node.dataset.userId).toBe(2)
    const interrupt = () => true
    hooks.tap('onRemoveAttribute', interrupt)
    try {
      node.removeAttribute(collidingAttributes[2])
      expect(node.getAttribute(collidingAttributes[2])).toBe(2)
      expect(node.dataset.userId).toBe(2)
    } finally {
      hooks.off('onRemoveAttribute', interrupt)
    }
    node.removeAttribute(collidingAttributes[1])
    expect(node.dataset.userId).toBe(2)
    node.removeAttribute(collidingAttributes[2])
    expect(node.dataset.userId).toBe(0)
    node.removeAttribute(collidingAttributes[0])
    node.setAttribute(collidingAttributes[1], 'new')
    expect(node.dataset.userId).toBe('new')
  })

  test('tracks parsed attributes and preserves write order through repeated cloning', () => {
    const parent = document.createElement('view')
    parent.innerHTML = '<view data-user-id="old" data-user--id="middle" data-user---id="keep"></view>'
    const node = parent.firstChild!
    node.setAttribute('data-user-id', 'updated')
    const clone = node.cloneNode().cloneNode()
    clone.removeAttribute('data-user-id')
    expect(clone.dataset.userId).toBe('keep')
    clone.removeAttribute('data-user---id')
    expect(clone.dataset.userId).toBe('middle')
    expect(node.dataset.userId).toBe('updated')
  })

  test.each([
    ['data-', ''],
    ['data-__proto__', '__proto__'],
    ['data-constructor', 'constructor'],
    ['data-to-string', 'toString']
  ])('supports special dataset keys for %s', (attribute, key) => {
    const node = document.createElement('view')
    node.setAttribute(attribute, 'old')
    node.setAttribute(attribute + '-', 'keep')
    node.removeAttribute(attribute)
    expect(node.dataset[key]).toBe('keep')
    node.removeAttribute(attribute + '-')
    expect(Object.prototype.hasOwnProperty.call(node.dataset, key)).toBe(false)
  })

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

  test.each([
    ['data-user-id', 'data-user--id'],
    ['data-user--id', 'data-user-id'],
    ['data-userId', 'data-user-id'],
    ['data-user-id', 'data-user-id-']
  ])('preserves the shared dataset key for %s and %s in either removal order', (first, second) => {
    for (const removed of [first, second]) {
      const node = document.createElement('view')
      node.setAttribute(first, 'first')
      node.setAttribute(second, 'second')
      node.setAttribute('data-keep', 'retained')
      const remaining = removed === first ? second : first
      const value = removed === first ? 'second' : 'first'

      node.removeAttribute(removed)

      expect(node.hasAttribute(removed)).toBe(false)
      expect(node.getAttribute(remaining)).toBe(value)
      expect(node.dataset).toEqual({ userId: value, keep: 'retained' })

      node.removeAttribute(remaining)
      expect(Object.prototype.hasOwnProperty.call(node.dataset, 'userId')).toBe(false)
      expect(node.dataset).toEqual({ keep: 'retained' })
    }
  })

  test.each([false, true])('events preserve a colliding data attribute with a distinct currentTarget: %s', (distinct) => {
    const target = document.createElement('view')
    const currentTarget = distinct ? document.createElement('view') : target
    if (distinct) currentTarget.appendChild(target)
    for (const node of new Set([target, currentTarget])) {
      node.setAttribute('data-user--id', 'retained')
      node.setAttribute('data-user---id', 'middle')
      node.setAttribute('data-user--id', 'retained')
      node.setAttribute('data-user-id', 'removed')
      node.removeAttribute('data-user-id')
    }
    const listener = vi.fn(event => {
      expect(event.target.dataset).toEqual({ userId: 'retained' })
      expect(event.currentTarget.dataset).toEqual({ userId: 'retained' })
    })
    currentTarget.addEventListener('tap', listener)
    const event = createEvent({
      type: 'tap',
      detail: {},
      target: { dataset: { sid: target.sid, userId: 'removed' }, id: '' },
      currentTarget: { dataset: { sid: currentTarget.sid, userId: 'removed' }, id: '' }
    }, currentTarget)

    currentTarget.dispatchEvent(event)
    expect(listener).toHaveBeenCalledTimes(1)
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
