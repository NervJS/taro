/**
 * @tarojs/project-graph — Config 组件图（WP4）
 *
 * 从 app/page/component config 的 `usingComponents` 声明抽取组件引用，经 WP3
 * Resolver 解析成 IUsingComponentEdge 与 IComponentNode（§4.2 Config 通道）。
 *
 * §4.2 核心：**config 求值与证据提取分离**——config 对象由 `readConfig`（esbuild
 * 求值）产出，本模块只从最终对象读 `usingComponents`；源码位置证据（sourceSpan）
 * 另由轻量 AST 解析定位（WP4.3），缺精确 span 时保留文件级证据并标 partial，不伪造。
 *
 * 本模块（WP4.1）只负责**声明抽取**：把 config 对象里的 usingComponents 规范化为
 * 声明项列表。WP4.2 在其上编排解析（建边 / 建节点 / 递归浅纳入），span 定位归 WP4.3。
 */

import * as fs from 'node:fs'

import ts from 'typescript'

import { readPageConfigContent, resolvePageConfigPath } from './config-parser'
import { listConfigFileCandidates, resolveComponent } from './resolver'

import type { IResolveContext } from './resolver'
import type { IComponentConfig, IComponentNode, ISourceSpan, IUsingComponentEdge, TAnalysisStatus } from './schema'

/**
 * usingComponents 单条声明（规范化后，未解析）。
 * 对齐主仓 MiniPlugin `const compPath = value instanceof Array ? value[0] : value`：
 * value 可为 string（`compPath`）或数组（`[compPath, ...opts]`）。
 */
export interface IUsingComponentDecl {
  /** 引用方节点 id（AppNode='app' / PageNode.id / ComponentNode.id）。 */
  ownerNodeId: string
  /** usingComponents 的 key —— 使用方本地符号名（localName）。 */
  localName: string
  /** 原始 specifier（value 或 value[0]），原样保留，交 Resolver 解析。 */
  rawSpecifier: string
  /** 数组形态 `[path, ...opts]` 的 opts（value.slice(1)）；string 形态或无 opts 时缺省。 */
  usingOptions?: unknown
}

/**
 * 从单个 config 对象抽取 usingComponents 声明项（不解析、不建边）。
 *
 * 读 `config.usingComponents`（对象 map：key=localName，value=specifier 或
 * `[specifier, ...opts]`）。非法/缺失/空 map 返回 []（config 没声明组件是正常态，
 * 不是错误）。value 为空串或非 string/数组的脏项被丢弃（不产声明，避免臆造）。
 *
 * @param config config 求值后的对象（readConfig 产出）
 * @param ownerNodeId 引用方节点 id（app / pageId / componentId）
 */
export function extractUsingComponents(config: unknown, ownerNodeId: string): IUsingComponentDecl[] {
  if (config == null || typeof config !== 'object') return []
  const using = (config as Record<string, unknown>).usingComponents
  if (using == null || typeof using !== 'object' || Array.isArray(using)) return []

  const decls: IUsingComponentDecl[] = []
  for (const [localName, value] of Object.entries(using as Record<string, unknown>)) {
    const parsed = parseUsingValue(value)
    if (parsed == null) continue // 脏项（非 string/数组、空 specifier）丢弃
    decls.push({ ownerNodeId, localName, rawSpecifier: parsed.rawSpecifier, usingOptions: parsed.usingOptions })
  }
  return decls
}

/**
 * 规范化单个 usingComponents value（string | [path, ...opts]）为 specifier + opts。
 * @returns { rawSpecifier, usingOptions? } 或 null（脏值：非 string/数组、path 非
 *   非空 string）。
 */
function parseUsingValue(value: unknown): { rawSpecifier: string, usingOptions?: unknown } | null {
  if (typeof value === 'string') {
    return value.length > 0 ? { rawSpecifier: value } : null
  }
  if (Array.isArray(value)) {
    const head = value[0]
    if (typeof head !== 'string' || head.length === 0) return null
    // 对齐主仓 value[0] 语义：path=value[0]，其余为 opts；无其余则不带 usingOptions。
    const rest = value.slice(1)
    return rest.length > 0 ? { rawSpecifier: head, usingOptions: rest } : { rawSpecifier: head }
  }
  return null
}

// =============================================================================
// WP4.2：usingComponent 边 + ComponentNode 建图 + 递归浅纳入
// =============================================================================

/** 根 owner（App / Page）的 config 入口，供 buildConfigComponentGraph 起手遍历。 */
export interface IConfigOwnerInput {
  /** owner 节点 id（'app' / PageNode.id）。 */
  ownerNodeId: string
  /** owner 的 config 对象（readConfig 求值产出）。 */
  config: unknown
  /** owner config 文件绝对路径（相对 specifier 解析基址；也用于 WP4.3 span 定位）。 */
  configFilePath: string
}

