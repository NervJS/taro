import path from 'node:path'

import { normalizePath, readConfig, resolveMainFilePath } from '@tarojs/helper'
import {
  type ISubCommonDepInfo,
  collectExistingSubCommonDeps,
  extractMiniAppEntryPath,
  formatSubRoot,
  hasMainPackageChunk,
  isExcludeSplitModule,
  isMultiSubPackageDep,
  processSubPackageSplitAssets,
  SUB_COMMON_DIR,
  SUB_VENDORS_NAME
} from '@tarojs/runner-utils/bundler/splitChunks'
import md5 from 'md5'
import SplitChunksPlugin from 'webpack/lib/optimize/SplitChunksPlugin'

import type { AppConfig, SubPackage } from '@tarojs/taro'
import type { Chunk, ChunkGraph, Compilation, Compiler, Module, sources } from 'webpack'
import type { IFileType } from '../utils/types'
import type { MiniCombination } from '../webpack/MiniCombination'

const PLUGIN_NAME = 'MiniSplitChunkPlugin' // 插件名

// 插件 options
interface MiniSplitChunksPluginOption {
  exclude?: (string | ExcludeFunctionItem)[]
  fileType: IFileType
  combination: MiniCombination
}

// 排除函数
interface ExcludeFunctionItem {
  (module: Module): boolean
}

// 依赖信息
type DepInfo = ISubCommonDepInfo

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
  combination: MiniCombination
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
    this.combination = options.combination
  }

  apply (compiler: Compiler) {
    const { webpack, context, options } = compiler
    const { util, Compilation, sources } = webpack

    this.context = context
    this.subPackages = this.getSubpackageConfig(compiler)
      .filter((subPackage: SubPackage) => !subPackage.independent)
      .map((subPackage: SubPackage) => ({
        ...subPackage,
        root: formatSubRoot(subPackage.root)
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

            if (this.isExcludeModule(module)) {
              return
            }

            const chunks: Chunk[] = Array.from(chunkGraph.getModuleChunks(module))
            const chunkNames: string[] = chunks.map(chunk => chunk.name!)
            /**
             * 找出没有被主包引用，且被多个分包引用的module，并记录在subCommonDeps中
             */
            if (!hasMainPackageChunk(chunkNames, this.subRootRegExps) && isMultiSubPackageDep(chunkNames, this.subRoots)) {
              const { resource, _identifier: identifier } = module as any
              const depName = md5(resource ?? identifier)
              if (!this.subCommonDeps.has(depName)) {
                const subCommonDepChunks = new Set(chunkNames)

                this.subCommonDeps.set(depName, {
                  identifier,
                  resource,
                  rawIdentifier: module.identifier(),
                  chunks: subCommonDepChunks
                })
              } else {
                const subCommonDep: DepInfo = this.subCommonDeps.get(depName) as DepInfo

                chunks.map(chunk => subCommonDep.chunks.add(chunk.name!))
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
        const { subPackagesVendors, existSubCommonDeps, subCommonChunks } = collectExistingSubCommonDeps(
          chunks,
          this.subRoots,
          this.subCommonDeps
        )
        this.subPackagesVendors = subPackagesVendors
        this.subCommonDeps = existSubCommonDeps
        this.subCommonChunks = subCommonChunks
      })

      /**
       * 处理分包文件
      */
      compilation.hooks.processAssets.tapAsync({
        name: PLUGIN_NAME,
        stage: Compilation.PROCESS_ASSETS_STAGE_ANALYSE // 对分包文件进行处理，放在内部处理 assets 的最后阶段，该 stage 是倒数第二个顺序
      }, this.tryAsync((assets: { [pathname: string]: sources.Source }) => {
        processSubPackageSplitAssets({
          assets,
          entryNames: compilation.entries.keys(),
          distPath: this.distPath,
          subRoots: this.subRoots,
          subRootRegExps: this.subRootRegExps,
          subCommonChunks: this.subCommonChunks,
          styleExt: this.fileType.style,
          extraExts: [this.fileType.templ],
          sources,
          copyAsset: assetSource => ({
            size: () => assetSource.size(),
            source: () => assetSource.source(),
            updateHash: () => assetSource.updateHash,
            buffer: () => assetSource.buffer(),
            map: () => assetSource.map(),
            sourceAndMap: () => assetSource.sourceAndMap()
          })
        })
      }))
    })
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
    return extractMiniAppEntryPath(compiler.options.entry)
  }

  /**
   * 获取分包配置
   */
  getSubpackageConfig (compiler: Compiler): SubPackage[] {
    const appEntry = this.getAppEntry(compiler)
    const appConfigPath = this.getConfigFilePath(appEntry)
    const appConfig: AppConfig = readConfig(appConfigPath, this.combination.config)

    return appConfig.subPackages || appConfig.subpackages || []
  }

  /**
   * 根据 app、页面、组件的路径获取对应的 config 配置文件的路径
   */
  getConfigFilePath (filePath: string): string {
    return resolveMainFilePath(`${filePath.replace(path.extname(filePath), '')}.config`)
  }

  isExcludeModule (module: any): boolean {
    return isExcludeSplitModule(module, this.exclude)
  }

  isSubChunk (chunk: Chunk): boolean {
    return Boolean(this.subRootRegExps.find(subRootRegExp => subRootRegExp.test(chunk.name!)))
  }

  /**
   * 仅分包有引用的module抽取到分包下的sub-vendors
   */
  getSubPackageVendorsCacheGroup () {
    const subPackageVendorsCacheGroup = {}

    this.subRoots.forEach(subRoot => {
      subPackageVendorsCacheGroup[subRoot] = {
        test: (module, { chunkGraph }: { chunkGraph: ChunkGraph }) => {
          if (this.isExcludeModule(module)) {
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
    return Boolean(module.resource || module._identifier)
  }
}
