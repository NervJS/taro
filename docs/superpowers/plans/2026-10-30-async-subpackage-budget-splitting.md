# 异步分包预算拆分（asyncSubPackage budget splitting）实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 让微信 `--new-blended` 业务包在省略 `subPackageIndie.mainPackageRoot` 时，把 `sub1`/`sub2` 作为真实页面，并按「消费页面集合」把动态 import 产物分配到私有异步分包、共享异步分包，且共享分包可按 `maxSize` 继续拆分。

**Architecture:** 复用 `subPackageIndie` 配置树：`mainPackageRoot` 缺省即 async-only 模式，`subPackageRoots` 从「独立组件根」切换为「异步归属规则」。新增纯函数模块负责规则归一化、页面匹配、最小覆盖规则解析与预算分配；`AsyncSubPackagePlugin` 增加规则模式，用 webpack moduleGraph 反查每个异步 chunk 的消费页面，再决定物理 asyncRoot。共享运行时增加 provider 就绪信号，业务异步 chunk 等待就绪后再 resolve。

**Tech Stack:** TypeScript、webpack 5、Vitest、Taro 4.x mini runner、微信小程序 `require.async`。

**Spec:** `docs/superpowers/specs/2026-10-30-async-subpackage-budget-splitting-design.md`

## Global Constraints

- 仅支持微信 `--new-blended`；普通构建模式行为不变。
- 不支持微信独立分包（`independent: true`）。
- 旧 `subPackageIndie`（带 `mainPackageRoot`）产物与行为保持不变。
- `asyncRoot` 必须是显式目录字符串，不支持正则。
- 业务 `asyncRoot` 不得等于 `shared-async-v1`（框架 provider 固定目录）。
- 所有新增错误信息以 `[taro asyncSubPackage]` 开头。
- 单测命令：`pnpm --filter @tarojs/webpack5-runner exec vitest run <spec>`。
- 本机 node/pnpm/yarn 位于 `$HOME/.volta/bin`；每条命令前先执行 `export PATH="$HOME/.volta/bin:$PATH"`。
- 构建命令：`pnpm --filter @tarojs/webpack5-runner build`。
- 不执行 `git push` / `git merge` / `npm publish`。

---

## File Structure

**框架仓库 `<TARO_ROOT>/taro-weapp-runtime-union`**

| 文件 | 职责 |
| --- | --- |
| `packages/taro-webpack5-runner/src/utils/asyncSubPackageRules.ts`（新建） | 规则归一化、页面匹配、最小覆盖规则解析、预算分配、空主包页面校验 |
| `packages/taro-webpack5-runner/src/utils/asyncSubPackageRuntime.ts`（新建） | 共享运行时就绪门源码生成（仅在 `sharedRuntime` 开启时注入） |
| `packages/taro-webpack5-runner/src/plugins/SubPackageIndiePlugin.ts` | 支持 `mainPackageRoot` 缺省；产出 async 规则；runtime 锚点 |
| `packages/taro-webpack5-runner/src/plugins/AsyncSubPackagePlugin.ts` | 规则模式：消费页面解析、chunk 归属、预算分配、样式/模板回填、占位入口、app.json 注册、就绪门 |
| `packages/taro-webpack5-runner/src/plugins/MiniPlugin.ts` | 空主包页面放行、async 规则接线 |
| `packages/taro-webpack5-runner/src/shared-runtime/entry.sync.js` | provider 就绪状态初始化与 settle |
| `packages/taro-webpack5-runner/src/shared-runtime/async-provider.js` | `activate()` 返回是否完成 |
| `packages/taro/types/taro.config.d.ts` | 配置类型 |
| `packages/taro-webpack5-runner/tests/async-subpackage-rules.spec.ts`（新建） | 纯函数单测 |
| `packages/taro-webpack5-runner/tests/subpackage-indie-async-only.spec.ts`（新建） | 插件归一化单测 |
| `packages/taro-webpack5-runner/tests/async-subpackage-rules-compile.spec.ts`（新建） | 规则模式编译级测试（含预算拆分） |
| `packages/taro-webpack5-runner/tests/shared-runtime-readiness.spec.ts`（新建） | 就绪门单测 |

**Demo 仓库 `<TARO_ROOT>/Example/taro-blended-project`**

| 文件 | 职责 |
| --- | --- |
| `src/app.config.js` | async-only 配置 + subPackages |
| `src/pages/sub1/index.config.js` / `index.jsx` | 页面化、路由参数 |
| `src/pages/sub2/index.config.js` / `index.jsx` | 页面化、路由参数 |
| `plugin-mv/index.js` | 宿主注册所有权清理 |

**宿主仓库 `<TARO_ROOT>/Example/miniapp-blended-project`**

| 文件 | 职责 |
| --- | --- |
| `app.json` | 分包注册 |
| `pages/entry/index.js` / `.wxml` | 入口跳转 |

---

## Task 1: 规则纯函数与配置类型

**Files:**
- Create: `packages/taro-webpack5-runner/src/utils/asyncSubPackageRules.ts`
- Create: `packages/taro-webpack5-runner/tests/async-subpackage-rules.spec.ts`
- Modify: `packages/taro/types/taro.config.d.ts:340-380`

**Interfaces:**
- Produces:
  - `type EntrySelector = string | RegExp`
  - `interface AsyncSubPackageRuleInput { path: EntrySelector | EntrySelector[]; asyncSubPackage: { asyncRoot: string | string[]; maxSize?: number } }`
  - `interface NormalizedAsyncSubPackageRule { id: string; index: number; selectors: EntrySelector[]; asyncRoots: string[]; maxSize?: number; matchedPages: string[] }`
  - `normalizeAsyncSubPackageRules(rules, declaredPages, options?): NormalizedAsyncSubPackageRule[]`
  - `resolveAsyncSubPackageRule(rules, consumerPages): NormalizedAsyncSubPackageRule | null`
  - `allocateAsyncChunks(rule, chunks): Map<string, string>`
  - `collectDeclaredPagePaths(appConfig): string[]`
  - `hasAsyncOnlySubPackageIndieConfig(appConfig): boolean`
  - `assertDeclaredPages(appConfig, options: { allowEmptyMainPages: boolean }): string[]`

- [ ] **Step 1: 写失败测试**

创建 `packages/taro-webpack5-runner/tests/async-subpackage-rules.spec.ts`：

```ts
import { describe, expect, test } from 'vitest'

import {
  allocateAsyncChunks,
  assertDeclaredPages,
  collectDeclaredPagePaths,
  hasAsyncOnlySubPackageIndieConfig,
  normalizeAsyncSubPackageRules,
  resolveAsyncSubPackageRule,
} from '../src/utils/asyncSubPackageRules'

const PAGES = ['pages/sub1/index', 'pages/sub2/index', 'pages/sub3/index']

describe('normalizeAsyncSubPackageRules', () => {
  test('字符串 path 精确匹配已声明页面', () => {
    const rules = normalizeAsyncSubPackageRules([
      { path: 'pages/sub1/index', asyncSubPackage: { asyncRoot: 'pages/sub1-async' } },
    ], PAGES)
    expect(rules).toHaveLength(1)
    expect(rules[0].matchedPages).toEqual(['pages/sub1/index'])
    expect(rules[0].asyncRoots).toEqual(['pages/sub1-async'])
  })

  test('RegExp 与数组 path 取并集去重', () => {
    const rules = normalizeAsyncSubPackageRules([
      {
        path: [/^pages\/sub\d+\/index$/, 'pages/sub1/index'],
        asyncSubPackage: { asyncRoot: ['pages/shared-async', 'pages/shared-async-2'], maxSize: 1000 },
      },
    ], PAGES)
    expect(rules[0].matchedPages).toEqual(PAGES)
    expect(rules[0].asyncRoots).toEqual(['pages/shared-async', 'pages/shared-async-2'])
  })

  test('规则匹配不到页面时报错', () => {
    expect(() => normalizeAsyncSubPackageRules([
      { path: 'pages/nope/index', asyncSubPackage: { asyncRoot: 'pages/nope-async' } },
    ], PAGES)).toThrow(/未匹配任何已声明页面/)
  })

  test('两条规则页面集合完全相同时报错', () => {
    expect(() => normalizeAsyncSubPackageRules([
      { path: 'pages/sub1/index', asyncSubPackage: { asyncRoot: 'pages/a-async' } },
      { path: /sub1/, asyncSubPackage: { asyncRoot: 'pages/b-async' } },
    ], PAGES)).toThrow(/歧义/)
  })

  test('多目标缺少 maxSize 时报错', () => {
    expect(() => normalizeAsyncSubPackageRules([
      { path: 'pages/sub1/index', asyncSubPackage: { asyncRoot: ['pages/a', 'pages/b'] } },
    ], PAGES)).toThrow(/maxSize/)
  })

  test('asyncRoot 与保留目录冲突时报错', () => {
    expect(() => normalizeAsyncSubPackageRules([
      { path: 'pages/sub1/index', asyncSubPackage: { asyncRoot: 'shared-async-v1' } },
    ], PAGES, { reservedRoots: ['shared-async-v1'] })).toThrow(/shared-async-v1/)
  })

  test('asyncRoot 重复出现在不同规则时报错', () => {
    expect(() => normalizeAsyncSubPackageRules([
      { path: 'pages/sub1/index', asyncSubPackage: { asyncRoot: 'pages/a-async' } },
      { path: 'pages/sub2/index', asyncSubPackage: { asyncRoot: 'pages/a-async' } },
    ], PAGES)).toThrow(/重复/)
  })
})

describe('resolveAsyncSubPackageRule', () => {
  const rules = normalizeAsyncSubPackageRules([
    { path: 'pages/sub1/index', asyncSubPackage: { asyncRoot: 'pages/sub1-async' } },
    { path: 'pages/sub2/index', asyncSubPackage: { asyncRoot: 'pages/sub2-async' } },
    {
      path: /^pages\/sub\d+\/index$/,
      asyncSubPackage: { asyncRoot: ['pages/shared-async', 'pages/shared-async-2'], maxSize: 1000 },
    },
  ], PAGES)

  test('单页面消费者命中最小规则', () => {
    expect(resolveAsyncSubPackageRule(rules, ['pages/sub1/index'])?.asyncRoots)
      .toEqual(['pages/sub1-async'])
  })

  test('跨页面消费者命中覆盖规则', () => {
    expect(resolveAsyncSubPackageRule(rules, ['pages/sub1/index', 'pages/sub2/index'])?.asyncRoots)
      .toEqual(['pages/shared-async', 'pages/shared-async-2'])
  })

  test('没有任何规则命中时返回 null', () => {
    expect(resolveAsyncSubPackageRule(rules, ['pages/other/index'])).toBeNull()
  })

  test('有规则命中但无规则覆盖全部消费者时报错', () => {
    expect(() => resolveAsyncSubPackageRule(rules, ['pages/sub1/index', 'pages/other/index']))
      .toThrow(/没有一条规则同时覆盖/)
  })
})

describe('allocateAsyncChunks', () => {
  const [single, multi] = normalizeAsyncSubPackageRules([
    { path: 'pages/sub1/index', asyncSubPackage: { asyncRoot: 'pages/sub1-async' } },
    {
      path: 'pages/sub2/index',
      asyncSubPackage: { asyncRoot: ['pages/shared-async', 'pages/shared-async-2'], maxSize: 100 },
    },
  ], PAGES)

  test('单目标全部归入同一目录', () => {
    const result = allocateAsyncChunks(single, [
      { name: 'a', size: 10 },
      { name: 'b', size: 20 },
    ])
    expect(Array.from(result.entries())).toEqual([['a', 'pages/sub1-async'], ['b', 'pages/sub1-async']])
  })

  test('多目标按体积降序确定性装箱', () => {
    const result = allocateAsyncChunks(multi, [
      { name: 'small', size: 40 },
      { name: 'big', size: 60 },
      { name: 'tiny', size: 10 },
    ])
    expect(result.get('big')).toBe('pages/shared-async')
    expect(result.get('small')).toBe('pages/shared-async')
    expect(result.get('tiny')).toBe('pages/shared-async-2')
  })

  test('单 chunk 超过 maxSize 时报错', () => {
    expect(() => allocateAsyncChunks(multi, [{ name: 'huge', size: 101 }])).toThrow(/超过 maxSize/)
  })

  test('所有目标都放不下时报错', () => {
    expect(() => allocateAsyncChunks(multi, [
      { name: 'a', size: 60 },
      { name: 'b', size: 60 },
      { name: 'c', size: 60 },
    ])).toThrow(/容量不足/)
  })
})

describe('appConfig helpers', () => {
  test('collectDeclaredPagePaths 合并主包与分包页面', () => {
    expect(collectDeclaredPagePaths({
      pages: ['pages/index/index'],
      subPackages: [{ root: 'pages/sub1', pages: ['index'] }],
    })).toEqual(['pages/index/index', 'pages/sub1/index'])
  })

  test('hasAsyncOnlySubPackageIndieConfig 识别无 mainPackageRoot 的配置', () => {
    expect(hasAsyncOnlySubPackageIndieConfig({
      subPackageIndie: [{ subPackageRoots: [{ path: 'pages/sub1/index', asyncSubPackage: { asyncRoot: 'pages/sub1-async' } }] }],
    })).toBe(true)
    expect(hasAsyncOnlySubPackageIndieConfig({
      subPackageIndie: [{ mainPackageRoot: 'pages/index/index', subPackageRoots: [] }],
    })).toBe(false)
  })

  test('assertDeclaredPages 在 async-only 且存在分包页面时放行空主包', () => {
    const appConfig = {
      pages: [],
      subPackages: [{ root: 'pages/sub1', pages: ['index'] }],
      subPackageIndie: [{ subPackageRoots: [{ path: 'pages/sub1/index', asyncSubPackage: { asyncRoot: 'pages/sub1-async' } }] }],
    }
    expect(assertDeclaredPages(appConfig, { allowEmptyMainPages: true })).toEqual(['pages/sub1/index'])
  })

  test('assertDeclaredPages 在无任何页面时报错', () => {
    expect(() => assertDeclaredPages({ pages: [] }, { allowEmptyMainPages: true })).toThrow(/pages/)
  })
})
```

