import { normalizePath, promoteRelativePath, readConfig, resolveMainFilePath } from '@tarojs/helper'
import { isArray, isFunction, isString } from '@tarojs/shared'
import { AppConfig, SubPackage } from '@tarojs/taro'
import md5 from 'md5'
import path from 'path'
import SplitChunksPlugin from 'webpack/lib/optimize/SplitChunksPlugin'

import type { Chunk, ChunkGraph, Compilation, Compiler, Module, sources } from 'webpack'
import type { IFileType } from '../utils/types'

const PLUGIN_NAME = 'MiniSplitChunkPlugin' // 插件名
const SUB_COMMON_DIR = 'sub-common' // 分包公共依赖目录
const SUB_VENDORS_NAME = 'sub-vendors' // 分包 vendors 文件名

const FileExtsMap = {
  JS: '.js',
  JS_MAP: '.js.map',
  STYLE: '.wxss'
} // 默认支持的文件扩展名

// 插件 options
interface MiniSplitChunksPluginOption {
  exclude?: (string | ExcludeFunctionItem)[]
  fileType: IFileType
}

// 排除函数
interface ExcludeFunctionItem {
  (module: Module): boolean
}

// 依赖信息
interface DepInfo {
  identifier: string
  resource: string
  chunks: Set<string>
}

const INITIAL_CHUNK_FILTER = chunk => chunk.canBeInitial()
const ASYNC_CHUNK_FILTER = chunk => !chunk.canBeInitial()
const ALL_CHUNK_FILTER = _ => true

/**
 * @param {OptimizationSplitChunksSizes} value the sizes
 * @returns {SplitChunksSizes} normalized representation
 */
const normalizeSizes = (value, defaultSizeTypes: string[]) => {
  if (typeof value === 'number') {
    const o: Record<string, number> = {}
    for (const sizeType of defaultSizeTypes) o[sizeType] = value
    return o
  } else if (typeof value === 'object' && value !== null) {
    return { ...value }
  } else {
    return {}
  }
}

/**
 * @param {...SplitChunksSizes} sizes the sizes
 * @returns {SplitChunksSizes} the merged sizes
 */
const mergeSizes = (...sizes) => {
  /** @type {SplitChunksSizes} */
  let merged = {}
  for (let i = sizes.length - 1; i >= 0; i--) {
    merged = Object.assign(merged, sizes[i])
  }
  return merged
}

type TGetName = (name: string) => string
const normalizeName = (name: false | string | TGetName) => {
  if (typeof name === 'string') {
    return () => name
  }
  if (typeof name === 'function') {
    return name
  }
}

/**
 * @param {OptimizationSplitChunksCacheGroup["chunks"]} chunks the chunk filter option
 * @returns {ChunkFilterFunction} the chunk filter function
 */
const normalizeChunksFilter = chunks => {
  if (chunks === 'initial') {
    return INITIAL_CHUNK_FILTER
  }
  if (chunks === 'async') {
    return ASYNC_CHUNK_FILTER
  }
  if (chunks === 'all') {
    return ALL_CHUNK_FILTER
  }
  if (typeof chunks === 'function') {
    return chunks
  }
}

/**
 * @param {Module} module the module
 * @param {CacheGroupsContext} context context object
 * @returns {boolean} true, if the module should be selected
 */
type TestFunc = (module, context) => boolean
const checkTest = (test: undefined | boolean | string | RegExp | TestFunc, module, context): boolean => {
  if (test === undefined) return true
  if (typeof test === 'function') {
    return test(module, context)
  }
  if (typeof test === 'boolean') return test
  if (typeof test === 'string') {
    const name = module.nameForCondition()
    return name && name.startsWith(test)
  }
  if (test instanceof RegExp) {
    const name = module.nameForCondition()
    return name && test.test(name)
  }
  return false
}

/**
 * @param {Module} module the module
 * @returns {boolean} true, if the module should be selected
 */
type TModuleType = (type: string) => boolean
const checkModuleType = (test: undefined | string | RegExp | TModuleType, module): boolean => {
  if (test === undefined) return true
  if (typeof test === 'function') {
    return test(module.type)
  }
  if (typeof test === 'string') {
    const type = module.type
    return test === type
  }
  if (test instanceof RegExp) {
    const type = module.type
    return test.test(type)
  }
  return false
}

