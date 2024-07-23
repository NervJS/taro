import path from 'node:path'

import {
  fs,
  isAliasPath,
  isEmptyObject,
  META_TYPE,
  NODE_MODULES,
  printLog,
  processTypeEnum,
  readConfig,
  REG_NODE_MODULES,
  REG_NODE_MODULES_DIR,
  REG_STYLE,
  replaceAliasPath,
  resolveMainFilePath,
  SCRIPT_EXT
} from '@tarojs/helper'
import { urlToRequest } from 'loader-utils'
import EntryDependency from 'webpack/lib/dependencies/EntryDependency'

import TaroSingleEntryDependency from '../dependencies/TaroSingleEntryDependency'
import { componentConfig } from '../utils/component'
import { addRequireToSource, getChunkEntryModule, getChunkIdOrName } from '../utils/webpack'
import TaroNormalModulesPlugin from './TaroNormalModulesPlugin'
import TaroSingleEntryPlugin from './TaroSingleEntryPlugin'

import type { AppConfig, Config } from '@tarojs/taro'
import type { IMiniFilesConfig } from '@tarojs/taro/types/compile'
import type { Compilation, Compiler } from 'webpack'
import type { IComponent, IFileType } from '../utils/types'
import type { HarmonyCombination } from '../webpack/HarmonyCombination'
import type TaroNormalModule from './TaroNormalModule'

const PLUGIN_NAME = 'TaroHarmonyPlugin'
const CHILD_COMPILER_TAG = 'child'

interface ITaroHarmonyPluginOptions {
  commonChunks: string[]
  constantsReplaceList: Record<string, any>
  pxTransformConfig: {
    baseFontSize: number
    deviceRatio: any
    designWidth: number
    unitPrecision: number
    targetUnit: string
  }
  hot: boolean
  combination: HarmonyCombination
  loaderMeta?: Record<string, string>
}

interface IOptions extends ITaroHarmonyPluginOptions {
  sourceDir: string
  framework: string
  frameworkExts: string[]
  runtimePath: string | string[]
  fileType: IFileType
  logger?: {
    quiet?: boolean
  }
}

export interface IComponentObj {
  name?: string
  path: string | null
  type?: string
}

function isLoaderExist (loaders, loaderName: string) {
  return loaders.some(item => item.loader === loaderName)
}

// TODO 该插件仍在施工中，后续会逐步完善
export default class TaroHarmonyPlugin {
  /** 插件配置选项 */
  options: IOptions
  context: string
  /** app 入口文件路径 */
  appEntry: string
  /** app config 配置内容 */
  appConfig: AppConfig
  /** app、页面、组件的配置集合 */
  filesConfig: IMiniFilesConfig = {}
  isWatch = false
  /** 页面列表 */
  pages = new Set<IComponent>()
  components = new Set<IComponent>()
  nativeComponents = new Map<string, IComponent>()
  /** tabbar icon 图片路径列表 */
  tabBarIcons = new Set<string>()
  dependencies = new Map<string, TaroSingleEntryDependency>()
  themeLocation: string
  pageLoaderName = '@tarojs/taro-loader/lib/page'
  independentPackages = new Map<string, string[]>()

  constructor (options: ITaroHarmonyPluginOptions) {
    const { combination } = options
    const harmonyBuildConfig = combination.config
    this.options = {
      sourceDir: combination.sourceDir,
      framework: harmonyBuildConfig.framework || 'react',
      frameworkExts: harmonyBuildConfig.frameworkExts || [],
      runtimePath: harmonyBuildConfig.runtimePath || '',
      logger: harmonyBuildConfig.logger,
      fileType: harmonyBuildConfig.fileType,
      combination,
      commonChunks: options.commonChunks || ['runtime', 'vendors'],
      constantsReplaceList: options.constantsReplaceList,
      pxTransformConfig: options.pxTransformConfig,
      hot: options.hot,
      loaderMeta: options.loaderMeta || {},
    }
  }

  /**
   * 自动驱动 tapAsync
   */
  tryAsync<T extends Compiler | Compilation> (fn: (target: T) => Promise<any>) {
    return async (arg: T, callback: any) => {
      try {
        await fn(arg)
        callback()
      } catch (err) {
        callback(err)
      }
    }
  }

