import {
  applyH5CombinationProcess,
  getH5OptimizationConfig,
  getH5OutputConfig
} from '@tarojs/runner-utils/bundler/config/H5Combination'
import VirtualModulesPlugin from 'webpack-virtual-modules'

import { componentConfig } from '../utils/component'
import { Combination } from './Combination'
import { H5BaseConfig } from './H5BaseConfig'
import { H5WebpackModule } from './H5WebpackModule'
import { H5WebpackPlugin } from './H5WebpackPlugin'
import WebpackPlugin from './WebpackPlugin'

import type { Configuration } from 'webpack'
import type AppHelper from '../utils/app'
import type { IH5BuildConfig } from '../utils/types'

type Output = Required<Configuration>['output']
type Optimization = Required<Configuration>['optimization']

export class H5Combination extends Combination<IH5BuildConfig> {
  appHelper: AppHelper
  webpackPlugin = new H5WebpackPlugin(this)
  webpackModule = new H5WebpackModule(this)

  isMultiRouterMode = false
  isVirtualEntry = false

  /** special mode */
  noInjectGlobalStyle = false

  constructor (appPath: string, config: IH5BuildConfig) {
    super(appPath, config)
    this.noInjectGlobalStyle = !!config.noInjectGlobalStyle
  }

  process (config: Partial<IH5BuildConfig>) {
    applyH5CombinationProcess({
      combination: this,
      config,
      baseConfig: new H5BaseConfig(this.appPath, config),
      bundlerPlugin: this.webpackPlugin,
      bundlerModule: this.webpackModule,
      componentConfig,
      getVirtualModulePlugin: () => VirtualModulesPlugin,
      getPlugin: WebpackPlugin.getPlugin
    })
  }

  getOutput ({
    publicPath = '/', chunkDirectory, customOutput = {}, entryFileName = 'app'
  }: {
    publicPath: string
    chunkDirectory: IH5BuildConfig['chunkDirectory']
    customOutput?: Output
    entryFileName?: string
  }): Output {
    const filename: Output['filename'] = (chunk) => chunk.runtime === entryFileName ? 'js/[name].js' : '[name].js'
    return getH5OutputConfig({
      outputDir: this.outputDir,
      publicPath,
      chunkDirectory,
      customOutput,
      filename
    })
  }

  getOptimization (nodeEnv: string) {
    return getH5OptimizationConfig({
      nodeEnv,
      isBuildNativeComp: this.isBuildNativeComp
    }) as Optimization
  }
}
