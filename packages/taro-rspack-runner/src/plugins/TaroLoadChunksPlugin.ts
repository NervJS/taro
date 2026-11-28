import { taroJsComponents } from '@tarojs/helper'
import {
  type IBaseLoadChunksPluginOptions,
  BaseLoadChunksPlugin,
  transformEntryChunkSource
} from '@tarojs/runner-utils/bundler/loadChunks'
import { toDashed } from '@tarojs/shared'

import { componentConfig, getMiniEntryMeta, syncModuleComponentMetas } from '../utils/context'
import { chunkHasJs, getChunkIdOrName } from '../utils/rspack'

import type { Chunk, Compilation, Compiler } from '@rspack/core'
import type { Func } from '@tarojs/taro/types/compile'

const PLUGIN_NAME = 'TaroLoadChunksPlugin'

export interface ITaroLoadChunksPluginOptions extends IBaseLoadChunksPluginOptions {
  onParseCreateElement?: Func
}

export default class TaroLoadChunksPlugin extends BaseLoadChunksPlugin {
  isCompDepsFound = false
  onParseCreateElement?: Func

  constructor (options: ITaroLoadChunksPluginOptions) {
    super(options)
    this.onParseCreateElement = options.onParseCreateElement
  }

  apply (compiler: Compiler) {
    const addChunkPagesList = new Map<string, string[]>()
    const { ConcatSource } = compiler.webpack.sources

    compiler.hooks.thisCompilation.tap(PLUGIN_NAME, (compilation: Compilation) => {
      compilation.hooks.processAssets.tap(
        {
          name: `${PLUGIN_NAME}_CollectComponents`,
          stage: compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_ADDITIONAL - 1
        },
        () => {
          const chunksArray = Array.from(compilation.chunks) as Chunk[]
          const commonChunks = chunksArray
            .filter(chunk => Boolean(chunk.name && this.commonChunks.includes(chunk.name) && chunkHasJs(chunk, compilation)))
            .reverse()

          this.isCompDepsFound = false
          for (const chunk of commonChunks) {
            this.collectComponents(compilation, chunk)
          }
          if (!this.isCompDepsFound) {
            chunksArray
              .filter(chunk => !chunk.name || !this.commonChunks.includes(chunk.name))
              .some(chunk => {
                this.collectComponents(compilation, chunk)
                return this.isCompDepsFound
              })
          }
        }
      )

      compilation.hooks.processAssets.tap(
        {
          name: PLUGIN_NAME,
          stage: compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_ADDITIONS
        },
        () => {
          syncModuleComponentMetas(this.onParseCreateElement)

          const chunksArray = Array.from(compilation.chunks) as Chunk[]
          const activeCommonChunks = this.commonChunks
            .filter(name => {
              const matched = chunksArray.find(c => c.name === name)
              return Boolean(compilation.assets[`${name}.js`] || (matched && chunkHasJs(matched, compilation)))
            })
            .reverse()
            .map(name => ({ name }))

          const fileChunks = this.collectAddChunkPagesDeps(
            chunksArray,
            getChunkIdOrName,
            addChunkPagesList
          )

          for (const chunk of chunksArray) {
            const chunkName = getChunkIdOrName(chunk)
            const entryMeta = getMiniEntryMeta(chunkName)
            if (!entryMeta) continue

            const jsAssetName = `${chunkName}.js`
            const currentAsset = compilation.assets[jsAssetName]
            if (!currentAsset) continue

            const updatedSource = transformEntryChunkSource({
              chunkName,
              miniType: entryMeta.miniType,
              isNativePage: entryMeta.isNativePage,
              source: currentAsset,
              commonChunks: activeCommonChunks,
              fileChunks,
              isBuildPlugin: this.isBuildPlugin,
              needAddCommon: this.needAddCommon,
              isIndependentPackages: this.isIndependentPackages,
              appConfig: this.appConfig,
              ConcatSource
            })

            if (updatedSource !== currentAsset) {
              compilation.assets[jsAssetName] = updatedSource
            }
          }
        }
      )
    })
  }

  collectComponents (compilation: Compilation, chunk: Chunk) {
    const chunkGraph = compilation.chunkGraph
    const moduleGraph = compilation.moduleGraph
    if (!chunkGraph?.getChunkModulesIterable || typeof moduleGraph?.getUsedExports !== 'function') return

    const runtime = typeof chunk.runtime === 'string'
      ? chunk.runtime
      : Array.from((chunk.runtime as Set<string> | undefined) || [])

    for (const module of chunkGraph.getChunkModulesIterable(chunk) as Iterable<any>) {
      if (module.rawRequest === taroJsComponents) {
        this.isCompDepsFound = true
        const includes = componentConfig.includes
        const moduleUsedExports = moduleGraph.getUsedExports(module, runtime)
        if (moduleUsedExports === null || typeof moduleUsedExports === 'boolean') {
          componentConfig.includeAll = true
        } else {
          for (const item of moduleUsedExports) {
            const dashed = toDashed(item)
            if (!componentConfig.exclude.has(dashed)) {
              includes.add(dashed)
            }
          }
        }
        break
      }
    }
  }
}