- [ ] **Step 2: 运行测试确认失败**

```bash
cd <TARO_ROOT>/taro-weapp-runtime-union
pnpm --filter @tarojs/webpack5-runner exec vitest run tests/async-subpackage-rules.spec.ts
```

期望：FAIL，`Cannot find module '../src/utils/asyncSubPackageRules'`。

- [ ] **Step 3: 实现纯函数模块**

创建 `packages/taro-webpack5-runner/src/utils/asyncSubPackageRules.ts`：

```ts
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
```

- [ ] **Step 4: 运行测试确认通过**

```bash
pnpm --filter @tarojs/webpack5-runner exec vitest run tests/async-subpackage-rules.spec.ts
```

期望：PASS（全部用例）。

- [ ] **Step 5: 更新配置类型**

修改 `packages/taro/types/taro.config.d.ts`，把 `SubPackageIndieRootConfig` 与 `SubPackageIndieConfig` 替换为：

```ts
  /** 子分包独立模板 root 配置项，可以是路径字符串或包含额外选项的对象 */
  type SubPackageIndieRootConfig = string | {
    /**
     * 分包根路径（相对于 sourceDir）。
     * 省略 mainPackageRoot 的 async-only 模式下，支持 RegExp 或数组，用于匹配已声明页面。
     */
    path: string | RegExp | Array<string | RegExp>
    /** 是否禁用递归组件（comp/custom-wrapper/recursive-component）的生成。 */
    disableRecursiveComponent?: boolean
    /**
     * 异步分包配置。配置 asyncRoot 后启用。
     * async-only 模式下按「消费页面集合」决定动态 import 产物的物理归属。
     */
    asyncSubPackage?: {
      /**
       * 异步子包根路径（相对于 sourceDir），必填。
       * 传数组时表示多个物理目标，必须同时配置 maxSize。
       */
      asyncRoot: string | string[]
      /** 每个物理目标的字节预算；asyncRoot 为数组时必填。 */
      maxSize?: number
    }
  }

  /** 子分包独立模板配置项 */
  interface SubPackageIndieConfig {
    /**
     * 主入口分包根路径（相对于 sourceDir），runtime chunks 将生成到此目录。
     * 省略时进入 async-only 模式：subPackageRoots 变为异步归属规则，业务包保留根级 app.js/runtime.js。
     */
    mainPackageRoot?: SubPackageIndieRootConfig
    /** 子组件分包根路径列表；async-only 模式下为异步归属规则列表 */
    subPackageRoots?: SubPackageIndieRootConfig[]
  }
```

- [ ] **Step 6: 类型检查**

```bash
pnpm --filter @tarojs/taro exec tsc --noEmit -p tsconfig.json
```

若该包无可用 tsconfig，改为：

```bash
pnpm --filter @tarojs/webpack5-runner exec tsc --noEmit
```

期望：无新增类型错误。

- [ ] **Step 7: 提交**

```bash
git add packages/taro-webpack5-runner/src/utils/asyncSubPackageRules.ts \
        packages/taro-webpack5-runner/tests/async-subpackage-rules.spec.ts \
        packages/taro/types/taro.config.d.ts
git commit -m "feat(webpack-runner): 新增 asyncSubPackage 规则模型与预算分配纯函数"
```

---

## Task 2: SubPackageIndiePlugin 支持 async-only 模式

**Files:**
- Modify: `packages/taro-webpack5-runner/src/plugins/SubPackageIndiePlugin.ts:1-60, 350-500`
- Create: `packages/taro-webpack5-runner/tests/subpackage-indie-async-only.spec.ts`

**Interfaces:**
- Consumes: `normalizeAsyncSubPackageRules`、`collectDeclaredPagePaths`、`NormalizedAsyncSubPackageRule`（Task 1）
- Produces:
  - `NormalizedSubPackageIndieConfig = { mainPackageRoot: string | null; subPackageRoots: string[]; disableRecursiveComponentRoots: Set<string>; asyncSubPackageRootMap: Map<string, string>; asyncOnly: boolean; asyncRules: NormalizedAsyncSubPackageRule[] }`
  - `SubPackageIndiePlugin.getAsyncSubPackageRules(): NormalizedAsyncSubPackageRule[]`
  - `SubPackageIndiePlugin.getAsyncSubPackageRuntimeRoots(): AsyncSubPackageRuntimeRoot[]`（async-only 时 `sourceRoot === ''`）

- [ ] **Step 1: 写失败测试**

创建 `packages/taro-webpack5-runner/tests/subpackage-indie-async-only.spec.ts`：

```ts
import { describe, expect, test } from 'vitest'

import SubPackageIndiePlugin from '../src/plugins/SubPackageIndiePlugin'

function createPlugin (appConfig: any) {
  const miniPlugin: any = {
    appConfig,
    nativeComponents: new Map(),
    options: {
      newBlended: true,
      sourceDir: '/tmp/taro-async-only',
      fileType: { style: '.wxss', templ: '.wxml', config: '.json' },
      logger: { quiet: true },
      combination: { config: {} },
    },
  }
  return new SubPackageIndiePlugin(miniPlugin)
}

const ASYNC_ONLY_CONFIG = {
  pages: [],
  subPackages: [
    { root: 'pages/sub1', pages: ['index'] },
    { root: 'pages/sub2', pages: ['index'] },
  ],
  subPackageIndie: [
    {
      subPackageRoots: [
        { path: 'pages/sub1/index', asyncSubPackage: { asyncRoot: 'pages/sub1-async' } },
        { path: 'pages/sub2/index', asyncSubPackage: { asyncRoot: 'pages/sub2-async' } },
        {
          path: /^pages\/sub\d+\/index$/,
          asyncSubPackage: { asyncRoot: ['pages/shared-async', 'pages/shared-async-2'], maxSize: 1000 },
        },
      ],
    },
  ],
}

describe('SubPackageIndiePlugin async-only', () => {
  test('省略 mainPackageRoot 时进入 async-only 模式', () => {
    const plugin = createPlugin(ASYNC_ONLY_CONFIG)
    const [config] = plugin.getSubPackageIndieConfigs()
    expect(config.asyncOnly).toBe(true)
    expect(config.mainPackageRoot).toBeNull()
    expect(config.subPackageRoots).toEqual([])
    expect(config.asyncRules).toHaveLength(3)
  })

  test('async-only 不产生独立分包 root', () => {
    const plugin = createPlugin(ASYNC_ONLY_CONFIG)
    expect(plugin.getAllIndieRoots()).toEqual([])
    expect(plugin.getAllMainPackageRoots()).toEqual([])
    expect(plugin.hasSubPackageIndieMainPackageRoot()).toBe(false)
  })

  test('async-only 的 runtime 锚点是根目录', () => {
    const plugin = createPlugin(ASYNC_ONLY_CONFIG)
    expect(plugin.getAsyncSubPackageRuntimeRoots()).toEqual([
      { sourceRoot: '', asyncRoot: 'pages/sub1-async' },
      { sourceRoot: '', asyncRoot: 'pages/sub2-async' },
      { sourceRoot: '', asyncRoot: 'pages/shared-async' },
      { sourceRoot: '', asyncRoot: 'pages/shared-async-2' },
    ])
  })

  test('async-only 页面不匹配任何独立分包 root', () => {
    const plugin = createPlugin(ASYNC_ONLY_CONFIG)
    expect(plugin.getSubPackageIndieMatch('pages/sub1/index')).toBeNull()
  })

  test('asyncRoot 与 shared-async-v1 冲突时报错', () => {
    const plugin = createPlugin({
      pages: [],
      subPackages: [{ root: 'pages/sub1', pages: ['index'] }],
      subPackageIndie: [{
        subPackageRoots: [
          { path: 'pages/sub1/index', asyncSubPackage: { asyncRoot: 'shared-async-v1' } },
        ],
      }],
    })
    expect(() => plugin.getSubPackageIndieConfigs()).toThrow(/shared-async-v1/)
  })

  test('旧配置仍按 mainPackageRoot 归一化', () => {
    const plugin = createPlugin({
      pages: ['pages/index/index'],
      subPackageIndie: [{
        mainPackageRoot: { path: 'pages/index/index', disableRecursiveComponent: true },
        subPackageRoots: [{ path: 'pages/sub1/index', asyncSubPackage: { asyncRoot: 'pages/sub1-async' } }],
      }],
    })
    const [config] = plugin.getSubPackageIndieConfigs()
    expect(config.asyncOnly).toBe(false)
    expect(config.mainPackageRoot).toBe('pages/index')
    expect(config.subPackageRoots).toEqual(['pages/sub1'])
    expect(plugin.getAllMainPackageRoots()).toEqual(['pages/index'])
    expect(plugin.getAsyncSubPackageRuntimeRoots()).toEqual([
      { sourceRoot: 'pages/index', asyncRoot: 'pages/sub1-async' },
    ])
  })
})
```

- [ ] **Step 2: 运行测试确认失败**

```bash
pnpm --filter @tarojs/webpack5-runner exec vitest run tests/subpackage-indie-async-only.spec.ts
```

期望：FAIL（`config.asyncOnly` 为 `undefined`、`mainPackageRoot` 仍为字符串）。

- [ ] **Step 3: 修改类型与归一化**

在 `SubPackageIndiePlugin.ts` 顶部增加导入：

```ts
import {
  collectDeclaredPagePaths,
  normalizeAsyncSubPackageRules,
} from '../utils/asyncSubPackageRules'

import type { NormalizedAsyncSubPackageRule } from '../utils/asyncSubPackageRules'
```

把 `NormalizedSubPackageIndieConfig` 替换为：

```ts
export type NormalizedSubPackageIndieConfig = {
  /** async-only 模式下为 null */
  mainPackageRoot: string | null
  /** 独立组件根；async-only 模式下恒为空数组 */
  subPackageRoots: string[]
  disableRecursiveComponentRoots: Set<string>
  /** 旧模式：sourceRoot -> asyncRoot */
  asyncSubPackageRootMap: Map<string, string>
  /** 是否 async-only 模式 */
  asyncOnly: boolean
  /** async-only 模式：异步归属规则 */
  asyncRules: NormalizedAsyncSubPackageRule[]
}
```

把 `parseIndieRootConfig` 的入参类型与返回值改为：

```ts
  parseIndieRootConfig (rootConfig: string | { path: string | RegExp | Array<string | RegExp>, disableRecursiveComponent?: boolean, asyncSubPackage?: { asyncRoot: string | string[], maxSize?: number } }): { path: string, originalPath: string, disableRecursiveComponent: boolean, asyncRoot?: string } {
    if (typeof rootConfig === 'string') {
      return { path: this.normalizeIndieRoot(rootConfig), originalPath: rootConfig, disableRecursiveComponent: false }
    }
    if (typeof rootConfig.path !== 'string') {
      throw new Error('[taro asyncSubPackage] 配置了 mainPackageRoot 时，path 只支持字符串')
    }
    if (Array.isArray(rootConfig.asyncSubPackage?.asyncRoot)) {
      throw new Error('[taro asyncSubPackage] 配置了 mainPackageRoot 时，asyncRoot 只支持字符串')
    }
    return {
      path: this.normalizeIndieRoot(rootConfig.path),
      originalPath: rootConfig.path,
      disableRecursiveComponent: !!rootConfig.disableRecursiveComponent,
      asyncRoot: rootConfig.asyncSubPackage?.asyncRoot,
    }
  }
```

- [ ] **Step 4: 改造 getSubPackageIndieConfigs**

把 `getSubPackageIndieConfigs` 整体替换为：

