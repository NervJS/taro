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
