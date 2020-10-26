/* eslint-disable @typescript-eslint/no-unused-vars */
const babelPresetTaro = require('..')

describe('babel-preset-taro', () => {
  it('nerv', () => {
    const config = babelPresetTaro({}, {
      framework: 'nerv'
    })

    expect(config.sourceType).toBe('unambiguous')

    const [override] = config.overrides

    const [, [_, reactConfig]] = override.presets
    expect(reactConfig.pragma).toBe('Nerv.createElement')
    expect(reactConfig.pragmaFrag).toBe('Nerv.Fragment')
  })

  it('react', () => {
    const config = babelPresetTaro({}, {
      framework: 'react'
    })

    expect(config.sourceType).toBe('unambiguous')

    const [override] = config.overrides

    const [, [_, reactConfig]] = override.presets
    expect(reactConfig.pragma).toBe('React.createElement')
    expect(reactConfig.pragmaFrag).toBe('React.Fragment')
  })

  it('vue', () => {
    const config = babelPresetTaro({}, {
      framework: 'vue'
    })

    expect(config.sourceType).toBe('unambiguous')

    const [override] = config.overrides

    const [, preset] = override.presets
    expect(preset).toBeUndefined()
  })

  it('typescript react', () => {
    const config = babelPresetTaro({}, {
      framework: 'react',
      ts: true
    })

    expect(config.sourceType).toBe('unambiguous')

    const [override] = config.overrides

    const [, , [ts, tsConfig]] = override.presets
    expect(typeof ts.default === 'function').toBeTruthy()
    expect(tsConfig.jsxPragma === 'React').toBeTruthy()
  })

  it('typescript nerv', () => {
    const config = babelPresetTaro({}, {
      framework: 'nerv',
      ts: true
    })

    const [override] = config.overrides

    const [, , [ts, tsConfig]] = override.presets
    expect(typeof ts.default === 'function').toBeTruthy()
    expect(tsConfig.jsxPragma === 'Nerv').toBeTruthy()
  })

  it('typescript vue', () => {
    const config = babelPresetTaro({}, {
      framework: 'vue',
      ts: true
    })

    const [override] = config.overrides
    const [, [ts, tsConfig]] = override.presets
    expect(typeof ts.default === 'function').toBeTruthy()
    expect(tsConfig.hasOwnProperty('jsxPragma') === false).toBeTruthy()
  })

  it('can change env options', () => {
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

  it('default env options', () => {
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
})
