/**
 * @tarojs/project-graph — JSX 组件使用图（WP5a）
 *
 * 从页面 / 组件源码的 JSX 抽取「实际作为标签使用的组件引用」，经 WP3 Resolver 解析
 * 成 IComponentUsageEdge 与 IComponentNode（§4.3 JSX 通道）。
 *
 * §4.3 核心：建 import binding，**只保留实际作为 JSX 标签使用的 binding**，排除普通
 * 模块 import 与未使用 import；解析目标模块与导出符号后递归分析命中组件。
 *
 * §1.4 / §2.1：componentUsage（JSX 实际使用）与 usingComponent（config 声明）是**两类
 * 独立事实**，不相互推断或覆盖——本模块只产 componentUsage，config 声明归 config-graph。
 *
 * 本模块（WP5a.1）只负责**扫描**：建 binding 表 + 找 JSX 标签使用 → 产出组件引用候选。
 * WP5a.2 在其上编排解析（建边 / 建节点 / 递归），span 与 config-graph 对称从略。
 */

import * as fs from 'node:fs'

import ts from 'typescript'

import { resolveComponent } from './resolver'

import type { IResolveContext } from './resolver'
import type { IComponentNode, IComponentUsageEdge, TAnalysisStatus } from './schema'

/**
 * JSX 里实际用作标签的组件引用候选（未解析）。
 * 由 import binding 与 JSX 标签使用**取交集**得到：既被 import、又实际当标签用。
 */
export interface IJsxComponentRef {
  /** 使用方本地符号名（JSX 标签根标识符，如 `<Foo>` 的 Foo、`<Foo.Bar>` 的 Foo）。 */
  localName: string
  /** import 来源模块 specifier（原样保留，交 Resolver 解析）。 */
  rawSpecifier: string
  /**
   * import 的导出符号名：具名 import 原名 / 'default'（默认 import）/ undefined。
   * 命名空间 import（`import * as X`）时无具体 export 名，见 isNamespace。
   */
  importedName?: string
  /**
   * 是否来自命名空间 import（`import * as X from '...'`，JSX 用 `<X.Y>`）。
   * 此时具体 export（Y）无法静态确定 → WP5a.2 据此把 owner jsxAnalyzer 标 partial
   * （§3.4 工具限制类：模块已解析、仅具体 export 不可静态确定）。
   */
  isNamespace: boolean
}

/** 单个源文件的 JSX 组件引用扫描结果。 */
export interface IJsxScanResult {
  /** 实际作为 JSX 标签使用的组件引用（已与 binding 取交集）。 */
  refs: IJsxComponentRef[]
  /** 文件是否含 JSX（判定是否 React/Preact/Solid 组件文件的信号之一）。 */
  hasJsx: boolean
}

/** 单条 import binding（模块内某个本地符号的来源）。 */
interface IImportBinding {
  rawSpecifier: string
  /** 具名 import 的导出原名 / 'default'；命名空间 import 时 undefined。 */
  importedName?: string
  isNamespace: boolean
}

/**
 * 扫描源文件的 JSX 组件使用（§4.3）。
 *
 * 两步取交集：① 建全部 import 的 binding 表（default/named/namespace）；② 遍历 AST
 * 收集实际用作 JSX 标签根的标识符；只有既在 binding 表、又实际当标签用的符号才产
 * 组件引用——排除「import 了但没当标签用」（普通模块 / 工具函数 / 未使用 import）。
 *
 * @param text 源文件文本
 * @param filePath 源文件路径（仅用于 createSourceFile 的 scriptKind 判定）
 */
export function scanJsxComponentRefs(text: string, filePath: string): IJsxScanResult {
  const sourceFile = createSourceFile(filePath, text)
  const bindings = collectImportBindings(sourceFile)
  const usedTags = new Set<string>()
  let hasJsx = false

  const visit = (node: ts.Node): void => {
    if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) {
      hasJsx = true
      const root = getTagRootName(node.tagName)
      if (root != null) usedTags.add(root)
    } else if (ts.isJsxElement(node) || ts.isJsxFragment(node)) {
      hasJsx = true
    }
    ts.forEachChild(node, visit)
  }
  visit(sourceFile)

  // 交集：既被 import（在 binding 表）、又实际当 JSX 标签用（在 usedTags）。
  const refs: IJsxComponentRef[] = []
  for (const localName of usedTags) {
    const binding = bindings.get(localName)
    if (binding == null) continue // 原生标签（view/text）或未 import 的符号 → 跳过
    refs.push({
      localName,
      rawSpecifier: binding.rawSpecifier,
      importedName: binding.importedName,
      isNamespace: binding.isNamespace,
    })
  }
  return { refs, hasJsx }
}

