import * as path from 'node:path'

import { fs } from '@tarojs/helper'

/**
 * 方案二(split) 编译期告警：扫描业务源码中【模块顶层作用域】的 Taro 命令式 API 同步调用。
 *
 * 背景：split 模式下 @tarojs/taro 命令式 API 在异步核，模块顶层（早于异步核到位）同步调用会拿到
 * 占位 Proxy 抛错 / 静默失效。运行时 Proxy 只在代码被执行到时报错，藏在少走分支里的顶层调用可能
 * 线上才暴露。此扫描把风险提前到编译期，仅告警、不阻断。
 *
 * 判定（粗筛，宁可漏报不误报）：逐行剥离字符串/注释后，只看【顶层缩进（花括号深度为 0）】的行里
 * 是否出现 `Taro.xxx(` 或 `<导入名>.xxx(` 且 xxx 非 hooks（use 开头）。函数体/组件体内（深度>0）不报。
 */

const HOOK_PREFIX = /^use[A-Z]/

// 匹配 `标识符.方法(` 或 `标识符?.方法(` 或 `标识符.方法?.(`（含可选链），捕获 [对象名, 方法名]
const CALL_RE = /\b([A-Za-z_$][\w$]*)\s*\??\.\s*([A-Za-z_$][\w$]*)\s*\??\.?\s*\(/g

/** 找出文件里 import 的 @tarojs/taro 默认导入名（默认 Taro），用于识别命令式调用对象 */
function findTaroImportNames (code: string): Set<string> {
  const names = new Set<string>()
  // import Taro from '@tarojs/taro'  /  import Taro, {...} from '@tarojs/taro'
  const reDefault = /import\s+([A-Za-z_$][\w$]*)\s*(?:,\s*\{[^}]*\})?\s*from\s*['"]@tarojs\/taro['"]/g
  let m: RegExpExecArray | null
  while ((m = reDefault.exec(code))) names.add(m[1])
  return names
}

/** 极简剥离：整行注释、行尾 // 注释、字符串字面量替换为空白，降低误报。不追求完备。 */
function stripNoise (line: string): string {
  let s = line.replace(/\/\/.*$/, '')
  s = s.replace(/(['"`])(?:\\.|(?!\1).)*\1/g, '""')
  return s
}

interface TopLevelHit { file: string, line: number, code: string, api: string }

function scanFile (filePath: string): TopLevelHit[] {
  const hits: TopLevelHit[] = []
  let code: string
  try {
    code = fs.readFileSync(filePath, 'utf-8')
  } catch {
    return hits
  }
  if (!/@tarojs\/taro/.test(code)) return hits
  const taroNames = findTaroImportNames(code)
  if (!taroNames.size) return hits

  const lines = code.split('\n')
  let depth = 0 // 花括号深度；0 = 模块顶层
  let inBlockComment = false

  for (let i = 0; i < lines.length; i++) {
    let raw = lines[i]
    // 处理块注释（跨行）
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

    // 只在【进入本行时】深度为 0 才判定为顶层（行内后续 { 不影响本行开头的调用归属）
    if (depth === 0) {
      CALL_RE.lastIndex = 0
      let cm: RegExpExecArray | null
      while ((cm = CALL_RE.exec(line))) {
        const obj = cm[1]
        const method = cm[2]
        if (taroNames.has(obj) && !HOOK_PREFIX.test(method)) {
          hits.push({ file: filePath, line: i + 1, code: raw.trim(), api: `${obj}.${method}` })
        }
      }
    }

    // 更新深度（本行净增花括号）
    for (let c = 0; c < line.length; c++) {
      if (line[c] === '{') depth++
      else if (line[c] === '}') depth = Math.max(0, depth - 1)
    }
  }
  return hits
}

function walk (dir: string, exts: string[], acc: string[]) {
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
    if (stat.isDirectory()) walk(full, exts, acc)
    else if (exts.some((e) => name.endsWith(e))) acc.push(full)
  }
}

/**
 * 扫描 sourceDir 并打印告警。仅在 sharedRuntime + split 模式下由 index.mini 调用。
 * @returns 命中数
 */
export function warnTopLevelImperativeApi (sourceDir: string): number {
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
    '\n[taro-shared][split] 检测到【模块顶层】同步调用 Taro 命令式 API，' +
    '异步核加载完成前调用会抛错/静默失效。请挪到组件函数体内 / useReady / useEffect / 事件回调，' +
    '或改用异步版 API：\n' + lines.join('\n') + '\n'
  )
  return allHits.length
}
