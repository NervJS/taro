import * as path from 'path'
import * as fs from 'fs-extra'
import * as mkdirp from 'mkdirp'
import * as md5 from 'md5'
import * as webpack from 'webpack'
import * as SplitChunksPlugin from 'webpack/lib/optimize/SplitChunksPlugin'
import { ConcatSource } from 'webpack-sources'
import { AppConfig, SubPackage } from '@tarojs/taro'
import { resolveMainFilePath, readConfig, promoteRelativePath } from '@tarojs/helper'
import { isString, isFunction, isArray } from '@tarojs/shared'

const PLUGIN_NAME = 'MiniSplitChunkPlugin'
const SUB_COMMON_DIR = 'sub-common'
const SUB_VENDORS_NAME = 'sub-vendors'

enum FileExtsMap {
  JS = '.js',
  JS_MAP = '.js.map',
  STYLE = '.wxss'
}

interface MiniSplitChunksPluginOption {
  exclude?: (string | ExcludeFunctionItem)[]
}

interface ExcludeFunctionItem {
  (module: webpack.compilation.Module): boolean
}

interface DepInfo {
  identifier: string
  resource: string
  chunks: Set<string>
}

export default class MiniSplitChunksPlugin extends SplitChunksPlugin {
  options: any
  subCommonDeps: Map<string, DepInfo>
  chunkSubCommons: Map<string, Set<string>>
  subPackagesVendors: Map<string, webpack.compilation.Chunk>
  context: string
  distPath: string
  exclude: (string | ExcludeFunctionItem)[]
  isDevMode: boolean
  subPackages: SubPackage[]
  subRoots: string[]
  subRootRegExps: RegExp[]

  constructor (options: MiniSplitChunksPluginOption) {
    super()
    this.options = null
    this.subCommonDeps = new Map()
    this.chunkSubCommons = new Map()
    this.subPackagesVendors = new Map()
    this.distPath = ''
    this.exclude = options.exclude || []
  }

