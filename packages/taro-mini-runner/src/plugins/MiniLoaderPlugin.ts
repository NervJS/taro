import * as qs from 'querystring'

import * as RuleSet from 'webpack/lib/RuleSet'

import { IFileType } from '../utils/types'

const PLUGIN_NAME = 'MiniLoaderPlugin'
const NS = 'TARO'

interface IOptions {
  sourceDir: string,
  fileType: IFileType,
  isBuildPlugin: boolean
}

export default class MiniLoaderPlugin {
  options: IOptions
  constructor (options) {
    this.options = options
  }

  apply (compiler) {
    const {
      sourceDir,
      fileType,
      isBuildPlugin
    } = this.options
    compiler.hooks.compilation.tap(PLUGIN_NAME, compilation => {
      const normalModuleLoader = compilation.hooks.normalModuleLoader
        normalModuleLoader.tap(PLUGIN_NAME, loaderContext => {
          loaderContext[NS] = true
        })
    })
    const rawRules = compiler.options.module.rules
    const { rules } = new RuleSet(rawRules)

    const pitcher = {
      loader: require.resolve('../loaders/pitcher'),
      resourceQuery: query => {
        const parsed = qs.parse(query.slice(1))
        return parsed.taro != null
      },
      options: {
        sourceDir,
        fileType,
        isBuildPlugin
      }
    }
    compiler.options.module.rules = [
      pitcher,
      ...rules
    ]
  }
}
