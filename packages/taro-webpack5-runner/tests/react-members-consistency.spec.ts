import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { describe, expect, it } from 'vitest'

import { ASYNC_REACT_MEMBERS, SYNC_REACT_MEMBERS } from '../src/shared-runtime/externals'

/**
 * 一致性 tripwire：entry.sync.js 和 async-provider.js 里对 react 全家桶的 require() 是字面量
 * 字符串（webpack 静态分析要求），无法从 externals.ts 常量动态展开。故用源文本断言：
 * 单一真理源清单里的每个成员必须出现在对应模板里，改一处漏一处即被此测试拦下。
 */
describe('react 全家桶清单一致性(source-lint)', () => {
  const entrySync = readFileSync(
    resolve(__dirname, '../src/shared-runtime/entry.sync.js'),
    'utf-8',
  )
  const asyncProvider = readFileSync(
    resolve(__dirname, '../src/shared-runtime/async-provider.js'),
    'utf-8',
  )

  it('SYNC_REACT_MEMBERS 每个成员都在 entry.sync.js 里被 require+share', () => {
    for (const m of SYNC_REACT_MEMBERS) {
      // 兼容单/双引号
      const requirePattern = new RegExp(`require\\(\\s*['"]${m.replace(/\//g, '\\/')}['"]\\s*\\)`)
      const sharePattern = new RegExp(`share\\(\\s*['"]${m.replace(/\//g, '\\/')}['"]`)
      expect(requirePattern.test(entrySync), `entry.sync.js 缺少 require('${m}')`).toBe(true)
      expect(sharePattern.test(entrySync), `entry.sync.js 缺少 share('${m}', ...)`).toBe(true)
    }
  })

  it('ASYNC_REACT_MEMBERS 每个成员都在 async-provider.js 里被 require+share', () => {
    for (const m of ASYNC_REACT_MEMBERS) {
      const requirePattern = new RegExp(`require\\(\\s*['"]${m.replace(/\//g, '\\/')}['"]\\s*\\)`)
      // async-provider 用 share(shared, name, mod) 三参形式
      const sharePattern = new RegExp(`share\\(\\s*shared\\s*,\\s*['"]${m.replace(/\//g, '\\/')}['"]`)
      expect(requirePattern.test(asyncProvider), `async-provider.js 缺少 require('${m}')`).toBe(true)
      expect(sharePattern.test(asyncProvider), `async-provider.js 缺少 share(shared, '${m}', ...)`).toBe(true)
    }
  })
})
