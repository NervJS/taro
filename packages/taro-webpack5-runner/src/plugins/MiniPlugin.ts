import {
  fs,
  getNpmPackageAbsolutePath,
  isAliasPath,
  isEmptyObject,
  META_TYPE,
  NODE_MODULES,
  NODE_MODULES_REG,
  printLog,
  processTypeEnum,
  promoteRelativePath,
  readConfig,
  REG_STYLE,
  replaceAliasPath,
  resolveMainFilePath,
  SCRIPT_EXT
} from '@tarojs/helper'
import { urlToRequest } from 'loader-utils'
import path from 'path'
import EntryDependency from 'webpack/lib/dependencies/EntryDependency'

import TaroSingleEntryDependency from '../dependencies/TaroSingleEntryDependency'
import { validatePrerenderPages } from '../prerender/prerender'
import { componentConfig } from '../utils/component'
import { addRequireToSource, getChunkEntryModule, getChunkIdOrName } from '../utils/webpack'
import TaroLoadChunksPlugin from './TaroLoadChunksPlugin'
import TaroNormalModulesPlugin from './TaroNormalModulesPlugin'
import TaroSingleEntryPlugin from './TaroSingleEntryPlugin'

import type { RecursiveTemplate, UnRecursiveTemplate } from '@tarojs/shared/dist/template'
import type { AppConfig, Config } from '@tarojs/taro'
import type { Func } from '@tarojs/taro/types/compile'
import type { Compilation, Compiler } from 'webpack'
import type { PrerenderConfig } from '../prerender/prerender'
import type { AddPageChunks, IComponent, IFileType } from '../utils/types'
import type TaroNormalModule from './TaroNormalModule'

const baseCompName = 'comp'
const customWrapperName = 'custom-wrapper'
const PLUGIN_NAME = 'TaroMiniPlugin'
const CHILD_COMPILER_TAG = 'child'

interface ITaroMiniPluginOptions {
  appEntry?: string
  constantsReplaceList: {
    [key: string]: any
  }
  sourceDir: string
  isBuildPlugin: boolean
  pluginConfig?: Record<string, any>
  pluginMainEntry?: string
  commonChunks: string[]
  framework: string
  frameworkExts: string[]
  baseLevel: number
  prerender?: PrerenderConfig
  addChunkPages?: AddPageChunks
  minifyXML?: {
    collapseWhitespace?: boolean
  }
  fileType: IFileType
  template: RecursiveTemplate | UnRecursiveTemplate
  modifyBuildAssets?: Func
  modifyMiniConfigs?: Func
  runtimePath?: string | string[]
  onCompilerMake?: Func
  onParseCreateElement?: Func
  blended: boolean
  alias: Record<string, string>
  loaderMeta?: Record<string, string>
  hot: boolean
  logger?: {
    quiet?: boolean
  }
  pxTransformConfig: {
    baseFontSize: number
    deviceRatio: any
    designWidth: number
    unitPrecision: number
    targetUnit: string
  }
  newBlended?: boolean
  skipProcessUsingComponents?: boolean
}

export interface IComponentObj {
  name?: string
  path: string | null
  type?: string
}

interface FilesConfig {
  [configName: string]: {
    content: Config
    path: string
  }
}

function isLoaderExist (loaders, loaderName: string) {
  return loaders.some(item => item.loader === loaderName)
}

export default class TaroMiniPlugin {
  /** 插件配置选项 */
  options: ITaroMiniPluginOptions
  context: string
  /** app 入口文件路径 */
  appEntry: string
  /** app config 配置内容 */
  appConfig: AppConfig
  /** app、页面、组件的配置集合 */
  filesConfig: FilesConfig = {}
  isWatch = false
  /** 页面列表 */
  pages = new Set<IComponent>()
  components = new Set<IComponent>()
  /** 新的混合原生编译模式 newBlended 模式下，需要单独编译成原生代码的 component 的Map */
  nativeComponents = new Map<string, IComponent>()
  /** tabbar icon 图片路径列表 */
  tabBarIcons = new Set<string>()
  prerenderPages: Set<string>
  dependencies = new Map<string, TaroSingleEntryDependency>()
  loadChunksPlugin: TaroLoadChunksPlugin
  themeLocation: string
  pageLoaderName = '@tarojs/taro-loader/lib/page'
  independentPackages = new Map<string, string[]>()

