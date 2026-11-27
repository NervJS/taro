import { describe, expect, test } from 'vitest'

import * as runtime from '../src/index'

describe('Class', () => {
  const document = runtime.document

  global.document = runtime.document
  global.window = runtime.window
  // global.navigator = runtime.navigator

  describe('attribute', () => {
    test('setAttribute: class', () => {
      const div = document.createElement('div')
      div.className = 'test'
      expect(div.className).toBe('test')
      div.className = 'test1 test2'
      expect(div.className).toBe('test1 test2')
    })

    test('removeAttribute: class', () => {
      const div = document.createElement('div')
      div.className = 'test'
      div.removeAttribute('class')
      expect(div.className).toBe('')
    })
  })

  describe('classList', () => {
    test('get value', () => {
      const div = document.createElement('div')
      expect(div.classList.value).toBe('')
      div.classList.add('test1')
      expect(div.classList.value).toBe('test1')
      div.classList.add('test2')
      expect(div.classList.value).toBe('test1 test2')
    })

    test('get init value', () => {
      const div = document.createElement('div')
      div.className = 'test1 test2'
      expect(div.classList.value).toBe('test1 test2')
    })

    test('get length', () => {
      const div = document.createElement('div')
      div.classList.add('test1')
      expect(div.classList.length).toBe(1)
      div.classList.add('test2')
      expect(div.classList.length).toBe(2)
    })

    test('trigger add function', () => {
      const div = document.createElement('div')
      div.classList.add('test1')
      expect(div.className).toBe('test1')
      div.classList.add('test1')
      expect(div.className).toBe('test1')
      div.classList.add('test2')
      expect(div.className).toBe('test1 test2')
    })

    test('trigger remove function', () => {
      const div = document.createElement('div')
      div.classList.add('test1')
      div.classList.add('test2')
      div.classList.remove('test2')
      expect(div.className).toBe('test1')
      div.classList.remove('test3')
      expect(div.className).toBe('test1')
      div.classList.remove('test1')
      expect(div.className).toBe('')
    })

    describe.each(['add', 'remove'] as const)('%s without tokens', (method) => {
      test.each(['', 'kept', 'kept undefined'])('preserves the class list %j', (className) => {
        const div = document.createElement('div')
        div.className = className
        const classList = div.classList
        const length = classList.length
        const tokens: string[] = []

        classList[method](...tokens)

        expect(div.className).toBe(className)
        expect(classList.value).toBe(className)
        expect(classList.length).toBe(length)

        classList[method]()

        expect(div.className).toBe(className)
        expect(classList.value).toBe(className)
        expect(classList.length).toBe(length)
      })
    })

    test('trigger toggle function', () => {
      const div = document.createElement('div')
      div.classList.toggle('test')
      expect(div.className).toBe('test')
      div.classList.toggle('test')
      expect(div.className).toBe('')
    })

    test('trigger replace function', () => {
      const div = document.createElement('div')
      div.classList.add('test1')
      div.classList.add('test2')
      div.classList.replace('test1', 'test3')
      expect(div.className).toBe('test3 test2')
      div.classList.replace('test4', 'test5')
      expect(div.className).toBe('test3 test2')
    })

    test('trigger contains function', () => {
      const div = document.createElement('div')
      div.classList.add('test1')
      div.classList.add('test2')
      expect(div.classList.contains('test1')).toBe(true)
      expect(div.classList.contains('test3')).toBe(false)
    })

    test('trigger toString function', () => {
      const div = document.createElement('div')
      div.classList.add('test1')
      div.classList.add('test2')
      expect(div.classList.toString()).toBe('test1 test2')
    })
  })
})