  /**
   * 插件入口
   */
  apply (compiler: Compiler) {
    this.context = compiler.context
    this.appEntry = this.getAppEntry(compiler)
    const {
      combination,
    } = this.options

    const {
      onCompilerMake,
      modifyBuildAssets,
      onParseCreateElement,
    } = combination.config

    /** build mode */
    compiler.hooks.run.tapAsync(
      PLUGIN_NAME,
      this.tryAsync<Compiler>(async compiler => {
        await this.run(compiler)
      })
    )

    /** watch mode */
    compiler.hooks.watchRun.tapAsync(
      PLUGIN_NAME,
      this.tryAsync<Compiler>(async compiler => {
        const changedFiles = this.getChangedFiles(compiler)
        if (changedFiles && changedFiles.size > 0) {
          this.isWatch = true
        }
        await this.run(compiler)
      })
    )

    /** compilation.addEntry */
    compiler.hooks.make.tapAsync(
      PLUGIN_NAME,
      this.tryAsync<Compilation>(async compilation => {
        const dependencies = this.dependencies
        const promises: Promise<null>[] = []
        this.compileIndependentPages(compiler, compilation, dependencies, promises)
        dependencies.forEach(dep => {
          promises.push(new Promise<null>((resolve, reject) => {
            compilation.addEntry(this.options.sourceDir, dep, {
              name: dep.name,
              ...dep.options
            }, err => err ? reject(err) : resolve(null))
          }))
        })
        await Promise.all(promises)
        await onCompilerMake?.(compilation, compiler, this)
      })
    )

    compiler.hooks.compilation.tap(PLUGIN_NAME, (compilation, { normalModuleFactory }) => {
      /** For Webpack compilation get factory from compilation.dependencyFactories by denpendence's constructor */
      compilation.dependencyFactories.set(EntryDependency, normalModuleFactory)
      compilation.dependencyFactories.set(TaroSingleEntryDependency as any, normalModuleFactory)

      /**
       * webpack NormalModule 在 runLoaders 真正解析资源的前一刻，
       * 往 NormalModule.loaders 中插入对应的 Taro Loader
       */
      compiler.webpack.NormalModule.getCompilationHooks(compilation).loader.tap(PLUGIN_NAME, (_loaderContext, module:/** TaroNormalModule */ any) => {
        const { framework, loaderMeta, pxTransformConfig } = this.options
        if (module.miniType === META_TYPE.ENTRY) {
          const loaderName = '@tarojs/taro-loader'
          if (!isLoaderExist(module.loaders, loaderName)) {
            module.loaders.unshift({
              loader: loaderName,
              options: {
                framework,
                loaderMeta,
                config: this.appConfig,
                runtimePath: this.options.runtimePath,
                pxTransformConfig
              }
            })
          }
        } else if (module.miniType === META_TYPE.PAGE) {
          let isIndependent = false
          this.independentPackages.forEach(pages => {
            if (pages.includes(module.resource)) {
              isIndependent = true
            }
          })
          const isNewBlended = this.nativeComponents.has(module.name)
          const loaderName = isIndependent
            ? '@tarojs/taro-loader/lib/independentPage'
            : this.pageLoaderName

          if (!isLoaderExist(module.loaders, loaderName)) {
            module.loaders.unshift({
              loader: loaderName,
              options: {
                framework,
                loaderMeta,
                isNewBlended,
                name: module.name,
                config: this.filesConfig,
                appConfig: this.appConfig,
                runtimePath: this.options.runtimePath,
                hot: this.options.hot
              }
            })
          }
        } else if (module.miniType === META_TYPE.COMPONENT) {
          const loaderName = '@tarojs/taro-loader/lib/component'
          if (!isLoaderExist(module.loaders, loaderName)) {
            module.loaders.unshift({
              loader: loaderName,
              options: {
                framework,
                loaderMeta,
                name: module.name,
                runtimePath: this.options.runtimePath
              }
            })
          }
        }
      })

      const { PROCESS_ASSETS_STAGE_ADDITIONAL, PROCESS_ASSETS_STAGE_OPTIMIZE, PROCESS_ASSETS_STAGE_REPORT } = compiler.webpack.Compilation
      compilation.hooks.processAssets.tapAsync(
        {
          name: PLUGIN_NAME,
          stage: PROCESS_ASSETS_STAGE_ADDITIONAL
        },
        this.tryAsync<any>(async () => {
          await this.generateMiniFiles(compilation, compiler)
        })
      )
      compilation.hooks.processAssets.tapAsync(
        {
          name: PLUGIN_NAME,
          // 删除 assets 的相关操作放在触发时机较后的 Stage，避免过早删除出现的一些问题，#13988
          // Stage 触发顺序：https://webpack.js.org/api/compilation-hooks/#list-of-asset-processing-stages
          stage: PROCESS_ASSETS_STAGE_OPTIMIZE
        },
        this.tryAsync<any>(async () => {
          await this.optimizeMiniFiles(compilation, compiler)
        })
      )

      compilation.hooks.processAssets.tapAsync(
        {
          name: PLUGIN_NAME,
          // 该 stage 是最后执行的，确保 taro 暴露给用户的钩子 modifyBuildAssets 在内部处理完 assets 之后再调用
          stage: PROCESS_ASSETS_STAGE_REPORT
        },
        this.tryAsync<any>(async () => {
          if (typeof modifyBuildAssets === 'function') {
            await modifyBuildAssets(compilation.assets, this)
          }
        })
      )
    })

    compiler.hooks.afterEmit.tapAsync(
      PLUGIN_NAME,
      this.tryAsync<Compilation>(async compilation => {
        await this.addTarBarFilesToDependencies(compilation)
      })
    )

    new TaroNormalModulesPlugin(onParseCreateElement).apply(compiler)
  }

