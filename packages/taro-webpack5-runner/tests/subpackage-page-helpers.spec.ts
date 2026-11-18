import { describe, expect, test } from 'vitest'

import {
  assertDeclaredPages,
  collectDeclaredPagePaths,
  hasSubPackageIndieAsyncConfig,
} from '../src/utils/subpackagePageHelpers'

describe('collectDeclaredPagePaths', () => {
  test('merges main pages and subpackage pages', () => {
    const pages = collectDeclaredPagePaths({
      pages: ['pages/home/index'],
      subPackages: [
        { root: 'pages/sub1', pages: ['index'] },
        { root: 'pages/sub2', pages: ['index', 'detail'] },
      ],
    })
    expect(pages).toEqual([
      'pages/home/index',
      'pages/sub1/index',
      'pages/sub2/index',
      'pages/sub2/detail',
    ])
  })
})

describe('hasSubPackageIndieAsyncConfig', () => {
  test('detects top-level asyncSubPackages', () => {
    expect(hasSubPackageIndieAsyncConfig({ asyncSubPackages: [{ test: 'a', root: 'x' }] })).toBe(true)
  })

  test('detects main subPackageIndie asyncSubPackage', () => {
    expect(hasSubPackageIndieAsyncConfig({
      subPackageIndie: [{
        mainPackageRoot: 'pages/index/index',
        subPackageRoots: [{ path: 'pages/sub1/index', asyncSubPackage: { asyncRoot: 'async/sub1' } }],
      }],
    })).toBe(true)
  })

  test('returns false for empty config', () => {
    expect(hasSubPackageIndieAsyncConfig({})).toBe(false)
  })
})

describe('assertDeclaredPages', () => {
  test('allows empty main pages when an async config and subpackage pages exist', () => {
    const appConfig = {
      pages: [],
      subPackages: [{ root: 'pages/sub1', pages: ['index'] }],
      asyncSubPackages: [{ test: 'components/a', root: 'async/a' }],
    }
    expect(assertDeclaredPages(appConfig, { allowEmptyMainPages: true }))
      .toEqual(['pages/sub1/index'])
  })

  test('still rejects a truly empty config', () => {
    expect(() => assertDeclaredPages({ pages: [], subPackages: [] }, { allowEmptyMainPages: true }))
      .toThrow('全局配置缺少 pages')
  })
})
