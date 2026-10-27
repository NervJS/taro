import { Shortcuts } from '@tarojs/shared'
import set from 'lodash/set'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'

import { DOCUMENT_FRAGMENT } from '../src/constants'
import { eventSource } from '../src/dom/event-source'
import { TaroRootElement } from '../src/dom/root'
import { document, MutationObserver } from '../src/index'

import type { TaroNode } from '../src/dom/node'

const observers: InstanceType<typeof MutationObserver>[] = []

function observe (target: TaroNode) {
  const observer = new MutationObserver(vi.fn())
  observer.observe(target, { childList: true, subtree: true })
  observers.push(observer)
  return observer
}

function createMountedTree () {
  const root = new TaroRootElement()
  const source = document.createElement('view')
  const target = document.createElement('view')
  const children = ['first', 'second', 'third'].map(id => {
    const child = document.createElement('view')
    child.id = id
    source.appendChild(child)
    return child
  })
  root.appendChild(source)
  root.appendChild(target)
  const rendered: Record<string, any> = {}
  const setData = vi.fn((patch, callback) => {
    Object.entries(patch).forEach(([path, value]) => set(rendered, path, value))
    callback?.()
  })
  root.ctx = { setData } as any
  root.performUpdate(true)
  vi.runAllTimers()
  setData.mockClear()
  return { root, source, target, children, rendered, setData }
}

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  observers.splice(0).forEach(observer => observer.disconnect())
  vi.clearAllTimers()
  vi.useRealTimers()
})

