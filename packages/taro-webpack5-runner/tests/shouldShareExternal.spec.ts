import { describe, expect, it } from 'vitest'

import { shouldShareExternal } from '../src/shared-runtime/externals'

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
    const extra = ['@jdtaro/plugin-inject-jdapi/runtime-mini']
    expect(shouldShareExternal('@jdtaro/plugin-inject-jdapi/runtime-mini', extra)).toBe(true)
    expect(shouldShareExternal('@jdtaro/plugin-inject-jdapi/runtime-mini/sub', extra)).toBe(true)
    expect(shouldShareExternal('@jdtaro/plugin-inject-jdapi/runtime-mini', [])).toBe(false)
  })

  it('空 / undefined 请求应排除', () => {
    expect(shouldShareExternal(undefined)).toBe(false)
    expect(shouldShareExternal('')).toBe(false)
  })
})
