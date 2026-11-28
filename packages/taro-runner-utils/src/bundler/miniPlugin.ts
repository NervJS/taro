import path from 'node:path'

import {
  fs,
  getNpmPackageAbsolutePath,
  isAliasPath,
  isEmptyObject,
  META_TYPE,
  NODE_MODULES,
  printLog,
  processTypeEnum,
  promoteRelativePath,
  readConfig,
  REG_NODE_MODULES,
  REG_STYLE,
  replaceAliasPath,
  resolveMainFilePath,
  SCRIPT_EXT
} from '@tarojs/helper'
import { urlToRequest } from 'loader-utils'
import { SyncHook, SyncWaterfallHook } from 'tapable'

import AsyncSubPackagePlugin from './asyncSubPackagePlugin'
import { validatePrerenderPages } from './prerender'
import SubPackageIndiePlugin, { subPackageIndieCustomWrapperRootsKey } from './subPackageIndiePlugin'
import {
  computeForceCustomWrapperForIndependentPackage,
  isWeappSubPackageIndieEnabled,
  shouldProcessCommonStyles
} from './utils'

import type { RecursiveTemplate, UnRecursiveTemplate } from '@tarojs/shared/dist/template'
import type { AppConfig, Config } from '@tarojs/taro'
import type { IMiniFilesConfig } from '@tarojs/taro/types/compile'
import type { IComponentConfig } from '@tarojs/taro/types/compile/hooks'
import type { IBundlerSources, IComponent, IFileType } from './types'

export const baseCompName = 'comp'
export const customWrapperName = 'custom-wrapper'
export const STYLE_ISOLATION_APPLY_SHARED = 'apply-shared'
export const STYLE_ISOLATION_SHARED = 'shared'

export type IndependentPackage = { pages: string[], components: string[] }

export interface MiniPluginHooks {
  /** 修改是否跳过根目录入口（comp/custom-wrapper）的生成 */
  modifyEntries: SyncWaterfallHook<any>
  /** 修改 chunk require 注入的行为，返回 null 表示使用默认逻辑 */
  modifyChunkRequire: SyncWaterfallHook<any>
  /** afterResolve 阶段的扩展点 */
  afterResolveModule: SyncHook<any>
  /** 编译额外入口（如 child compiler） */
  compileExtraEntries: SyncHook<any>
  /** 修改是否跳过根目录模板文件的生成 */
  modifySkipRootTemplates: SyncWaterfallHook<any>
  /** 生成额外文件（如子分包独立模板文件），返回 customWrapperRoots */
  generateExtraFiles: SyncWaterfallHook<any>
  /** 修改页面配置（usingComponents、importBaseTemplatePath 等） */
  modifyPageConfig: SyncWaterfallHook<any>
  /** 修改组件配置 */
  modifyComponentConfig: SyncHook<any>
  /** 生成文件后的回调（在 injectCommonStyles 之后） */
  afterGenerateFiles: SyncHook<any>
  /** 优化/清理产物 */
  optimizeAssets: SyncHook<any>
  /** 修改 config 文件内容 */
  modifyConfig: SyncWaterfallHook<any>
  /** 修改样式注入逻辑 */
  modifyStyleImport: SyncWaterfallHook<any>
  /** 修改 shouldProcessStyles 条件 */
  modifyShouldProcessStyles: SyncWaterfallHook<any>
}

export interface IBaseMiniPluginOptions<TCombination = any> {
  commonChunks: string[]
  constantsReplaceList: Record<string, any>
  pxTransformConfig: Record<string, any>
  hot: boolean
  combination: TCombination
  loaderMeta?: Record<string, any>
  blended?: boolean
  newBlended?: boolean
  isBuildPlugin?: boolean
  skipProcessUsingComponents?: boolean
}

export interface IBaseMiniPluginResolvedOptions<TCombination = any> extends IBaseMiniPluginOptions<TCombination> {
  sourceDir: string
  framework: string
  frameworkExts: string[]
  template: RecursiveTemplate | UnRecursiveTemplate
  runtimePath: string | string[]
  behaviorsName: string
  isBuildPlugin: boolean
  blended: boolean
  newBlended: boolean
  fileType: IFileType
  skipProcessUsingComponents: boolean
  logger?: {
    quiet?: boolean
  }
}

export function createMiniPluginHooks (): MiniPluginHooks {
  return {
    modifyEntries: new SyncWaterfallHook(['entries']),
    modifyChunkRequire: new SyncWaterfallHook(['result', 'chunkId', 'miniType']),
    afterResolveModule: new SyncHook(['resolveData']),
    compileExtraEntries: new SyncHook(['compiler', 'compilation', 'promises']),
    modifySkipRootTemplates: new SyncWaterfallHook(['skip']),
    generateExtraFiles: new SyncWaterfallHook(['customWrapperRoots', 'compilation', 'compiler']),
    modifyPageConfig: new SyncWaterfallHook(['context', 'page', 'customWrapperRoots']),
    modifyComponentConfig: new SyncHook(['context', 'customWrapperRoots']),
    afterGenerateFiles: new SyncHook(['compilation', 'compiler']),
    optimizeAssets: new SyncHook(['compilation']),
    modifyConfig: new SyncWaterfallHook(['config', 'componentName']),
    modifyStyleImport: new SyncWaterfallHook(['context', 'page']),
    modifyShouldProcessStyles: new SyncWaterfallHook(['shouldProcess']),
  }
}

export abstract class BaseMiniPlugin<
  TCombination extends Record<string, any> = any,
  TOptions extends IBaseMiniPluginResolvedOptions<TCombination> = IBaseMiniPluginResolvedOptions<TCombination>
