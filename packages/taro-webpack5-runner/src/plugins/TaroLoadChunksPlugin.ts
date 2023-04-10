import {
  META_TYPE,
  taroJsComponents
} from '@tarojs/helper'
import { toDashed } from '@tarojs/shared'
import { sources } from 'webpack'

import { componentConfig } from '../utils/component'
import { addRequireToSource, chunkHasJs, getChunkEntryModule, getChunkIdOrName } from '../utils/webpack'

import type { Chunk, Compilation, Compiler } from 'webpack'
import type { AddPageChunks, IComponent } from '../utils/types'
import type TaroNormalModule from './TaroNormalModule'

const PLUGIN_NAME = 'TaroLoadChunksPlugin'
const { ConcatSource } = sources

interface IOptions {
  commonChunks: string[]
  isBuildPlugin: boolean
  framework: string
  addChunkPages?: AddPageChunks
  pages: Set<IComponent>
  needAddCommon?: string[]
  isIndependentPackages?: boolean
}

export default class TaroLoadChunksPlugin {
  commonChunks: string[]
  isBuildPlugin: boolean
  framework: string
  addChunkPages?: AddPageChunks
  pages: Set<IComponent>
  isCompDepsFound: boolean
  needAddCommon: string[]
  isIndependentPackages: boolean

  constructor (options: IOptions) {
    this.commonChunks = options.commonChunks
    this.isBuildPlugin = options.isBuildPlugin
    this.framework = options.framework
    this.addChunkPages = options.addChunkPages
    this.pages = options.pages
    this.needAddCommon = options.needAddCommon || []
    this.isIndependentPackages = options.isIndependentPackages || false
  }

  apply (compiler: Compiler) {
    const pagesList = this.pages
    const addChunkPagesList = new Map<string, string[]>()
    compiler.hooks.thisCompilation.tap(PLUGIN_NAME, (compilation: Compilation) => {
      let commonChunks
      const fileChunks = new Map<string, { name: string }[]>()

      compilation.hooks.afterOptimizeChunks.tap(PLUGIN_NAME, (chunks: Chunk[]) => {
        const chunksArray = Array.from(chunks)
        /**
         * 收集 common chunks 中使用到 @tarojs/components 中的组件
         */
        commonChunks = chunksArray.filter(chunk => this.commonChunks.includes(chunk.name) && chunkHasJs(chunk, compilation.chunkGraph)).reverse()

        this.isCompDepsFound = false
        for (const chunk of commonChunks) {
          this.collectComponents(compiler, compilation, chunk)
        }
        if (!this.isCompDepsFound) {
          // common chunks 找不到再去别的 chunk 中找
          chunksArray
            .filter(chunk => !this.commonChunks.includes(chunk.name))
            .some(chunk => {
              this.collectComponents(compiler, compilation, chunk)
              return this.isCompDepsFound
            })
        }

        /**
         * 收集开发者在 addChunkPages 中配置的页面及其需要引用的公共文件
         */
        if (typeof this.addChunkPages === 'function') {
          this.addChunkPages(addChunkPagesList, Array.from(pagesList).map(item => item.name))
          chunksArray.forEach(chunk => {
            const id = getChunkIdOrName(chunk)
            addChunkPagesList.forEach((deps, pageName) => {
              if (pageName === id) {
                const depChunks = deps.map(dep => ({ name: dep }))
                fileChunks.set(id, depChunks)
              }
            })
          })
        }
      })

      compiler.webpack.javascript.JavascriptModulesPlugin.getCompilationHooks(compilation).render.tap(PLUGIN_NAME, (modules: sources.ConcatSource, { chunk }) => {
        const chunkEntryModule = getChunkEntryModule(compilation, chunk) as any
        if (chunkEntryModule) {
          const entryModule: TaroNormalModule = chunkEntryModule.rootModule ?? chunkEntryModule
          if (entryModule.miniType === META_TYPE.EXPORTS) {
            const source = new ConcatSource()
            source.add('module.exports=')
            source.add(modules)
            return source
          } else {
            return modules
          }
        } else {
          return modules
        }
      })

      /**
       * 在每个 chunk 文本刚生成后，按判断条件在文本头部插入 require 语句
       */
      compiler.webpack.javascript.JavascriptModulesPlugin.getCompilationHooks(compilation).render.tap(PLUGIN_NAME, (modules: sources.ConcatSource, { chunk }) => {
        const chunkEntryModule = getChunkEntryModule(compilation, chunk) as any
        if (chunkEntryModule) {
          if (this.isBuildPlugin) {
            return addRequireToSource(getChunkIdOrName(chunk), modules, commonChunks)
          }

          const entryModule: TaroNormalModule = chunkEntryModule.rootModule ?? chunkEntryModule
          const { miniType } = entryModule
          if (this.needAddCommon.length) {
            for (const item of this.needAddCommon) {
              if (getChunkIdOrName(chunk) === item) {
                return addRequireToSource(item, modules, commonChunks)
              }
            }
          }

          if (miniType === META_TYPE.ENTRY) {
            return addRequireToSource(getChunkIdOrName(chunk), modules, commonChunks)
          }

          if (this.isIndependentPackages &&
            (miniType === META_TYPE.PAGE || miniType === META_TYPE.COMPONENT)
          ) {
            return addRequireToSource(getChunkIdOrName(chunk), modules, commonChunks)
          }

          // addChunkPages
          if (fileChunks.size &&
            (miniType === META_TYPE.PAGE || miniType === META_TYPE.COMPONENT)
          ) {
            let source
            const id = getChunkIdOrName(chunk)
            fileChunks.forEach((v, k) => {
              if (k === id) {
                source = addRequireToSource(id, modules, v)
              }
            })
            return source
          }
        } else {
          return modules
        }
      })
    })
  }

  collectComponents (compiler: Compiler, compilation: Compilation, chunk: Chunk) {
    const chunkGraph = compilation.chunkGraph
    const moduleGraph = compilation.moduleGraph
    const modulesIterable: Iterable<TaroNormalModule> = chunkGraph.getOrderedChunkModulesIterable(chunk, compiler.webpack.util.comparators.compareModulesByIdentifier) as any
    for (const module of modulesIterable) {
      if (module.rawRequest === taroJsComponents) {
        this.isCompDepsFound = true
        const includes = componentConfig.includes
        const moduleUsedExports = moduleGraph.getUsedExports(module, chunk.runtime)
        if (moduleUsedExports === null || typeof moduleUsedExports === 'boolean') {
          componentConfig.includeAll = true
        } else {
          for (const item of moduleUsedExports) {
            includes.add(toDashed(item))
          }
        }
        break
      }
    }
  }
}
