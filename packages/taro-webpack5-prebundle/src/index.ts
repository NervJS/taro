import { getPlatformType, PLATFORM_TYPE } from '@tarojs/shared'
import webpackDevServer from 'webpack-dev-server'

import BasePrebundle, { IPrebundle } from './prebundle'

import type { EntryObject } from 'webpack'
import type Chain from 'webpack-chain'
import type { IMiniPrebundleConfig } from './mini'
import type { IWebPrebundleConfig } from './web'

export * from './prebundle'

export interface IPrebundleParam {
  env?: string
  platformType?: PLATFORM_TYPE
  appPath?: string
  entry?: EntryObject
  chunkDirectory?: string
  enableSourceMap?: boolean
  entryFileName?: string
  devServer?: webpackDevServer.Configuration
  publicPath?: string
  runtimePath?: string | string[]
  combination: any
}

export default class TaroPrebundle {
  public env: string
  public platformType: PLATFORM_TYPE

  public isBuildPlugin: boolean

  constructor (protected params: IPrebundleParam) {
    const { env = process.env.TARO_ENV || 'h5', combination } = params

    const platform = params.platformType || process.env.TARO_PLATFORM || PLATFORM_TYPE.WEB
    this.isBuildPlugin = combination.isBuildPlugin || false
    this.platformType = getPlatformType(env, platform)
    this.env = env || platform
  }

  get config (): IWebPrebundleConfig | IMiniPrebundleConfig {
    const platformType = this.platformType
    const env = this.env
    const chain = this.params.combination.chain as Chain
    const {
      appPath = process.cwd(),
      chunkDirectory = 'chunk',
      devServer = chain.devServer?.entries(),
      enableSourceMap = false,
      entryFileName = 'app',
      entry = this.entry,
      publicPath = chain.output.get('publicPath') || '/',
      runtimePath,
      combination,
    } = this.params
    let chunkFilename = chain.output.get('chunkFilename') ?? `${chunkDirectory}/[name].js`
    chunkFilename = chunkFilename.replace(/\[([a-z]*hash)[^[\]\s]*\]/ig, '_$1_')
    chain.output.set('chunkFilename', chunkFilename)

    return {
      appPath,
      chain,
      chunkFilename,
      devServer,
      enableSourceMap,
      entryFileName,
      entry,
      env,
      isWatch: combination.config.isWatch || false,
      platformType,
      publicPath,
      runtimePath,
      sourceRoot: combination.sourceRoot || 'src',
      isBuildPlugin: this.isBuildPlugin,
      alias: combination.config.alias,
      defineConstants: combination.config.defineConstants,
    }
  }

  get entry () {
    // NOTE: 如果传入 entry 为字符串， webpack-chain 会识别为 EntryObject，导致报错
    return Object.entries(this.config.chain.entryPoints.entries()).reduce((entry, [key, value]) => {
      entry[key] = value.values()
      return entry
    }, {} as EntryObject)
  }

  async run (options: IPrebundle = {}) {
    if (!options.enable) return

    let prebundleRunner: BasePrebundle

    switch (this.platformType) {
      case 'web':
        prebundleRunner = new (await import('./web')).WebPrebundle(this.config, options)
        break
      default:
        prebundleRunner = new (await import('./mini')).MiniPrebundle(this.config, options)
    }

    return prebundleRunner.run()
  }
}