  constructor (options = {} as ITaroMiniPluginOptions) {
    this.options = Object.assign({
      sourceDir: '',
      framework: 'nerv',
      commonChunks: ['runtime', 'vendors'],
      isBuildPlugin: false,
      fileType: {
        style: '.wxss',
        config: '.json',
        script: '.js',
        templ: '.wxml',
        xs: '.wxs'
      },
      minifyXML: {},
      hot: false
    }, options)

    const { template, baseLevel } = this.options
    if (template.isSupportRecursive === false && baseLevel > 0) {
      (template as UnRecursiveTemplate).baseLevel = baseLevel
    }
    this.prerenderPages = new Set()
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
      commonChunks,
      addChunkPages,
      framework,
      isBuildPlugin,
      newBlended,
    } = this.options
    /** build mode */
    compiler.hooks.run.tapAsync(
      PLUGIN_NAME,
      this.tryAsync<Compiler>(async compiler => {
        await this.run(compiler)
        new TaroLoadChunksPlugin({
          commonChunks: commonChunks,
          isBuildPlugin,
          addChunkPages: addChunkPages,
          pages: this.pages,
          framework: framework
        }).apply(compiler)
      })
    )

    /** watch mode */
    compiler.hooks.watchRun.tapAsync(
      PLUGIN_NAME,
      this.tryAsync<Compiler>(async compiler => {
        const changedFiles = this.getChangedFiles(compiler)
        if (changedFiles?.size > 0) {
          this.isWatch = true
        }
        await this.run(compiler)
        if (!this.loadChunksPlugin) {
          this.loadChunksPlugin = new TaroLoadChunksPlugin({
            commonChunks: commonChunks,
            isBuildPlugin,
            addChunkPages: addChunkPages,
            pages: this.pages,
            framework: framework
          })
          this.loadChunksPlugin.apply(compiler)
        }
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
        await this.options.onCompilerMake?.(compilation, compiler, this)
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
                prerender: this.prerenderPages.size > 0,
                config: this.appConfig,
                runtimePath: this.options.runtimePath,
                blended: this.options.blended,
                newBlended: this.options.newBlended,
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
          const loaderName = (isNewBlended || isBuildPlugin)
            ? '@tarojs/taro-loader/lib/native-component'
            : (isIndependent
              ? '@tarojs/taro-loader/lib/independentPage'
              : this.pageLoaderName)

          if (!isLoaderExist(module.loaders, loaderName)) {
            module.loaders.unshift({
              loader: loaderName,
              options: {
                framework,
                loaderMeta,
                isNewBlended,
                name: module.name,
                prerender: this.prerenderPages.has(module.name),
                config: this.filesConfig,
                appConfig: this.appConfig,
                runtimePath: this.options.runtimePath,
                hot: this.options.hot
              }
            })
          }
        } else if (module.miniType === META_TYPE.COMPONENT) {
          const loaderName = isBuildPlugin ? '@tarojs/taro-loader/lib/native-component' : '@tarojs/taro-loader/lib/component'
          if (!isLoaderExist(module.loaders, loaderName)) {
            module.loaders.unshift({
              loader: loaderName,
              options: {
                framework,
                loaderMeta,
                name: module.name,
                prerender: this.prerenderPages.has(module.name),
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
          // 如果是子编译器，证明是编译独立分包，进行单独的处理
          if ((compilation as any).__tag === CHILD_COMPILER_TAG) {
            await this.generateIndependentMiniFiles(compilation, compiler)
          } else {
            await this.generateMiniFiles(compilation, compiler)
          }
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
          const { modifyBuildAssets } = this.options
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

    new TaroNormalModulesPlugin(this.options.onParseCreateElement).apply(compiler)

    newBlended && this.addLoadChunksPlugin(compiler)
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
    if (this.options.isBuildPlugin) {
      const entryCopy = Object.assign({}, entry)
      compiler.options.entry = {}
      return entryCopy
    }
    if (this.options.appEntry) {
      compiler.options.entry = {}
      return this.options.appEntry
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
    if (this.options.isBuildPlugin) {
      this.getPluginFiles()
      this.getConfigFiles(compiler)
    } else {
      this.appConfig = this.getAppConfig()
      this.getPages()
      this.getPagesConfig()
      this.getDarkMode()
      this.getConfigFiles(compiler)
      this.addEntries()
    }
  }

  getPluginFiles () {
    const fileList = new Set<IComponent>()
    const { pluginConfig, template } = this.options
    const normalFiles = new Set<IComponent>()
    Object.keys(this.appEntry).forEach(key => {
      const filePath = this.appEntry[key][0] || this.appEntry[key].import[0]
      if (key === this.options.pluginMainEntry) {
        this.addEntry(filePath, key, META_TYPE.EXPORTS)
      }
      if (pluginConfig) {
        fileList.add({
          name: key,
          path: filePath,
          isNative: false
        })
        let isPage = false
        let isComponent = false
        Object.keys(pluginConfig).forEach(pluginKey => {
          if (pluginKey === 'pages') {
            Object.keys(pluginConfig[pluginKey]).forEach(pageKey => {
              if (`plugin/${pluginConfig[pluginKey][pageKey]}` === key) {
                isPage = true
              }
            })
          }
          if (pluginKey === 'publicComponents') {
            Object.keys(pluginConfig[pluginKey]).forEach(pageKey => {
              if (`plugin/${pluginConfig[pluginKey][pageKey]}` === key) {
                isComponent = true
              }
            })
          }
        })
        if (isPage) {
          this.pages.add({
            name: key,
            path: filePath,
            isNative: false
          })
        } else if (isComponent) {
          this.components.add({
            name: key,
            path: filePath,
            isNative: false
          })
        } else {
          normalFiles.add({
            name: key,
            path: filePath,
            isNative: true
          })
        }
      }
    })
    if (!template.isSupportRecursive) {
      this.addEntry(path.resolve(__dirname, '..', 'template/comp'), this.getIsBuildPluginPath('comp', true), META_TYPE.STATIC)
    }
    this.addEntry(path.resolve(__dirname, '..', 'template/custom-wrapper'), this.getIsBuildPluginPath('custom-wrapper', true), META_TYPE.STATIC)
    normalFiles.forEach(item => {
      this.addEntry(item.path, item.name, META_TYPE.NORMAL, {
        library: {
          type: 'commonjs'
        }
      })
    })
    this.pages.forEach(item => {
      if (!this.isWatch && this.options.logger?.quiet === false) {
        printLog(processTypeEnum.COMPILE, '发现页面', this.getShowPath(item.path))
      }
      this.compileFile(item)
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
      this.compileFile(item)
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

  modifyPluginJSON (pluginJSON) {
    const { main, publicComponents } = pluginJSON
    const isUsingCustomWrapper = componentConfig.thirdPartyComponents.has('custom-wrapper')
    if (main) {
      pluginJSON.main = this.getTargetFilePath(main, '.js')
    }

    if (!this.options.template.isSupportRecursive) {
      pluginJSON.publicComponents = Object.assign({}, publicComponents, {
        [baseCompName]: baseCompName
      })
    }

    if (isUsingCustomWrapper) {
      pluginJSON.publicComponents = Object.assign({}, publicComponents, {
        [customWrapperName]: customWrapperName
      })
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
    const { newBlended } = this.options
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
    const { frameworkExts, prerender } = this.options
    this.prerenderPages = new Set(validatePrerenderPages(appPages, prerender).map(p => p.path))
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
    // 新的混合原生编译模式 newBlended 下，需要收集独立编译为原生自定义组件
    newBlended && this.getNativeComponent()
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
    const { template } = this.options
    this.addEntry(this.appEntry, 'app', META_TYPE.ENTRY)
    if (!template.isSupportRecursive) {
      this.addEntry(path.resolve(__dirname, '..', 'template/comp'), 'comp', META_TYPE.STATIC)
    }
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
    const fileConfig = readConfig(fileConfigPath)
    const { componentGenerics } = fileConfig
    const usingComponents = fileConfig.usingComponents

    if (this.options.isBuildPlugin && componentGenerics) {
      Object.keys(componentGenerics).forEach(component => {
        if (componentGenerics[component]) {
          if (!componentConfig.thirdPartyComponents.has(component)) {
            componentConfig.thirdPartyComponents.set(component, new Set())
          }
        }
      })
    }

    // 递归收集依赖的第三方组件
    if (usingComponents) {
      const componentNames = Object.keys(usingComponents)
      const depComponents: Array<{ name: string, path: string }> = []
      const alias = this.options.alias
      for (const compName of componentNames) {
        let compPath: string = usingComponents[compName]

        if (isAliasPath(compPath, alias)) {
          compPath = replaceAliasPath(filePath, compPath, alias)
          fileConfig.usingComponents[compName] = compPath
        }

        // 判断是否为第三方依赖的正则，如果 test 为 false 则为第三方依赖
        const notNpmPkgReg = /^[.\\/]/
        if (
          !this.options.skipProcessUsingComponents
          && !compPath.startsWith('plugin://')
          && !notNpmPkgReg.test(compPath)
        ) {
          const tempCompPath = getNpmPackageAbsolutePath(compPath)

          if (tempCompPath) {
            compPath = tempCompPath
            fileConfig.usingComponents[compName] = compPath
          }
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
          // newBlended 模式下，本地化组件使用Page进行处理，此处直接跳过
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
                  return (/[\\/]node_modules[\\/]/.test(module.resource) && module.resource.indexOf(compPath) < 0)
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
        new TaroLoadChunksPlugin({
          commonChunks: [`${name}/runtime`, `${name}/vendors`, `${name}/common`],
          isBuildPlugin: false,
          addChunkPages: this.options.addChunkPages,
          pages: childPages,
          framework: this.options.framework,
          isIndependentPackages: true,
          needAddCommon: [`${name}/comp`, `${name}/custom-wrapper`]
        }).apply(childCompiler)
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

    if (!usingComponents || this.options.skipProcessUsingComponents) return

    for (const [key, value] of Object.entries(usingComponents)) {
      if (!value.includes(NODE_MODULES)) return

      const match = value.replace(NODE_MODULES, 'npm').match(/npm.*/)
      usingComponents[key] = match ? `${path.sep}${match[0]}` : value
    }
  }

  /** 生成小程序独立分包的相关文件 */
  async generateIndependentMiniFiles (compilation: Compilation, compiler: Compiler) {
    const { template, isBuildPlugin, sourceDir } = this.options
    const baseTemplateName = this.getIsBuildPluginPath('base', isBuildPlugin)
    const isUsingCustomWrapper = componentConfig.thirdPartyComponents.has('custom-wrapper')
    // @ts-ignore
    const childName = compilation.__name
    // 为独立分包生成 base/comp/custom-wrapper
    this.independentPackages.forEach((_pages, name) => {
      // independentPackages 是包含了所有 ChildCompiler 的资源，如果不是当前 ChildCompiler 的资源不做处理
      if (name !== childName) return

      this.generateTemplateFile(compilation, compiler, `${name}/${baseTemplateName}`, template.buildTemplate, componentConfig)
      if (!template.isSupportRecursive) {
        // 如微信、QQ 不支持递归模版的小程序，需要使用自定义组件协助递归
        this.generateConfigFile(compilation, compiler, `${name}/${baseCompName}`, {
          component: true,
          usingComponents: {
            [baseCompName]: `./${baseCompName}`,
            [customWrapperName]: `./${customWrapperName}`
          }
        })
        this.generateTemplateFile(compilation, compiler, `${name}/${baseCompName}`, template.buildBaseComponentTemplate, this.options.fileType.templ)
      }
      this.generateConfigFile(compilation, compiler, `${name}/${customWrapperName}`, {
        component: true,
        usingComponents: {
          [customWrapperName]: `./${customWrapperName}`
        }
      })
      this.generateTemplateFile(compilation, compiler, `${name}/${customWrapperName}`, template.buildCustomComponentTemplate, this.options.fileType.templ)
      this.generateXSFile(compilation, compiler, `${name}/utils`, isBuildPlugin)
    })

    this.pages.forEach(page => {
      let importBaseTemplatePath = promoteRelativePath(path.relative(page.path, path.join(sourceDir, this.getTemplatePath(baseTemplateName))))
      const config = this.filesConfig[this.getConfigFilePath(page.name)]
      let isIndependent = false
      let independentName = ''
      this.independentPackages.forEach((pages, name) => {
        // independentPackages 是包含了所有 ChildCompiler 的资源，如果不是当前 ChildCompiler 的资源不做处理
        if (pages.includes(page.path) && name === childName) {
          isIndependent = true
          independentName = name
          importBaseTemplatePath = promoteRelativePath(path.relative(page.path, path.join(sourceDir, name, this.getTemplatePath(baseTemplateName))))
        }
      })

      if (!isIndependent) return

      // 生成页面模板需要在生成页面配置之前，因为会依赖到页面配置的部分内容
      if (!page.isNative) {
        this.generateTemplateFile(compilation, compiler, page.path, template.buildPageTemplate, importBaseTemplatePath, config)
      }

      if (config) {
        const importBaseCompPath = promoteRelativePath(path.relative(page.path, path.join(sourceDir, independentName, this.getTargetFilePath(this.getIsBuildPluginPath(baseCompName, isBuildPlugin), ''))))
        const importCustomWrapperPath = promoteRelativePath(path.relative(page.path, path.join(sourceDir, independentName, this.getTargetFilePath(this.getIsBuildPluginPath(customWrapperName, isBuildPlugin), ''))))
        config.content.usingComponents = {
          ...config.content.usingComponents
        }

        if(isUsingCustomWrapper) {
          config.content.usingComponents[customWrapperName] = importCustomWrapperPath
        }
        if (!template.isSupportRecursive && !page.isNative) {
          config.content.usingComponents[baseCompName] = importBaseCompPath
        }
        this.generateConfigFile(compilation, compiler, page.path, config.content)
      }
    })
  }

  /** 生成小程序相关文件 */
  async generateMiniFiles (compilation: Compilation, compiler: Compiler) {
    const { RawSource } = compiler.webpack.sources
    const { template, modifyMiniConfigs, isBuildPlugin, sourceDir } = this.options
    const baseTemplateName = this.getIsBuildPluginPath('base', isBuildPlugin)
    const isUsingCustomWrapper = componentConfig.thirdPartyComponents.has('custom-wrapper')

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
    if ((!this.options.blended || !this.options.newBlended) && !isBuildPlugin) {
      const appConfigPath = this.getConfigFilePath(this.appEntry)
      const appConfigName = path.basename(appConfigPath).replace(path.extname(appConfigPath), '')
      this.generateConfigFile(compilation, compiler, this.appEntry, this.filesConfig[appConfigName].content)
    }
    if (!template.isSupportRecursive) {
      // 如微信、QQ 不支持递归模版的小程序，需要使用自定义组件协助递归
      this.generateTemplateFile(compilation, compiler, this.getIsBuildPluginPath(baseCompName, isBuildPlugin), template.buildBaseComponentTemplate, this.options.fileType.templ)
      const baseCompConfig = {
        component: true,
        usingComponents: {
          [baseCompName]: `./${baseCompName}`
        }
      }
      if (isUsingCustomWrapper) {
        baseCompConfig.usingComponents[customWrapperName] = `./${customWrapperName}`
        this.generateConfigFile(compilation, compiler, this.getIsBuildPluginPath(customWrapperName, isBuildPlugin), {
          component: true,
          usingComponents: {
            [baseCompName]: `./${baseCompName}`,
            [customWrapperName]: `./${customWrapperName}`
          }
        })
      }
      this.generateConfigFile(compilation, compiler, this.getIsBuildPluginPath(baseCompName, isBuildPlugin), baseCompConfig)
    } else {
      if (isUsingCustomWrapper) {
        this.generateConfigFile(compilation, compiler, this.getIsBuildPluginPath(customWrapperName, isBuildPlugin), {
          component: true,
          usingComponents: {
            [customWrapperName]: `./${customWrapperName}`
          }
        })
      }
    }
    this.generateTemplateFile(compilation, compiler, baseTemplateName, template.buildTemplate, componentConfig)
    isUsingCustomWrapper && this.generateTemplateFile(compilation, compiler, this.getIsBuildPluginPath(customWrapperName, isBuildPlugin), template.buildCustomComponentTemplate, this.options.fileType.templ)
    this.generateXSFile(compilation, compiler, 'utils', isBuildPlugin)

    this.components.forEach(component => {
      const importBaseTemplatePath = promoteRelativePath(path.relative(component.path, path.join(sourceDir, this.getTemplatePath(baseTemplateName))))
      const config = this.filesConfig[this.getConfigFilePath(component.name)]
      if (config) {
        this.generateConfigFile(compilation, compiler, component.path, config.content)
      }
      if (!component.isNative) {
        this.generateTemplateFile(compilation, compiler, component.path, template.buildPageTemplate, importBaseTemplatePath)
      }
    })
    this.pages.forEach(page => {
      const importBaseTemplatePath = promoteRelativePath(path.relative(page.path, path.join(sourceDir, this.getTemplatePath(baseTemplateName))))
      const config = this.filesConfig[this.getConfigFilePath(page.name)]
      let isIndependent = false
      // pages 里面会混合独立分包的，在这里需要过滤一下，避免重复生成 assets
      this.independentPackages.forEach(pages => {
        if (pages.includes(page.path)) {
          isIndependent = true
        }
      })

      if (isIndependent) return

      // 生成页面模板需要在生成页面配置之前，因为会依赖到页面配置的部分内容
      if (!page.isNative) {
        this.generateTemplateFile(compilation, compiler, page.path, template.buildPageTemplate, importBaseTemplatePath, config)
      }

      if (config) {
        const importBaseCompPath = promoteRelativePath(path.relative(page.path, path.join(sourceDir, this.getTargetFilePath(this.getIsBuildPluginPath(baseCompName, isBuildPlugin), ''))))
        const importCustomWrapperPath = promoteRelativePath(path.relative(page.path, path.join(sourceDir, this.getTargetFilePath(this.getIsBuildPluginPath(customWrapperName, isBuildPlugin), ''))))
        config.content.usingComponents = {
          ...config.content.usingComponents
        }

        if(isUsingCustomWrapper) {
          config.content.usingComponents[customWrapperName] = importCustomWrapperPath
        }
        if (!template.isSupportRecursive && !page.isNative) {
          config.content.usingComponents[baseCompName] = importBaseCompPath
        }
        this.generateConfigFile(compilation, compiler, page.path, config.content)
      }
    })
    this.generateTabBarFiles(compilation, compiler)
    this.injectCommonStyles(compilation, compiler)
    if (this.themeLocation) {
      this.generateDarkModeFile(compilation, compiler)
    }
    if (isBuildPlugin) {
      const pluginJSONPath = path.join(sourceDir, 'plugin', 'plugin.json')
      if (fs.existsSync(pluginJSONPath)) {
        const pluginJSON = fs.readJSONSync(pluginJSONPath)
        this.modifyPluginJSON(pluginJSON)
        const relativePath = pluginJSONPath.replace(sourceDir, '').replace(/\\/g, '/')
        compilation.assets[relativePath] = new RawSource(JSON.stringify(pluginJSON))
      }
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
    let templStr = templateFn(...options)
    const fileTemplName = this.getTemplatePath(this.getComponentName(filePath))

    if (this.options.minifyXML?.collapseWhitespace) {
      const minify = require('html-minifier').minify
      templStr = minify(templStr, {
        collapseWhitespace: true,
        keepClosingSlash: true
      })
    }

    compilation.assets[fileTemplName] = new RawSource(templStr)
  }

  generateXSFile (compilation: Compilation, compiler: Compiler, xsPath, isBuildPlugin: boolean) {
    const { RawSource } = compiler.webpack.sources
    const ext = this.options.fileType.xs
    const isSupportXS = this.options.template.supportXS

    if (ext == null || !isSupportXS) {
      return
    }

    const xs = this.options.template.buildXScript()
    const fileXsName = this.getTargetFilePath(xsPath, ext)
    const filePath = this.getIsBuildPluginPath(fileXsName, isBuildPlugin)
    compilation.assets[filePath] = new RawSource(xs)
  }

  getComponentName (componentPath: string) {
    let componentName: string
    if (NODE_MODULES_REG.test(componentPath)) {
      componentName = componentPath.replace(this.context, '').replace(/\\/g, '/').replace(path.extname(componentPath), '')
      componentName = componentName.replace(/node_modules/gi, 'npm')
    } else {
      componentName = componentPath.replace(this.options.sourceDir, '').replace(/\\/g, '/').replace(path.extname(componentPath), '')
    }

    return componentName.replace(/^(\/|\\)/, '')
  }

  getIsBuildPluginPath (filePath, isBuildPlugin) {
    return isBuildPlugin ? `plugin/${filePath}` : filePath
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
    const { newBlended } = this.options
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
        (REG_STYLE.test(assetName) || REG_STYLE_EXT.test(assetName))
        && this.options.commonChunks.includes(fileName)
        // app.wxss 不能引入独立分包中的 common 样式文件
        && independentPackageNames.every(name => !assetName.includes(name))
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
      if (newBlended) {
        // 本地化组件引入common公共样式文件
        this.pages.forEach(page => {
          if (page.isNative) return
          const pageStyle = `${page.name}${styleExt}`
          if (this.nativeComponents.has(page.name)) {
            // 本地化组件如果没有wxss则直接写入一个空的
            if (!(pageStyle in assets)) {
              assets[pageStyle] = new ConcatSource('')
            }
            const source = new ConcatSource('')
            const originSource = assets[pageStyle]
            componentCommons.forEach(item => {
              source.add(`@import ${JSON.stringify(urlToRequest(path.posix.relative(path.dirname(pageStyle), item)))};\n`)
            })
            source.add(originSource)
            assets[pageStyle] = source
          } else {
            if (pageStyle in assets) {
              const source = new ConcatSource('')
              const originSource = assets[pageStyle]
              source.add(`@import ${JSON.stringify(urlToRequest(path.posix.relative(path.dirname(pageStyle), 'app.wxss')))};\n`)
              source.add(originSource)
              assets[pageStyle] = source
            }
          }
        })
      }
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
