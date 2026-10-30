import path from 'node:path'

import { REG_SCRIPTS, REG_STYLE } from '@tarojs/helper'
import postcss from 'postcss'

import { SHARED_GLOBAL_ASYNC } from '../shared-runtime/constants'
import { createAsyncCommonChunkName, getAsyncRootAssetNames, getAsyncRootForModule, getSingleAsyncRootForModules, getSourceRootForResource, normalizePathForAsyncSubPackage } from '../utils/asyncSubPackage'
import { allocateAsyncChunks, resolveAsyncSubPackageRule } from '../utils/asyncSubPackageRules'
import { createSharedRuntimeWaitSource } from '../utils/asyncSubPackageRuntime'

import type { SubPackage } from '@tarojs/taro'
import type { Compiler } from 'webpack'
import type { NormalizedAsyncSubPackageRule } from '../utils/asyncSubPackageRules'
import type { SharedRuntimeGate } from '../utils/asyncSubPackageRuntime'
import type TaroMiniPlugin from './MiniPlugin'
import type { AsyncSubPackageRuntimeRoot } from './SubPackageIndiePlugin'

const PLUGIN_NAME = 'TaroAsyncSubPackagePlugin'
const ASYNC_SUBPACKAGE_ENTRY = 'index'
const COMMON_CACHE_GROUP_PATCHED = Symbol.for('taroAsyncSubPackageCommonCacheGroupPatched')
const STYLE_IMPORT_REQUEST_REG = /^\s*(?:url\(\s*)?(?:"([^"]*)"|'([^']*)'|([^'")\s]+))/i

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

