import { describe, expect, test } from 'vitest'

import SubPackageIndiePlugin from '../src/plugins/SubPackageIndiePlugin'

function createPlugin (appConfig: any) {
  const miniPlugin: any = {
    appConfig,
    nativeComponents: new Map(),
    options: {
      newBlended: true,
      sourceDir: '/tmp/taro-indie',
      fileType: { style: '.wxss', templ: '.wxml', config: '.json' },
      logger: { quiet: true },
      combination: { config: {} },
    },
  }
  return new SubPackageIndiePlugin(miniPlugin)
}

const LEGACY_CONFIG = {
  pages: ['pages/index/index'],
  components: ['pages/sub1/index', 'pages/sub2/index'],
  subPackageIndie: [
    {
      mainPackageRoot: 'pages/index/index',
      subPackageRoots: [
        { path: 'pages/sub1/index', asyncSubPackage: { asyncRoot: 'pages/sub1-async' } },
        { path: 'pages/sub2/index', asyncSubPackage: { asyncRoot: 'pages/sub1-async' } },
      ],
    },
  ],
}

describe('SubPackageIndiePlugin main compatibility', () => {
  test('keeps legacy sourceRoot -> asyncRoot parsing with a required main root', () => {
    const plugin = createPlugin(LEGACY_CONFIG)
    const [config] = plugin.getSubPackageIndieConfigs()

    expect(config.mainPackageRoot).toBe('pages/index')
    expect(config.subPackageRoots).toEqual(['pages/sub1', 'pages/sub2'])

    const map = plugin.getAsyncSubPackageRootMap()
    expect(map.get('pages/sub1')).toBe('pages/sub1-async')
    expect(map.get('pages/sub2')).toBe('pages/sub1-async')
  })

  test('keeps the legacy runtime anchors based on the main root', () => {
    const plugin = createPlugin(LEGACY_CONFIG)
    const roots = plugin.getAsyncSubPackageRuntimeRoots()
    expect(roots).toEqual([{ sourceRoot: 'pages/index', asyncRoot: 'pages/sub1-async' }])
  })

  test('rejects the shared runtime reserved root for legacy config', () => {
    const plugin = createPlugin({
      pages: ['pages/index/index'],
      subPackageIndie: [
        {
          mainPackageRoot: 'pages/index/index',
          subPackageRoots: [{ path: 'pages/sub1/index', asyncSubPackage: { asyncRoot: 'shared-async-v1' } }],
        },
      ],
    })
    expect(() => plugin.getSubPackageIndieConfigs()).toThrow(/shared-async-v1/)
  })

  test('still rejects a RegExp path or array asyncRoot under a main root', () => {
    const plugin = createPlugin({
      pages: ['pages/index/index'],
      subPackageIndie: [
        {
          mainPackageRoot: 'pages/index/index',
          subPackageRoots: [{ path: /^pages\/sub1/, asyncSubPackage: { asyncRoot: 'pages/sub1-async' } }],
        },
      ],
    })
    expect(() => plugin.getSubPackageIndieConfigs()).toThrow(/mainPackageRoot/)
  })
})
