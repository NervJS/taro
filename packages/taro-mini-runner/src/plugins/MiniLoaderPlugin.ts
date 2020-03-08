import * as qs from 'querystring'

import * as RuleSet from 'webpack/lib/RuleSet'

import { BUILD_TYPES } from '../utils/constants'

const PLUGIN_NAME = 'MiniLoaderPlugin'
const NS = 'TARO'

interface IOptions {
  sourceDir: string,
  buildAdapter: BUILD_TYPES
}

export default class MiniLoaderPlugin {
  options: IOptions
  constructor (options) {
    this.options = options
  }

  apply (compiler) {
    const {
      sourceDir,
      buildAdapter
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
        buildAdapter
      }
    }
    compiler.options.module.rules = [
      pitcher,
      ...rules
    ]
  }
}
