import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { describe, expect, it } from 'vitest'

import { SYNC_CORE_REGISTERED_RUNTIMES } from '../src/shared-runtime/constants'
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

  // SYNC_CORE_REGISTERED_RUNTIMES 供 computeMissingRuntimes 做差集：runtimePath 里已在此清单的
  // （平台/运行时 runtime）不重复打进同步核。它必须与 entry.sync.js 实际 require 的清单一致，
  // 否则差集会把「已注册的」误判成漏网（重复打包）或把「未注册的」漏掉。故同款 source-lint 守护。
  it('SYNC_CORE_REGISTERED_RUNTIMES 每个成员都在 entry.sync.js 里被 require', () => {
    for (const m of SYNC_CORE_REGISTERED_RUNTIMES) {
      const requirePattern = new RegExp(`require\\(\\s*['"]${m.replace(/\//g, '\\/')}['"]\\s*\\)`)
      expect(requirePattern.test(entrySync), `entry.sync.js 缺少 require('${m}')`).toBe(true)
    }
  })
})
