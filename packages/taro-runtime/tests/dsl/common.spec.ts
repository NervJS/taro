import { afterEach, describe, expect, test } from 'vitest'

import { createRecursiveComponentConfig } from '../../src/dsl/common'

describe('createRecursiveComponentConfig', () => {
  const originalEnv = process.env.TARO_ENV

  afterEach(() => {
    process.env.TARO_ENV = originalEnv
  })

  test('should set styleIsolation to apply-shared for harmony-hybrid', () => {
    process.env.TARO_ENV = 'harmony-hybrid'
    const config = createRecursiveComponentConfig()
    expect(config.options?.styleIsolation).toBe('apply-shared')
  })

  test('should set styleIsolation to apply-shared for weapp', () => {
    process.env.TARO_ENV = 'weapp'
    const config = createRecursiveComponentConfig()
    expect(config.options?.styleIsolation).toBe('apply-shared')
  })

  test('should not set styleIsolation for other environments (e.g. h5)', () => {
    process.env.TARO_ENV = 'h5'
    const config = createRecursiveComponentConfig()
    expect(config.options?.styleIsolation).toBeUndefined()
  })

  test('should set addGlobalClass for jd', () => {
    process.env.TARO_ENV = 'jd'
    const config = createRecursiveComponentConfig()
    expect(config.options?.addGlobalClass).toBe(true)
    expect(config.options?.styleIsolation).toBeUndefined()
  })
})
