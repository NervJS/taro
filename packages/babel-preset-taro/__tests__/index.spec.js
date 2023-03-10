/* 
 *  MIT License
 *  
 *  Copyright (c) 2018 O2Team、58.com、other contributors
 *  
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *  
 *  The above copyright notice and this permission notice shall be included in all
 *  copies or substantial portions of the Software.
 *  
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 *  SOFTWARE.
 */

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
  })

  it('vue', () => {
    const config = babelPresetTaro({}, {
      framework: 'vue'
    })

    expect(config.sourceType).toBe('unambiguous')

    const [override] = config.overrides

    const [, [jsxPreset, jsxOptions]] = override.presets
    expect(jsxPreset === require('@vue/babel-preset-jsx')).toBeTruthy()
    expect(jsxOptions).toEqual({})
  })

  it('vue3', () => {
    const config = babelPresetTaro({}, {
      framework: 'vue3'
    })

    expect(config.sourceType).toBe('unambiguous')

    const [override] = config.overrides

    const [[jsxPlugin, jsxOptions]] = override.plugins
    expect(jsxPlugin === require('@vue/babel-plugin-jsx')).toBeTruthy()
    expect(jsxOptions).toEqual({})
  })

  it('vue without jsx', () => {
    const config = babelPresetTaro({}, {
      framework: 'vue',
      vueJsx: false
    })

    expect(config.sourceType).toBe('unambiguous')

    const [override] = config.overrides

    const [, jsxPreset] = override.presets
    expect(jsxPreset).toBeUndefined()
  })

  it('vue3 without jsx', () => {
    const config = babelPresetTaro({}, {
      framework: 'vue3',
      vueJsx: false
    })

    expect(config.sourceType).toBe('unambiguous')

    const [override] = config.overrides

    const [[jsxPlugin, jsxOptions]] = override.plugins
    expect(jsxPlugin === require('@vue/babel-plugin-jsx')).toBeFalsy()
  })

  it('typescript react', () => {
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

  it('typescript nerv', () => {
    const config = babelPresetTaro({}, {
      framework: 'nerv',
      ts: true
    })

    const [override] = config.overrides

    const [, , [ts, tsconfig]] = override.presets
    expect(typeof ts.default === 'function').toBeTruthy()
    expect(tsconfig.jsxPragma === 'Nerv').toBeTruthy()
  })

  it('typescript vue', () => {
    const config = babelPresetTaro({}, {
      framework: 'vue',
      ts: true
    })

    const [override, vueOverride] = config.overrides
    const [, , [ts, tsconfig]] = override.presets

    expect(typeof ts.default === 'function').toBeTruthy()
    expect(tsconfig.hasOwnProperty('jsxPragma') === false).toBeTruthy()

    expect(vueOverride.include.test('a.vue')).toBeTruthy()
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