/** 按文件后缀选 TSX/JSX/TS scriptKind 创建 SourceFile（与 page-parser 同策略）。 */
function createSourceFile(filePath: string, text: string): ts.SourceFile {
  const lower = filePath.toLowerCase()
  const scriptKind = lower.endsWith('.tsx')
    ? ts.ScriptKind.TSX
    : lower.endsWith('.jsx') || lower.endsWith('.js')
      ? ts.ScriptKind.JSX
      : ts.ScriptKind.TS
  return ts.createSourceFile(filePath, text, ts.ScriptTarget.Latest, /* setParentNodes */ true, scriptKind)
}

/**
 * 取 JSX 标签根标识符名：
 *  - `<Foo>` → 'Foo'
 *  - `<Foo.Bar>` → 'Foo'（成员访问根，用于匹配 namespace import binding）
 *  - `<this.X>` / 其它非标识符根 → undefined
 */
function getTagRootName(tagName: ts.JsxTagNameExpression): string | undefined {
  if (ts.isIdentifier(tagName)) return tagName.text
  if (ts.isPropertyAccessExpression(tagName)) {
    let expr: ts.Expression = tagName
    while (ts.isPropertyAccessExpression(expr)) expr = expr.expression
    return ts.isIdentifier(expr) ? expr.text : undefined
  }
  return undefined
}

/**
 * 建 import binding 表：localName → 来源。覆盖三种 import 形态：
 *  - `import Foo from 'x'`              → default（importedName='default'）
 *  - `import { A, B as C } from 'x'`    → named（importedName 取原名 A/B）
 *  - `import * as X from 'x'`           → namespace（isNamespace=true）
 * type-only import（`import type`）跳过——不产运行时组件。
 */
function collectImportBindings(sourceFile: ts.SourceFile): Map<string, IImportBinding> {
  const bindings = new Map<string, IImportBinding>()
  for (const stmt of sourceFile.statements) {
    if (!ts.isImportDeclaration(stmt)) continue
    if (!ts.isStringLiteralLike(stmt.moduleSpecifier)) continue
    const clause = stmt.importClause
    if (clause == null) continue
    if (clause.isTypeOnly) continue // import type：非运行时值
    const rawSpecifier = stmt.moduleSpecifier.text

    // 默认导入：import Foo from 'x'
    if (clause.name != null) {
      bindings.set(clause.name.text, { rawSpecifier, importedName: 'default', isNamespace: false })
    }
    const named = clause.namedBindings
    if (named == null) continue
    if (ts.isNamespaceImport(named)) {
      // import * as X from 'x'
      bindings.set(named.name.text, { rawSpecifier, isNamespace: true })
    } else {
      // import { A, B as C } from 'x'：本地名 el.name，导出原名 el.propertyName ?? el.name
      for (const el of named.elements) {
        if (el.isTypeOnly) continue // 具名 type-only：import { type T }
        bindings.set(el.name.text, {
          rawSpecifier,
          importedName: (el.propertyName ?? el.name).text,
          isNamespace: false,
        })
      }
    }
  }
  return bindings
}

// =============================================================================
// WP5a.2：componentUsage 边 + ComponentNode 建图 + 递归
// =============================================================================

/** 根 owner（App/Page）的 JSX 入口：owner 节点 id + 其源文件绝对路径。 */
export interface IJsxOwnerInput {
  /** owner 节点 id（PageNode.id 等；JSX 通道的根是页面/组件源文件）。 */
  ownerNodeId: string
  /** owner 源文件绝对路径（含 JSX 的页面/组件文件；相对 specifier 解析基址）。 */
  filePath: string
}

/** buildJsxComponentGraph 产出。 */
export interface IJsxGraphResult {
  /** JSX 实际使用关系边（componentUsage）。 */
  edges: IComponentUsageEdge[]
  /** 被 JSX 引用到的组件节点（local/npm/external；unresolved 不建节点）。按 id 去重。 */
  components: IComponentNode[]
  /**
   * jsxAnalyzer 覆盖度需降级为 partial 的 owner 节点 id 集合（§3.4：工具限制类——
   * import * as X 命名空间用法无法静态定具体 export、后缀-only 无 platform 等）。
   * 由调用方（graph.ts）据此把对应节点 jsxAnalyzerStatus 标 partial。
   */
  partialOwners: Set<string>
  /**
   * §6 InputManifest 输入线索（供 WP7 cache/watch，非消费面；去重交 graph.ts）：
   *  - readFiles          : 本通道读过的源文件（含递归展开的 local 组件 .tsx + barrel 中转）。
   *  - missingCandidates  : unresolved 尝试过但不存在的候选路径。
   *  - packageManifestPaths: npm 组件解析到的 package.json 路径。
   */
  readFiles: string[]
  missingCandidates: string[]
  packageManifestPaths: string[]
}

