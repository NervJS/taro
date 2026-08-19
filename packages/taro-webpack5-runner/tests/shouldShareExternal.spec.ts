import { describe, expect, it } from 'vitest'

import { computeMissingRuntimes, shouldShareExternal } from '../src/shared-runtime/externals'

describe('shouldShareExternal（方案二 split externals 判定）', () => {
  it('React 全家桶应被 external', () => {
    expect(shouldShareExternal('react')).toBe(true)
    expect(shouldShareExternal('react-dom')).toBe(true)
    expect(shouldShareExternal('react-reconciler')).toBe(true)
    expect(shouldShareExternal('scheduler')).toBe(true)
    expect(shouldShareExternal('react/jsx-runtime')).toBe(true)
  })

  it('@tarojs/* 运行时包应被 external', () => {
    expect(shouldShareExternal('@tarojs/runtime')).toBe(true)
    expect(shouldShareExternal('@tarojs/taro')).toBe(true)
    expect(shouldShareExternal('@tarojs/shared')).toBe(true)
  })

  it('@tarojs/components 必须排除（否则破坏 base.wxml 模板收集）', () => {
    expect(shouldShareExternal('@tarojs/components')).toBe(false)
    expect(shouldShareExternal('@tarojs/components/dist/button')).toBe(false)
  })

  it('@tarojs/taro-loader 是编译期 loader，必须排除', () => {
    expect(shouldShareExternal('@tarojs/taro-loader')).toBe(false)
    expect(shouldShareExternal('@tarojs/taro-loader/lib/render')).toBe(false)
  })

  it('非裸模块请求（相对/绝对/loader/query）应排除', () => {
    expect(shouldShareExternal('./foo')).toBe(false)
    expect(shouldShareExternal('/abs/path')).toBe(false)
    expect(shouldShareExternal('!raw-loader!./x')).toBe(false)
    expect(shouldShareExternal('react?query')).toBe(false)
  })

  it('普通第三方包不应被 external', () => {
    expect(shouldShareExternal('lodash')).toBe(false)
    expect(shouldShareExternal('dayjs')).toBe(false)
  })

  it('extraPackages 声明的包应被 external（含子路径）', () => {
    const extra = ['@scope/my-shared-plugin/runtime-mini']
    expect(shouldShareExternal('@scope/my-shared-plugin/runtime-mini', extra)).toBe(true)
    expect(shouldShareExternal('@scope/my-shared-plugin/runtime-mini/sub', extra)).toBe(true)
    expect(shouldShareExternal('@scope/my-shared-plugin/runtime-mini', [])).toBe(false)
  })

  it('空 / undefined 请求应排除', () => {
    expect(shouldShareExternal(undefined)).toBe(false)
    expect(shouldShareExternal('')).toBe(false)
  })
})

describe('computeMissingRuntimes（runtimePath 漏网 runtime 差集）', () => {
  const PLATFORM = '@tarojs/plugin-platform-weapp/dist/runtime'
  const HTML = '@tarojs/plugin-html/dist/runtime'

  it('挑出被 external 却未注册的插件 runtime，滤除平台 runtime', () => {
    expect(computeMissingRuntimes([PLATFORM, HTML])).toEqual([HTML])
  })

  it('平台 runtime（已在 SYNC_CORE_REGISTERED_RUNTIMES）单独输入时返回空', () => {
    expect(computeMissingRuntimes([PLATFORM])).toEqual([])
    expect(computeMissingRuntimes('@tarojs/runtime')).toEqual([])
    expect(computeMissingRuntimes('@tarojs/shared')).toEqual([])
  })

  it('post: 前缀被剥离后仍入选', () => {
    expect(computeMissingRuntimes(['post:@tarojs/plugin-http/dist/runtime'])).toEqual([
      '@tarojs/plugin-http/dist/runtime',
    ])
  })

  it('已被 extraPackages / syncExtraPackages 接管的不重复入选', () => {
    expect(computeMissingRuntimes([HTML], [HTML])).toEqual([])
    expect(computeMissingRuntimes([HTML], [], [HTML])).toEqual([])
  })

  it('非 @tarojs/* 请求（相对路径 / 第三方）被 shouldShareExternal 滤除', () => {
    expect(computeMissingRuntimes(['./local-runtime', 'some-lib/runtime', HTML])).toEqual([HTML])
  })

  it('去重：同一 runtime 出现多次只返回一次', () => {
    expect(computeMissingRuntimes([HTML, HTML, 'post:' + HTML])).toEqual([HTML])
  })

  it('runtimePath 为 string / undefined / 空数组的边界', () => {
    expect(computeMissingRuntimes(HTML)).toEqual([HTML])
    expect(computeMissingRuntimes(undefined)).toEqual([])
    expect(computeMissingRuntimes([])).toEqual([])
    expect(computeMissingRuntimes(['', undefined as any, null as any])).toEqual([])
  })

  it('多个插件 runtime 全部就位（plugin-html + plugin-inject + devtools）', () => {
    const INJECT = '@tarojs/plugin-inject/dist/runtime'
    const DEVTOOLS = 'post:@tarojs/plugin-react-devtools/dist/runtime'
    expect(computeMissingRuntimes([PLATFORM, HTML, INJECT, DEVTOOLS])).toEqual([
      HTML,
      INJECT,
      '@tarojs/plugin-react-devtools/dist/runtime',
    ])
  })
})
