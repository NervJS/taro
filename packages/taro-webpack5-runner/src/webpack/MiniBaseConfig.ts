import { BaseConfig } from './BaseConfig'

import type { MiniBuildConfig } from '../utils/types'

export class MiniBaseConfig extends BaseConfig {
  constructor (appPath: string, config: Partial<MiniBuildConfig>) {
    super(appPath, config)
    this.chain.merge({
      resolve: {
        mainFields: ['browser', 'module', 'jsnext:main', 'main'],
        alias: {
          // 小程序使用 regenerator-runtime@0.11
          'regenerator-runtime': require.resolve('regenerator-runtime'),
          // 开发组件库时 link 到本地调试，runtime 包需要指向本地 node_modules 顶层的 runtime，保证闭包值 Current 一致，shared 也一样
          '@tarojs/runtime': require.resolve('@tarojs/runtime'),
          '@tarojs/shared': require.resolve('@tarojs/shared/dist/shared.esm.js')
        },
        // [Webpack 4] config.node: { fs: false, path: false }
        // [Webpack 5] config.resolve.fallback
        fallback: {
          fs: false,
          path: false
        }
      },
      optimization: {
        sideEffects: true
      }
    })
  }
}
