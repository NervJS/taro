import { realpathSync } from 'node:fs'

export type AsyncResourcePredicate = (resource: string) => boolean

export type AsyncResourceCondition =
  | string
  | RegExp
  | AsyncResourcePredicate
  | Array<string | RegExp | AsyncResourcePredicate>

export interface AsyncSubPackageRuleInput {
  test: AsyncResourceCondition
  include?: AsyncResourceCondition
  exclude?: AsyncResourceCondition
  root: string | string[]
  priority?: number
  maxSize?: number
}

export interface NormalizedAsyncSubPackageRule {
  id: string
  index: number
  test: AsyncResourceCondition
  include?: AsyncResourceCondition
  exclude?: AsyncResourceCondition
  roots: string[]
  priority: number
  maxSize?: number
}

const ERROR_PREFIX = '[taro asyncSubPackage]'

function fail (message: string): never {
  throw new Error(`${ERROR_PREFIX} ${message}`)
}

export function normalizeSourcePath (value: string): string {
  let normalized = value.replace(/\\/g, '/').replace(/^\/+/, '').replace(/\/+$/, '')
  if (process.platform === 'win32') {
    normalized = normalized.replace(/^[a-zA-Z]:/, m => m.toLowerCase())
  }
  return normalized
}

function stripScriptExtension (value: string): string {
  return value.replace(/\.(?:js|jsx|ts|tsx|mjs|cjs)$/, '')
}

function normalizeCondition (condition: AsyncResourceCondition, ruleIndex: number, field: string): AsyncResourceCondition {
  if (Array.isArray(condition)) {
    if (!condition.length) fail(`第 ${ruleIndex + 1} 条规则的 ${field} 不能为空数组`)
    return condition.map(item => normalizeCondition(item, ruleIndex, field) as string | RegExp | AsyncResourcePredicate)
  }
  if (typeof condition === 'string') {
    const normalized = normalizeSourcePath(condition)
    if (!normalized) fail(`第 ${ruleIndex + 1} 条规则的 ${field} 不能为空字符串`)
    return normalized
  }
  if (condition instanceof RegExp) return condition
  if (typeof condition === 'function') return condition
  return fail(`第 ${ruleIndex + 1} 条规则的 ${field} 只支持 string | RegExp | 函数 | 数组`)
}

export function matchesCondition (condition: AsyncResourceCondition, resource: string): boolean {
  const normalized = normalizeSourcePath(resource)
  if (Array.isArray(condition)) return condition.some(item => matchesConditionItem(item, normalized))
  return matchesConditionItem(condition, normalized)
}

function matchesConditionItem (condition: string | RegExp | AsyncResourcePredicate, resource: string): boolean {
  if (typeof condition === 'function') return Boolean(condition(resource))
  if (typeof condition === 'string') {
    return resource === condition || stripScriptExtension(resource) === condition
  }
  condition.lastIndex = 0
  return condition.test(resource)
}

export function normalizeSubPackageRoot (root: string, ruleIndex: number): string {
  if (typeof root !== 'string' || !root.trim()) {
    fail(`第 ${ruleIndex + 1} 条规则的 root 必须是非空字符串`)
  }
  const normalized = normalizeSourcePath(root)
  if (!normalized || normalized.split('/').some(segment => segment === '.' || segment === '..')) {
    fail(`第 ${ruleIndex + 1} 条规则的 root "${root}" 不是合法相对目录`)
  }
  return normalized
}

export function normalizeAsyncSubPackageRules (
  rules: AsyncSubPackageRuleInput[],
  options: { reservedRoots?: string[] } = {}
): NormalizedAsyncSubPackageRule[] {
  if (!Array.isArray(rules)) fail('asyncSubPackages 必须是数组')
  const reserved = new Set(options.reservedRoots || [])
  const rootBudgets = new Map<string, number>()
  const result: NormalizedAsyncSubPackageRule[] = []

  rules.forEach((rule, index) => {
    if (!rule || typeof rule !== 'object') fail(`第 ${index + 1} 条规则必须是对象`)

    const test = normalizeCondition((rule as AsyncSubPackageRuleInput).test, index, 'test')
    const include = (rule as AsyncSubPackageRuleInput).include !== undefined
      ? normalizeCondition((rule as AsyncSubPackageRuleInput).include!, index, 'include')
      : undefined
    const exclude = (rule as AsyncSubPackageRuleInput).exclude !== undefined
      ? normalizeCondition((rule as AsyncSubPackageRuleInput).exclude!, index, 'exclude')
      : undefined

    const rawRoots = Array.isArray(rule.root) ? rule.root : [rule.root]
    if (!rawRoots.length) fail(`第 ${index + 1} 条规则的 root 不能为空数组`)
    const roots = Array.from(new Set(rawRoots.map(root => normalizeSubPackageRoot(root, index))))

    for (const root of roots) {
      if (reserved.has(root)) {
        fail(`root "${root}" 与框架保留目录冲突，请换一个目录名`)
      }
    }

    const priority = rule.priority ?? 0
    if (!Number.isFinite(priority)) fail(`第 ${index + 1} 条规则的 priority 必须是有限数字`)

    const maxSize = rule.maxSize
    if (maxSize != null && (!Number.isFinite(maxSize) || maxSize <= 0)) {
      fail(`第 ${index + 1} 条规则的 maxSize 必须是正数（单位：字节）`)
    }
    if (roots.length > 1 && maxSize == null) {
      fail(`第 ${index + 1} 条规则配置了多个 root，必须同时配置 maxSize`)
    }

    for (const root of roots) {
      const existing = rootBudgets.get(root)
      if (existing !== undefined) {
        const a = existing
        const b = maxSize ?? -1
        if (a !== b) {
          fail(`root "${root}" 在多条规则中的 maxSize 不一致，请统一预算声明`)
        }
      } else {
        rootBudgets.set(root, maxSize ?? -1)
      }
    }

    result.push({ id: `rule-${index}`, index, test, include, exclude, roots, priority, maxSize })
  })

  return result
}

