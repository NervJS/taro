import * as path from 'path'

import runner from '../dist/index'
import { build } from '../src/config/build-component'
import { appPath, config } from './mock/components_testdata'

describe('build_components', () => {
  // metro runServer 容易超时
  const spy = jest.spyOn(process, 'cwd')
  spy.mockReturnValue(path.resolve(__dirname, '', 'mock'))

  jest.setTimeout(300000)

  it('single component', async () => {
    const result = await runner(appPath, {
      ...config,
      nativeComponents: {
        externals: ['react', 'react-native', /@tarojs\/components-rn/, /@babel\/runtime/],
        output: 'dist/single'
      }
    })
    expect(result).toMatchSnapshot()
  })

  it('multiple components', async () => {
    const result = await build(config, {
      input: ['components/cell/index', 'components/navbar/index'],
      sourceRootPath: path.resolve(__dirname, './mock/src'),
      output: path.resolve(__dirname, './mock/dist/multiple'),
      externals: ['react', 'react-native', /@tarojs\/components-rn/, /@tarojs\/taro-rn/, /@babel\/runtime/],
      externalResolve: () => {}
    })
    expect(result).toMatchSnapshot()
  })

  it('modify rollup config', async () => {
    const result = await build(config, {
      input: ['components/cell/index', 'components/navbar/index'],
      sourceRootPath: path.resolve(__dirname, './mock/src'),
      modifyRollupConfig: config => {
        const { input, ...others } = config
        return {
          ...others,
          input: Object.entries(input as Record<string, string>).reduce(
            (pre, cur) => Object.assign(pre, { [cur[0].replace('components/', '')]: cur[1] }),
            {}
          ),
          output: { dir: path.resolve(__dirname, './mock/dist/modify-config') }
        }
      }
    })
    expect(result).toMatchSnapshot()
  })

  it('svg transform', async () => {
    const result = await build(config, {
      input: ['components/svg/index'],
      sourceRootPath: path.resolve(__dirname, './mock/src'),
      output: path.resolve(__dirname, './mock/dist/svg'),
      externals: ['react', 'react-native', /@tarojs\/components-rn/, /@tarojs\/taro-rn/, /@babel\/runtime/],
      externalResolve: () => {}
    })
    expect(result).toMatchSnapshot()
  })

  it('named export', async () => {
    const result = await build(config, {
      input: ['utils/namedExport/index'],
      sourceRootPath: path.resolve(__dirname, './mock/src'),
      externalResolve: () => {},
      output: path.resolve(__dirname, './mock/dist/named-export')
    })
    expect(result).toMatchSnapshot()
  })

  it('dynamic require', async () => {
    const result = await build(config, {
      input: ['utils/dynamicImport/index'],
      sourceRootPath: path.resolve(__dirname, './mock/src'),
      externalResolve: () => {},
      output: path.resolve(__dirname, './mock/dist/dynamic-import')
    })
    expect(result).toMatchSnapshot()
  })

  it('require react-native component', async () => {
    const result = await build(config, {
      input: ['utils/requireReactNative/index'],
      sourceRootPath: path.resolve(__dirname, './mock/src'),
      externalResolve: () => {},
      output: path.resolve(__dirname, './mock/dist/require-native')
    })
    expect(result).toMatchSnapshot()
  })

  it('require react-native component', async () => {
    const result = await build(config, {
      input: ['utils/requireReactNative/index'],
      sourceRootPath: path.resolve(__dirname, './mock/src'),
      externalResolve: () => {},
      output: path.resolve(__dirname, './mock/dist/require-native')
    })
    expect(result).toMatchSnapshot()
  })
})
