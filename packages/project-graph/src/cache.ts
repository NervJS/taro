/**
 * @tarojs/project-graph — 持久化缓存（任务 5）
 *
 * 把构建好的 ProjectGraph 落盘到 `<root>/.taro/graph.cache.json`，重启时若源文件
 * 未变（content hash 一致）且 schemaVersion 匹配，则跳过冷启动直接读缓存。
 *
 * content hash：对影响图的输入文件（app.config + 各页面文件 + 页面 config）的
 * 内容摘要，外加一个 seed（sourceRoot + alias 的稳定序列化）。任一输入内容或
 * seed 变化 → hash 变 → 缓存失效重建。seed 是必要的：sourceRoot/alias 来自注入的
 * kernel、不落在任何输入文件里，且当图为空（如根指错找不到 app.config）时输入文件
 * 集为空、hash 退化为常量——没有 seed 就会在不同 root/alias 间误命中同一空图。
 */

import { createHash } from 'node:crypto'
import * as fs from 'node:fs'
import * as path from 'node:path'

import { SCHEMA_VERSION } from './schema'

import type { ProjectGraph } from './schema'

const CACHE_DIR = '.taro'
const CACHE_FILE = 'graph.cache.json'

/** 缓存文件结构。 */
export interface GraphCache {
  schemaVersion: string
  /** 输入文件内容摘要；与当前重算的 hash 不一致则失效。 */
  contentHash: string
  graph: ProjectGraph
}

function cachePath(root: string): string {
  return path.join(root, CACHE_DIR, CACHE_FILE)
}

/**
 * 对一组文件计算 content hash。文件不存在的记为空、纳入摘要（删除也算变化）。
 * 输入路径先排序，保证顺序无关的稳定摘要。
 *
 * @param seed 参与摘要的非文件因素（sourceRoot + alias 的稳定序列化）。来自注入
 *   kernel、不落在输入文件里，必须进 hash，否则空图（输入集为空）会在不同 root/alias
 *   间误命中。见 buildSeed。
 */
export function computeContentHash(filePaths: string[], seed = ''): string {
  const hash = createHash('sha256')
  hash.update(seed)
  hash.update('\0seed\0')
  for (const fp of [...filePaths].sort()) {
    hash.update(fp)
    hash.update('\0')
    try {
      hash.update(fs.readFileSync(fp))
    } catch {
      hash.update('\0missing')
    }
    hash.update('\0')
  }
  return hash.digest('hex')
}

/**
 * 构造 content hash 的 seed：sourceRoot + alias 的稳定（key 排序）序列化。
 * alias 的 key 顺序不应影响缓存有效性，故排序后再序列化。
 */
export function buildSeed(sourceRoot: string, alias: Record<string, unknown>): string {
  const sortedAlias = Object.keys(alias)
    .sort()
    .reduce<Record<string, unknown>>((acc, k) => {
    acc[k] = alias[k]
    return acc
  }, {})
  return JSON.stringify({ sourceRoot, alias: sortedAlias })
}

/** 从图里收集参与 hash 的输入文件（app.config + 页面文件 + 页面 config）。 */
export function collectInputFiles(graph: ProjectGraph): string[] {
  const files: string[] = []
  if (graph.app.filePath) files.push(graph.app.filePath)
  for (const page of graph.pages) {
    if (page.filePath) files.push(page.filePath)
    if (page.configFilePath) files.push(page.configFilePath)
  }
  return files
}

/** 读缓存；不存在 / schemaVersion 不符 / 解析失败均返回 undefined。 */
export function readCache(root: string): GraphCache | undefined {
  const fp = cachePath(root)
  if (!fs.existsSync(fp)) return undefined
  try {
    const parsed = JSON.parse(fs.readFileSync(fp, 'utf8')) as GraphCache
    if (parsed.schemaVersion !== SCHEMA_VERSION) return undefined
    // 形状兜底：手改 / 未来 schema 复用可能产出"版本匹配但 graph 残缺"的文件，
    // 而 loadOrBuild 的 collectInputFiles(cached.graph) 不在 try 内，残缺会抛崩调用方。
    // 这里降级为 miss（重建），把缓存的"best-effort"语义贯彻到读侧。
    if (parsed.graph?.app == null || !Array.isArray(parsed.graph.pages)) return undefined
    return parsed
  } catch {
    return undefined
  }
}

/** 写缓存（best-effort：写失败不抛，仅忽略——缓存是优化不是正确性依赖）。 */
export function writeCache(root: string, graph: ProjectGraph, contentHash: string): void {
  const dir = path.join(root, CACHE_DIR)
  try {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
    const cache: GraphCache = { schemaVersion: SCHEMA_VERSION, contentHash, graph }
    fs.writeFileSync(cachePath(root), JSON.stringify(cache), 'utf8')
  } catch {
    // 忽略写缓存失败
  }
}
