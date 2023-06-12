import { defaultMainFields } from '@tarojs/helper'

import { BaseConfig } from './BaseConfig'

import type { MiniBuildConfig } from '../utils/types'

export class MiniBaseConfig extends BaseConfig {
  defaultTerserOptions = {
    parse: {
      ecma: 8,
    },
    compress: {
      ecma: 5,
      warnings: false,
      arrows: false,
      collapse_vars: false,
      comparisons: false,
      computed_props: false,
      hoist_funs: false,
      hoist_props: false,
      hoist_vars: false,
      inline: false,
      loops: false,
      negate_iife: false,
      properties: false,
      reduce_funcs: false,
      reduce_vars: false,
      switches: false,
      toplevel: false,
      typeofs: false,
      booleans: true,
      if_return: true,
      sequences: true,
      unused: true,
      conditionals: true,
      dead_code: true,
      evaluate: true,
    },
    output: {
      ecma: 5,
      comments: false,
      ascii_only: true,
    },
  }

  constructor(appPath: string, config: Partial<MiniBuildConfig>) {
    super(appPath, config)
    this.chain.merge({
      resolve: {
        mainFields: [...defaultMainFields],
        alias: {
          // 小程序使用 regenerator-runtime@0.11
          'regenerator-runtime': require.resolve('regenerator-runtime'),
          // 开发组件库时 link 到本地调试，runtime 包需要指向本地 node_modules 顶层的 runtime，保证闭包值 Current 一致，shared 也一样
          '@tarojs/runtime': require.resolve('@tarojs/runtime'),
          '@tarojs/shared': require.resolve('@tarojs/shared/dist/shared.esm.js'),
        },
        // [Webpack 4] config.node: { fs: false, path: false }
        // [Webpack 5] config.resolve.fallback
        fallback: {
          fs: false,
          path: false,
        },
      },
      optimization: {
        sideEffects: true,
      },
      performance: {
        maxEntrypointSize: 2 * 1000 * 1000,
      },
    })

    this.setMinimizer(config, this.defaultTerserOptions)
  }
}
