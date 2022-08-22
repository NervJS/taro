import { getRNConfigBabelPlugin, getRNConfigEntry, getRNConfigOutput, getRNConfigTransformer } from '../src/config/config-holder'

const path = require('path')

describe('init', () => {
  const spy = jest.spyOn(process, 'cwd')
  spy.mockReturnValue(path.resolve(__dirname, '', 'mock'))
  process.env = {
    NODE_ENV: 'development'
  }

  it('getRNConfigOutput', () => {
    expect(getRNConfigOutput('ios')).toEqual('iosbundle/main.bundle')
  })

  it('getRNConfigEntry', () => {
    expect(getRNConfigEntry()).toEqual('app')
  })

  it('getRNConfigTransformer', () => {
    expect(getRNConfigTransformer()).toEqual([
      'metro/transformer'
    ])
  })

  it('getRNConfigBabelPlugin', () => {
    const babelPlugin = [
      '/absulute/path/plugin/filename',
      '@tarojs/plugin-mock',
      ['@tarojs/plugin-mock'],
      ['@tarojs/plugin-mock', {}]
    ]
    expect(getRNConfigBabelPlugin()).toEqual(babelPlugin)
  })
})