  addLoadChunksPlugin (compiler: Compiler) {
    const fileChunks = new Map<string, { name: string }[]>()

    compiler.hooks.thisCompilation.tap(PLUGIN_NAME, compilation => {
      compilation.hooks.afterOptimizeChunks.tap(PLUGIN_NAME, chunks => {
        for (const chunk of chunks) {
          const id = getChunkIdOrName(chunk)
          if (this.options.commonChunks.includes(id)) return

          const deps: { name: string }[] = []

          for (const group of chunk.groupsIterable) {
            group.chunks.forEach(chunk => {
              const currentChunkId = getChunkIdOrName(chunk)
              if (id === currentChunkId) return
              deps.push({
                name: currentChunkId
              })
            })
          }

          fileChunks.set(id, deps)
        }
      })
      compiler.webpack.javascript.JavascriptModulesPlugin.getCompilationHooks(compilation).render.tap(PLUGIN_NAME, (modules, { chunk }) => {
        const chunkEntryModule = getChunkEntryModule(compilation, chunk) as any
        if (!chunkEntryModule) return
        const entryModule: TaroNormalModule = chunkEntryModule.rootModule ?? chunkEntryModule
        // addChunkPages
        if (fileChunks.size) {
          let source
          const id = getChunkIdOrName(chunk)
          const { miniType } = entryModule as any
          const entryChunk = [{ name: 'app' }]
          // 所有模块都依赖app.js，确保@tarojs\plugin-platform-xxx\dist\runtime.js先于@tarojs/runtime执行，避免Taro API未被初始化
          if (this.nativeComponents.has(id) || miniType === META_TYPE.STATIC) {
            fileChunks.forEach((v, k) => {
              if (k === id) {
                source = addRequireToSource(id, modules, v)
              }
            })
            return source
          } else if (miniType === META_TYPE.PAGE) {
            return addRequireToSource(id, modules, entryChunk)
          }
        }
      })
    })
  }

  /**
   * 根据 webpack entry 配置获取入口文件路径
   * @returns app 入口文件路径
   */
  getAppEntry (compiler: Compiler) {
    // const originalEntry = compiler.options.entry as webpack.EntryObject
    // compiler.options.entry = {}
    // return path.resolve(this.context, originalEntry.app[0])
    const { entry } = compiler.options
    function getEntryPath (entry) {
      const app = entry.app
      if (Array.isArray(app)) {
        return app[0]
      } else if (Array.isArray(app.import)) {
        return app.import[0]
      }
      return app
    }
    const appEntryPath = getEntryPath(entry)
    compiler.options.entry = {}
    return appEntryPath
  }

  getChangedFiles (compiler: Compiler) {
    return compiler.modifiedFiles
  }

  /**
   * 分析 app 入口文件，搜集页面、组件信息，
   * 往 this.dependencies 中添加资源模块
   */
  run (compiler: Compiler) {
    this.appConfig = this.getAppConfig()
    this.getPages()
    this.getPagesConfig()
    this.getDarkMode()
    this.getConfigFiles(compiler)
    this.addEntries()
  }

  modifyPluginJSON (pluginJSON) {
    const { main } = pluginJSON
    if (main) {
      pluginJSON.main = this.getTargetFilePath(main, '.js')
    }
  }

  /**
   * 获取 app config 配置内容
   * @returns app config 配置内容
   */
  getAppConfig (): AppConfig {
    const appName = path.basename(this.appEntry).replace(path.extname(this.appEntry), '')
    this.compileFile({
      name: appName,
      path: this.appEntry,
      isNative: false
    })
    const fileConfig = this.filesConfig[this.getConfigFilePath(appName)]
    const appConfig = fileConfig ? fileConfig.content || {} : {}
    if (isEmptyObject(appConfig)) {
      throw new Error('缺少 app 全局配置文件，请检查！')
    }
    return appConfig as AppConfig
  }

  /**
   * 根据 app config 的 pages 配置项，收集所有页面信息，
   * 包括处理分包和 tabbar
   */
  getPages () {
    if (isEmptyObject(this.appConfig)) {
      throw new Error('缺少 app 全局配置文件，请检查！')
    }
    const appPages = this.appConfig.pages
    if (!appPages || !appPages.length) {
      throw new Error('全局配置缺少 pages 字段，请检查！')
    }

    if (!this.isWatch && this.options.logger?.quiet === false) {
      printLog(processTypeEnum.COMPILE, '发现入口', this.getShowPath(this.appEntry))
    }
    const { frameworkExts } = this.options
    this.getTabBarFiles(this.appConfig)
    this.pages = new Set([
      ...appPages.map<IComponent>(item => {
        const pagePath = resolveMainFilePath(path.join(this.options.sourceDir, item), frameworkExts)
        const pageTemplatePath = this.getTemplatePath(pagePath)
        const isNative = this.isNativePageORComponent(pageTemplatePath)
        return {
          name: item,
          path: pagePath,
          isNative,
          stylePath: isNative ? this.getStylePath(pagePath) : undefined,
          templatePath: isNative ? this.getTemplatePath(pagePath) : undefined
        }
      })
    ])
    this.getSubPackages(this.appConfig)
  }

