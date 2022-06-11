import * as path from 'path'

import { build } from '../dist/config/build-component'
import runner from '../dist/index'
import { appPath, config } from './mock/components_testdata'

describe('build_components', () => {
  it('single component', async () => {
    const result = await runner(appPath, {
      ...config,
      nativeComponents: {
        externals: ['react', 'react-native', /@tarojs\/components-rn/, /@babel\/runtime/],
        output: 'dist-single'
      }
    })
    expect(result).toMatchSnapshot()
  })
  it('multiple components', async () => {
    const result = await build(config, {
      input: [
        'components/cell/index',
        'components/navbar/index'
      ],
      sourceRootPath: path.resolve(__dirname, './mock/src'),
      output: path.resolve(__dirname, './mock/dist-multiple'),
      externals: ['react', 'react-native', /@tarojs\/components-rn/, /@tarojs\/taro-rn/, /@babel\/runtime/],
      externalResolve: () => {}
    })
    expect(result).toMatchSnapshot()
  })
})