/**
 * @param {undefined|string|RegExp|Function} test type option
 * @param {Module} module the module
 * @returns {boolean} true, if the module should be selected
 */
const checkModuleLayer = (test, module): boolean => {
  if (test === undefined) return true
  if (typeof test === 'function') {
    return test(module.layer)
  }
  if (typeof test === 'string') {
    const layer = module.layer
    return test === '' ? !layer : layer && layer.startsWith(test)
  }
  if (test instanceof RegExp) {
    const layer = module.layer
    return test.test(layer)
  }
  return false
}

/**
 * @param {OptimizationSplitChunksCacheGroup} options the group options
 * @returns {CacheGroupSource} the normalized cached group
 */
const createCacheGroupSource = (options, key: string, defaultSizeTypes: string[]) => {
  const minSize = normalizeSizes(options.minSize, defaultSizeTypes)
  const minSizeReduction = normalizeSizes(
    options.minSizeReduction,
    defaultSizeTypes
  )
  const maxSize = normalizeSizes(options.maxSize, defaultSizeTypes)
  return {
    key,
    priority: options.priority,
    getName: normalizeName(options.name),
    chunksFilter: normalizeChunksFilter(options.chunks),
    enforce: options.enforce,
    minSize,
    minSizeReduction,
    minRemainingSize: mergeSizes(
      normalizeSizes(options.minRemainingSize, defaultSizeTypes),
      minSize
    ),
    enforceSizeThreshold: normalizeSizes(
      options.enforceSizeThreshold,
      defaultSizeTypes
    ),
    maxAsyncSize: mergeSizes(
      normalizeSizes(options.maxAsyncSize, defaultSizeTypes),
      maxSize
    ),
    maxInitialSize: mergeSizes(
      normalizeSizes(options.maxInitialSize, defaultSizeTypes),
      maxSize
    ),
    minChunks: options.minChunks,
    maxAsyncRequests: options.maxAsyncRequests,
    maxInitialRequests: options.maxInitialRequests,
    filename: options.filename,
    idHint: options.idHint,
    automaticNameDelimiter: options.automaticNameDelimiter,
    reuseExistingChunk: options.reuseExistingChunk,
    usedExports: options.usedExports
  }
}

/**
 * @param {GetCacheGroups | Record<string, false|string|RegExp|OptimizationSplitChunksGetCacheGroups|OptimizationSplitChunksCacheGroup>} cacheGroups the cache group options
 * @returns {GetCacheGroups} a function to get the cache groups
 */
const normalizeCacheGroups = (cacheGroups, defaultSizeTypes: string[]) => {
  if (typeof cacheGroups === 'function') {
    return cacheGroups
  }
  if (typeof cacheGroups === 'object' && cacheGroups !== null) {
    /** @type {(function(Module, CacheGroupsContext, CacheGroupSource[]): void)[]} */
    const handlers: any[] = []
    for (const key of Object.keys(cacheGroups)) {
      const option = cacheGroups[key]
      if (option === false) {
        continue
      }
      if (typeof option === 'string' || option instanceof RegExp) {
        const source = createCacheGroupSource({}, key, defaultSizeTypes)
        handlers.push((module, context, results) => {
          if (checkTest(option, module, context)) {
            results.push(source)
          }
        })
      } else if (typeof option === 'function') {
        const cache = new WeakMap()
        handlers.push((module, _, results) => {
          const result = option(module)
          if (result) {
            const groups = Array.isArray(result) ? result : [result]
            for (const group of groups) {
              const cachedSource = cache.get(group)
              if (cachedSource !== undefined) {
                results.push(cachedSource)
              } else {
                const source = createCacheGroupSource(
                  group,
                  key,
                  defaultSizeTypes
                )
                cache.set(group, source)
                results.push(source)
              }
            }
          }
        })
      } else {
        const source = createCacheGroupSource(option, key, defaultSizeTypes)
        handlers.push((module, context, results) => {
          if (
            checkTest(option.test, module, context) &&
            checkModuleType(option.type, module) &&
            checkModuleLayer(option.layer, module)
          ) {
            results.push(source)
          }
        })
      }
    }
    /**
     * @param {Module} module the current module
     * @param {CacheGroupsContext} context the current context
     * @returns {CacheGroupSource[]} the matching cache groups
     */
    const fn = (module, context) => {
      /** @type {CacheGroupSource[]} */
      const results = []
      for (const fn of handlers) {
        fn(module, context, results)
      }
      return results
    }
    return fn
  }
  // eslint-disable-next-line react/display-name
  return () => null
}

