import * as path from 'path'

import webpack from 'webpack'
import { ConcatSource } from 'webpack-sources'
import { toDashed } from '@tarojs/shared'
import { promoteRelativePath, META_TYPE, BUILD_TYPES, taroJsComponents } from '@tarojs/runner-utils'

import { componentConfig } from '../template/component'
import { AddPageChunks, IComponent } from '../utils/types'

const PLUGIN_NAME = 'TaroLoadChunksPlugin'

interface IOptions {
  commonChunks: string[],
  buildAdapter: BUILD_TYPES,
  isBuildPlugin: boolean,
  framework: string,
  addChunkPages?: AddPageChunks,
  pages: Set<IComponent>
}

export default class TaroLoadChunksPlugin {
  commonChunks: string[]
  buildAdapter: BUILD_TYPES
  isBuildPlugin: boolean
  framework: string
  addChunkPages?: AddPageChunks
  pages: Set<IComponent>

  constructor (options: IOptions) {
    this.commonChunks = options.commonChunks
    this.buildAdapter = options.buildAdapter
    this.isBuildPlugin = options.isBuildPlugin
    this.framework = options.framework
    this.addChunkPages = options.addChunkPages
    this.pages = options.pages
  }

  apply (compiler: webpack.Compiler) {
    const pagesList = this.pages
    const addChunkPagesList = new Map<string, string[]>()
    compiler.hooks.thisCompilation.tap(PLUGIN_NAME, (compilation: any) => {
      let commonChunks
      let fileChunks = new Map()
      compilation.hooks.afterOptimizeChunks.tap(PLUGIN_NAME, chunks => {
        commonChunks = chunks.filter(chunk => this.commonChunks.includes(chunk.name)).reverse()

        for (const chunk of commonChunks) {
          let needBreak = false;
          (chunk.modulesIterable as Set<unknown>).forEach((m: { rawRequest: string, usedExports: string[] }) => {
            if (m.rawRequest === taroJsComponents) {
              const includes = componentConfig.includes
              if (Array.isArray(m.usedExports)) {
                m.usedExports.map(toDashed).map(includes.add.bind(includes))
              } else {
                componentConfig.includeAll = true
              }
              needBreak = true
            }
          })
          if (needBreak) {
            break
          }
        }

        if (typeof this.addChunkPages === 'function') {
          this.addChunkPages(addChunkPagesList, Array.from(pagesList).map((item: any) => item.name))
          chunks.forEach(chunk => {
            const id = getIdOrName(chunk)
            addChunkPagesList.forEach((v, k) => {
              if (k === id) {
                const depChunks = v.map(v => ({ name: v }))
                fileChunks.set(id, depChunks)
              }
            })
          })
        }
      })
      compilation.chunkTemplate.hooks.renderWithEntry.tap(PLUGIN_NAME, (modules, chunk) => {
        if (chunk.entryModule) {
          if (this.isBuildPlugin) {
            return addRequireToSource(getIdOrName(chunk), modules, commonChunks)
          }
          const entryModule = chunk.entryModule.rootModule ? chunk.entryModule.rootModule : chunk.entryModule
          if (entryModule.miniType === META_TYPE.ENTRY) {
            return addRequireToSource(getIdOrName(chunk), modules, commonChunks)
          }
          if ((this.buildAdapter === BUILD_TYPES.QUICKAPP) &&
            (entryModule.miniType === META_TYPE.PAGE ||
            entryModule.miniType === META_TYPE.COMPONENT)) {
            return addRequireToSource(getIdOrName(chunk), modules, commonChunks)
          }
          if (fileChunks.size
            && (entryModule.miniType === META_TYPE.PAGE
            || entryModule.miniType === META_TYPE.COMPONENT)) {
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
}

function getIdOrName (chunk: webpack.compilation.Chunk) {
  if (typeof chunk.id === 'string') {
    return chunk.id
  }
  return chunk.name
}

function addRequireToSource (id, modules, commonChunks) {
  const source = new ConcatSource()
  commonChunks.forEach(chunkItem => {
    source.add(`require(${JSON.stringify(promoteRelativePath(path.relative(id, chunkItem.name)))});\n`)
  })
  source.add('\n')
  source.add(modules)
  source.add(';')
  return source
}
