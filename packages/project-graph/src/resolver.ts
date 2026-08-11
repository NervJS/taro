/**
 * @tarojs/project-graph — 组件解析编排（WP3）
 *
 * Config 与 JSX 两条通道共用的**唯一** Resolver：给定「引用方文件 + 原始
 * specifier」，判定其解析终态并产出稳定身份主键。基于 `@tarojs/helper` 原语
 * （isAliasPath/replaceAliasPath/resolveMainFilePath/getNpmPackageAbsolutePath）
 * **重新实现**解析编排，非直接抽取主仓 runner（fork 细节见下）。
 *
 * 本模块只做「specifier → 终态 + 身份」的纯解析：不建 ComponentNode、不建边、
 * 不读组件 config、不递归子依赖（那些归 WP4/WP5）。
 *
 * =============================================================================
 * §4.4 终态判定树（互斥完备，4 终态；先按 specifier 形态判定，再看解析落点——
 * 避免 workspace 软链把包误判 local）
 * =============================================================================
 *  - 裸包说明符（vant、@myorg/ui，含 pnpm workspace 软链包）→ npm 分支，**不看
 *    realpath 落点**：解析到 node_modules/workspace 真实文件即 `npm`（身份用
 *    packageName+subpath）；能识别为包但无文件（未安装 / exports 失败）→ `external`。
 *  - 相对路径 / alias 说明符 → 看解析落点：落项目内文件 `local`；解析不了 `unresolved`。
 *  - `plugin://`（及任意 `scheme://`）→ `external`（建节点，无本地文件）。
 *  - 完全无法判定 → `unresolved`（只留 edge + 缺失候选路径，不建节点）。
 *
 * 两处 fork（相对主仓 runner，见 P2 计划 §8 WP3）：
 *  ① npm 基址：主仓 `getNpmPackageAbsolutePath` 内部裸 `require.resolve(pkg)` 以
 *     **本包**为基址，独立 CLI 下找不到目标工程依赖 → 本模块改以 `projectRoot`
 *     为基址（`require.resolve(pkg,{paths:[projectRoot]})`）。（WP3.3 落地）
 *  ② 平台后缀：主仓 `resolveMainFilePath` 读全局 `process.env.TARO_ENV`，共享
 *     Query/watch/活图下会相互污染 → 本模块改 env-入参包装，platform 显式传入、
 *     不改写全局 env。（WP3.2 落地）
 */

import * as fs from 'node:fs'
import * as path from 'node:path'

import ts from 'typescript'

import type { TComponentSourceKind, TResolution } from './schema'

// =============================================================================
// 解析上下文与输入 / 输出类型面
// =============================================================================

/**
 * 解析上下文（单项目单实例，来源见 IAnalysisContext）。
 * alias 与 platform 的「不可得」是两个独立降级面（§4.4 alias 降级 / 平台后缀）：
 * 用 hasKernel 区分「alias 确为空 {}」与「无 Kernel 拿不到 alias」，避免把纯 CLI
 * 的降级误报成「项目确实没配 alias」。
 */
export interface IResolveContext {
  /** 工程根绝对路径（npm `require.resolve` 的基址，fork ①）。 */
  projectRoot: string
  /**
   * 路径别名，仅来自 `kernel.initialConfig.alias`。webpackChain / vite 定义的
   * alias Kernel 不可得，此处为空 {}，alias 引用将走 unresolved 降级（§4.4）。
   */
  alias: Record<string, unknown>
  /**
   * 是否注入了 Kernel。false（纯 CLI）时 alias 恒空且 platform 不可得，二者的
   * 降级都不视为「项目事实缺陷」，只标 owner analyzer partial（工具限制类）。
   */
  hasKernel: boolean
  /**
   * 目标平台单值（等价 Kernel 的 TARO_ENV，如 'weapp'）；无 Kernel 为 undefined。
   * 有值时平台后缀 `<name>.<platform>.tsx` 优先、回退 `<name>.tsx`；无值时只解析
   * 无后缀主文件，后缀-only 组件解析不到 → unresolved + owner partial（fork ②）。
   */
  platform?: string
}