/**
 * 继承 SplitChunksPlugin 的插件，用于将分包公共依赖提取到单独的文件中
 */
export default class MiniSplitChunksPlugin extends SplitChunksPlugin {
  options: any
  subCommonDeps: Map<string, DepInfo>
  subCommonChunks: Map<string, Set<string>>
  subPackagesVendors: Map<string, Chunk>
  context: string
  distPath: string
  exclude: (string | ExcludeFunctionItem)[]
  isDevMode: boolean
  subPackages: SubPackage[]
  subRoots: string[]
  subRootRegExps: RegExp[]
  fileType: IFileType
  assets: { [pathname: string]: sources.Source }

  constructor (options: MiniSplitChunksPluginOption) {
    super()
    this.subCommonDeps = new Map()
    this.subCommonChunks = new Map()
    this.subPackagesVendors = new Map()
    this.distPath = ''
    this.exclude = options.exclude || []
    this.fileType = options.fileType || {
      style: '.wxss',
      config: '.json',
      script: '.js',
      templ: '.wxml',
      xs: '.wxs'
    }
    FileExtsMap.STYLE = this.fileType.style
  }

  apply (compiler: Compiler) {
    const { webpack, context, options } = compiler
    const { util, Compilation, sources } = webpack
    const { ConcatSource, RawSource } = sources

    this.context = context
    this.subPackages = this.getSubpackageConfig(compiler).map((subPackage: SubPackage) => ({
      ...subPackage,
      root: this.formatSubRoot(subPackage.root)
    }))
    if (this.subPackages.length === 0) {
      return
    }
    this.subRoots = this.subPackages.map((subPackage: SubPackage) => subPackage.root)
    this.subRootRegExps = this.subRoots.map((subRoot: string) => new RegExp(`^${subRoot}\\/`))
    this.distPath = options.output.path || ''
    this.isDevMode = options.mode === 'development'

    /**
     * 调用父类SplitChunksPlugin的apply方法，注册相关处理事件
     */
    super.apply(compiler)

    /**
     * 当一个编译创建完成时，调用该方法
     */
    compiler.hooks.thisCompilation.tap(PLUGIN_NAME, (compilation: Compilation) => {
      /**
       * 在chunk优化阶段的开始时，调用该方法
       */
      compilation.hooks.optimizeChunks.tap(PLUGIN_NAME, (chunks: Chunk[]) => {
        const splitChunksOriginConfig = {
          ...options.optimization?.splitChunks
        }

        this.subCommonDeps = new Map()
        this.subCommonChunks = new Map()
        this.subPackagesVendors = new Map()

        /**
         * 找出分包入口chunks
         */
        const subChunks: Chunk[] = []
        for (const chunk of chunks) {
          if (this.isSubChunk(chunk)) subChunks.push(chunk)
        }

        if (subChunks.length === 0) {
          this.options = {
            ...this.options,
            maxInitialRequests: Infinity,
            getCacheGroups: normalizeCacheGroups({ ...splitChunksOriginConfig.cacheGroups }, this.options.defaultSizeTypes)
          }
          return
        }

        const chunkGraph = compilation.chunkGraph

        subChunks.forEach((subChunk: Chunk) => {
          const modulesIterable = chunkGraph.getOrderedChunkModulesIterable(subChunk, util.comparators.compareModulesByIdentifier)
          for (const module of modulesIterable) {
            if (this.isExternalModule(module)) {
              return
            }

            if (!this.hasModuleId(module)) {
              return
            }

            if (this.hasExclude() && this.isExcludeModule(module)) {
              return
            }

            const chunks: Chunk[] = Array.from(chunkGraph.getModuleChunks(module))
            const chunkNames: string[] = chunks.map(chunk => chunk.name)
            /**
             * 找出没有被主包引用，且被多个分包引用的module，并记录在subCommonDeps中
             */
            if (!this.hasMainChunk(chunkNames) && this.isSubsDep(chunkNames)) {
              const { resource, _identifier: identifier } = module as any
              const depName = md5(resource ?? identifier)
              if (!this.subCommonDeps.has(depName)) {
                const subCommonDepChunks = new Set(chunkNames)

                this.subCommonDeps.set(depName, {
                  identifier,
                  resource,
                  chunks: subCommonDepChunks
                })
              } else {
                const subCommonDep: DepInfo = this.subCommonDeps.get(depName) as DepInfo

                chunks.map(chunk => subCommonDep.chunks.add(chunk.name))
                this.subCommonDeps.set(depName, subCommonDep)
              }
            }
          }
        })

        /**
         * 用新的option配置生成新的cacheGroups配置
         */
        this.options = {
          ...this.options,
          maxInitialRequests: Infinity,
          getCacheGroups: normalizeCacheGroups({
            ...splitChunksOriginConfig?.cacheGroups || {},
            ...this.getSubPackageVendorsCacheGroup(),
            ...this.getSubCommonCacheGroup()
          }, this.options.defaultSizeTypes)
        }
      })

      /**
       * 收集分包下的sub-vendors和sub-common下的公共模块信息
       */
      compilation.hooks.afterOptimizeChunks.tap(PLUGIN_NAME, chunks => {
        const existSubCommonDeps = new Map()

        for (const chunk of chunks) {
          const chunkName = chunk.name

          if (this.matchSubVendors(chunk)) {
            const subRoot = this.subRoots.find(subRoot => new RegExp(`^${subRoot}\\/`).test(chunkName)) as string

            this.subPackagesVendors.set(subRoot, chunk)
          }

          if (this.matchSubCommon(chunk)) {
            const depName = chunkName.replace(new RegExp(`^${SUB_COMMON_DIR}\\/(.*)`), '$1')

            if (this.subCommonDeps.has(depName)) {
              existSubCommonDeps.set(depName, this.subCommonDeps.get(depName))
            }
          }
        }

        this.setChunkSubCommons(existSubCommonDeps)
        this.subCommonDeps = existSubCommonDeps
      })

      compilation.hooks.processAssets.tap({
        name: PLUGIN_NAME,
        stage: Compilation.PROCESS_ASSETS_STAGE_ANALYSE // see below for more stages
      }, (assets) => {
        this.assets = assets
      })
    })

    compiler.hooks.emit.tapAsync(PLUGIN_NAME, this.tryAsync((compilation: Compilation) => {
      for (const entryName of compilation.entries.keys()) {
        if (this.isSubEntry(entryName)) {
          const subRoot = this.subRoots.find(subRoot => new RegExp(`^${subRoot}\\/`).test(entryName)) as string
          const subCommon = [...(this.subCommonChunks.get(entryName) || [])]
          for (const key in FileExtsMap) {
            const ext = FileExtsMap[key]
            if (ext === FileExtsMap.JS || ext === FileExtsMap.STYLE) {
              const source = new ConcatSource()
              const chunkName = `${entryName}${ext}`
              const chunkAbsolutePath = path.resolve(this.distPath, chunkName)
              const subVendorsPath = path.join(subRoot, `${SUB_VENDORS_NAME}${ext}`)
              // 将子包 vendors 插入到 entry 中
              if (this.assets[normalizePath(subVendorsPath)]) {
                const subVendorsAbsolutePath = path.resolve(this.distPath, subVendorsPath)
                const vendorsRelativePath = this.getRealRelativePath(chunkAbsolutePath, subVendorsAbsolutePath)
                if (ext === FileExtsMap.STYLE) {
                  source.add(`@import ${JSON.stringify(`${vendorsRelativePath}`)};`)
                }
                if (ext === FileExtsMap.JS) {
                  source.add(`require(${JSON.stringify(`${vendorsRelativePath}`)});`)
                }
              }
              // 将子包下的 common 模块替换为父包下的 common 模块
              subCommon.forEach(moduleName => {
                const moduleFileName = `${moduleName}${ext}`
                const moduleFilePath = path.join(SUB_COMMON_DIR, moduleFileName)
                const subRootModuleFilePath = path.join(subRoot, moduleFilePath)
                const assetSource = this.assets[normalizePath(moduleFilePath)]
                if (assetSource) {
                  const moduleAbsolutePath = path.resolve(this.distPath, subRootModuleFilePath)
                  const chunkRelativePath = this.getRealRelativePath(path.resolve(this.distPath, chunkName), moduleAbsolutePath)
                  this.assets[normalizePath(subRootModuleFilePath)] = {
                    size: () => assetSource.size(),
                    source: () => assetSource.source(),
                    updateHash: () => assetSource.updateHash,
                    buffer: () => assetSource.buffer(),
                    map: () => assetSource.map(),
                    sourceAndMap: () => assetSource.sourceAndMap()
                  }
                  if (ext === FileExtsMap.STYLE) {
                    source.add(`@import ${JSON.stringify(`${chunkRelativePath}`)};`)
                  }
                  if (ext === FileExtsMap.JS) {
                    source.add(`require(${JSON.stringify(`${chunkRelativePath}`)});`)
                  }
                }
              })
              if (this.assets[chunkName]) {
                const originSource = this.assets[chunkName].source()
                if (ext === FileExtsMap.STYLE && typeof originSource === 'string') {
                  if (originSource.indexOf('@charset') > -1) {
                    this.assets[chunkName] = new RawSource(`@charset "UTF-8";${source.source()}${originSource.replace('@charset "UTF-8";', '')}`)
                  } else {
                    this.assets[chunkName] = new RawSource(`${source.source()}${originSource}`)
                  }
                }
                if (ext === FileExtsMap.JS && typeof originSource === 'string') {
                  if (originSource.indexOf('use strict') > -1) {
                    this.assets[chunkName] = new RawSource(`"use strict";${source.source()}${originSource.replace('"use strict";', '')}`)
                  } else {
                    this.assets[chunkName] = new RawSource(`${source.source()}${originSource}`)
                  }
                }
              } else {
                this.assets[chunkName] = new RawSource(`${source.source()}`)
              }
            }
          }
        }
      }
      /**
       * 根目录下的sub-common资源删掉不输出
       */
      for (const assetPath in this.assets) {
        if (new RegExp(`^${SUB_COMMON_DIR}\\/.*`).test(assetPath)) {
          delete this.assets[assetPath]
        }
      }
    }))
  }

