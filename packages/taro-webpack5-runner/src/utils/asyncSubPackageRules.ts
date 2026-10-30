export type EntrySelector = string | RegExp

export interface AsyncSubPackageRuleInput {
  path: EntrySelector | EntrySelector[]
  asyncSubPackage: {
    asyncRoot: string | string[]
    maxSize?: number
  }
}

export interface NormalizedAsyncSubPackageRule {
  id: string
  index: number
  selectors: EntrySelector[]
  asyncRoots: string[]
  maxSize?: number
  matchedPages: string[]
}

const ERROR_PREFIX = '[taro asyncSubPackage]'

function fail (message: string): never {
  throw new Error(`${ERROR_PREFIX} ${message}`)
}

function normalizeRoot (root: string, ruleIndex: number): string {
  if (typeof root !== 'string' || !root.trim()) {
    fail(`第 ${ruleIndex + 1} 条规则的 asyncRoot 必须是非空字符串`)
  }
  const normalized = root.replace(/\\/g, '/').replace(/^\/+/, '').replace(/\/+$/, '')
  if (!normalized || normalized.split('/').some(segment => segment === '.' || segment === '..')) {
    fail(`第 ${ruleIndex + 1} 条规则的 asyncRoot "${root}" 不是合法相对目录`)
  }
  return normalized
}

function normalizeSelector (selector: EntrySelector, ruleIndex: number): EntrySelector {
  if (typeof selector === 'string') {
    const normalized = selector.replace(/\\/g, '/').replace(/^\/+/, '').replace(/\/+$/, '')
    if (!normalized) fail(`第 ${ruleIndex + 1} 条规则的 path 不能为空字符串`)
    return normalized
  }
  if (selector instanceof RegExp) return selector
  return fail(`第 ${ruleIndex + 1} 条规则的 path 只支持 string | RegExp`)
}

function matchesSelector (selector: EntrySelector, page: string): boolean {
  if (typeof selector === 'string') return selector === page
  selector.lastIndex = 0
  return selector.test(page)
}

export function normalizeAsyncSubPackageRules (
  rules: AsyncSubPackageRuleInput[],
  declaredPages: string[],
  options: { reservedRoots?: string[] } = {}
): NormalizedAsyncSubPackageRule[] {
  const reserved = new Set(options.reservedRoots || [])
  const usedRoots = new Map<string, number>()
  const pageSet = new Set(declaredPages)
  const result: NormalizedAsyncSubPackageRule[] = []

  rules.forEach((rule, index) => {
    if (!rule || typeof rule !== 'object') fail(`第 ${index + 1} 条规则必须是对象`)
    const rawPath = (rule as AsyncSubPackageRuleInput).path
    const selectorList = Array.isArray(rawPath) ? rawPath : [rawPath]
    if (!selectorList.length) fail(`第 ${index + 1} 条规则的 path 不能为空数组`)
    const selectors = Array.from(new Set(selectorList.map(selector => normalizeSelector(selector, index))))

    const asyncConfig = rule.asyncSubPackage
    if (!asyncConfig || typeof asyncConfig !== 'object') {
      fail(`第 ${index + 1} 条规则缺少 asyncSubPackage 配置`)
    }
    const rawRoots = Array.isArray(asyncConfig.asyncRoot) ? asyncConfig.asyncRoot : [asyncConfig.asyncRoot]
    if (!rawRoots.length) fail(`第 ${index + 1} 条规则的 asyncRoot 不能为空数组`)
    const asyncRoots = Array.from(new Set(rawRoots.map(root => normalizeRoot(root, index))))

    for (const root of asyncRoots) {
      if (reserved.has(root)) {
        fail(`asyncRoot "${root}" 与框架保留目录冲突，请换一个目录名`)
      }
      if (usedRoots.has(root)) {
        fail(`asyncRoot "${root}" 在规则 ${usedRoots.get(root)! + 1} 与 ${index + 1} 中重复，一个物理目录只能属于一条规则`)
      }
      usedRoots.set(root, index)
    }

    const maxSize = asyncConfig.maxSize
    if (maxSize != null) {
      if (!Number.isFinite(maxSize) || maxSize <= 0) {
        fail(`第 ${index + 1} 条规则的 maxSize 必须是正数（单位：字节）`)
      }
    }
    if (asyncRoots.length > 1 && maxSize == null) {
      fail(`第 ${index + 1} 条规则配置了多个 asyncRoot，必须同时配置 maxSize`)
    }

    const matchedPages = declaredPages.filter(page => pageSet.has(page) && selectors.some(selector => matchesSelector(selector, page)))
    if (!matchedPages.length) {
      fail(`第 ${index + 1} 条规则的 path 未匹配任何已声明页面，已声明页面：${declaredPages.join(', ') || '(空)'}`)
    }

    result.push({
      id: `rule-${index}`,
      index,
      selectors,
      asyncRoots,
      maxSize,
      matchedPages,
    })
  })

  const seenPageSets = new Map<string, number>()
  for (const rule of result) {
    const key = [...rule.matchedPages].sort().join('|')
    if (seenPageSets.has(key)) {
      fail(`规则 ${seenPageSets.get(key)! + 1} 与 ${rule.index + 1} 匹配的页面集合完全相同，存在歧义`)
    }
    seenPageSets.set(key, rule.index)
  }

  return result
}

