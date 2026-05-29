import { afterEach, beforeEach, describe, expect, test } from 'vitest'

import * as runtime from '../src/index'

describe('MutationObserver', () => {
  const document = runtime.document
  const MutationObserver = runtime.MutationObserver

  let observer: any
  const mutations: any[] = []

  beforeEach(() => {
    observer = new MutationObserver((ms: any[]) => {
      mutations.push(...ms)
      observer.disconnect()
    })
  })

  afterEach(() => {
    mutations.splice(0, mutations.length)
    if (observer) observer.disconnect()
  })

  describe('should observe appendChild mutations', () => {
    test('first node', async () => {
      expect.assertions(2)
      const target = document.createElement('div')
      const child = document.createElement('div')

      observer.observe(target, { childList: true })
      target.appendChild(child)

      return Promise.resolve().then(() => {
        expect(mutations.length).toBe(1)
        expect(mutations).toEqual([{
          target: target,
          type: 'childList',
          previousSibling: null,
          nextSibling: null,
          removedNodes: [],
          addedNodes: [child]
        }])
      })
    })

    test('sibling node', async () => {
      expect.assertions(2)
      const target = document.createElement('div')
      const sibling = document.createElement('div')
      const child = document.createElement('view')

      target.appendChild(sibling)
      observer.observe(target, { childList: true })
      target.appendChild(child)

      return Promise.resolve().then(() => {
        expect(mutations.length).toBe(1)
        expect(mutations).toEqual([{
          target: target,
          type: 'childList',
          previousSibling: sibling,
          nextSibling: null,
          removedNodes: [],
          addedNodes: [child]
        }])
      })
    })

    test('tree depth > 1', async () => {
      expect.assertions(2)
      const target = document.createElement('div')
      const div = document.createElement('div')
      const child = document.createElement('view')

      target.appendChild(child)
      observer.observe(target, { childList: true, subtree: true })
      child.appendChild(div)

      return Promise.resolve().then(() => {
        expect(mutations.length).toBe(1)
        expect(mutations).toEqual([{
          target: child,
          type: 'childList',
          previousSibling: null,
          nextSibling: null,
          removedNodes: [],
          addedNodes: [div]
        }])
      })
    })
  })

  describe('should observe replaceChild mutation', () => {
    test('only one node', async () => {
      expect.assertions(3)
      const target = document.createElement('div')
      const div = document.createElement('div')
      const view = document.createElement('view')

      target.appendChild(view)
      observer.observe(target, { childList: true })
      target.replaceChild(div, view)

      return Promise.resolve().then(() => {
        expect(mutations.length).toBe(1)
        expect(target.childNodes.length).toBe(1)
        expect(mutations).toEqual([{
          target: target,
          type: 'childList',
          previousSibling: null,
          nextSibling: null,
          addedNodes: [div],
          removedNodes: [view]
        }])
      })
    })

    test('multi nodes - replace first node with new node', async () => {
      expect.assertions(3)
      const target = document.createElement('div')
      const first = document.createElement('div')
      const last = document.createElement('view')
      const newNode = document.createElement('view')

      target.appendChild(first)
      target.appendChild(last)
      observer.observe(target, { childList: true })
      target.replaceChild(newNode, first)

      return Promise.resolve().then(() => {
        expect(mutations.length).toBe(1)
        expect(target.childNodes.length).toBe(2)
        expect(mutations).toEqual([{
          target: target,
          type: 'childList',
          previousSibling: null,
          nextSibling: last,
          addedNodes: [newNode],
          removedNodes: [first]
        }])
      })
    })

    test('multi nodes - replace last node with new node', async () => {
      expect.assertions(3)
      const target = document.createElement('div')
      const first = document.createElement('div')
      const last = document.createElement('view')
      const newNode = document.createElement('view')

      target.appendChild(first)
      target.appendChild(last)
      observer.observe(target, { childList: true })
      target.replaceChild(newNode, last)

      return Promise.resolve().then(() => {
        expect(mutations.length).toBe(1)
        expect(target.childNodes.length).toBe(2)
        expect(mutations).toEqual([{
          target: target,
          type: 'childList',
          previousSibling: first,
          nextSibling: null,
          addedNodes: [newNode],
          removedNodes: [last]
        }])
      })
    })
  })

  describe('should observe removeChild mutations', () => {
    test('first node', async () => {
      expect.assertions(3)
      const target = document.createElement('div')
      const first = document.createElement('div')

      target.appendChild(first)
      observer.observe(target, { childList: true })
      target.removeChild(first)

      return Promise.resolve().then(() => {
        expect(mutations.length).toBe(1)
        expect(target.childNodes.length).toBe(0)
        expect(mutations).toEqual([
          {
            target: target,
            type: 'childList',
            previousSibling: null,
            nextSibling: null,
            removedNodes: [first]
          }
        ])
      })
    })

    test('sibling node', async () => {
      expect.assertions(3)
      const target = document.createElement('div')
      const first = document.createElement('div')
      const last = document.createElement('view')

      target.appendChild(first)
      target.appendChild(last)
      observer.observe(target, { childList: true })
      target.removeChild(first)

      return Promise.resolve().then(() => {
        expect(mutations.length).toBe(1)
        expect(target.childNodes.length).toBe(1)
        expect(mutations).toEqual([
          {
            target: target,
            type: 'childList',
            previousSibling: null,
            nextSibling: last,
            removedNodes: [first]
          }
        ])
      })
    })

    test('multi sibling nodes', async () => {
      expect.assertions(3)
      const target = document.createElement('div')
      const first = document.createElement('div')
      const second = document.createElement('view')
      const last = document.createElement('view')

      target.appendChild(first)
      target.appendChild(second)
      target.appendChild(last)
      observer.observe(target, { childList: true })
      target.removeChild(second)
      target.removeChild(last)

      return Promise.resolve().then(() => {
        expect(mutations.length).toBe(2)
        expect(target.childNodes.length).toBe(1)
        expect(mutations).toEqual([
          {
            target: target,
            type: 'childList',
            previousSibling: first,
            nextSibling: last,
            removedNodes: [second]
          },
          {
            target: target,
            type: 'childList',
            previousSibling: first,
            nextSibling: null,
            removedNodes: [last]
          }
        ])
      })
    })

    test('tree depth > 1', async () => {
      expect.assertions(3)
      const target = document.createElement('div')
      const div = document.createElement('div')
      const view = document.createElement('view')

      target.appendChild(div)
      div.appendChild(view)
      observer.observe(target, { childList: true, subtree: true })
      div.removeChild(view)

      return Promise.resolve().then(() => {
        expect(mutations.length).toBe(1)
        expect(target.childNodes.length).toBe(1)
        expect(mutations).toEqual([
          {
            target: div,
            type: 'childList',
            previousSibling: null,
            nextSibling: null,
            removedNodes: [view]
          }
        ])
      })
    })
  })
})
