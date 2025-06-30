import { beforeEach, describe, expect, it, vi } from 'vitest'

import { TaroElement } from '../src/dom/element'
import { NodeType } from '../src/dom/node_types'
import { TaroText } from '../src/dom/text'
import {
  convertNumber2PX,
  customWrapperCache,
  extend,
  getComponentsAlias,
  incrementId,
  isComment,
  isElement,
  isHasExtractProp,
  isParentBound,
  isText,
  shortcutAttr
} from '../src/utils'

describe('Utils Functions', () => {
  describe('Node Type Checking', () => {
    let element: TaroElement
    let textNode: TaroText
    let commentNode: any

    beforeEach(() => {
      element = {
        nodeType: NodeType.ELEMENT_NODE,
        nodeName: 'div'
      } as any

      textNode = {
        nodeType: NodeType.TEXT_NODE,
        nodeName: '#text'
      } as any

      commentNode = {
        nodeType: NodeType.COMMENT_NODE,
        nodeName: 'comment'
      } as any
    })

    it('should correctly identify element nodes', () => {
      expect(isElement(element)).toBe(true)
      expect(isElement(textNode)).toBe(false)
      expect(isElement(commentNode)).toBe(false)
    })

    it('should correctly identify text nodes', () => {
      expect(isText(textNode)).toBe(true)
      expect(isText(element)).toBe(false)
      expect(isText(commentNode)).toBe(false)
    })

    it('should correctly identify comment nodes', () => {
      expect(isComment(commentNode)).toBe(true)
      expect(isComment(element)).toBe(false)
      expect(isComment(textNode)).toBe(false)
    })
  })

  describe('Attribute Utilities', () => {
    it('should check if node has extract prop correctly', () => {
      const nodeWithExtractProp = {
        props: {
          'data-test': 'value',
          'custom-prop': 'value'
        }
      } as any

      const nodeWithoutExtractProp = {
        props: {
          class: 'test',
          style: 'color: red',
          id: 'test-id',
          'data-test': 'value'
        }
      } as any

      expect(isHasExtractProp(nodeWithExtractProp)).toBe(true)
      expect(isHasExtractProp(nodeWithoutExtractProp)).toBe(false)
    })

    it('should create shortcut attributes correctly', () => {
      expect(shortcutAttr('style')).toBe('st')
      expect(shortcutAttr('id')).toBe('uid')
      expect(shortcutAttr('class')).toBe('cl')
      expect(shortcutAttr('other')).toBe('other')
    })
  })

  describe('Component Utilities', () => {
    it('should get components alias correctly', () => {
      const result = getComponentsAlias()

      expect(result).toBeDefined()
      expect(typeof result).toBe('object')
    })

    it('should check parent binding correctly', () => {
      const node = {
        parentElement: {
          nodeName: 'div',
          __handlers: {
            'some-event': [vi.fn()]
          },
          parentElement: null
        },
        __handlers: {}
      } as any

      expect(isParentBound(node, 'some-event')).toBe(true)
      expect(isParentBound(node, 'non-existent-event')).toBe(false)
    })

    it('should handle node without parent', () => {
      const node = {
        parentElement: null,
        __handlers: {}
      } as any

      expect(isParentBound(node, 'some-event')).toBe(false)
    })

    it('should handle root nodes', () => {
      const node = {
        parentElement: {
          nodeName: 'root',
          __handlers: {
            'some-event': [vi.fn()]
          },
          parentElement: null
        },
        __handlers: {}
      } as any

      expect(isParentBound(node, 'some-event')).toBe(false) // Should return false for root
    })
  })

  describe('Utility Functions', () => {
    it('should convert number to px', () => {
      expect(convertNumber2PX(10)).toBe('10px')
      expect(convertNumber2PX(0)).toBe('0px')
      expect(convertNumber2PX(100.5)).toBe('100.5px')
    })

    it('should extend constructor prototype', () => {
      class TestClass {}

      extend(TestClass, 'testMethod', () => 'test')

      const instance = new TestClass() as any
      expect(instance.testMethod()).toBe('test')
    })

    it('should extend constructor with options object', () => {
      class TestClass {}

      extend(TestClass, 'testProp', { value: 'test-value', writable: false })

      const instance = new TestClass() as any
      expect(instance.testProp).toBe('test-value')
    })

    it('should manage custom wrapper cache', () => {
      customWrapperCache.set('test-id', { data: 'test' })

      expect(customWrapperCache.get('test-id')).toEqual({ data: 'test' })
      expect(customWrapperCache.has('test-id')).toBe(true)

      customWrapperCache.delete('test-id')
      expect(customWrapperCache.has('test-id')).toBe(false)
    })
  })

  describe('Incremental ID Generator', () => {
    it('should generate incremental IDs', () => {
      const generator = incrementId()

      const id1 = generator()
      const id2 = generator()
      const id3 = generator()

      expect(id1).toBe('AA')
      expect(id2).toBe('AB')
      expect(id3).toBe('AC')

      // Test a few more to ensure sequence
      const id4 = generator()
      expect(id4).toBe('AD')
    })

    it('should handle sequence progression', () => {
      const generator = incrementId()

      // Generate exactly 4 IDs to test progression (AA, AB, AC, AD)
      let lastId = ''
      for (let i = 0; i < 4; i++) {
        lastId = generator()
      }

      expect(lastId).toBe('AD')
      expect(typeof lastId).toBe('string')
      expect(lastId.length).toBe(2)
    })
  })
})