  /**
   * 收集需要转换为本地化组件的内容
   */
  getNativeComponent () {
    const { frameworkExts } = this.options
    const components = this.appConfig.components || []
    components.forEach(item => {
      const pagePath = resolveMainFilePath(path.join(this.options.sourceDir, item), frameworkExts)
      const componentObj = {
        name: item,
        path: pagePath,
        isNative: false,
      }
      if (!this.isWatch && this.options.logger?.quiet === false) {
        printLog(processTypeEnum.COMPILE, `发现[${item}]Native组件`)
      }
      this.pages.add(componentObj)
      // 登记需要编译成原生版本的组件
      this.nativeComponents.set(item, componentObj)
    })
  }

  /**
   * 读取页面及其依赖的组件的配置
   */
  getPagesConfig () {
    this.pages.forEach(page => {
      if (!this.isWatch && this.options.logger?.quiet === false) {
        printLog(processTypeEnum.COMPILE, '发现页面', this.getShowPath(page.path))
      }
      this.compileFile(page)
    })
  }

  /**
   * 往 this.dependencies 中新增或修改所有 config 配置模块
   */
  getConfigFiles (compiler: Compiler) {
    const filesConfig = this.filesConfig
    Object.keys(filesConfig).forEach(item => {
      if (fs.existsSync(filesConfig[item].path)) {
        this.addEntry(filesConfig[item].path, item, META_TYPE.CONFIG)
      }
    })

    // webpack createChunkAssets 前一刻，去除所有 config chunks
    compiler.hooks.compilation.tap(PLUGIN_NAME, compilation => {
      compilation.hooks.beforeChunkAssets.tap(PLUGIN_NAME, () => {
        const chunks = compilation.chunks
        const configNames = Object.keys(filesConfig)

        for (const chunk of chunks) {
          if (configNames.find(configName => configName === chunk.name)) chunks.delete(chunk)
        }
      })
    })
  }

  /**
   * 在 this.dependencies 中新增或修改模块
   */
  addEntry (entryPath: string, entryName: string, entryType: META_TYPE, options = {}) {
    let dep: TaroSingleEntryDependency
    if (this.dependencies.has(entryPath)) {
      dep = this.dependencies.get(entryPath)!
      dep.name = entryName
      dep.loc = { name: entryName }
      dep.request = entryPath
      dep.userRequest = entryPath
      dep.miniType = entryType
      dep.options = options
    } else {
      dep = new TaroSingleEntryDependency(entryPath, entryName, { name: entryName }, entryType, options)
    }
    this.dependencies.set(entryPath, dep)
  }

  /**
   * 在 this.dependencies 中新增或修改 app、模板组件、页面、组件等资源模块
   */
  addEntries () {
    this.addEntry(this.appEntry, 'app', META_TYPE.ENTRY)
    this.addEntry(path.resolve(__dirname, '..', 'template/custom-wrapper'), 'custom-wrapper', META_TYPE.STATIC)
    this.pages.forEach(item => {
      if (item.isNative) {
        this.addEntry(item.path, item.name, META_TYPE.NORMAL, { isNativePage: true })
        if (item.stylePath && fs.existsSync(item.stylePath)) {
          this.addEntry(item.stylePath, this.getStylePath(item.name), META_TYPE.NORMAL)
        }
        if (item.templatePath && fs.existsSync(item.templatePath)) {
          this.addEntry(item.templatePath, this.getTemplatePath(item.name), META_TYPE.NORMAL)
        }
      } else {
        this.addEntry(item.path, item.name, META_TYPE.PAGE)
      }
    })
    this.components.forEach(item => {
      if (item.isNative) {
        this.addEntry(item.path, item.name, META_TYPE.NORMAL, { isNativePage: true })
        if (item.stylePath && fs.existsSync(item.stylePath)) {
          this.addEntry(item.stylePath, this.getStylePath(item.name), META_TYPE.NORMAL)
        }
        if (item.templatePath && fs.existsSync(item.templatePath)) {
          this.addEntry(item.templatePath, this.getTemplatePath(item.name), META_TYPE.NORMAL)
        }
      } else {
        this.addEntry(item.path, item.name, META_TYPE.COMPONENT)
      }
    })
  }