/**
 * 编排 JSX 组件使用图（§4.3 + §2.1 递归浅纳入）：
 *  1. 扫描 owner 源文件 JSX → 组件引用候选 → Resolver 解析 → 建 IComponentUsageEdge；
 *     resolution∈{local,npm,external} 建/复用 IComponentNode，unresolved 只留边不建节点。
 *  2. **local 组件命中后递归**分析其源文件 JSX；**npm/external 为递归终点**（浅纳入）。
 *  3. cycle-safe：visited 按 local 组件 filePath 去重。
 *  4. `import * as X` 命名空间用法 → owner jsxAnalyzer partial（§3.4 工具限制类）。
 *
 * componentUsage 与 usingComponent 是两类独立事实（§1.4），本模块只产 componentUsage。
 *
 * @param owners 根 owner 列表（各 Page 源文件；app 无独立 JSX 源文件，其 JSX 使用由页面承载）
 * @param ctx    Resolver 上下文
 */
export function buildJsxComponentGraph(owners: IJsxOwnerInput[], ctx: IResolveContext): IJsxGraphResult {
  const edges: IComponentUsageEdge[] = []
  const components = new Map<string, IComponentNode>()
  const partialOwners = new Set<string>()
  const expanded = new Set<string>() // 已展开 JSX 的 local 组件文件（防循环）
  // §6 InputManifest 输入累积（去重交 graph.ts）。
  const readFiles: string[] = []
  const missingCandidates: string[] = []
  const packageManifestPaths: string[] = []

  const processOwner = (ownerNodeId: string, filePath: string): void => {
    let text: string
    try {
      text = fs.readFileSync(filePath, 'utf8')
    } catch {
      return // 读不到源文件：无 JSX 可扫（parse 失败由页面解析侧承接）
    }
    // 源文件成功读取 → 记入 InputManifest（递归展开的 local 组件 .tsx 唯此处记录，
    // 页面文件另由 graph.ts 纳入；重复项 manifest 层去重）。
    readFiles.push(filePath)
    let scan: IJsxScanResult
    try {
      scan = scanJsxComponentRefs(text, filePath)
    } catch {
      return // 语法错误等：安全恢复，不崩（诊断由页面解析侧承接）
    }

    for (const ref of scan.refs) {
      // 命名空间用法（import * as X，JSX <X.Y>）：模块可解析、但具体 export 不可静态
      // 确定 → owner jsxAnalyzer partial（§3.4 工具限制类），且不建具体组件边身份。
      if (ref.isNamespace) {
        partialOwners.add(ownerNodeId)
        continue
      }

      const r = resolveComponent(
        { fromFilePath: filePath, rawSpecifier: ref.rawSpecifier, exportName: ref.importedName },
        ctx,
      )
      // 汇集解析过程的输入线索（§6）：barrel 中转文件、缺失候选、npm manifest。
      readFiles.push(...r.readFiles)
      missingCandidates.push(...r.missingCandidates)
      if (r.packageManifestPath != null) packageManifestPaths.push(r.packageManifestPath)

      edges.push({
        kind: 'componentUsage',
        from: ownerNodeId,
        to: r.resolution === 'unresolved' ? undefined : r.id,
        resolution: r.resolution,
        rawSpecifier: ref.rawSpecifier,
        localName: ref.localName,
      })

      // 工具限制类 unresolved（alias 不可得 / 后缀-only 无 platform）→ owner jsx partial。
      if (r.ownerPartial) partialOwners.add(ownerNodeId)

      if (r.resolution !== 'unresolved' && r.id != null) {
        if (!components.has(r.id)) {
          components.set(r.id, buildJsxComponentNode(r.id, r.resolution, r.resolvedFilePath, r.packageName, r.packageSubpath))
        }
        // 递归浅纳入：仅 local 组件展开其源文件 JSX（npm/external 为终点）。
        if (r.resolution === 'local' && r.resolvedFilePath != null && !expanded.has(r.resolvedFilePath)) {
          expanded.add(r.resolvedFilePath)
          processOwner(r.id, r.resolvedFilePath)
        }
      }
    }
  }

  for (const owner of owners) {
    if (!expanded.has(owner.filePath)) {
      expanded.add(owner.filePath)
      processOwner(owner.ownerNodeId, owner.filePath)
    }
  }

  return { edges, components: [...components.values()], partialOwners, readFiles, missingCandidates, packageManifestPaths }
}

/**
 * 由 Resolver 结果构造 IComponentNode（§3.3 身份）。结构与 config-graph 的
 * buildComponentNode 对称；两通道的组件节点在图层（graph.ts）按 id 统一去重。
 * npm/external 浅纳入终态覆盖度恒 complete；local 组件 JSX 覆盖度在其被展开时体现。
 */
function buildJsxComponentNode(
  id: string,
  resolution: 'local' | 'npm' | 'external',
  resolvedFilePath: string | undefined,
  packageName: string | undefined,
  packageSubpath: string | undefined,
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
  return node
}
