import { describe, expect, test } from 'vitest'

import {
  allocateAsyncChunksShared,
  matchesCondition,
  normalizeAsyncSubPackageRules,
  normalizeSourcePath,
  resolveAsyncSubPackageRule,
} from '../src/utils/asyncSubPackageConfig'

describe('matchesCondition', () => {
  test('string matches the exact module or its extension-stripped form', () => {
    expect(matchesCondition('components/heavy-content/index', 'components/heavy-content/index.tsx')).toBe(true)
    expect(matchesCondition('components/heavy-content/index.tsx', 'components/heavy-content/index.tsx')).toBe(true)
    expect(matchesCondition('components/heavy-content/index', 'components/heavy-content-other/index.tsx')).toBe(false)
  })

  test('RegExp resets lastIndex and matches the normalized resource', () => {
    const re = /^components\/editor\//g
    expect(matchesCondition(re, 'components/editor/tool.ts')).toBe(true)
    expect(matchesCondition(re, 'components/editor/tool.ts')).toBe(true)
  })

  test('array is an OR of conditions', () => {
    const cond = [/^sub1\//, 'components/shared/index']
    expect(matchesCondition(cond, 'sub1/lazy/a.ts')).toBe(true)
    expect(matchesCondition(cond, 'components/shared/index.js')).toBe(true)
    expect(matchesCondition(cond, 'sub2/lazy/a.ts')).toBe(false)
  })

  test('predicate receives the normalized resource', () => {
    const seen: string[] = []
    expect(matchesCondition((resource: string) => { seen.push(resource); return resource.length > 0 }, 'a/b.ts')).toBe(true)
    expect(seen).toEqual(['a/b.ts'])
  })
})

describe('normalizeAsyncSubPackageRules', () => {
  test('normalizes roots, priority and conditions', () => {
    const rules = normalizeAsyncSubPackageRules([
      { test: 'components/heavy-content/index', root: 'async/heavy' },
      { test: /^sub1\/lazy\//, root: ['async/sub1', 'async/sub1-2'], maxSize: 1000 },
    ])
    expect(rules).toHaveLength(2)
    expect(rules[0].roots).toEqual(['async/heavy'])
    expect(rules[0].priority).toBe(0)
    expect(rules[1].roots).toEqual(['async/sub1', 'async/sub1-2'])
    expect(rules[1].maxSize).toBe(1000)
  })

  test('multiple roots require a positive maxSize', () => {
    expect(() => normalizeAsyncSubPackageRules([
      { test: /^a\//, root: ['x', 'y'] },
    ])).toThrow('必须同时配置 maxSize')
  })

  test('shared root must keep a consistent budget across rules', () => {
    expect(() => normalizeAsyncSubPackageRules([
      { test: 'a', root: ['shared', 'shared-2'], maxSize: 100 },
      { test: 'b', root: 'shared', maxSize: 200 },
    ])).toThrow('maxSize 不一致')
  })

  test('reserved roots are rejected', () => {
    expect(() => normalizeAsyncSubPackageRules(
      [{ test: 'a', root: 'shared-async-v1' }],
      { reservedRoots: ['shared-async-v1'] },
    )).toThrow('保留目录')
  })
})

describe('resolveAsyncSubPackageRule', () => {
  const rules = normalizeAsyncSubPackageRules([
    { test: /^components\/editor\//, root: 'async/editor' },
    { test: 'components/editor/heavy/index', root: 'async/heavy', priority: 10 },
    { test: 'components/other/index', root: 'async/other', priority: 10 },
  ])

  test('selects the highest priority match', () => {
    const rule = resolveAsyncSubPackageRule(rules, 'components/editor/heavy/index.tsx')
    expect(rule?.roots).toEqual(['async/heavy'])
  })

  test('falls back to a less specific rule', () => {
    const rule = resolveAsyncSubPackageRule(rules, 'components/editor/tool.ts')
    expect(rule?.roots).toEqual(['async/editor'])
  })

  test('include and exclude narrow the rule', () => {
    const includeRules = normalizeAsyncSubPackageRules([
      { test: /^components\//, include: /\.async\./, root: 'async/a', priority: 5 },
      { test: /^components\//, root: 'async/b' },
    ])
    expect(resolveAsyncSubPackageRule(includeRules, 'components/a.async.ts')?.roots).toEqual(['async/a'])
    expect(resolveAsyncSubPackageRule(includeRules, 'components/a.ts')?.roots).toEqual(['async/b'])
  })

  test('throws for equal-priority conflicting rules', () => {
    const conflict = normalizeAsyncSubPackageRules([
      { test: 'components/x/index', root: 'async/a', priority: 5 },
      { test: 'components/x/index', root: 'async/b', priority: 5 },
    ])
    expect(() => resolveAsyncSubPackageRule(conflict, 'components/x/index.tsx')).toThrow('目标配置不同')
  })
})

function allocateForRule (rule, chunks) {
  return allocateAsyncChunksShared(
    new Map([[rule.index, rule]]),
    chunks.map(chunk => ({ ...chunk, ruleIndex: rule.index }))
  )
}

describe('allocateAsyncChunksShared single rule', () => {
  test('single root places every chunk in the same directory', () => {
    const rule = normalizeAsyncSubPackageRules([{ test: 'a', root: 'async/a' }])[0]
    const allocation = allocateForRule(rule, [
      { name: 'one', size: 10 },
      { name: 'two', size: 20 },
    ])
    expect(allocation.get('one')).toBe('async/a')
    expect(allocation.get('two')).toBe('async/a')
  })

  test('multiple roots pack deterministically by descending size', () => {
    const rule = normalizeAsyncSubPackageRules([{ test: 'a', root: ['x', 'y'], maxSize: 10 }])[0]
    const allocation = allocateForRule(rule, [
      { name: 'small', size: 5 },
      { name: 'big', size: 10 },
    ])
    expect(allocation.get('big')).toBe('x')
    expect(allocation.get('small')).toBe('y')
  })

  test('throws when a single chunk exceeds the budget', () => {
    const rule = normalizeAsyncSubPackageRules([{ test: 'a', root: ['x', 'y'], maxSize: 5 }])[0]
    expect(() => allocateForRule(rule, [{ name: 'big', size: 6 }])).toThrow('超过 maxSize')
  })
})


describe('allocateAsyncChunksShared', () => {
  test('shares a physical root budget across rules', () => {
    const rules = normalizeAsyncSubPackageRules([
      { test: 'a', root: ['shared', 'x'], maxSize: 10 },
      { test: 'b', root: 'shared', maxSize: 10 },
    ])
    const byIndex = new Map(rules.map(r => [r.index, r]))
    const alloc = allocateAsyncChunksShared(byIndex, [
      { name: 'big', size: 10, ruleIndex: rules[1].index }, // single root consumes shared to 10
      { name: 'small', size: 5, ruleIndex: rules[0].index }, // must go to x, not overflow shared
    ])
    expect(alloc.get('big')).toBe('shared')
    expect(alloc.get('small')).toBe('x')
  })
})


describe('normalizeSourcePath windows drive letter', () => {
  test('lowercases the drive prefix under win32', () => {
    const desc = Object.getOwnPropertyDescriptor(process, 'platform')
    Object.defineProperty(process, 'platform', { value: 'win32', configurable: true })
    try {
      expect(normalizeSourcePath('C:\\project\\src')).toBe('c:/project/src')
    } finally {
      if (desc) Object.defineProperty(process, 'platform', desc)
    }
  })
})
