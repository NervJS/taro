import path from 'node:path'

import { REG_SCRIPTS, REG_STYLE } from '@tarojs/helper'

import { createAsyncCommonChunkName, getAsyncRootAssetNames, getAsyncRootForModule, getSingleAsyncRootForModules, getSourceRootForResource, normalizePathForAsyncSubPackage } from '../utils/asyncSubPackage'

import type { SubPackage } from '@tarojs/taro'
import type { Compiler } from 'webpack'
import type TaroMiniPlugin from './MiniPlugin'
import type { AsyncSubPackageRuntimeRoot } from './SubPackageIndiePlugin'

const PLUGIN_NAME = 'TaroAsyncSubPackagePlugin'
const ASYNC_SUBPACKAGE_ENTRY = 'index'
const COMMON_CACHE_GROUP_PATCHED = Symbol.for('taroAsyncSubPackageCommonCacheGroupPatched')

function getModuleResource (module: any): string {
  return (module?.resource || module?.nameForCondition?.() || '').replace(/\?.*$/, '')
}

function isJavaScriptModule (module: any): boolean {
  const moduleType = module?.type || ''
  const resource = getModuleResource(module)
  if (moduleType.startsWith('css') || REG_STYLE.test(resource)) return false
  return REG_SCRIPTS.test(resource)
}

function getAsyncRootFromChunkName (chunkName: string | undefined, asyncRootMap: Map<string, string>): string | false {
  if (!chunkName) return false
  const normalizedChunkName = normalizePathForAsyncSubPackage(chunkName)
  const sourceRoot = Array.from(asyncRootMap.keys()).find(root => {
    const normalizedRoot = normalizePathForAsyncSubPackage(root)
    return normalizedChunkName === normalizedRoot || normalizedChunkName.startsWith(`${normalizedRoot}/`)
  })
  return sourceRoot ? asyncRootMap.get(sourceRoot) || false : false
}

function getAsyncRootFromChunks (chunks: any[], asyncRootMap: Map<string, string>): string | false {
  const asyncRoots = new Set<string>()
  for (const chunk of chunks) {
    const asyncRoot = getAsyncRootFromChunkName(chunk?.name, asyncRootMap)
    if (!asyncRoot) return false
    asyncRoots.add(asyncRoot)
  }

  if (asyncRoots.size !== 1) return false
  return Array.from(asyncRoots)[0]
}

function createAsyncSplitChunkName (asyncRoot: string, chunks: any[]): string {
  const chunkNames = chunks
    .map(chunk => chunk?.name || String(chunk?.id || 'common'))
    .sort()
    .join('~')
  return createAsyncCommonChunkName(asyncRoot, chunkNames || 'common')
}

function createMiniAppConfigContent (content: Record<string, any>, subPackages: SubPackage[]) {
  const result: Record<string, any> = { ...content, subPackages }
  // subPackageIndie/subpackages 是 Taro 编译期配置，不能透出到微信小程序 app.json。
  delete result.subPackageIndie
  return result
}

function createRelativeRequestFromRoot (fromRoot: string, toEntry: string): string {
  const fromParts = normalizePathForAsyncSubPackage(fromRoot).split('/').filter(Boolean)
  const toParts = normalizePathForAsyncSubPackage(toEntry).split('/').filter(Boolean)

  while (fromParts.length && toParts.length && fromParts[0] === toParts[0]) {
    fromParts.shift()
    toParts.shift()
  }

  const request = [...fromParts.map(() => '..'), ...toParts].join('/') || '.'
  return request.startsWith('.') ? request : `./${request}`
}

function createNormalizedRuntimeRootEntries (asyncRootEntries: AsyncSubPackageRuntimeRoot[]) {
  return asyncRootEntries.map(({ sourceRoot, asyncRoot }) => {
    const normalizedSourceRoot = normalizePathForAsyncSubPackage(sourceRoot)
    const normalizedAsyncRoot = normalizePathForAsyncSubPackage(asyncRoot)
    return [
      normalizedSourceRoot,
      normalizedAsyncRoot,
      createRelativeRequestFromRoot(normalizedSourceRoot, normalizedAsyncRoot)
    ]
  })
}