```ts
  getSubPackageIndieConfigs (): NormalizedSubPackageIndieConfig[] {
    if (this.subPackageIndieConfigsCache) return this.subPackageIndieConfigsCache

    const appConfig = this.miniPlugin.appConfig
    const subPackageIndie = appConfig?.subPackageIndie
    if (!Array.isArray(subPackageIndie)) {
      this.subPackageIndieConfigsCache = []
      return this.subPackageIndieConfigsCache
    }

    const appPages = new Set(appConfig?.pages || [])
    const declaredPages = collectDeclaredPagePaths(appConfig)

    this.subPackageIndieConfigsCache = subPackageIndie.map(({ mainPackageRoot, subPackageRoots = [] }: SubPackageIndieConfig) => {
      if (mainPackageRoot == null) {
        const asyncRules = normalizeAsyncSubPackageRules(
          subPackageRoots as any,
          declaredPages,
          { reservedRoots: [SHARED_ASYNC_ROOT] }
        )
        return {
          mainPackageRoot: null,
          subPackageRoots: [],
          disableRecursiveComponentRoots: new Set<string>(),
          asyncSubPackageRootMap: new Map<string, string>(),
          asyncOnly: true,
          asyncRules,
        }
      }

      const mainParsed = this.parseIndieRootConfig(mainPackageRoot)
      if (!appPages.has(mainParsed.originalPath) && this.options.logger?.quiet === false) {
        printLog(processTypeEnum.WARNING, 'subPackageIndie', `mainPackageRoot.path "${mainParsed.originalPath}" 未配置在 app.config 的 pages 中，请补充 pages: [..., "${mainParsed.originalPath}"]，否则主包入口页面文件不会生成。`)
      }

      const subParsedList = subPackageRoots.map(root => this.parseIndieRootConfig(root))
      const disableRecursiveComponentRoots = new Set<string>()
      const asyncSubPackageRootMap = new Map<string, string>()

      if (mainParsed.disableRecursiveComponent) {
        disableRecursiveComponentRoots.add(mainParsed.path)
      }
      if (mainParsed.asyncRoot) {
        if (mainParsed.asyncRoot === SHARED_ASYNC_ROOT) {
          throw new Error(`[taro asyncSubPackage] asyncRoot "${SHARED_ASYNC_ROOT}" 与框架保留目录冲突，请换一个目录名`)
        }
        asyncSubPackageRootMap.set(mainParsed.path, mainParsed.asyncRoot)
      }

      subParsedList.forEach(sub => {
        if (sub.disableRecursiveComponent) {
          disableRecursiveComponentRoots.add(sub.path)
        }
        if (sub.asyncRoot) {
          if (sub.asyncRoot === SHARED_ASYNC_ROOT) {
            throw new Error(`[taro asyncSubPackage] asyncRoot "${SHARED_ASYNC_ROOT}" 与框架保留目录冲突，请换一个目录名`)
          }
          asyncSubPackageRootMap.set(sub.path, sub.asyncRoot)
        }
      })

      return {
        mainPackageRoot: mainParsed.path,
        subPackageRoots: Array.from(new Set(subParsedList.map(sub => sub.path))),
        disableRecursiveComponentRoots,
        asyncSubPackageRootMap,
        asyncOnly: false,
        asyncRules: [],
      }
    })

    return this.subPackageIndieConfigsCache
  }
```

- [ ] **Step 5: 改造 root 聚合与 runtime 锚点**

`getAllIndieRoots`：

```ts
  getAllIndieRoots (): string[] {
    if (!this.allIndieRootsCache) {
      this.allIndieRootsCache = Array.from(new Set(
        this.getSubPackageIndieConfigs().flatMap(({ mainPackageRoot, subPackageRoots }) => [
          ...(mainPackageRoot ? [mainPackageRoot] : []),
          ...subPackageRoots,
        ])
      ))
    }

    return this.allIndieRootsCache
  }
```

新增 `getAsyncSubPackageRules`：

```ts
  /**
   * async-only 模式下的异步归属规则。
   */
  getAsyncSubPackageRules (): NormalizedAsyncSubPackageRule[] {
    return this.getSubPackageIndieConfigs().flatMap(config => config.asyncRules)
  }
```

`getAsyncSubPackageRuntimeRoots`：

```ts
  getAsyncSubPackageRuntimeRoots (): AsyncSubPackageRuntimeRoot[] {
    const result: AsyncSubPackageRuntimeRoot[] = []
    const seen = new Set<string>()
    const push = (sourceRoot: string, asyncRoot: string) => {
      const key = `${sourceRoot} ${asyncRoot}`
      if (seen.has(key)) return
      seen.add(key)
      result.push({ sourceRoot, asyncRoot })
    }

    for (const config of this.getSubPackageIndieConfigs()) {
      if (config.asyncOnly) {
        for (const rule of config.asyncRules) {
          for (const asyncRoot of rule.asyncRoots) {
            push('', asyncRoot)
          }
        }
        continue
      }
      const asyncRoots = new Set(config.asyncSubPackageRootMap.values())
      for (const asyncRoot of asyncRoots) {
        push(config.mainPackageRoot!, asyncRoot)
      }
    }

    return result
  }
```

`getAllMainPackageRoots`：

```ts
  getAllMainPackageRoots (): string[] {
    if (!this.allMainPackageRootsCache) {
      this.allMainPackageRootsCache = Array.from(new Set(
        this.getSubPackageIndieConfigs()
          .map(item => item.mainPackageRoot)
          .filter((root): root is string => !!root)
      ))
    }

    return this.allMainPackageRootsCache
  }
```

`getSubPackageIndieMatch` 循环开头加：

```ts
    for (const config of configs) {
      if (!config.mainPackageRoot) continue
```

- [ ] **Step 6: 运行测试确认通过**

```bash
pnpm --filter @tarojs/webpack5-runner exec vitest run tests/subpackage-indie-async-only.spec.ts
pnpm --filter @tarojs/webpack5-runner exec vitest run tests/subpackage-indie-shared-runtime.spec.ts
```

期望：两个 spec 均 PASS。

- [ ] **Step 7: 提交**

```bash
git add packages/taro-webpack5-runner/src/plugins/SubPackageIndiePlugin.ts \
        packages/taro-webpack5-runner/tests/subpackage-indie-async-only.spec.ts
git commit -m "feat(webpack-runner): subPackageIndie 支持省略 mainPackageRoot 的 async-only 模式"
```

---

## Task 3: MiniPlugin 接线与空主包页面放行

**Files:**
- Modify: `packages/taro-webpack5-runner/src/plugins/MiniPlugin.ts:536-548, 780-800`
- Create: `packages/taro-webpack5-runner/tests/mini-plugin-async-only-pages.spec.ts`
- Create: `packages/taro-webpack5-runner/tests/fixtures/async-only-pages/src/pages/sub1/index.jsx`

**Interfaces:**
- Consumes: `assertDeclaredPages`（Task 1）、`SubPackageIndiePlugin.getAsyncSubPackageRules()`（Task 2）
- Produces: `MiniPlugin.applyAsyncSubPackagePlugin` 在 async-only 模式下也会实例化 `AsyncSubPackagePlugin`

- [ ] **Step 1: 准备 fixture**

```bash
mkdir -p packages/taro-webpack5-runner/tests/fixtures/async-only-pages/src/pages/sub1
```

`tests/fixtures/async-only-pages/src/pages/sub1/index.jsx`：

```jsx
export default function Sub1 () {
  return null
}
```

- [ ] **Step 2: 写失败测试**

创建 `packages/taro-webpack5-runner/tests/mini-plugin-async-only-pages.spec.ts`：

```ts
import path from 'node:path'

import { describe, expect, test } from 'vitest'

import MiniPlugin from '../src/plugins/MiniPlugin'

const fixtureDir = path.resolve(__dirname, 'fixtures/async-only-pages/src')

function createPlugin (appConfig: any) {
  const plugin: any = Object.create(MiniPlugin.prototype)
  plugin.appConfig = appConfig
  plugin.isWatch = true
  plugin.pages = new Set()
  plugin.prerenderPages = new Set()
  plugin.options = {
    logger: { quiet: true },
    newBlended: true,
    frameworkExts: ['.jsx', '.js'],
    sourceDir: fixtureDir,
    combination: { config: {} },
  }
  plugin.getTabBarFiles = () => {}
  plugin.getNativeComponent = () => {}
  plugin.isNativePageORComponent = () => false
  plugin.getTemplatePath = (p: string) => p.replace(/\.jsx?$/, '.wxml')
  plugin.getStylePath = (p: string) => p.replace(/\.jsx?$/, '.wxss')
  plugin.isWeappSubPackageIndieEnabled = () => true
  return plugin
}

describe('MiniPlugin async-only 空主包页面', () => {
  test('async-only 配置下允许 pages 为空数组', () => {
    const plugin = createPlugin({
      pages: [],
      subPackages: [{ root: 'pages/sub1', pages: ['index'] }],
      subPackageIndie: [{
        subPackageRoots: [
          { path: 'pages/sub1/index', asyncSubPackage: { asyncRoot: 'pages/sub1-async' } },
        ],
      }],
    })
    expect(() => plugin.getPages()).not.toThrow()
    expect(Array.from(plugin.pages).map((p: any) => p.name)).toEqual(['pages/sub1/index'])
  })

  test('未配置 async-only 且 pages 为空时仍然报错', () => {
    const plugin = createPlugin({
      pages: [],
      subPackages: [{ root: 'pages/sub1', pages: ['index'] }],
    })
    expect(() => plugin.getPages()).toThrow(/pages/)
  })
})
```

- [ ] **Step 3: 运行测试确认失败**

```bash
pnpm --filter @tarojs/webpack5-runner exec vitest run tests/mini-plugin-async-only-pages.spec.ts
```

期望：FAIL，第一个用例抛 `全局配置缺少 pages 字段`。

- [ ] **Step 4: 修改 getPages 守卫**

在 `MiniPlugin.ts` 顶部导入：

```ts
import { assertDeclaredPages } from '../utils/asyncSubPackageRules'
```

把 `getPages` 开头的：

```ts
    const appPages = this.appConfig.pages
    if (!appPages || !appPages.length) {
      throw new Error('全局配置缺少 pages 字段，请检查！')
    }
```

替换为：

```ts
    const appPages = this.appConfig.pages || []
    assertDeclaredPages(this.appConfig, {
      allowEmptyMainPages: this.isWeappSubPackageIndieEnabled(),
    })
```

- [ ] **Step 5: 修改 applyAsyncSubPackagePlugin**

把整个方法替换为：

```ts
  /**
   * 初始化异步分包插件。
   * MiniPlugin 仅作为桥接，具体的 babel 注入、chunk 处理和 app.json 注册由 AsyncSubPackagePlugin 承担。
   */
  applyAsyncSubPackagePlugin (compiler: Compiler) {
    if (!this.subPackageIndiePlugin) return
    const asyncRootMap = this.subPackageIndiePlugin.getAsyncSubPackageRootMap()
    const asyncRules = this.subPackageIndiePlugin.getAsyncSubPackageRules()
    if (asyncRootMap.size === 0 && asyncRules.length === 0 && !this.asyncSubPackagePlugin) return

    if (!this.asyncSubPackagePlugin) {
      this.asyncSubPackagePlugin = new AsyncSubPackagePlugin(this)
    }
    this.asyncSubPackagePlugin.updateAsyncRootMap(asyncRootMap)
    this.asyncSubPackagePlugin.updateAsyncRules(asyncRules)
    this.asyncSubPackagePlugin.updateAsyncRuntimeRoots(this.subPackageIndiePlugin.getAsyncSubPackageRuntimeRoots())
    this.asyncSubPackagePlugin.apply(compiler)
  }
```

- [ ] **Step 6: 运行测试确认通过**

```bash
pnpm --filter @tarojs/webpack5-runner exec vitest run tests/mini-plugin-async-only-pages.spec.ts
```

期望：PASS。

- [ ] **Step 7: 提交**

```bash
git add packages/taro-webpack5-runner/src/plugins/MiniPlugin.ts \
        packages/taro-webpack5-runner/tests/mini-plugin-async-only-pages.spec.ts \
        packages/taro-webpack5-runner/tests/fixtures/async-only-pages
git commit -m "feat(webpack-runner): MiniPlugin 放行 async-only 空主包页面并接线异步规则"
```

---

## Task 4: AsyncSubPackagePlugin 规则模式（归属 + 预算 + 产物）

**Files:**
- Modify: `packages/taro-webpack5-runner/src/plugins/AsyncSubPackagePlugin.ts`
- Create: `packages/taro-webpack5-runner/tests/async-subpackage-rules-compile.spec.ts`

**Interfaces:**
- Consumes: `normalizeAsyncSubPackageRules`、`resolveAsyncSubPackageRule`、`allocateAsyncChunks`（Task 1）
- Produces:
  - `AsyncSubPackagePlugin.updateAsyncRules(rules: NormalizedAsyncSubPackageRule[]): void`
  - 规则模式下 chunk 命名为 `${asyncRoot}/async-${safeName}`
  - 只为实际使用的 asyncRoot 生成 `index.js/json/wxml` 并写入 `app.json.subPackages`

- [ ] **Step 1: 写失败测试**

创建 `packages/taro-webpack5-runner/tests/async-subpackage-rules-compile.spec.ts`：

