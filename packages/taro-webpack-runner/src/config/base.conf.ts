import { MultiPlatformPlugin } from '@tarojs/runner-utils'
import * as Chain from 'webpack-chain'

import type { BuildConfig } from '../util/types'

export default (_appPath: string, _config: Partial<BuildConfig>) => {
  const chain = new Chain()
  chain.merge({
    resolve: {
      extensions: ['.mjs', '.js', '.jsx', '.ts', '.tsx', '.vue'],
      mainFields: ['main:h5', 'browser', 'module', 'jsnext:main', 'main'],
      symlinks: true,
      alias: {
        '@tarojs/taro': '@tarojs/taro-h5',
        // 开发组件库时 link 到本地调试，runtime 包需要指向本地 node_modules 顶层的 runtime，保证闭包值 Current 一致，shared 也一样
        '@tarojs/router$': require.resolve('@tarojs/router'),
        '@tarojs/runtime': require.resolve('@tarojs/runtime'),
        '@tarojs/shared': require.resolve('@tarojs/shared/dist/shared.esm.js')
      }
    },
    resolveLoader: {
      modules: ['node_modules']
    }
  })

  chain.resolve
    .plugin('MultiPlatformPlugin')
    .use(MultiPlatformPlugin, ['described-resolve', 'resolve', {
      chain
    }])

  return chain
}
