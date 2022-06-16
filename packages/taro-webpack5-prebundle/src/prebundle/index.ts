import { chalk, fs, readConfig, resolveMainFilePath } from '@tarojs/helper'
import { IProjectBaseConfig } from '@tarojs/taro/types/compile'
import path from 'path'
import webpack from 'webpack'
import Chain from 'webpack-chain'

import { commitMeta, formatDepsString, getCacheDir, getMeasure, Metadata } from '../utils'
import { scanImports } from './scanImports'

export type IPrebundle = Exclude<IProjectBaseConfig['compiler'], string | undefined>['prebundle']

export interface IPrebundleConfig {
  appPath: string
  chain: Chain
  chunkDirectory?: string
  enableSourceMap: boolean
  entry: webpack.Entry
  entryFileName?: string
  sourceRoot: string
}

export default class BasePrebundle<T extends IPrebundleConfig = IPrebundleConfig> {
  sourceRoot: string
  appPath: string
  cacheDir: string
  chain: Chain
  customEsbuildConfig: IPrebundle['esbuild']
  prebundleCacheDir: string
  remoteCacheDir: string
  metadataPath: string
  metadata: Metadata
  preMetadata: Metadata
  isUseCache: boolean

  measure: ReturnType<typeof getMeasure>

  constructor (protected config: T, protected option: IPrebundle) {
    if (!option.enable) return

    const { appPath, chain, sourceRoot } = this.config
    const { cacheDir = getCacheDir(appPath), esbuild = {}, force } = this.option

    this.chain = chain
    this.sourceRoot = sourceRoot
    this.appPath = appPath
    this.cacheDir = cacheDir
    this.customEsbuildConfig = esbuild
    this.prebundleCacheDir = path.resolve(cacheDir, './prebundle')
    this.remoteCacheDir = path.resolve(cacheDir, './remote')
    this.metadataPath = path.join(cacheDir, 'metadata.json')
    this.metadata = {}
    this.preMetadata = {}

    try {
      if (force !== true) {
        Object.assign(this.preMetadata, fs.readJSONSync(this.metadataPath))
      }
    } catch (e) {}

    this.run().then(() => {
      if (!this.isUseCache) {
        commitMeta(appPath, this.metadataPath, this.metadata)
      }
    })
  }

  async run () {
    throw new Error('未实现依赖预加载方法')
  }

  addPlugin (name: string, plugin: any, ...args: Record<string, any>[]) {
    this.chain.plugin(name).use(plugin, args)
  }

  /** 找出所有 webpack entry */
  getEntries (appJsPath: string) {
    const { appPath, sourceRoot } = this.config
    const entries: string[] = []
    entries.push(appJsPath)

    const appConfigPath = resolveMainFilePath(`${appJsPath.replace(path.extname(appJsPath), '')}.config`)
    const appConfig = readConfig(appConfigPath)

    appConfig.pages.forEach((page: string) => {
      const pageJsPath = resolveMainFilePath(path.join(appPath, sourceRoot, page))
      entries.push(pageJsPath)
    })
    return entries
  }

  async getDeps (entries, include: string[] = [], exclude: string[] = []) {
    const SCAN_START = performance.now()

    const deps = await scanImports({
      appPath: this.appPath,
      customEsbuildConfig: this.customEsbuildConfig,
      entries,
      exclude,
      include
    })

    deps.size &&
      console.log(
        chalk.cyan('Prebundle dependencies: \n', ...JSON.parse(formatDepsString(deps)).map(dep => `    ${dep[0]}\n`))
      )

    this.measure('Scan imports duration', SCAN_START)

    return deps
  }
}