```ts
import fs from 'node:fs'
import { createRequire } from 'node:module'
import os from 'node:os'
import path from 'node:path'

import { afterAll, describe, expect, test } from 'vitest'

import AsyncSubPackagePlugin from '../src/plugins/AsyncSubPackagePlugin'
import { normalizeAsyncSubPackageRules } from '../src/utils/asyncSubPackageRules'

const runnerRequire = createRequire(path.resolve(__dirname, '../package.json'))
const webpack = runnerRequire('webpack')
const MiniCssExtractPlugin = runnerRequire('mini-css-extract-plugin')
const { SyncHook } = runnerRequire('tapable')
const testsRequire = createRequire(path.resolve(__dirname, '../../../tests/package.json'))
const { createFsFromVolume, Volume } = testsRequire('memfs')

const PAGES = ['pages/sub1/index', 'pages/sub2/index', 'pages/sub3/index']
const tempDirs: string[] = []

afterAll(() => {
  for (const dir of tempDirs) fs.rmSync(dir, { recursive: true, force: true })
})

const PAD = `/* ${'x'.repeat(2000)} */\n`

function createFixture () {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'taro-async-rules-'))
  tempDirs.push(dir)
  const write = (relative: string, content: string) => {
    const file = path.join(dir, relative)
    fs.mkdirSync(path.dirname(file), { recursive: true })
    fs.writeFileSync(file, content)
  }

  write('pages/sub1/index.js', `
export function load () {
  return Promise.all([import('./only1'), import('../shared-a'), import('../shared-b')])
}
`)
  write('pages/sub2/index.js', `
export function load () {
  return Promise.all([import('./only2'), import('../shared-a')])
}
`)
  write('pages/sub3/index.js', `
export function load () {
  return Promise.all([import('./only3'), import('../shared-b')])
}
`)
  write('pages/sub1/only1.js', `import './only1.css'\nexport default 'only1'\n`)
  write('pages/sub1/only1.css', '.only1 { color: red; }\n')
  write('pages/sub2/only2.js', `import './only2.css'\nexport default 'only2'\n`)
  write('pages/sub2/only2.css', '.only2 { color: green; }\n')
  write('pages/sub3/only3.js', `import './only3.css'\nexport default 'only3'\n`)
  write('pages/sub3/only3.css', '.only3 { color: blue; }\n')
  write('shared-a.js', `${PAD}import './shared-a.css'\nexport default 'shared-a'\n`)
  write('shared-a.css', '.shared-a { color: black; }\n')
  write('shared-b.js', `${PAD}import './shared-b.css'\nexport default 'shared-b'\n`)
  write('shared-b.css', '.shared-b { color: white; }\n')
  return dir
}

function createRules (maxSize: number) {
  return normalizeAsyncSubPackageRules([
    { path: 'pages/sub1/index', asyncSubPackage: { asyncRoot: 'pages/sub1-async' } },
    { path: 'pages/sub2/index', asyncSubPackage: { asyncRoot: 'pages/sub2-async' } },
    { path: 'pages/sub3/index', asyncSubPackage: { asyncRoot: 'pages/sub3-async' } },
    {
      path: /^pages\/sub\d+\/index$/,
      asyncSubPackage: { asyncRoot: ['pages/shared-async', 'pages/shared-async-2'], maxSize },
    },
  ], PAGES)
}

function compile (options: { maxSize: number, appConfig?: any }) {
  const fixtureDir = createFixture()
  const appConfig = options.appConfig || {
    pages: [],
    subPackages: [
      { root: 'pages/sub1', pages: ['index'] },
      { root: 'pages/sub2', pages: ['index'] },
      { root: 'pages/sub3', pages: ['index'] },
    ],
  }

  return new Promise<{ assets: Record<string, string>, errors: string[], appJson: any }>((resolve, reject) => {
    const compiler = webpack({
      context: fixtureDir,
      mode: 'development',
      target: 'web',
      cache: false,
      devtool: false,
      entry: {
        'pages/sub1/index': path.join(fixtureDir, 'pages/sub1/index.js'),
        'pages/sub2/index': path.join(fixtureDir, 'pages/sub2/index.js'),
        'pages/sub3/index': path.join(fixtureDir, 'pages/sub3/index.js'),
      },
      output: {
        path: path.join(fixtureDir, 'output'),
        filename: '[name].js',
        chunkFilename: '[name].js',
      },
      optimization: {
        minimize: false,
        splitChunks: {
          chunks: 'all',
          minSize: 0,
          cacheGroups: {
            common: { chunks: 'all', minChunks: 2, name: 'common' },
          },
        },
      },
      module: {
        rules: [{
          test: /\.css$/,
          use: [MiniCssExtractPlugin.loader, runnerRequire.resolve('css-loader')],
        }],
      },
      plugins: [new MiniCssExtractPlugin({ filename: '[name].wxss' })],
    })
    compiler.outputFileSystem = createFsFromVolume(new Volume())

    const filesConfig: any = { app: { content: { ...appConfig } } }
    const miniPlugin: any = {
      appConfig,
      appEntry: path.join(fixtureDir, 'app.js'),
      filesConfig,
      options: {
        sourceDir: fixtureDir,
        fileType: { style: '.wxss', templ: '.wxml', config: '.json' },
        combination: { config: {} },
      },
      hooks: { afterGenerateFiles: new SyncHook(['compilation']) },
      getConfigFilePath: () => path.join(fixtureDir, 'app.json'),
      getConfigPath: () => 'app.json',
    }

    const plugin = new AsyncSubPackagePlugin(miniPlugin)
    plugin.updateAsyncRules(createRules(options.maxSize))
    plugin.updateAsyncRuntimeRoots([
      { sourceRoot: '', asyncRoot: 'pages/sub1-async' },
      { sourceRoot: '', asyncRoot: 'pages/sub2-async' },
      { sourceRoot: '', asyncRoot: 'pages/sub3-async' },
      { sourceRoot: '', asyncRoot: 'pages/shared-async' },
      { sourceRoot: '', asyncRoot: 'pages/shared-async-2' },
    ])
    plugin.apply(compiler)

    compiler.run((error, stats) => {
      if (error) return reject(error)
      const errors = stats.hasErrors()
        ? stats.toJson({ all: false, errors: true }).errors!.map(item => item.message)
        : []
      const assets: Record<string, string> = {}
      for (const asset of stats.compilation.getAssets()) {
        assets[asset.name] = compiler.outputFileSystem.readFileSync(
          path.join(fixtureDir, 'output', asset.name),
          'utf-8'
        )
      }
      miniPlugin.hooks.afterGenerateFiles.call(stats.compilation)
      const appJson = JSON.parse(filesConfig.app.content ? JSON.stringify(filesConfig.app.content) : '{}')
      compiler.close(closeError => closeError ? reject(closeError) : resolve({ assets, errors, appJson }))
    })
  })
}

describe('async subpackage rules mode', () => {
  test('私有 chunk 进各自 asyncRoot，共享 chunk 进 shared-async', async () => {
    const { assets, errors } = await compile({ maxSize: 1_000_000 })
    expect(errors).toEqual([])

    expect(Object.keys(assets).some(name => /^pages\/sub1-async\/async-/.test(name))).toBe(true)
    expect(Object.keys(assets).some(name => /^pages\/sub2-async\/async-/.test(name))).toBe(true)
    expect(Object.keys(assets).some(name => /^pages\/sub3-async\/async-/.test(name))).toBe(true)
    expect(Object.keys(assets).some(name => /^pages\/shared-async\/async-/.test(name))).toBe(true)
    expect(Object.keys(assets).some(name => /^pages\/shared-async-2\//.test(name))).toBe(false)

    expect(assets['pages/sub1/index.wxss']).toContain('.only1')
    expect(assets['pages/sub1/index.wxss']).toContain('.shared-a')
    expect(assets['pages/sub1/index.wxss']).toContain('.shared-b')
    expect(assets['pages/sub2/index.wxss']).toContain('.only2')
    expect(assets['pages/sub2/index.wxss']).toContain('.shared-a')
    expect(assets['pages/sub3/index.wxss']).toContain('.only3')
    expect(assets['pages/sub3/index.wxss']).toContain('.shared-b')
  }, 60000)

  test('共享 chunk 超过 maxSize 时拆分到第二个物理目标', async () => {
    const { assets, errors } = await compile({ maxSize: 3000 })
    expect(errors).toEqual([])
    expect(Object.keys(assets).some(name => /^pages\/shared-async\/async-/.test(name))).toBe(true)
    expect(Object.keys(assets).some(name => /^pages\/shared-async-2\/async-/.test(name))).toBe(true)
  }, 60000)

  test('只为使用的 asyncRoot 生成占位入口并注册 app.json', async () => {
    const { assets, appJson } = await compile({ maxSize: 1_000_000 })
    expect(assets['pages/sub1-async/index.js']).toBeTruthy()
    expect(assets['pages/sub1-async/index.json']).toBeTruthy()
    expect(assets['pages/sub1-async/index.wxml']).toBeTruthy()
    expect(assets['pages/shared-async/index.js']).toBeTruthy()
    expect(assets['pages/shared-async-2/index.js']).toBeUndefined()

    const roots = (appJson.subPackages || []).map((item: any) => item.root)
    expect(roots).toEqual(expect.arrayContaining([
      'pages/sub1-async',
      'pages/sub2-async',
      'pages/sub3-async',
      'pages/shared-async',
    ]))
    expect(roots).not.toContain('pages/shared-async-2')
  }, 60000)

  test('共享 chunk 超过 maxSize 且无法拆分时报错', async () => {
    const { errors } = await compile({ maxSize: 100 })
    expect(errors.join('\n')).toMatch(/超过 maxSize/)
  }, 60000)
})
```

- [ ] **Step 3: 运行测试确认失败**

```bash
pnpm --filter @tarojs/webpack5-runner exec vitest run tests/async-subpackage-rules-compile.spec.ts
```

期望：FAIL，`plugin.updateAsyncRules is not a function`。

- [ ] **Step 4: 增加规则字段与开关**

在 `AsyncSubPackagePlugin.ts` 顶部导入：

```ts
import { allocateAsyncChunks, resolveAsyncSubPackageRule } from '../utils/asyncSubPackageRules'

import type { NormalizedAsyncSubPackageRule } from '../utils/asyncSubPackageRules'
```

类字段增加：

```ts
  asyncRules: NormalizedAsyncSubPackageRule[] = []
  private usedAsyncRoots = new Set<string>()
  private asyncChunkConsumers = new Map<string, string[]>()
```

删除旧的 `private asyncChunkSourceRoots = new Map<string, Set<string>>()`。

新增方法：

```ts
  updateAsyncRules (rules: NormalizedAsyncSubPackageRule[]) {
    this.asyncRules = rules.map(rule => ({ ...rule, matchedPages: [...rule.matchedPages] }))
  }

  private isEnabled (): boolean {
    return this.asyncRootMap.size > 0 || this.asyncRules.length > 0
  }

  private getConfiguredAsyncRoots (): string[] {
    const roots = new Set<string>()
    for (const root of this.asyncRootMap.values()) roots.add(root)
    for (const rule of this.asyncRules) {
      for (const root of rule.asyncRoots) roots.add(root)
    }
    return Array.from(roots)
  }
```

把 `apply` 中 compilation 重置块改为：

```ts
      compiler.hooks.compilation.tap(PLUGIN_NAME, () => {
        this.asyncModuleCache = new WeakMap()
        this.asyncModuleSourceRootCache = new WeakMap()
        this.asyncChunkRootCache = new WeakMap()
        this.usedAsyncRoots = new Set()
        this.asyncChunkConsumers = new Map()
      })
```

把所有 `this.asyncRootMap.size === 0` 判断替换为 `!this.isEnabled()`。

- [ ] **Step 5: 改造 splitChunks**

把 `(cacheGroups as any).asyncSubPackage = {...}` 替换为：

```ts
    (cacheGroups as any).asyncSubPackage = {
      chunks: 'async',
      minChunks: 2,
      minSize: 0,
      priority: 20,
      enforce: true,
      name: (_module: any, chunks: any[]) => {
        if (this.asyncRules.length > 0) {
          const key = chunks
            .map(chunk => chunk?.name || String(chunk?.id ?? chunk?.debugId ?? 'chunk'))
            .sort()
            .join('~')
          return `taro-async-shared-${key.replace(/[^a-zA-Z0-9_~-]/g, '_')}`
        }
        const asyncRoot = getAsyncRootFromChunks(chunks, this.asyncRootMap)
        if (!asyncRoot) return false
        return createAsyncSplitChunkName(asyncRoot, chunks)
      },
      test: (module: any, context: any) => this.isAsyncSubPackageModule(module, context),
    }
```

把 `isAsyncSubPackageModule` 与 `isPureAsyncSubPackageModule` 替换为：

```ts
  private isAsyncSubPackageModule (module: any, context: any): boolean {
    if (!this.isEnabled()) return false
    if (!isJavaScriptModule(module)) return false
    if (this.asyncRules.length > 0) return this.isPureAsyncModule(module, context)
    const asyncRoot = this.getCachedAsyncRootForModule(module, context)
    return Boolean(asyncRoot)
  }

  private isPureAsyncModule (module: any, context: any): boolean {
    const chunks = Array.from(context?.chunkGraph?.getModuleChunksIterable?.(module) || [])
    if (chunks.length === 0) return false
    return chunks.every((chunk: any) => !chunk.canBeInitial?.())
  }

  private isPureAsyncSubPackageModule (module: any, context: any): boolean {
    if (!this.isAsyncSubPackageModule(module, context)) return false
    return this.isPureAsyncModule(module, context)
  }
```

- [ ] **Step 6: 规则模式 chunk 归属与预算**

在 `setupAsyncChunkOptimization` 的 `optimizeChunks` 回调开头插入：

