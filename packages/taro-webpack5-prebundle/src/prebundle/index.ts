import { Config } from '@swc/core'
import { chalk, fs, readConfig, resolveMainFilePath, terminalLink } from '@tarojs/helper'
import { IProjectBaseConfig } from '@tarojs/taro/types/compile'
import { Message } from 'esbuild'
import path from 'path'
import { performance } from 'perf_hooks'
import { EntryObject } from 'webpack'
import Chain from 'webpack-chain'

import { commitMeta, getBundleHash, getCacheDir, getMeasure, Metadata, sortDeps } from '../utils'
import { CollectedDeps, MF_NAME } from '../utils/constant'
import TaroModuleFederationPlugin from '../webpack/TaroModuleFederationPlugin'
import { bundle } from './bundle'
import { scanImports } from './scanImports'

export type IPrebundle = Exclude<IProjectBaseConfig['compiler'], string | undefined>['prebundle']

export interface IPrebundleConfig {
  appPath: string
  chain: Chain
  chunkFilename?: string
  enableSourceMap: boolean
  entry: EntryObject
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
  customSwcConfig?: Config
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
    const { cacheDir = getCacheDir(appPath, env), esbuild = {}, force, swc } = this.option

    this.chain = chain
    this.sourceRoot = sourceRoot
    this.appPath = appPath
    this.cacheDir = cacheDir
    this.customEsbuildConfig = esbuild
    this.customSwcConfig = swc
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
    const appJsPath = entry[entryFileName] || ''
    if (typeof appJsPath === 'string') {
      return appJsPath
    } else if (appJsPath instanceof Array) {
      return appJsPath[0]
    } else if (typeof appJsPath.import === 'string') {
      return appJsPath.import
    }
    return ''
  }

  parseEntries (entry: EntryObject = {}) {
    const entries: string[] = []
    Object.values(entry).forEach(e => {
      if (typeof e === 'string') {
        entries.push(e)
      } else if (e instanceof Array) {
        entries.push(...this.parseEntries(e as any))
      } else if (typeof e.import === 'string') {
        entries.push(e.import)
      } else if (e.import instanceof Array) {
        entries.push(...this.parseEntries(e.import as any))
      }
    })
    return entries
  }

  /** 找出所有 webpack entry */
  getEntries (appJsPath: string) {
    const { appPath, sourceRoot } = this.config
    const entries: string[] = this.parseEntries(this.config.entry)

    const appConfigPath = resolveMainFilePath(`${appJsPath.replace(path.extname(appJsPath), '')}.config`)
    if (fs.existsSync(appConfigPath)) {
      const appConfig = readConfig(appConfigPath)

      appConfig.pages.forEach((page: string) => {
        const pageJsPath = resolveMainFilePath(path.join(appPath, sourceRoot, page))
        entries.push(pageJsPath)
      })
    }
    return entries
  }

  async setDeps (entries: string[], include: string[] = [], exclude: string[] = []) {
    const SCAN_START = performance.now()

    await scanImports({
      appPath: this.appPath,
      customEsbuildConfig: this.customEsbuildConfig,
      entries,
      include,
      exclude,
    }, this.deps)

    this.deps.size &&
      console.log(
        chalk.cyan(
          'Prebundle dependencies: \n',
          ...Array.from(this.deps.keys()).sort(sortDeps).map(dep => `    ${dep}\n`)
        )
      )

    this.measure('Scan imports duration', SCAN_START)
  }

  async bundle () {
    const PREBUNDLE_START = performance.now()

    this.metadata.bundleHash = await getBundleHash(this.appPath, this.deps, this.chain, this.cacheDir)

    if (this.preMetadata.bundleHash !== this.metadata.bundleHash) {
      this.isUseCache = false
      try {
        await bundle({
          appPath: this.appPath,
          deps: this.deps,
          chain: this.chain,
          prebundleOutputDir: this.prebundleCacheDir,
          customEsbuildConfig: this.customEsbuildConfig,
          customSwcConfig: this.customSwcConfig,
        })
      } catch (result) {
        return this.handleBundleError(result?.errors)
      }
    }

    this.measure('Prebundle duration', PREBUNDLE_START)
  }

  handleBundleError (errors: Message[] = []) {
    const keys = Array.from(this.deps.keys())
    if (errors.length > 0) {
      const deps = errors.reduce((p, e) => {
        const file = e.location?.file || ''
        const key = keys.find(key => file?.includes(key))
        if (key) p.push(key)
        return p
      }, [] as string[])
      deps.forEach(key => this.deps.delete(key))
      if (deps.length > 0) {
        console.log(
          chalk.yellowBright(
            `检测到依赖编译错误，已跳过`, deps.sort(sortDeps).map(e => chalk.bold(e)).join('、'),`依赖预编译。`,
            `\n    > 可以通过手动配置 ${
              terminalLink('compiler.prebundle.exclude', 'https://nervjs.github.io/taro-docs/docs/next/config-detail#compilerprebundleexclude')
            } 忽略该提示`
          ),
        )
      } else {
        console.log(chalk.yellowBright(...errors))
      }
      return this.bundle()
    }
  }

  setHost (publicPath = '') {
    this.chain
      .plugin('TaroModuleFederationPlugin')
      .use(TaroModuleFederationPlugin, [{
        name: 'taro-app',
        remotes: {
          [MF_NAME]: `${MF_NAME}@${publicPath}remoteEntry.js`
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
