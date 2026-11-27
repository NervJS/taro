import * as path from 'node:path'

import { getDefaultH5TerserOptions, getDefaultMiniTerserOptions } from '@tarojs/runner-utils'
import { H5BaseConfig } from '@tarojs/webpack5-runner/dist/webpack/H5BaseConfig'
import { MiniBaseConfig } from '@tarojs/webpack5-runner/dist/webpack/MiniBaseConfig'

const appPath = path.resolve(__dirname, '../../packages/taro-webpack5-runner')

describe('Terser default config instance isolation', () => {
  test('H5BaseConfig instances do not share nested defaultTerserOptions', () => {
    const configA = new H5BaseConfig(appPath, { mode: 'development' })
    const configB = new H5BaseConfig(appPath, { mode: 'development' })

    expect(configA.defaultTerserOptions).not.toBe(configB.defaultTerserOptions)
    expect(configA.defaultTerserOptions.output).not.toBe(configB.defaultTerserOptions.output)

    configA.defaultTerserOptions.keep_fnames = false
    configA.defaultTerserOptions.output.comments = true

    expect(configB.defaultTerserOptions.keep_fnames).toBe(true)
    expect(configB.defaultTerserOptions.output.comments).toBe(false)

    const configC = new H5BaseConfig(appPath, { mode: 'development' })
    expect(configC.defaultTerserOptions.keep_fnames).toBe(true)
    expect(configC.defaultTerserOptions.output.comments).toBe(false)
  })

  test('MiniBaseConfig instances do not share nested defaultTerserOptions', () => {
    const configA = new MiniBaseConfig(appPath, { mode: 'development' })
    const configB = new MiniBaseConfig(appPath, { mode: 'development' })

    expect(configA.defaultTerserOptions).not.toBe(configB.defaultTerserOptions)
    expect(configA.defaultTerserOptions.parse).not.toBe(configB.defaultTerserOptions.parse)
    expect(configA.defaultTerserOptions.compress).not.toBe(configB.defaultTerserOptions.compress)
    expect(configA.defaultTerserOptions.output).not.toBe(configB.defaultTerserOptions.output)

    configA.defaultTerserOptions.parse.ecma = 2020
    configA.defaultTerserOptions.compress.unused = false
    configA.defaultTerserOptions.output.comments = true

    expect(configB.defaultTerserOptions.parse.ecma).toBe(8)
    expect(configB.defaultTerserOptions.compress.unused).toBe(true)
    expect(configB.defaultTerserOptions.output.comments).toBe(false)

    const configC = new MiniBaseConfig(appPath, { mode: 'development' })
    expect(configC.defaultTerserOptions.parse.ecma).toBe(8)
    expect(configC.defaultTerserOptions.compress.unused).toBe(true)
    expect(configC.defaultTerserOptions.output.comments).toBe(false)
  })

  test('runner-utils Terser factories return fresh nested objects on every call', () => {
    const h5First = getDefaultH5TerserOptions()
    h5First.output.comments = true
    expect(getDefaultH5TerserOptions().output.comments).toBe(false)

    const miniFirst = getDefaultMiniTerserOptions()
    miniFirst.output.comments = true
    miniFirst.compress.dead_code = false
    const miniSecond = getDefaultMiniTerserOptions()
    expect(miniSecond.output.comments).toBe(false)
    expect(miniSecond.compress.dead_code).toBe(true)
  })
})
