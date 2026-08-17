/**
 * @tarojs/project-graph — 持久化缓存 + InputManifest（WP7，§6）
 *
 * 把构建好的 ProjectGraph 落盘到 `<root>/.taro/graph.cache.json`，重启时若输入
 * 未变（InputManifest content hash 一致）且 schemaVersion 匹配，则跳过冷启动读缓存。
 *
 * §6 核心：**Builder 产出独立 InputManifest**，记录已读取文件、resolved package
 * manifest、缺失候选路径与 AnalysisContext fingerprint；cache hash 与 watch 共同
 * 消费该 manifest，**不能再只从成功节点反推输入**。这修复了 P1 缓存的三处失效盲区：
 *  - 组件源码 / 组件 config / barrel 中转文件变更（P1 只 hash app.config + 页面文件）；
 *  - **补上缺失候选文件**（拼错路径修好 / 后缀-only 组件补主文件）——unresolved→local，
 *    这是 WP7 DoD「补文件后缓存正确失效」的头号场景；
 *  - 装包（external→npm）：package.json / lockfile 变更。
 *
 * fingerprint（AnalysisContext 派生）是必要的：sourceRoot/alias/framework/platform
 * 来自注入 kernel、不落任何输入文件，且当图为空（根指错找不到 app.config）时输入
 * 文件集为空、hash 退化为常量——没有 fingerprint 就会在不同 context 间误命中空图。
 */

import { createHash } from 'node:crypto'
import * as fs from 'node:fs'
import * as path from 'node:path'

import { SCHEMA_VERSION } from './schema'

import type { IProjectGraph } from './schema'

const CACHE_DIR = '.taro'
const CACHE_FILE = 'graph.cache.json'

/**
 * §6 输入清单（Builder 独立产出，cache/watch 共同消费）。所有路径均绝对；三个文件
 * 类字段在写入前排序去重，保证顺序无关的稳定摘要。
 */
export interface IInputManifest {
  /**
   * 已读取的输入文件：app/page/component config、页面与组件源码、barrel 中转文件、
   * resolved package.json。补上「文件确实变了」的判据——补文件/改文件/删文件都改 hash。
   */
  readFiles: string[]
  /**
   * 缺失候选路径：解析尝试过、但当时都不存在的候选（typo 路径的所有后缀候选、
   * 后缀-only 组件的平台文件名）。补上其中任一即应触发重建（unresolved→local）。
   */
  missingCandidates: string[]
  /**
   * package/lock 输入：root `package.json` + lockfile（pnpm/npm/yarn）。装包/删包/
   * 改版本 → 内容变 → 失效（external↔npm 迁移）。不长期监听整个 node_modules（§6）。
   */
  packageInputs: string[]
  /**
   * AnalysisContext fingerprint：framework/platform/sourceRoot/alias 的确定性序列化。
   * 不落任何输入文件，必须进 hash（否则空图会在不同 context 间误命中）。
   */
  fingerprint: string
}

/** 缓存文件结构。 */
export interface GraphCache {
  schemaVersion: string
  /** InputManifest content hash；与当前重算的 hash 不一致则失效。 */
  contentHash: string
  /** 产出该缓存的 InputManifest（重启命中判定时据此重算 hash，不再反推输入）。 */
  manifest: IInputManifest
  graph: IProjectGraph
}

function cachePath(root: string): string {
  return path.join(root, CACHE_DIR, CACHE_FILE)
}

/**
 * 构造 AnalysisContext fingerprint：sourceRoot + framework + platform + alias 的
 * 稳定（alias key 排序）序列化。alias key 顺序不应影响缓存有效性，故排序后序列化。
 */
export function buildFingerprint(parts: {
  sourceRoot: string
  framework: string
  platform: string | undefined
  alias: Record<string, unknown>
}): string {
  const sortedAlias = Object.keys(parts.alias)
    .sort()
    .reduce<Record<string, unknown>>((acc, k) => {
    acc[k] = parts.alias[k]
    return acc
  }, {})
  return JSON.stringify({
    sourceRoot: parts.sourceRoot,
    framework: parts.framework,
    platform: parts.platform ?? null,
    alias: sortedAlias,
  })
}