  replaceExt (file: string, ext: string) {
    return path.join(path.dirname(file), path.basename(file, path.extname(file)) + `${ext}`)
  }

  /**
   * 读取页面、组件的配置，并递归读取依赖的组件的配置
   */
  compileFile (file: IComponent) {
    const filePath = file.path
    const fileConfigPath = file.isNative ? this.replaceExt(filePath, '.json') : this.getConfigFilePath(filePath)
    const fileConfig = readConfig(fileConfigPath, this.options.combination.config)
    const usingComponents = fileConfig.usingComponents

    // 递归收集依赖的第三方组件
    if (usingComponents) {
      const componentNames = Object.keys(usingComponents)
      const depComponents: Array<{ name: string, path: string }> = []
      const alias = this.options.combination.config.alias
      for (const compName of componentNames) {
        let compPath: string = usingComponents[compName]

        if (isAliasPath(compPath, alias)) {
          compPath = replaceAliasPath(filePath, compPath, alias)
          fileConfig.usingComponents[compName] = compPath
        }

        depComponents.push({
          name: compName,
          path: compPath
        })

        if (!componentConfig.thirdPartyComponents.has(compName) && !file.isNative) {
          componentConfig.thirdPartyComponents.set(compName, new Set())
        }
      }
      depComponents.forEach(item => {
        const componentPath = resolveMainFilePath(path.resolve(path.dirname(file.path), item.path))
        if (fs.existsSync(componentPath) && !Array.from(this.components).some(item => item.path === componentPath)) {
          const componentName = this.getComponentName(componentPath)
          if (this.nativeComponents.has(componentName)) return
          const componentTempPath = this.getTemplatePath(componentPath)
          const isNative = this.isNativePageORComponent(componentTempPath)
          const componentObj = {
            name: componentName,
            path: componentPath,
            isNative,
            stylePath: isNative ? this.getStylePath(componentPath) : undefined,
            templatePath: isNative ? this.getTemplatePath(componentPath) : undefined
          }
          this.components.add(componentObj)
          this.compileFile(componentObj)
        }
      })
    }

    this.filesConfig[this.getConfigFilePath(file.name)] = {
      content: fileConfig,
      path: fileConfigPath
    }
  }

  /**
   * 收集分包配置中的页面
   */
  getSubPackages (appConfig: AppConfig) {
    const subPackages = appConfig.subPackages || appConfig.subpackages
    const { frameworkExts } = this.options
    if (subPackages && subPackages.length) {
      subPackages.forEach(item => {
        if (item.pages && item.pages.length) {
          const root = item.root
          const isIndependent = !!item.independent
          if (isIndependent) {
            this.independentPackages.set(root, [])
          }
          item.pages.forEach(page => {
            let pageItem = `${root}/${page}`
            pageItem = pageItem.replace(/\/{2,}/g, '/')
            let hasPageIn = false
            this.pages.forEach(({ name }) => {
              if (name === pageItem) {
                hasPageIn = true
              }
            })
            if (!hasPageIn) {
              const pagePath = resolveMainFilePath(path.join(this.options.sourceDir, pageItem), frameworkExts)
              const templatePath = this.getTemplatePath(pagePath)
              const isNative = this.isNativePageORComponent(templatePath)
              if (isIndependent) {
                const independentPages = this.independentPackages.get(root)
                independentPages?.push(pagePath)
              }
              this.pages.add({
                name: pageItem,
                path: pagePath,
                isNative,
                stylePath: isNative ? this.getStylePath(pagePath) : undefined,
                templatePath: isNative ? this.getTemplatePath(pagePath) : undefined
              })
            }
          })
        }
      })
    }
  }

  /**
   * 收集 dark mode 配置中的文件
   */
  getDarkMode () {
    const themeLocation = this.appConfig.themeLocation
    const darkMode = this.appConfig.darkmode
    if (darkMode && themeLocation && typeof themeLocation === 'string') {
      this.themeLocation = themeLocation
    }
  }

