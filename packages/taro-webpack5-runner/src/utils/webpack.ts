import { promoteRelativePath } from '@tarojs/helper'
import path from 'path'
import { Chunk, Compilation, sources} from 'webpack'

const { ConcatSource } = sources

/**
 * 在文本头部加入一些 require 语句
 */
export function addRequireToSource (id: string, modules: sources.Source, commonChunks: (Chunk | { name: string })[]) {
  const source = new ConcatSource()
  commonChunks.forEach(chunkItem => {
    source.add(`require(${JSON.stringify(promoteRelativePath(path.relative(id, chunkItem.name)))});\n`)
  })
  source.add('\n')
  source.add(modules)
  source.add(';')
  return source
}

export function getChunkEntryModule (compilation: Compilation, chunk: Chunk) {
  const chunkGraph = compilation.chunkGraph
  const entryModules = Array.from(chunkGraph.getChunkEntryModulesIterable(chunk))
  if (entryModules.length) {
    return entryModules[0]
  }
}

export function getChunkIdOrName (chunk: Chunk) {
  if (typeof chunk.id === 'string') {
    return chunk.id
  }
  return chunk.name
}
