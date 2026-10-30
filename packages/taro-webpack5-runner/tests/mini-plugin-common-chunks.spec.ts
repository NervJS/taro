import { describe, expect, test } from 'vitest'

import { chunkHasScriptModules } from '../src/plugins/MiniPlugin'

function createChunk (types: string[]) {
  return {
    getModules: () => types.map(type => ({ type })),
  }
}

describe('MiniPlugin common chunk require 注入', () => {
  test('纯 CSS chunk 不注入 require（sharedRuntime 下 common 只剩样式）', () => {
    expect(chunkHasScriptModules(createChunk(['css/mini-extract']))).toBe(false)
  })

  test('含 JS 模块的 chunk 正常注入 require', () => {
    expect(chunkHasScriptModules(createChunk(['javascript/auto']))).toBe(true)
  })

  test('CSS + JS 混合 chunk 正常注入 require', () => {
    expect(chunkHasScriptModules(createChunk(['css/mini-extract', 'javascript/esm']))).toBe(true)
  })

  test('0 模块 chunk（runtime 尚未装配）与无 getModules 的 chunk 保守保留', () => {
    expect(chunkHasScriptModules(createChunk([]))).toBe(true)
    expect(chunkHasScriptModules({})).toBe(true)
  })
})
