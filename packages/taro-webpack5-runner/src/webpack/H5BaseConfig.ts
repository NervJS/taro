import { BaseConfig } from './BaseConfig'

import type { H5BuildConfig } from '../utils/types'

export class H5BaseConfig extends BaseConfig {
  defaultTerserOptions = {
    keep_fnames: true,
    output: {
      comments: false,
      keep_quoted_props: true,
      quote_keys: true,
      beautify: false
    },
    warnings: false
  }

  constructor (appPath: string, config: Partial<H5BuildConfig>) {
    super(appPath, config)
    this.chain.merge({
      resolve: {
        mainFields: ['main:h5', 'browser', 'module', 'jsnext:main', 'main'],
        alias: {
          // Note: link 本地依赖调试，runtime 包需要指向本地 node_modules 顶层的 runtime，保证闭包值 Current 一致，shared 也一样
          '@tarojs/runtime': require.resolve('@tarojs/runtime'),
          '@tarojs/shared': require.resolve('@tarojs/shared/dist/shared.esm.js')
        }
      }
    })

    this.setMinimizer(config, this.defaultTerserOptions)
  }
}