/** 单次解析输入：一条引用（config usingComponents 项 / JSX import）的 specifier。 */
export interface IResolveInput {
  /** 引用方文件绝对路径；相对 / alias 解析以其所在目录为基址。 */
  fromFilePath: string
  /** 原始 specifier（usingComponents value 或 import module specifier），原样保留。 */
  rawSpecifier: string
  /**
   * 引用点的导出符号名：具名 import 原名 / 'default' / undefined（config 声明无
   * 显式符号名，拼身份时按 'default' 语义处理）。barrel 穿透可能改写它（WP3.5）。
   */
  exportName?: string
}

/**
 * 解析结果（§3.3 身份 + §4.4 终态 + §3.4 owner 覆盖度信号 + §6 缺失候选）。
 * resolution 是唯一事实源；unresolved 时不产 id/sourceKind/resolvedFilePath——
 * 不建假节点（§3.3：臆造 sentinel id 会与真节点碰撞）。
 */
export interface IResolveResult {
  /** 四终态（§4.4）。 */
  resolution: TResolution
  /** 节点主键类别；unresolved 时缺省（不建节点）。 */
  sourceKind?: TComponentSourceKind
  /**
   * 稳定身份主键（TSafeId 截断前的原始串）：
   *  - local    : `${realpath}#${exportName}`
   *  - npm      : `${packageName}[/${subpath}]#${exportName}`
   *  - external : 原始 specifier as-is
   * unresolved 时缺省。
   */
  id?: string
  /** local / npm 解析后真实文件绝对路径；external / unresolved 缺省。 */
  resolvedFilePath?: string
  /** npm 包名（含 scope）；sourceKind='npm' 时给出。 */
  packageName?: string
  /** npm 子路径（'@myorg/ui/a' 中的 'a'）；主入口缺省。 */
  packageSubpath?: string
  /** 导出符号名（拼进 local/npm 主键）；external 不拼。 */
  exportName?: string
  /** 原始 specifier，原样保留（external 身份 + 追溯 + unresolved 候选定位）。 */
  rawSpecifier: string
  /**
   * 工具限制类降级信号：为 true 时 owner（引用方节点）的对应 analyzer 应标
   * partial（§3.4）。触发面：alias 不可得、平台后缀-only 无 platform、import
   * `* as X` 无法静态定 export 等——**不是**事实性 missing（拼错路径 / 未装包）。
   */
  ownerPartial: boolean
  /**
   * 缺失候选路径：unresolved 时尝试过、但都不存在的候选（供 WP7 InputManifest
   * 判定缓存失效——补上其中任一文件即应触发重建，§6）。非消费面字段。
   */
  missingCandidates: string[]
  /**
   * 解析过程中**实际读取**的中间文件（barrel/re-export 链上被 findReexportSource
   * 读过的中转文件）。最终落点文件由 resolvedFilePath 承接、调用方另行纳入；此处
   * 只补那些「读了但不成节点」的中转文件——供 WP7 InputManifest「记录已读取文件」
   * （§6），使 barrel 改指向也能触发缓存失效。非消费面字段。
   */
  readFiles: string[]
  /**
   * npm 终态解析到的包 `package.json` 绝对路径（供 WP7 InputManifest「resolved
   * package manifest」——包版本变更即 manifest 内容变、触发失效，§6）。仅
   * sourceKind='npm' 时给出。非消费面字段。
   */
  packageManifestPath?: string
}

// =============================================================================
// specifier 形态分流（§4.4「先按 specifier 形态判定」）
// =============================================================================

/** specifier 的四种形态（分流依据，非终态）。 */
export type TSpecifierShape = 'protocol' | 'alias' | 'relative' | 'bare'

/** `scheme://` 协议前缀（plugin:// / plugin-private:// 等）。 */
const PROTOCOL_RE = /^\w[\w+.-]*:\/\//

