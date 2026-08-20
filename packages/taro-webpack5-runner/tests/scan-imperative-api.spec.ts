import { describe, expect, it } from 'vitest'

import { findTaroBindings, scanCode } from '../src/shared-runtime/scan-imperative-api'

describe('findTaroBindings（覆盖多种导入形态）', () => {
  it('默认导入 → namespace', () => {
    const b = findTaroBindings("import Taro from '@tarojs/taro'")
    expect(b.namespaces.has('Taro')).toBe(true)
  })

  it('默认 + 具名混合导入', () => {
    const b = findTaroBindings("import Taro, { showToast, useLoad } from '@tarojs/taro'")
    expect(b.namespaces.has('Taro')).toBe(true)
    expect(b.named.has('showToast')).toBe(true)
    expect(b.named.has('useLoad')).toBe(true)
  })

  it('具名别名导入 → 取本地别名', () => {
    const b = findTaroBindings("import { getSystemInfoSync as g } from '@tarojs/taro'")
    expect(b.named.has('g')).toBe(true)
    expect(b.named.has('getSystemInfoSync')).toBe(false)
  })

  it('命名空间导入 * as', () => {
    const b = findTaroBindings("import * as Taro from '@tarojs/taro'")
    expect(b.namespaces.has('Taro')).toBe(true)
  })

  it('require 默认 → namespace', () => {
    const b = findTaroBindings("const Taro = require('@tarojs/taro')")
    expect(b.namespaces.has('Taro')).toBe(true)
  })

  it('require 解构（含重命名 :） → named', () => {
    const b = findTaroBindings("const { showToast, getSystemInfoSync: g } = require('@tarojs/taro')")
    expect(b.named.has('showToast')).toBe(true)
    expect(b.named.has('g')).toBe(true)
  })
})

describe('scanCode（顶层命令式 API 调用检测）', () => {
  it('顶层 Taro.showToast() → 命中', () => {
    const hits = scanCode("import Taro from '@tarojs/taro'\nTaro.showToast({ title: 'x' })")
    expect(hits.length).toBe(1)
    expect(hits[0].api).toBe('Taro.showToast')
  })

  it('顶层具名裸调用 showToast() → 命中（P2 修复：早期漏报）', () => {
    const hits = scanCode("import { showToast } from '@tarojs/taro'\nshowToast({ title: 'x' })")
    expect(hits.length).toBe(1)
    expect(hits[0].api).toBe('showToast')
  })

  it('别名裸调用 g() → 命中', () => {
    const hits = scanCode("import { getSystemInfoSync as g } from '@tarojs/taro'\nconst info = g()")
    expect(hits.length).toBe(1)
    expect(hits[0].api).toBe('g')
  })

  it('函数体/组件体内调用（深度>0） → 不报', () => {
    const code = [
      "import Taro from '@tarojs/taro'",
      'function App() {',
      '  Taro.showToast({ title: "x" })',
      '  return null',
      '}',
    ].join('\n')
    expect(scanCode(code).length).toBe(0)
  })

  it('hooks（use 开头）不报', () => {
    const code = "import { useLoad } from '@tarojs/taro'\nuseLoad(() => {})"
    expect(scanCode(code).length).toBe(0)
    const code2 = "import Taro from '@tarojs/taro'\nTaro.useReady(() => {})"
    expect(scanCode(code2).length).toBe(0)
  })

  it('无 @tarojs/taro 导入 → 不报', () => {
    expect(scanCode("import x from 'other'\nx.foo()").length).toBe(0)
  })

  it('注释/字符串里的调用不误报', () => {
    const code = [
      "import Taro from '@tarojs/taro'",
      '// Taro.showToast() in comment',
      'const s = "Taro.showToast()"',
    ].join('\n')
    expect(scanCode(code).length).toBe(0)
  })

  it('成员访问的同名方法不误伤具名裸调用（obj.showToast 不算 showToast 裸调用）', () => {
    const code = "import { showToast } from '@tarojs/taro'\nother.showToast()"
    // other.showToast() 是成员调用，obj=other 不在 namespaces，且 BARE_CALL_RE 前置排除了 . 前缀
    expect(scanCode(code).length).toBe(0)
  })

  // ---- 延迟上下文（B6 review Finding 1 修复）：顶层定义但不立即执行 ----
  it('顶层箭头函数体（表达式）内的调用 → 不报', () => {
    const code = "import Taro from '@tarojs/taro'\nexport const showErr = () => Taro.showToast({ icon: 'none' })"
    expect(scanCode(code).length).toBe(0)
  })

  it('顶层箭头函数体（表达式）内的具名裸调用 → 不报', () => {
    const code = "import { showToast } from '@tarojs/taro'\nexport const t = () => showToast()"
    expect(scanCode(code).length).toBe(0)
  })

  it('顶层单行箭头体块 { showToast() } → 不报', () => {
    const code = "import { showToast } from '@tarojs/taro'\nconst cb = () => { showToast() }"
    expect(scanCode(code).length).toBe(0)
  })

  it('顶层函数表达式体内调用 → 不报', () => {
    const code = "import Taro from '@tarojs/taro'\nconst f = function () { Taro.showToast() }"
    expect(scanCode(code).length).toBe(0)
  })

  it('立即执行的顶层调用仍应命中（不被 => 隔壁行影响）', () => {
    const code = [
      "import Taro from '@tarojs/taro'",
      'const f = () => 1', // 顶层箭头（无风险）
      'Taro.showToast()', // 立即执行 —— 应命中
    ].join('\n')
    expect(scanCode(code).length).toBe(1)
  })
})
