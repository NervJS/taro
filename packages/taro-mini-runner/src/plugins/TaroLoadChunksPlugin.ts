import * as path from 'path'

import webpack, { compilation } from 'webpack'
import { ConcatSource } from 'webpack-sources'
import { urlToRequest } from 'loader-utils'

import { PARSE_AST_TYPE, REG_STYLE } from '../utils/constants'

import { ITaroFileInfo } from './MiniPlugin'

const PLUGIN_NAME = 'TaroLoadChunksPlugin'

interface IOptions {
  commonChunks: string[],
  taroFileTypeMap: ITaroFileInfo
}

export default class TaroLoadChunksPlugin {
  commonChunks: string[]
  taroFileTypeMap: ITaroFileInfo

  constructor (options: IOptions) {
    this.commonChunks = options.commonChunks
  }

  apply (compiler: webpack.Compiler) {
    compiler.hooks.thisCompilation.tap(PLUGIN_NAME, (compilation: compilation.Compilation) => {
      let commonChunks
      compilation.hooks.afterOptimizeChunks.tap(PLUGIN_NAME, (chunks: compilation.Chunk[]) => {
        commonChunks = chunks.filter(chunk => this.commonChunks.includes(chunk.name))
      })
      compilation.chunkTemplate.hooks.renderWithEntry.tap(PLUGIN_NAME, (modules, chunk) => {
        if (chunk.entryModule && chunk.entryModule.miniType === PARSE_AST_TYPE.ENTRY) {
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
          const source = new ConcatSource()
          commonChunks.reverse().forEach(chunkItem => {
            source.add(`require(${JSON.stringify(urlToRequest(chunkItem.name))});\n`)
          })
          source.add('\n')
          source.add(modules)
          source.add(';')
          return source
        }
      })
    })
  }
}