/** buildConfigComponentGraph 产出。 */
export interface IConfigGraphResult {
  /** config 声明关系边（usingComponent）。 */
  edges: IUsingComponentEdge[]
  /** 被引用到的组件节点（local/npm/external；unresolved 不建节点）。按 id 去重。 */
  components: IComponentNode[]
  /**
   * configAnalyzer 覆盖度需降级为 partial 的 owner 节点 id 集合（§3.4：工具限制类
   * unresolved 的 ownerPartial）。由调用方（graph.ts）据此把对应节点 configAnalyzerStatus
   * 标 partial——本模块不直接改节点，保持与 graph 组装解耦。
   */
  partialOwners: Set<string>
  /**
   * §6 InputManifest 输入线索（供 WP7 cache/watch，非消费面）：
   *  - readFiles          : 本通道读过的 config 源文件 + barrel 中转文件。
   *  - missingCandidates  : unresolved 尝试过但不存在的候选路径（补上即应失效）。
   *  - packageManifestPaths: npm 组件解析到的 package.json 路径（版本变更即失效）。
   * 三者均去重前的原始累积，由 graph.ts 汇入 manifest 时统一去重。
   */
  readFiles: string[]
  missingCandidates: string[]
  packageManifestPaths: string[]
}

/**
 * 编排 config 组件图（§4.2 + §2.1 递归浅纳入）：
 *  1. 对每个根 owner（App/Page）抽 usingComponents 声明 → Resolver 解析 → 建
 *     IUsingComponentEdge；resolution∈{local,npm,external} 建/复用 IComponentNode，
 *     unresolved 只留边不建节点（to 缺省）。
 *  2. **local 组件命中后递归**其 component config 的 usingComponents（app 级全局组件
 *     同为递归入口）；**npm/external 为递归终点**（浅纳入，不读其 config/子依赖）。
 *  3. cycle-safe：visited 按 local 组件 filePath 去重，组件循环引用不死循环。
 *
 * @param owners 根 owner 列表（App + 各 Page）
 * @param ctx    Resolver 上下文（projectRoot / alias / platform / hasKernel）
 */
