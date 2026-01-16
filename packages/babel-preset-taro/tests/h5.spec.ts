import din from 'babel-plugin-dynamic-import-node'
import { beforeAll, describe, expect, test } from 'vitest'

import babelPresetTaro from '../index.js'

const pfp = require('@prefresh/babel-plugin')

describe('babel-preset-taro with h5', () => {
  beforeAll(() => {
    process.env.TARO_PLATFORM = 'web'
    process.env.TARO_ENV = 'h5'
  })

  test('preact', () => {
    const config = babelPresetTaro({}, {
      framework: 'preact'
    })

    expect(config.sourceType).toBe('unambiguous')

    const [, override] = config.overrides

    const [prefreshPlugin] = override.plugins
    expect(prefreshPlugin === pfp).toBeTruthy()
  })

  test('not exist dynamic-import-node', () => {
    const config = babelPresetTaro({}, {
      framework: 'react',
      ts: true
    })

    expect(config.sourceType).toBe('unambiguous')

    const [override] = config.overrides

    const [dynamicImportNode] = override.plugins[override.plugins.length - 2]
    expect(dynamicImportNode === din).toBeFalsy()
  })

  test('enable dynamic-import-node', () => {
    const config = babelPresetTaro({}, {
      framework: 'react',
      ts: true,
      'dynamic-import-node': true
    })

    expect(config.sourceType).toBe('unambiguous')

    const [override] = config.overrides

    const [dynamicImportNode] = override.plugins[override.plugins.length - 2]
    expect(dynamicImportNode === din).toBeTruthy()
  })
})