```ts
        if (this.asyncRules.length > 0) {
          this.assignAsyncChunksByRules(compilation, chunks)
          return
        }
```

把原 legacy 分支里的 `this.asyncChunkSourceRoots.set(...)` 改为：

```ts
            this.usedAsyncRoots.add(asyncRoot)
            this.asyncChunkConsumers.set(
              asyncChunkName,
              Array.from(sourceRoots).map(root => `${root}/index`)
            )
```

新增方法：

```ts
  private getChunkKey (chunk: any): string {
    return chunk?.name || String(chunk?.id ?? chunk?.debugId ?? 'chunk')
  }

  private getChunkSize (chunk: any, chunkGraph: any): number {
    let size = 0
    for (const module of chunkGraph.getChunkModulesIterable(chunk)) {
      if (typeof module.size === 'function') size += module.size() || 0
    }
    return size
  }

  private getDeclaredPageSet (): Set<string> {
    const appConfig: any = this.miniPlugin.appConfig || {}
    const pages = new Set<string>(appConfig.pages || [])
    for (const subPackage of (appConfig.subPackages || appConfig.subpackages || [])) {
      for (const page of (subPackage.pages || [])) {
        pages.add(`${subPackage.root}/${page}`.replace(/\/{2,}/g, '/'))
      }
    }
    return pages
  }

  private getPageEntryModules (compilation: any): Map<any, string> {
    const declared = this.getDeclaredPageSet()
    const result = new Map<any, string>()
    for (const chunk of compilation.chunks) {
      if (!chunk.name || !declared.has(chunk.name)) continue
      if (!chunk.canBeInitial?.()) continue
      for (const module of compilation.chunkGraph.getChunkEntryModulesIterable(chunk)) {
        result.set(module, chunk.name)
      }
    }
    return result
  }

  private getPagePathsFromModule (
    module: any,
    moduleGraph: any,
    pageEntryModules: Map<any, string>,
    cache: WeakMap<any, Set<string>>,
    visiting: Set<any> = new Set()
  ): Set<string> {
    if (!module) return new Set()
    const cached = cache.get(module)
    if (cached) return cached
    const direct = pageEntryModules.get(module)
    if (direct) {
      const set = new Set([direct])
      cache.set(module, set)
      return set
    }
    if (visiting.has(module)) return new Set()
    visiting.add(module)
    const result = new Set<string>()
    const connections = moduleGraph.getIncomingConnections?.(module)
    if (connections) {
      for (const connection of connections) {
        const origin = connection?.originModule
        if (!origin) continue
        for (const page of this.getPagePathsFromModule(origin, moduleGraph, pageEntryModules, cache, visiting)) {
          result.add(page)
        }
      }
    }
    visiting.delete(module)
    cache.set(module, result)
    return result
  }

  private getConsumerPagesForChunk (
    chunk: any,
    compilation: any,
    pageEntryModules: Map<any, string>,
    cache: WeakMap<any, Set<string>>
  ): string[] {
    const pages = new Set<string>()
    const origins = new Set<any>()
    for (const group of chunk.groupsIterable || []) {
      for (const origin of group.origins || []) {
        if (origin?.module) origins.add(origin.module)
        if (origin?.originModule) origins.add(origin.originModule)
      }
    }
    for (const origin of origins) {
      for (const page of this.getPagePathsFromModule(origin, compilation.moduleGraph, pageEntryModules, cache)) {
        pages.add(page)
      }
    }
    if (pages.size === 0) {
      for (const module of compilation.chunkGraph.getChunkModulesIterable(chunk)) {
        for (const page of this.getPagePathsFromModule(module, compilation.moduleGraph, pageEntryModules, cache)) {
          pages.add(page)
        }
      }
    }
    return Array.from(pages).sort()
  }

  private assignAsyncChunksByRules (compilation: any, chunks: Iterable<any>) {
    const pageEntryModules = this.getPageEntryModules(compilation)
    const pageCache = new WeakMap<any, Set<string>>()
    const pending: Array<{ chunk: any, rule: NormalizedAsyncSubPackageRule, consumers: string[] }> = []

    for (const chunk of chunks) {
      if (chunk.hasRuntime?.() || chunk.canBeInitial?.()) continue
      const modules = Array.from(compilation.chunkGraph.getChunkModulesIterable(chunk))
      if (!modules.some(isJavaScriptModule)) continue

      const consumers = this.getConsumerPagesForChunk(chunk, compilation, pageEntryModules, pageCache)
      if (consumers.length === 0) continue

      const rule = resolveAsyncSubPackageRule(this.asyncRules, consumers)
      if (!rule) continue

      pending.push({ chunk, rule, consumers })
    }

    const byRule = new Map<NormalizedAsyncSubPackageRule, typeof pending>()
    for (const item of pending) {
      const list = byRule.get(item.rule) || []
      list.push(item)
      byRule.set(item.rule, list)
    }

    for (const [rule, items] of byRule) {
      const allocation = allocateAsyncChunks(
        rule,
        items.map(item => ({
          name: this.getChunkKey(item.chunk),
          size: this.getChunkSize(item.chunk, compilation.chunkGraph),
        }))
      )
      for (const item of items) {
        const asyncRoot = allocation.get(this.getChunkKey(item.chunk))
        if (!asyncRoot) continue
        const asyncChunkName = createAsyncCommonChunkName(asyncRoot, this.getChunkKey(item.chunk))
        item.chunk.name = asyncChunkName
        this.usedAsyncRoots.add(asyncRoot)
        this.asyncChunkConsumers.set(asyncChunkName, item.consumers)
      }
    }
  }
```

- [ ] **Step 7: 样式与模板回填到消费页面**

把 `moveAsyncRootStylesToSourceRoots` 与 `moveAsyncRootTemplatesToSourceRoots` 替换为：

```ts
  private moveAsyncRootTemplatesToConsumers (compilation: any) {
    const templateExt = this.miniPlugin.options.fileType.templ || '.wxml'

    for (const asyncRoot of this.getConfiguredAsyncRoots()) {
      const templateAssets = Object.keys(compilation.assets)
        .filter(assetName => assetName.startsWith(`${asyncRoot}/`) && assetName.endsWith(`-templates${templateExt}`))

      for (const assetName of templateAssets) {
        const templateName = path.posix.basename(assetName)
        const chunkName = `${asyncRoot}/${templateName.slice(0, -`-templates${templateExt}`.length)}`
        const consumers = this.asyncChunkConsumers.get(chunkName)
        if (!consumers?.length) continue

        for (const consumer of consumers) {
          const dir = path.posix.dirname(consumer)
          compilation.assets[`${dir}/${templateName}`] = compilation.assets[assetName]
        }
        delete compilation.assets[assetName]
      }
    }
  }

  private moveAsyncRootStylesToConsumers (compilation: any, RawSource: any) {
    const styleExt = this.miniPlugin.options.fileType.style || '.wxss'
    const styleAssetReg = new RegExp(`\\${styleExt}$`)

    for (const asyncRoot of this.getConfiguredAsyncRoots()) {
      const asyncStyleAssets = Object.keys(compilation.assets)
        .filter(assetName => assetName.startsWith(`${asyncRoot}/`) && styleAssetReg.test(assetName))
      if (asyncStyleAssets.length === 0) continue

      for (const assetName of asyncStyleAssets) {
        const chunkName = assetName.slice(0, -styleExt.length)
        const consumers = this.asyncChunkConsumers.get(chunkName)
        if (!consumers?.length) continue

        const asyncStyle = compilation.assets[assetName]?.source?.().toString() || ''
        for (const consumer of consumers) {
          const targetStyleAsset = `${consumer}${styleExt}`
          const origin = compilation.assets[targetStyleAsset]?.source?.().toString() || ''
          compilation.assets[targetStyleAsset] = new RawSource([origin, asyncStyle].filter(Boolean).join('\n'))
        }
        delete compilation.assets[assetName]
      }
    }
  }
```

在 `setupAsyncChunkAssetExtraction` 中改为调用新方法名：

```ts
          this.moveAsyncRootStylesToConsumers(compilation, RawSource)
          this.moveAsyncRootTemplatesToConsumers(compilation)
```

- [ ] **Step 8: 只为使用的 root 生成入口与注册**

`createAsyncRootEntries` 中把：

```ts
    const uniqueAsyncRoots = new Set(this.asyncRootMap.values())
```

替换为：

```ts
    // 规则模式只生成真正被使用的 asyncRoot；legacy 模式保持“配置即生成”的旧行为。
    const uniqueAsyncRoots = this.asyncRules.length > 0
      ? new Set(this.usedAsyncRoots)
      : new Set(this.asyncRootMap.values())
```

`setupSubPackageRegistration` 中把：

```ts
      const asyncRoots = new Set(this.asyncRootMap.values())
```

替换为：

```ts
      // 规则模式只注册真正被使用的 asyncRoot；legacy 模式保持旧行为。
      const asyncRoots = this.asyncRules.length > 0
        ? new Set(this.usedAsyncRoots)
        : new Set(this.asyncRootMap.values())
```

- [ ] **Step 9: 运行测试确认通过**

```bash
pnpm --filter @tarojs/webpack5-runner exec vitest run tests/async-subpackage-rules-compile.spec.ts
pnpm --filter @tarojs/webpack5-runner exec vitest run tests/async-subpackage-styles.spec.ts
```

期望：两个 spec 均 PASS。

- [ ] **Step 10: 提交**

```bash
git add packages/taro-webpack5-runner/src/plugins/AsyncSubPackagePlugin.ts \
        packages/taro-webpack5-runner/tests/async-subpackage-rules-compile.spec.ts
git commit -m "feat(webpack-runner): AsyncSubPackagePlugin 支持按消费页面归属与预算拆分"
```

---

## Task 5: 共享运行时就绪门与 provider 完成信号

**Files:**
- Create: `packages/taro-webpack5-runner/src/utils/asyncSubPackageRuntime.ts`
- Create: `packages/taro-webpack5-runner/tests/shared-runtime-readiness.spec.ts`
- Modify: `packages/taro-webpack5-runner/src/shared-runtime/entry.sync.js`
- Modify: `packages/taro-webpack5-runner/src/shared-runtime/async-provider.js`
- Modify: `packages/taro-webpack5-runner/src/plugins/AsyncSubPackagePlugin.ts`

**Interfaces:**
- Produces:
  - `interface SharedRuntimeGate { globalObject: string; globalKey: string }`
  - `createSharedRuntimeWaitSource(Template, gate): string[]`
- Consumes:
  - `SHARED_GLOBAL_ASYNC` from `src/shared-runtime/constants.ts`
  - `miniPlugin.options.combination.config.sharedRuntime`
  - `miniPlugin.options.combination.config.output.globalObject`

**背景：** 业务异步 chunk 可能在 `shared-async-v1` 的 `react-dom`/framework/taro 真身 fill 之前执行。`__rtActivated` 在 fill 之前就置位，不能作为完成信号。必须新增 provider 状态，并让业务 `loadScript` 等待。

- [ ] **Step 1: 写失败测试**

创建 `packages/taro-webpack5-runner/tests/shared-runtime-readiness.spec.ts`：

```ts
import fs from 'node:fs'
import path from 'node:path'
import vm from 'node:vm'

import { describe, expect, test } from 'vitest'

import { createSharedRuntimeWaitSource } from '../src/utils/asyncSubPackageRuntime'

const GLOBAL_KEY = '__TARO_RT_ASYNC_V1__'

function loadProvider (globalObject: Record<string, any>) {
  const source = fs
    .readFileSync(path.resolve(__dirname, '../src/shared-runtime/async-provider.js'), 'utf8')
    .replace(/__TARO_GLOBAL_OBJECT__/g, '__wx')
    .replace(/__TARO_SHARED_GLOBAL__/g, JSON.stringify(GLOBAL_KEY))
    .replace(/__TARO_RUNTIME_VERSION__/g, '1')

  const context = vm.createContext({
    __wx: globalObject,
    console,
    Error,
    Object,
    Promise,
    module: { exports: {} },
    require: () => {
      throw new Error('unexpected require in readiness test')
    },
  })
  vm.runInContext(source, context)
  return globalObject[GLOBAL_KEY]
}

describe('shared runtime readiness', () => {
  test('占位对象未就绪时 activate 返回 false', () => {
    const wx: Record<string, any> = {}
    const shared = loadProvider(wx)
    expect(shared.__activateAsync()).toBe(false)
  })

  test('已激活时 activate 幂等返回 true', () => {
    const wx: Record<string, any> = {
      [GLOBAL_KEY]: {
        '@tarojs/runtime': {},
        '@tarojs/taro': {},
        __rtActivated: true,
      },
    }
    const shared = loadProvider(wx)
    expect(shared.__activateAsync()).toBe(true)
  })

  test('版本不一致时抛出明确错误', () => {
    const wx: Record<string, any> = {
      [GLOBAL_KEY]: {
        '@tarojs/runtime': {},
        '@tarojs/taro': {},
        __rtVersion: 0,
      },
    }
    const shared = loadProvider(wx)
    expect(() => shared.__activateAsync()).toThrow(/版本不一致/)
  })

  test('就绪门源码包含 pending / error / waiter 三个分支', () => {
    const Template = {
      indent: (value: string | string[]) =>
        Array.isArray(value) ? value.map(line => `  ${line}`) : `  ${value}`,
    }
    const source = createSharedRuntimeWaitSource(Template, {
      globalObject: 'wx',
      globalKey: GLOBAL_KEY,
    }).join('\n')

    expect(source).toContain(`wx[${JSON.stringify(GLOBAL_KEY)}]`)
    expect(source).toContain('__rtProviderState')
    expect(source).toContain('__rtProviderWaiters')
    expect(source).toContain('Promise.reject')
    expect(source).toContain('Promise.resolve')
  })
})
```