> {
  options: TOptions
  context: string
  appEntry: any
  appConfig: AppConfig
  filesConfig: IMiniFilesConfig = {}
  isWatch = false
  pages = new Set<IComponent>()
  components = new Set<IComponent>()
  nativeComponents = new Map<string, IComponent>()
  tabBarIcons = new Set<string>()
  prerenderPages = new Set<string>()
  themeLocation: string
  pageLoaderName = '@tarojs/taro-loader/lib/page'
  independentPackages = new Map<string, IndependentPackage>()
  forceCustomWrapperDefineDefinitions: Record<string, string> | null = null
  hooks: MiniPluginHooks
  loadChunksPlugin: any
  subPackageIndiePlugin: SubPackageIndiePlugin | null = null
  asyncSubPackagePlugin: AsyncSubPackagePlugin | null = null
  protected currentCompiler: any

  constructor (options: IBaseMiniPluginOptions<TCombination>) {
    const { combination } = options
    const miniBuildConfig = combination.config
    const { template, baseLevel = 16, experimental } = miniBuildConfig

    this.options = {
      sourceDir: combination.sourceDir,
      framework: miniBuildConfig.framework || 'react',
      frameworkExts: miniBuildConfig.frameworkExts || [],
      template,
      runtimePath: miniBuildConfig.runtimePath || '',
      behaviorsName: miniBuildConfig.behaviorsName || 'behaviors',
      isBuildPlugin: options.isBuildPlugin ?? miniBuildConfig.isBuildPlugin ?? false,
      blended: options.blended ?? miniBuildConfig.blended ?? false,
      newBlended: options.newBlended ?? miniBuildConfig.newBlended ?? false,
      logger: miniBuildConfig.logger,
      skipProcessUsingComponents: options.skipProcessUsingComponents ?? miniBuildConfig.skipProcessUsingComponents ?? false,
      fileType: miniBuildConfig.fileType || {
        style: '.wxss',
        config: '.json',
        script: '.js',
        templ: '.wxml'
      },
      combination,
      commonChunks: options.commonChunks || ['runtime', 'vendors'],
      constantsReplaceList: options.constantsReplaceList || {},
      pxTransformConfig: options.pxTransformConfig || {},
      hot: options.hot ?? false,
      loaderMeta: options.loaderMeta || {},
    } as TOptions

    this.hooks = createMiniPluginHooks()

    if (template) {
      if (template.isSupportRecursive === false && baseLevel > 0) {
        (template as UnRecursiveTemplate).baseLevel = baseLevel
      }
      if (experimental?.useXsForTemplate === false) {
        (template as UnRecursiveTemplate).isUseXS = false
      }
      if (experimental?.compileMode === true) {
        template.isUseCompileMode = true
      }
    }
  }

  public getSources (compiler?: any): IBundlerSources {
    return (compiler || this.currentCompiler).webpack.sources
  }

  public abstract getComponentConfig (): IComponentConfig
  protected abstract getTemplateDir (): string

  protected getDefinePluginClass (compiler: any): any {
    return compiler.webpack.DefinePlugin
  }

  abstract addEntry (entryPath: string, entryName: string, entryType: META_TYPE, options?: Record<string, any>): void

  protected abstract createLoadChunksPlugin (): { apply: (compiler: any) => void }
  protected abstract addLoadChunksPlugin (compiler: any): void

  protected shouldSkipIndependentPageInMainGenerate (_page: IComponent): boolean {
    return false
  }

  protected onSubPackageIndieCustomWrapperRoots (compilation: any, roots: Set<string>): void {
    compilation[subPackageIndieCustomWrapperRootsKey] = roots
  }

  applySubPackageIndiePlugin () {
    if (!this.isWeappSubPackageIndieEnabled()) { return }

    this.subPackageIndiePlugin = new SubPackageIndiePlugin(this)
    this.subPackageIndiePlugin.apply()
  }

  applyAsyncSubPackagePlugin (compiler: any) {
    if (!this.subPackageIndiePlugin) { return }
    const asyncRootMap = this.subPackageIndiePlugin.getAsyncSubPackageRootMap()
    if (asyncRootMap.size === 0 && !this.asyncSubPackagePlugin) { return }

    if (!this.asyncSubPackagePlugin) {
      this.asyncSubPackagePlugin = new AsyncSubPackagePlugin(this)
    }
    this.asyncSubPackagePlugin.updateAsyncRootMap(asyncRootMap)
    this.asyncSubPackagePlugin.updateAsyncRuntimeRoots(this.subPackageIndiePlugin.getAsyncSubPackageRuntimeRoots())
    this.asyncSubPackagePlugin.apply(compiler)
  }

  protected onBeforeRun (): void {
    this.subPackageIndiePlugin?.invalidateRunCache()
  }

  protected onAfterRun (_compiler: any): void {}
  protected applyEntryHooks (_compiler: any): void {}
  protected onMake (_compiler: any, _compilation: any, _promises: Promise<null>[]): void {}
  protected onCollectMakeEntryPromises (_compilation: any, _promises: Promise<null>[]): void {}
  protected onCompilation (_compilation: any, _normalModuleFactory: any, _compiler: any): void {}

  protected async onProcessAssetsAdditional (compilation: any, compiler: any) {
    await this.generateMiniFiles(compilation, compiler)
  }

  protected applyExtraCompilerPlugins (_compiler: any): void {}

  apply (compiler: any) {
    const PLUGIN_NAME = 'TaroMiniPlugin'
    this.currentCompiler = compiler
    this.context = compiler.context
    this.appEntry = this.getAppEntry(compiler)

    this.applySubPackageIndiePlugin()

    const { combination, newBlended } = this.options
    const { onCompilerMake, modifyBuildAssets } = combination.config

    compiler.hooks.run.tapAsync(
      PLUGIN_NAME,
      this.tryAsync(async (c: any) => {
        await this.run(c)
        this.applyForceCustomWrapperDefine(c)
        this.applyAsyncSubPackagePlugin(c)
        this.onAfterRun(c)
        this.createLoadChunksPlugin().apply(c)
      })
    )

    compiler.hooks.watchRun.tapAsync(
      PLUGIN_NAME,
      this.tryAsync(async (c: any) => {
        const changedFiles = this.getChangedFiles(c)
        if (changedFiles && changedFiles.size > 0) {
          this.isWatch = true
        }
        await this.run(c)
        this.applyForceCustomWrapperDefine(c)
        this.applyAsyncSubPackagePlugin(c)
        this.onAfterRun(c)
        if (!this.loadChunksPlugin) {
          this.loadChunksPlugin = this.createLoadChunksPlugin()
          this.loadChunksPlugin.apply(c)
        }
      })
    )

    this.applyEntryHooks(compiler)

    compiler.hooks.make.tapAsync(
      PLUGIN_NAME,
      this.tryAsync(async (compilation: any) => {
        const promises: Promise<null>[] = []
        this.onMake(compiler, compilation, promises)
        this.hooks.compileExtraEntries.call(compiler, compilation, promises)
        this.onCollectMakeEntryPromises(compilation, promises)
        await Promise.all(promises)
        await onCompilerMake?.(compilation, compiler, this)
      })
    )

    compiler.hooks.compilation.tap(PLUGIN_NAME, (compilation: any, { normalModuleFactory }: any) => {
      if (this.isWeappSubPackageIndieEnabled()) {
        normalModuleFactory.hooks.afterResolve.tap(PLUGIN_NAME, (resolveData: any) => {
          this.hooks.afterResolveModule.call(resolveData)
        })
      }

      this.onCompilation(compilation, normalModuleFactory, compiler)

      const {
        PROCESS_ASSETS_STAGE_ADDITIONAL,
        PROCESS_ASSETS_STAGE_OPTIMIZE,
        PROCESS_ASSETS_STAGE_REPORT
      } = compiler.webpack.Compilation

      compilation.hooks.processAssets.tapAsync(
        {
          name: PLUGIN_NAME,
          stage: PROCESS_ASSETS_STAGE_ADDITIONAL
        },
        this.tryAsync(async () => {
          await this.onProcessAssetsAdditional(compilation, compiler)
        })
      )

      compilation.hooks.processAssets.tapAsync(
        {
          name: PLUGIN_NAME,
          stage: PROCESS_ASSETS_STAGE_OPTIMIZE
        },
        this.tryAsync(async () => {
          await this.optimizeMiniFiles(compilation, compiler)
        })
      )

      compilation.hooks.processAssets.tapAsync(
        {
          name: PLUGIN_NAME,
          stage: PROCESS_ASSETS_STAGE_REPORT
        },
        this.tryAsync(async () => {
          if (typeof modifyBuildAssets === 'function') {
            await modifyBuildAssets(compilation.assets, this)
          }
        })
      )
    })

    compiler.hooks.afterEmit.tapAsync(
      PLUGIN_NAME,
      this.tryAsync(async (compilation: any) => {
        await this.addTabBarFilesToDependencies(compilation)
      })
    )

    this.applyExtraCompilerPlugins(compiler)

    newBlended && this.addLoadChunksPlugin(compiler)
  }

  async run (compiler: any) {
    this.onBeforeRun()

    if (this.options.isBuildPlugin) {
      this.getPluginFiles()
      this.getConfigFiles(compiler)
    } else {
      this.appConfig = await this.getAppConfig()
      this.getPages()
      this.getPagesConfig()
      this.getDarkMode()
      this.getConfigFiles(compiler)
      this.addEntries()
    }
  }

  getConfigFiles (_compiler: any) {
    const filesConfig = this.filesConfig
    Object.keys(filesConfig).forEach(item => {
      if (fs.existsSync(filesConfig[item].path)) {
        this.addEntry(filesConfig[item].path, item, META_TYPE.CONFIG)
      }
    })
  }

  tryAsync<T = any> (fn: (target: T) => Promise<any> | any) {
    return async (arg: T, callback: any) => {
      try {
        await fn(arg)
        callback()
      } catch (err) {
        callback(err)
      }
    }
  }

  isWeappSubPackageIndieEnabled () {
    return isWeappSubPackageIndieEnabled(process.env.TARO_ENV, this.options.newBlended)
  }

  getCompTemplatePath () {
    const templateName = this.isWeappSubPackageIndieEnabled() ? 'comp-new-blended' : 'comp'
    return path.resolve(this.getTemplateDir(), templateName)
  }

  getCustomWrapperTemplatePath () {
    return path.resolve(this.getTemplateDir(), 'custom-wrapper')
  }

  getAppEntry (compiler: any) {
    const { entry } = compiler.options
    if (this.options.isBuildPlugin) {
      const entryCopy = Object.assign({}, entry)
      compiler.options.entry = {}
      return entryCopy
    }

    function getEntryPath (entryObj: any) {
      const app = entryObj.app
      if (Array.isArray(app)) {
        return app[0]
      } else if (Array.isArray(app?.import)) {
        return app.import[0]
      }
      return app
    }

    const appEntryPath = getEntryPath(entry)
    compiler.options.entry = {}
    return appEntryPath
  }

  getIndependentPackage (pagePath: string): IndependentPackage | undefined {
    return Array.from(this.independentPackages.values()).find(independentPackage => {
      return independentPackage.pages.includes(pagePath)
    })
  }

  getChangedFiles (compiler: any) {
    return compiler.modifiedFiles
  }

  getEntryLoaderConfig (
    miniType: META_TYPE,
    entryName: string,
    resourcePath: string
  ): { loaderName: string, options: Record<string, any> } | null {
    const { framework, loaderMeta, pxTransformConfig, isBuildPlugin } = this.options

    if (miniType === META_TYPE.ENTRY) {
      return {
        loaderName: '@tarojs/taro-loader',
        options: {
          framework,
          loaderMeta,
          prerender: this.prerenderPages.size > 0,
          config: this.appConfig,
          runtimePath: this.options.runtimePath,
          behaviorsName: this.options.behaviorsName,
          blended: this.options.blended,
          newBlended: this.options.newBlended,
          pxTransformConfig
        }
      }
    }

    if (miniType === META_TYPE.PAGE) {
      let isIndependent = false
      this.independentPackages.forEach(({ pages }) => {
        if (pages.includes(resourcePath)) {
          isIndependent = true
        }
      })
      const isNewBlended = this.nativeComponents.has(entryName)
      const loaderName = (isNewBlended || isBuildPlugin)
        ? '@tarojs/taro-loader/lib/native-component'
        : (isIndependent
          ? '@tarojs/taro-loader/lib/independentPage'
          : this.pageLoaderName)

      return {
        loaderName,
        options: {
          framework,
          loaderMeta,
          isNewBlended,
          name: entryName,
          prerender: this.prerenderPages.has(entryName),
          config: this.filesConfig,
          appConfig: this.appConfig,
          runtimePath: this.options.runtimePath,
          behaviorsName: this.options.behaviorsName,
          hot: this.options.hot
        }
      }
    }

    if (miniType === META_TYPE.COMPONENT) {
      const loaderName = isBuildPlugin
        ? '@tarojs/taro-loader/lib/native-component'
        : '@tarojs/taro-loader/lib/component'

      return {
        loaderName,
        options: {
          framework,
          loaderMeta,
          name: entryName,
          prerender: this.prerenderPages.has(entryName),
          runtimePath: this.options.runtimePath,
          behaviorsName: this.options.behaviorsName
        }
      }
    }

    return null
  }

  getPluginFiles () {
    const fileList = new Set<IComponent>()
    const { template, combination } = this.options
    const { pluginConfig, pluginMainEntry } = combination.buildNativePlugin
    const normalFiles = new Set<IComponent>()
    Object.keys(this.appEntry).forEach(key => {
      const filePath = this.appEntry[key][0] || this.appEntry[key].import[0]
      if (key === pluginMainEntry) {
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
              if (`${pluginConfig[pluginKey][pageKey]}` === key) {
                isPage = true
              }
            })
          }
          if (pluginKey === 'publicComponents') {
            Object.keys(pluginConfig[pluginKey]).forEach(pageKey => {
              if (`${pluginConfig[pluginKey][pageKey]}` === key) {
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
      this.addEntry(this.getCompTemplatePath(), 'comp', META_TYPE.STATIC)
    }
    this.addEntry(this.getCustomWrapperTemplatePath(), 'custom-wrapper', META_TYPE.STATIC)
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
      this.addComponentOrPageEntry(item, META_TYPE.PAGE)
    })
    this.components.forEach(item => {
      this.compileFile(item)
      this.addComponentOrPageEntry(item, META_TYPE.COMPONENT)
    })
  }

  protected addComponentOrPageEntry (item: IComponent, nonNativeType: META_TYPE.PAGE | META_TYPE.COMPONENT) {
    if (item.isNative) {
      this.addEntry(item.path, item.name, META_TYPE.NORMAL, { isNativePage: true })
      if (item.stylePath && fs.existsSync(item.stylePath)) {
        this.addEntry(item.stylePath, this.getStylePath(item.name), META_TYPE.NORMAL)
      }
      if (item.templatePath && fs.existsSync(item.templatePath)) {
        this.addEntry(item.templatePath, this.getTemplatePath(item.name), META_TYPE.NORMAL)
      }
    } else {
      this.addEntry(item.path, item.name, nonNativeType)
    }
  }

  modifyPluginJSON (pluginJSON: Record<string, any>) {
    const { main, publicComponents } = pluginJSON
    const isUsingCustomWrapper = this.getComponentConfig().thirdPartyComponents.has('custom-wrapper')
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

  async getAppConfig (): Promise<AppConfig> {
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
    const { modifyAppConfig } = this.options.combination.config
    if (typeof modifyAppConfig === 'function') {
      await modifyAppConfig(appConfig)
    }
    if (!this.isWeappSubPackageIndieEnabled()) {
      delete appConfig.forceCustomWrapper
      delete appConfig.subPackageIndie
    }
    return appConfig as AppConfig
  }

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

    const { newBlended, frameworkExts, combination } = this.options
    const { prerender } = combination.config

    const subPackages = this.appConfig.subPackages || this.appConfig.subpackages || []
    const subPages: string[] = []
    for (const sp of subPackages) {
      const root = sp.root || ''
      for (const pg of (sp.pages || [])) {
        subPages.push(`${root}/${pg}`.replace(/\/{2,}/g, '/'))
      }
    }

    this.prerenderPages = new Set(
      validatePrerenderPages([...appPages, ...subPages], prerender).map(p => p.path)
    )
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
    newBlended && this.getNativeComponent()
  }

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
      this.nativeComponents.set(item, componentObj)
    })
  }

  getPagesConfig () {
    this.pages.forEach(page => {
      if (!this.isWatch && this.options.logger?.quiet === false) {
        printLog(processTypeEnum.COMPILE, '发现页面', this.getShowPath(page.path))
      }

      const pagePath = page.path
      const independentPackage = this.getIndependentPackage(pagePath)

      this.compileFile(page, independentPackage)
    })
  }

  addEntries () {
    const { template } = this.options

    this.addEntry(this.appEntry, 'app', META_TYPE.ENTRY)

    const entryFlags = this.hooks.modifyEntries.call({
      skipRootComp: false,
      skipRootWrapper: false,
    })

    if (!template.isSupportRecursive && !entryFlags.skipRootComp) {
      this.addEntry(this.getCompTemplatePath(), 'comp', META_TYPE.STATIC)
    }
    if (!entryFlags.skipRootWrapper) {
      this.addEntry(this.getCustomWrapperTemplatePath(), 'custom-wrapper', META_TYPE.STATIC)
    }

    this.pages.forEach(item => {
      this.addComponentOrPageEntry(item, META_TYPE.PAGE)
    })

    this.components.forEach(item => {
      this.addComponentOrPageEntry(item, META_TYPE.COMPONENT)
    })
  }

  computeForceCustomWrapperForMainComp (): boolean {
    if (this.options.template.isSupportRecursive) { return false }
    const independentPaths = new Set<string>()
    this.independentPackages.forEach(({ pages }) => {
      pages.forEach(p => independentPaths.add(p))
    })
    for (const page of this.pages) {
      if (page.isNative || independentPaths.has(page.path)) { continue }
      const content = this.filesConfig[this.getConfigFilePath(page.name)]?.content as { forceCustomWrapper?: boolean } | undefined
      if (content?.forceCustomWrapper) { return true }
    }
    return false
  }

  computeForceCustomWrapperForIndieRoot (pages: string[]): boolean {
    return computeForceCustomWrapperForIndependentPackage(
      pages, this.pages, this.filesConfig, (p) => this.getConfigFilePath(p)
    )
  }

  applyForceCustomWrapperDefine (compiler: any): void {
    if (this.options.template.isSupportRecursive) { return }

    const value = JSON.stringify(this.computeForceCustomWrapperForMainComp())
    if (!this.forceCustomWrapperDefineDefinitions) {
      this.forceCustomWrapperDefineDefinitions = {
        TARO_FORCE_CUSTOM_WRAPPER: value
      }
      const DefinePlugin = this.getDefinePluginClass(compiler)
      new DefinePlugin(this.forceCustomWrapperDefineDefinitions).apply(compiler)
      return
    }

    this.forceCustomWrapperDefineDefinitions.TARO_FORCE_CUSTOM_WRAPPER = value
  }

  replaceExt (file: string, ext: string) {
    return path.join(path.dirname(file), path.basename(file, path.extname(file)) + `${ext}`)
  }

  compileFile (file: IComponent, independentPackage?: IndependentPackage) {
    const componentConfig = this.getComponentConfig()
    const filePath = file.path
    const fileConfigPath = file.isNative ? this.replaceExt(filePath, '.json') : this.getConfigFilePath(filePath)
    const fileConfig = readConfig(fileConfigPath, this.options.combination.config)
    const { componentGenerics, usingComponents } = fileConfig

    if (this.options.isBuildPlugin && componentGenerics) {
      Object.keys(componentGenerics).forEach(component => {
        if (componentGenerics[component]) {
          if (!componentConfig.thirdPartyComponents.has(component)) {
            componentConfig.thirdPartyComponents.set(component, new Set())
          }
        }
      })
    }

    if (usingComponents) {
      const componentNames = Object.keys(usingComponents)
      const depComponents: Array<{ name: string, path: string }> = []
      const alias = this.options.combination.chain.toConfig().resolve?.alias as Record<string, any> | undefined

      for (const compName of componentNames) {
        let compPath: string = usingComponents[compName]

        if (alias && isAliasPath(compPath, alias)) {
          compPath = replaceAliasPath(filePath, compPath, alias)
          fileConfig.usingComponents[compName] = compPath
        }

        const notNpmPkgReg = /^[.\\/]/
        if (
          !this.options.skipProcessUsingComponents &&
          !compPath.startsWith('plugin://') &&
          !notNpmPkgReg.test(compPath)
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
        if (fs.existsSync(componentPath) && !Array.from(this.components).some(c => c.path === componentPath)) {
          const componentName = this.getComponentName(componentPath)
          if (this.nativeComponents.has(componentName)) { return }
          const componentTempPath = this.getTemplatePath(componentPath)
          const isNative = this.isNativePageORComponent(componentTempPath)
          const componentObj = {
            name: componentName,
            path: componentPath,
            isNative,
            stylePath: isNative ? this.getStylePath(componentPath) : undefined,
            templatePath: isNative ? this.getTemplatePath(componentPath) : undefined
          }

          independentPackage?.components?.push(componentPath)

          this.components.add(componentObj)
          this.compileFile(componentObj, independentPackage)
        }
      })
    }

    this.filesConfig[this.getConfigFilePath(file.name)] = {
      content: fileConfig,
      path: fileConfigPath
    }
  }

  getSubPackages (appConfig: AppConfig) {
    const subPackages = appConfig.subPackages || appConfig.subpackages
    const { frameworkExts } = this.options
    if (subPackages && subPackages.length) {
      subPackages.forEach(item => {
        if (item.pages && item.pages.length) {
          const root = item.root
          const isIndependent = !!item.independent
          if (isIndependent) {
            this.independentPackages.set(root, { pages: [], components: [] })
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
                this.independentPackages.get(root)?.pages.push(pagePath)
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

  getDarkMode () {
    const themeLocation = this.appConfig.themeLocation
    const darkMode = this.appConfig.darkmode
    if (darkMode && themeLocation && typeof themeLocation === 'string') {
      this.themeLocation = themeLocation
    }
  }

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

  isNativePageORComponent (templatePath: string): boolean {
    return fs.existsSync(templatePath)
  }

  getShowPath (filePath: string) {
    return filePath.replace(this.context, '').replace(/\\/g, '/').replace(/^\//, '')
  }

  adjustConfigContent (config: Config) {
    const { usingComponents } = config
    if (!usingComponents || this.options.skipProcessUsingComponents) { return }

    for (const [key, value] of Object.entries(usingComponents)) {
      const compPath = value instanceof Array ? value[0] : value
      if (!compPath.includes(NODE_MODULES)) { return }

      const match = compPath.replace(NODE_MODULES, 'npm').match(/npm.*/)
      usingComponents[key] = match ? `${path.sep}${match[0]}` : compPath
    }
  }

  async generateMiniFiles (compilation: any, compiler: any) {
    const { RawSource } = this.getSources(compiler)
    const componentConfig = this.getComponentConfig()
    const { template, combination, isBuildPlugin, sourceDir } = this.options
    const { modifyMiniConfigs } = combination.config
    const baseTemplateName = 'base'
    const isUsingCustomWrapper = componentConfig.thirdPartyComponents.has('custom-wrapper')
    let subPackageIndieCustomWrapperRoots = new Set<string>()
    this.onSubPackageIndieCustomWrapperRoots(compilation, subPackageIndieCustomWrapperRoots)

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

    let skipRootTemplates = false
    skipRootTemplates = this.hooks.modifySkipRootTemplates.call(skipRootTemplates)

    if (!template.isSupportRecursive && !skipRootTemplates) {
      this.generateTemplateFile(compilation, compiler, baseCompName, template.buildBaseComponentTemplate, this.options.fileType.templ)

      const baseCompConfig = {
        component: true,
        styleIsolation: STYLE_ISOLATION_APPLY_SHARED,
        usingComponents: {
          [baseCompName]: `./${baseCompName}`
        }
      } as Config & { component?: boolean, usingComponents: Record<string, string> }

      if (isUsingCustomWrapper) {
        baseCompConfig.usingComponents[customWrapperName] = `./${customWrapperName}`
        this.generateConfigFile(compilation, compiler, customWrapperName, {
          component: true,
          styleIsolation: STYLE_ISOLATION_APPLY_SHARED,
          usingComponents: {
            [baseCompName]: `./${baseCompName}`,
            [customWrapperName]: `./${customWrapperName}`
          }
        })
      }

      this.generateConfigFile(compilation, compiler, baseCompName, baseCompConfig)
    } else if (!skipRootTemplates) {
      if (isUsingCustomWrapper) {
        this.generateConfigFile(compilation, compiler, customWrapperName, {
          component: true,
          styleIsolation: STYLE_ISOLATION_APPLY_SHARED,
          usingComponents: {
            [customWrapperName]: `./${customWrapperName}`
          }
        })
      }
    }

    if (!skipRootTemplates) {
      this.generateTemplateFile(compilation, compiler, baseTemplateName, template.buildTemplate, componentConfig)
      isUsingCustomWrapper && this.generateTemplateFile(compilation, compiler, customWrapperName, template.buildCustomComponentTemplate, this.options.fileType.templ)
      this.generateXSFile(compilation, compiler, 'utils')
    }

    subPackageIndieCustomWrapperRoots = this.hooks.generateExtraFiles.call(subPackageIndieCustomWrapperRoots, compilation, compiler)
    this.onSubPackageIndieCustomWrapperRoots(compilation, subPackageIndieCustomWrapperRoots)

    this.components.forEach(component => {
      const importBaseTemplatePath = promoteRelativePath(path.relative(component.path, path.join(sourceDir, isBuildPlugin ? 'plugin' : '', this.getTemplatePath(baseTemplateName))))
      const config = this.filesConfig[this.getConfigFilePath(component.name)]
      if (config) {
        this.hooks.modifyComponentConfig.call({ config, component }, subPackageIndieCustomWrapperRoots)
        this.generateConfigFile(compilation, compiler, component.path, config.content)
      }
      if (!component.isNative) {
        this.generateTemplateFile(compilation, compiler, component.path, template.buildPageTemplate, importBaseTemplatePath)
      }
    })

    this.pages.forEach(page => {
      if (this.shouldSkipIndependentPageInMainGenerate(page)) { return }

      let importBaseTemplatePath = promoteRelativePath(path.relative(page.path, path.join(sourceDir, isBuildPlugin ? 'plugin' : '', this.getTemplatePath(baseTemplateName))))
      const config = this.filesConfig[this.getConfigFilePath(page.name)]

      let importBaseCompPath = promoteRelativePath(path.relative(page.path, path.join(sourceDir, isBuildPlugin ? 'plugin' : '', this.getTargetFilePath(baseCompName, ''))))
      let importCustomWrapperPath = promoteRelativePath(path.relative(page.path, path.join(sourceDir, isBuildPlugin ? 'plugin' : '', this.getTargetFilePath(customWrapperName, ''))))
      let isPageRecursiveDisabled = false
      let shouldUseCustomWrapper = isUsingCustomWrapper

      const pageConfigContext = this.hooks.modifyPageConfig.call({
        importBaseTemplatePath,
        importBaseCompPath,
        importCustomWrapperPath,
        shouldUseCustomWrapper,
        isPageRecursiveDisabled,
      }, page, subPackageIndieCustomWrapperRoots)

      importBaseTemplatePath = pageConfigContext.importBaseTemplatePath
      importBaseCompPath = pageConfigContext.importBaseCompPath
      importCustomWrapperPath = pageConfigContext.importCustomWrapperPath
      shouldUseCustomWrapper = pageConfigContext.shouldUseCustomWrapper
      isPageRecursiveDisabled = pageConfigContext.isPageRecursiveDisabled

      if (!page.isNative) {
        this.generateTemplateFile(compilation, compiler, page.path, template.buildPageTemplate, importBaseTemplatePath, config)
      }

      if (config) {
        config.content.usingComponents = {
          ...config.content.usingComponents
        }

        if (shouldUseCustomWrapper) {
          config.content.usingComponents[customWrapperName] = importCustomWrapperPath
        }
        if (!template.isSupportRecursive && !page.isNative && !isPageRecursiveDisabled) {
          config.content.usingComponents[baseCompName] = importBaseCompPath
        }
        this.generateConfigFile(compilation, compiler, page.path, config.content)
      }
    })

    this.generateTabBarFiles(compilation, compiler)
    this.injectCommonStyles(compilation, compiler)

    this.hooks.afterGenerateFiles.call(compilation, compiler)

    if (this.themeLocation) {
      this.generateDarkModeFile(compilation, compiler)
    }

    if (isBuildPlugin) {
      const pluginJSONPath = path.join(sourceDir, 'plugin', 'plugin.json')
      if (fs.existsSync(pluginJSONPath)) {
        const pluginJSON = fs.readJSONSync(pluginJSONPath)
        this.modifyPluginJSON(pluginJSON)
        compilation.assets['plugin.json'] = new RawSource(JSON.stringify(pluginJSON))
      }
    }
  }

  async optimizeMiniFiles (compilation: any, _compiler: any) {
    const isUsingCustomWrapper = this.getComponentConfig().thirdPartyComponents.has('custom-wrapper')

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

    this.hooks.optimizeAssets.call(compilation)
  }

  generateConfigFile (compilation: any, compiler: any, filePath: string, config: Config & { component?: boolean }) {
    const { RawSource } = this.getSources(compiler)
    const componentName = this.getComponentName(filePath)
    const fileConfigName = this.getConfigPath(componentName)

    config = this.hooks.modifyConfig.call(config, componentName)

    const unofficialConfigs = ['enableShareAppMessage', 'enableShareTimeline', 'enablePageMeta', 'components', 'forceCustomWrapper', 'subPackageIndie']
    unofficialConfigs.forEach(item => {
      delete config[item]
    })

    this.adjustConfigContent(config)

    compilation.assets[fileConfigName] = new RawSource(JSON.stringify(config))
  }

  generateTemplateFile (compilation: any, compiler: any, filePath: string, templateFn: (...args: any[]) => string, ...options: any[]) {
    const { RawSource } = this.getSources(compiler)
    let templStr = templateFn(...options)
    const fileTemplName = this.getTemplatePath(this.getComponentName(filePath))

    if (this.options.combination.config.minifyXML?.collapseWhitespace) {
      const minify = require('html-minifier').minify
      templStr = minify(templStr, {
        collapseWhitespace: true,
        keepClosingSlash: true
      })
    }

    compilation.assets[fileTemplName] = new RawSource(templStr)
  }

  generateXSFile (compilation: any, compiler: any, xsPath: string) {
    const { RawSource } = this.getSources(compiler)
    const ext = this.options.fileType.xs
    const isUseXS = this.options.template.isUseXS

    if (ext == null || !isUseXS) {
      return
    }

    const xs = this.options.template.buildXScript()
    const fileXsName = this.getTargetFilePath(xsPath, ext)
    compilation.assets[fileXsName] = new RawSource(xs)
  }

  getComponentName (componentPath: string) {
    let componentName: string
    if (REG_NODE_MODULES.test(componentPath)) {
      const nodeModulesRegx = new RegExp(REG_NODE_MODULES, 'gi')
      componentName = componentPath.replace(this.context, '').replace(/\\/g, '/').replace(path.extname(componentPath), '')
      componentName = componentName.replace(nodeModulesRegx, 'npm')
    } else {
      componentName = componentPath.replace(this.options.sourceDir, '').replace(/\\/g, '/').replace(path.extname(componentPath), '')
      if (this.options.isBuildPlugin) {
        componentName = componentName.replace(/plugin\//, '')
      }
    }

    return componentName.replace(/^(\/|\\)/, '')
  }

  getConfigFilePath (filePath: string) {
    return resolveMainFilePath(`${filePath.replace(path.extname(filePath), '')}.config`)
  }

  getTemplatePath (filePath: string) {
    return this.getTargetFilePath(filePath, this.options.fileType.templ)
  }

  getStylePath (filePath: string) {
    return this.getTargetFilePath(filePath, this.options.fileType.style)
  }

  getConfigPath (filePath: string) {
    return this.getTargetFilePath(filePath, this.options.fileType.config)
  }

  getTargetFilePath (filePath: string, targetExtname: string) {
    const extname = path.extname(filePath)
    if (extname) {
      return filePath.replace(extname, targetExtname)
    }
    return filePath + targetExtname
  }

  generateDarkModeFile (compilation: any, compiler: any) {
    const { RawSource } = this.getSources(compiler)
    const themeLocationPath = path.resolve(this.options.sourceDir, this.themeLocation)
    if (fs.existsSync(themeLocationPath)) {
      const themeLocationSource = fs.readFileSync(themeLocationPath)
      compilation.assets[this.themeLocation] = new RawSource(themeLocationSource)
    }
  }

  generateTabBarFiles (compilation: any, compiler: any) {
    const { RawSource } = this.getSources(compiler)
    this.tabBarIcons.forEach(icon => {
      const iconPath = path.resolve(this.options.sourceDir, icon)
      if (fs.existsSync(iconPath)) {
        const iconSource = fs.readFileSync(iconPath)
        compilation.assets[icon] = new RawSource(iconSource)
      }
    })
  }

  injectCommonStyles ({ assets }: any, compiler: any) {
    const { newBlended } = this.options
    const { ConcatSource, RawSource } = this.getSources(compiler)
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
        independentPackageNames.every(name => !assetName.includes(name))
      ) {
        commons.add('\n')
        commons.add(`@import ${JSON.stringify(urlToRequest(assetName))};`)
        componentCommons.push(assetName)
      }
    })

    if (independentPackageNames.length) {
      const commonCssFileName = `common${styleExt}`
      independentPackageNames.forEach(rootPath => {
        const isExistCommonCss = !!assets[`${rootPath}/${commonCssFileName}`]
        if (!isExistCommonCss) { return }

        const regex = new RegExp(`.*(?<!common)\\${styleExt}$`)
        const independentPagesCssAssets = Object.keys(assets).filter(asset => asset.startsWith(`${rootPath}/`) && regex.test(asset))
        independentPagesCssAssets.forEach(assetPath => {
          const relativePath = path.posix.relative(path.dirname(assetPath), rootPath) || '.'
          const importStatement = `@import ${JSON.stringify(urlToRequest(`${relativePath}/${commonCssFileName}`))};`

          const source = new ConcatSource('')
          const originPageSource = assets[assetPath]
          source.add(importStatement)
          source.add(originPageSource)
          assets[assetPath] = source
        })
      })
    }

    const hasAppStyle = Boolean(assets[appStyle])
    let shouldProcessStyles = shouldProcessCommonStyles({
      hasCommonStyles: commons.size() > 0,
      hasAppStyle,
      isWeappSubPackageIndieEnabled: this.isWeappSubPackageIndieEnabled(),
    })
    shouldProcessStyles = this.hooks.modifyShouldProcessStyles.call(shouldProcessStyles)

    if (shouldProcessStyles) {
      const APP_STYLE_NAME = 'app-origin' + styleExt
      assets[APP_STYLE_NAME] = new ConcatSource(originSource)
      const source = new ConcatSource('')
      source.add(`@import ${JSON.stringify(urlToRequest(APP_STYLE_NAME))};`)
      if (commons.size() > 0) {
        source.add(commons)
      }
      source.add('\n')
      assets[appStyle] = source

      if (newBlended) {
        this.pages.forEach(page => {
          if (page.isNative) { return }
          const pageStyle = `${page.name}${styleExt}`
          if (this.nativeComponents.has(page.name)) {
            if (!(pageStyle in assets)) {
              assets[pageStyle] = new ConcatSource('')
            }
            const pageSource = new ConcatSource('')
            const pageOriginSource = assets[pageStyle]

            const styleImportContext = this.hooks.modifyStyleImport.call({
              importStatement: '',
              shouldSkip: false,
              isMainPackageRoot: false,
            }, page)

            if (!styleImportContext.shouldSkip) {
              if (styleImportContext.importStatement) {
                pageSource.add(styleImportContext.importStatement)
              } else {
                componentCommons.forEach(item => {
                  pageSource.add(`@import ${JSON.stringify(urlToRequest(path.posix.relative(path.dirname(pageStyle), item)))};\n`)
                })
              }
            }

            pageSource.add(pageOriginSource)
            assets[pageStyle] = pageSource
          } else {
            const styleImportContext = this.hooks.modifyStyleImport.call({
              importStatement: '',
              shouldSkip: false,
              isMainPackageRoot: false,
            }, page)

            if (styleImportContext.importStatement) {
              const pageSource = new ConcatSource('')
              if (pageStyle in assets) {
                pageSource.add(assets[pageStyle])
              }
              const importSource = new ConcatSource('')
              importSource.add(styleImportContext.importStatement)
              importSource.add(pageSource)
              assets[pageStyle] = importSource
            } else if (pageStyle in assets) {
              const pageSource = new ConcatSource('')
              const pageOriginSource = assets[pageStyle]
              pageSource.add(`@import ${JSON.stringify(urlToRequest(path.posix.relative(path.dirname(pageStyle), 'app' + styleExt)))};\n`)
              pageSource.add(pageOriginSource)
              assets[pageStyle] = pageSource
            }
          }
        })
      }
    }
  }

  addTabBarFilesToDependencies (compilation: any) {
    const { fileDependencies, missingDependencies } = compilation
    this.tabBarIcons.forEach(icon => {
      if (!fileDependencies.has(icon)) {
        fileDependencies.add(icon)
      }
      if (!missingDependencies.has(icon)) {
        missingDependencies.add(icon)
      }
    })
  }
}

export function collectBuildNativePages (plugin: BaseMiniPlugin) {
  if (isEmptyObject(plugin.appConfig)) {
    throw new Error('缺少 app 全局配置，请检查！')
  }
  const appPages = plugin.appConfig.components
  if (!appPages || !appPages.length) {
    throw new Error('全局配置缺少 components 字段，请检查！')
  }

  if (!plugin.isWatch) {
    printLog(processTypeEnum.COMPILE, '发现入口', plugin.getShowPath(plugin.appEntry))
  }

  const { frameworkExts, newBlended } = plugin.options
  plugin.prerenderPages = new Set()

  const componentPages = appPages.map<IComponent>(item => {
    const pagePath = resolveMainFilePath(path.join(plugin.options.sourceDir, item), frameworkExts)
    return {
      name: item,
      path: pagePath,
      isNative: false
    }
  })

  plugin.pages = new Set(componentPages)

  if (newBlended) {
    componentPages.forEach(component => {
      plugin.nativeComponents.set(component.name, component)
    })
  }
}

export function injectNativeComponentCommonStyles ({
  assets,
  sources,
  pages,
  commonChunks,
  styleExt
}: {
  assets: Record<string, any>
  sources: IBundlerSources
  pages: Iterable<IComponent>
  commonChunks: string[]
  styleExt: string
}) {
  const { ConcatSource } = sources
  const REG_STYLE_EXT = new RegExp(`\\.(${styleExt.replace('.', '')})(\\?.*)?$`)
  const commons: string[] = []

  Object.keys(assets).forEach(assetName => {
    const fileName = path.basename(assetName, path.extname(assetName))
    if ((REG_STYLE.test(assetName) || REG_STYLE_EXT.test(assetName)) && commonChunks.includes(fileName)) {
      commons.push(assetName)
    }
  })

  if (commons.length > 0) {
    for (const page of pages) {
      if (page.isNative) { continue }
      const pageStyle = `${page.name}${styleExt}`
      if (pageStyle in assets) {
        const source = new ConcatSource('')
        const originSource = assets[pageStyle]
        commons.forEach(item => {
          source.add(`@import ${JSON.stringify(urlToRequest(path.posix.relative(path.dirname(pageStyle), item)))};\n`)
        })
        source.add(originSource)
        assets[pageStyle] = source
      }
    }
  }
}
