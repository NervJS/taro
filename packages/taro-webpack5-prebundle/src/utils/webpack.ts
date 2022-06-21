import { promoteRelativePath } from '@tarojs/helper'
import path from 'path'
import webpack from 'webpack'
import { ConcatSource, Source } from 'webpack-sources'

/**
 * 在文本头部加入一些 require 语句
 */
export function addRequireToSource (id: string, modules: Source, commonChunks: (webpack.Chunk | { name: string })[]) {
  const source = new ConcatSource()
  commonChunks.forEach(chunkItem => {
    source.add(`require(${JSON.stringify(promoteRelativePath(path.relative(id, chunkItem.name)))});\n`)
  })
  source.add('\n')
  source.add(modules)
  source.add(';')
  return source
}

export function getChunkEntryModule (compilation: webpack.Compilation, chunk: webpack.Chunk) {
  const chunkGraph = compilation.chunkGraph
  const entryModules = Array.from(chunkGraph.getChunkEntryModulesIterable(chunk))
  if (entryModules.length) {
    return entryModules[0]
  }
}

export function getChunkIdOrName (chunk: webpack.Chunk) {
  if (typeof chunk.id === 'string') {
    return chunk.id
  }
  return chunk.name
}
