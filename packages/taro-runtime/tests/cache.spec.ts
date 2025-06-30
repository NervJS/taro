import { beforeEach, describe, expect, it } from 'vitest'

import { RuntimeCache } from '../src/utils/cache'

describe('RuntimeCache Utility', () => {
  let cache: RuntimeCache<any>

  beforeEach(() => {
    cache = new RuntimeCache('test-cache')
  })

  it('should create a new cache instance with name', () => {
    expect(cache).toBeDefined()
    expect(cache instanceof RuntimeCache).toBe(true)
    expect(cache.name).toBe('test-cache')
  })

  it('should set and get values', () => {
    cache.set('key1', 'value1')
    cache.set('key2', { data: 'test' })
    cache.set('key3', 123)

    expect(cache.get('key1')).toBe('value1')
    expect(cache.get('key2')).toEqual({ data: 'test' })
    expect(cache.get('key3')).toBe(123)
  })

  it('should return undefined for non-existent keys', () => {
    expect(cache.get('non-existent-key')).toBeUndefined()
  })

  it('should check if cache has a key', () => {
    cache.set('existing-key', 'value')

    expect(cache.has('existing-key')).toBe(true)
    expect(cache.has('non-existent-key')).toBe(false)
  })

  it('should delete values', () => {
    cache.set('key-to-delete', 'value')
    expect(cache.has('key-to-delete')).toBe(true)

    cache.delete('key-to-delete')
    expect(cache.has('key-to-delete')).toBe(false)
    expect(cache.get('key-to-delete')).toBeUndefined()
  })

  it('should not set empty values', () => {
    cache.set('', 'value')
    cache.set('key', null)
    cache.set('key2', undefined)

    expect(cache.has('')).toBe(false)
    expect(cache.has('key')).toBe(false)
    expect(cache.has('key2')).toBe(false)
  })

  it('should handle complex objects as values', () => {
    const complexObject = {
      data: 'test',
      nested: {
        value: 123,
        array: [1, 2, 3]
      }
    }

    cache.set('complex', complexObject)
    const retrieved = cache.get('complex')

    expect(retrieved).toEqual(complexObject)
    expect(retrieved.nested.array).toEqual([1, 2, 3])
  })

  it('should overwrite existing values', () => {
    cache.set('key', 'original-value')
    expect(cache.get('key')).toBe('original-value')

    cache.set('key', 'new-value')
    expect(cache.get('key')).toBe('new-value')
  })

  it('should handle different cache instances', () => {
    const cache1 = new RuntimeCache<string>('cache1')
    const cache2 = new RuntimeCache<string>('cache2')

    cache1.set('key', 'value1')
    cache2.set('key', 'value2')

    expect(cache1.get('key')).toBe('value1')
    expect(cache2.get('key')).toBe('value2')
    expect(cache1.name).toBe('cache1')
    expect(cache2.name).toBe('cache2')
  })
})