/** 相对 / 绝对路径前缀（对齐主仓 `notNpmPkgReg = /^[.\\/]/`）。 */
const RELATIVE_RE = /^[./\\]/

/**
 * 按形态给 specifier 分流（§4.4：形态优先于落点，先分流再各自看落点）。
 * 顺序不可乱：protocol 最先（alias/relative/bare 都不含 `://`）；alias 先于
 * relative（alias key 理论上可含 '/'，但恒不以 './' 开头，仍需在 relative 前判，
 * 避免 alias key 撞相对形态）；relative 次之；其余归 bare（裸包名，含 scope 包）。
 */
export function classifySpecifier(rawSpecifier: string, alias: Record<string, unknown>): TSpecifierShape {
  if (PROTOCOL_RE.test(rawSpecifier)) return 'protocol'
  if (isAliasSpecifier(rawSpecifier, alias)) return 'alias'
  if (RELATIVE_RE.test(rawSpecifier)) return 'relative'
  return 'bare'
}

/**
 * 是否命中 alias 前缀（内联 helper `isAliasPath` 的判定，避免运行时硬依赖其副作用）：
 * 精确等于某 alias key，或以 `<key>/` 开头。空 alias（含无 Kernel）恒 false。
 */
function isAliasSpecifier(name: string, alias: Record<string, unknown>): boolean {
  const prefixes = Object.keys(alias)
  if (prefixes.length === 0) return false
  if (prefixes.includes(name)) return true
  return prefixes.some((p) => name.startsWith(`${p}/`))
}

// =============================================================================
// 解析编排主入口
// =============================================================================

/**
 * 解析一条组件引用到四终态之一（§4.4 判定树）。Config / JSX 通道共用。
 *
 * @param input 引用方文件 + 原始 specifier + 引用点导出符号名
 * @param ctx   解析上下文（projectRoot / alias / platform / hasKernel）
 */
export function resolveComponent(input: IResolveInput, ctx: IResolveContext): IResolveResult {
  const hop = resolveOneHop(input, ctx)
  // 落 local 时尝试 barrel 穿透（§4.4：re-export 是一跳非终态）。visited 贯穿整条
  // 穿透链、以 realpath#export 为键防环（cycle-safe）；其余终态即最终身份。
  if (hop.resolution === 'local' && hop.resolvedFilePath != null) {
    const seedKey = `${hop.resolvedFilePath}#${hop.exportName ?? 'default'}`
    // readAcc 收集穿透链上被 findReexportSource 读过的中转 barrel 文件（§6 InputManifest
    // 「记录已读取文件」）——这些文件不成节点，若不显式记录，barrel 改指向不会触发
    // 缓存失效。终点文件由 resolvedFilePath 另行纳入；重复项由 manifest 层去重。
    const readAcc: string[] = []
    const penetrated = penetrateBarrel(
      hop.resolvedFilePath,
      hop.exportName ?? 'default',
      input.rawSpecifier,
      ctx,
      new Set([seedKey]),
      readAcc,
    )
    if (penetrated != null) return { ...penetrated, readFiles: [...penetrated.readFiles, ...readAcc] }
    return hop
  }
  return hop
}

/**
 * 单跳解析（§4.4 判定树分流，**不做 barrel 穿透**）：把 specifier 解析到其直接
 * 落点终态。穿透由 resolveComponent / penetrateBarrel 在此之上用共享 visited 驱动，
 * 避免每跳重置 visited 导致环无法收敛。
 */
function resolveOneHop(input: IResolveInput, ctx: IResolveContext): IResolveResult {
  const shape = classifySpecifier(input.rawSpecifier, ctx.alias)
  switch (shape) {
    case 'protocol':
      return resolveProtocol(input)
    case 'alias':
    case 'relative':
      return resolveLocal(input, ctx)
    case 'bare':
      return resolveBare(input, ctx)
  }
}

/**
 * `scheme://` 协议引用（plugin:// 等）→ external 终态（§4.4）。
 * 无本地文件、无 realpath，身份即原始 specifier（as-is）。
 */
