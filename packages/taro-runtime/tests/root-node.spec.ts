import { describe, expect, test } from 'vitest'

import { document, DOCUMENT_FRAGMENT, ShadowRoot, TaroDocument } from '../src/index'

describe('getRootNode', () => {
  test('returns a detached node itself rather than its ownerDocument', () => {
    const node = document.createElement('input')
    expect(node.ownerDocument).toBe(document)
    expect(node.getRootNode()).toBe(node)
  })

  test('returns the topmost ancestor of a detached subtree', () => {
    const parent = document.createElement('view')
    const child = document.createElement('input')
    parent.appendChild(child)
    expect(child.getRootNode()).toBe(parent)
  })

  test('returns the document for connected nodes', () => {
    const parent = document.createElement('view')
    const child = document.createElement('input')
    parent.appendChild(child)
    document.body.appendChild(parent)
    try {
      expect(child.getRootNode()).toBe(document)
      expect(document.getRootNode()).toBe(document)
    } finally {
      parent.remove()
    }
  })

  test('reflects removal and reparenting without a stale root', () => {
    const first = document.createElement('view')
    const second = document.createElement('view')
    const child = document.createElement('input')
    first.appendChild(child)
    expect(child.getRootNode()).toBe(first)
    second.appendChild(child)
    expect(child.getRootNode()).toBe(second)
    child.remove()
    expect(child.getRootNode()).toBe(child)
  })

  test('supports text and comment nodes', () => {
    const parent = document.createElement('view')
    const text = document.createTextNode('text')
    const comment = document.createComment()
    parent.appendChild(text)
    parent.appendChild(comment)
    expect(text.getRootNode()).toBe(parent)
    expect(comment.getRootNode()).toBe(parent)
  })

  test('returns a fragment until its children are inserted', () => {
    const fragment = document.createElement(DOCUMENT_FRAGMENT)
    const child = document.createElement('input')
    const parent = document.createElement('view')
    fragment.appendChild(child)
    expect(child.getRootNode()).toBe(fragment)
    parent.appendChild(fragment)
    expect(child.getRootNode()).toBe(parent)
    expect(fragment.getRootNode()).toBe(fragment)
  })

  test.each([undefined, {}, { composed: false }, { composed: true }])('accepts root options %j', options => {
    const parent = document.createElement('view')
    const child = document.createElement('input')
    parent.appendChild(child)
    expect(child.getRootNode(options)).toBe(parent)
  })

  test('exposes distinct constructors for Vue document and shadow root checks', () => {
    const node = document.createElement('input')
    expect(document).toBeInstanceOf(TaroDocument)
    expect(document).not.toBeInstanceOf(ShadowRoot)
    expect(node).not.toBeInstanceOf(TaroDocument)
    expect(node).not.toBeInstanceOf(ShadowRoot)
  })
})
