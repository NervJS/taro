import * as path from 'path'
import * as Chain from 'webpack-chain'
import { MultiPlatformPlugin } from '@tarojs/runner-utils'
import { REG_SCRIPTS, pluginRemovePageConfig } from '@tarojs/helper'

export default (appPath: string) => {
  const chain = new Chain()
  chain.merge({
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.mjs', '.vue'],
      mainFields: ['browser', 'module', 'jsnext:main', 'main'],
      symlinks: true,
      modules: [
        'node_modules',
        path.join(appPath, 'node_modules')
      ],
      alias: {
        // 小程序使用 regenerator-runtime@0.11
        'regenerator-runtime': require.resolve('regenerator-runtime'),
        // 开发组件库时 link 到本地调试，runtime 包需要指向本地 node_modules 顶层的 runtime，保证闭包值 Current 一致，shared 也一样
        '@tarojs/runtime': require.resolve('@tarojs/runtime')
      }
    },
    resolveLoader: {
      modules: [
        'node_modules'
      ]
    },
    optimization: {
      sideEffects: true
    }
  })

  chain.resolve
    .plugin('MultiPlatformPlugin')
    .use(MultiPlatformPlugin, ['described-resolve', 'resolve', {
      chain
    }])

  chain.module
    .rule('pageconfig')
    .test(REG_SCRIPTS)
    .enforce('post')
    .use('babelLoader')
    .loader('babel-loader')
    .tap((options: any) => {
      const existingPlugins: any[] = []

      if (options && options.plugins) {
        existingPlugins.push(...options.plugins)
      }

      options = {
        ...options,
        plugins: [
          ...existingPlugins,
          pluginRemovePageConfig
        ]
      }

      return options
    })

  return chain
}