function resolveProtocol(input: IResolveInput): IResolveResult {
  return {
    resolution: 'external',
    sourceKind: 'external',
    id: input.rawSpecifier,
    rawSpecifier: input.rawSpecifier,
    ownerPartial: false,
    missingCandidates: [],
    readFiles: [],
  }
}

// ---- 以下分支在后续子任务落地（WP3.3 npm / WP3.4 unresolved） --------------

/**
 * 组件文件扩展名候选。前四项对齐 helper `SCRIPT_EXT`（JS_EXT ∪ TS_EXT）；`.vue`
 * 为 WP5b Vue3 承诺项——让 config usingComponents 指向的 Vue3 单文件组件能 local
 * 命中（放尾部：脚本后缀优先，React/Solid 工程无 `.vue` 文件不受影响）。
 */
const SCRIPT_EXTS: readonly string[] = ['.js', '.jsx', '.ts', '.tsx', '.vue']

/**
 * 平台后缀感知的主文件解析（fork ②：resolveMainFilePath 的 env-入参版本）。
 *
 * 忠实复刻 helper `resolveMainFilePath` 的匹配顺序，但把全局 `process.env.TARO_ENV`
 * 换成显式 `platform` 入参——避免共享 Query/watch/活图下改写全局 env 造成串扰。
 * 对每个扩展名，有 platform 时先试平台后缀，再回退无后缀：
 *   `<base>.<platform>.<ext>` → `<base>/index.<platform>.<ext>` → `<base>.<ext>`
 *    → `<base>/index.<ext>`
 * 命中返回首个存在的绝对路径；全不存在返回 undefined（配合缺失候选，WP3.4）。
 *
 * @returns 命中的绝对文件路径，或 undefined（未命中）。
 */
export function resolveMainFileWithPlatform(base: string, platform?: string): string | undefined {
  for (const ext of SCRIPT_EXTS) {
    if (platform) {
      const withPlatform = `${base}.${platform}${ext}`
      if (fs.existsSync(withPlatform)) return withPlatform
      const indexWithPlatform = path.join(base, `index.${platform}${ext}`)
      if (fs.existsSync(indexWithPlatform)) return indexWithPlatform
    }
    const plain = `${base}${ext}`
    if (fs.existsSync(plain)) return plain
    const indexPlain = path.join(base, `index${ext}`)
    if (fs.existsSync(indexPlain)) return indexPlain
  }
  return undefined
}

/**
 * 列出某基路径下「本该存在、但都不存在」的缺失候选（供 WP3.4 unresolved 的
 * missingCandidates 与 WP7 缓存失效判定）。与 resolveMainFileWithPlatform 同序，
 * 但只在有 platform 时收平台后缀候选（无 platform 不臆造平台文件名）。
 */
export function listMainFileCandidates(base: string, platform?: string): string[] {
  const candidates: string[] = []
  for (const ext of SCRIPT_EXTS) {
    if (platform) {
      candidates.push(`${base}.${platform}${ext}`)
      candidates.push(path.join(base, `index.${platform}${ext}`))
    }
    candidates.push(`${base}${ext}`)
    candidates.push(path.join(base, `index${ext}`))
  }
  return candidates
}

/**
 * 列出某脚本文件对应的「config 文件候选」（供缺 config 时登记缺失候选，§6）。
 * 复刻 config-parser `resolvePageConfigPath` 的定位规则：去脚本后缀 → 拼 `.config` →
 * 补脚本后缀。返回全部候选（如 `index.config.ts` / `index.config.js` …）——补上其中
 * 任一即应触发缓存失效，让「冷启动后新增 page/component config」正确失效。
 * 注：config 文件是纯对象、无 JSX/平台后缀分裂，不含 `.vue`（放尾部亦不命中，无害）。
 */
export function listConfigFileCandidates(scriptFilePath: string): string[] {
  const ext = path.extname(scriptFilePath)
  const base = scriptFilePath.slice(0, scriptFilePath.length - ext.length) + '.config'
  // config 不带平台后缀、不建目录 index：只取 `<base>.<ext>` 形态。
  return SCRIPT_EXTS.map((e) => `${base}${e}`)
}

