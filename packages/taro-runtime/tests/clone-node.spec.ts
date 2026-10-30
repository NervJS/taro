import { Shortcuts } from '@tarojs/shared'
import set from 'lodash/set'
import { describe, expect, test, vi } from 'vitest'

import { TaroRootElement } from '../src/dom/root'
import { createEvent, document, MutationObserver } from '../src/index'

function createTree () {
  const parent = document.createElement('view')
  const child = document.createElement('text')
  child.appendChild(document.createTextNode('hello'))
  parent.appendChild(child)
  parent.appendChild(document.createElement('image'))
  return parent
}

describe('cloneNode', () => {
  test('deep cloning establishes parent and sibling references throughout the subtree', () => {
    const source = createTree()
    const clone = source.cloneNode(true)
    const [first, last] = clone.childNodes
    expect(clone.parentNode).toBeNull()
    expect(first.parentNode).toBe(clone)
    expect(first.parentElement).toBe(clone)
    expect(first.firstChild!.parentNode).toBe(first)
    expect(last.parentNode).toBe(clone)
    expect(first.previousSibling).toBeNull()
    expect(first.nextSibling).toBe(last)
    expect(last.previousSibling).toBe(first)
    expect(last.nextSibling).toBeNull()
    expect(first).not.toBe(source.firstChild)
    expect(first.firstChild).not.toBe(source.firstChild!.firstChild)
    expect(source.firstChild!.parentNode).toBe(source)
  })

  test.each([undefined, false])('shallow cloning with %s leaves children out', (deep) => {
    const source = createTree()
    const clone = source.cloneNode(deep)
    expect(clone.childNodes).toEqual([])
    expect(clone.parentNode).toBeNull()
    expect(source.childNodes).toHaveLength(2)
  })

  test.each([false, true])('clones text content with deep=%s', (deep) => {
    const source = document.createTextNode('hello')
    const clone = source.cloneNode(deep)
    expect(clone.textContent).toBe('hello')
    expect(clone.parentNode).toBeNull()
    expect(clone.sid).not.toBe(source.sid)
  })

  test('removing a cloned child changes only the clone', () => {
    const source = createTree()
    const clone = source.cloneNode(true)
    const first = clone.firstChild!
    first.remove()
    expect(clone.childNodes).toHaveLength(1)
    expect(first.parentNode).toBeNull()
    expect(clone.firstChild!.previousSibling).toBeNull()
    expect(source.childNodes).toHaveLength(2)
    expect(source.firstChild!.textContent).toBe('hello')
  })

  test('moving a cloned child detaches it from its cloned parent', () => {
    const source = createTree()
    const clone = source.cloneNode(true)
    const first = clone.firstChild!
    const destination = document.createElement('view')
    destination.appendChild(first)
    expect(clone.childNodes).toHaveLength(1)
    expect(destination.firstChild).toBe(first)
    expect(first.parentNode).toBe(destination)
    expect(source.childNodes).toHaveLength(2)
  })

  test('preserves independent attributes, dataset, styles and node identities', () => {
    const source = createTree()
    const original = source.children[0]
    original.setAttribute('title', 'original')
    original.setAttribute('data-value', 'original')
    original.setAttribute('style', 'color: red')
    const clone = source.cloneNode(true)
    const child = clone.firstChild!
    expect(child.getAttribute('title')).toBe('original')
    expect(child.dataset).toEqual({ value: 'original' })
    expect(child.style.color).toBe('red')
    expect(child.sid).not.toBe(original.sid)
    child.setAttribute('title', 'changed')
    child.setAttribute('data-value', 'changed')
    child.style.color = 'blue'
    expect(original.getAttribute('title')).toBe('original')
    expect(original.dataset).toEqual({ value: 'original' })
    expect(original.style.color).toBe('red')
  })

  test('does not copy event listeners', () => {
    const source = createTree()
    const listener = vi.fn()
    source.firstChild!.addEventListener('tap', listener)
    const clone = source.cloneNode(true)
    clone.firstChild!.dispatchEvent(createEvent('tap'))
    expect(listener).not.toHaveBeenCalled()
    source.firstChild!.dispatchEvent(createEvent('tap'))
    expect(listener).toHaveBeenCalledTimes(1)
  })

  test('cloning does not emit child list mutation records', () => {
    const source = createTree()
    const observer = new MutationObserver(vi.fn())
    observer.observe(source, { childList: true, subtree: true })
    try {
      const clone = source.cloneNode(true)
      expect(observer.takeRecords()).toEqual([])
      expect(clone.childNodes).toHaveLength(2)
      expect(source.childNodes).toHaveLength(2)
    } finally {
      observer.disconnect()
    }
  })

  test('mounted cloned descendants send updates to their own rendered paths', () => {
    vi.useFakeTimers()
    try {
      const source = createTree()
      const clone = source.cloneNode(true)
      const root = new TaroRootElement()
      root.appendChild(source)
      root.appendChild(clone)
      const rendered: Record<string, any> = {}
      const setData = vi.fn((patch, callback) => {
        Object.entries(patch).forEach(([path, value]) => set(rendered, path, value))
        callback?.()
      })
      root.ctx = { setData } as any
      root.performUpdate(true)
      vi.runAllTimers()
      setData.mockClear()

      const text = clone.firstChild!.firstChild!
      text.textContent = 'changed'
      vi.runAllTimers()

      expect(text._root).toBe(root)
      expect(setData).toHaveBeenCalled()
      const children = rendered.root[Shortcuts.Childnodes]
      expect(children[1][Shortcuts.Childnodes][0][Shortcuts.Childnodes][0][Shortcuts.Text]).toBe('changed')
      expect(children[0][Shortcuts.Childnodes][0][Shortcuts.Childnodes][0][Shortcuts.Text]).toBe('hello')
    } finally {
      vi.clearAllTimers()
      vi.useRealTimers()
    }
  })
})
