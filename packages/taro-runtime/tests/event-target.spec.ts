import { afterEach, describe, expect, test, vi } from 'vitest'

import { createEvent, document, eventHandler } from '../src/index'

import type { TaroElement } from '../src/dom/element'
import type { TaroEvent } from '../src/dom/event'

function createNode (id: string) {
  const node = document.createElement('view')
  node.id = id
  node.setAttribute('data-role', id)
  return node
}

function nativeTarget (node: TaroElement) {
  return { id: node.id, dataset: { sid: node.sid } }
}

describe('event target data', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  test.each([false, true])('preserves native targets after removal in a handler (remove receiver: %s)', (removeReceiver) => {
    const holder = createNode('holder')
    const parent = createNode('parent')
    const child = createNode('child')
    holder.appendChild(parent)
    parent.appendChild(child)
    const target = nativeTarget(child)
    const currentTarget = nativeTarget(parent)
    const handler = vi.fn((event: TaroEvent) => {
      if (removeReceiver) {
        holder.removeChild(parent)
      } else {
        parent.removeChild(child)
      }

      expect(document.getElementById(child.sid)).toBeNull()
      expect(event.currentTarget.id).toBe(parent.id)
      expect(event.target.id).toBe(child.id)
      expect(event.target.dataset).toEqual(target.dataset)
      expect(event.currentTarget.dataset).toEqual(removeReceiver ? currentTarget.dataset : parent.dataset)
      expect(event.currentTarget).not.toBe(event.target)
    })
    parent.addEventListener('tap', handler, false)

    // Both nodes are indexed when the ordinary template dispatch entry resolves its receiver.
    eventHandler({ type: 'tap', target, currentTarget, detail: {} })
    expect(handler).toHaveBeenCalledOnce()
  })

  test.each([
    ['', ''],
    ['unresolved-id', ''],
    ['', 'unresolved-sid'],
    ['unresolved-id', 'unresolved-sid']
  ])('keeps distinct unresolved targets separate (id: %s, sid: %s)', (id, sid) => {
    const target = { id, dataset: { sid, role: 'child' } }
    const currentTarget = { id, dataset: { sid, role: 'parent' } }
    const event = createEvent({ type: 'tap', target, currentTarget, detail: { value: 7 } })

    expect(event.target.dataset).toEqual(target.dataset)
    expect(event.currentTarget.dataset).toBe(currentTarget.dataset)
    expect(event.currentTarget).not.toBe(event.target)
    expect(event.target.value).toBe(7)
    expect(event.currentTarget.value).toBe(7)
    expect(target).toEqual({ id, dataset: { sid, role: 'child' } })
    expect(currentTarget).toEqual({ id, dataset: { sid, role: 'parent' } })
  })

  test('shares the target wrapper for the same unresolved native object', () => {
    const target = { id: '', dataset: { role: 'same' } }
    const event = createEvent({ type: 'tap', target, currentTarget: target, detail: {} })

    expect(event.currentTarget).toBe(event.target)
    expect(event.target.dataset).toEqual(target.dataset)
  })

  test('supports missing native datasets and manually constructed events', () => {
    const target = { id: '', dataset: {} }
    const currentTarget = { id: '', dataset: {} }
    // Model platform payloads omitting dataset while retaining the public input type.
    Reflect.deleteProperty(target, 'dataset')
    Reflect.deleteProperty(currentTarget, 'dataset')
    const event = createEvent({ type: 'tap', target, currentTarget, detail: {} })
    expect(event.target.dataset).toEqual({})
    expect(event.currentTarget.dataset).toEqual({})
    expect(event.currentTarget).not.toBe(event.target)

    const manual = createEvent('tap')
    expect(manual.currentTarget).toBe(manual.target)
    expect(manual.target.dataset).toEqual({})
  })

  test('preserves indexed datasets, object values and shared logical identity', () => {
    const child = createNode('indexed-child')
    const parent = createNode('indexed-parent')
    const value = { nested: ['identity'] }
    child.setAttribute('data-value', value)
    const target = { id: child.id, dataset: { role: 'stale', nativeOnly: true } }
    const currentTarget = { id: parent.id, dataset: { role: 'stale' } }
    const event = createEvent({ type: 'tap', target, currentTarget, detail: {} })

    expect(event.target.dataset).toEqual(child.dataset)
    expect(event.target.dataset).not.toBe(child.dataset)
    expect(event.target.dataset.value).toBe(value)
    expect(event.currentTarget.dataset).toBe(parent.dataset)
    expect(event.currentTarget).not.toBe(event.target)

    const same = createEvent({
      type: 'tap', target, currentTarget: { id: '', dataset: { sid: child.sid } }, detail: {}
    })
    expect(same.currentTarget).toBe(same.target)

    const missingReceiver = createEvent({
      type: 'tap', target, currentTarget: { id: '', dataset: { role: 'native-parent' } }, detail: {}
    })
    expect(missingReceiver.target.dataset).toEqual(child.dataset)
    expect(missingReceiver.currentTarget.dataset).toEqual({ role: 'native-parent' })
    expect(missingReceiver.currentTarget).not.toBe(missingReceiver.target)
  })

  test.each([
    [true, true],
    [true, false],
    [false, true],
    [false, false]
  ])('preserves Alipay merge precedence (wrapper indexed: %s, target indexed: %s)', (hasWrapper, hasTarget) => {
    const wrapper = createNode('alipay-wrapper')
    const child = createNode('alipay-child')
    wrapper.setAttribute('data-wrapper', true)
    const value = { nested: ['identity'] }
    child.setAttribute('data-value', value)
    const target = {
      id: hasWrapper ? wrapper.id : 'missing-wrapper',
      dataset: { sid: hasWrapper ? wrapper.sid : 'missing-wrapper', wrapper: 'native', role: 'native-wrapper' },
      targetDataset: { sid: hasTarget ? child.sid : 'missing-child', role: 'native-child' }
    }
    const event = createEvent({ type: 'tap', target, currentTarget: { id: '', dataset: {} }, detail: {} })

    expect(event.target.dataset.wrapper).toBe(hasWrapper ? true : 'native')
    expect(event.target.dataset.role).toBe(hasTarget ? 'alipay-child' : 'native-child')
    expect(event.target.dataset.value).toBe(hasTarget ? value : undefined)
    expect(event.target.dataset.sid).toBe(hasTarget ? (hasWrapper ? undefined : 'missing-wrapper') : 'missing-child')
    expect(target.dataset.role).toBe('native-wrapper')
    expect(target.targetDataset.role).toBe('native-child')
  })

  test('retains lazy caches and the existing number of index lookups', () => {
    const lookup = vi.spyOn(document, 'getElementById')
    const event = createEvent({
      type: 'tap',
      target: { id: '', dataset: { role: 'child' } },
      currentTarget: { id: '', dataset: { role: 'parent' } },
      detail: {}
    })

    const currentTarget = event.currentTarget
    expect(lookup).toHaveBeenCalledTimes(2)
    expect(event.currentTarget).toBe(currentTarget)
    expect(lookup).toHaveBeenCalledTimes(2)

    const target = event.target
    expect(lookup).toHaveBeenCalledTimes(4)
    expect(event.target).toBe(target)
    expect(lookup).toHaveBeenCalledTimes(4)
  })
})