function createChunkFilenameRuntimeSource (Template: any, getChunkScriptFilename: string) {
  return [
    `var asyncSubPackageChunkFilename = ${getChunkScriptFilename};`,
    `${getChunkScriptFilename} = function(chunkId) {`,
    Template.indent([
      'return asyncSubPackageChunkFilename(chunkId);'
    ]),
    '};'
  ]
}

function createRequestResolverRuntimeSource (Template: any) {
  return [
    'var resolveAsyncSubPackageRequest = function(rawUrl) {',
    Template.indent([
      'for (var i = 0; i < asyncSubPackageRootEntries.length; i++) {',
      Template.indent([
        'var asyncRoot = asyncSubPackageRootEntries[i][1];',
        'var asyncRootRequest = asyncSubPackageRootEntries[i][2];',
        'if (rawUrl === asyncRoot) return asyncRootRequest;',
        'if (rawUrl.indexOf(asyncRoot + "/") === 0) return asyncRootRequest + rawUrl.slice(asyncRoot.length);'
      ]),
      '}',
      'return rawUrl;'
    ]),
    '};'
  ]
}

function createRequireAsyncLoaderRuntimeSource (Template: any, loadScript: string) {
  return [
    'var asyncSubPackageInProgress = {};',
    `${loadScript} = function(url, done) {`,
    Template.indent([
      'var rawUrl = (url || "").replace(/^\\/+/, "").replace(/\\.js$/, "");',
      'var request = resolveAsyncSubPackageRequest(rawUrl);',
      'if (asyncSubPackageInProgress[request]) { asyncSubPackageInProgress[request].push(done); return; }',
      'asyncSubPackageInProgress[request] = [done];',
      'var finish = function(event) {',
      Template.indent([
        'var handlers = asyncSubPackageInProgress[request];',
        'delete asyncSubPackageInProgress[request];',
        'handlers && handlers.forEach(function(handler) { handler(event); });'
      ]),
      '};',
      'require.async(request).then(function() {',
      Template.indent('finish({ type: "load", target: { src: request } });'),
      '}, function(error) {',
      Template.indent('finish({ type: "error", target: { src: request }, error: error });'),
      '});'
    ]),
    '};'
  ]
}

function createMiniCssRuntimeSource (Template: any, ensureChunkHandlers: string) {
  return [
    `${ensureChunkHandlers}.miniCss = function(chunkId, promises) {`,
    Template.indent([
      '// asyncSubPackage 的样式已在构建产物阶段合并回 sourceRoot 页面样式。',
      '// 小程序环境没有 document，不能执行 mini-css-extract-plugin 的浏览器 CSS loader。'
    ]),
    '};'
  ]
}

function createMiniAsyncSubPackageRuntimeSource (
  Template: any,
  runtimeGlobals: { loadScript: string, ensureChunkHandlers: string, getChunkScriptFilename: string, publicPath: string },
  asyncRootEntries: AsyncSubPackageRuntimeRoot[]
) {
  const { loadScript, ensureChunkHandlers, getChunkScriptFilename, publicPath } = runtimeGlobals
  const asyncRootRuntimeEntries = createNormalizedRuntimeRootEntries(asyncRootEntries)

  return Template.asString([
    `${publicPath} = "";`,
    `var asyncSubPackageRootEntries = ${JSON.stringify(asyncRootRuntimeEntries)};`,
    ...createChunkFilenameRuntimeSource(Template, getChunkScriptFilename),
    ...createRequestResolverRuntimeSource(Template),
    ...createRequireAsyncLoaderRuntimeSource(Template, loadScript),
    ...createMiniCssRuntimeSource(Template, ensureChunkHandlers)
  ])
}

