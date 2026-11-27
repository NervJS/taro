import path from 'node:path'

import { type IRule } from '@tarojs/runner-utils/bundler/config/BundlerModule'
import { BaseMiniModule } from '@tarojs/runner-utils/bundler/config/MiniModule'

import { FILE_COUNTER_MAP } from '../plugins/MiniCompileModePlugin'
import { WebpackModule } from './WebpackModule'

import type { MiniCombination } from './MiniCombination'

export class MiniWebpackModule extends BaseMiniModule<MiniCombination> {
  protected getModuleClass () {
    return WebpackModule
  }

  protected getTemplateLoaderPath () {
    return path.resolve(__dirname, '../loaders/miniTemplateLoader')
  }

  protected getXScriptLoaderPath () {
    return path.resolve(__dirname, '../loaders/miniXScriptLoader')
  }

  protected getXScriptDefaultExt () {
    return 'wxs'
  }

  protected customizeScriptRule (rule: IRule) {
    const { config } = this.combination
    if (config.experimental?.compileMode === true) {
      rule.use.compilerLoader = WebpackModule.getLoader(path.resolve(__dirname, '../loaders/miniCompilerLoader'), {
        platform: config.platform.toUpperCase(),
        template: config.template,
        FILE_COUNTER_MAP,
      })
    }
  }
}
