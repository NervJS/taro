/**
 * @tarojs/project-graph — 页面解析与 navigation 边（任务 2）
 *
 * 用 TypeScript 现成 parser（ts.createSourceFile）解析页面文件：
 *  1. 识别 React 页面（含 JSX / TSX）。P1 仅 React（OQ-002）。
 *  2. 扫描 navigateTo / redirectTo / switchTab / reLaunch / useRouter 的 url
 *     字符串字面量，构建 navigation 边。
 *
 * 只用 AST 静态扫描，不引入 SWC（替换 SWC 为 P4 预留）。url 为变量/模板串等
 * 非字面量时无法静态取值，降级该页 jsxAnalyzerStatus='partial' 并跳过该跳转
 * （工具限制类 unresolved，不是结构性事实，故不产 IGraphIssue）。
 */

import * as fs from 'node:fs'

import ts from 'typescript'

import { normalizeRoute } from './config-parser'

import type { IGraphIssue, INavigationEdge, TAnalysisStatus, TNavigationVia } from './schema'

/**
 * 参与 url 扫描的跳转 API。仅含"带 url 入参、会产生跳转边"的 4 个。
 * 注意：schema 的 NavigationVia 还包含 'useRouter'，但它是读取当前路由参数的
 * hook（无 url 入参、不产生跳转边），故不在此扫描集内，避免刷无意义告警。
 */
const NAVIGATION_APIS: readonly TNavigationVia[] = ['navigateTo', 'redirectTo', 'switchTab', 'reLaunch']

const NAV_API_SET = new Set<string>(NAVIGATION_APIS)

/** 单个页面文件的解析结果。 */
export interface ParsedPage {
  /** 是否识别为 React 页面（含 JSX）。 */
  isReactPage: boolean
  /** 文件读取是否失败（失败时 isReactPage/navigations 无意义，且已记入 issues）。 */
  readFailed: boolean
  /** 从该页出发的跳转目标（原始 url 字符串，未规范化为 routeId）。 */
  navigations: { via: TNavigationVia, url: string }[]
  /** 真解析失败（读取失败）→ issue；调用方（graph.ts）据此聚合图级 analysis-incomplete。 */
  issues: IGraphIssue[]
  /** 该页 JSX analyzer 覆盖度：读取失败→'failed'；含非静态 url→'partial'；否则'complete'。 */
  jsxAnalyzerStatus: TAnalysisStatus
}

function createSourceFile(filePath: string, text: string): ts.SourceFile {
  const ext = filePath.slice(filePath.lastIndexOf('.'))
  // Taro 页面可用 .js/.jsx 写 JSX，故 .js 也按 JSX 解析（否则 hasJsx 漏判）。
  const scriptKind =
    ext === '.tsx' ? ts.ScriptKind.TSX : ext === '.jsx' || ext === '.js' ? ts.ScriptKind.JSX : ts.ScriptKind.TS
  return ts.createSourceFile(filePath, text, ts.ScriptTarget.Latest, /* setParentNodes */ true, scriptKind)
}

const TARO_MODULE = '@tarojs/taro'

/**
 * Taro 的全局命名空间名。`export as namespace Taro`（UMD 全局）+ 小程序运行时
 * 注入全局 Taro，使得 `Taro.navigateTo(...)` 即便未显式 import 也是合法用法，
 * 故默认视为可信命名空间。
 */
const GLOBAL_TARO_NAMESPACE = 'Taro'

/**
 * 判定一个调用表达式是否是「可信的跳转 API 调用」，返回其**规范 API 名**；否则 undefined。
 *
 * 收紧规则（避免误报 this.navigateTo() / router.navigateTo() / 自定义同名函数）：
 *  - `<taroNs>.navigateTo(...)`：接收者是 Taro 命名空间（导入的，或全局 `Taro`）→ 认。
 *  - 裸 `navigateTo(...)`：仅当该名字从 @tarojs/taro 具名导入 → 认（别名映射回规范名）。
 *  - 其它接收者（this / 任意对象 / 未知）→ 不认。
 *
 * @param taroNamespaces 从 @tarojs/taro 默认/命名空间导入的绑定名集合
 * @param taroNamedImports 具名导入映射：本地名（可能是别名）→ 规范 API 名
 */
function getNavApiName(
  expr: ts.Expression,
  taroNamespaces: ReadonlySet<string>,
  taroNamedImports: ReadonlyMap<string, string>
): string | undefined {
  // 裸调用：navigateTo(...) / 别名 nav(...)
  if (ts.isIdentifier(expr)) {
    return taroNamedImports.get(expr.text)
  }
  // 成员调用：X.navigateTo(...)，X 是 Taro 命名空间（导入的或全局 Taro）
  if (
    ts.isPropertyAccessExpression(expr) &&
    ts.isIdentifier(expr.name) &&
    ts.isIdentifier(expr.expression) &&
    (taroNamespaces.has(expr.expression.text) || expr.expression.text === GLOBAL_TARO_NAMESPACE)
  ) {
    return expr.name.text
  }
  return undefined
}

/**
 * 收集从 @tarojs/taro 的导入绑定：
 *  - namespaces：默认导入 / 命名空间导入的绑定名。
 *  - named：具名导入的「本地名（可能是别名）→ 规范 API 名」映射。
 */
