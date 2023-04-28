/* eslint-disable @typescript-eslint/no-unused-vars */
const babelPresetTaro = require('..')

describe('babel-preset-taro with h5', () => {
  beforeAll(() => {
    process.env.TARO_PLATFORM = 'web'
    process.env.TARO_ENV = 'h5'
  })

  it('preact', () => {
    const config = babelPresetTaro({}, {
      framework: 'preact'
    })

    expect(config.sourceType).toBe('unambiguous')

    const [, override] = config.overrides

    const [prefreshPlugin] = override.plugins
    expect(prefreshPlugin === require('@prefresh/babel-plugin')).toBeTruthy()
  })

  it('not exist dynamic-import-node', () => {
    const config = babelPresetTaro({}, {
      framework: 'react',
      ts: true
    })

    expect(config.sourceType).toBe('unambiguous')

    const [override] = config.overrides

    const [dynamicImportNode] = override.plugins[override.plugins.length - 2]
    expect(dynamicImportNode === require('babel-plugin-dynamic-import-node')).toBeFalsy()
  })

  it('enable dynamic-import-node', () => {
    const config = babelPresetTaro({}, {
      framework: 'react',
      ts: true,
      'dynamic-import-node': true
    })

    expect(config.sourceType).toBe('unambiguous')

    const [override] = config.overrides

    const [dynamicImportNode] = override.plugins[override.plugins.length - 2]
    expect(dynamicImportNode === require('babel-plugin-dynamic-import-node')).toBeTruthy()
  })
})