/**
 * 把 alias specifier 展开为绝对基路径（不含扩展名）。
 * alias value 取 taroConfig 惯例的目标目录/文件绝对路径（string）；`<key>` 精确
 * 命中时基路径即该 value，`<key>/rest` 命中时拼上剩余子路径。value 非字符串
 * （罕见的数组式 alias 等本模块不支持的形态）返回 undefined，交由 unresolved 降级。
 */
function expandAliasBase(rawSpecifier: string, alias: Record<string, unknown>): string | undefined {
  for (const key of Object.keys(alias)) {
    const value = alias[key]
    if (typeof value !== 'string') continue
    if (rawSpecifier === key) return value
    if (rawSpecifier.startsWith(`${key}/`)) {
      return path.join(value, rawSpecifier.slice(key.length + 1))
    }
  }
  return undefined
}

/**
 * 相对路径 / alias → 看解析落点（§4.4）。落项目内文件 → local；否则 unresolved
 * （WP3.4 收口降级信号与缺失候选，此处先给出 local 命中路径）。
 *
 * local 身份主键：`${realpath}#${exportName}`（§3.3）。realpath 穿透软链到真实
 * 文件；exportName 缺省按 'default'（config 声明无显式符号名）。
 */
function resolveLocal(input: IResolveInput, ctx: IResolveContext): IResolveResult {
  const base = computeLocalBase(input, ctx)
  // base 为空 = alias 形态但展开不出（alias value 非 string / 前缀不可得）。这是
  // alias 降级面（§4.4）：alias 拿不到属工具限制类 → owner partial（§3.4）。
  if (base == null) return resolveUnresolved(input, [], true)

  const hit = resolveMainFileWithPlatform(base, ctx.platform)
  if (hit == null) {
    // 主文件不存在。区分两类（§3.4 partial 判据 / §12① glob 兄弟文件判据）：
    //  - 无 platform 但存在同名平台后缀兄弟文件（`<base>.<x>.tsx`）→ 后缀-only 组件
    //    在无 platform 下无法解析，属工具限制类 → owner partial。
    //  - 否则视为拼错的 relative/alias 路径（事实性 missing）→ 不降 owner 覆盖度。
    const suffixOnly = ctx.platform == null && hasPlatformSuffixSibling(base)
    return resolveUnresolved(input, listMainFileCandidates(base, ctx.platform), suffixOnly)
  }

  const realpath = fs.realpathSync(hit)
  const exportName = input.exportName ?? 'default'
  // 单跳 local 结果（barrel 穿透由 resolveComponent 在此之上驱动，带共享 visited）。
  return {
    resolution: 'local',
    sourceKind: 'local',
    id: `${realpath}#${exportName}`,
    resolvedFilePath: realpath,
    exportName,
    rawSpecifier: input.rawSpecifier,
    ownerPartial: false,
    missingCandidates: [],
    readFiles: [],
  }
}

/**
 * barrel/re-export 穿透（§4.4：非终态的一跳，穿透后仍收敛 4 终态）。
 *
 * 检查 `filePath` 是否把 `exportName` re-export 自另一模块（`export { X } from '...'`
 * / `export { default as X } from '...'` / `export * from '...'`）；是则对新模块
 * 递归解析并返回其终态结果，直到最终定义文件。遍历 **cycle-safe**：visited 以
 * `realpath#export` 为键，重入即停（返回 null，回退到当前 local 身份，不死循环）。
 * 不进类型推导（§4.4）：只做语法层 re-export 跟随。
 *
 * @returns 穿透后的终态结果；无 re-export / 命中环 / 穿透失败时返回 null（调用方
 *   回退到当前 local 结果——barrel 文件自身即最终身份）。
 */
