import { getDefaultMiniTerserOptions } from '@tarojs/runner-utils'
import { getMiniBaseConfigMerge } from '@tarojs/runner-utils/bundler/config/MiniBaseConfig'

import { BaseConfig } from './BaseConfig'

import type { IMiniBuildConfig } from '../utils/types'

export class MiniBaseConfig extends BaseConfig {
  defaultTerserOptions = getDefaultMiniTerserOptions()

  constructor (appPath: string, config: Partial<IMiniBuildConfig>) {
    super(appPath, config)
    this.chain.merge(getMiniBaseConfigMerge(appPath, require.resolve('regenerator-runtime')))
    this.setMinimizer(config, this.defaultTerserOptions)
  }
}
