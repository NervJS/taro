import type { Compilation, Chunk } from 'webpack'

export function getChunkEntryModule (compilation: Compilation, chunk: Chunk) {
  const chunkGraph = compilation.chunkGraph
  const entryModules = Array.from(chunkGraph.getChunkEntryModulesIterable(chunk))
  if (entryModules.length) {
    return entryModules[0]
  }
}