function penetrateBarrel(
  filePath: string,
  exportName: string,
  originalSpecifier: string,
  ctx: IResolveContext,
  visited: Set<string>,
  readAcc: string[],
): IResolveResult | null {
  const reexport = findReexportSource(filePath, exportName)
  if (reexport == null) return null
  // filePath 是被 findReexportSource 实际读过、且确含 re-export 的中转 barrel 文件——
  // 记入 readAcc（§6 InputManifest「已读取文件」），使其内容变更触发缓存失效。
  readAcc.push(filePath)

  // 跟随 re-export 的一跳：以当前 barrel 文件为 from、目标模块为新 specifier。用
  // resolveOneHop（不穿透）解析到直接落点，穿透递归由本函数带共享 visited 驱动。
  const next = resolveOneHop(
    { fromFilePath: filePath, rawSpecifier: reexport.moduleSpecifier, exportName: reexport.sourceName },
    ctx,
  )

  // 穿透落 local：判环后继续深穿（深链 barrel）。
  if (next.resolution === 'local' && next.resolvedFilePath != null) {
    const key = `${next.resolvedFilePath}#${next.exportName ?? 'default'}`
    if (visited.has(key)) return null // 命中环：停，回退当前身份，不死循环
    visited.add(key)
    const deeper = penetrateBarrel(next.resolvedFilePath, next.exportName ?? 'default', originalSpecifier, ctx, visited, readAcc)
    // 最终身份沿用穿透终点，但 rawSpecifier 保留最初引用点的原始 specifier（追溯用）。
    return { ...(deeper ?? next), rawSpecifier: originalSpecifier }
  }

  // 穿透落 npm / external / unresolved：即为终态，保留最初 rawSpecifier。
  return { ...next, rawSpecifier: originalSpecifier }
}

/**
 * 在 `filePath` 中查找把 `exportName` re-export 出去的来源模块（语法层，不做类型
 * 推导）。识别三种 barrel 形态：
 *  - `export { A, B as exportName } from './mod'` → 命中，sourceName 取原名（B）
 *  - `export { default as exportName } from './mod'` → sourceName='default'
 *  - `export * from './mod'` → 命中，sourceName 沿用 exportName（星号透传同名）
 * 无 `from`（本地 `export { X }`）不算 re-export（X 定义在本文件，本文件即终点）。
 *
 * @returns { moduleSpecifier, sourceName } 或 null（该文件未 re-export exportName）。
 */
function findReexportSource(
  filePath: string,
  exportName: string,
): { moduleSpecifier: string, sourceName: string } | null {
  let text: string
  try {
    text = fs.readFileSync(filePath, 'utf8')
  } catch {
    return null
  }
  const sourceFile = ts.createSourceFile(filePath, text, ts.ScriptTarget.Latest, /* setParentNodes */ false)

  let starReexport: string | null = null
  for (const stmt of sourceFile.statements) {
    if (!ts.isExportDeclaration(stmt) || stmt.moduleSpecifier == null) continue
    if (!ts.isStringLiteral(stmt.moduleSpecifier)) continue
    const moduleSpecifier = stmt.moduleSpecifier.text

    if (stmt.exportClause == null) {
      // `export * from '...'`：延后处理（具名 re-export 优先命中）。
      starReexport ??= moduleSpecifier
      continue
    }
    if (ts.isNamedExports(stmt.exportClause)) {
      for (const el of stmt.exportClause.elements) {
        // 导出名（as 后的名，无 as 则同 propertyName/name）
        if (el.name.text !== exportName) continue
        // 来源名：有 propertyName（`B as X`）取 B，否则取 name
        const sourceName = el.propertyName?.text ?? el.name.text
        return { moduleSpecifier, sourceName }
      }
    }
  }

  // 无具名命中时，`export * from` 透传同名 export（星号沿用 exportName）。
  if (starReexport != null) {
    return { moduleSpecifier: starReexport, sourceName: exportName }
  }
  return null
}

