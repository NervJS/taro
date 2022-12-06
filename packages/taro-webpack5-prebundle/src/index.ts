import webpackDevServer from 'webpack-dev-server'

import BasePrebundle, { IPrebundle } from './prebundle'

import type { EntryObject } from 'webpack'
import type Chain from 'webpack-chain'
import type { IH5PrebundleConfig } from './h5'
import type { IMiniPrebundleConfig } from './mini'

export * from './prebundle'

export interface IPrebundleParam {
  env?: string

  appPath?: string
  sourceRoot?: string
  chain: Chain
  entry?: EntryObject
  chunkDirectory?: string
  enableSourceMap?: boolean
  entryFileName?: string

  isWatch?: boolean
  devServer?: webpackDevServer.Configuration
  publicPath?: string
  runtimePath?: string | string[]
}

export default class TaroPrebundle {
  public env: string

  constructor (protected params: IPrebundleParam) {
    const { env = process.env.TARO_ENV || 'h5' } = params
    this.env = env
  }

  get config (): IH5PrebundleConfig | IMiniPrebundleConfig {
    const env = this.env
    const {
      appPath = process.cwd(),
      chain,
      chunkDirectory = 'chunk',
      devServer = chain.devServer?.entries(),
      enableSourceMap = false,
      entryFileName = 'app',
      entry = this.entry,
      isWatch = false,
      publicPath = chain.output.get('publicPath') || '/',
      runtimePath,
      sourceRoot = 'src'
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
      isWatch,
      publicPath,
      runtimePath,
      sourceRoot
    }
  }

  get entry () {
    // NOTE: 如果传入 entry 为字符串， webpack-chain 会识别为 EntryObject，导致报错
    return Object.entries(this.params.chain.entryPoints.entries()).reduce((entry, [key, value]) => {
      entry[key] = value.values()
      return entry
    }, {} as EntryObject)
  }

  async run (options: IPrebundle) {
    if (!options.enable) return

    let prebundleRunner: BasePrebundle

    switch (this.env) {
      case 'h5':
        prebundleRunner = new (await import('./h5')).H5Prebundle(this.config, options)
        break
      default:
        prebundleRunner = new (await import('./mini')).MiniPrebundle(this.config, options)
    }

    return prebundleRunner.run()
  }
}