type AsyncSubPackageRuntimeGlobals = {
  loadScript: string
  ensureChunkHandlers: string
  getChunkScriptFilename: string
  publicPath: string
}

function createMiniAsyncSubPackageRuntimeModuleClass (
  webpack: any,
  Template: any,
  runtimeGlobals: AsyncSubPackageRuntimeGlobals
) {
  const RuntimeModule = webpack.RuntimeModule
  const stageAttach = RuntimeModule.STAGE_ATTACH || 10

  return class MiniAsyncSubPackageRuntimeModule extends RuntimeModule {
    private readonly asyncRootEntries: AsyncSubPackageRuntimeRoot[]

    constructor (asyncRootEntries: AsyncSubPackageRuntimeRoot[]) {
      // 在 webpack 原生 runtime module 之后执行，稳定覆盖浏览器 script/css loader。
      super('mini async subpackage chunk loader', stageAttach)
      this.asyncRootEntries = asyncRootEntries
    }

    generate () {
      return createMiniAsyncSubPackageRuntimeSource(Template, runtimeGlobals, this.asyncRootEntries)
    }
  }
}

/**
 * 异步分包插件：集中处理 asyncSubPackage 的 chunk 归属、运行时加载补丁、异步分包入口和 app.json 注册。
 *
 * 当前方案保留 webpack 原生 import()，让 webpack 继续生成异步 chunk；随后在产物阶段把这些 chunk
 * 移到配置的 asyncRoot 下，并生成微信可识别的 asyncRoot/index 占位页面作为分包加载入口。
 */
export default class AsyncSubPackagePlugin {
  miniPlugin: TaroMiniPlugin
  asyncRootMap: Map<string, string> = new Map()
  asyncRuntimeRoots: AsyncSubPackageRuntimeRoot[] = []
  private appliedCompilers: WeakSet<Compiler> = new WeakSet()
  private miniHooksApplied = false
  private asyncModuleCache = new WeakMap<any, string | null | undefined>()
  private asyncChunkRootCache = new WeakMap<any, string | null>()
  private asyncChunkSourceRoots = new Map<string, Set<string>>()

  constructor (miniPlugin: TaroMiniPlugin, asyncRootMap?: Map<string, string>) {
    this.miniPlugin = miniPlugin
    if (asyncRootMap) {
      this.updateAsyncRootMap(asyncRootMap)
    }
  }

  updateAsyncRootMap (asyncRootMap: Map<string, string>) {
    this.asyncRootMap = new Map(asyncRootMap)
    this.asyncRuntimeRoots = Array.from(asyncRootMap.entries()).map(([sourceRoot, asyncRoot]) => ({ sourceRoot, asyncRoot }))
    // asyncSubPackage 依赖 webpack 看到原生 import() 后生成异步 chunk。
    // 这里通知 babel-preset-taro 不要再把 import() 提前转换成 require()。
    ;(global as any).__taroAsyncSubPackageUseWebpackImport = true
  }

  updateAsyncRuntimeRoots (asyncRuntimeRoots: AsyncSubPackageRuntimeRoot[]) {
    this.asyncRuntimeRoots = asyncRuntimeRoots.map(item => ({ ...item }))
  }

  apply (compiler?: Compiler) {
    if (compiler && !this.appliedCompilers.has(compiler)) {
      this.appliedCompilers.add(compiler)
      compiler.hooks.compilation.tap(PLUGIN_NAME, () => {
        this.asyncModuleCache = new WeakMap()
        this.asyncChunkRootCache = new WeakMap()
        this.asyncChunkSourceRoots = new Map()
      })
      this.setupAsyncSplitChunks(compiler)
      this.setupAsyncChunkOptimization(compiler)
      this.setupAsyncChunkRuntime(compiler)
      this.setupAsyncChunkAssetExtraction(compiler)
    }

    if (!this.miniHooksApplied) {
      this.miniHooksApplied = true
      this.setupSubPackageRegistration()
    }
  }

