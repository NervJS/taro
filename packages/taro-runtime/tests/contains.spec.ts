import { describe, expect, test } from 'vitest'

import { DOCUMENT_FRAGMENT } from '../src/constants'
import { document } from '../src/index'

import type { TaroNode } from '../src/dom/node'

describe('Node.contains', () => {
  test.each([
    ['element', () => document.createElement('view')],
    ['text', () => document.createTextNode('hello')],
    ['comment', () => document.createComment()],
    ['fragment', () => document.createElement(DOCUMENT_FRAGMENT)],
    ['document', () => document]
  ] as const)('%s contains itself', (_name, createNode) => {
    const node = createNode()
    expect(node.contains(node)).toBe(true)
  })

  test.each([false, true])('contains(null) is false with children=%s', (withChildren) => {
    const parent = document.createElement('view')
    if (withChildren) parent.appendChild(document.createElement('text'))
    expect(parent.contains(null)).toBe(false)
  })

  test('contains element, text and comment descendants at different depths', () => {
    const parent = document.createElement('view')
    const child = document.createElement('view')
    const grandchild = document.createElement('text')
    const text = document.createTextNode('hello')
    const comment = document.createComment()
    parent.appendChild(child)
    child.appendChild(grandchild)
    grandchild.appendChild(text)
    grandchild.appendChild(comment)

    for (const node of [child, grandchild, text, comment]) {
      expect(parent.contains(node)).toBe(true)
      expect(node.contains(parent)).toBe(false)
    }
    expect(child.contains(text)).toBe(true)
    expect(text.contains(comment)).toBe(false)
  })

  test('does not contain siblings or nodes from another tree', () => {
    const parent = document.createElement('view')
    const first = document.createElement('view')
    const second = document.createElement('view')
    const other = document.createElement('view')
    const outside = document.createElement('view')
    parent.appendChild(first)
    parent.appendChild(second)
    other.appendChild(outside)

    expect(first.contains(second)).toBe(false)
    expect(second.contains(first)).toBe(false)
    expect(parent.contains(outside)).toBe(false)
    expect(parent.contains(other)).toBe(false)
  })

  test.each(['', 'contains-duplicate-id'])('does not confuse unrelated nodes with id=%j', (id) => {
    const parent = document.createElement('view')
    const child = document.createElement('view')
    const outside = document.createElement('view')
    child.id = id
    outside.id = id
    parent.appendChild(child)
    expect(parent.contains(child)).toBe(true)
    expect(parent.contains(outside)).toBe(false)
  })

  test('an unrelated id matching a generated uid does not establish containment', () => {
    const parent = document.createElement('view')
    const child = document.createElement('view')
    const outside = document.createElement('view')
    parent.appendChild(child)
    outside.id = child.uid
    expect(parent.contains(outside)).toBe(false)
  })

  test('changing ids does not change containment', () => {
    const parent = document.createElement('view')
    const child = document.createElement('text')
    parent.appendChild(child)
    child.id = 'contains-before'
    expect(parent.contains(child)).toBe(true)
    child.id = 'contains-after'
    expect(parent.contains(child)).toBe(true)
    child.removeAttribute('id')
    expect(parent.contains(child)).toBe(true)
  })

  test('updates containment after removing and moving a subtree', () => {
    const source = document.createElement('view')
    const destination = document.createElement('view')
    const child = document.createElement('view')
    const text = document.createTextNode('hello')
    child.appendChild(text)
    source.appendChild(child)
    expect(source.contains(text)).toBe(true)

    destination.appendChild(child)
    expect(source.contains(child)).toBe(false)
    expect(source.contains(text)).toBe(false)
    expect(destination.contains(child)).toBe(true)
    expect(destination.contains(text)).toBe(true)

    child.remove()
    expect(destination.contains(child)).toBe(false)
    expect(destination.contains(text)).toBe(false)
    expect(child.contains(text)).toBe(true)
  })

  test('deep clones contain only their own descendants, including with copied ids', () => {
    const source = document.createElement('view')
    const child = document.createElement('text')
    child.id = 'contains-cloned-id'
    source.appendChild(child)
    const clone = source.cloneNode(true)
    expect(clone.contains(clone.firstChild)).toBe(true)
    expect(source.contains(clone.firstChild)).toBe(false)
    expect(clone.contains(child)).toBe(false)
  })

  test('fragment containment follows its children when they are inserted', () => {
    const fragment = document.createElement(DOCUMENT_FRAGMENT)
    const parent = document.createElement('view')
    const child = document.createElement('text')
    // Build a fragment through the same node APIs used by the runtime parser.
    fragment.appendChild(child)
    expect(fragment.contains(child)).toBe(true)
    parent.appendChild(fragment)
    expect(fragment.contains(child)).toBe(false)
    expect(parent.contains(child)).toBe(true)
    expect(parent.contains(fragment)).toBe(false)
  })

  test('handles deeply nested descendants', () => {
    const root = document.createElement('view')
    let leaf: TaroNode = root
    for (let i = 0; i < 200; i++) {
      const child = document.createElement('view')
      leaf.appendChild(child)
      leaf = child
    }
    expect(root.contains(leaf)).toBe(true)
    expect(leaf.contains(root)).toBe(false)
  })
})
