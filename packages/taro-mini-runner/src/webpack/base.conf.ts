import { defaultMainFields } from '@tarojs/helper'
import { MultiPlatformPlugin } from '@tarojs/runner-utils'
import * as Chain from 'webpack-chain'

export default (_appPath: string) => {
  const chain = new Chain()
  chain.merge({
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.mjs', '.vue'],
      mainFields: [...defaultMainFields],
      symlinks: true,
      alias: {
        // 小程序使用 regenerator-runtime@0.11
        'regenerator-runtime': require.resolve('regenerator-runtime'),
        // 开发组件库时 link 到本地调试，runtime 包需要指向本地 node_modules 顶层的 runtime，保证闭包值 Current 一致，shared 也一样
        '@tarojs/runtime': require.resolve('@tarojs/runtime/dist/runtime.esm.js'),
        '@tarojs/shared': require.resolve('@tarojs/shared/dist/shared.esm.js'),
      },
    },
    resolveLoader: {
      modules: ['node_modules'],
    },
    optimization: {
      sideEffects: true,
    },
    node: {
      fs: 'empty',
      path: 'empty',
    },
  })

  chain.resolve.plugin('MultiPlatformPlugin').use(MultiPlatformPlugin, [
    'described-resolve',
    'resolve',
    {
      chain,
    },
  ])

  return chain
}