export function buildConfigComponentGraph(owners: IConfigOwnerInput[], ctx: IResolveContext): IConfigGraphResult {
  const edges: IUsingComponentEdge[] = []
  const components = new Map<string, IComponentNode>()
  const partialOwners = new Set<string>()
  // §6 InputManifest 输入累积（去重交 graph.ts）。
  const readFiles: string[] = []
  const missingCandidates: string[] = []
  const packageManifestPaths: string[] = []
  // 递归 visited：已展开 config 的 local 组件文件（防组件间 config 循环引用死循环）。
  const expanded = new Set<string>()

  /** 处理单个 owner 的所有 usingComponents 声明；fromFilePath 为该 owner config 文件。 */
  const processOwner = (ownerNodeId: string, config: unknown, fromFilePath: string): void => {
    // owner 的 config 源文件恒被读取（span 定位 / 递归浅读）→ 记入 InputManifest。
    readFiles.push(fromFilePath)
    const decls = extractUsingComponents(config, ownerNodeId)
    // §4.2 求值与证据分离：从 config 源文件 AST 定位各项精确 span。
    const spanResult = decls.length > 0 ? extractUsingComponentSpans(fromFilePath) : { fileParsed: false, spans: new Map() }
    for (const decl of decls) {
      // config usingComponents 的 key 是**使用方标签名**（localName），value 是模块
      // 路径；按小程序语义指向该组件文件的**默认导出**——故 exportName 恒 'default'
      // （不传，resolver 默认 default）。用 localName 当 exportName 是语义错误：会让
      // config 边（`file#Tag`）与 JSX 默认导入边（`file#default`）对同一文件落不同
      // 节点身份（§3.3 一致性裂缝）。localName 仅作边上的 owner 本地符号记录。
      const r = resolveComponent(
        { fromFilePath, rawSpecifier: decl.rawSpecifier },
        ctx,
      )
      // 汇集解析过程的输入线索（§6）：barrel 中转文件、缺失候选、npm manifest。
      readFiles.push(...r.readFiles)
      missingCandidates.push(...r.missingCandidates)
      if (r.packageManifestPath != null) packageManifestPaths.push(r.packageManifestPath)

      // source evidence（§4.2）：命中字面量 key → 精确 span；文件解析成功但该项无字面量
      // （spread/动态拼接项）→ 文件级证据（仅 filePath）+ 标 owner partial，不伪造位置。
      // 文件整个读不到（fileParsed=false，真实运行时 config 恒有文件，主要是测试/异常态）
      // 仍给文件级证据但不因此降级——那不是「某项 span 精度不足」，与 §4.2 partial 语义无关。
      const preciseSpan = spanResult.spans.get(decl.localName)
      const sourceSpan: ISourceSpan = preciseSpan ?? { filePath: fromFilePath }
      if (preciseSpan == null && spanResult.fileParsed) partialOwners.add(ownerNodeId)

      // 建边（usingComponent）：resolution 是唯一事实源；unresolved 时 to 缺省。
      const edge: IUsingComponentEdge = {
        kind: 'usingComponent',
        from: ownerNodeId,
        to: r.resolution === 'unresolved' ? undefined : r.id,
        resolution: r.resolution,
        rawSpecifier: decl.rawSpecifier,
        localName: decl.localName,
        usingOptions: decl.usingOptions,
        sourceSpan,
      }
      edges.push(edge)

      // 工具限制类 unresolved（ownerPartial）→ 标 owner configAnalyzer partial（§3.4）。
      if (r.ownerPartial) partialOwners.add(ownerNodeId)

      // 建/复用组件节点（unresolved 不建节点）。
      if (r.resolution !== 'unresolved' && r.id != null) {
        // local 解析到的真实文件是输入：删除/改动它会翻转终态或改内容 → 缓存失效（§6）。
        // 尤其 local 组件即便无自身 config（expandLocalComponent 会早退），其源码文件也须入
        // manifest。npm 不记其入口文件内容（浅纳入终态，§2.1）——只 package.json manifest 入
        // packageManifestPaths。
        if (r.resolution === 'local' && r.resolvedFilePath != null) readFiles.push(r.resolvedFilePath)
        if (!components.has(r.id)) {
          components.set(r.id, buildComponentNode(r.id, r.resolution, r.resolvedFilePath, r.packageName, r.packageSubpath, ctx.alias as Record<string, unknown>))
        }
        // 递归浅纳入：仅 local 组件展开其 component config（npm/external 为终点）。
        if (r.resolution === 'local' && r.resolvedFilePath != null && !expanded.has(r.resolvedFilePath)) {
          expanded.add(r.resolvedFilePath)
          expandLocalComponent(r.id, r.resolvedFilePath)
        }
      }
    }
  }

  /** 展开 local 组件的 component config：读其 .config 文件、以该组件为新 owner 递归。 */
  const expandLocalComponent = (componentId: string, componentFilePath: string): void => {
    const configFilePath = resolvePageConfigPath(componentFilePath)
    if (configFilePath == null) {
      // 组件当前无 config 文件：登记其 config 候选为缺失候选（§6）——冷启动后给组件
      // 新增 config（声明子组件）应触发失效，否则命中旧图漏掉新增的组件依赖边。
      missingCandidates.push(...listConfigFileCandidates(componentFilePath))
      return
    }
    // 组件 config 文件存在即被读取（无论解析成功与否）→ 记入 InputManifest：修好损坏的
    // 组件 config、或改其 usingComponents 都应触发缓存失效（§6）。processOwner 成功递归时
    // 会再 push 一次，manifest 层去重吸收。
    readFiles.push(configFilePath)
    const result = readPageConfigContent(configFilePath, ctx.alias as Record<string, unknown>)
    if (result.failed || result.config == null) return // 解析失败/空：不递归（失败由 owner 侧处理）
    // 组件 config 里的相对 specifier 以 **config 文件** 为基址解析。
    processOwner(componentId, result.config, configFilePath)
  }

  for (const owner of owners) {
    processOwner(owner.ownerNodeId, owner.config, owner.configFilePath)
  }

  return { edges, components: [...components.values()], partialOwners, readFiles, missingCandidates, packageManifestPaths }
}

/**
 * 由 Resolver 结果构造 IComponentNode（§3.3 身份）。
 * npm/external 浅纳入终态：configAnalyzerStatus/jsxAnalyzerStatus 恒 'complete'
 * （无挖掘空间，§schema 注释）；local 组件的覆盖度在其被作为 owner 展开时由 config
 * 解析结果决定，此处先给 'complete'，失败态由 partialOwners/issues 侧承接。
 */