  compileIndependentPages (compiler, compilation, dependencies, promises) {
    const independentPackages = this.independentPackages
    if (independentPackages.size) {
      const JsonpTemplatePlugin = require('webpack/lib/web/JsonpTemplatePlugin')
      const NaturalChunkIdsPlugin = require('webpack/lib/ids/NaturalChunkIdsPlugin')
      const SplitChunksPlugin = require('webpack/lib/optimize/SplitChunksPlugin')
      const RuntimeChunkPlugin = require('webpack/lib/optimize/RuntimeChunkPlugin')
      const MiniCssExtractPlugin = require('mini-css-extract-plugin')

      independentPackages.forEach((pages, name) => {
        const childCompiler = compilation.createChildCompiler(PLUGIN_NAME, {
          path: `${compiler.options.output.path}/${name}`,
          chunkLoadingGlobal: `subpackage_${name}`
        })
        const compPath = path.resolve(__dirname, '..', 'template/comp')
        childCompiler.inputFileSystem = compiler.inputFileSystem
        childCompiler.outputFileSystem = compiler.outputFileSystem
        childCompiler.context = compiler.context
        new JsonpTemplatePlugin().apply(childCompiler)
        new NaturalChunkIdsPlugin().apply(childCompiler)
        new MiniCssExtractPlugin({
          filename: `[name]${this.options.fileType.style}`,
          chunkFilename: `[name]${this.options.fileType.style}`
        }).apply(childCompiler)
        new compiler.webpack.DefinePlugin(this.options.constantsReplaceList).apply(childCompiler)
        if (compiler.options.optimization) {
          const nodeModulesDirRegx = new RegExp(REG_NODE_MODULES_DIR)

          new SplitChunksPlugin({
            chunks: 'all',
            maxInitialRequests: Infinity,
            minSize: 0,
            cacheGroups: {
              common: {
                name: `${name}/common`,
                minChunks: 2,
                priority: 1
              },
              vendors: {
                name: `${name}/vendors`,
                minChunks: 1,
                test: module => {
                  return (nodeModulesDirRegx.test(module.resource) && module.resource.indexOf(compPath) < 0)
                },
                priority: 10
              }
            }
          }).apply(childCompiler)
          new RuntimeChunkPlugin({
            name: `${name}/runtime`
          }).apply(childCompiler)
        }
        const childPages = new Set<IComponent>()
        pages.forEach(pagePath => {
          if (dependencies.has(pagePath)) {
            const dep = dependencies.get(pagePath)
            new TaroSingleEntryPlugin(compiler.context, dep?.request, dep?.name, dep?.miniType, dep?.options).apply(childCompiler)
          }
          this.pages.forEach(item => {
            if (item.path === pagePath) {
              childPages.add(item)
            }
          })
          dependencies.delete(pagePath)
        })
        // 添加 comp 和 custom-wrapper 组件
        new TaroSingleEntryPlugin(compiler.context, path.resolve(__dirname, '..', 'template/comp'), `${name}/comp`, META_TYPE.STATIC).apply(childCompiler)
        new TaroSingleEntryPlugin(compiler.context, path.resolve(__dirname, '..', 'template/custom-wrapper'), `${name}/custom-wrapper`, META_TYPE.STATIC).apply(childCompiler)

        // 给每个子编译器标记上名称和 tag
        // tag 用于生成模板和 config 时区别于主编译器走不同的方法
        // 名称用于在生成资源时判断是否为当前子编译器的资源
        childCompiler.hooks.compilation.tap(PLUGIN_NAME, (compilation) => {
          compilation.__name = name
          compilation.__tag = CHILD_COMPILER_TAG
        })

        promises.push(new Promise((resolve, reject) => {
          childCompiler.runAsChild(err => {
            if (err) {
              return reject(err)
            }
            resolve(null)
          })
        }).catch(err => console.log(err)))
      })
    }
  }

  /**
   * 搜集 tabbar icon 图标路径
   * 收集自定义 tabbar 组件
   */
  getTabBarFiles (appConfig: AppConfig) {
    const tabBar = appConfig.tabBar
    const { sourceDir, frameworkExts } = this.options
    if (tabBar && typeof tabBar === 'object' && !isEmptyObject(tabBar)) {
      // eslint-disable-next-line dot-notation
      const list = tabBar['list'] || []
      list.forEach(item => {
        // eslint-disable-next-line dot-notation
        item['iconPath'] && this.tabBarIcons.add(item['iconPath'])
        // eslint-disable-next-line dot-notation
        item['selectedIconPath'] && this.tabBarIcons.add(item['selectedIconPath'])
      })
      if (tabBar.custom) {
        const isAlipay = process.env.TARO_ENV === 'alipay'
        const customTabBarPath = path.join(sourceDir, isAlipay ? 'customize-tab-bar' : 'custom-tab-bar')
        const customTabBarComponentPath = resolveMainFilePath(customTabBarPath, [...frameworkExts, ...SCRIPT_EXT])
        if (fs.existsSync(customTabBarComponentPath)) {
          const customTabBarComponentTemplPath = this.getTemplatePath(customTabBarComponentPath)
          const isNative = this.isNativePageORComponent(customTabBarComponentTemplPath)
          if (!this.isWatch && this.options.logger?.quiet === false) {
            printLog(processTypeEnum.COMPILE, '自定义 tabBar', this.getShowPath(customTabBarComponentPath))
          }
          const componentObj: IComponent = {
            name: isAlipay ? 'customize-tab-bar/index' : 'custom-tab-bar/index',
            path: customTabBarComponentPath,
            isNative,
            stylePath: isNative ? this.getStylePath(customTabBarComponentPath) : undefined,
            templatePath: isNative ? this.getTemplatePath(customTabBarComponentPath) : undefined
          }
          this.compileFile(componentObj)
          this.components.add(componentObj)
        }
      }
    }
  }