/**
 * 收集 root package/lock 输入（§6）：root `package.json` + 首个存在的 lockfile。
 * 只收 root 级——不长期监听整个 node_modules；包版本细节由各 npm 组件的 manifest 承接。
 */
export function collectPackageInputs(root: string): string[] {
  const inputs: string[] = []
  const pkg = path.join(root, 'package.json')
  if (fs.existsSync(pkg)) inputs.push(pkg)
  for (const lock of ['pnpm-lock.yaml', 'package-lock.json', 'yarn.lock']) {
    const lp = path.join(root, lock)
    if (fs.existsSync(lp)) inputs.push(lp)
  }
  return inputs
}

/** 对 IInputManifest 计算稳定 content hash（§6）：三类文件内容 + fingerprint。 */
export function computeManifestHash(manifest: IInputManifest): string {
  const hash = createHash('sha256')
  hash.update(manifest.fingerprint)
  hash.update('\0fp\0')
  // 三类路径分别贴标签、各自排序去重后纳入——同一文件出现在多个类别不重复读盘，
  // 但类别标签保证「同路径从 readFiles 移到 missingCandidates」这类语义迁移也改 hash。
  hashPathGroup(hash, 'read', manifest.readFiles, /* includeContent */ true)
  hashPathGroup(hash, 'missing', manifest.missingCandidates, /* includeContent */ true)
  hashPathGroup(hash, 'pkg', manifest.packageInputs, /* includeContent */ true)
  return hash.digest('hex')
}

/**
 * 把一组路径贴标签纳入摘要。文件不存在记 `\0missing`（删除 / 缺失候选未补 = 稳定态；
 * 补上后内容非空即变 hash）。includeContent=true 读文件内容摘要（内容变即失效）。
 */
function hashPathGroup(hash: ReturnType<typeof createHash>, label: string, paths: string[], includeContent: boolean): void {
  hash.update(`\0${label}\0`)
  for (const fp of [...new Set(paths)].sort()) {
    hash.update(fp)
    hash.update('\0')
    if (includeContent) {
      try {
        hash.update(fs.readFileSync(fp))
      } catch {
        hash.update('\0missing')
      }
    }
    hash.update('\0')
  }
}

/** 读缓存；不存在 / schemaVersion 不符 / 解析失败 / manifest 残缺均返回 undefined。 */
export function readCache(root: string): GraphCache | undefined {
  const fp = cachePath(root)
  if (!fs.existsSync(fp)) return undefined
  try {
    const parsed = JSON.parse(fs.readFileSync(fp, 'utf8')) as GraphCache
    if (parsed.schemaVersion !== SCHEMA_VERSION) return undefined
    // 形状兜底：手改 / 未来 schema 复用可能产出"版本匹配但残缺"的文件。降级为 miss
    // （重建），把缓存的 best-effort 语义贯彻到读侧。manifest 缺失也当 miss（无从重算 hash）。
    if (parsed.graph?.app == null || !Array.isArray(parsed.graph.pages)) return undefined
    if (parsed.manifest == null || !Array.isArray(parsed.manifest.readFiles)) return undefined
    return parsed
  } catch {
    return undefined
  }
}

/**
 * 原子写缓存（best-effort：写失败不抛，仅忽略——缓存是优化不是正确性依赖）。
 * 先写同目录临时文件再 rename（同一文件系统 rename 原子），避免并发读者读到半截 JSON。
 */
export function writeCache(root: string, graph: IProjectGraph, manifest: IInputManifest, contentHash: string): void {
  const dir = path.join(root, CACHE_DIR)
  try {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
    const cache: GraphCache = { schemaVersion: SCHEMA_VERSION, contentHash, manifest, graph }
    const target = cachePath(root)
    // 临时名带 pid 避免多进程互踩；同目录保证与目标同文件系统（rename 原子）。
    const tmp = `${target}.${process.pid}.tmp`
    fs.writeFileSync(tmp, JSON.stringify(cache), 'utf8')
    fs.renameSync(tmp, target)
  } catch {
    // 忽略写缓存失败
  }
}