  apply (compiler: any) {
    this.context = compiler.context
    this.subPackages = this.getSubpackageConfig(compiler).map((subPackage: SubPackage) => ({
      ...subPackage,
      root: this.formatSubRoot(subPackage.root)
    }))
    this.subRoots = this.subPackages.map((subPackage: SubPackage) => subPackage.root)
    this.subRootRegExps = this.subRoots.map((subRoot: string) => new RegExp(`^${subRoot}\\/`))
    this.distPath = compiler?.options?.output?.path as string
    this.isDevMode = compiler.options.mode === 'development'

    /**
     * 调用父类SplitChunksPlugin的apply方法，注册相关处理事件
     */
    super.apply(compiler)

    compiler.hooks.compilation.tap(PLUGIN_NAME, (compilation: any) => {
      compilation.hooks.optimizeChunks.tap(PLUGIN_NAME, (chunks: webpack.compilation.Chunk[]) => {
        this.subCommonDeps = new Map()
        this.chunkSubCommons = new Map()
        this.subPackagesVendors = new Map()

        /**
         * 找出分包入口chunks
         */
        const subChunks = chunks.filter(chunk => this.isSubChunk(chunk))

        if (subChunks.length === 0) {
          return
        }

        subChunks.forEach((subChunk: webpack.compilation.Chunk) => {
          const modules = Array.from(subChunk.modulesIterable)

          modules.map((module: any) => {
            if (this.hasExclude() && this.isExcludeModule(module)) {
              return
            }

            const chunks: webpack.compilation.Chunk[] = Array.from(module.chunksIterable)

            /**
             * 找出没有被主包引用，且被多个分包引用的module，并记录在subCommonDeps中
             */
            if (!this.hasMainChunk(chunks) && this.isSubsDep(chunks)) {
              let depPath = ''
              let depName = ''

              if (module.resource) {
                depPath = module.resource
              } else {
                depPath = module._identifier
              }

              if (this.isDevMode) {
                /**
                 * 避免开发模式下，清除sub-common源目录后，触发重新编译时，sub-common目录缺失无变化的chunk导致文件copy失败的问题
                 */
                depName = md5(depPath + new Date().getTime())
              } else {
                depName = md5(depPath)
              }

              if (!this.subCommonDeps.has(depName)) {
                const subCommonDepChunks = new Set(chunks.map(chunk => chunk.name))

                this.subCommonDeps.set(depName, {
                  identifier: module._identifier,
                  resource: module.resource,
                  chunks: subCommonDepChunks
                })
              } else {
                const subCommonDep: DepInfo = this.subCommonDeps.get(depName) as DepInfo

                chunks.map(chunk => subCommonDep.chunks.add(chunk.name))
                this.subCommonDeps.set(depName, subCommonDep)
              }
            }
          })
        })

        /**
         * 用新的option配置生成新的cacheGroups配置
         */
        this.options = SplitChunksPlugin.normalizeOptions({
          ...compiler?.options?.optimization?.splitChunks,
          cacheGroups: {
            ...compiler?.options?.optimization?.splitChunks?.cacheGroups,
            ...this.getSubPackageVendorsCacheGroup(),
            ...this.getSubCommonCacheGroup()
          }
        })
      })

      /**
       * 收集分包下的sub-vendors和sub-common下的公共模块信息
       */
      compilation.hooks.afterOptimizeChunks.tap(PLUGIN_NAME, (chunks: webpack.compilation.Chunk[]) => {
        const existSubCommonDeps = new Map()

        chunks.forEach(chunk => {
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
        })

        this.setChunkSubCommons(existSubCommonDeps)
        this.subCommonDeps = existSubCommonDeps
      })

      /**
       * 往分包page头部添加require
       */
      compilation.chunkTemplate.hooks.renderWithEntry.tap(PLUGIN_NAME, (modules, chunk) => {
        if (this.isSubChunk(chunk)) {
          const chunkName = chunk.name
          const chunkSubRoot = this.subRoots.find(subRoot => new RegExp(`^${subRoot}\\/`).test(chunkName)) as string
          const chunkAbsulutePath = path.resolve(this.distPath, chunkName)
          const source = new ConcatSource()
          const hasSubVendors = this.subPackagesVendors.has(chunkSubRoot)
          const subVendors = this.subPackagesVendors.get(chunkSubRoot) as webpack.compilation.Chunk
          const subCommon = [...(this.chunkSubCommons.get(chunkName) || [])]

          /**
           * require该分包下的sub-vendors
           */
          if (hasSubVendors) {
            const subVendorsAbsolutePath = path.resolve(this.distPath, subVendors.name)
            const relativePath = this.getRealRelativePath(chunkAbsulutePath, subVendorsAbsolutePath)

            source.add(`require(${JSON.stringify(relativePath)});\n`)
          }

          // require sub-common下的模块
          if (subCommon.length > 0) {
            subCommon.forEach(moduleName => {
              const moduleAbsulutePath = path.resolve(this.distPath, chunkSubRoot, SUB_COMMON_DIR, moduleName)
              const relativePath = this.getRealRelativePath(chunkAbsulutePath, moduleAbsulutePath)

              source.add(`require(${JSON.stringify(relativePath)});\n`)
            })
          }

          source.add(modules)
          source.add(';')
          return source
        }
      })
    })

    compiler.hooks.emit.tapAsync(PLUGIN_NAME, this.tryAsync((compilation) => {
      const assets = compilation.assets
      const subChunks = compilation.entries.filter(entry => entry.miniType === 'PAGE' && this.isSubChunk(entry))

      subChunks.forEach(subChunk => {
        const subChunkName = subChunk.name
        const subRoot = this.subRoots.find(subRoot => new RegExp(`^${subRoot}\\/`).test(subChunkName)) as string
        const chunkWxssName = `${subChunkName}${FileExtsMap.STYLE}`
        const subCommon = [...(this.chunkSubCommons.get(subChunkName) || [])]
        const wxssAbsulutePath = path.resolve(this.distPath, chunkWxssName)
        const subVendorsWxssPath = path.join(subRoot, `${SUB_VENDORS_NAME}${FileExtsMap.STYLE}`)
        const source = new ConcatSource()

        if (assets[this.formatSystemPath(subVendorsWxssPath)]) {
          const subVendorsAbsolutePath = path.resolve(this.distPath, subVendorsWxssPath)
          const relativePath = this.getRealRelativePath(wxssAbsulutePath, subVendorsAbsolutePath)

          source.add(`@import ${JSON.stringify(relativePath)};\n`)
        }

        if (subCommon.length > 0) {
          subCommon.forEach(moduleName => {
            const wxssFileName = `${moduleName}${FileExtsMap.STYLE}`
            const wxssFilePath = path.join(SUB_COMMON_DIR, wxssFileName)

            if (assets[this.formatSystemPath(wxssFilePath)]) {
              const moduleAbsulutePath = path.resolve(this.distPath, subRoot, SUB_COMMON_DIR, wxssFileName)
              const relativePath = this.getRealRelativePath(wxssAbsulutePath, moduleAbsulutePath)

              source.add(`@import ${JSON.stringify(`${relativePath}`)};\n`)
            }
          })
        }

        if (assets[chunkWxssName]) {
          const originSource = assets[chunkWxssName].source()

          source.add(originSource)
        }

        assets[chunkWxssName] = {
          size: () => source.source().length,
          source: () => source.source()
        }
      })
    }))

    compiler.hooks.afterEmit.tap(PLUGIN_NAME, () => {
      const subCommonPath = path.resolve(this.distPath, SUB_COMMON_DIR)

      if (!fs.pathExistsSync(subCommonPath)) {
        return
      }

      this.subCommonDeps.forEach((subCommonDep, depName) => {
        const chunks = [...subCommonDep.chunks]
        const needCopySubRoots = chunks.reduce((set: Set<string>, chunkName: string) => {
          const subRoot = this.subRoots.find(subRoot => new RegExp(`^${subRoot}\\/`).test(chunkName))

          if (subRoot) {
            set.add(subRoot)
          }
          return set
        }, new Set())

        /**
         * sub-common下模块copy到对应分包路径下：分包/sub-common
         */
        needCopySubRoots.forEach(needCopySubRoot => {
          for (const key in FileExtsMap) {
            const ext = FileExtsMap[key]
            const fileNameWithExt = `${depName}${ext}`
            const sourcePath = path.resolve(subCommonPath, fileNameWithExt)
            const targetDirPath = path.resolve(this.distPath, needCopySubRoot, SUB_COMMON_DIR)
            const targetPath = path.resolve(targetDirPath, fileNameWithExt)

            /**
             * 检查是否存在目录，没有则创建
             */
            mkdirp.sync(targetDirPath)

            if (fs.pathExistsSync(sourcePath)) {
              fs.outputFileSync(targetPath, fs.readFileSync(sourcePath))
            }
          }
        })
      })

      /**
       * 复制完成后清理根目录的sub-common
       */
      fs.emptyDirSync(subCommonPath)
      fs.removeSync(subCommonPath)
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
  getAppEntry (compiler: webpack.Compiler): string {
    const originalEntry = compiler.options.entry as webpack.Entry

    return path.resolve(this.context, originalEntry.app[0])
  }

  /**
   * 获取分包配置
   */
  getSubpackageConfig (compiler: webpack.Compiler): SubPackage[] {
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

  isSubChunk (chunk: webpack.compilation.Chunk): boolean {
    const isSubChunk = this.subRootRegExps.find(subRootRegExp => subRootRegExp.test(chunk.name))

    return !!isSubChunk
  }

  /**
   * match *\/sub-vendors
   */
  matchSubVendors (chunk: webpack.compilation.Chunk): boolean {
    const subVendorsRegExps = this.subRoots.map(subRoot => new RegExp(`^${this.formatSystemPath(path.join(subRoot, SUB_VENDORS_NAME))}$`))
    const isSubVendors = subVendorsRegExps.find(subVendorsRegExp => subVendorsRegExp.test(chunk.name))

    return !!isSubVendors
  }

  /**
   * match sub-common\/*
   */
  matchSubCommon (chunk: webpack.compilation.Chunk): boolean {
    return new RegExp(`^${SUB_COMMON_DIR}\\/`).test(chunk.name)
  }

  /**
   * 判断module有没被主包引用
   */
  hasMainChunk (chunks: webpack.compilation.Chunk[]): boolean {
    const chunkNames: string[] = chunks.map(chunk => chunk.name)
    let hasMainChunk = false

    /**
     * 遍历chunk，如果其中有一个chunk，无法匹配分包root，则视为非分包的chunk
     */
    chunkNames.forEach((chunkName: string) => {
      const isMatch: RegExp | undefined = this.subRootRegExps.find(subRootRegExp => subRootRegExp.test(chunkName))

      if (!isMatch) {
        hasMainChunk = true
      }
    })
    return hasMainChunk
  }

  /**
   * 判断该module有没被多个分包引用
   */
  isSubsDep (chunks: webpack.compilation.Chunk[]): boolean {
    const chunkNames: string[] = chunks.map(chunk => chunk.name)
    const chunkSubRoots: Set<string> = new Set()

    chunkNames.forEach((chunkName: string) => {
      this.subRoots.forEach((subRoot: string) => {
        if (new RegExp(`^${subRoot}\\/`).test(chunkName)) {
          chunkSubRoots.add(subRoot)
        }
      })
    })
    return [...chunkSubRoots].length > 1
  }

  /**
   * 仅分包有引用的module抽取到分包下的sub-vendors
   */
  getSubPackageVendorsCacheGroup () {
    const subPackageVendorsCacheGroup = {}

    this.subRoots.forEach(subRoot => {
      subPackageVendorsCacheGroup[subRoot] = {
        test: (module, chunks) => {
          if (this.hasExclude() && this.isExcludeModule(module)) {
            return false
          }

          return chunks.every(chunk => new RegExp(`^${subRoot}\\/`).test(chunk.name))
        },
        name: this.formatSystemPath(path.join(subRoot, SUB_VENDORS_NAME)),
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
      const cacheGroupName = this.formatSystemPath(path.join(SUB_COMMON_DIR, depName))

      subCommonCacheGroup[cacheGroupName] = {
        name: cacheGroupName,
        test: module => {
          if (!module.resource) {
            return module._identifier === depInfo.identifier
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
    const chunkSubCommons: Map<string, Set<string>> = new Map()

    subCommonDeps.forEach((depInfo: DepInfo, depName: string) => {
      const chunks: string[] = [...depInfo.chunks]

      chunks.forEach(chunk => {
        if (chunkSubCommons.has(chunk)) {
          const chunkSubCommon = chunkSubCommons.get(chunk) as Set<string>

          chunkSubCommon.add(depName)
          chunkSubCommons.set(chunk, chunkSubCommon)
        } else {
          chunkSubCommons.set(chunk, new Set([depName]))
        }
      })
    })
    this.chunkSubCommons = chunkSubCommons
  }

  /**
   * 获取page相对于公共模块的路径
   */
  getRealRelativePath (from: string, to: string): string {
    return promoteRelativePath(path.relative(from, to))
  }

  /**
   * 将window系统下的路径分隔符转成/
   */
  formatSystemPath (p) {
    return p.replace(/\\/g, '/')
  }
}
