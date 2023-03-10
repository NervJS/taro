/* 
 *  MIT License
 *  
 *  Copyright (c) 2018 O2Team、58.com、other contributors
 *  
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *  
 *  The above copyright notice and this permission notice shall be included in all
 *  copies or substantial portions of the Software.
 *  
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 */

import {
  META_TYPE,
  promoteRelativePath,
  taroJsComponents
} from '@tarojs/helper'
import { toDashed } from '@tarojs/shared'
import * as path from 'path'
import webpack from 'webpack'
import { ConcatSource } from 'webpack-sources'

import { componentConfig } from '../template/component'
import { AddPageChunks, IComponent } from '../utils/types'
import TaroNormalModule from './TaroNormalModule'

const PLUGIN_NAME = 'TaroLoadChunksPlugin'

interface IOptions {
  commonChunks: string[]
  isBuildPlugin: boolean
  framework: string
  addChunkPages?: AddPageChunks
  pages: Set<IComponent>
  isBuildQuickapp: boolean
  needAddCommon?: string[]
}

interface NormalModule {
  rawRequest: string
  usedExports: string[]
}

export default class TaroLoadChunksPlugin {
  commonChunks: string[]
  isBuildPlugin: boolean
  framework: string
  addChunkPages?: AddPageChunks
  pages: Set<IComponent>
  isBuildQuickapp: boolean
  isCompDepsFound: boolean
  needAddCommon: string[]

  constructor (options: IOptions) {
    this.commonChunks = options.commonChunks
    this.isBuildPlugin = options.isBuildPlugin
    this.framework = options.framework
    this.addChunkPages = options.addChunkPages
    this.pages = options.pages
    this.isBuildQuickapp = options.isBuildQuickapp
    this.needAddCommon = options.needAddCommon || []
  }

  apply (compiler: webpack.Compiler) {
    const pagesList = this.pages
    const addChunkPagesList = new Map<string, string[]>()
    compiler.hooks.thisCompilation.tap(PLUGIN_NAME, (compilation: any) => {
      let commonChunks
      const fileChunks = new Map<string, { name: string }[]>()

      compilation.hooks.afterOptimizeChunks.tap(PLUGIN_NAME, (chunks: webpack.compilation.Chunk[]) => {
        /**
         * 收集 common chunks 中使用到 @tarojs/components 中的组件
         */
        commonChunks = chunks.filter(chunk => this.commonChunks.includes(chunk.name)).reverse()

        this.isCompDepsFound = false
        for (const chunk of commonChunks) {
          this.collectComponents(chunk)
        }
        if (!this.isCompDepsFound) {
          // common chunks 找不到再去别的 chunk 中找
          chunks
            .filter(chunk => !this.commonChunks.includes(chunk.name))
            .some(chunk => {
              this.collectComponents(chunk)
              return this.isCompDepsFound
            })
        }

        /**
         * 收集开发者在 addChunkPages 中配置的页面及其需要引用的公共文件
         */
        if (typeof this.addChunkPages === 'function') {
          this.addChunkPages(addChunkPagesList, Array.from(pagesList).map(item => item.name))
          chunks.forEach(chunk => {
            const id = getIdOrName(chunk)
            addChunkPagesList.forEach((deps, pageName) => {
              if (pageName === id) {
                const depChunks = deps.map(dep => ({ name: dep }))
                fileChunks.set(id, depChunks)
              }
            })
          })
        }
      })

      compilation.chunkTemplate.hooks.renderWithEntry.tap(PLUGIN_NAME, (modules: ConcatSource, chunk) => {
        if (chunk.entryModule) {
          const entryModule: TaroNormalModule = chunk.entryModule.rootModule ? chunk.entryModule.rootModule : chunk.entryModule
          if (entryModule.miniType === META_TYPE.EXPORTS) {
            const source = new ConcatSource()
            source.add('module.exports=')
            source.add(modules)
            return source
          }
        }
      })

      /**
       * 在每个 chunk 文本刚生成后，按判断条件在文本头部插入 require 语句
       */
      compilation.chunkTemplate.hooks.renderWithEntry.tap(PLUGIN_NAME, (modules: ConcatSource, chunk) => {
        if (chunk.entryModule) {
          if (this.isBuildPlugin) {
            return addRequireToSource(getIdOrName(chunk), modules, commonChunks)
          }

          const entryModule: TaroNormalModule = chunk.entryModule.rootModule ? chunk.entryModule.rootModule : chunk.entryModule
          const { miniType } = entryModule
          if (this.needAddCommon.length) {
            for (const item of this.needAddCommon) {
              if (getIdOrName(chunk) === item) {
                return addRequireToSource(item, modules, commonChunks)
              }
            }
          }

          if (miniType === META_TYPE.ENTRY) {
            return addRequireToSource(getIdOrName(chunk), modules, commonChunks)
          }

          if (this.isBuildQuickapp &&
            (miniType === META_TYPE.PAGE || miniType === META_TYPE.COMPONENT)
          ) {
            return addRequireToSource(getIdOrName(chunk), modules, commonChunks)
          }

          // addChunkPages
          if (fileChunks.size &&
            (miniType === META_TYPE.PAGE || miniType === META_TYPE.COMPONENT)
          ) {
            let source
            const id = getIdOrName(chunk)
            fileChunks.forEach((v, k) => {
              if (k === id) {
                source = addRequireToSource(id, modules, v)
              }
            })
            return source
          }
        }
      })
    })
  }

  collectComponents (chunk) {
    Array.from((chunk.modulesIterable as Set<NormalModule>)).some(m => {
      if (m.rawRequest === taroJsComponents) {
        this.isCompDepsFound = true
        const includes = componentConfig.includes
        if (Array.isArray(m.usedExports)) {
          m.usedExports.map(toDashed).map(includes.add.bind(includes))
        } else {
          componentConfig.includeAll = true
        }
        return true
      }
    })
  }
}

/**
 * @returns chunk.id || chunk.name
 */
export function getIdOrName (chunk: webpack.compilation.Chunk) {
  if (typeof chunk.id === 'string') {
    return chunk.id
  }
  return chunk.name
}

/**
 * 在文本头部加入一些 require 语句
 */
export function addRequireToSource (id: string, modules: ConcatSource, commonChunks: (webpack.compilation.Chunk | { name: string })[]) {
  const source = new ConcatSource()
  commonChunks.forEach(chunkItem => {
    source.add(`require(${JSON.stringify(promoteRelativePath(path.relative(id, chunkItem.name)))});\n`)
  })
  source.add('\n')
  source.add(modules)
  source.add(';')
  return source
}