function collectTaroImports(sourceFile: ts.SourceFile): {
  namespaces: Set<string>
  named: Map<string, string>
} {
  const namespaces = new Set<string>()
  const named = new Map<string, string>()
  for (const stmt of sourceFile.statements) {
    if (!ts.isImportDeclaration(stmt)) continue
    if (!ts.isStringLiteralLike(stmt.moduleSpecifier) || stmt.moduleSpecifier.text !== TARO_MODULE) {
      continue
    }
    const clause = stmt.importClause
    if (clause == null) continue
    // 默认导入：import Taro from '@tarojs/taro'
    if (clause.name != null) namespaces.add(clause.name.text)
    const bindings = clause.namedBindings
    if (bindings == null) continue
    // 命名空间导入：import * as Taro from '@tarojs/taro'
    if (ts.isNamespaceImport(bindings)) {
      namespaces.add(bindings.name.text)
    } else {
      // 具名导入：import { navigateTo } / import { navigateTo as nav }
      // 本地名（el.name，别名优先）→ 规范名（el.propertyName ?? el.name）
      for (const el of bindings.elements) {
        const canonical = (el.propertyName ?? el.name).text
        named.set(el.name.text, canonical)
      }
    }
  }
  return { namespaces, named }
}

/** 从调用参数里取 url 字符串字面量；取不到（变量/模板串）返回 undefined。 */
function extractUrlLiteral(call: ts.CallExpression): string | undefined {
  const arg = call.arguments[0]
  if (arg == null || !ts.isObjectLiteralExpression(arg)) return undefined
  for (const prop of arg.properties) {
    if (!ts.isPropertyAssignment(prop)) continue
    const key = prop.name
    const keyName = ts.isIdentifier(key) ? key.text : ts.isStringLiteral(key) ? key.text : undefined
    if (keyName !== 'url') continue
    return ts.isStringLiteralLike(prop.initializer) ? prop.initializer.text : undefined
  }
  return undefined
}

/**
 * 解析单个页面文件：判定是否 React 页面、抽取跳转调用。
 *
 * @param filePath 页面文件绝对路径
 * @param pageId 该页在图中的 id（用于 issue 归属）
 */
export function parsePageFile(filePath: string, pageId: string): ParsedPage {
  let text: string
  try {
    text = fs.readFileSync(filePath, 'utf8')
  } catch (err) {
    return {
      isReactPage: false,
      readFailed: true,
      navigations: [],
      issues: [
        {
          kind: 'parse-failed',
          message: `读取页面文件失败：${(err as Error).message}`,
          filePath,
          nodeId: pageId,
        },
      ],
      jsxAnalyzerStatus: 'failed',
    }
  }

  const sourceFile = createSourceFile(filePath, text)
  const { namespaces: taroNs, named: taroNamed } = collectTaroImports(sourceFile)
  let hasJsx = false
  let hasNonStaticUrl = false
  const navigations: { via: TNavigationVia, url: string }[] = []

  const visit = (node: ts.Node): void => {
    if (ts.isJsxElement(node) || ts.isJsxSelfClosingElement(node) || ts.isJsxFragment(node)) {
      hasJsx = true
    }
    if (ts.isCallExpression(node)) {
      const name = getNavApiName(node.expression, taroNs, taroNamed)
      if (name != null && NAV_API_SET.has(name)) {
        const url = extractUrlLiteral(node)
        if (url != null) {
          navigations.push({ via: name as TNavigationVia, url })
        } else {
          // 工具限制类 unresolved（url 非静态字面量，无法确定跳转目标）：
          // 降级本页 jsxAnalyzerStatus，不产 IGraphIssue（非结构性事实）。
          hasNonStaticUrl = true
        }
      }
    }
    ts.forEachChild(node, visit)
  }
  visit(sourceFile)

  return {
    isReactPage: hasJsx,
    readFailed: false,
    navigations,
    issues: [],
    jsxAnalyzerStatus: hasNonStaticUrl ? 'partial' : 'complete',
  }
}

/**
 * 把 navigateTo 的 url 规范化为页面 routeId：先剥 query/hash，再套用与页面 id
 * 相同的 normalizeRoute 规则（转 `\`、折叠 `//`、去首尾 `/`），保证边的 to 与
 * 页面 id 归一化一致，避免误判 resolved。
 */
export function urlToRouteId(url: string): string {
  let s = url.trim()
  const queryIdx = s.search(/[?#]/)
  if (queryIdx >= 0) s = s.slice(0, queryIdx)
  return normalizeRoute(s)
}

/**
 * 由页面解析结果构建 navigation 边。
 *
 * @param fromPageId 源页 id
 * @param navigations parsePageFile 抽取的跳转
 * @param knownPageIds 全部已知页面 id（用于判定 resolved / 悬空跳转）
 */
export function buildNavigationEdges(
  fromPageId: string,
  navigations: { via: TNavigationVia, url: string }[],
  knownPageIds: ReadonlySet<string>
): INavigationEdge[] {
  const edges: INavigationEdge[] = []
  const seen = new Set<string>()
  for (const nav of navigations) {
    const to = urlToRouteId(nav.url)
    // 同页对同一目标的同类跳转去重（如循环里多次同 url 跳转）
    const key = `${nav.via}:${to}`
    if (seen.has(key)) continue
    seen.add(key)
    edges.push({
      kind: 'navigation',
      from: fromPageId,
      to,
      via: nav.via,
      resolved: knownPageIds.has(to),
    })
  }
  return edges
}
