import path from 'node:path'

import { normalizePath } from '@tarojs/helper'
import {
  type ISubCommonDepInfo,
  collectExistingSubCommonDeps,
  hasMainPackageChunk,
  isExcludeSplitModule,
  isMultiSubPackageDep,
  loadMiniSubPackages,
  processSubPackageSplitAssets,
  SUB_COMMON_DIR,
  SUB_VENDORS_NAME
} from '@tarojs/runner-utils/bundler/splitChunks'
import md5 from 'md5'

import type { Chunk, Compilation, Compiler, Module, sources } from '@rspack/core'
import type { SubPackage } from '@tarojs/taro'
import type { MiniCombination } from '../rspack/mini'
import type { IFileType } from '../utils/rspack'

const PLUGIN_NAME = 'MiniSplitChunkPlugin'

interface MiniSplitChunksPluginOption {
  exclude?: (string | ((module: Module) => boolean))[]
  fileType: IFileType
  combination: MiniCombination
}

export default class MiniSplitChunksPlugin {
  combination: MiniCombination
  subCommonDeps = new Map<string, ISubCommonDepInfo>()
  subCommonChunks = new Map<string, Set<string>>()
  subPackagesVendors = new Map<string, Chunk>()
  distPath = ''
  exclude: (string | ((module: Module) => boolean))[]
  subPackages: SubPackage[] = []
  subRoots: string[] = []
  subRootRegExps: RegExp[] = []
  fileType: IFileType

  constructor (options: MiniSplitChunksPluginOption) {
    this.exclude = options.exclude || []
    this.fileType = options.fileType || {
      style: '.wxss',
      config: '.json',
      script: '.js',
      templ: '.wxml',
      xs: '.wxs'
    }
    this.combination = options.combination
    try {
      const { subPackages, subRoots, subRootRegExps } = loadMiniSubPackages(
        this.combination.config.entry,
        this.combination.config
      )
      this.subPackages = subPackages
      this.subRoots = subRoots
      this.subRootRegExps = subRootRegExps
    } catch {
      // Ignore if appConfig is not yet readable at combination init
    }
  }

  public getCacheGroups (): Record<string, any> {
    if (this.subRoots.length === 0) return {}

    const cacheGroups: Record<string, any> = {}

    // 1. Sub-package exclusive vendors -> <subRoot>/sub-vendors
    this.subRoots.forEach(subRoot => {
      const subRootReg = new RegExp(`^${subRoot}\\/`)
      cacheGroups[`subVendors_${subRoot}`] = {
        test: (module: any, { chunkGraph }: any) => {
          if (isExcludeSplitModule(module, this.exclude)) return false
          if (!chunkGraph?.getModuleChunksIterable) return false
          const chunks = Array.from(chunkGraph.getModuleChunksIterable(module)) as Chunk[]
          return chunks.length > 0 && chunks.every(chunk => chunk.name && subRootReg.test(chunk.name))
        },
        name: normalizePath(path.join(subRoot, SUB_VENDORS_NAME)),
        minChunks: 2,
        priority: 10000
      }
    })

    // 2. Shared across >=2 sub-packages and NOT in main package -> sub-common/<md5>
    cacheGroups.subCommon = {
      test: (module: any, { chunkGraph }: any) => {
        if ((module as any).external) return false
        if (isExcludeSplitModule(module, this.exclude)) return false
        if (!chunkGraph?.getModuleChunksIterable) return false

        const chunks = Array.from(chunkGraph.getModuleChunksIterable(module)) as Chunk[]
        const chunkNames = chunks.map(c => c.name || '').filter(Boolean)
        if (chunkNames.length < 2) return false
        if (hasMainPackageChunk(chunkNames, this.subRootRegExps) || !isMultiSubPackageDep(chunkNames, this.subRoots)) {
          return false
        }

        const resource = (module as any).resource || (typeof module.nameForCondition === 'function' ? module.nameForCondition() : '') || ''
        const idStr = resource || (typeof module.identifier === 'function' ? module.identifier() : '')
        if (!idStr) return false

        const depName = md5(idStr)
        this.subCommonDeps.set(depName, {
          identifier: idStr,
          resource,
          chunks: new Set(chunkNames)
        })
        return true
      },
      name: (module: any) => {
        const resource = (module as any).resource || (typeof module.nameForCondition === 'function' ? module.nameForCondition() : '') || ''
        const idStr = resource || (typeof module.identifier === 'function' ? module.identifier() : 'shared')
        return normalizePath(path.join(SUB_COMMON_DIR, md5(idStr)))
      },
      minChunks: 2,
      priority: 1000
    }

    return cacheGroups
  }

  apply (compiler: Compiler) {
    if (this.subPackages.length === 0) return

    this.distPath = compiler.options.output.path || ''

    compiler.hooks.thisCompilation.tap(PLUGIN_NAME, (compilation: Compilation) => {
      compilation.hooks.processAssets.tapAsync(
        {
          name: PLUGIN_NAME,
          stage: compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_ANALYSE
        },
        async (assets: Record<string, sources.Source>, callback) => {
          try {
            const { subPackagesVendors, existSubCommonDeps, subCommonChunks } = collectExistingSubCommonDeps(
              compilation.chunks,
              this.subRoots,
              this.subCommonDeps
            )
            this.subPackagesVendors = subPackagesVendors
            this.subCommonDeps = existSubCommonDeps
            this.subCommonChunks = subCommonChunks

            processSubPackageSplitAssets({
              assets,
              entryNames: compilation.entries.keys(),
              distPath: this.distPath,
              subRoots: this.subRoots,
              subRootRegExps: this.subRootRegExps,
              subCommonChunks: this.subCommonChunks,
              styleExt: this.fileType.style,
              sources: compiler.webpack.sources
            })
            for (const assetPath of Object.keys(compilation.assets)) {
              if (new RegExp(`^${SUB_COMMON_DIR}\\/.*`).test(assetPath)) {
                delete compilation.assets[assetPath]
              }
            }
            callback()
          } catch (err: any) {
            callback(err)
          }
        }
      )
    })
  }
}
