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
