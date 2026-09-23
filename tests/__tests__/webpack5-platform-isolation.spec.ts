import { spawnSync } from 'node:child_process'

import * as helper from '@tarojs/helper'
import { Alipay } from '@tarojs/plugin-platform-alipay'
import { JD } from '@tarojs/plugin-platform-jd'
import { QQ } from '@tarojs/plugin-platform-qq'
import { Swan } from '@tarojs/plugin-platform-swan'
import { TT } from '@tarojs/plugin-platform-tt'
import { Weapp } from '@tarojs/plugin-platform-weapp'
import HarmonyPlugin from '@tarojs/webpack5-runner/dist/plugins/HarmonyPlugin'
import MiniCompileModePlugin, { templatesCache } from '@tarojs/webpack5-runner/dist/plugins/MiniCompileModePlugin'
import MiniPlugin from '@tarojs/webpack5-runner/dist/plugins/MiniPlugin'
import { componentConfig } from '@tarojs/webpack5-runner/dist/utils/component'
import { AsyncSeriesHook, SyncHook, SyncWaterfallHook } from 'tapable'

import {
  isWeappSubPackageIndieEnabled,
  shouldProcessCommonStyles,
} from '../../packages/taro-webpack5-runner/src/utils/platform'
import { compile, getOutput } from './utils/compiler'

const webpack = jest.requireActual('webpack')

function createMiniPlugin (newBlended: boolean) {
  const plugin = Object.create(MiniPlugin.prototype) as MiniPlugin
  plugin.options = {
    commonChunks: ['common'],
    fileType: { style: '.ttss' },
    newBlended,
  } as any
  plugin.independentPackages = new Map()
  plugin.pages = new Set()
  plugin.nativeComponents = new Map()
  plugin.hooks = {
    modifyShouldProcessStyles: { call: value => value },
  } as any
  return plugin
}

