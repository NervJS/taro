import { BaseBundlerConfig } from '@tarojs/runner-utils/bundler/config/BaseConfig'
import Chain from 'webpack-chain'

import WebpackPlugin from './WebpackPlugin'

import type { IH5BuildConfig, IHarmonyBuildConfig, IMiniBuildConfig } from '../utils/types'

type Config = Partial<IMiniBuildConfig | IH5BuildConfig | IHarmonyBuildConfig>

export class BaseConfig extends BaseBundlerConfig<Chain, Config> {
  constructor (appPath: string, config: Config) {
    super(appPath, config, new Chain(), { pluginHelper: WebpackPlugin })
  }
}
