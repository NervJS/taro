import path from 'node:path'

import { promoteRelativePath } from '@tarojs/helper'
import { isBoolean } from '@tarojs/shared'
import { sources } from 'webpack'

import type { Chunk, ChunkGraph, Compilation, Stats } from 'webpack'

const { ConcatSource } = sources

/**
 * 在文本头部加入一些 require 语句
 */
export function addRequireToSource (id: string, modules: sources.Source, commonChunks: (Chunk | { name: string })[]) {
  const source = new ConcatSource()
  commonChunks.forEach(chunkItem => {
    source.add(`require(${JSON.stringify(promoteRelativePath(path.relative(id, chunkItem.name!)))});\n`)
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
  return chunk.name!
}

export function chunkHasJs (chunk: Chunk, chunkGraph: ChunkGraph) {
  if (chunk.name === chunk.runtime) return true
  if (chunkGraph.getNumberOfEntryModules(chunk) > 0) return true

  return Boolean(chunkGraph.getChunkModulesIterableBySourceType(chunk, 'javascript'))
}

export function errorHandling (errorLevel?: number, stats?: Stats) {
  if (errorLevel === 1 && stats?.hasErrors()) {
    process.exit(1)
  }
}

export function getAssetsMaxSize (options, defaultValue): number {
  // Note:limit 为 false 时，不限制大小 全部转为 base64
  const { limit } = options
  let maxSize: number
  if (isBoolean(limit)) {
    maxSize = limit ? 0 : Number.MAX_SAFE_INTEGER
  } else {
    maxSize = limit || defaultValue
  }
  return maxSize
}