  // ==================== Async SplitChunks ====================

  private setupAsyncSplitChunks (compiler: Compiler) {
    const splitChunks = compiler.options.optimization?.splitChunks
    if (!splitChunks) return

    const cacheGroups = splitChunks.cacheGroups || {}
    const commonCacheGroup = (cacheGroups as any).common
    if (commonCacheGroup && commonCacheGroup !== false && !commonCacheGroup[COMMON_CACHE_GROUP_PATCHED]) {
      const originalCommonTest = commonCacheGroup.test
      commonCacheGroup.test = (module: any, context: any) => {
        // 只保护纯 asyncSubPackage 模块，避免被默认 common 抽到主包 common.js。
        // 被 initial chunk 静态引用的共享模块仍应交给默认 common 处理。
        if (this.isPureAsyncSubPackageModule(module, context)) return false
        return typeof originalCommonTest === 'function' ? originalCommonTest(module, context) : originalCommonTest !== false
      }
      // 同一插件实例多次 apply、或 webpack-chain 多次构建 options 时，避免对 test 反复套娃。
      Object.defineProperty(commonCacheGroup, COMMON_CACHE_GROUP_PATCHED, { value: true, enumerable: false })
    }

    (cacheGroups as any).asyncSubPackage = {
      chunks: 'async',
      minChunks: 2,
      minSize: 0,
      priority: 20,
      enforce: true,
      name: (_module: any, chunks: any[]) => {
        const asyncRoot = getAsyncRootFromChunks(chunks, this.asyncRootMap)
        if (!asyncRoot) return false
        return createAsyncSplitChunkName(asyncRoot, chunks)
      },
      test: (module: any, context: any) => this.isAsyncSubPackageModule(module, context),
    }
    splitChunks.cacheGroups = cacheGroups
  }

  private getCachedAsyncRootForModule (module: any, context: any): string | null | undefined {
    if (!module) return undefined
    if (this.asyncModuleCache.has(module)) return this.asyncModuleCache.get(module)
    // getAsyncRootForModule 内部会主动写入 cache（包括递归路径上遇到的所有 module）。
    return getAsyncRootForModule(module, this.miniPlugin.options.sourceDir, this.asyncRootMap, context?.moduleGraph, undefined, this.asyncModuleCache)
  }

  private isAsyncSubPackageModule (module: any, context: any): boolean {
    if (this.asyncRootMap.size === 0) return false
    if (!isJavaScriptModule(module)) return false

    const asyncRoot = this.getCachedAsyncRootForModule(module, context)
    return Boolean(asyncRoot)
  }

  private isPureAsyncSubPackageModule (module: any, context: any): boolean {
    if (!this.isAsyncSubPackageModule(module, context)) return false

    const chunks = Array.from(context?.chunkGraph?.getModuleChunksIterable?.(module) || [])
    // splitChunks test 没有 chunkGraph 时不要过度排除，交回默认 common cacheGroup。
    if (chunks.length === 0) return false

    return chunks.every((chunk: any) => !chunk.canBeInitial?.())
  }

  // ==================== Async Chunk Optimization ====================

  private getSingleSourceRoot (sourceRoots: Set<string>): string | null {
    if (sourceRoots.size !== 1) return null
    return Array.from(sourceRoots)[0]
  }

  private getAsyncRootFromSourceRoots (sourceRoots: Set<string>): string | null {
    const asyncRoots = new Set<string>()

    for (const sourceRoot of sourceRoots) {
      const asyncRoot = this.asyncRootMap.get(sourceRoot)
      if (asyncRoot) {
        asyncRoots.add(asyncRoot)
        if (asyncRoots.size > 1) return null
      }
    }

    return asyncRoots.size === 1 ? Array.from(asyncRoots)[0] : null
  }