- [ ] **Step 2: 运行测试确认失败**

```bash
export PATH="$HOME/.volta/bin:$PATH"
pnpm --filter @tarojs/webpack5-runner exec vitest run tests/shared-runtime-readiness.spec.ts
```

期望：FAIL（`asyncSubPackageRuntime` 模块不存在）。

- [ ] **Step 3: 新增就绪门源码生成器**

创建 `packages/taro-webpack5-runner/src/utils/asyncSubPackageRuntime.ts`：

```ts
export interface SharedRuntimeGate {
  globalObject: string
  globalKey: string
}

/**
 * 生成业务异步 chunk 的共享运行时就绪门。
 *
 * 仅在 sharedRuntime 开启时注入；未开启时 AsyncSubPackagePlugin 不调用本函数，
 * 产物与旧版本保持一致。
 *
 * 状态机：
 *   - 没有 shared / 没有 __rtProviderState / ready → 立即 resolve
 *   - error → reject，错误向上传播，绝不挂起
 *   - pending → 进入 __rtProviderWaiters，由 entry.sync.js 的 __rtProviderSettle 统一 flush
 */
export function createSharedRuntimeWaitSource (Template: any, gate: SharedRuntimeGate): string[] {
  const globalRef = `${gate.globalObject}[${JSON.stringify(gate.globalKey)}]`

  return [
    'var waitSharedRuntime = function() {',
    Template.indent([
      `var shared = ${globalRef};`,
      'if (!shared || !shared.__rtProviderState || shared.__rtProviderState === "ready") return Promise.resolve();',
      'if (shared.__rtProviderState === "error") return Promise.reject(shared.__rtProviderError || new Error("[taro-shared] shared runtime provider failed to activate"));',
      'return new Promise(function(resolve, reject) {',
      Template.indent([
        '(shared.__rtProviderWaiters || (shared.__rtProviderWaiters = [])).push({ resolve: resolve, reject: reject });'
      ]),
      '});'
    ]),
    '};'
  ]
}
```

- [ ] **Step 4: 在 AsyncSubPackagePlugin 注入就绪门**

在 `packages/taro-webpack5-runner/src/plugins/AsyncSubPackagePlugin.ts` 顶部加入：

```ts
import { SHARED_GLOBAL_ASYNC } from '../shared-runtime/constants'
import { createSharedRuntimeWaitSource } from '../utils/asyncSubPackageRuntime'

import type { SharedRuntimeGate } from '../utils/asyncSubPackageRuntime'
```

把 `createRequireAsyncLoaderRuntimeSource` 整体替换为：