export function resolveAsyncSubPackageRule (
  rules: NormalizedAsyncSubPackageRule[],
  consumerPages: Iterable<string>
): NormalizedAsyncSubPackageRule | null {
  const pages = Array.from(new Set(consumerPages)).sort()
  if (!pages.length) return null

  const matching = rules.filter(rule => pages.some(page => rule.matchedPages.includes(page)))
  if (!matching.length) return null

  const covering = matching.filter(rule => pages.every(page => rule.matchedPages.includes(page)))
  if (!covering.length) {
    fail(`模块被页面 [${pages.join(', ')}] 共同使用，但没有一条规则同时覆盖这些页面，请补充一条覆盖它们的规则`)
  }

  covering.sort((a, b) => a.matchedPages.length - b.matchedPages.length || a.index - b.index)
  if (covering.length > 1 && covering[0].matchedPages.length === covering[1].matchedPages.length) {
    fail(`页面 [${pages.join(', ')}] 同时被规则 ${covering[0].index + 1} 与 ${covering[1].index + 1} 覆盖，存在歧义`)
  }
  return covering[0]
}

export function allocateAsyncChunks (
  rule: NormalizedAsyncSubPackageRule,
  chunks: Array<{ name: string, size: number }>
): Map<string, string> {
  const result = new Map<string, string>()
  if (!chunks.length) return result

  if (rule.asyncRoots.length === 1) {
    for (const chunk of chunks) result.set(chunk.name, rule.asyncRoots[0])
    return result
  }

  const maxSize = rule.maxSize!
  const sorted = [...chunks].sort((a, b) => b.size - a.size || a.name.localeCompare(b.name))
  const used = new Map<string, number>(rule.asyncRoots.map(root => [root, 0]))

  for (const chunk of sorted) {
    if (chunk.size > maxSize) {
      fail(`chunk "${chunk.name}" 体积 ${chunk.size} 字节，超过 maxSize ${maxSize}，无法拆分`)
    }
    const target = rule.asyncRoots.find(root => (used.get(root) || 0) + chunk.size <= maxSize)
    if (!target) {
      fail(`规则 ${rule.index + 1} 的所有 asyncRoot 容量不足，chunk "${chunk.name}" 无处安放，请增加 asyncRoot 或调大 maxSize`)
    }
    used.set(target, (used.get(target) || 0) + chunk.size)
    result.set(chunk.name, target)
  }

  return result
}

export function collectDeclaredPagePaths (appConfig: any): string[] {
  const pages = new Set<string>(Array.isArray(appConfig?.pages) ? appConfig.pages : [])
  const subPackages = appConfig?.subPackages || appConfig?.subpackages || []
  for (const subPackage of subPackages) {
    const root = subPackage?.root
    if (!root) continue
    for (const page of subPackage.pages || []) {
      pages.add(`${root}/${page}`.replace(/\/{2,}/g, '/'))
    }
  }
  return Array.from(pages)
}

export function hasAsyncOnlySubPackageIndieConfig (appConfig: any): boolean {
  const configs = appConfig?.subPackageIndie
  if (!Array.isArray(configs)) return false
  return configs.some(config => {
    if (!config || typeof config !== 'object') return false
    if (config.mainPackageRoot != null) return false
    const roots = config.subPackageRoots
    return Array.isArray(roots) && roots.some(root => root && typeof root === 'object' && root.asyncSubPackage)
  })
}

export function assertDeclaredPages (appConfig: any, options: { allowEmptyMainPages: boolean }): string[] {
  const mainPages = Array.isArray(appConfig?.pages) ? appConfig.pages : []
  const declared = collectDeclaredPagePaths(appConfig)
  const allowEmpty = options.allowEmptyMainPages && hasAsyncOnlySubPackageIndieConfig(appConfig)
  if (!declared.length || (!mainPages.length && !allowEmpty)) {
    fail('全局配置缺少 pages 字段，请检查！')
  }
  return declared
}
