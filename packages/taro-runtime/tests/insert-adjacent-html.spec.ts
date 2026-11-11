import { Shortcuts } from '@tarojs/shared'
import set from 'lodash/set'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'

import { TaroRootElement } from '../src/dom/root'
import { document } from '../src/index'

import type { TaroNode } from '../src/dom/node'
import type { IPosition } from '../src/dom-external/node'

const positions: IPosition[] = ['beforebegin', 'afterbegin', 'beforeend', 'afterend']
const fragments = [
  { name: 'elements', html: '<button></button><image></image>', labels: ['button', 'image'] },
  { name: 'mixed text and elements', html: 'first<button></button>last', labels: ['first', 'button', 'last'] }
]

function labels (nodes: TaroNode[]) {
  return nodes.map(node => node.nodeName === '#text' ? node.textContent : node.nodeName)
}

function createTree (withChild = true) {
  const parent = document.createElement('view')
  const target = document.createElement('view')
  parent.appendChild(document.createTextNode('before'))
  parent.appendChild(target)
  parent.appendChild(document.createTextNode('after'))
  if (withChild) target.appendChild(document.createTextNode('existing'))
  return { parent, target }
}

function expectTree (parent: TaroNode, target: TaroNode, position: IPosition, inserted: string[], existing: string[]) {
  const expectedParent = position === 'beforebegin'
    ? ['before', ...inserted, 'view', 'after']
    : position === 'afterend' ? ['before', 'view', ...inserted, 'after'] : ['before', 'view', 'after']
  const expectedChildren = position === 'afterbegin'
    ? [...inserted, ...existing]
    : position === 'beforeend' ? [...existing, ...inserted] : existing
  expect(labels(parent.childNodes)).toEqual(expectedParent)
  expect(labels(target.childNodes)).toEqual(expectedChildren)
  for (const container of [parent, target]) {
    container.childNodes.forEach((node, index, nodes) => {
      expect(node.parentNode).toBe(container)
      expect(node.previousSibling).toBe(nodes[index - 1] || null)
      expect(node.nextSibling).toBe(nodes[index + 1] || null)
    })
  }
}

describe.each(fragments)('insertAdjacentHTML: $name', ({ html, labels: inserted }) => {
  describe.each([false, true])('target initially has children: %s', withChild => {
    test.each(positions)('%s preserves node order and relationships', position => {
      const { parent, target } = createTree(withChild)
      target.insertAdjacentHTML(position, html)
      expectTree(parent, target, position, inserted, withChild ? ['existing'] : [])
    })
  })

  test('afterend appends in order when the target is the last child', () => {
    const { parent, target } = createTree()
    parent.lastChild!.remove()
    target.insertAdjacentHTML('afterend', html)
    expect(labels(parent.childNodes)).toEqual(['before', 'view', ...inserted])
    parent.childNodes.forEach(node => expect(node.parentNode).toBe(parent))
  })
})

test.each(positions)('empty HTML leaves the tree unchanged at %s', position => {
  const { parent, target } = createTree()
  const siblings = parent.childNodes.slice()
  const children = target.childNodes.slice()
  target.insertAdjacentHTML(position, '')
  expect(parent.childNodes).toEqual(siblings)
  expect(target.childNodes).toEqual(children)
})

test.each(['beforebegin', 'afterend'] as const)('%s on a detached node preserves its children', position => {
  const target = document.createElement('view')
  const existing = document.createTextNode('existing')
  target.appendChild(existing)
  target.insertAdjacentHTML(position, '<button></button><image></image>')
  expect(target.parentNode).toBe(null)
  expect(target.childNodes).toEqual([existing])
  expect(existing.parentNode).toBe(target)
})

describe('mounted insertAdjacentHTML updates', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => {
    vi.clearAllTimers()
    vi.useRealTimers()
  })

  test.each(positions)('%s renders inserted nodes in order', position => {
    const { parent, target } = createTree()
    const root = new TaroRootElement()
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

    const fragment = fragments[1]
    target.insertAdjacentHTML(position, fragment.html)
    expectTree(parent, target, position, fragment.labels, ['existing'])
    vi.runAllTimers()

    expect(setData).toHaveBeenCalled()
    const renderedSiblings = rendered.root[Shortcuts.Childnodes][0][Shortcuts.Childnodes]
    expect(renderedSiblings.map(node => node.sid)).toEqual(parent.childNodes.map(node => node.sid))
    const renderedTarget = renderedSiblings.find(node => node.sid === target.sid)
    expect(renderedTarget[Shortcuts.Childnodes].map(node => node.sid)).toEqual(target.childNodes.map(node => node.sid))
    expect(renderedSiblings[0][Shortcuts.Text]).toBe('before')
    expect(renderedSiblings[renderedSiblings.length - 1][Shortcuts.Text]).toBe('after')
  })
})
