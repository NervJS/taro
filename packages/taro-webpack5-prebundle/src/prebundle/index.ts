import { chalk, fs, readConfig, resolveMainFilePath } from '@tarojs/helper'
import { IProjectBaseConfig } from '@tarojs/taro/types/compile'
import path from 'path'
import { performance } from 'perf_hooks'
import webpack from 'webpack'
import Chain from 'webpack-chain'

import { commitMeta, formatDepsString, getBundleHash, getCacheDir, getMeasure, Metadata } from '../utils'
import { CollectedDeps, MF_NAME } from '../utils/constant'
import TaroModuleFederationPlugin from '../webpack/TaroModuleFederationPlugin'
import { bundle } from './bundle'
import { scanImports } from './scanImports'

export type IPrebundle = Exclude<IProjectBaseConfig['compiler'], string | undefined>['prebundle']

export interface IPrebundleConfig {
  appPath: string
  chain: Chain
  chunkDirectory?: string
  enableSourceMap: boolean
  entry: webpack.EntryObject
  entryFileName?: string
  env: string
  sourceRoot: string
}

export default class BasePrebundle<T extends IPrebundleConfig = IPrebundleConfig> {
  sourceRoot: string
  appPath: string
  cacheDir: string
  chain: Chain
  customEsbuildConfig: IPrebundle['esbuild']
  env: string
  prebundleCacheDir: string
  remoteCacheDir: string
  metadataPath: string
  metadata: Metadata
  preMetadata: Metadata
  isUseCache = true

  deps: CollectedDeps = new Map()
  measure: ReturnType<typeof getMeasure>

  constructor (protected config: T, protected option: IPrebundle) {
    if (!option.enable) return

    const { appPath, env, chain, sourceRoot } = this.config
    const { cacheDir = getCacheDir(appPath, env), esbuild = {}, force } = this.option

    this.chain = chain
    this.sourceRoot = sourceRoot
    this.appPath = appPath
    this.cacheDir = cacheDir
    this.customEsbuildConfig = esbuild
    this.env = env
    this.prebundleCacheDir = path.resolve(cacheDir, './prebundle')
    this.remoteCacheDir = path.resolve(cacheDir, './remote')
    this.metadataPath = path.join(cacheDir, 'metadata.json')
    this.metadata = {}
    this.preMetadata = {}

    this.measure = getMeasure(this.option.timings)

    try {
      if (force !== true) {
        Object.assign(this.preMetadata, fs.readJSONSync(this.metadataPath))
      }
    } catch (e) {}
  }

  async run () {
    if (!this.isUseCache) {
      commitMeta(this.appPath, this.metadataPath, this.metadata)
    }
  }

  addPlugin (name: string, plugin: any, ...args: Record<string, any>[]) {
    this.chain.plugin(name).use(plugin, args)
  }

  get entryPath () {
    const { entryFileName = 'app', entry = {} } = this.config
    return entry[entryFileName][0]
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

  async setDeps (entries: string[], include: string[] = [], exclude: string[] = []) {
    const SCAN_START = performance.now()

    await scanImports({
      appPath: this.appPath,
      customEsbuildConfig: this.customEsbuildConfig,
      entries,
      exclude,
      include
    }, this.deps)

    this.deps.size &&
      console.log(
        chalk.cyan('Prebundle dependencies: \n', ...JSON.parse(formatDepsString(this.deps)).map(dep => `    ${dep[0]}\n`))
      )

    this.measure('Scan imports duration', SCAN_START)
  }

  async bundle () {
    const PREBUNDLE_START = performance.now()

    this.metadata.bundleHash = await getBundleHash(this.appPath, this.deps, this.chain, this.cacheDir)

    if (this.preMetadata.bundleHash !== this.metadata.bundleHash) {
      this.isUseCache = false
      await bundle(this.appPath, this.deps, this.chain, this.prebundleCacheDir, this.customEsbuildConfig)
    }

    this.measure('Prebundle duration', PREBUNDLE_START)
  }

  setHost () {
    this.chain
      .plugin('TaroModuleFederationPlugin')
      .use(TaroModuleFederationPlugin, [{
        name: 'taro-app',
        remotes: {
          [MF_NAME]: `${MF_NAME}@remoteEntry.js`
        }
      },
      {
        deps: this.deps,
        env: this.env,
        remoteAssets: this.metadata.remoteAssets,
        runtimeRequirements: this.metadata.runtimeRequirements || new Set()
      }])
  }
}
