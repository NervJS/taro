import * as path from 'path'
import * as Chain from 'webpack-chain'
import { MultiPlatformPlugin } from '@tarojs/runner-utils'
import { isQuickAppPkg } from '@tarojs/helper'

export default (appPath: string) => {
  const chain = new Chain()
  chain.merge({
    externals: [
      /** 快应用自身使用的npm包 */
      function (context, request, callback) {
        if (isQuickAppPkg(request)) {
          return callback(null, 'commonjs ' + request)
        }
        callback()
      }
    ],
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
        '@tarojs/runtime': require.resolve('@tarojs/runtime'),
        '@tarojs/shared': require.resolve('@tarojs/shared')
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

  return chain
}
