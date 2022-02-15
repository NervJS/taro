import { BaseConfig } from './BaseConfig'

import type { H5BuildConfig } from '../utils/types'

export class H5BaseConfig extends BaseConfig {
  constructor (appPath: string, config: Partial<H5BuildConfig>) {
    super(appPath, config)
    this.chain.merge({
      resolve: {
        mainFields: ['main:h5', 'browser', 'module', 'jsnext:main', 'main'],
        alias: {
          '@tarojs/taro': '@tarojs/taro-h5'
        }
      }
    })
  }
}