/**
 * 无 platform 时判定「主文件缺失是否因后缀-only 组件」（§12① glob 兄弟文件判据）：
 * 扫描基路径同目录，若存在同名的平台后缀文件（`<name>.<platform>.<ext>` 或
 * `<name>/index.<platform>.<ext>` 形态的兄弟）则为 true。这类组件在无 platform 上
 * 下文下无法确定具体平台文件 → 属工具限制类 unresolved（owner partial），区别于
 * 拼错路径的事实性 missing。
 *
 * 中缀黑名单：平台名是运行时动态注册（`global['PLATFORMS']`，含第三方端），静态
 * 拿不到白名单（§12① 明列为遗留低优先项），故不用平台白名单而排除已知**非平台**
 * 中缀（test/spec/d/config/stories/mock 等），避免把 `Foo.test.tsx`/`Foo.d.ts` 之类
 * 误判成平台兄弟、把事实性 missing 反向误标 partial（§3.4 要防的反向误报）。
 */
const NON_PLATFORM_INFIXES = new Set(['test', 'spec', 'd', 'config', 'stories', 'story', 'mock', 'mocks'])

function hasPlatformSuffixSibling(base: string): boolean {
  const dir = path.dirname(base)
  const name = path.basename(base)
  const exts = new Set(SCRIPT_EXTS)
  // 形态一：<dir>/<name>.<infix>.<ext>，infix 非黑名单（视作平台名）。
  const fileRe = new RegExp(`^${escapeRegExp(name)}\\.([^.]+)(\\.[^.]+)$`)
  try {
    for (const entry of fs.readdirSync(dir)) {
      const m = entry.match(fileRe)
      if (m != null && exts.has(m[2]) && !NON_PLATFORM_INFIXES.has(m[1])) return true
    }
  } catch {
    // 目录不存在等：无兄弟可言。
  }
  // 形态二：<base>/index.<infix>.<ext>（base 是目录）。
  const idxRe = /^index\.([^.]+)(\.[^.]+)$/
  try {
    for (const entry of fs.readdirSync(base)) {
      const m = entry.match(idxRe)
      if (m != null && exts.has(m[2]) && !NON_PLATFORM_INFIXES.has(m[1])) return true
    }
  } catch {
    // base 非目录：跳过。
  }
  return false
}

/** 转义正则元字符（用于按文件名精确构造匹配）。 */
function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/**
 * 求 local 解析的绝对基路径（不含扩展名）：
 *  - relative：以引用方文件所在目录为基址 resolve。
 *  - alias   ：展开 alias 前缀为绝对基路径（expandAliasBase）。
 * 返回 undefined 表示 alias 无法展开（value 非 string）。
 */
function computeLocalBase(input: IResolveInput, ctx: IResolveContext): string | undefined {
  if (RELATIVE_RE.test(input.rawSpecifier)) {
    return path.resolve(path.dirname(input.fromFilePath), input.rawSpecifier)
  }
  // 走到这里必是 alias 形态（classifySpecifier 已分流）。
  return expandAliasBase(input.rawSpecifier, ctx.alias)
}

/** 裸包名 → npm 分支（§4.4：先判 npm，不看 realpath 落点）。 */
function resolveBare(input: IResolveInput, ctx: IResolveContext): IResolveResult {
  const { packageName, subpath } = splitPackageSpecifier(input.rawSpecifier)
  const packageRoot = resolvePackageRoot(packageName, ctx.projectRoot)

  // 未安装 / require.resolve 失败：能识别为包名但无本地文件 → external（§4.4）。
  if (packageRoot == null) {
    return externalResult(input.rawSpecifier)
  }

  // 已安装：定位真实文件。无 subpath 取包主入口；有 subpath 在包根下补后缀解析。
  const resolvedFilePath = subpath
    ? resolveMainFileWithPlatform(path.join(packageRoot.dir, subpath), ctx.platform)
    : packageRoot.entry

  // 包已装但 subpath / exports 解析不出文件 → external（§4.4「exports 解析失败」）。
  if (resolvedFilePath == null) {
    return externalResult(input.rawSpecifier)
  }

  const exportName = input.exportName ?? 'default'
  const id = `${packageName}${subpath ? `/${subpath}` : ''}#${exportName}`
  return {
    resolution: 'npm',
    sourceKind: 'npm',
    id,
    resolvedFilePath,
    packageName,
    packageSubpath: subpath || undefined,
    exportName,
    rawSpecifier: input.rawSpecifier,
    ownerPartial: false,
    missingCandidates: [],
    readFiles: [],
    // 包 package.json：版本/main 变更即 manifest 内容变 → WP7 缓存失效（§6）。
    packageManifestPath: packageRoot.manifest,
  }
}

