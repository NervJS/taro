import * as path from 'node:path'

import { fs } from '@tarojs/helper'

/**
 * 共享运行时（split 模式） 编译期告警：扫描业务源码中【模块顶层作用域】的 Taro 命令式 API 同步调用。
 *
 * 背景：split 模式下 @tarojs/taro 命令式 API 在异步核，模块顶层（早于异步核到位）同步调用会拿到
 * 占位 Proxy（告警 + 空操作）而非真身。运行时 Proxy 只在代码被执行到时告警，藏在少走分支里的顶层
 * 调用可能线上才暴露。此扫描把风险提前到编译期，仅告警、不阻断。
 *
 * 判定（粗筛，宁可漏报不误报）：逐行剥离字符串/注释后，只看【顶层缩进（花括号深度为 0）】的行。
 * 覆盖两类导入形态（修正早期只认默认导入的漏报）：
 *   - 命名空间/默认导入：`import Taro from '@tarojs/taro'` / `const Taro = require('@tarojs/taro')`
 *     → 顶层出现 `Taro.method(` 且 method 非 hooks（use 开头）时告警。
 *   - 具名导入（含别名）：`import { showToast, getSystemInfoSync as g } from '@tarojs/taro'`
 *     / `const { showToast } = require('@tarojs/taro')`
 *     → 顶层出现 `showToast(` / `g(` 这类裸调用且非 hooks 时告警。
 * 函数体/组件体内（深度>0）不报。
 */

const HOOK_PREFIX = /^use[A-Z]/

