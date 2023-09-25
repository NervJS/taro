import { getPlatformType, PLATFORM_TYPE } from '@tarojs/shared'
import path from 'path'
import webpackDevServer from 'webpack-dev-server'

import BasePrebundle, { IPrebundle } from './prebundle'
import { type IWebPrebundleConfig, VirtualModule } from './web'

import type { Compiler, EntryObject } from 'webpack'
import type Chain from 'webpack-chain'
import type { IMiniPrebundleConfig } from './mini'

export * from './prebundle'

export interface IPrebundleParam {
  env?: string
  platformType?: PLATFORM_TYPE

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
  isBuildPlugin?: boolean
}

export default class TaroPrebundle {
  public env: string
  public platformType: PLATFORM_TYPE

  public isBuildPlugin: boolean

  protected options: IPrebundle

  constructor (protected params: IPrebundleParam) {
    const { env = process.env.TARO_ENV || 'h5', isBuildPlugin = false } = params

    const platform = params.platformType || process.env.TARO_PLATFORM || PLATFORM_TYPE.WEB
    this.isBuildPlugin = isBuildPlugin
    this.platformType = getPlatformType(env, platform)
    this.env = env || platform
  }

  get config (): IWebPrebundleConfig | IMiniPrebundleConfig {
    const platformType = this.platformType
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
      sourceRoot = 'src',
      isBuildPlugin
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
      platformType,
      publicPath,
      runtimePath,
      sourceRoot,
      isBuildPlugin
    }
  }

  get entry () {
    // NOTE: 如果传入 entry 为字符串， webpack-chain 会识别为 EntryObject，导致报错
    return Object.entries(this.params.chain.entryPoints.entries()).reduce((entry, [key, value]) => {
      entry[key] = value.values()
      return entry
    }, {} as EntryObject)
  }

  async run (options: IPrebundle = {}) {
    this.options = options
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

  async postCompilerStart (compiler: Compiler) {
    if (!this.options.enable) return

    if (this.platformType === 'web') {
      VirtualModule.apply(compiler)

      Object.values(this.entry).forEach((item) => {
        let resource = ''
        if (Array.isArray(item)) {
          resource = item[0]
        } else if (typeof item === 'string') {
          resource = item
        } else if (typeof item.import === 'string') {
          resource = item.import
        } else {
          resource = item.import[0]
        }
        const { dir, name } = path.parse(resource)
        const filePath = path.join(dir, name).replace(/\.config/, '')
        const bootPath = path.relative(this.config.appPath, `${filePath}.boot.js`)
        VirtualModule.writeModule(bootPath, '/** bootstrap application code */')
      })
    }
  }
}