describe('webpack5 微信分包混合能力平台隔离', () => {
  const originalTaroEnv = process.env.TARO_ENV

  afterEach(() => {
    if (originalTaroEnv === undefined) {
      delete process.env.TARO_ENV
    } else {
      process.env.TARO_ENV = originalTaroEnv
    }
  })

  test('MiniPlugin 不依赖测试工具补充的 NODE_PATH 即可加载', () => {
    const env = { ...process.env }
    delete env.NODE_PATH
    const result = spawnSync(process.execPath, [
      '-e',
      'require(process.argv[1])',
      require.resolve('@tarojs/webpack5-runner/dist/plugins/MiniPlugin'),
    ], { env, encoding: 'utf8' })
    expect({ status: result.status, stderr: result.stderr }).toEqual({ status: 0, stderr: '' })
  })

  test.each([
    ['weapp', true, true],
    ['weapp', false, false],
    ['tt', true, false],
    ['alipay', true, false],
  ])('%s newBlended=%s => %s', (platform, newBlended, expected) => {
    expect(isWeappSubPackageIndieEnabled(platform, newBlended)).toBe(expected)
  })

  test.each([
    ['tt 普通构建', 'tt', false, true],
    ['tt newBlended', 'tt', true, true],
    ['普通微信构建', 'weapp', false, true],
    ['微信 newBlended', 'weapp', true, false],
  ])('%s 在只有公共样式时是否生成 app 样式', (_name, platform, newBlended, expected) => {
    expect(shouldProcessCommonStyles({
      hasCommonStyles: true,
      hasAppStyle: false,
      isWeappSubPackageIndieEnabled: isWeappSubPackageIndieEnabled(platform, newBlended),
    })).toBe(expected)
  })

  test('微信 newBlended 存在 app 样式时继续处理公共样式', () => {
    expect(shouldProcessCommonStyles({
      hasCommonStyles: true,
      hasAppStyle: true,
      isWeappSubPackageIndieEnabled: true,
    })).toBe(true)
  })

  test('没有公共样式时默认不生成 app 样式', () => {
    expect(shouldProcessCommonStyles({
      hasCommonStyles: false,
      hasAppStyle: true,
      isWeappSubPackageIndieEnabled: false,
    })).toBe(false)
  })

  test.each([false, true])('tt newBlended=%s 时为 common.ttss 生成 app.ttss', newBlended => {
    process.env.TARO_ENV = 'tt'
    const plugin = createMiniPlugin(newBlended)
    const assets = {
      'common.ttss': new webpack.sources.RawSource('.title { color: red; }'),
    }

    plugin.injectCommonStyles({ assets } as any, { webpack } as any)

    expect(assets['app-origin.ttss']).toBeDefined()
    expect(assets['app.ttss']).toBeDefined()
    expect(assets['app.ttss'].source().toString()).toContain('@import "./common.ttss";')
  })

  test.each(['tt', 'alipay', 'swan', 'qq', 'jd'])('%s newBlended 不注册分包混合插件', platform => {
    process.env.TARO_ENV = platform
    const plugin = Object.create(MiniPlugin.prototype) as MiniPlugin
    plugin.options = {
      combination: {},
      newBlended: true,
    } as any
    plugin.subPackageIndiePlugin = null
    plugin.asyncSubPackagePlugin = null

    plugin.applySubPackageIndiePlugin()
    plugin.applyAsyncSubPackagePlugin({} as any)

    expect(plugin.subPackageIndiePlugin).toBeNull()
    expect(plugin.asyncSubPackagePlugin).toBeNull()
    expect((plugin.options.combination as any).subPackageIndiePlugin).toBeUndefined()
  })

  test('微信 newBlended 注册分包插件并使用专用 comp 模板', () => {
    process.env.TARO_ENV = 'weapp'
    const hook = { tap: jest.fn() }
    const plugin = Object.create(MiniPlugin.prototype) as MiniPlugin
    plugin.options = {
      combination: {},
      newBlended: true,
    } as any
    plugin.hooks = new Proxy({}, { get: () => hook }) as any
    plugin.subPackageIndiePlugin = null

    plugin.applySubPackageIndiePlugin()

    expect(plugin.subPackageIndiePlugin).not.toBeNull()
    expect(plugin.getCompTemplatePath()).toContain('comp-new-blended')
  })

  test.each(['tt', 'alipay', 'swan', 'qq', 'jd'])('%s newBlended 继续使用原始 comp 模板', platform => {
    process.env.TARO_ENV = platform
    const plugin = Object.create(MiniPlugin.prototype) as MiniPlugin
    plugin.options = { newBlended: true } as any

    expect(plugin.getCompTemplatePath()).toMatch(/template\/comp$/)
  })

  test('tt 静默忽略 subPackageIndie 配置', () => {
    process.env.TARO_ENV = 'tt'
    const plugin = Object.create(MiniPlugin.prototype) as MiniPlugin
    plugin.options = {
      combination: {},
      newBlended: true,
    } as any
    plugin.hooks = {
      modifyConfig: { call: value => value },
    } as any
    plugin.getComponentName = () => 'app'
    plugin.getConfigPath = () => 'app.json'
    plugin.adjustConfigContent = jest.fn()
    const compilation = { assets: {} }
    const config = {
      pages: ['pages/index/index'],
      forceCustomWrapper: true,
      subPackageIndie: [{ mainPackageRoot: 'pages/index/index', subPackageRoots: [] }],
    }

    plugin.generateConfigFile(compilation as any, { webpack } as any, 'app', config as any)

    const output = JSON.parse(compilation.assets['app.json'].source().toString())
    expect(output.pages).toEqual(['pages/index/index'])
    expect(output.forceCustomWrapper).toBeUndefined()
    expect(output.subPackageIndie).toBeUndefined()
  })

  test('tt newBlended 不向入口代码传递微信分包混合配置', async () => {
    process.env.TARO_ENV = 'tt'
    const plugin = Object.create(MiniPlugin.prototype) as MiniPlugin
    plugin.options = {
      combination: { config: {} },
      newBlended: true,
    } as any
    plugin.appEntry = '/project/src/app.ts'
    plugin.compileFile = jest.fn()
    plugin.getConfigFilePath = () => 'app.json'
    plugin.filesConfig = {
      'app.json': {
        content: {
          pages: ['pages/index/index'],
          forceCustomWrapper: true,
          subPackageIndie: [{ mainPackageRoot: 'pages/index/index', subPackageRoots: [] }],
        },
      },
    } as any

    const appConfig = await plugin.getAppConfig()

    expect(appConfig.pages).toEqual(['pages/index/index'])
    expect(appConfig.forceCustomWrapper).toBeUndefined()
    expect(appConfig.subPackageIndie).toBeUndefined()
  })

  test('Harmony 输出配置不包含微信分包混合字段', () => {
    const plugin = Object.create(HarmonyPlugin.prototype) as HarmonyPlugin
    plugin.getComponentName = () => 'app'
    plugin.getConfigPath = () => 'app.json'
    plugin.adjustConfigContent = jest.fn()
    const compilation = { assets: {} }
    const config = {
      pages: ['pages/index/index'],
      forceCustomWrapper: true,
      subPackageIndie: [{ mainPackageRoot: 'pages/index/index', subPackageRoots: [] }],
    }

    plugin.generateConfigFile(compilation as any, { webpack } as any, 'app', config as any)

    const output = JSON.parse(compilation.assets['app.json'].source().toString())
    expect(output.forceCustomWrapper).toBeUndefined()
    expect(output.subPackageIndie).toBeUndefined()
  })

  test('Harmony 不向入口代码传递微信分包混合配置', () => {
    const plugin = Object.create(HarmonyPlugin.prototype) as HarmonyPlugin
    plugin.appEntry = '/project/src/app.ts'
    plugin.compileFile = jest.fn()
    plugin.getConfigFilePath = () => 'app.json'
    plugin.filesConfig = {
      'app.json': {
        content: {
          pages: ['pages/index/index'],
          forceCustomWrapper: true,
          subPackageIndie: [{ mainPackageRoot: 'pages/index/index', subPackageRoots: [] }],
        },
      },
    } as any

    const appConfig = plugin.getAppConfig()

    expect(appConfig.forceCustomWrapper).toBeUndefined()
    expect(appConfig.subPackageIndie).toBeUndefined()
  })

  test.each([
    ['普通 TT', false, false],
    ['TT newBlended', true, false],
    ['TT DOM', false, true],
  ])('%s 构建在没有入口样式时仍引入公共样式', async (_name, newBlended, enableTTDom) => {
    const program = new TT({ helper } as any, {})
    const { stats, config } = await compile('common-style', {
      platformType: 'mini',
      buildAdapter: 'tt',
      globalObject: program.globalObject,
      fileType: program.fileType,
      template: program.template,
      runtimePath: program.runtimePath,
      newBlended,
      modifyAppConfig (appConfig) {
        appConfig.enableTTDom = enableTTDom
      },
    })
    const appStyle = stats.compilation.getAsset('app.ttss')
    const commonStyle = stats.compilation.getAsset('common.ttss')
    const output = getOutput(stats, config)

    expect(commonStyle).toBeDefined()
    expect(appStyle).toBeDefined()
    expect(output).toContain('/** filePath: dist/app.ttss **/')
    expect(output).toContain('@import "./common.ttss";')
  })

  test.each([
    ['alipay', Alipay],
    ['swan', Swan],
    ['qq', QQ],
    ['jd', JD],
  ])('%s 混合构建忽略微信分包配置并保留公共样式', async (platform, Platform) => {
    const program = new Platform({ helper } as any, {})
    const { stats } = await compile('common-style', {
      platformType: 'mini',
      buildAdapter: platform,
      globalObject: program.globalObject,
      fileType: program.fileType,
      template: program.template,
      runtimePath: program.runtimePath,
      newBlended: true,
      modifyAppConfig (appConfig) {
        appConfig.forceCustomWrapper = true
        appConfig.subPackageIndie = [{ mainPackageRoot: 'pages/index/index', subPackageRoots: [] }]
      },
    })
    expect(stats.hasErrors()).toBe(false)
    const styleExt = program.fileType.style
    expect(stats.compilation.getAsset(`common${styleExt}`)).toBeDefined()
    const outputFs = stats.compilation.compiler.outputFileSystem
    const outputPath = stats.compilation.outputOptions.path
    expect(outputFs.readFileSync(`${outputPath}/app${styleExt}`).toString()).toContain(`@import "./common${styleExt}";`)
    const appConfig = JSON.parse(outputFs.readFileSync(`${outputPath}/app.json`).toString())
    expect(appConfig.subPackageIndie).toBeUndefined()
    expect(appConfig.forceCustomWrapper).toBeUndefined()
    expect(stats.compilation.getAsset('pages/index/app.js')).toBeUndefined()
  })

  test.each([
    ['qq', true, true],
    ['weapp', false, true],
    ['weapp', true, false],
  ])('%s newBlended=%s 独立分包保留原有 custom-wrapper 声明=%s', async (platform, newBlended, expected) => {
    process.env.TARO_ENV = platform
    const plugin = createMiniPlugin(newBlended)
    plugin.options.sourceDir = '/project/src'
    plugin.options.fileType = { style: '.wxss', templ: '.wxml', config: '.json', script: '.js', xs: '.wxs' }
    plugin.options.template = {
      isSupportRecursive: false,
      buildTemplate: () => '',
      buildBaseComponentTemplate: () => '',
      buildCustomComponentTemplate: () => '',
      buildXsTemplate: () => '',
    } as any
    plugin.options.combination = { config: {} } as any
    plugin.hooks.modifyConfig = new SyncWaterfallHook(['config']) as any
    plugin.independentPackages.set('packageA', { pages: [], components: [] })
    const compilation = { __name: 'packageA', assets: {} }
    const wrapper = componentConfig.thirdPartyComponents.get('custom-wrapper')
    componentConfig.thirdPartyComponents.delete('custom-wrapper')
    try {
      await plugin.generateIndependentMiniFiles(compilation as any, { webpack } as any)
      const config = JSON.parse(compilation.assets['packageA/comp.json'].source())
      expect(config.usingComponents['custom-wrapper']).toBe(expected ? './custom-wrapper' : undefined)
    } finally {
      if (wrapper) componentConfig.thirdPartyComponents.set('custom-wrapper', wrapper)
    }
  })

  test('微信 newBlended 保持 subPackageIndie 入口迁移', async () => {
    const program = new Weapp({ helper } as any, {})
    const { stats } = await compile('common-style', {
      platformType: 'mini',
      buildAdapter: 'weapp',
      globalObject: program.globalObject,
      fileType: program.fileType,
      template: program.template,
      runtimePath: program.runtimePath,
      newBlended: true,
      modifyAppConfig (appConfig) {
        appConfig.pages = ['pages/index/index']
        appConfig.components = ['pages/about/index']
        appConfig.subPackageIndie = [{
          mainPackageRoot: 'pages/index/index',
          subPackageRoots: ['pages/about/index'],
        }]
      },
    })
    const assetNames = (stats.toJson().assets || []).map(asset => asset.name)

    expect(assetNames).toContain('pages/index/app.js')
    expect(assetNames).toContain('pages/index/app.wxss')
    expect(assetNames).not.toContain('app.js')
  })
})