  /**
   * 自动驱动 tapAsync
   */
  tryAsync = fn => async (arg, callback) => {
    try {
      await fn(arg)
      callback()
    } catch (err) {
      callback(err)
    }
  }

  /**
   * 根据 webpack entry 配置获取入口文件路径
   */
  getAppEntry (compiler: Compiler) {
    const { entry } = compiler.options
    if (isFunction(entry)) {
      return ''
    }
    function getEntryPath (entry) {
      const app = entry.app
      if (Array.isArray(app)) {
        return app[0]
      } else if (Array.isArray(app.import)) {
        return app.import[0]
      }
      return app
    }
    return getEntryPath(entry)
  }

  /**
   * 获取分包配置
   */
  getSubpackageConfig (compiler: Compiler): SubPackage[] {
    const appEntry = this.getAppEntry(compiler)
    const appConfigPath = this.getConfigFilePath(appEntry)
    const appConfig: AppConfig = readConfig(appConfigPath)

    return appConfig.subPackages || appConfig.subpackages || []
  }

  /**
   * 根据 app、页面、组件的路径获取对应的 config 配置文件的路径
   */
  getConfigFilePath (filePath: string): string {
    return resolveMainFilePath(`${filePath.replace(path.extname(filePath), '')}.config`)
  }

  /**
   * 去掉尾部的/
   */
  formatSubRoot (subRoot: string): string {
    const lastApl = subRoot[subRoot.length - 1]

    if (lastApl === '/') {
      subRoot = subRoot.slice(0, subRoot.length - 1)
    }
    return subRoot
  }

