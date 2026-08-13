import path from 'node:path'

import { promoteRelativePath } from '@tarojs/helper'
import { isBoolean } from '@tarojs/shared'
import { AppConfig } from '@tarojs/taro'
import { urlToRequest } from 'loader-utils'
import { sources } from 'webpack'

import type { Chunk, ChunkGraph, Compilation, Stats } from 'webpack'

const { ConcatSource } = sources

/**
 * 在文本头部加入一些 require 语句
 */
export function addRequireToSource (id: string, modules: sources.Source, commonChunks: (Chunk | { name: string })[], appConfig?: AppConfig) {
  const source = new ConcatSource()
  if (process.env.TARO_ENV === 'tt' && appConfig) {
    source.add(`
if (typeof tt !== 'undefined') {
  tt.__$enableTTDom$__ = ${appConfig.enableTTDom};
}\n`)
  }
  commonChunks.forEach(chunkItem => {
    source.add(`require(${JSON.stringify(promoteRelativePath(path.relative(id, chunkItem.name!)))});\n`)
  })
  source.add('\n')
  source.add(modules)
  source.add(';')
  return source
}

/**
 * 重写源码里对某个 outputDir 根产物的 require 相对路径,使其相对于 fromId(而非根目录)。
 *
 * 场景:某段已渲染的源码在生成时按"落在根目录"算好了 require("./<target>")(fromId 深度 0),
 * 之后被搬到更深的目录(如 subPackageIndie 的 mainPackageRoot=pages/order/index),原相对路径失效。
 * 用与注入端 addRequireToSource 相同的 promoteRelativePath(path.relative(...)) 算法重算,保证一致。
 *
 * 用精确字符串替换(全量 split/join,非正则),只命中确定性的 require("./<target>") 原始形态,
 * 避免误伤源码里其它含 target 名的内容;源码不含目标 require 时原样返回。
 *
 * @param source     源码字符串
 * @param fromId     搬迁后的目录 id(如 'pages/order/index'),相对路径以它为基准
 * @param targetName 根目录产物名(不含扩展名,如 'taro-shared-sync')
 */
export function rewriteRootRequirePath (source: string, fromId: string, targetName: string): string {
  const originalRequire = `require(${JSON.stringify(`./${targetName}`)})`
  if (!source.includes(originalRequire)) return source
  const rewrittenPath = promoteRelativePath(path.relative(fromId, targetName))
  const rewrittenRequire = `require(${JSON.stringify(rewrittenPath)})`
  return source.split(originalRequire).join(rewrittenRequire)
}

/**
 * 生成页面 wxss `@import` app 样式的语句,按页面 wxss 目录到 app 样式产物路径重算相对路径。
 *
 * 场景:subPackageIndie 把 app 样式随 runtime chunks 落在**归一化后**的 mainPackageRoot
 * (normalizeIndieRoot 砍掉末尾 /index),而页面 wxss 落在 `${pageName}${styleExt}`——两者深度可能
 * 不同(如页面 pages/order/index/index.wxss 与 app 样式 pages/order/app.wxss,页面深一级)。
 * 算法与 MiniPlugin 默认样式注入(`path.posix.relative(path.dirname(pageStyle), 'app'+ext)`)一致,
 * 只是 app 样式的 target 改为归一化 root 下的完整路径。
 *
 * @param pageStyle     页面 wxss 产物路径(如 'pages/order/index/index.wxss')
 * @param appStylePath  app 样式产物路径(如 'pages/order/app.wxss')
 */
export function buildRootStyleImport (pageStyle: string, appStylePath: string): string {
  const rel = path.posix.relative(path.posix.dirname(pageStyle), appStylePath)
  return `@import ${JSON.stringify(urlToRequest(rel))};\n`
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