  /** 是否为小程序原生页面或组件 */
  isNativePageORComponent (templatePath: string): boolean {
    return fs.existsSync(templatePath)
  }

  getShowPath (filePath: string) {
    return filePath.replace(this.context, '').replace(/\\/g, '/').replace(/^\//, '')
  }

  // 调整 config 文件中 usingComponents 的路径
  // 1. 将 node_modules 调整为 npm
  // 2. 将 ../../../node_modules/xxx 调整为 /npm/xxx
  adjustConfigContent (config: Config) {
    const { usingComponents } = config

    if (!usingComponents) return

    for (const [key, value] of Object.entries(usingComponents)) {
      if (!value.includes(NODE_MODULES)) return

      const match = value.replace(NODE_MODULES, 'npm').match(/npm.*/)
      usingComponents[key] = match ? `${path.sep}${match[0]}` : value
    }
  }

  /** 生成小程序相关文件 */
  async generateMiniFiles (compilation: Compilation, compiler: Compiler) {
    const { combination } = this.options
    const { modifyMiniConfigs } = combination.config

    /**
     * 与原生小程序混写时解析模板与样式
     */
    compilation.getAssets().forEach(({ name: assetPath }) => {
      const styleExt = this.options.fileType.style
      if (new RegExp(`${styleExt}${styleExt}$`).test(assetPath)) {
        const assetObj = compilation.assets[assetPath]
        const newAssetPath = assetPath.replace(styleExt, '')
        compilation.assets[newAssetPath] = assetObj
      }
    })

    if (typeof modifyMiniConfigs === 'function') {
      await modifyMiniConfigs(this.filesConfig)
    }
    const appConfigPath = this.getConfigFilePath(this.appEntry)
    const appConfigName = path.basename(appConfigPath).replace(path.extname(appConfigPath), '')
    this.generateConfigFile(compilation, compiler, this.appEntry, this.filesConfig[appConfigName].content)

    this.components.forEach(component => {
      const config = this.filesConfig[this.getConfigFilePath(component.name)]
      if (config) {
        this.generateConfigFile(compilation, compiler, component.path, config.content)
      }
    })
    this.pages.forEach(page => {
      const config = this.filesConfig[this.getConfigFilePath(page.name)]
      let isIndependent = false
      // pages 里面会混合独立分包的，在这里需要过滤一下，避免重复生成 assets
      this.independentPackages.forEach(pages => {
        if (pages.includes(page.path)) {
          isIndependent = true
        }
      })

      if (isIndependent) return

      if (config) {
        config.content.usingComponents = {
          ...config.content.usingComponents
        }
        this.generateConfigFile(compilation, compiler, page.path, config.content)
      }
    })
    this.generateTabBarFiles(compilation, compiler)
    this.injectCommonStyles(compilation, compiler)
    if (this.themeLocation) {
      this.generateDarkModeFile(compilation, compiler)
    }
  }

  async optimizeMiniFiles (compilation: Compilation, _compiler: Compiler) {
    const isUsingCustomWrapper = componentConfig.thirdPartyComponents.has('custom-wrapper')

    /**
     * 与原生小程序混写时解析模板与样式
     */
    compilation.getAssets().forEach(({ name: assetPath }) => {
      const styleExt = this.options.fileType.style
      const templExt = this.options.fileType.templ
      if (new RegExp(`(\\${styleExt}|\\${templExt})\\.js(\\.map){0,1}$`).test(assetPath)) {
        delete compilation.assets[assetPath]
      } else if (new RegExp(`${styleExt}${styleExt}$`).test(assetPath)) {
        delete compilation.assets[assetPath]
      }
      if (!isUsingCustomWrapper && assetPath === 'custom-wrapper.js') {
        delete compilation.assets[assetPath]
      }
    })
  }

  generateConfigFile (compilation: Compilation, compiler: Compiler, filePath: string, config: Config & { component?: boolean }) {
    const { RawSource } = compiler.webpack.sources
    const fileConfigName = this.getConfigPath(this.getComponentName(filePath))
    const unofficialConfigs = ['enableShareAppMessage', 'enableShareTimeline', 'enablePageMeta', 'components']
    unofficialConfigs.forEach(item => {
      delete config[item]
    })

    this.adjustConfigContent(config)

    const fileConfigStr = JSON.stringify(config)
    compilation.assets[fileConfigName] = new RawSource(fileConfigStr)
  }

  generateTemplateFile (compilation: Compilation, compiler: Compiler, filePath: string, templateFn: (...args) => string, ...options) {
    const { RawSource } = compiler.webpack.sources
    const templStr = templateFn(...options)
    const fileTemplName = this.getTemplatePath(this.getComponentName(filePath))

    compilation.assets[fileTemplName] = new RawSource(templStr)
  }

  getComponentName (componentPath: string) {
    let componentName: string
    if (REG_NODE_MODULES.test(componentPath)) {
      const nodeModulesRegx = new RegExp(REG_NODE_MODULES, 'gi')

      componentName = componentPath.replace(this.context, '').replace(/\\/g, '/').replace(path.extname(componentPath), '')
      componentName = componentName.replace(nodeModulesRegx, 'npm')
    } else {
      componentName = componentPath.replace(this.options.sourceDir, '').replace(/\\/g, '/').replace(path.extname(componentPath), '')
    }

    return componentName.replace(/^(\/|\\)/, '')
  }

  getIsBuildPluginPath (filePath) {
    return filePath
  }

  /**
   * 根据 app、页面、组件的路径获取对应的 config 配置文件的路径
   * @returns config 的路径
   */
  getConfigFilePath (filePath: string) {
    return resolveMainFilePath(`${filePath.replace(path.extname(filePath), '')}.config`)
  }

  /** 处理 xml 文件后缀 */
  getTemplatePath (filePath: string) {
    return this.getTargetFilePath(filePath, this.options.fileType.templ)
  }

  /** 处理样式文件后缀 */
  getStylePath (filePath: string) {
    return this.getTargetFilePath(filePath, this.options.fileType.style)
  }

  /** 处理 config 文件后缀 */
  getConfigPath (filePath: string) {
    return this.getTargetFilePath(filePath, this.options.fileType.config)
  }

  /** 处理 extname */
  getTargetFilePath (filePath: string, targetExtname: string) {
    const extname = path.extname(filePath)
    if (extname) {
      return filePath.replace(extname, targetExtname)
    }
    return filePath + targetExtname
  }

  /**
   * 输出 themeLocation 文件
   * @param compilation
   */
  generateDarkModeFile (compilation: Compilation, { webpack }: Compiler) {
    const { RawSource } = webpack.sources
    const themeLocationPath = path.resolve(this.options.sourceDir, this.themeLocation)
    if (fs.existsSync(themeLocationPath)) {
      const themeLocationSource = fs.readFileSync(themeLocationPath)
      compilation.assets[this.themeLocation] = new RawSource(themeLocationSource)
    }
  }

  /**
   * 输出 tabbar icons 文件
   */
  generateTabBarFiles (compilation: Compilation, { webpack }: Compiler) {
    const { RawSource } = webpack.sources
    this.tabBarIcons.forEach(icon => {
      const iconPath = path.resolve(this.options.sourceDir, icon)
      if (fs.existsSync(iconPath)) {
        const iconSource = fs.readFileSync(iconPath)
        compilation.assets[icon] = new RawSource(iconSource)
      }
    })
  }

  /**
   * 小程序全局样式文件中引入 common chunks 中的公共样式文件
   */
  injectCommonStyles ({ assets }: Compilation, { webpack }: Compiler) {
    const { ConcatSource, RawSource } = webpack.sources
    const styleExt = this.options.fileType.style
    const appStyle = `app${styleExt}`
    const REG_STYLE_EXT = new RegExp(`\\.(${styleExt.replace('.', '')})(\\?.*)?$`)

    const originSource = assets[appStyle] || new RawSource('')
    const commons = new ConcatSource('')
    const componentCommons: string[] = []
    const independentPackageNames: string[] = []

    this.independentPackages.forEach((_, name) => { independentPackageNames.push(name) })

    Object.keys(assets).forEach(assetName => {
      const fileName = path.basename(assetName, path.extname(assetName))
      if (
        (REG_STYLE.test(assetName) || REG_STYLE_EXT.test(assetName)) &&
        this.options.commonChunks.includes(fileName) &&
        // app.wxss 不能引入独立分包中的 common 样式文件
        independentPackageNames.every(name => !assetName.includes(name))
      ) {
        commons.add('\n')
        commons.add(`@import ${JSON.stringify(urlToRequest(assetName))};`)
        componentCommons.push(assetName)
      }
    })

    if (commons.size() > 0) {
      const APP_STYLE_NAME = 'app-origin' + styleExt
      assets[APP_STYLE_NAME] = new ConcatSource(originSource)
      const source = new ConcatSource('')
      source.add(`@import ${JSON.stringify(urlToRequest(APP_STYLE_NAME))};`)
      source.add(commons)
      source.add('\n')
      assets[appStyle] = source
    }
  }

  addTarBarFilesToDependencies (compilation: Compilation) {
    const { fileDependencies, missingDependencies } = compilation
    this.tabBarIcons.forEach(icon => {
      if (!fileDependencies.has(icon)) {
        fileDependencies.add(icon)
      }
      // 避免触发 watchpack 里 WatchpackFileWatcher 类的 "initial-missing" 事件中 _onRemove 逻辑，
      // 它会把 tabbar icon 当做已 remove 多次触发构建
      if (!missingDependencies.has(icon)) {
        missingDependencies.add(icon)
      }
    })
  }
}
