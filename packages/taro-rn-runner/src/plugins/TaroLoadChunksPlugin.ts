import * as path from 'path'

import webpack, { compilation } from 'webpack'
import { ConcatSource } from 'webpack-sources'
import { urlToRequest } from 'loader-utils'

import { PARSE_AST_TYPE, REG_STYLE, BUILD_TYPES } from '../utils/constants'
import { promoteRelativePath } from '../utils'
import { AddPageChunks } from '../utils/types'

const PLUGIN_NAME = 'TaroLoadChunksPlugin'

interface IOptions {
  commonChunks: string[],
  buildAdapter: BUILD_TYPES,
  isBuildPlugin: boolean,
  addChunkPages?: AddPageChunks
}

export default class TaroLoadChunksPlugin {
  commonChunks: string[]
  buildAdapter: BUILD_TYPES
  isBuildPlugin: boolean
  addChunkPages?: AddPageChunks

  constructor (options: IOptions) {
    this.commonChunks = options.commonChunks
    this.buildAdapter = options.buildAdapter
    this.isBuildPlugin = options.isBuildPlugin
    this.addChunkPages = options.addChunkPages
  }

  apply (compiler: webpack.Compiler) {
    let pagesList
    const addChunkPagesList = new Map<string, string[]>();

    // call custome plugins getPages
    (compiler.hooks as any).getPages.tap(PLUGIN_NAME, pages => {
      pagesList = pages
    })
    // 触发 compilation 事件之前执行
    compiler.hooks.thisCompilation.tap(PLUGIN_NAME, (compilation: any) => {
      let commonChunks
      // chunk 优化完成之后触发。
      compilation.hooks.afterOptimizeChunks.tap(PLUGIN_NAME, (chunks: compilation.Chunk[]) => {
        commonChunks = chunks.filter(chunk => this.commonChunks.includes(chunk.name)).reverse()
      })
      compilation.chunkTemplate.hooks.renderWithEntry.tap(PLUGIN_NAME, (modules, chunk) => {
        if (chunk.entryModule) {
          if (this.isBuildPlugin) {
            return addRequireToSource(getIdOrName(chunk), modules, commonChunks)
          }
          let entryModule = chunk.entryModule.rootModule ? chunk.entryModule.rootModule : chunk.entryModule
          if (entryModule.miniType === PARSE_AST_TYPE.ENTRY) {
            compilation.hooks.afterOptimizeAssets.tap(PLUGIN_NAME, assets => {
              const files = chunk.files
              files.forEach(item => {
                if (REG_STYLE.test(item)) {
                  const source = new ConcatSource()
                  const _source = assets[item]._source || assets[item]._value
                  Object.keys(assets).forEach(assetName => {
                    const fileName = path.basename(assetName, path.extname(assetName))
                    if (REG_STYLE.test(assetName) && this.commonChunks.includes(fileName)) {
                      source.add(`@import ${JSON.stringify(urlToRequest(assetName))};`)
                      source.add('\n')
                      source.add(_source)
                      if (assets[item]._source) {
                        assets[item]._source = source
                      } else {
                        assets[item]._value = source.source()
                      }
                    }
                  })
                }
              })
            })
            return addRequireToSource(getIdOrName(chunk), modules, commonChunks)
          }
          if ((this.buildAdapter === BUILD_TYPES.QUICKAPP) &&
            (entryModule.miniType === PARSE_AST_TYPE.PAGE ||
              entryModule.miniType === PARSE_AST_TYPE.COMPONENT)) {
            return addRequireToSource(getIdOrName(chunk), modules, commonChunks)
          }
          if (typeof this.addChunkPages === 'function' && entryModule.miniType === PARSE_AST_TYPE.PAGE) {
            const id = getIdOrName(chunk)
            let source
            this.addChunkPages(addChunkPagesList, Array.from(pagesList).map((item: any) => item.name))
            addChunkPagesList.forEach((v, k) => {
              if (k === id) {
                source = addRequireToSource(id, modules, v.map(v => ({name: v})))
              }
            })
            return source
          }
        }
      })
    })
  }
}

function getIdOrName (chunk) {
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
