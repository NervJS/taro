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

function createMountedTree (count = 3) {
  const root = new TaroRootElement()
  const parent = document.createElement('view')
  const children = Array.from({ length: count }, () => document.createElement('view'))
  children.forEach(child => parent.appendChild(child))
  root.appendChild(parent)
  const rendered: Record<string, any> = {}
  const setData = vi.fn((patch, callback) => {
    Object.entries(patch).forEach(([path, value]) => set(rendered, path, value))
    callback?.()
  })
  root.ctx = { setData } as any
  root.performUpdate(true)
  vi.runAllTimers()
  setData.mockClear()
  return { root, parent, children, rendered, setData }
}

beforeEach(() => vi.useFakeTimers())

afterEach(() => {
  observers.splice(0).forEach(observer => observer.disconnect())
  vi.clearAllTimers()
  vi.useRealTimers()
})

describe('replaceChild with an empty fragment', () => {
  test.each([[1, 0], [3, 0], [3, 1], [3, 2]])('updates mounted data with count=%i, index=%i', (count, index) => {
    const { root, parent, children, rendered, setData } = createMountedTree(count)
    const oldChild = children[index]
    const fragment = document.createElement(DOCUMENT_FRAGMENT)
    const observer = observe(parent)
    const fragmentObserver = observe(fragment)
    const remaining = children.filter(child => child !== oldChild)
    const epoch = root.nearestCtxEpoch

    expect(parent.replaceChild(fragment, oldChild)).toBe(oldChild)
    expect(parent.childNodes).toEqual(remaining)
    expect(oldChild.parentNode).toBeNull()
    expect(fragment.childNodes).toEqual([])
    expect(fragment.parentNode).toBeNull()
    expect(root.nearestCtxEpoch).toBeGreaterThan(epoch)
    remaining.forEach((child, i) => {
      expect(child.parentNode).toBe(parent)
      expect(child.previousSibling).toBe(remaining[i - 1] || null)
      expect(child.nextSibling).toBe(remaining[i + 1] || null)
    })
    vi.runAllTimers()
    expect(rendered.root[Shortcuts.Childnodes][0][Shortcuts.Childnodes].map(node => node.sid))
      .toEqual(remaining.map(child => child.sid))
    expect(setData).toHaveBeenCalledTimes(1)
    expect(observer.takeRecords()).toEqual([expect.objectContaining({
      target: parent,
      type: 'childList',
      removedNodes: [oldChild],
      previousSibling: children[index - 1] || null,
      nextSibling: children[index + 1] || null
    })])
    expect(fragmentObserver.takeRecords()).toEqual([])
  })

  test('notifies removal and clears descendant indexes when detached', () => {
    const parent = document.createElement('view')
    const oldChild = document.createElement('view')
    const descendant = document.createElement('text')
    oldChild.id = `${oldChild.sid}-old`
    descendant.id = `${descendant.sid}-descendant`
    oldChild.appendChild(descendant)
    parent.appendChild(oldChild)
    const observer = observe(parent)

    expect(parent.replaceChild(document.createElement(DOCUMENT_FRAGMENT), oldChild)).toBe(oldChild)
    expect(parent.childNodes).toEqual([])
    expect(oldChild.parentNode).toBeNull()
    expect(descendant.parentNode).toBe(oldChild)
    for (const node of [oldChild, descendant]) {
      expect(eventSource.get(node.sid)).toBeUndefined()
      expect(eventSource.get(node.id)).toBeUndefined()
    }
    expect(observer.takeRecords()).toEqual([expect.objectContaining({
      target: parent, type: 'childList', removedNodes: [oldChild]
    })])
  })

  test('keeps comment nodes out of rendered sibling indexes', () => {
    const { parent, children, rendered } = createMountedTree()
    const comment = document.createComment()
    parent.insertBefore(comment, children[1])
    vi.runAllTimers()

    parent.replaceChild(document.createElement(DOCUMENT_FRAGMENT), children[1])
    vi.runAllTimers()
    expect(parent.childNodes).toEqual([children[0], comment, children[2]])
    expect(rendered.root[Shortcuts.Childnodes][0][Shortcuts.Childnodes].map(node => node.sid))
      .toEqual([children[0].sid, children[2].sid])
  })

  test.each([1, 2])('preserves replacement with a fragment containing %i children', count => {
    const { parent, children, rendered } = createMountedTree()
    const fragment = document.createElement(DOCUMENT_FRAGMENT)
    const replacements = Array.from({ length: count }, () => document.createElement('text'))
    replacements.forEach(child => fragment.appendChild(child))
    const expected = [children[0], ...replacements, children[2]]

    expect(parent.replaceChild(fragment, children[1])).toBe(children[1])
    vi.runAllTimers()
    expect(parent.childNodes).toEqual(expected)
    expect(fragment.childNodes).toEqual([])
    replacements.forEach(child => expect(child.parentNode).toBe(parent))
    expect(rendered.root[Shortcuts.Childnodes][0][Shortcuts.Childnodes].map(node => node.sid))
      .toEqual(expected.map(child => child.sid))
  })

  test('preserves ordinary node replacement', () => {
    const { parent, children, rendered } = createMountedTree()
    const replacement = document.createElement('text')
    expect(parent.replaceChild(replacement, children[1])).toBe(children[1])
    vi.runAllTimers()
    expect(parent.childNodes).toEqual([children[0], replacement, children[2]])
    expect(rendered.root[Shortcuts.Childnodes][0][Shortcuts.Childnodes][1].sid).toBe(replacement.sid)
  })

  test('ignores a child belonging to another parent without scheduling updates', () => {
    const { parent, rendered, setData } = createMountedTree()
    const otherParent = document.createElement('view')
    const otherChild = document.createElement('view')
    otherParent.appendChild(otherChild)
    const observer = observe(parent)
    const before = JSON.stringify(rendered)

    expect(parent.replaceChild(document.createElement(DOCUMENT_FRAGMENT), otherChild)).toBeUndefined()
    vi.runAllTimers()
    expect(otherParent.childNodes).toEqual([otherChild])
    expect(otherChild.parentNode).toBe(otherParent)
    expect(observer.takeRecords()).toEqual([])
    expect(setData).not.toHaveBeenCalled()
    expect(JSON.stringify(rendered)).toBe(before)
  })
})
