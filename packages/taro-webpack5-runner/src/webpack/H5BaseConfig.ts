import { getDefaultH5TerserOptions } from '@tarojs/runner-utils'
import { getH5ResolveConfig } from '@tarojs/runner-utils/bundler/config/H5BaseConfig'

import { BaseConfig } from './BaseConfig'

import type { IH5BuildConfig } from '../utils/types'

export class H5BaseConfig extends BaseConfig {
  defaultTerserOptions = getDefaultH5TerserOptions()

  constructor (appPath: string, config: Partial<IH5BuildConfig>) {
    super(appPath, config)
    this.chain.merge({
      resolve: getH5ResolveConfig(appPath, config.mode)
    })
    this.setMinimizer(config, this.defaultTerserOptions)
  }
}
