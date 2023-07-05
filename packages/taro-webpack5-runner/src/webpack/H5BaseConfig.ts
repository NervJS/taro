import { defaultMainFields, resolveSync } from '@tarojs/helper'

import { BaseConfig } from './BaseConfig'

import type { H5BuildConfig } from '../utils/types'

export class H5BaseConfig extends BaseConfig {
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

  constructor(appPath: string, config: Partial<H5BuildConfig>) {
    super(appPath, config)
    const mainFields = [...defaultMainFields]
    const resolveOptions = {
      basedir: appPath,
      mainFields,
    }
    if (config.mode !== 'production') {
      mainFields.unshift('main:h5')
    }
    this.chain.merge({
      resolve: {
        mainFields,
        alias: {
          // Note: link 本地依赖调试，runtime 包需要指向本地 node_modules 顶层的 runtime，保证闭包值 Current 一致，shared 也一样
          '@tarojs/runtime': resolveSync('@tarojs/runtime', resolveOptions),
          '@tarojs/shared': resolveSync('@tarojs/shared', resolveOptions),
        },
      },
    })

    this.setMinimizer(config, this.defaultTerserOptions)
  }
}
