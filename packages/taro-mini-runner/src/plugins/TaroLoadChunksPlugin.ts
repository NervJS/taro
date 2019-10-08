import * as path from 'path'

import webpack, { compilation } from 'webpack'
import { ConcatSource } from 'webpack-sources'
import { urlToRequest } from 'loader-utils'

import { PARSE_AST_TYPE, REG_STYLE, BUILD_TYPES } from '../utils/constants'
import { promoteRelativePath } from '../utils'

const PLUGIN_NAME = 'TaroLoadChunksPlugin'

interface IOptions {
  commonChunks: string[],
  buildAdapter: BUILD_TYPES,
  isBuildPlugin: boolean
}

export default class TaroLoadChunksPlugin {
  commonChunks: string[]
  buildAdapter: BUILD_TYPES
  isBuildPlugin: boolean

  constructor (options: IOptions) {
    this.commonChunks = options.commonChunks
    this.buildAdapter = options.buildAdapter
    this.isBuildPlugin = options.isBuildPlugin
  }

  apply (compiler: webpack.Compiler) {
    compiler.hooks.thisCompilation.tap(PLUGIN_NAME, (compilation: any) => {
      let commonChunks
      compilation.hooks.afterOptimizeChunks.tap(PLUGIN_NAME, (chunks: compilation.Chunk[]) => {
        commonChunks = chunks.filter(chunk => this.commonChunks.includes(chunk.name)).reverse()
      })
      compilation.chunkTemplate.hooks.renderWithEntry.tap(PLUGIN_NAME, (modules, chunk) => {
        if (chunk.entryModule) {
          if (this.isBuildPlugin) {
            const id = chunk.id
            return addRequireToSource(id, modules, commonChunks)
          } else if (chunk.entryModule.miniType === PARSE_AST_TYPE.ENTRY) {
            compilation.hooks.afterOptimizeAssets.tap(PLUGIN_NAME, assets => {
              const files = chunk.files
              files.forEach(item => {
                if (REG_STYLE.test(item)) {
                  const source = new ConcatSource()
                  const _source = assets[item]._source
                  Object.keys(assets).forEach(assetName => {
                    const fileName = path.basename(assetName, path.extname(assetName))
                    if (REG_STYLE.test(assetName) && this.commonChunks.includes(fileName)) {
                      source.add(`@import ${JSON.stringify(urlToRequest(assetName))}`)
                      source.add('\n')
                      source.add(_source)
                      assets[item]._source = source
                    }
                  })
                }
              })
            })
            const name = chunk.name
            return addRequireToSource(name, modules, commonChunks)
          } else if ((this.buildAdapter === BUILD_TYPES.QUICKAPP) &&
            (chunk.entryModule.miniType === PARSE_AST_TYPE.PAGE ||
            chunk.entryModule.miniType === PARSE_AST_TYPE.COMPONENT)) {
            const id = chunk.id
            return addRequireToSource(id, modules, commonChunks)
          }
        }
      })
    })
  }
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