```ts
function createRequireAsyncLoaderRuntimeSource (
  Template: any,
  loadScript: string,
  sharedRuntimeGate?: SharedRuntimeGate | null
) {
  const waitSource = sharedRuntimeGate
    ? createSharedRuntimeWaitSource(Template, sharedRuntimeGate)
    : []
  const loadThenSource = sharedRuntimeGate
    ? [
        'require.async(request).then(function() {',
        Template.indent('return waitSharedRuntime();'),
        '}).then(function() {',
        Template.indent('finish({ type: "load", target: { src: request } });'),
        '}, function(error) {',
        Template.indent('finish({ type: "error", target: { src: request }, error: error });'),
        '});'
      ]
    : [
        'require.async(request).then(function() {',
        Template.indent('finish({ type: "load", target: { src: request } });'),
        '}, function(error) {',
        Template.indent('finish({ type: "error", target: { src: request }, error: error });'),
        '});'
      ]

  return [
    ...waitSource,
    'var asyncSubPackageInProgress = {};',
    `${loadScript} = function(url, done) {`,
    Template.indent([
      'var rawUrl = (url || "").replace(/^\\/+/, "").replace(/\\.js$/, "");',
      'var request = resolveAsyncSubPackageRequest(rawUrl);',
      'if (asyncSubPackageInProgress[request]) { asyncSubPackageInProgress[request].push(done); return; }',
      'asyncSubPackageInProgress[request] = [done];',
      'var finish = function(event) {',
      Template.indent([
        'var handlers = asyncSubPackageInProgress[request];',
        'delete asyncSubPackageInProgress[request];',
        'handlers && handlers.forEach(function(handler) { handler(event); });'
      ]),
      '};',
      ...loadThenSource
    ]),
    '};'
  ]
}
```

把 `createMiniAsyncSubPackageRuntimeSource` 改为：

```ts
function createMiniAsyncSubPackageRuntimeSource (
  Template: any,
  runtimeGlobals: { loadScript: string, ensureChunkHandlers: string, getChunkScriptFilename: string, publicPath: string },
  asyncRootEntries: AsyncSubPackageRuntimeRoot[],
  sharedRuntimeGate?: SharedRuntimeGate | null
) {
  const { loadScript, ensureChunkHandlers, getChunkScriptFilename, publicPath } = runtimeGlobals
  const asyncRootRuntimeEntries = createNormalizedRuntimeRootEntries(asyncRootEntries)

  return Template.asString([
    `${publicPath} = "";`,
    `var asyncSubPackageRootEntries = ${JSON.stringify(asyncRootRuntimeEntries)};`,
    ...createChunkFilenameRuntimeSource(Template, getChunkScriptFilename),
    ...createRequestResolverRuntimeSource(Template),
    ...createRequireAsyncLoaderRuntimeSource(Template, loadScript, sharedRuntimeGate),
    ...createMiniCssRuntimeSource(Template, ensureChunkHandlers)
  ])
}
```

把 `createMiniAsyncSubPackageRuntimeModuleClass` 改为：

```ts
function createMiniAsyncSubPackageRuntimeModuleClass (
  webpack: any,
  Template: any,
  runtimeGlobals: AsyncSubPackageRuntimeGlobals,
  sharedRuntimeGate?: SharedRuntimeGate | null
) {
  const RuntimeModule = webpack.RuntimeModule
  const stageAttach = RuntimeModule.STAGE_ATTACH || 10

  return class MiniAsyncSubPackageRuntimeModule extends RuntimeModule {
    private readonly asyncRootEntries: AsyncSubPackageRuntimeRoot[]

    constructor (asyncRootEntries: AsyncSubPackageRuntimeRoot[]) {
      super('mini async subpackage chunk loader', stageAttach)
      this.asyncRootEntries = asyncRootEntries
    }

    generate () {
      return createMiniAsyncSubPackageRuntimeSource(
        Template,
        runtimeGlobals,
        this.asyncRootEntries,
        sharedRuntimeGate
      )
    }
  }
}
```

在 `setupAsyncChunkRuntime` 中，构造 runtime module 前加入：

```ts
    const sharedRuntimeGate: SharedRuntimeGate | null = this.miniPlugin.options.combination.config.sharedRuntime
      ? {
          globalObject: this.miniPlugin.options.combination.config.output?.globalObject || 'wx',
          globalKey: SHARED_GLOBAL_ASYNC,
        }
      : null
```

并把 `createMiniAsyncSubPackageRuntimeModuleClass(...)` 调用改为：

```ts
    const MiniAsyncSubPackageRuntimeModule = createMiniAsyncSubPackageRuntimeModuleClass(
      webpack,
      Template,
      { loadScript, ensureChunkHandlers, getChunkScriptFilename, publicPath },
      sharedRuntimeGate
    )
```

- [ ] **Step 5: 修改 entry.sync.js 初始化并 settle 状态**

在 `packages/taro-webpack5-runner/src/shared-runtime/entry.sync.js` 的 `if (!shared.__syncCoreInstalled) {` 块内，`shared.__rtVersion = __TARO_RUNTIME_VERSION__` 之后加入：

```js
  // provider 就绪信号：业务异步 chunk 的 loadScript 会等待该状态，避免在
  // react-dom/framework/taro 真身 fill 之前执行依赖它们的模块。
  // 不使用 __rtActivated：它在 fill 之前就置位，不能代表“真身已就绪”。
  shared.__rtProviderState = 'pending'
  shared.__rtProviderWaiters = []
  shared.__rtProviderSettle = function (ok, error) {
    if (shared.__rtProviderState !== 'pending') return
    shared.__rtProviderState = ok ? 'ready' : 'error'
    if (!ok) {
      shared.__rtProviderError = error || new Error('[taro-shared] shared runtime provider failed to activate')
    }
    var waiters = shared.__rtProviderWaiters || []
    shared.__rtProviderWaiters = []
    for (var i = 0; i < waiters.length; i++) {
      if (ok) waiters[i].resolve()
      else waiters[i].reject(shared.__rtProviderError)
    }
  }
```

把文件末尾的 `require(__TARO_SHARED_ASYNC_REQUEST__).then(...).catch(...)` 整段替换为：

```js
  require(__TARO_SHARED_ASYNC_REQUEST__).then(function () {
    if (typeof shared.__activateAsync !== 'function') {
      var missingError = new Error('[taro-shared] shared-async 已加载但 __activateAsync 缺失')
      console.error(missingError.message)
      shared.__rtProviderSettle(false, missingError)
      return
    }
    var activated = shared.__activateAsync()
    if (activated === false) {
      shared.__rtProviderSettle(false, new Error('[taro-shared] shared-async 激活时占位对象未就绪'))
      return
    }
    shared.__rtProviderSettle(true)
  }).catch(function (e) {
    console.error('[taro-shared] require.async shared-async 失败 >>>', (e && e.errMsg) || (e && e.message) || e)
    shared.__rtProviderSettle(false, e)
  })
```

- [ ] **Step 6: 修改 async-provider.js 返回完成状态**

在 `packages/taro-webpack5-runner/src/shared-runtime/async-provider.js` 中：

1. 占位未就绪的早退改为：

```js
  if (!shared['@tarojs/runtime'] || !shared['@tarojs/taro']) {
    return false
  }
```

2. 已激活的幂等早退改为：

```js
  if (shared.__rtActivated) return true
```

3. 在 `activate()` 函数末尾（最后一个 `if (typeof shared.__flushNativeCompQueue === 'function') { ... }` 之后、函数闭合 `}` 之前）加入：

```js
  return true
```

- [ ] **Step 7: 运行测试确认通过**

```bash
export PATH="$HOME/.volta/bin:$PATH"
pnpm --filter @tarojs/webpack5-runner exec vitest run tests/shared-runtime-readiness.spec.ts
pnpm --filter @tarojs/webpack5-runner exec vitest run tests/app-shim.spec.ts
pnpm --filter @tarojs/webpack5-runner exec vitest run tests/react-dom-client-placeholder.spec.ts
pnpm --filter @tarojs/webpack5-runner exec vitest run tests/subpackage-indie-shared-runtime.spec.ts
```

期望：全部 PASS。

- [ ] **Step 9: async-only 模式修正共享运行时 require.async 默认路径**

背景：`getAsyncRequest` 默认返回 `shared-async-v1/index`（无 `./` 前缀）。async-only 模式下同步核
`taro-shared-sync.js` 留在业务包根目录，与 `shared-async-v1/` 同级，微信 `require.async` 需要显式
相对路径；indie 模式下同步核被拷进 `mainPackageRoot`，默认值保持现状由接入方覆盖。

修改 `packages/taro-webpack5-runner/src/shared-runtime/build-shared-runtime.ts`：

1. `getAsyncRequest(config, asyncOnly: boolean)`：
   - `config.sharedRuntimeAsyncRequest` 为非空字符串时原样返回；
   - `asyncOnly === true` 时返回 `` `./${SHARED_ASYNC_ROOT}/index` ``；
   - 否则保持 `` `${SHARED_ASYNC_ROOT}/index` ``。
2. 调用点：

```ts
const asyncOnly =
  !!combination.subPackageIndiePlugin &&
  combination.subPackageIndiePlugin.getAllMainPackageRoots().length === 0
const asyncRequest = getAsyncRequest(config, asyncOnly)
```

3. 导出 `getAsyncRequest` 供测试使用。

在 `packages/taro-webpack5-runner/tests/shared-runtime-readiness.spec.ts` 增加用例：

```ts
import { getAsyncRequest } from '../src/shared-runtime/build-shared-runtime'

test('async-only 模式 require.async 使用同级相对路径', () => {
  expect(getAsyncRequest({}, true)).toBe('./shared-async-v1/index')
})

test('indie 模式保持原有默认值', () => {
  expect(getAsyncRequest({}, false)).toBe('shared-async-v1/index')
})
```

运行：

```bash
export PATH="$HOME/.volta/bin:$PATH"
cd <TARO_ROOT>/taro-weapp-runtime-union
pnpm --filter @tarojs/webpack5-runner exec vitest run tests/shared-runtime-readiness.spec.ts
```

- [ ] **Step 8: 提交**

```bash
git add packages/taro-webpack5-runner/src/utils/asyncSubPackageRuntime.ts \
        packages/taro-webpack5-runner/src/shared-runtime/entry.sync.js \
        packages/taro-webpack5-runner/src/shared-runtime/async-provider.js \
        packages/taro-webpack5-runner/src/plugins/AsyncSubPackagePlugin.ts \
        packages/taro-webpack5-runner/tests/shared-runtime-readiness.spec.ts
git commit -m "feat(webpack-runner): 业务异步 chunk 等待共享运行时 provider 就绪"
```

---

## Task 6: 构建框架并跑定向回归

**Files:**
- 无源码修改；验证 Task 1–5。

- [ ] **Step 1: 跑新增与相关单测**

```bash
export PATH="$HOME/.volta/bin:$PATH"
cd <TARO_ROOT>/taro-weapp-runtime-union
pnpm --filter @tarojs/webpack5-runner exec vitest run \
  tests/async-subpackage-rules.spec.ts \
  tests/subpackage-indie-async-only.spec.ts \
  tests/mini-plugin-async-only-pages.spec.ts \
  tests/async-subpackage-rules-compile.spec.ts \
  tests/shared-runtime-readiness.spec.ts \
  tests/async-subpackage-styles.spec.ts \
  tests/subpackage-indie-shared-runtime.spec.ts
```

期望：全部 PASS。若失败，先修实现，不要进入 demo 阶段。

- [ ] **Step 2: 跑 webpack5-runner 全量单测**

```bash
pnpm --filter @tarojs/webpack5-runner test
```

期望：全部 PASS。若仓库基线存在与本任务无关的失败，记录失败用例并与基线对比，不得把新增失败带入下一步。

- [ ] **Step 3: 构建 runner**

```bash
pnpm --filter @tarojs/webpack5-runner build
```

期望：`packages/taro-webpack5-runner/dist` 生成成功，且包含：

```bash
test -f packages/taro-webpack5-runner/dist/utils/asyncSubPackageRules.js
test -f packages/taro-webpack5-runner/dist/utils/asyncSubPackageRuntime.js
test -f packages/taro-webpack5-runner/dist/plugins/AsyncSubPackagePlugin.js
```

- [ ] **Step 4: 记录构建产物指纹**

```bash
git status --short
git log --oneline -6
```

把 commit 列表与 `dist` 是否被 git 忽略记录到最终报告。`dist` 不提交。

---

## Task 7: Demo 迁移为 async-only 页面模式

**Repo:** `<TARO_ROOT>/Example/taro-blended-project`
**Branch:** `feat/async-subpackage-demo`

**Files:**
- Modify: `src/app.config.js`
- Modify: `src/pages/sub1/index.config.js`
- Modify: `src/pages/sub2/index.config.js`
- Modify: `src/pages/sub1/index.jsx`
- Modify: `src/pages/sub2/index.jsx`
- Modify: `plugin-mv/index.js`
- Modify: `config/index.js`

**关键语义：** `sub1`、`sub2` 不再是 `component: true` 的独立组件，而是 `app.config.subPackages` 声明的真实页面。`pages/index/index` 不再作为业务入口，保留在磁盘上但不再声明。`sub3` 同理保留但不声明。

- [ ] **Step 0: 打开共享运行时开关**

在 `config/index.js` 的 `mini` 配置中增加：

```js
    sharedRuntime: true,
```

原因：async-only 的产物结构（业务包根 `app.js` + `taro-shared-sync.js` + `shared-async-v1/`）必须
和共享运行时就绪门一起验证；不开启时 `taro-shared-sync.js` 不会产出，Task 5 的就绪门在 demo 中
等于未覆盖。`sharedRuntimeAsyncRequest` 不需要配置——框架在 async-only 模式下默认使用
`./shared-async-v1/index`。

- [ ] **Step 1: 改写 app.config.js**

把 `src/app.config.js` 整体替换为：

```js
const isComp = process.env.BUILD_MODE === 'comp'

const pages = isComp ? ['pages/comp-case/index'] : []
const components = isComp ? ['pages/comp-case/index'] : []
const subPackages = isComp
  ? []
  : [
      { root: 'pages/sub1', pages: ['index'] },
      { root: 'pages/sub2', pages: ['index'] },
    ]

const subPackageIndie = isComp
  ? undefined
  : [
      {
        // 省略 mainPackageRoot：进入 async-only 模式。
        // subPackageRoots 的语义从“独立组件根”切换为“异步归属规则”。
        subPackageRoots: [
          {
            path: 'pages/sub1/index',
            asyncSubPackage: { asyncRoot: 'pages/sub1-async' },
          },
          {
            path: 'pages/sub2/index',
            asyncSubPackage: { asyncRoot: 'pages/sub2-async' },
          },
          {
            // 同时消费 sub1 + sub2 的模块进入共享异步分包。
            // 两个物理目标必须显式给 maxSize，超限时继续拆到 shared-async-2。
            path: /^pages\/sub\d+\/index$/,
            asyncSubPackage: {
              asyncRoot: ['pages/shared-async', 'pages/shared-async-2'],
              maxSize: 1_500_000,
            },
          },
        ],
      },
    ]

const appConfig = {
  pages,
  components,
  subPackages,
  subPackageIndie,
}

export default appConfig
```

- [ ] **Step 2: 去掉 sub1/sub2 的 component 配置**

把 `src/pages/sub1/index.config.js` 整体替换为：

```js
export default {
  forceCustomWrapper: true,
}
```

把 `src/pages/sub2/index.config.js` 整体替换为：

```js
export default {
  forceCustomWrapper: true,
}
```

删除 `component: true`、`usingComponents`、`componentPlaceholder`。`comp-case` 跨包引用不再需要，因为 sub1 已经是页面。

- [ ] **Step 3: sub1 改为路由参数取标题**

在 `src/pages/sub1/index.jsx`：

1. 从 `@tarojs/taro` 的 import 中加入 `useRouter`：

```js
import {
  useDidHide,
  useDidShow,
  useLoad,
  useReady,
  useRouter,
  useUnload,
} from '@tarojs/taro'
```

2. 组件签名去掉 `props`：

```js
export default function Sub1List() {
```

3. 在组件内 state 声明之后加入：

```js
  const router = useRouter()
  const pageTitle = router.params?.name || '订单列表 (Sub1)'
```

4. 把 `title={props.name || '订单列表 (Sub1 子分包组件)'}` 改为：

```jsx
      title={pageTitle}
```

- [ ] **Step 4: sub2 改为路由参数取标题**

在 `src/pages/sub2/index.jsx`：

1. 从 `@tarojs/taro` 的 import 中加入 `useRouter`：

```js
import {
  useDidHide,
  useDidShow,
  useLoad,
  useReady,
  useRouter,
  useUnload,
} from '@tarojs/taro'
```

2. 组件签名改为：

```js
export default function Sub2Detail() {
```

3. 在组件内 state 声明之后加入：

```js
  const router = useRouter()
  const pageTitle = router.params?.name || '订单详情 (Sub2)'
```

4. 把 `title={props.name || '订单详情 (Sub2 子分包组件)'}` 改为：

```jsx
      title={pageTitle}
```

- [ ] **Step 5: mv 插件只清理自己拥有的 root**

把 `plugin-mv/index.js` 整体替换为：

```js
const fs = require('fs-extra')
const path = require('path')
const isComp = process.env.BUILD_MODE === 'comp'

const MANIFEST_NAME = '.taro-mv-manifest.json'

function readJson(filePath) {
  if (!fs.existsSync(filePath)) return null
  try {
    return fs.readJsonSync(filePath)
  } catch (error) {
    console.warn(`[plugin-mv] 读取 JSON 失败：${filePath}`, error)
    return null
  }
}

function getSubPackages(appConfig) {
  return appConfig?.subPackages || appConfig?.subpackages || []
}

function isOwnedRoot(root, packageRoot) {
  return root === packageRoot || root.startsWith(`${packageRoot}/`)
}

function syncHostSubPackages(
  miniappPath,
  packageRoot,
  copiedAppConfigPath,
  previousRoots,
) {
  const hostAppConfigPath = path.join(miniappPath, 'app.json')
  const hostAppConfig = readJson(hostAppConfigPath)
  const copiedAppConfig = readJson(copiedAppConfigPath)
  if (!hostAppConfig || !copiedAppConfig) return []

  const copiedSubPackages = getSubPackages(copiedAppConfig)
  const hostSubPackages = getSubPackages(hostAppConfig)
  const ownedRoots = new Set(previousRoots || [])
  for (const subPackage of hostSubPackages) {
    if (isOwnedRoot(subPackage.root, packageRoot)) {
      ownedRoots.add(subPackage.root)
    }
  }

  // 只清理本插件拥有的 root：目录已不存在（例如本次不再生成 shared-async-2）
  // 就从宿主 app.json 移除，避免留下指向空目录的注册。
  const nextSubPackages = hostSubPackages.filter((subPackage) => {
    if (!ownedRoots.has(subPackage.root)) return true
    return fs.existsSync(path.join(miniappPath, subPackage.root))
  })

  const hostSubPackageMap = new Map(
    nextSubPackages.map((item) => [item.root, item]),
  )

  for (const subPackage of copiedSubPackages) {
    const root = path.posix.join(packageRoot, subPackage.root)
    const next = {
      ...subPackage,
      root,
    }
    const current = hostSubPackageMap.get(root)
    if (current) {
      Object.assign(current, next)
    } else {
      nextSubPackages.push(next)
      hostSubPackageMap.set(root, next)
    }
  }

  if (hostAppConfig.subPackages) {
    hostAppConfig.subPackages = nextSubPackages
  } else {
    hostAppConfig.subpackages = nextSubPackages
  }
  fs.writeJsonSync(hostAppConfigPath, hostAppConfig, { spaces: 2 })

  return copiedSubPackages.map((subPackage) =>
    path.posix.join(packageRoot, subPackage.root),
  )
}

export default (ctx) => {
  ctx.onBuildFinish(() => {
    console.log('编译结束！')

    const rootPath = path.resolve(__dirname, '../..')
    const miniappPath = path.join(rootPath, 'miniapp-blended-project')
    const outputPath = path.resolve(__dirname, '../dist')
    const packageRoot = isComp ? 'pages/comp-case' : 'pages/order'
    const orderPath = path.join(miniappPath, packageRoot)
    const manifestPath = path.join(orderPath, MANIFEST_NAME)

    if (!fs.existsSync(outputPath)) return

    const previousManifest = readJson(manifestPath)
    const previousRoots = previousManifest?.roots || []

    // packageRoot 整体归业务包所有；先读 manifest，再清空，避免旧 root 残留。
    fs.emptyDirSync(orderPath)
    fs.copySync(outputPath, orderPath, { overwrite: true })

    const roots = syncHostSubPackages(
      miniappPath,
      packageRoot,
      path.join(orderPath, 'app.json'),
      previousRoots,
    )
    fs.writeJsonSync(manifestPath, { packageRoot, roots }, { spaces: 2 })

    console.log('orderPath, srcOrderPath :>> ', orderPath, outputPath)
    console.log('拷贝结束！')
  })
}
```

- [ ] **Step 6: 提交 demo 源码**

```bash
cd <TARO_ROOT>/Example/taro-blended-project
git add src/app.config.js \
        src/pages/sub1/index.config.js src/pages/sub1/index.jsx \
        src/pages/sub2/index.config.js src/pages/sub2/index.jsx \
        plugin-mv/index.js
git commit -m "feat(demo): sub1/sub2 改为 async-only 页面并验证预算拆分"
```

不要提交 `dist-indie/`、`dist-native/`、`dist-order/`。

---

## Task 8: 把本地 runner 接到 demo 并构建

**Repo:** `<TARO_ROOT>/Example/taro-blended-project`

**背景：** demo 的 `node_modules/@tarojs/*` 是真实目录，不是 workspace symlink。需要把 Task 6 构建出的 runner `dist` 覆盖进去。覆盖前先备份到 `/tmp`，便于回滚。

- [ ] **Step 1: 备份 demo 现有 runner**

```bash
export PATH="$HOME/.volta/bin:$PATH"
cd <TARO_ROOT>/Example/taro-blended-project
BACKUP_DIR="/tmp/taro-webpack5-runner-backup-$(date +%Y%m%d%H%M%S)"
mkdir -p "$BACKUP_DIR"
cp -R node_modules/@tarojs/webpack5-runner/. "$BACKUP_DIR/"
echo "$BACKUP_DIR" > /tmp/taro-webpack5-runner-backup-path.txt
```

- [ ] **Step 2: 覆盖 runner dist**

```bash
cd <TARO_ROOT>/Example/taro-blended-project
rm -rf node_modules/@tarojs/webpack5-runner/dist
cp -R <TARO_ROOT>/taro-weapp-runtime-union/packages/taro-webpack5-runner/dist \
      node_modules/@tarojs/webpack5-runner/dist
cp <TARO_ROOT>/taro-weapp-runtime-union/packages/taro-webpack5-runner/index.js \
   node_modules/@tarojs/webpack5-runner/index.js
```

- [ ] **Step 3: 确认新代码已就位**

```bash
test -f node_modules/@tarojs/webpack5-runner/dist/utils/asyncSubPackageRules.js
test -f node_modules/@tarojs/webpack5-runner/dist/utils/asyncSubPackageRuntime.js
rg --text -n "asyncOnly|asyncRules" node_modules/@tarojs/webpack5-runner/dist/plugins/SubPackageIndiePlugin.js | head
```

期望：能看到 `asyncOnly` / `asyncRules`。

- [ ] **Step 4: 构建 demo**

```bash
cd <TARO_ROOT>/Example/taro-blended-project
yarn build
```

期望：构建成功，`dist` 生成。若失败，先判断是 runner 版本 API 不匹配还是本任务代码问题；不要跳过。

- [ ] **Step 5: 检查 dist 结构**

```bash
cd <TARO_ROOT>/Example/taro-blended-project
find dist -maxdepth 3 -type f | sort
cat dist/app.json
```

必须满足：

- `dist/app.js`、`dist/runtime.js`、`dist/taro-shared-sync.js` 在根目录（async-only 模式不搬迁）。
- `dist/pages/sub1/index.js`、`dist/pages/sub2/index.js` 存在。
- `dist/pages/sub1/index.json`、`dist/pages/sub2/index.json` 不含 `"component": true`。
- `dist/pages/sub1-async/index.js`、`dist/pages/sub2-async/index.js` 存在。
- 至少一个 `dist/pages/shared-async/index.js`；若共享模块超过 `maxSize`，还应有 `dist/pages/shared-async-2/index.js`。
- `dist/shared-async-v1/index.js` 存在。
- `dist/pages/sub1/index.wxss` 包含 sub1 私有异步样式；`dist/pages/sub2/index.wxss` 包含 sub2 私有异步样式。
- `dist/pages/sub1/index.wxml` / `sub2` 包含对应异步模板。

若 `shared-async` 没生成，检查 demo 是否真的存在同时被 sub1+sub2 动态 import 的模块（`SharedBySub1Sub2` 应满足）。

- [ ] **Step 6: 记录构建日志**

```bash
cd <TARO_ROOT>/Example/taro-blended-project
yarn build > /tmp/taro-demo-build.log 2>&1
tail -80 /tmp/taro-demo-build.log
```

把关键 warning/error 记录到最终报告。

---

## Task 9: 宿主小程序接线

**Repo:** `<TARO_ROOT>/Example/miniapp-blended-project`
**Branch:** `feat/async-subpackage-host`

**Files:**
- Modify: `app.json`
- Modify: `pages/entry/index.js`
- Modify: `pages/entry/index.wxml`

- [ ] **Step 1: 清理宿主 app.json 的旧业务分包注册**

把 `app.json` 的 `subPackages` 改为空数组，保留 `pages` 与 `window`：

```json
{
  "pages": [
    "pages/entry/index"
  ],
  "subPackages": [],
  "window": {
    "backgroundTextStyle": "light",
    "navigationBarBackgroundColor": "#fff",
    "navigationBarTitleText": "SubPackageIndie 测试",
    "navigationBarTextStyle": "black"
  },
  "lazyCodeLoading": "requiredComponents"
}
```

构建后由 `plugin-mv` 自动写入：

- `pages/order/pages/sub1`
- `pages/order/pages/sub2`
- `pages/order/pages/sub1-async`
- `pages/order/pages/sub2-async`
- `pages/order/pages/shared-async`（以及实际用到的 `shared-async-2`）
- `pages/order/shared-async-v1`

- [ ] **Step 2: 入口页改为两个真实页面入口**

把 `pages/entry/index.js` 替换为：

```js
Page({
  onLoad() {
    console.log('原生入口页面加载')
  },

  openSub1() {
    wx.navigateTo({
      url: '/pages/order/pages/sub1/index',
    })
  },

  openSub2() {
    wx.navigateTo({
      url: '/pages/order/pages/sub2/index',
    })
  },
})
```

把 `pages/entry/index.wxml` 替换为：

```html
<view class='container'>
  <text class='title'>原生小程序入口</text>
  <button bindtap="openSub1">打开 Sub1 页面</button>
  <button bindtap="openSub2">打开 Sub2 页面</button>
</view>
```

- [ ] **Step 3: 提交宿主源码**

```bash
cd <TARO_ROOT>/Example/miniapp-blended-project
git add app.json pages/entry/index.js pages/entry/index.wxml
git commit -m "feat(host): 接入 async-only sub1/sub2 页面"
```

`pages/order/` 是构建产物，构建后再决定是否提交；不要提交 `project.private.config.json` 的本地改动。

---

## Task 10: 构建、拷贝、微信开发者工具验证与修复

**Repos:**
- Demo: `<TARO_ROOT>/Example/taro-blended-project`
- Host: `<TARO_ROOT>/Example/miniapp-blended-project`

- [ ] **Step 1: 重新构建 demo 并触发 mv**

```bash
export PATH="$HOME/.volta/bin:$PATH"
cd <TARO_ROOT>/Example/taro-blended-project
yarn build
```

`plugin-mv` 应自动：

- 清空并复制 `dist` 到 `../miniapp-blended-project/pages/order`
- 写入 `pages/order/.taro-mv-manifest.json`
- 更新宿主 `app.json.subPackages`

- [ ] **Step 2: 检查宿主产物**

```bash
cd <TARO_ROOT>/Example/miniapp-blended-project
cat app.json
cat pages/order/.taro-mv-manifest.json
find pages/order -maxdepth 3 -type f | sort
```

必须满足：

- `pages/order/app.js`、`pages/order/runtime.js`、`pages/order/taro-shared-sync.js` 存在。
- `pages/order/pages/sub1/index.*`、`pages/order/pages/sub2/index.*` 存在。
- `pages/order/pages/sub1-async/index.*`、`pages/order/pages/sub2-async/index.*` 存在。
- `pages/order/pages/shared-async/index.*` 存在。
- `pages/order/shared-async-v1/index.*` 存在。
- `app.json.subPackages` 中每个 root 目录都存在。
- 不再有 `pages/order/pages/index` 的注册。

- [ ] **Step 3: 打开微信开发者工具**

```bash
/Applications/wechatwebdevtools.app/Contents/MacOS/cli open \
  --project <TARO_ROOT>/Example/miniapp-blended-project
```

若 IDE 未登录：

```bash
/Applications/wechatwebdevtools.app/Contents/MacOS/cli islogin
/Applications/wechatwebdevtools.app/Contents/MacOS/cli login
```

- [ ] **Step 4: 用自动化跑页面与动态 import**

在临时目录安装 `miniprogram-automator`（不要污染 demo/host 仓库）：

```bash
export PATH="$HOME/.volta/bin:$PATH"
mkdir -p /tmp/taro-miniapp-verify
cd /tmp/taro-miniapp-verify
npm init -y >/dev/null 2>&1
npm i miniprogram-automator@latest
```

创建 `/tmp/taro-miniapp-verify/verify.js`：

```js
const automator = require('miniprogram-automator')

const cliPath = '/Applications/wechatwebdevtools.app/Contents/MacOS/cli'
const projectPath = '<TARO_ROOT>/Example/miniapp-blended-project'

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

async function getButtons(page) {
  const selectors = ['button', 'taro-button-core', '.button-text']
  for (const selector of selectors) {
    const items = await page.$$(selector)
    if (items.length) return items
  }
  return []
}

async function countButtons(page, text) {
  const buttons = await getButtons(page)
  let count = 0
  for (const button of buttons) {
    const label = (await button.text()).trim()
    if (label.includes(text)) count++
  }
  return count
}

async function tapButton(page, text) {
  const buttons = await getButtons(page)
  for (const button of buttons) {
    const label = (await button.text()).trim()
    if (label.includes(text)) {
      await button.tap()
      return true
    }
  }
  return false
}

async function waitFor(fn, timeout = 15000, interval = 500) {
  const start = Date.now()
  while (Date.now() - start < timeout) {
    if (await fn()) return true
    await sleep(interval)
  }
  return false
}

async function loadAndAssert(page, label) {
  const before = await countButtons(page, '关闭')
  if (!(await tapButton(page, label))) {
    throw new Error(`未找到按钮：${label}`)
  }
  const ok = await waitFor(async () => {
    const after = await countButtons(page, '关闭')
    return after > before
  })
  if (!ok) throw new Error(`${label} 加载后未出现新的关闭按钮`)
  console.log(`async ok: ${label}`)
}

;(async () => {
  const miniProgram = await automator.launch({ cliPath, projectPath })
  const errors = []
  miniProgram.on('console', (message) => {
    if (message.type === 'error') {
      errors.push(message.args.map(String).join(' '))
    }
  })

  let page = await miniProgram.reLaunch('/pages/entry/index')
  await sleep(1500)

  if (!(await tapButton(page, 'Sub1'))) throw new Error('未找到 Sub1 入口按钮')
  await sleep(2500)
  page = await miniProgram.currentPage()
  console.log('current page:', page.path)
  if (!page.path.includes('/pages/order/pages/sub1/index')) {
    throw new Error(`未进入 Sub1 页面，当前：${page.path}`)
  }

  for (const label of [
    'HeavyContent',
    'OnlySub1',
    'Shared(S1+S2)',
    'Shared(idx+s1)',
  ]) {
    await loadAndAssert(page, label)
  }

  await miniProgram.navigateBack()
  await sleep(1500)
  page = await miniProgram.currentPage()
  if (!(await tapButton(page, 'Sub2'))) throw new Error('未找到 Sub2 入口按钮')
  await sleep(2500)
  page = await miniProgram.currentPage()
  console.log('current page:', page.path)
  if (!page.path.includes('/pages/order/pages/sub2/index')) {
    throw new Error(`未进入 Sub2 页面，当前：${page.path}`)
  }

  for (const label of ['Shared(S1+S2)', 'OnlySub2Async']) {
    await loadAndAssert(page, label)
  }

  if (errors.length) {
    throw new Error(`控制台错误：\n${errors.join('\n')}`)
  }

  console.log('ALL CHECKS PASSED')
  await miniProgram.close()
})().catch((error) => {
  console.error('VERIFY FAILED', error)
  process.exit(1)
})
```

运行：

```bash
cd /tmp/taro-miniapp-verify
node verify.js
```

期望输出：

```text
current page: pages/order/pages/sub1/index
async ok: HeavyContent
async ok: OnlySub1
async ok: Shared(S1+S2)
async ok: Shared(idx+s1)
current page: pages/order/pages/sub2/index
async ok: Shared(S1+S2)
async ok: OnlySub2Async
ALL CHECKS PASSED
```

- [ ] **Step 5: 若失败，按以下顺序定位**

1. **页面打不开**：看 `app.json.subPackages` 是否注册、`pages/order/pages/sub1/index.js` 是否存在、`pages/order/app.js` 是否被页面 `require`。
2. **动态 import 报 `require.async` 找不到**：看 `runtime.js` 中 `asyncSubPackageRootEntries` 是否包含对应 asyncRoot，`pages/order/pages/sub1-async/index.js` 是否存在。
3. **共享模块错放**：看 `pages/order/pages/sub1-async` 是否出现 `SharedBySub1Sub2` 的 chunk；若出现，说明消费者解析或规则选择有误。
4. **共享运行时就绪门挂起**：看 `wx.__TARO_RT_ASYNC_V1__.__rtProviderState` 是否停在 `pending`；检查 `shared-async-v1/index.js` 是否被 `require.async` 成功加载、`__activateAsync` 是否返回 `true`。
5. **样式/模板丢失**：看 `pages/order/pages/sub1/index.wxss` / `.wxml` 是否包含异步 chunk 的样式/模板；检查 `asyncChunkConsumers` 是否记录了正确的消费页面。
6. **宿主注册残留**：看 `pages/order/.taro-mv-manifest.json` 与 `app.json.subPackages`，确认只清理 `pages/order/*` 下不存在的 root。

修复后重复 Step 1–4，直到自动化通过。

- [ ] **Step 6: 提交构建产物与修复**

```bash
cd <TARO_ROOT>/Example/miniapp-blended-project
git status --short
git add app.json pages/entry pages/order
git commit -m "chore(host): 更新 async-only 构建产物与验证入口"
```

如果 `pages/order` 被 `.gitignore` 忽略，则只提交 `app.json` 与入口页，并在最终报告说明产物未入库。

- [ ] **Step 7: 最终回归清单**

在最终报告中逐项给出证据：

- [ ] 框架新增单测全部通过。
- [ ] `@tarojs/webpack5-runner` 全量单测通过（或列出与基线一致的既有失败）。
- [ ] `pnpm --filter @tarojs/webpack5-runner build` 成功。
- [ ] demo `yarn build` 成功。
- [ ] `dist` 结构符合 async-only：根级 `app.js`/`runtime.js`/`taro-shared-sync.js`，`sub1`/`sub2` 为页面。
- [ ] `sub1-async`、`sub2-async`、`shared-async` 均生成并被注册。
- [ ] 宿主 `app.json` 无 stale root。
- [ ] 微信开发者工具自动化：sub1/sub2 页面可打开，4 + 2 个动态 import 全部成功，无控制台 error。
- [ ] 旧 `subPackageIndie`（带 `mainPackageRoot`）回归：`tests/subpackage-indie-shared-runtime.spec.ts`、`tests/async-subpackage-styles.spec.ts` 通过。
