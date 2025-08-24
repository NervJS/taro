import din from 'babel-plugin-dynamic-import-node'
import { describe, expect, test } from 'vitest'

import babelPresetTaro from '../index.js'

const vp = require('@vue/babel-plugin-jsx')

describe('babel-preset-taro', () => {
  test('react', () => {
    const config = babelPresetTaro({}, {
      framework: 'react'
    })

    expect(config.sourceType).toBe('unambiguous')
  })

  test('vue3', () => {
    const config = babelPresetTaro({}, {
      framework: 'vue3'
    })

    expect(config.sourceType).toBe('unambiguous')

    const [override] = config.overrides

    const [[jsxPlugin, jsxOptions]] = override.plugins
    expect(jsxPlugin === vp).toBeTruthy()
    expect(jsxOptions).toEqual({})
  })

  test('vue3 without jsx', () => {
    const config = babelPresetTaro({}, {
      framework: 'vue3',
      vueJsx: false
    })

    expect(config.sourceType).toBe('unambiguous')

    const [override] = config.overrides

    const [[jsxPlugin,]] = override.plugins
    expect(jsxPlugin === vp).toBeFalsy()
  })

  test('typescript react', () => {
    const config = babelPresetTaro({}, {
      framework: 'react',
      ts: true
    })

    expect(config.sourceType).toBe('unambiguous')

    const [override] = config.overrides

    const [, , [ts, tsconfig]] = override.presets
    expect(typeof ts.default === 'function').toBeTruthy()
    expect(tsconfig.jsxPragma === 'React').toBeTruthy()
  })

  test('typescript vue3', () => {
    const config = babelPresetTaro({}, {
      framework: 'vue3',
      ts: true
    })

    const [, vueOverride] = config.overrides
    const [[ts, tsConfig]] = vueOverride.presets

    expect(typeof ts.default === 'function').toBeTruthy()
    expect(tsConfig.hasOwnProperty('jsxPragma') === false).toBeTruthy()
    expect(tsConfig.allExtensions).toBeTruthy()
    expect(tsConfig.isTSX).toBeTruthy()

    expect(vueOverride.include.test('a.vue')).toBeTruthy()
  })

  test('can change env options', () => {
    const config = babelPresetTaro({}, {
      framework: 'react',
      ts: true,
      spec: false,
      loose: false
    })

    expect(config.sourceType).toBe('unambiguous')

    const [override] = config.overrides

    const [, env] = override.presets[0]
    expect(env.spec).toBeFalsy()
    expect(env.loose).toBeFalsy()
  })

  test('default env options', () => {
    const config = babelPresetTaro({}, {
      framework: 'react',
      ts: true,
      spec: true,
      loose: true
    })

    expect(config.sourceType).toBe('unambiguous')

    const [override] = config.overrides

    const [, env] = override.presets[0]
    expect(env).toEqual({
      spec: true,
      loose: true,
      debug: false,
      modules: 'commonjs',
      targets: { node: 'current' },
      useBuiltIns: false,
      ignoreBrowserslistConfig: true
    })
  })

  test('has dynamic-import-node', () => {
    const config = babelPresetTaro({}, {
      framework: 'react',
      ts: true
    })

    expect(config.sourceType).toBe('unambiguous')

    const [override] = config.overrides

    const [dynamicImportNode] = override.plugins[override.plugins.length - 2]
    expect(dynamicImportNode === din).toBeTruthy()
  })

  test('disable dynamic-import-node', () => {
    const config = babelPresetTaro({}, {
      framework: 'react',
      ts: true,
      'dynamic-import-node': false
    })

    expect(config.sourceType).toBe('unambiguous')

    const [override] = config.overrides

    const [dynamicImportNode] = override.plugins[override.plugins.length - 2]
    expect(dynamicImportNode === din).toBeFalsy()
  })

  test('can react preset change', () => {
    const config = babelPresetTaro({}, {
      framework: 'react',
      ts: true,
      react: {
        throwIfNamespace: false
      }
    })

    expect(config.sourceType).toBe('unambiguous')

    const [override] = config.overrides

    const [, [, reactConfig]] = override.presets
    expect(reactConfig.throwIfNamespace).toBeFalsy()
  })
})
