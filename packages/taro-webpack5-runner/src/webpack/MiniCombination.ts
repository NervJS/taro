import {
  applyMiniCombinationProcess,
  getMiniAliasConfig,
  getMiniOptimizationConfig,
  getMiniOutputConfig
} from '@tarojs/runner-utils/bundler/config/MiniCombination'

import { componentConfig } from '../utils/component'
import { BuildNativePlugin } from './BuildNativePlugin'
import { Combination } from './Combination'
import { MiniBaseConfig } from './MiniBaseConfig'
import { MiniWebpackModule } from './MiniWebpackModule'
import { MiniWebpackPlugin } from './MiniWebpackPlugin'

import type { IFileType, IMiniBuildConfig } from '../utils/types'

export class MiniCombination extends Combination<IMiniBuildConfig> {
  buildNativePlugin: BuildNativePlugin
  fileType: IFileType
  isBuildPlugin = false
  optimizeMainPackage: { enable?: boolean | undefined, exclude?: any[] | undefined } = {
    enable: true
  }

  process (config: Partial<IMiniBuildConfig>) {
    applyMiniCombinationProcess({
      combination: this,
      config,
      baseConfig: new MiniBaseConfig(this.appPath, config),
      createBuildNativePlugin: () => BuildNativePlugin.getPlugin(this),
      createMiniPlugin: () => new MiniWebpackPlugin(this),
      createMiniModule: () => new MiniWebpackModule(this),
      componentConfig
    })
  }

  getEntry (entry: IMiniBuildConfig['entry']) {
    return this.isBuildPlugin ? this.buildNativePlugin.entry : entry
  }

  getOutput ({ publicPath, globalObject, isBuildPlugin, output }) {
    return getMiniOutputConfig({
      outputDir: this.outputDir,
      publicPath,
      globalObject,
      isBuildPlugin,
      output
    })
  }

  getAlias () {
    return getMiniAliasConfig(this.config)
  }

  getOptimization () {
    return getMiniOptimizationConfig()
  }
}