function createRequireAsyncLoaderRuntimeSource (
  Template: any,
  loadScript: string,
  sharedRuntimeGate?: SharedRuntimeGate | null
) {
  const waitSource = sharedRuntimeGate
    ? createSharedRuntimeWaitSource(Template, sharedRuntimeGate)
    : []
  const loadThenSource = sharedRuntimeGate
    ? [
      'require.async(request).then(function() {',
      Template.indent('return waitSharedRuntime();'),
      '}).then(function() {',
      Template.indent('finish({ type: "load", target: { src: request } });'),
      '}, function(error) {',
      Template.indent('finish({ type: "error", target: { src: request }, error: error });'),
      '});'
    ]
    : [
      'require.async(request).then(function() {',
      Template.indent('finish({ type: "load", target: { src: request } });'),
      '}, function(error) {',
      Template.indent('finish({ type: "error", target: { src: request }, error: error });'),
      '});'
    ]

  return [
    ...waitSource,
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
      ...loadThenSource
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
  asyncRootEntries: AsyncSubPackageRuntimeRoot[],
  sharedRuntimeGate?: SharedRuntimeGate | null
) {
  const { loadScript, ensureChunkHandlers, getChunkScriptFilename, publicPath } = runtimeGlobals
  const asyncRootRuntimeEntries = createNormalizedRuntimeRootEntries(asyncRootEntries)

  return Template.asString([
    `${publicPath} = "";`,
    `var asyncSubPackageRootEntries = ${JSON.stringify(asyncRootRuntimeEntries)};`,
    ...createChunkFilenameRuntimeSource(Template, getChunkScriptFilename),
    ...createRequestResolverRuntimeSource(Template),
    ...createRequireAsyncLoaderRuntimeSource(Template, loadScript, sharedRuntimeGate),
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
  runtimeGlobals: AsyncSubPackageRuntimeGlobals,
  sharedRuntimeGate?: SharedRuntimeGate | null
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
      return createMiniAsyncSubPackageRuntimeSource(Template, runtimeGlobals, this.asyncRootEntries, sharedRuntimeGate)
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
  private asyncModuleSourceRootCache = new WeakMap<any, Set<string>>()
  private asyncChunkRootCache = new WeakMap<any, string | null>()
  private asyncChunkSourceRoots = new Map<string, Set<string>>()
  asyncRules: NormalizedAsyncSubPackageRule[] = []
  private usedAsyncRoots = new Set<string>()
  private asyncChunkConsumers = new Map<string, string[]>()

  constructor (miniPlugin: TaroMiniPlugin, asyncRootMap?: Map<string, string>) {
    this.miniPlugin = miniPlugin
    if (asyncRootMap) {
      this.updateAsyncRootMap(asyncRootMap)
    }
  }

  updateAsyncRootMap (asyncRootMap: Map<string, string>) {
    this.asyncRootMap = new Map(asyncRootMap)
    this.asyncRuntimeRoots = Array.from(asyncRootMap.entries()).map(([sourceRoot, asyncRoot]) => ({ sourceRoot, asyncRoot }))
  }

  updateAsyncRuntimeRoots (asyncRuntimeRoots: AsyncSubPackageRuntimeRoot[]) {
    this.asyncRuntimeRoots = asyncRuntimeRoots.map(item => ({ ...item }))
  }

  updateAsyncRules (rules: NormalizedAsyncSubPackageRule[]) {
    this.asyncRules = rules.map(rule => ({ ...rule, matchedPages: [...rule.matchedPages] }))
  }

  private isEnabled (): boolean {
    return this.asyncRootMap.size > 0 || this.asyncRules.length > 0
  }

  private getConfiguredAsyncRoots (): string[] {
    const roots = new Set<string>()
    for (const root of this.asyncRootMap.values()) roots.add(root)
    for (const rule of this.asyncRules) {
      for (const root of rule.asyncRoots) roots.add(root)
    }
    return Array.from(roots)
  }

  apply (compiler?: Compiler) {
    if (compiler && !this.appliedCompilers.has(compiler)) {
      this.appliedCompilers.add(compiler)
      compiler.hooks.compilation.tap(PLUGIN_NAME, () => {
        this.asyncModuleCache = new WeakMap()
        this.asyncModuleSourceRootCache = new WeakMap()
        this.asyncChunkRootCache = new WeakMap()
        this.asyncChunkSourceRoots = new Map()
        this.usedAsyncRoots = new Set()
        this.asyncChunkConsumers = new Map()
      })
      this.setupAsyncBabel(compiler)
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

  private setupAsyncBabel (compiler: Compiler) {
    compiler.hooks.compilation.tap(PLUGIN_NAME, (_compilation, { normalModuleFactory }) => {
      normalModuleFactory.hooks.afterResolve.tap(PLUGIN_NAME, data => {
        if (!this.isEnabled()) return
        const { loaders } = data.createData
        if (!loaders) return

        let stamped = false
        for (const [index, loader] of loaders.entries()) {
          if (!/(^|[/\\])babel-loader([/\\]|$)/.test(loader.loader)) continue
          const options = loader.options
          // 仅处理对象 options；string options（inline query 形式）展开会产出
          // 字符索引对象，属于无效配置，直接跳过。
          if (!options || typeof options !== 'object') continue
          // 只为当前 compiler 传递 caller，不修改共享 loader 配置或用户 Babel 配置。
          loaders[index] = {
            ...loader,
            // 对象 options 默认按 rule path 生成稳定 ident，request 中序列化为
            // `loader??ident`；不区分 ident 时两种模式共享同一模块缓存键。
            ident: `${loader.ident ? `${loader.ident}|` : ''}taro-async-subpackage`,
            options: {
              ...options,
              caller: { ...options.caller, taroAsyncSubPackage: true },
            },
          }
          stamped = true
        }

        if (!stamped) return
        // NormalModule.identifier() 直接使用 createData.request，而 request 在 resolve
        // 阶段已用 stringifyLoadersAndResource 生成（afterResolve 之前），仅修改 loaders
        // 或 ident 不会改变 identifier。异步分包模块与普通模块会因此共享同一模块缓存键，
        // 两种 Babel 模式（保留 import() vs 转换为 require()）会相互污染。
        // 按 loaderToIdent 的序列化规则重算 request，使异步模式获得独立 identifier。
        data.createData.request = `${loaders
          .map(loader => {
            if (loader.options && typeof loader.options === 'object' && loader.ident) {
              return `${loader.loader}??${loader.ident}`
            }
            if (loader.options) {
              return `${loader.loader}?${typeof loader.options === 'string' ? loader.options : JSON.stringify(loader.options)}`
            }
            return loader.loader
          })
          .join('!')}!${data.createData.resource}`
      })
    })
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
        if (this.asyncRules.length > 0) {
          const key = chunks
            .map(chunk => chunk?.name || String(chunk?.id ?? chunk?.debugId ?? 'chunk'))
            .sort()
            .join('~')
          return `taro-async-shared-${key.replace(/[^a-zA-Z0-9_~-]/g, '_')}`
        }
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
    if (!this.isEnabled()) return false
    if (!isJavaScriptModule(module)) return false
    if (this.asyncRules.length > 0) return this.isPureAsyncModule(module, context)
    const asyncRoot = this.getCachedAsyncRootForModule(module, context)
    return Boolean(asyncRoot)
  }

  private isPureAsyncModule (module: any, context: any): boolean {
    const chunks = Array.from(context?.chunkGraph?.getModuleChunksIterable?.(module) || [])
    if (chunks.length === 0) return false
    return chunks.every((chunk: any) => !chunk.canBeInitial?.())
  }

  private isPureAsyncSubPackageModule (module: any, context: any): boolean {
    if (!this.isAsyncSubPackageModule(module, context)) return false
    return this.isPureAsyncModule(module, context)
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

  private getSourceRootsFromModule (module: any, moduleGraph: any, visited: Set<any> = new Set()): Set<string> {
    if (!module || visited.has(module)) return new Set()
    const cached = this.asyncModuleSourceRootCache.get(module)
    if (cached) return cached
    visited.add(module)

    const sourceRoot = getSourceRootForResource(
      getModuleResource(module),
      this.miniPlugin.options.sourceDir,
      this.asyncRootMap
    )
    if (sourceRoot) {
      const result = new Set([sourceRoot])
      this.asyncModuleSourceRootCache.set(module, result)
      return result
    }

    // 动态 import 的调用点可能位于页面外的共享模块（如 components/Demo/index.tsx），
    // 此时 origin 模块本身不属于任何 sourceRoot，需要沿 issuer 链回溯到真正使用它的页面。
    const result = new Set<string>()
    const issuerModules = new Set<any>()
    const incomingConnections = moduleGraph?.getIncomingConnections?.(module)
    if (incomingConnections) {
      for (const connection of incomingConnections) {
        if (connection?.originModule) issuerModules.add(connection.originModule)
      }
    }
    const issuer = moduleGraph?.getIssuer?.(module)
    if (issuer) issuerModules.add(issuer)

    for (const issuerModule of issuerModules) {
      const issuerSourceRoots = this.getSourceRootsFromModule(issuerModule, moduleGraph, new Set(visited))
      for (const issuerSourceRoot of issuerSourceRoots) {
        result.add(issuerSourceRoot)
      }
    }

    this.asyncModuleSourceRootCache.set(module, result)
    return result
  }

  private getSourceRootsFromChunkGroupOrigins (chunk: any, moduleGraph: any): Set<string> {
    const sourceRoots = new Set<string>()

    for (const group of chunk.groupsIterable || []) {
      for (const origin of group.origins || []) {
        const originModules = [origin?.module, origin?.originModule]
        for (const originModule of originModules) {
          const moduleSourceRoots = this.getSourceRootsFromModule(originModule, moduleGraph)
          for (const sourceRoot of moduleSourceRoots) {
            sourceRoots.add(sourceRoot)
          }
        }
      }
    }

    return sourceRoots
  }

  private setupAsyncChunkOptimization (compiler: Compiler) {
    compiler.hooks.compilation.tap(PLUGIN_NAME, (compilation: any) => {
      // legacy 模式保持 stage 0 的旧行为：此时 chunk 尚未被 SplitChunksPlugin 合并/抽取。
      compilation.hooks.optimizeChunks.tap(PLUGIN_NAME, chunks => {
        if (!this.isEnabled()) return
        // 规则模式统一在 SplitChunksPlugin 之后归属，见下方 stage 20 tap。
        if (this.asyncRules.length > 0) return

        for (const chunk of chunks) {
          // 入口 chunk 名要在 app.json/页面注册中保持稳定，不能被改成 asyncRoot 路径。
          if (chunk.hasRuntime?.() || chunk.canBeInitial?.()) continue
          const modules = Array.from(compilation.chunkGraph.getChunkModulesIterable(chunk))
          const jsModules = modules.filter(module => isJavaScriptModule(module))
          if (jsModules.length === 0) continue

          const sourceRoots = this.getSourceRootsFromChunkGroupOrigins(chunk, compilation.moduleGraph)
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
            this.usedAsyncRoots.add(asyncRoot)
            this.asyncChunkSourceRoots.set(asyncChunkName, new Set(sourceRoots))
            this.asyncChunkConsumers.set(
              asyncChunkName,
              Array.from(sourceRoots).map(root => `${root}/index`)
            )
          }
        }
      })

      // SplitChunksPlugin 在 STAGE_ADVANCED(10) 才把跨页共享模块抽成 taro-async-shared-*；
      // 规则模式必须在它之后归属，否则抽出的 chunk 不会被重命名、记录消费页面或回填样式。
      compilation.hooks.optimizeChunks.tap({ name: PLUGIN_NAME, stage: 20 }, chunks => {
        if (this.asyncRules.length === 0) return
        try {
          this.assignAsyncChunksByRules(compilation, chunks)
        } catch (error) {
          // webpack 5 的 seal 不会捕获 SyncHook tap 抛出的异常，compiler.run 回调不会触发；
          // 必须把 [taro asyncSubPackage] 错误写入 compilation.errors 才能进入 stats。
          compilation.errors.push(error instanceof Error ? error : new Error(String(error)))
        }
      })
    })
  }

  private getChunkKey (chunk: any): string {
    return chunk?.name || String(chunk?.id ?? chunk?.debugId ?? 'chunk')
  }

  private getChunkSize (chunk: any, chunkGraph: any): number {
    let size = 0
    for (const module of chunkGraph.getChunkModulesIterable(chunk)) {
      if (typeof module.size === 'function') size += module.size() || 0
    }
    return size
  }

  private getDeclaredPageSet (): Set<string> {
    const appConfig: any = this.miniPlugin.appConfig || {}
    const pages = new Set<string>(appConfig.pages || [])
    for (const subPackage of (appConfig.subPackages || appConfig.subpackages || [])) {
      for (const page of (subPackage.pages || [])) {
        pages.add(`${subPackage.root}/${page}`.replace(/\/{2,}/g, '/'))
      }
    }
    return pages
  }

  private getPageEntryModules (compilation: any): Map<any, string> {
    const declared = this.getDeclaredPageSet()
    const result = new Map<any, string>()
    for (const chunk of compilation.chunks) {
      if (!chunk.name || !declared.has(chunk.name)) continue
      if (!chunk.canBeInitial?.()) continue
      for (const module of compilation.chunkGraph.getChunkEntryModulesIterable(chunk)) {
        result.set(module, chunk.name)
      }
    }
    return result
  }

  private getPagePathsFromModule (
    module: any,
    moduleGraph: any,
    pageEntryModules: Map<any, string>,
    cache: WeakMap<any, Set<string>>,
    visiting: Set<any> = new Set()
  ): Set<string> {
    if (!module) return new Set()
    const cached = cache.get(module)
    if (cached) return cached
    const direct = pageEntryModules.get(module)
    if (direct) {
      const set = new Set([direct])
      cache.set(module, set)
      return set
    }
    if (visiting.has(module)) return new Set()
    visiting.add(module)
    const result = new Set<string>()
    const connections = moduleGraph.getIncomingConnections?.(module)
    if (connections) {
      for (const connection of connections) {
        const origin = connection?.originModule
        if (!origin) continue
        for (const page of this.getPagePathsFromModule(origin, moduleGraph, pageEntryModules, cache, visiting)) {
          result.add(page)
        }
      }
    }
    visiting.delete(module)
    cache.set(module, result)
    return result
  }

  private getConsumerPagesForChunk (
    chunk: any,
    compilation: any,
    pageEntryModules: Map<any, string>,
    cache: WeakMap<any, Set<string>>
  ): string[] {
    const pages = new Set<string>()
    const origins = new Set<any>()
    for (const group of chunk.groupsIterable || []) {
      for (const origin of group.origins || []) {
        if (origin?.module) origins.add(origin.module)
        if (origin?.originModule) origins.add(origin.originModule)
      }
    }
    for (const origin of origins) {
      for (const page of this.getPagePathsFromModule(origin, compilation.moduleGraph, pageEntryModules, cache)) {
        pages.add(page)
      }
    }
    if (pages.size === 0) {
      for (const module of compilation.chunkGraph.getChunkModulesIterable(chunk)) {
        for (const page of this.getPagePathsFromModule(module, compilation.moduleGraph, pageEntryModules, cache)) {
          pages.add(page)
        }
      }
    }
    return Array.from(pages).sort()
  }

  private assignAsyncChunksByRules (compilation: any, chunks: Iterable<any>) {
    const pageEntryModules = this.getPageEntryModules(compilation)
    const pageCache = new WeakMap<any, Set<string>>()
    const pending: Array<{ chunk: any, rule: NormalizedAsyncSubPackageRule, consumers: string[] }> = []

    for (const chunk of chunks) {
      if (chunk.hasRuntime?.() || chunk.canBeInitial?.()) continue
      const modules = Array.from(compilation.chunkGraph.getChunkModulesIterable(chunk))
      if (!modules.some(isJavaScriptModule)) continue

      const consumers = this.getConsumerPagesForChunk(chunk, compilation, pageEntryModules, pageCache)
      if (consumers.length === 0) continue

      const rule = resolveAsyncSubPackageRule(this.asyncRules, consumers)
      if (!rule) continue

      pending.push({ chunk, rule, consumers })
    }

    const byRule = new Map<NormalizedAsyncSubPackageRule, typeof pending>()
    for (const item of pending) {
      const list = byRule.get(item.rule) || []
      list.push(item)
      byRule.set(item.rule, list)
    }

    for (const [rule, items] of byRule) {
      const allocation = allocateAsyncChunks(
        rule,
        items.map(item => ({
          name: this.getChunkKey(item.chunk),
          size: this.getChunkSize(item.chunk, compilation.chunkGraph),
        }))
      )
      for (const item of items) {
        const asyncRoot = allocation.get(this.getChunkKey(item.chunk))
        if (!asyncRoot) continue
        const asyncChunkName = createAsyncCommonChunkName(asyncRoot, this.getChunkKey(item.chunk))
        item.chunk.name = asyncChunkName
        this.usedAsyncRoots.add(asyncRoot)
        this.asyncChunkConsumers.set(asyncChunkName, item.consumers)
      }
    }
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

    const sharedRuntimeGate: SharedRuntimeGate | null = this.miniPlugin.options.combination?.config?.sharedRuntime
      ? {
        globalObject: this.miniPlugin.options.combination?.config?.output?.globalObject || 'wx',
        globalKey: SHARED_GLOBAL_ASYNC,
      }
      : null
    const MiniAsyncSubPackageRuntimeModule = createMiniAsyncSubPackageRuntimeModuleClass(
      webpack,
      Template,
      { loadScript, ensureChunkHandlers, getChunkScriptFilename, publicPath },
      sharedRuntimeGate
    )

    compiler.hooks.compilation.tap(PLUGIN_NAME, (compilation: any) => {
      const runtimeAppliedChunks = new WeakSet<any>()
      const addMiniAsyncRuntimeModule = (chunk: any) => {
        if (!this.isEnabled() || runtimeAppliedChunks.has(chunk)) return
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
      compilation.hooks.processAssets.tapPromise(
        { name: PLUGIN_NAME, stage },
        async () => {
          if (!this.isEnabled()) return
          const { RawSource } = compilation.compiler.webpack.sources
          await this.moveAsyncRootStylesToConsumers(compilation, RawSource)
          this.moveAsyncRootTemplatesToConsumers(compilation)
          this.createAsyncRootEntries(compilation, RawSource)
        }
      )
    })
  }

  private createAsyncRootEntries (compilation: any, RawSource: any) {
    const templateExt = this.miniPlugin.options.fileType.templ || '.wxml'
    const configExt = this.miniPlugin.options.fileType.config || '.json'

    // 多个 sourceRoot 可能指向同一个 asyncRoot；同一 asyncRoot 的 index 占位只需要生成一次。
    // 规则模式只生成真正被使用的 asyncRoot；legacy 模式保持“配置即生成”的旧行为。
    const uniqueAsyncRoots = this.asyncRules.length > 0
      ? new Set(this.usedAsyncRoots)
      : new Set(this.asyncRootMap.values())
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

  private moveAsyncRootTemplatesToConsumers (compilation: any) {
    const templateExt = this.miniPlugin.options.fileType.templ || '.wxml'
    const isRulesMode = this.asyncRules.length > 0

    for (const asyncRoot of this.getConfiguredAsyncRoots()) {
      const templateAssets = Object.keys(compilation.assets)
        .filter(assetName => assetName.startsWith(`${asyncRoot}/`) && assetName.endsWith(`-templates${templateExt}`))

      for (const assetName of templateAssets) {
        const templateName = path.posix.basename(assetName)
        const chunkName = `${asyncRoot}/${templateName.slice(0, -`-templates${templateExt}`.length)}`
        const consumers = this.asyncChunkConsumers.get(chunkName)
        if (!consumers?.length) continue
        // legacy 保持旧产物：仅单一 sourceRoot 的模板回填，多消费方模板留在 asyncRoot 下。
        if (!isRulesMode && consumers.length !== 1) continue

        if (!isRulesMode) {
          const sourceRoots = this.asyncChunkSourceRoots.get(chunkName)
          const sourceRoot = sourceRoots ? this.getSingleSourceRoot(sourceRoots) : null
          // legacy 保持旧产物：仅单一 sourceRoot 的模板回填，多消费方模板留在 asyncRoot 下。
          if (!sourceRoot) continue
          compilation.assets[`${sourceRoot}/${templateName}`] = compilation.assets[assetName]
          delete compilation.assets[assetName]
          continue
        }

        for (const consumer of consumers) {
          const dir = path.posix.dirname(consumer)
          compilation.assets[`${dir}/${templateName}`] = compilation.assets[assetName]
        }
        delete compilation.assets[assetName]
      }
    }
  }

  private async moveAsyncRootStylesToConsumers (compilation: any, RawSource: any): Promise<void> {
    const styleExt = this.miniPlugin.options.fileType.style || '.wxss'
    const styleAssetReg = new RegExp(`\\${styleExt}$`)
    const isRulesMode = this.asyncRules.length > 0
    const warnedGroups = new Set<string>()

    for (const asyncRoot of this.getConfiguredAsyncRoots()) {
      const asyncStyleAssets = Object.keys(compilation.assets)
        .filter(assetName => assetName.startsWith(`${asyncRoot}/`) && styleAssetReg.test(assetName))
      if (asyncStyleAssets.length === 0) continue

      for (const assetName of asyncStyleAssets) {
        const chunkName = assetName.slice(0, -styleExt.length)
        const asyncStyle = compilation.assets[assetName]?.source?.().toString() || ''
        const targets = new Map<string, string | null>()

        if (isRulesMode) {
          const consumers = this.asyncChunkConsumers.get(chunkName)
          if (!consumers?.length) continue
          for (const consumer of consumers) {
            targets.set(`${consumer}${styleExt}`, null)
          }
        } else {
          const sourceRoots = this.asyncChunkSourceRoots.get(chunkName)
          if (!sourceRoots?.size) continue

          // 共享样式在每个已知组的 common 中保留一份；私有样式和未知组沿用 sourceRoot 回迁。
          for (const sourceRoot of sourceRoots) {
            const mainRoot = sourceRoots.size > 1
              ? this.miniPlugin.subPackageIndiePlugin?.getSubPackageIndieMatch(sourceRoot)?.config.mainPackageRoot
              : undefined
            targets.set(mainRoot ? `${mainRoot}/common${styleExt}` : `${sourceRoot}/index${styleExt}`, mainRoot || null)
          }
          const mainRoots = Array.from(new Set(targets.values())).filter((root): root is string => root !== null).sort()
          const warningKey = JSON.stringify([asyncRoot, mainRoots])
          if (mainRoots.length > 1 && !warnedGroups.has(warningKey)) {
            warnedGroups.add(warningKey)
            compilation.warnings.push(new compilation.compiler.webpack.WebpackError(
              `${PLUGIN_NAME}: async root "${asyncRoot}" shares styles across subPackageIndie groups (${mainRoots.join(', ')}); each group retains one copy.`
            ))
          }
        }

        for (const [targetStyleAsset, mainRoot] of targets) {
          const origin = compilation.assets[targetStyleAsset]?.source?.().toString() || ''
          const relocatedStyle = mainRoot
            ? await this.rebaseAsyncStyle(compilation, asyncStyle, assetName, targetStyleAsset)
            : asyncStyle
          compilation.assets[targetStyleAsset] = new RawSource([origin, relocatedStyle].filter(Boolean).join('\n'))
          if (mainRoot) this.ensureMainRootCommonStyleImport(compilation, RawSource, mainRoot, styleExt)
        }
        delete compilation.assets[assetName]
      }
    }
  }

  private async rebaseAsyncStyle (compilation: any, css: string, fromAsset: string, toAsset: string): Promise<string> {
    const from = path.resolve(compilation.outputOptions.path, fromAsset)
    const to = path.resolve(compilation.outputOptions.path, toAsset)
    const styles = postcss.parse(css, { from })
    styles.walkAtRules('import', rule => {
      const match = rule.params.match(STYLE_IMPORT_REQUEST_REG)
      const request = match?.[1] || match?.[2] || match?.[3]
      if (!request || /^(?:[a-z][a-z\d+.-]*:|[/#])/i.test(request)) return
      const [, requestPath, suffix] = request.match(/^([^?#]*)(.*)$/)!
      if (!requestPath) return

      const relativePath = path.relative(path.dirname(to), path.resolve(path.dirname(from), requestPath)).split(path.sep).join('/')
      const rebasedRequest = `${relativePath.startsWith('.') ? relativePath : `./${relativePath}`}${suffix}`
      const requestOffset = match![0].lastIndexOf(request)
      rule.params = `${rule.params.slice(0, requestOffset)}${rebasedRequest}${rule.params.slice(requestOffset + request.length)}`
    })
    const result = await postcss([require('postcss-url')({
      url: 'rebase',
      filter: (asset: { url: string }) => !/^(?:[a-z][a-z\d+.-]*:|[/#])/i.test(asset.url),
    })]).process(styles, { from, to })
    return result.css
  }

  private ensureMainRootCommonStyleImport (compilation: any, RawSource: any, mainRoot: string, styleExt: string): void {
    const appStyleAsset = `${mainRoot}/app${styleExt}`
    const commonStylePath = path.posix.resolve('/', mainRoot, `common${styleExt}`)
    const origin = compilation.assets[appStyleAsset]?.source?.().toString() || ''
    let imported = false
    postcss.parse(origin).walkAtRules('import', rule => {
      const match = rule.params.match(STYLE_IMPORT_REQUEST_REG)
      const request = match?.[1] || match?.[2] || match?.[3]
      if (request && path.posix.resolve('/', path.posix.dirname(appStyleAsset), request.split(/[?#]/)[0]) === commonStylePath) {
        imported = true
      }
    })
    if (imported) return

    // Encoding markers must stay ahead of generated imports.
    const prefix = origin.match(/^\uFEFF?(?:@charset\s+(?:"[^"]*"|'[^']*')\s*;\s*)?/i)?.[0] || ''
    const content = [`@import "./common${styleExt}";`, origin.slice(prefix.length)].filter(Boolean).join('\n')
    compilation.assets[appStyleAsset] = new RawSource(`${prefix}${content}`)
  }

  // ==================== app.json Registration ====================

  private setupSubPackageRegistration () {
    this.miniPlugin.hooks.afterGenerateFiles.tap(PLUGIN_NAME, (compilation: any) => {
      if (!this.isEnabled()) return
      const { RawSource } = (compilation.compiler?.webpack?.sources || require('webpack').sources) as any

      const appConfig = this.miniPlugin.appConfig
      const exist = (appConfig as any).subPackages || (appConfig as any).subpackages || []
      const news: SubPackage[] = []
      // 多个 sourceRoot 可以指向同一个 asyncRoot，app.json 中只能注册一次。
      // pages 固定为 index，避免把每个 webpack chunk 当成小程序页面。
      // 规则模式只注册真正被使用的 asyncRoot；legacy 模式保持旧行为。
      const asyncRoots = this.asyncRules.length > 0
        ? new Set(this.usedAsyncRoots)
        : new Set(this.asyncRootMap.values())
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
