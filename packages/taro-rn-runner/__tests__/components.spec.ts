import runner from '../dist/index'
import { build } from '../dist/config/build-component'
import { appPath, config } from './mock/components_testdata'
import * as path from 'path'

describe('build_components', () => {
  it('single component', async () => {
    await runner(appPath, {
      ...config,
      nativeComponents: {
        externals: ['react', 'react-native', /@tarojs\/components-rn/, /@babel\/runtime/],
        output: 'dist-single'
      }
    })
  })
  it('multiple components', async () => {
    await build(config, {
      input: [
        'components/cell/index',
        'components/navbar/index'
      ],
      sourceRootPath: path.resolve(__dirname, './mock/src'),
      output: path.resolve(__dirname, './mock/dist-multiple'),
      externals: ['react', 'react-native', /@tarojs\/components-rn/, /@tarojs\/taro-rn/, /@babel\/runtime/],
      externalResolve: () => {}
    })
  })
})