function buildComponentNode(
  id: string,
  resolution: 'local' | 'npm' | 'external',
  resolvedFilePath: string | undefined,
  packageName: string | undefined,
  packageSubpath: string | undefined,
  alias: Record<string, unknown>,
): IComponentNode {
  const status: TAnalysisStatus = 'complete'
  const node: IComponentNode = {
    id,
    sourceKind: resolution,
    configAnalyzerStatus: status,
    jsxAnalyzerStatus: status,
  }
  if (resolvedFilePath != null) node.resolvedFilePath = resolvedFilePath
  if (packageName != null) node.packageName = packageName
  if (packageSubpath != null) node.packageSubpath = packageSubpath
  // local 组件的 config 浅读（供消费方），仅在其有 config 文件时填充。alias 与递归
  // 展开（expandLocalComponent）同源透传，避免同一 config 文件在浅读时因缺 alias 而
  // esbuild 解析失败、便利字段静默为空，与递归建边结果背离。
  if (resolution === 'local' && resolvedFilePath != null) {
    const cfgPath = resolvePageConfigPath(resolvedFilePath)
    if (cfgPath != null) {
      node.configFilePath = cfgPath
      const res = readPageConfigContent(cfgPath, alias as Record<string, unknown>)
      if (!res.failed && res.config != null) node.config = res.config as IComponentConfig
    }
  }
  return node
}

// =============================================================================
// WP4.3：config source evidence —— usingComponents key/value span 定位（§4.2）
// =============================================================================

/** extractUsingComponentSpans 结果：区分「文件解析成功」与「读/解析失败」。 */
export interface IUsingComponentSpans {
  /** config 源文件是否成功读取并解析（false=文件不存在/读失败/解析异常）。 */
  fileParsed: boolean
  /** localName → 精确 span（仅命中字面量 key 的项）。 */
  spans: Map<string, ISourceSpan>
}

/**
 * 从 config **源文件文本**（非求值后对象）轻量 AST 定位每个 usingComponents 项的
 * 精确 sourceSpan（§4.2：求值与证据提取分离）。
 *
 * 只做语法层定位：找 `usingComponents` 对象字面量的每个 property，key 的字符串名 →
 * localName，property 整体 span → 1-based 行列。config 用 spread / 变量 / define 动态
 * 拼接、某项在源码 AST 里没有对应字面量 key 时，自然不出现在 spans 里——调用方据此
 * 对缺 span 的项保留文件级证据并标 partial，不伪造位置。
 *
 * fileParsed 区分两种「无 span」：文件解析成功但某项缺字面量（真·动态项 → partial）
 * vs 文件根本读不到（fileParsed=false，调用方据此决定是否为整个 owner 降级——真实
 * 运行时 config 恒来自真实文件，此分支主要防御测试/异常态）。
 */
export function extractUsingComponentSpans(configFilePath: string): IUsingComponentSpans {
  const spans = new Map<string, ISourceSpan>()
  let text: string
  try {
    text = fs.readFileSync(configFilePath, 'utf8')
  } catch {
    return { fileParsed: false, spans }
  }
  let sourceFile: ts.SourceFile
  try {
    sourceFile = ts.createSourceFile(configFilePath, text, ts.ScriptTarget.Latest, /* setParentNodes */ true)
  } catch {
    return { fileParsed: false, spans }
  }

  // 找 usingComponents 对象字面量（可能出现在 default export 对象、变量声明等任意位置；
  // 语法层扫描所有 `usingComponents: { ... }` 形态的 PropertyAssignment）。
  const visit = (node: ts.Node): void => {
    if (
      ts.isPropertyAssignment(node) &&
      getPropertyKeyName(node.name) === 'usingComponents' &&
      ts.isObjectLiteralExpression(node.initializer)
    ) {
      for (const prop of node.initializer.properties) {
        // 只认字面量 key 的 PropertyAssignment/ShorthandPropertyAssignment；spread
        // （SpreadAssignment）等动态项无字面量 key，跳过 → 该项后续走文件级证据 + partial。
        if (!ts.isPropertyAssignment(prop) && !ts.isShorthandPropertyAssignment(prop)) continue
        const localName = getPropertyKeyName(prop.name)
        if (localName == null) continue
        spans.set(localName, nodeToSpan(sourceFile, configFilePath, prop))
      }
    }
    ts.forEachChild(node, visit)
  }
  visit(sourceFile)
  return { fileParsed: true, spans }
}

/** 取 property key 的字符串名（标识符 / 字符串字面量 / 数字字面量）；计算属性等返回 undefined。 */
function getPropertyKeyName(name: ts.PropertyName): string | undefined {
  if (ts.isIdentifier(name) || ts.isStringLiteral(name) || ts.isNumericLiteral(name)) {
    return name.text
  }
  return undefined
}

/** 把 AST 节点位置转 1-based 行列的 ISourceSpan。 */
function nodeToSpan(sourceFile: ts.SourceFile, filePath: string, node: ts.Node): ISourceSpan {
  const start = sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile))
  const end = sourceFile.getLineAndCharacterOfPosition(node.getEnd())
  return {
    filePath,
    startLine: start.line + 1,
    startColumn: start.character + 1,
    endLine: end.line + 1,
    endColumn: end.character + 1,
  }
}