  private getSourceRootsFromChunkGroupOrigins (chunk: any): Set<string> {
    const sourceRoots = new Set<string>()
    const sourceDir = this.miniPlugin.options.sourceDir

    for (const group of chunk.groupsIterable || []) {
      for (const origin of group.origins || []) {
        const originModules = [origin?.module, origin?.originModule]
        for (const originModule of originModules) {
          const sourceRoot = getSourceRootForResource(getModuleResource(originModule), sourceDir, this.asyncRootMap)
          if (sourceRoot) sourceRoots.add(sourceRoot)
        }
      }
    }

    return sourceRoots
  }

  private setupAsyncChunkOptimization (compiler: Compiler) {
    compiler.hooks.compilation.tap(PLUGIN_NAME, (compilation: any) => {
      compilation.hooks.optimizeChunks.tap(PLUGIN_NAME, chunks => {
        if (this.asyncRootMap.size === 0) return

        for (const chunk of chunks) {
          // 入口 chunk 名要在 app.json/页面注册中保持稳定，不能被改成 asyncRoot 路径。
          if (chunk.hasRuntime?.() || chunk.canBeInitial?.()) continue
          const modules = Array.from(compilation.chunkGraph.getChunkModulesIterable(chunk))
          const jsModules = modules.filter(module => isJavaScriptModule(module))
          if (jsModules.length === 0) continue

          const sourceRoots = this.getSourceRootsFromChunkGroupOrigins(chunk)
          let asyncRoot = this.asyncChunkRootCache.get(chunk)
          if (!this.asyncChunkRootCache.has(chunk)) {
            asyncRoot = getSingleAsyncRootForModules(
              jsModules,
              this.miniPlugin.options.sourceDir,
              this.asyncRootMap,
              compilation.moduleGraph,
              this.asyncModuleCache
            ) || this.getAsyncRootFromSourceRoots(sourceRoots)
            this.asyncChunkRootCache.set(chunk, asyncRoot || null)
          }
          if (!asyncRoot) continue

          const fallbackName = jsModules
            .map(module => path.posix.basename(getModuleResource(module)).replace(/\?.*$/, ''))
            .filter(Boolean)
            .sort()
            .join('~') || 'common'
          const asyncChunkName = createAsyncCommonChunkName(asyncRoot, chunk.name || String(chunk.id || chunk.debugId || fallbackName))
          chunk.name = asyncChunkName

          if (sourceRoots.size > 0) {
            this.asyncChunkSourceRoots.set(asyncChunkName, new Set(sourceRoots))
          }
        }
      })
    })
  }

  // ==================== Async Chunk Runtime ====================

  private setupAsyncChunkRuntime (compiler: Compiler) {
    const webpack = compiler.webpack as any
    const { RuntimeGlobals, RuntimeModule, Template } = webpack
    const loadScript = RuntimeGlobals?.loadScript
    const ensureChunkHandlers = RuntimeGlobals?.ensureChunkHandlers
    const getChunkScriptFilename = RuntimeGlobals?.getChunkScriptFilename
    const publicPath = RuntimeGlobals?.publicPath
    if (!loadScript || !ensureChunkHandlers || !getChunkScriptFilename || !publicPath || !RuntimeModule) return

    const MiniAsyncSubPackageRuntimeModule = createMiniAsyncSubPackageRuntimeModuleClass(
      webpack,
      Template,
      { loadScript, ensureChunkHandlers, getChunkScriptFilename, publicPath }
    )

    compiler.hooks.compilation.tap(PLUGIN_NAME, (compilation: any) => {
      const runtimeAppliedChunks = new WeakSet<any>()
      const addMiniAsyncRuntimeModule = (chunk: any) => {
        if (this.asyncRootMap.size === 0 || runtimeAppliedChunks.has(chunk)) return
        runtimeAppliedChunks.add(chunk)
        compilation.addRuntimeModule(chunk, new MiniAsyncSubPackageRuntimeModule(this.asyncRuntimeRoots))
        return true
      }

      // 不依赖 runtime.js 文本格式，也不只依赖某一个 runtime requirement：
      // dev/prod 下 webpack 可能通过不同 requirement 触发异步 chunk runtime。
      compilation.hooks.runtimeRequirementInTree.for(loadScript).tap(PLUGIN_NAME, addMiniAsyncRuntimeModule)
      compilation.hooks.runtimeRequirementInTree.for(ensureChunkHandlers).tap(PLUGIN_NAME, addMiniAsyncRuntimeModule)
      compilation.hooks.runtimeRequirementInTree.for(getChunkScriptFilename).tap(PLUGIN_NAME, addMiniAsyncRuntimeModule)
    })
  }