// 匹配 `标识符.方法（`（含可选链 ？.），捕获 [对象名， 方法名]
const MEMBER_CALL_RE = /\b([A-Za-z_$][\w$]*)\s*\??\.\s*([A-Za-z_$][\w$]*)\s*\??\.?\s*\(/g
// 匹配裸函数调用 `标识符（`（用于具名导入的直接调用），捕获 [函数名]
const BARE_CALL_RE = /(?:^|[^.\w$])([A-Za-z_$][\w$]*)\s*\??\.?\s*\(/g

/**
 * 判定同行 match 位置之前是否处于"延迟执行"上下文。
 * 覆盖顶层但**不在导入时立即执行**的常见写法（避免噪声告警侵蚀信任）：
 *   const f = () => Taro.showToast()        // 箭头函数体
 *   const f = () => { showToast() }         // 单行箭头体
 *   const f = function() { Taro.x() }       // 函数表达式体
 *   Taro.x(() => Taro.y())                  // 外层立即、内层延迟（逐 match 判定）
 * 只要 match 之前同行出现 `=>` 或 `function` 关键字，即认为在延迟上下文，跳过。
 */
function isDeferredContext (prefix: string): boolean {
  if (prefix.includes('=>')) return true
  if (/\bfunction\b/.test(prefix)) return true
  return false
}

interface TaroBindings {
  /** 命名空间/默认导入名（用 obj.method() 调用），如 Taro */
  namespaces: Set<string>
  /** 具名导入的本地名（可能是别名，直接 name() 调用），如 showToast / g */
  named: Set<string>
}

/**
 * 解析文件里对 @tarojs/taro 的各种导入形态，收集命名空间名与具名本地名。
 * 覆盖：ESM 默认/命名空间/具名（含 as 别名）、CJS require 默认/解构（含 ： 重命名）。
 */
export function findTaroBindings (code: string): TaroBindings {
  const namespaces = new Set<string>()
  const named = new Set<string>()

  // import ... from '@tarojs/taro'
  const reImport = /import\s+([^'"]+?)\s+from\s*['"]@tarojs\/taro['"]/g
  let m: RegExpExecArray | null
  while ((m = reImport.exec(code))) {
    parseImportClause(m[1], namespaces, named)
  }

  // const/let/var X = require('@tarojs/taro')  |  const { a, b: c } = require('@tarojs/taro')
  const reRequire = /(?:const|let|var)\s+(\{[^}]*\}|[A-Za-z_$][\w$]*)\s*=\s*require\(\s*['"]@tarojs\/taro['"]\s*\)/g
  while ((m = reRequire.exec(code))) {
    const binding = m[1].trim()
    if (binding.startsWith('{')) {
      parseNamedList(binding.slice(1, -1), named)
    } else {
      namespaces.add(binding)
    }
  }

  return { namespaces, named }
}

/** 解析 import 子句：`Taro` / `Taro, { a, b as c }` / `{ a, b as c }` / `* as Taro` */
function parseImportClause (clause: string, namespaces: Set<string>, named: Set<string>) {
  clause = clause.trim()
  // 具名部分 { ... }
  const braceMatch = clause.match(/\{([^}]*)\}/)
  if (braceMatch) {
    parseNamedList(braceMatch[1], named)
  }
  // 去掉具名部分后的剩余：默认名 / * as name
  const rest = clause.replace(/\{[^}]*\}/, '').replace(/,/g, ' ').trim()
  const nsAs = rest.match(/\*\s+as\s+([A-Za-z_$][\w$]*)/)
  if (nsAs) {
    namespaces.add(nsAs[1])
  } else if (rest) {
    const def = rest.match(/^([A-Za-z_$][\w$]*)/)
    if (def) namespaces.add(def[1])
  }
}

/** 解析具名列表 `a, b as c, d: e`，取本地名（as/： 后的名字，否则原名） */
function parseNamedList (list: string, named: Set<string>) {
  list.split(',').forEach((item) => {
    const seg = item.trim()
    if (!seg) return
    const asMatch = seg.match(/(?:\bas\b|:)\s*([A-Za-z_$][\w$]*)/)
    if (asMatch) {
      named.add(asMatch[1])
    } else {
      const name = seg.match(/^([A-Za-z_$][\w$]*)/)
      if (name) named.add(name[1])
    }
  })
}

/** 极简剥离：块注释外的行注释、字符串字面量替换为空白，降低误报。不追求完备。 */
function stripNoise (line: string): string {
  let s = line.replace(/\/\/.*$/, '')
  s = s.replace(/(['"`])(?:\\.|(?!\1).)*\1/g, '""')
  return s
}

interface TopLevelHit { file: string, line: number, code: string, api: string }

export function scanCode (code: string, filePath = '<inline>'): TopLevelHit[] {
  const hits: TopLevelHit[] = []
  if (!/@tarojs\/taro/.test(code)) return hits
  const { namespaces, named } = findTaroBindings(code)
  if (!namespaces.size && !named.size) return hits

  const lines = code.split('\n')
  let depth = 0 // 花括号深度；0 = 模块顶层
  let inBlockComment = false

  for (let i = 0; i < lines.length; i++) {
    let raw = lines[i]
    if (inBlockComment) {
      const end = raw.indexOf('*/')
      if (end === -1) continue
      raw = raw.slice(end + 2)
      inBlockComment = false
    }
    const bcStart = raw.indexOf('/*')
    if (bcStart !== -1 && raw.indexOf('*/', bcStart) === -1) {
      raw = raw.slice(0, bcStart)
      inBlockComment = true
    }

    const line = stripNoise(raw)

    if (depth === 0) {
      // 成员调用：namespaces 名下的 .method()
      MEMBER_CALL_RE.lastIndex = 0
      let cm: RegExpExecArray | null
      while ((cm = MEMBER_CALL_RE.exec(line))) {
        const obj = cm[1]
        const method = cm[2]
        if (namespaces.has(obj) && !HOOK_PREFIX.test(method)) {
          // 跳过延迟上下文（顶层箭头/函数体内）：`const f = () => Taro.showToast()` 不该报
          if (isDeferredContext(line.slice(0, cm.index))) continue
          hits.push({ file: filePath, line: i + 1, code: raw.trim(), api: `${obj}.${method}` })
        }
      }
      // 裸调用：具名导入的本地名直接调用
      if (named.size) {
        BARE_CALL_RE.lastIndex = 0
        let bm: RegExpExecArray | null
        while ((bm = BARE_CALL_RE.exec(line))) {
          const fn = bm[1]
          if (named.has(fn) && !HOOK_PREFIX.test(fn)) {
            if (isDeferredContext(line.slice(0, bm.index))) continue
            hits.push({ file: filePath, line: i + 1, code: raw.trim(), api: fn })
          }
        }
      }
    }

    for (let c = 0; c < line.length; c++) {
      if (line[c] === '{') depth++
      else if (line[c] === '}') depth = Math.max(0, depth - 1)
    }
  }
  return hits
}

function scanFile (filePath: string): TopLevelHit[] {
  let code: string
  try {
    code = fs.readFileSync(filePath, 'utf-8')
  } catch {
    return []
  }
  return scanCode(code, filePath)
}

function walk (dir: string, exts: string[], acc: string[], depth = 0) {
  // 深度上限：防符号链接环路导致栈溢出
  if (depth > 32) return
  let entries: string[]
  try {
    entries = fs.readdirSync(dir)
  } catch {
    return
  }
  for (const name of entries) {
    if (name === 'node_modules' || name.startsWith('.')) continue
    const full = path.join(dir, name)
    let stat
    try {
      stat = fs.statSync(full)
    } catch {
      continue
    }
    if (stat.isDirectory()) walk(full, exts, acc, depth + 1)
    else if (exts.some((e) => name.endsWith(e))) acc.push(full)
  }
}

/**
 * 扫描 sourceDir 并打印告警。仅在 sharedRuntime split 模式下由 index.mini 调用。
 * 顶层 try/catch 兜底：扫描仅告警不阻断，任何异常都吞掉，不影响主构建。
 * @returns 命中数
 */
export function warnTopLevelImperativeApi (sourceDir: string): number {
  try {
    if (!sourceDir || !fs.existsSync(sourceDir)) return 0
    const files: string[] = []
    walk(sourceDir, ['.js', '.jsx', '.ts', '.tsx'], files)
    const allHits: TopLevelHit[] = []
    for (const f of files) allHits.push(...scanFile(f))
    if (!allHits.length) return 0

    const lines = allHits.map((h) => {
      const rel = path.relative(sourceDir, h.file)
      return `  ${rel}:${h.line}  ${h.api}  →  ${h.code}`
    })
    console.warn(
      '\n[taro-shared][shared-runtime] 检测到【模块顶层】同步调用 Taro 命令式 API，' +
      '运行时核加载完成前调用会告警/静默失效。请挪到组件函数体内 / useReady / useEffect / 事件回调，' +
      '或改用异步版 API：\n' + lines.join('\n') + '\n'
    )
    return allHits.length
  } catch {
    return 0
  }
}
