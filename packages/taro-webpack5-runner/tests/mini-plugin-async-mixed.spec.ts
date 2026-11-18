import { describe, expect, test } from 'vitest'

import MiniPlugin from '../src/plugins/MiniPlugin'

describe('MiniPlugin.applyAsyncSubPackagePlugin mixed-config guard', () => {
  test('throws when legacy asyncSubPackage and top-level asyncSubPackages coexist', () => {
    const fake = {
      subPackageIndiePlugin: {
        getAsyncSubPackageRootMap: () => new Map([['pages/sub1', 'pages/sub1-async']]),
        getAsyncSubPackageRuntimeRoots: () => [],
      },
      appConfig: {
        asyncSubPackages: [{ test: 'components/heavy/index', root: 'pages/heavy-async' }],
      },
      asyncSubPackagePlugin: null,
    } as any

    expect(() => (MiniPlugin.prototype as any).applyAsyncSubPackagePlugin.call(fake, {}))
      .toThrow(/不允许同时使用旧的 subPackageIndie 异步配置与顶层 asyncSubPackages/)
  })
})