  isSubChunk (chunk: Chunk): boolean {
    const isSubChunk = this.subRootRegExps.find(subRootRegExp => subRootRegExp.test(chunk.name))

    return !!isSubChunk
  }

  /**
   * 判断是否是子 entry & 排除.config entry
   */
  isSubEntry (entry: string): boolean {
    return !!this.subRootRegExps.find(subRootRegExp => subRootRegExp.test(entry)) && entry.indexOf('.config') === -1
  }

  /**
   * match *\/sub-vendors
   */
  matchSubVendors (chunk: Chunk): boolean {
    const subVendorsRegExps = this.subRoots.map(subRoot => new RegExp(`^${normalizePath(path.join(subRoot, SUB_VENDORS_NAME))}$`))
    const isSubVendors = subVendorsRegExps.find(subVendorsRegExp => subVendorsRegExp.test(chunk.name))

    return !!isSubVendors
  }

  /**
   * match sub-common\/*
   */
  matchSubCommon (chunk: Chunk): boolean {
    return new RegExp(`^${SUB_COMMON_DIR}\\/`).test(chunk.name)
  }

  /**
   * 判断module有没被主包引用
   */
  hasMainChunk (chunkNames: string[]): boolean {
    /**
     * 遍历chunk，如果其中有一个chunk，无法匹配分包root，则视为非分包的chunk
     */
    return !!chunkNames.find((chunkName) => !(this.subRootRegExps.find(subRootRegExp => subRootRegExp.test(chunkName))))
  }