  // ==================== Async Chunk Asset Extraction ====================

  private setupAsyncChunkAssetExtraction (compiler: Compiler) {
    compiler.hooks.compilation.tap(PLUGIN_NAME, (compilation: any) => {
      // PROCESS_ASSETS_STAGE_OPTIMIZE_TRANSFER 在 webpack 5 中为 300；fallback 仅保留极旧版本兼容。
      const stage = (compilation.constructor as any).PROCESS_ASSETS_STAGE_OPTIMIZE_TRANSFER ?? 300
      compilation.hooks.processAssets.tap(
        { name: PLUGIN_NAME, stage },
        () => {
          if (this.asyncRootMap.size === 0) return
          const { RawSource } = compilation.compiler.webpack.sources
          this.moveAsyncRootStylesToSourceRoots(compilation, RawSource)
          this.moveAsyncRootTemplatesToSourceRoots(compilation)
          this.createAsyncRootEntries(compilation, RawSource)
        }
      )
    })
  }

  private createAsyncRootEntries (compilation: any, RawSource: any) {
    const templateExt = this.miniPlugin.options.fileType.templ || '.wxml'
    const configExt = this.miniPlugin.options.fileType.config || '.json'

    // 多个 sourceRoot 可能指向同一个 asyncRoot；同一 asyncRoot 的 index 占位只需要生成一次。
    const uniqueAsyncRoots = new Set(this.asyncRootMap.values())
    for (const asyncRoot of uniqueAsyncRoots) {
      const jsAssets = getAsyncRootAssetNames(compilation.assets, asyncRoot)
        .filter(assetName => assetName !== `${asyncRoot}/${ASYNC_SUBPACKAGE_ENTRY}.js`)
        .sort()
      if (jsAssets.length === 0) continue

      // 微信 require.async 只能稳定加载 app.json 中注册过的分包页面入口。
      // 因此 asyncRoot 只注册 index 页面，index.js 再同步 require 真实 webpack async chunk，
      // 让 webpack JSONP runtime 完成 chunk 注册。
      const requires = jsAssets
        .map(assetName => `require('./${path.posix.basename(assetName)}')`)
        .join('\n')
      compilation.assets[`${asyncRoot}/${ASYNC_SUBPACKAGE_ENTRY}.js`] = new RawSource(requires)
      compilation.assets[`${asyncRoot}/${ASYNC_SUBPACKAGE_ENTRY}${configExt}`] = new RawSource('{}')
      compilation.assets[`${asyncRoot}/${ASYNC_SUBPACKAGE_ENTRY}${templateExt}`] = new RawSource('<view />')
    }
  }