/** external 终态结果（无本地文件，身份即原始 specifier as-is）。protocol 与未装包共用。 */
function externalResult(rawSpecifier: string): IResolveResult {
  return {
    resolution: 'external',
    sourceKind: 'external',
    id: rawSpecifier,
    rawSpecifier,
    ownerPartial: false,
    missingCandidates: [],
    readFiles: [],
  }
}

/**
 * 拆裸包 specifier 为「包名 + 包内子路径」（对齐 helper `getNpmPackageAbsolutePath`）：
 *  - `@scope/pkg/a/b` → packageName='@scope/pkg', subpath='a/b'
 *  - `vant/es/button` → packageName='vant',        subpath='es/button'
 *  - `@scope/pkg` / `vant` → subpath=''
 */
export function splitPackageSpecifier(specifier: string): { packageName: string, subpath: string } {
  const parts = specifier.split('/')
  if (specifier.startsWith('@')) {
    return { packageName: parts.slice(0, 2).join('/'), subpath: parts.slice(2).join('/') }
  }
  return { packageName: parts[0], subpath: parts.slice(1).join('/') }
}

/**
 * 以 projectRoot 为基址定位包根（fork ①）。忠实 helper `getNpmPackageAbsolutePath`
 * 的「resolve 包主入口 → 正则截出包根」思路，但把裸 `require.resolve(pkg)`（以本
 * 模块所在包为基址、独立 CLM 下找不到目标工程依赖）换成 `{paths:[projectRoot]}`。
 *
 * @returns { dir: 包根绝对目录, entry: 包主入口绝对文件 }，或 undefined（未安装）。
 */
function resolvePackageRoot(packageName: string, projectRoot: string): { dir: string, entry: string, manifest: string } | undefined {
  try {
    const entry = require.resolve(packageName, { paths: [projectRoot] })
    const escaped = escapeRegExp(packageName)
    // 从主入口路径截包根：锚定最后一个 `node_modules/<pkg>` 边界（贪婪 `.*` 吃到
    // 最后一次 node_modules，避免包名在路径里多次出现时截错——如 pnpm 的
    // `.../node_modules/.pnpm/vant@x/node_modules/vant/index.js` 要取靠右那个）。
    const match = entry.match(new RegExp(`^.*[\\\\/]node_modules[\\\\/]${escaped}(?=[\\\\/]|$)`))
    if (match == null) return undefined
    return { dir: match[0], entry, manifest: path.join(match[0], 'package.json') }
  } catch {
    return undefined
  }
}

/**
 * unresolved 终态（§4.4：只留 edge + 缺失候选，**不建节点**）。
 *
 * 不产 id/sourceKind/resolvedFilePath——§3.3 明确 unresolved 不创建虚假节点，
 * 也不臆造 sentinel id（否则消费方可能读到与真节点碰撞的幻影 id）。
 *
 * @param ownerPartial 是否为工具限制类降级（§3.4）：alias 不可得 / 无 platform
 *   的后缀-only 组件 → true（owner analyzer 标 partial）；拼错的 relative/alias
 *   路径等事实性 missing → false（只在 edge 上体现，不降 owner 覆盖度）。
 * @param candidates 尝试过但都不存在的缺失候选路径（供 WP7 InputManifest 判缓存
 *   失效——补上其中任一文件即应触发重建，§6）。
 */
function resolveUnresolved(input: IResolveInput, candidates: string[], ownerPartial: boolean): IResolveResult {
  return {
    resolution: 'unresolved',
    rawSpecifier: input.rawSpecifier,
    ownerPartial,
    missingCandidates: candidates,
    readFiles: [],
  }
}
