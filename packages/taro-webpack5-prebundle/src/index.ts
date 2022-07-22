import { EntryObject } from 'webpack'
import Chain from 'webpack-chain'
import webpackDevServer from 'webpack-dev-server'

import { IH5PrebundleConfig } from './h5'
import { IMiniPrebundleConfig } from './mini'
import BasePrebundle, { IPrebundle } from './prebundle'

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
      publicPath = chain.output.get('publicPath') || '/',
      runtimePath,
      sourceRoot = 'src'
    } = this.params
    const chunkFilename = chain.output.get('chunkFilename') ?? `${chunkDirectory}/[name].js`

    return {
      appPath,
      chain,
      chunkFilename,
      devServer,
      enableSourceMap,
      entryFileName,
      entry: typeof entry === 'string' ? { [entryFileName]: entry } : entry,
      env,
      publicPath,
      runtimePath,
      sourceRoot
    }
  }

  get entry () {
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
