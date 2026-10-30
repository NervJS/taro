import path from 'node:path'

import { describe, expect, test } from 'vitest'

import MiniPlugin from '../src/plugins/MiniPlugin'

const fixtureDir = path.resolve(__dirname, 'fixtures/async-only-pages/src')

function createPlugin (appConfig: any) {
  const plugin: any = Object.create(MiniPlugin.prototype)
  plugin.appConfig = appConfig
  plugin.isWatch = true
  plugin.pages = new Set()
  plugin.prerenderPages = new Set()
  plugin.options = {
    logger: { quiet: true },
    newBlended: true,
    frameworkExts: ['.jsx', '.js'],
    sourceDir: fixtureDir,
    combination: { config: {} },
  }
  plugin.getTabBarFiles = () => {}
  plugin.getNativeComponent = () => {}
  plugin.isNativePageORComponent = () => false
  plugin.getTemplatePath = (p: string) => p.replace(/\.jsx?$/, '.wxml')
  plugin.getStylePath = (p: string) => p.replace(/\.jsx?$/, '.wxss')
  plugin.isWeappSubPackageIndieEnabled = () => true
  return plugin
}

describe('MiniPlugin async-only 空主包页面', () => {
  test('async-only 配置下允许 pages 为空数组', () => {
    const plugin = createPlugin({
      pages: [],
      subPackages: [{ root: 'pages/sub1', pages: ['index'] }],
      subPackageIndie: [{
        subPackageRoots: [
          { path: 'pages/sub1/index', asyncSubPackage: { asyncRoot: 'pages/sub1-async' } },
        ],
      }],
    })
    expect(() => plugin.getPages()).not.toThrow()
    expect(Array.from(plugin.pages).map((p: any) => p.name)).toEqual(['pages/sub1/index'])
  })

  test('未配置 async-only 且 pages 为空时仍然报错', () => {
    const plugin = createPlugin({
      pages: [],
      subPackages: [{ root: 'pages/sub1', pages: ['index'] }],
    })
    expect(() => plugin.getPages()).toThrow(/pages/)
  })
})
