import webpack, { compilation } from 'webpack'
import { ConcatSource } from 'webpack-sources'
import { urlToRequest } from 'loader-utils'

import { PARSE_AST_TYPE } from '../utils/constants'

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