describe('node insertion consistency', () => {
  test.each([0, 1, 2])('inserting child %i before itself preserves the mounted tree', index => {
    const { root, source, children, rendered, setData } = createMountedTree()
    const child = children[index]
    const observer = observe(root)
    const epoch = root.nearestCtxEpoch

    expect(source.insertBefore(child, child)).toBe(child)

    expect(source.childNodes).toEqual(children)
    expect(child.parentNode).toBe(source)
    expect(eventSource.get(child.sid)).toBe(child)
    expect(eventSource.get(child.id)).toBe(child)
    expect(root.nearestCtxEpoch).toBe(epoch)
    expect(observer.takeRecords()).toEqual([])
    vi.runAllTimers()
    expect(setData).not.toHaveBeenCalled()
    expect(rendered.root[Shortcuts.Childnodes][0][Shortcuts.Childnodes].map(node => node.sid))
      .toEqual(children.map(node => node.sid))
  })

  test.each([0, 1, 2])('replacing child %i with itself preserves the mounted tree', index => {
    const { root, source, children, setData } = createMountedTree()
    const child = children[index]
    const observer = observe(root)
    const epoch = root.nearestCtxEpoch

    expect(source.replaceChild(child, child)).toBe(child)

    expect(source.childNodes).toEqual(children)
    expect(child.parentNode).toBe(source)
    expect(eventSource.get(child.sid)).toBe(child)
    expect(eventSource.get(child.id)).toBe(child)
    expect(root.nearestCtxEpoch).toBe(epoch)
    expect(observer.takeRecords()).toEqual([])
    vi.runAllTimers()
    expect(setData).not.toHaveBeenCalled()
  })

  test.each(['detached', 'another parent', 'the inserted child'])('rejects an invalid reference: %s', referenceLocation => {
    const { root, source, target, children, rendered, setData } = createMountedTree()
    const child = children[0]
    const reference = referenceLocation === 'detached'
      ? document.createElement('view')
      : children[referenceLocation === 'the inserted child' ? 0 : 1]
    const observer = observe(root)
    const epoch = root.nearestCtxEpoch

    expect(() => target.insertBefore(child, reference)).toThrow('The node to be replaced is not a child of this node.')

    expect(source.childNodes).toEqual(children)
    expect(target.childNodes).toEqual([])
    expect(child.parentNode).toBe(source)
    expect(eventSource.get(child.sid)).toBe(child)
    expect(eventSource.get(child.id)).toBe(child)
    expect(root.nearestCtxEpoch).toBe(epoch)
    expect(observer.takeRecords()).toEqual([])
    vi.runAllTimers()
    expect(setData).not.toHaveBeenCalled()
    expect(rendered.root[Shortcuts.Childnodes][0][Shortcuts.Childnodes].map(node => node.sid))
      .toEqual(children.map(node => node.sid))
  })

  test.each([0, 2])('rejects an invalid reference even for a fragment with %i children', count => {
    const target = document.createElement('view')
    const fragment = document.createElement(DOCUMENT_FRAGMENT)
    const children = Array.from({ length: count }, () => document.createElement('view'))
    children.forEach(child => fragment.appendChild(child))
    const fragmentObserver = observe(fragment)
    const targetObserver = observe(target)

    expect(() => target.insertBefore(fragment, document.createElement('view'))).toThrow()

    expect(fragment.childNodes).toEqual(children)
    children.forEach(child => expect(child.parentNode).toBe(fragment))
    expect(target.childNodes).toEqual([])
    expect(fragmentObserver.takeRecords()).toEqual([])
    expect(targetObserver.takeRecords()).toEqual([])
  })

  test.each([
    { childIndex: 0, referenceIndex: 2, order: [1, 0, 2] },
    { childIndex: 2, referenceIndex: 0, order: [2, 0, 1] },
    { childIndex: 1, referenceIndex: 2, order: [0, 1, 2] }
  ])('moves child $childIndex before child $referenceIndex within the same parent', ({ childIndex, referenceIndex, order }) => {
    const { source, children, rendered } = createMountedTree()
    const child = children[childIndex]
    const reference = children[referenceIndex]
    const expected = order.map(index => children[index])

    expect(source.insertBefore(child, reference)).toBe(child)

    expect(source.childNodes).toEqual(expected)
    expected.forEach(node => expect(node.parentNode).toBe(source))
    vi.runAllTimers()
    expect(rendered.root[Shortcuts.Childnodes][0][Shortcuts.Childnodes].map(node => node.sid))
      .toEqual(expected.map(node => node.sid))
  })

  test('appends an existing child to the end', () => {
    const { source, children, rendered } = createMountedTree()
    expect(source.appendChild(children[0])).toBe(children[0])
    const expected = [children[1], children[2], children[0]]
    expect(source.childNodes).toEqual(expected)
    vi.runAllTimers()
    expect(rendered.root[Shortcuts.Childnodes][0][Shortcuts.Childnodes].map(node => node.sid))
      .toEqual(expected.map(node => node.sid))
  })

  test('moves a child across mounted parents and preserves its event lookup', () => {
    const { source, target, children, rendered } = createMountedTree()
    const child = children[0]
    const reference = document.createElement('view')
    target.appendChild(reference)

    expect(target.insertBefore(child, reference)).toBe(child)

    expect(source.childNodes).toEqual(children.slice(1))
    expect(target.childNodes).toEqual([child, reference])
    expect(child.parentNode).toBe(target)
    expect(eventSource.get(child.id)).toBe(child)
    vi.runAllTimers()
    const parents = rendered.root[Shortcuts.Childnodes]
    expect(parents[0][Shortcuts.Childnodes].map(node => node.sid)).toEqual(children.slice(1).map(node => node.sid))
    expect(parents[1][Shortcuts.Childnodes].map(node => node.sid)).toEqual([child.sid, reference.sid])
  })

  test('inserts fragment children in order before a valid reference', () => {
    const { source, children, rendered } = createMountedTree()
    const fragment = document.createElement(DOCUMENT_FRAGMENT)
    const first = document.createElement('view')
    const second = document.createElement('view')
    fragment.appendChild(first)
    fragment.appendChild(second)
    const observer = observe(source)

    expect(source.insertBefore(fragment, children[1])).toBe(fragment)

    const expected = [children[0], first, second, children[1], children[2]]
    expect(source.childNodes).toEqual(expected)
    expect(fragment.childNodes).toEqual([])
    expect(first.parentNode).toBe(source)
    expect(second.parentNode).toBe(source)
    const mutations = observer.takeRecords()
    expect(mutations.map(record => record.addedNodes)).toEqual([[second], [first]])
    vi.runAllTimers()
    expect(rendered.root[Shortcuts.Childnodes][0][Shortcuts.Childnodes].map(node => node.sid))
      .toEqual(expected.map(node => node.sid))
  })

  test.each([0, 2])('replaces another child with existing child %i', index => {
    const { source, children, rendered } = createMountedTree()
    const replacement = children[index]
    const removed = children[1]

    expect(source.replaceChild(replacement, removed)).toBe(removed)

    const expected = [children[0], children[2]]
    expect(source.childNodes).toEqual(expected)
    expect(replacement.parentNode).toBe(source)
    expect(removed.parentNode).toBeNull()
    expect(eventSource.get(removed.sid)).toBeUndefined()
    expect(eventSource.get(replacement.sid)).toBe(replacement)
    vi.runAllTimers()
    expect(rendered.root[Shortcuts.Childnodes][0][Shortcuts.Childnodes].map(node => node.sid))
      .toEqual(expected.map(node => node.sid))
  })

  test('replaces a child with a non-empty fragment', () => {
    const { source, children, rendered } = createMountedTree()
    const fragment = document.createElement(DOCUMENT_FRAGMENT)
    const replacements = Array.from({ length: 2 }, () => document.createElement('view'))
    replacements.forEach(child => fragment.appendChild(child))

    expect(source.replaceChild(fragment, children[1])).toBe(children[1])

    const expected = [children[0], ...replacements, children[2]]
    expect(source.childNodes).toEqual(expected)
    expect(fragment.childNodes).toEqual([])
    expect(children[1].parentNode).toBeNull()
    replacements.forEach(child => expect(child.parentNode).toBe(source))
    vi.runAllTimers()
    expect(rendered.root[Shortcuts.Childnodes][0][Shortcuts.Childnodes].map(node => node.sid))
      .toEqual(expected.map(node => node.sid))
  })
})
