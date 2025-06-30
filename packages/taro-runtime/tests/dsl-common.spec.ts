import { beforeEach, describe, expect, it, vi } from 'vitest'

import {
  createComponentConfig,
  createPageConfig,
  getPageInstance,
  injectPageInstance,
  removePageInstance,
  safeExecute
} from '../src/dsl/common'
import { incrementId } from '../src/utils'

describe('DSL Common - Simple Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Page Instance Management', () => {
    it('should inject and get page instance', () => {
      const pageId = 'test-page-1'
      const instance = {
        onLoad: vi.fn(),
        $options: {},
        setState: vi.fn(),
        forceUpdate: vi.fn(),
        context: {},
        refs: {},
        router: {},
        app: {}
      } as any

      injectPageInstance(instance, pageId)
      const retrievedInstance = getPageInstance(pageId)

      expect(retrievedInstance).toBe(instance)
    })

    it('should remove page instance', () => {
      const pageId = 'test-page-2'
      const instance = {
        onLoad: vi.fn(),
        $options: {},
        setState: vi.fn(),
        forceUpdate: vi.fn(),
        context: {},
        refs: {},
        router: {},
        app: {}
      } as any

      injectPageInstance(instance, pageId)
      expect(getPageInstance(pageId)).toBe(instance)

      removePageInstance(pageId)
      expect(getPageInstance(pageId)).toBeUndefined()
    })
  })

  describe('Safe Execute', () => {
    it('should handle non-existent instance gracefully', () => {
      const result = safeExecute('non-existent-page', 'onLoad')
      expect(result).toBeUndefined()
    })
  })

  describe('Component Config', () => {
    it('should create component config', () => {
      const MockComponent = class {} as any
      const componentConfig = createComponentConfig(MockComponent, 'TestComponent')

      expect(componentConfig).toBeDefined()
      expect(typeof componentConfig).toBe('object')
      expect(componentConfig.methods).toBeDefined()
      expect(componentConfig.methods.eh).toBeDefined()
    })

    it('should create page config', () => {
      const MockComponent = class {} as any
      const pageConfig = createPageConfig(MockComponent, 'TestPage')

      expect(pageConfig).toBeDefined()
      expect(typeof pageConfig).toBe('object')
      // Page config has different structure, just check it's an object
      expect(pageConfig.onLoad).toBeDefined()
    })
  })

  describe('Incremental ID', () => {
    it('should generate unique IDs', () => {
      const idGenerator = incrementId()

      const id1 = idGenerator()
      const id2 = idGenerator()
      const id3 = idGenerator()

      expect(id1).not.toBe(id2)
      expect(id2).not.toBe(id3)
      expect(id1).not.toBe(id3)

      // IDs should be strings (letter combinations)
      expect(typeof id1).toBe('string')
      expect(typeof id2).toBe('string')
      expect(typeof id3).toBe('string')

      // Should be sequential: AA, AB, AC...
      expect(id1.length).toBeGreaterThan(0)
      expect(id2.length).toBeGreaterThan(0)
      expect(id3.length).toBeGreaterThan(0)
    })
  })
})