  private moveAsyncRootTemplatesToSourceRoots (compilation: any) {
    const templateExt = this.miniPlugin.options.fileType.templ || '.wxml'
    const asyncRoots = new Set(this.asyncRootMap.values())

    for (const asyncRoot of asyncRoots) {
      const templateAssets = Object.keys(compilation.assets)
        .filter(assetName => assetName.startsWith(`${asyncRoot}/`) && assetName.endsWith(`-templates${templateExt}`))

      for (const assetName of templateAssets) {
        const templateName = path.posix.basename(assetName)
        const chunkName = `${asyncRoot}/${templateName.slice(0, -`-templates${templateExt}`.length)}`
        const sourceRoots = this.asyncChunkSourceRoots.get(chunkName)
        const sourceRoot = sourceRoots ? this.getSingleSourceRoot(sourceRoots) : null
        if (!sourceRoot) continue

        compilation.assets[`${sourceRoot}/${templateName}`] = compilation.assets[assetName]
        delete compilation.assets[assetName]
      }
    }
  }

  private moveAsyncRootStylesToSourceRoots (compilation: any, RawSource: any) {
    const styleExt = this.miniPlugin.options.fileType.style || '.wxss'
    const styleAssetReg = new RegExp(`\\${styleExt}$`)
    const asyncRoots = new Set(this.asyncRootMap.values())

    for (const asyncRoot of asyncRoots) {
      const asyncStyleAssets = Object.keys(compilation.assets)
        .filter(assetName => assetName.startsWith(`${asyncRoot}/`) && styleAssetReg.test(assetName))
      if (asyncStyleAssets.length === 0) continue

      for (const assetName of asyncStyleAssets) {
        const chunkName = assetName.slice(0, -styleExt.length)
        const sourceRoots = this.asyncChunkSourceRoots.get(chunkName)
        if (!sourceRoots?.size) continue

        // asyncRoot 下只保留 JS 与 index 占位页面；动态组件样式仍在父包页面上下文生效。
        // 单一页面使用的 async style 只并回该 sourceRoot；多个页面共用的 async style 复制到所有使用它的 sourceRoot。
        const asyncStyle = compilation.assets[assetName]?.source?.().toString() || ''
        for (const sourceRoot of sourceRoots) {
          const targetStyleAsset = `${sourceRoot}/index${styleExt}`
          const origin = compilation.assets[targetStyleAsset]?.source?.().toString() || ''
          compilation.assets[targetStyleAsset] = new RawSource([origin, asyncStyle].filter(Boolean).join('\n'))
        }
        delete compilation.assets[assetName]
      }
    }
  }

  // ==================== app.json Registration ====================

  private setupSubPackageRegistration () {
    this.miniPlugin.hooks.afterGenerateFiles.tap(PLUGIN_NAME, (compilation: any) => {
      if (this.asyncRootMap.size === 0) return
      const { RawSource } = (compilation.compiler?.webpack?.sources || require('webpack').sources) as any

      const appConfig = this.miniPlugin.appConfig
      const exist = (appConfig as any).subPackages || (appConfig as any).subpackages || []
      const news: SubPackage[] = []
      // 多个 sourceRoot 可以指向同一个 asyncRoot，app.json 中只能注册一次。
      // pages 固定为 index，避免把每个 webpack chunk 当成小程序页面。
      const asyncRoots = new Set(this.asyncRootMap.values())
      for (const asyncRoot of asyncRoots) {
        news.push({ root: asyncRoot, pages: [ASYNC_SUBPACKAGE_ENTRY], independent: false })
      }
      const mergedMap = new Map<string, SubPackage>()
      for (const item of [...exist, ...news]) {
        if (!item?.root || mergedMap.has(item.root)) continue
        mergedMap.set(item.root, item)
      }
      const merged = Array.from(mergedMap.values())
      ;(appConfig as any).subPackages = merged

      const appCfgPath = this.miniPlugin.getConfigFilePath(this.miniPlugin.appEntry)
      const appCfgName = path.basename(appCfgPath).replace(path.extname(appCfgPath), '')
      const fc = (this.miniPlugin as any).filesConfig?.[appCfgName]
      if (fc) {
        fc.content = createMiniAppConfigContent(fc.content, merged)
        compilation.assets[this.miniPlugin.getConfigPath(appCfgName)] = new RawSource(JSON.stringify(fc.content, null, 2))
      }
    })
  }
}
