import { defaultMainFields, resolveSync } from '@tarojs/helper'

import { BaseConfig } from './BaseConfig'

import type { IHarmonyBuildConfig } from '../utils/types'

export class HarmonyBaseConfig extends BaseConfig {
  defaultTerserOptions = {
    keep_fnames: true,
    output: {
      comments: false,
      keep_quoted_props: true,
      quote_keys: true,
      beautify: false,
    },
    warnings: false,
  }

  constructor(appPath: string, config: Partial<IHarmonyBuildConfig>) {
    super(appPath, config)
    const mainFields = [...defaultMainFields]
    const resolveOptions = {
      basedir: appPath,
      mainFields,
    }
    this.chain.merge({
      resolve: {
        mainFields,
        alias: {
          // Note: link 本地依赖调试，runtime 包需要指向本地 node_modules 顶层的 runtime，保证闭包值 Current 一致，shared 也一样
          '@tarojs/runtime': resolveSync('@tarojs/runtime', resolveOptions),
          '@tarojs/shared': resolveSync('@tarojs/shared', resolveOptions),
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