describe('编译模式模板缓存的平台隔离', () => {
  const originalTaroEnv = process.env.TARO_ENV

  afterEach(() => {
    templatesCache.length = 0
    if (originalTaroEnv === undefined) delete process.env.TARO_ENV
    else process.env.TARO_ENV = originalTaroEnv
  })

  async function emitTemplates (platform: string, newBlended: boolean, cached: boolean, scoped = false) {
    process.env.TARO_ENV = platform
    const { RawSource } = webpack.sources
    const assets = {
      'base.xml': new RawSource(scoped ? '' : '<template name="base"/>'),
      'pages/index-templates.xml': new RawSource('<template name="page"/>'),
      ...(scoped ? { 'pages/base.xml': new RawSource('<template name="scoped"/>') } : {}),
    }
    const compilation = {
      assets,
      dependencyFactories: new Map(),
      dependencyTemplates: new Map(),
      hooks: {
        renderManifest: new SyncWaterfallHook(['result', 'options']),
        contentHash: new SyncHook(['chunk']),
        processAssets: new AsyncSeriesHook(['assets']),
      },
    }
    const compiler = { webpack, hooks: { thisCompilation: new SyncHook(['compilation']) } }
    const plugin = new MiniCompileModePlugin({
      combination: {
        fileType: { templ: '.xml' },
        config: { newBlended, template: {} },
      },
    } as any)
    if (cached) templatesCache.push('<template name="cached"/>')
    plugin.apply(compiler as any)
    compiler.hooks.thisCompilation.call(compilation)
    await compilation.hooks.processAssets.promise(assets)
    return assets
  }

  test.each(['tt', 'alipay', 'swan', 'qq', 'jd', 'weapp'])('%s 普通编译命中缓存时不重写模板资源', async platform => {
    const assets = await emitTemplates(platform, false, true)
    expect(assets['base.xml'].source()).toBe('<template name="base"/>\n<template name="cached"/>')
    expect(assets['pages/index-templates.xml'].source()).toBe('<template name="page"/>')
    expect(templatesCache).toHaveLength(0)
  })

  test.each(['tt', 'alipay', 'swan', 'qq', 'jd'])('%s newBlended 命中缓存时不重写模板资源', async platform => {
    const assets = await emitTemplates(platform, true, true)
    expect(assets['base.xml'].source()).not.toContain('<import')
    expect(assets['pages/index-templates.xml'].source()).toBe('<template name="page"/>')
  })

  test('普通编译未命中缓存时仍生成模板引用', async () => {
    const assets = await emitTemplates('tt', false, false)
    expect(assets['base.xml'].source()).toContain('<import src="pages/index-templates.xml"/>')
    expect(assets['pages/index-templates.xml'].source()).toContain('<import src="../base.xml"/>')
  })

  test('微信混合编译命中缓存时仍生成模板引用', async () => {
    const assets = await emitTemplates('weapp', true, true)
    expect(assets['base.xml'].source()).toContain('<template name="cached"/>')
    expect(assets['base.xml'].source()).toContain('<import src="pages/index-templates.xml"/>')
  })

  test('微信混合编译继续使用分包局部模板', async () => {
    const assets = await emitTemplates('weapp', true, true, true)
    expect(assets['pages/base.xml'].source()).toContain('<import src="index-templates.xml"/>')
    expect(assets['pages/index-templates.xml'].source()).toContain('<import src="base.xml"/>')
    expect(assets['base.xml'].source()).not.toContain('<import')
  })
})
