import {
  addRequireToSourceWith,
  errorHandling,
  getChunkEntryModuleFromCompilation
} from '@tarojs/runner-utils/bundler/loadChunks'
import { sources } from 'webpack'

import type { AppConfig } from '@tarojs/taro'
import type { Chunk, ChunkGraph, Compilation } from 'webpack'

export { getAssetsMaxSize } from '@tarojs/runner-utils'
export { errorHandling }

/**
 * 在文本头部加入一些 require 语句
 */
export function addRequireToSource (id: string, modules: sources.Source, commonChunks: (Chunk | { name: string })[], appConfig?: AppConfig) {
  return addRequireToSourceWith(sources.ConcatSource, id, modules, commonChunks, appConfig)
}

export function getChunkEntryModule (compilation: Compilation, chunk: Chunk) {
  return getChunkEntryModuleFromCompilation(compilation, chunk)
}

export function getChunkIdOrName (chunk: Chunk) {
  if (typeof chunk.id === 'string') {
    return chunk.id
  }
  return chunk.name!
}

export function chunkHasJs (chunk: Chunk, chunkGraph: ChunkGraph) {
  if (chunk.name === chunk.runtime) return true
  if (chunkGraph.getNumberOfEntryModules(chunk) > 0) return true

  return Boolean(chunkGraph.getChunkModulesIterableBySourceType(chunk, 'javascript'))
}
