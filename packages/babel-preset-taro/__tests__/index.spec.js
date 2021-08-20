/*
* Licensed to the O2Team under one
* or more contributor license agreements.  See the NOTICE file
* distributed with this work for additional information
* regarding copyright ownership.  The ASF licenses this file
* to you under the Apache License, Version 2.0 (the
* "License"); you may not use this file except in compliance
* with the License.  You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied.  See the License for the
* specific language governing permissions and limitations
* under the License.
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

    const [override, vueOverride] = config.overrides
    const [, , [ts, tsConfig]] = override.presets

    expect(typeof ts.default === 'function').toBeTruthy()
    expect(tsConfig.hasOwnProperty('jsxPragma') === false).toBeTruthy()

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