export function resolveAsyncSubPackageRule (
  rules: NormalizedAsyncSubPackageRule[],
  resource: string
): NormalizedAsyncSubPackageRule | null {
  const matched = rules.filter(rule => matchesRuleConditions(rule, resource))

  if (!matched.length) return null

  matched.sort((a, b) => b.priority - a.priority || a.index - b.index)
  const top = matched.filter(rule => rule.priority === matched[0].priority)
  const first = top[0]
  const firstKey = `${[...first.roots].sort().join('\u0000')}\u0000${first.maxSize ?? ''}`
  const conflicting = top.some(rule => {
    if (rule === first) return false
    const key = `${[...rule.roots].sort().join('\u0000')}\u0000${rule.maxSize ?? ''}`
    return key !== firstKey
  })
  if (conflicting) {
    fail(
      `文件 "${resource}" 同时命中规则 ${top.map(rule => rule.index + 1).join('、')}，` +
      '最高 priority 并列但目标配置不同，请调整 priority 或统一 root'
    )
  }

  return first
}

/**
 * 多个规则共享同一物理 root 时，容量必须跨规则统一统计。
 * 单目标直接归入该 root；多目标按估算体积降序做确定性装箱。
 */
export function allocateAsyncChunksShared (
  rulesByIndex: Map<number, NormalizedAsyncSubPackageRule>,
  chunks: Array<{ name: string, size: number, ruleIndex: number }>
): Map<string, string> {
  const result = new Map<string, string>()
  if (!chunks.length) return result

  const budget = new Map<string, number>()
  for (const rule of rulesByIndex.values()) {
    for (const root of rule.roots) {
      if (!budget.has(root)) budget.set(root, rule.maxSize === undefined ? Infinity : rule.maxSize)
    }
  }
  const used = new Map<string, number>(Array.from(budget.keys()).map(root => [root, 0]))

  const sorted = [...chunks].sort((a, b) => b.size - a.size || a.name.localeCompare(b.name))
  for (const chunk of sorted) {
    const rule = rulesByIndex.get(chunk.ruleIndex)!
    if (rule.roots.length === 1) {
      const root = rule.roots[0]
      used.set(root, (used.get(root) || 0) + chunk.size)
      result.set(chunk.name, root)
      continue
    }

    const maxSize = rule.maxSize!
    if (chunk.size > maxSize) {
      fail(`chunk "${chunk.name}" 体积 ${chunk.size} 字节，超过 maxSize ${maxSize}，无法拆分`)
    }
    const target = rule.roots.find(root => (used.get(root) || 0) + chunk.size <= maxSize)
    if (!target) {
      fail(`规则 ${rule.index + 1} 的所有 root 容量不足，chunk "${chunk.name}" 无处安放，请增加 root 或调大 maxSize`)
    }
    used.set(target, (used.get(target) || 0) + chunk.size)
    result.set(chunk.name, target)
  }

  return result
}

function tryRealpath (value: string): string {
  try { return realpathSync(value) } catch { return value }
}

let realSourceDirCache: { value: string, real: string } | null = null

function realpathSourceDir (sourceDir: string): string {
  if (realSourceDirCache && realSourceDirCache.value === sourceDir) return realSourceDirCache.real
  const real = tryRealpath(sourceDir)
  realSourceDirCache = { value: sourceDir, real }
  return real
}

export function getSourceRelativePath (resource: string, sourceDir: string): string | null {
  const normalizedSourceDir = normalizeSourcePath(realpathSourceDir(sourceDir))
  const normalized = normalizeSourcePath(tryRealpath(resource))
  if (normalized === normalizedSourceDir) return ''
  const prefix = `${normalizedSourceDir}/`
  return normalized.startsWith(prefix) ? normalized.slice(prefix.length) : null
}

export function matchesRuleConditions (
  rule: NormalizedAsyncSubPackageRule,
  resource: string
): boolean {
  if (!matchesCondition(rule.test, resource)) return false
  if (rule.include && !matchesCondition(rule.include, resource)) return false
  if (rule.exclude && matchesCondition(rule.exclude, resource)) return false
  return true
}
