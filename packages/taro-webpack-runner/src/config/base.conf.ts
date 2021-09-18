import * as path from 'path'
import * as Chain from 'webpack-chain'
import { MultiPlatformPlugin } from '@tarojs/runner-utils'
import { REG_SCRIPTS, pluginRemovePageConfig } from '@tarojs/helper'

import { getRootPath } from '../util'
import { BuildConfig } from '../util/types'

export default (appPath: string, config: Partial<BuildConfig>) => {
  const chain = new Chain()
  let alias = {}

  if (config.framework === 'nerv') {
    alias = {
      react$: 'nervjs',
      'react-dom$': 'nervjs'
    }
  }

  chain.merge({
    resolve: {
      extensions: ['.mjs', '.js', '.jsx', '.ts', '.tsx', '.vue'],
      mainFields: ['main:h5', 'browser', 'module', 'jsnext:main', 'main'],
      symlinks: true,
      modules: [path.join(appPath, 'node_modules'), 'node_modules'],
      alias
    },
    resolveLoader: {
      modules: [path.join(getRootPath(), 'node_modules'), 'node_modules']
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