  /**
   * 判断该module有没被多个分包引用
   */
  isSubsDep (chunkNames: string[]): boolean {
    const chunkSubRoots: Set<string> = new Set()

    chunkNames.forEach((chunkName: string) => {
      this.subRoots.forEach((subRoot: string) => {
        if (new RegExp(`^${subRoot}\\/`).test(chunkName)) {
          chunkSubRoots.add(subRoot)
        }
      })
    })
    return chunkSubRoots.size > 1
  }

  /**
   * 仅分包有引用的module抽取到分包下的sub-vendors
   */
  getSubPackageVendorsCacheGroup () {
    const subPackageVendorsCacheGroup = {}

    this.subRoots.forEach(subRoot => {
      subPackageVendorsCacheGroup[subRoot] = {
        test: (module, { chunkGraph }: { chunkGraph: ChunkGraph }) => {
          if (this.hasExclude() && this.isExcludeModule(module)) {
            return false
          }
          const chunks: any = Array.from(chunkGraph.getModuleChunksIterable(module))
          return chunks.every(chunk => new RegExp(`^${subRoot}\\/`).test(chunk.name))
        },
        name: normalizePath(path.join(subRoot, SUB_VENDORS_NAME)),
        minChunks: 2,
        priority: 10000
      }
    })
    return subPackageVendorsCacheGroup
  }

  /**
   * 没有被主包引用， 且被多个分包引用， 提取成单个模块，输出到sub-common下
   */
  getSubCommonCacheGroup () {
    const subCommonCacheGroup = {}

    this.subCommonDeps.forEach((depInfo: DepInfo, depName: string) => {
      const cacheGroupName = normalizePath(path.join(SUB_COMMON_DIR, depName))

      subCommonCacheGroup[cacheGroupName] = {
        name: cacheGroupName,
        test: module => {
          if (!module.resource) {
            return !!module._identifier && module._identifier === depInfo.identifier
          }
          return module.resource === depInfo.resource
        },
        priority: 1000
      }
    })
    return subCommonCacheGroup
  }

  hasExclude (): boolean {
    return isArray(this.exclude) && this.exclude.length > 0
  }

  isExcludeModule (module: any): boolean {
    const moduleResource = module.resource

    for (let i = 0; i < this.exclude.length; i++) {
      const excludeItem = this.exclude[i]

      if (isString(excludeItem) && excludeItem === moduleResource) {
        return true
      }

      if (isFunction(excludeItem) && excludeItem(module)) {
        return true
      }
    }
    return false
  }

  setChunkSubCommons (subCommonDeps: Map<string, DepInfo>) {
    const subCommonChunks: Map<string, Set<string>> = new Map()

    subCommonDeps.forEach((depInfo: DepInfo, depName: string) => {
      const chunks: string[] = [...depInfo.chunks]
      chunks.forEach(chunk => {
        if (subCommonChunks.has(chunk)) {
          const chunkSubCommon = subCommonChunks.get(chunk) as Set<string>

          chunkSubCommon.add(depName)
          subCommonChunks.set(chunk, chunkSubCommon)
        } else {
          subCommonChunks.set(chunk, new Set([depName]))
        }
      })
    })
    this.subCommonChunks = subCommonChunks
  }

  /**
   * 获取page相对于公共模块的路径
   */
  getRealRelativePath (from: string, to: string): string {
    return promoteRelativePath(path.relative(from, to))
  }

  /**
   * 判断module为external module
   */
  isExternalModule (module: any) {
    return !!module.external
  }

  /**
   * 判断是否存在resource和_identifier
   */
  hasModuleId (module: any) {
    if (module.resource) {
      return true
    }

    if (module._identifier) {
      return true
    }

    return false
  }
}
