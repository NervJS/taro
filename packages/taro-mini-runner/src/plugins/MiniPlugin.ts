import * as path from 'path'
import * as fs from 'fs-extra'

import * as webpack from 'webpack'
import * as SingleEntryDependency from 'webpack/lib/dependencies/SingleEntryDependency'
import * as FunctionModulePlugin from 'webpack/lib/FunctionModulePlugin'
import * as JsonpTemplatePlugin from 'webpack/lib/web/JsonpTemplatePlugin'
import * as NodeSourcePlugin from 'webpack/lib/node/NodeSourcePlugin'
import * as LoaderTargetPlugin from 'webpack/lib/LoaderTargetPlugin'
import * as NaturalChunkOrderPlugin from 'webpack/lib/optimize/NaturalChunkOrderPlugin'
import * as SplitChunksPlugin from 'webpack/lib/optimize/SplitChunksPlugin'
import * as RuntimeChunkPlugin from 'webpack/lib/optimize/RuntimeChunkPlugin'
import * as MiniCssExtractPlugin from 'mini-css-extract-plugin'
import { ConcatSource } from 'webpack-sources'
import { urlToRequest } from 'loader-utils'
import { minify } from 'html-minifier'
import { AppConfig, Config } from '@tarojs/taro'
import { RecursiveTemplate, UnRecursiveTemplate } from '@tarojs/shared/dist/template'
import {
  resolveMainFilePath,
  readConfig,
  isEmptyObject,
  promoteRelativePath,
  META_TYPE,
  REG_STYLE,
  NODE_MODULES_REG,
  FRAMEWORK_EXT_MAP,
  printLog,
  processTypeEnum,
  FRAMEWORK_MAP,
  isAliasPath,
  replaceAliasPath,
  SCRIPT_EXT
} from '@tarojs/helper'

import TaroSingleEntryPlugin from './TaroSingleEntryPlugin'
import TaroSingleEntryDependency from '../dependencies/TaroSingleEntryDependency'
import TaroNormalModulesPlugin from './TaroNormalModulesPlugin'
import TaroLoadChunksPlugin from './TaroLoadChunksPlugin'
import { componentConfig } from '../template/component'
import { validatePrerenderPages, PrerenderConfig } from '../prerender/prerender'
import { AddPageChunks, IComponent, IFileType, Func } from '../utils/types'

const PLUGIN_NAME = 'TaroMiniPlugin'

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
  baseLevel: number
  prerender?: PrerenderConfig
  addChunkPages?: AddPageChunks
  isBuildQuickapp: boolean
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
  deviceRatio: any
  designWidth: number
  loaderMeta?: Record<string, string>
  hot: boolean
}

export interface IComponentObj {
  name?: string,
  path: string | null,
  type?: string
}

interface FilesConfig {
  [configName: string]: {
    content: Config
    path: string
  }
}

export const createTarget = function createTarget ({ framework }) {
  return (compiler: webpack.compiler.Compiler) => {
    const { options } = compiler
    new JsonpTemplatePlugin().apply(compiler)
    new FunctionModulePlugin(options.output).apply(compiler)
    new NodeSourcePlugin(options.node).apply(compiler)
    if (process.env.NODE_ENV !== 'jest') {
      // 暂时性修复 vue3 兼容问题，后续再改进写法
      if (framework === FRAMEWORK_MAP.VUE3) {
        new LoaderTargetPlugin('web').apply(compiler)
      } else {
        new LoaderTargetPlugin('node').apply(compiler)
      }
    }
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
      isBuildQuickapp: false,
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
  tryAsync = fn => async (arg, callback) => {
    try {
      await fn(arg)
      callback()
    } catch (err) {
      callback(err)
    }
  }

  /**
   * 插件入口
   */
  apply (compiler: webpack.Compiler) {
    this.context = compiler.context
    this.appEntry = this.getAppEntry(compiler)
    const {
      commonChunks,
      addChunkPages,
      framework,
      isBuildQuickapp,
      isBuildPlugin,
      fileType
    } = this.options
    /** build mode */
    compiler.hooks.run.tapAsync(
      PLUGIN_NAME,
      this.tryAsync(async (compiler: webpack.Compiler) => {
        await this.run(compiler)
        new TaroLoadChunksPlugin({
          commonChunks: commonChunks,
          isBuildPlugin,
          addChunkPages: addChunkPages,
          pages: this.pages,
          framework: framework,
          isBuildQuickapp
        }).apply(compiler)
      })
    )

    /** watch mode */
    compiler.hooks.watchRun.tapAsync(
      PLUGIN_NAME,
      this.tryAsync(async (compiler: webpack.Compiler) => {
        const changedFiles = this.getChangedFiles(compiler)
        if (changedFiles.length) {
          this.isWatch = true
        }
        await this.run(compiler)
        if (!this.loadChunksPlugin) {
          this.loadChunksPlugin = new TaroLoadChunksPlugin({
            commonChunks: commonChunks,
            isBuildPlugin,
            addChunkPages: addChunkPages,
            pages: this.pages,
            framework: framework,
            isBuildQuickapp
          })
          this.loadChunksPlugin.apply(compiler)
        }
      })
    )

    /** compilation.addEntry */
    compiler.hooks.make.tapAsync(
      PLUGIN_NAME,
      this.tryAsync(async (compilation: webpack.compilation.Compilation) => {
        const dependencies = this.dependencies
        const promises: Promise<null>[] = []
        this.compileIndependentPages(compiler, compilation, dependencies, promises)
        dependencies.forEach(dep => {
          promises.push(new Promise<null>((resolve, reject) => {
            compilation.addEntry(this.options.sourceDir, dep, dep.name, err => err ? reject(err) : resolve(null))
          }))
        })
        await Promise.all(promises)
        await this.options.onCompilerMake?.(compilation)
      })
    )

    compiler.hooks.compilation.tap(PLUGIN_NAME, (compilation, { normalModuleFactory }) => {
      /** For Webpack compilation get factory from compilation.dependencyFactories by denpendence's constructor */
      compilation.dependencyFactories.set(SingleEntryDependency, normalModuleFactory)
      compilation.dependencyFactories.set(TaroSingleEntryDependency as any, normalModuleFactory)

      /**
       * webpack NormalModule 在 runLoaders 真正解析资源的前一刻，
       * 往 NormalModule.loaders 中插入对应的 Taro Loader
       */
      compilation.hooks.normalModuleLoader.tap(PLUGIN_NAME, (_loaderContext, module:/** TaroNormalModule */ any) => {
        const { framework, loaderMeta, designWidth, deviceRatio } = this.options
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
                pxTransformConfig: {
                  designWidth: designWidth || 750,
                  deviceRatio: deviceRatio || {
                    750: 1
                  }
                }
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
          const loaderName = isBuildPlugin ? '@tarojs/taro-loader/lib/native-component' : (isIndependent ? '@tarojs/taro-loader/lib/independentPage' : this.pageLoaderName)
          if (!isLoaderExist(module.loaders, loaderName)) {
            module.loaders.unshift({
              loader: loaderName,
              options: {
                framework,
                loaderMeta,
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

      /**
       * 与原生小程序混写时解析模板与样式
       */
      compilation.hooks.afterOptimizeAssets.tap(PLUGIN_NAME, assets => {
        Object.keys(assets).forEach(assetPath => {
          const styleExt = fileType.style
          const templExt = fileType.templ
          if (new RegExp(`(\\${styleExt}|\\${templExt})\\.js(\\.map){0,1}$`).test(assetPath)) {
            delete assets[assetPath]
          } else if (new RegExp(`${styleExt}${styleExt}$`).test(assetPath)) {
            const assetObj = assets[assetPath]
            const newAssetPath = assetPath.replace(styleExt, '')
            assets[newAssetPath] = assetObj
            delete assets[assetPath]
          }
        })
      })
    })

    compiler.hooks.emit.tapAsync(
      PLUGIN_NAME,
      this.tryAsync(async (compilation: webpack.compilation.Compilation) => {
        await this.generateMiniFiles(compilation)
      })
    )

    compiler.hooks.afterEmit.tapAsync(
      PLUGIN_NAME,
      this.tryAsync(async (compilation: webpack.compilation.Compilation) => {
        await this.addTarBarFilesToDependencies(compilation)
      })
    )

    new TaroNormalModulesPlugin(this.options.onParseCreateElement).apply(compiler)
  }

  /**
   * 根据 webpack entry 配置获取入口文件路径
   * @returns app 入口文件路径
   */
  getAppEntry (compiler: webpack.Compiler) {
    // const originalEntry = compiler.options.entry as webpack.Entry
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
      }
      return app
    }
    const appEntryPath = getEntryPath(entry)
    compiler.options.entry = {}
    return appEntryPath
  }

  getChangedFiles (compiler) {
    const { watchFileSystem } = compiler
    const watcher = watchFileSystem.watcher || watchFileSystem.wfs.watcher

    return Object.keys(watcher.mtimes)
  }

  /**
   * 分析 app 入口文件，搜集页面、组件信息，
   * 往 this.dependencies 中添加资源模块
   */
  run (compiler: webpack.Compiler) {
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
      const filePath = this.appEntry[key][0]
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
      this.addEntry(item.path, item.name, META_TYPE.NORMAL)
    })
    this.pages.forEach(item => {
      if (!this.isWatch) {
        printLog(processTypeEnum.COMPILE, '发现页面', this.getShowPath(item.path))
      }
      this.compileFile(item)
      if (item.isNative) {
        this.addEntry(item.path, item.name, META_TYPE.NORMAL)
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
        this.addEntry(item.path, item.name, META_TYPE.NORMAL)
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
    if (main) {
      pluginJSON.main = this.getTargetFilePath(main, '.js')
    }
    if (publicComponents) {
      pluginJSON.publicComponents = Object.assign({}, publicComponents, {
        'custom-wrapper': 'custom-wrapper'
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
    if (isEmptyObject(this.appConfig)) {
      throw new Error('缺少 app 全局配置文件，请检查！')
    }
    const appPages = this.appConfig.pages
    if (!appPages || !appPages.length) {
      throw new Error('全局配置缺少 pages 字段，请检查！')
    }

    if (!this.isWatch) {
      printLog(processTypeEnum.COMPILE, '发现入口', this.getShowPath(this.appEntry))
    }
    const { framework, prerender } = this.options
    this.prerenderPages = new Set(validatePrerenderPages(appPages, prerender).map(p => p.path))
    this.getTabBarFiles(this.appConfig)
    this.pages = new Set([
      ...appPages.map<IComponent>(item => {
        const pagePath = resolveMainFilePath(path.join(this.options.sourceDir, item), FRAMEWORK_EXT_MAP[framework])
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
   * 读取页面及其依赖的组件的配置
   */
  getPagesConfig () {
    this.pages.forEach(page => {
      if (!this.isWatch) {
        printLog(processTypeEnum.COMPILE, '发现页面', this.getShowPath(page.path))
      }
      this.compileFile(page)
    })
  }

  /**
   * 往 this.dependencies 中新增或修改所有 config 配置模块
   */
  getConfigFiles (compiler: webpack.Compiler) {
    const filesConfig = this.filesConfig
    Object.keys(filesConfig).forEach(item => {
      if (fs.existsSync(filesConfig[item].path)) {
        this.addEntry(filesConfig[item].path, item, META_TYPE.CONFIG)
      }
    })

    // webpack createChunkAssets 前一刻，去除所有 config chunks
    compiler.hooks.compilation.tap(PLUGIN_NAME, compilation => {
      compilation.hooks.beforeChunkAssets.tap(PLUGIN_NAME, () => {
        Object.keys(filesConfig).forEach(item => {
          const assetsChunkIndex = compilation.chunks.findIndex(({ name }) => name === item)
          if (assetsChunkIndex > -1) {
            compilation.chunks.splice(assetsChunkIndex, 1)
          }
        })
      })
    })
  }

  /**
   * 在 this.dependencies 中新增或修改模块
   */
  addEntry (entryPath: string, entryName: string, entryType: META_TYPE) {
    let dep
    if (this.dependencies.has(entryPath)) {
      dep = this.dependencies.get(entryPath)
      dep.name = entryName
      dep.loc = { name: entryName }
      dep.entryPath = entryPath
      dep.entryType = entryType
    } else {
      dep = new TaroSingleEntryDependency(entryPath, entryName, { name: entryName }, entryType)
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
        this.addEntry(item.path, item.name, META_TYPE.NORMAL)
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
        this.addEntry(item.path, item.name, META_TYPE.NORMAL)
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
    const usingComponents = fileConfig.usingComponents

    // 递归收集依赖的第三方组件
    if (usingComponents) {
      const componentNames = Object.keys(usingComponents)
      const depComponents: Array<{ name: string, path: string }> = []
      const alias = this.options.alias
      for (const compName of componentNames) {
        let compPath = usingComponents[compName]

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
    const { framework } = this.options
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
              const pagePath = resolveMainFilePath(path.join(this.options.sourceDir, pageItem), FRAMEWORK_EXT_MAP[framework])
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
      independentPackages.forEach((pages, name) => {
        const childCompiler = compilation.createChildCompiler(PLUGIN_NAME, {
          path: `${compiler.options.output}/${name}`
        })
        const compPath = path.resolve(__dirname, '..', 'template/comp')
        childCompiler.inputFileSystem = compiler.inputFileSystem
        childCompiler.outputFileSystem = compiler.outputFileSystem
        childCompiler.context = compiler.context
        new JsonpTemplatePlugin().apply(childCompiler)
        new NaturalChunkOrderPlugin().apply(childCompiler)
        new MiniCssExtractPlugin({
          filename: `[name]${this.options.fileType.style}`,
          chunkFilename: `[name]${this.options.fileType.style}`
        }).apply(childCompiler)
        new webpack.DefinePlugin(this.options.constantsReplaceList).apply(childCompiler)
        if (compiler.options.optimization) {
          new SplitChunksPlugin({
            chunks: 'all',
            maxInitialRequests: Infinity,
            minSize: 0,
            cacheGroups: {
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
            new TaroSingleEntryPlugin(compiler.context, dep?.request, dep?.name, dep?.miniType).apply(childCompiler)
          }
          this.pages.forEach(item => {
            if (item.path === pagePath) {
              childPages.add(item)
            }
          })
          dependencies.delete(pagePath)
        })
        new TaroLoadChunksPlugin({
          commonChunks: [`${name}/runtime`, `${name}/vendors`],
          isBuildPlugin: false,
          addChunkPages: this.options.addChunkPages,
          pages: childPages,
          framework: this.options.framework,
          isBuildQuickapp: true,
          needAddCommon: [`${name}/comp`]
        }).apply(childCompiler)
        // 添加 comp 和 custom-wrapper 组件
        new TaroSingleEntryPlugin(compiler.context, path.resolve(__dirname, '..', 'template/comp'), `${name}/comp`, META_TYPE.STATIC).apply(childCompiler)
        new TaroSingleEntryPlugin(compiler.context, path.resolve(__dirname, '..', 'template/custom-wrapper'), `${name}/custom-wrapper`, META_TYPE.STATIC).apply(childCompiler)
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
    const { sourceDir, framework } = this.options
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
        const customTabBarPath = path.join(sourceDir, 'custom-tab-bar')
        const customTabBarComponentPath = resolveMainFilePath(customTabBarPath, [...FRAMEWORK_EXT_MAP[framework], ...SCRIPT_EXT])
        if (fs.existsSync(customTabBarComponentPath)) {
          const customTabBarComponentTemplPath = this.getTemplatePath(customTabBarComponentPath)
          const isNative = this.isNativePageORComponent(customTabBarComponentTemplPath)
          if (!this.isWatch) {
            printLog(processTypeEnum.COMPILE, '自定义 tabBar', this.getShowPath(customTabBarComponentPath))
          }
          const componentObj: IComponent = {
            name: 'custom-tab-bar/index',
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

  /** 生成小程序相关文件 */
  async generateMiniFiles (compilation: webpack.compilation.Compilation) {
    const { template, modifyBuildAssets, modifyMiniConfigs, isBuildPlugin, sourceDir } = this.options
    const baseTemplateName = this.getIsBuildPluginPath('base', isBuildPlugin)
    const baseCompName = 'comp'
    const customWrapperName = 'custom-wrapper'
    if (typeof modifyMiniConfigs === 'function') {
      await modifyMiniConfigs(this.filesConfig)
    }
    if (!this.options.blended && !isBuildPlugin) {
      const appConfigPath = this.getConfigFilePath(this.appEntry)
      const appConfigName = path.basename(appConfigPath).replace(path.extname(appConfigPath), '')
      this.generateConfigFile(compilation, this.appEntry, this.filesConfig[appConfigName].content)
    }
    if (!template.isSupportRecursive) {
      // 如微信、QQ 不支持递归模版的小程序，需要使用自定义组件协助递归
      this.generateTemplateFile(compilation, this.getIsBuildPluginPath(baseCompName, isBuildPlugin), template.buildBaseComponentTemplate, this.options.fileType.templ)
      this.generateConfigFile(compilation, this.getIsBuildPluginPath(baseCompName, isBuildPlugin), {
        component: true,
        usingComponents: {
          [baseCompName]: `./${baseCompName}`,
          [customWrapperName]: `./${customWrapperName}`
        }
      })
      this.generateConfigFile(compilation, this.getIsBuildPluginPath(customWrapperName, isBuildPlugin), {
        component: true,
        usingComponents: {
          [baseCompName]: `./${baseCompName}`,
          [customWrapperName]: `./${customWrapperName}`
        }
      })
    } else {
      this.generateConfigFile(compilation, this.getIsBuildPluginPath(customWrapperName, isBuildPlugin), {
        component: true,
        usingComponents: {
          [customWrapperName]: `./${customWrapperName}`
        }
      })
    }
    this.generateTemplateFile(compilation, baseTemplateName, template.buildTemplate, componentConfig)
    this.generateTemplateFile(compilation, this.getIsBuildPluginPath(customWrapperName, isBuildPlugin), template.buildCustomComponentTemplate, this.options.fileType.templ)
    this.generateXSFile(compilation, 'utils', isBuildPlugin)
    // 为独立分包生成 base/comp/custom-wrapper
    this.independentPackages.forEach((_pages, name) => {
      this.generateTemplateFile(compilation, `${name}/${baseTemplateName}`, template.buildTemplate, componentConfig)
      if (!template.isSupportRecursive) {
        // 如微信、QQ 不支持递归模版的小程序，需要使用自定义组件协助递归
        this.generateConfigFile(compilation, `${name}/${baseCompName}`, {
          component: true,
          usingComponents: {
            [baseCompName]: `./${baseCompName}`,
            [customWrapperName]: `./${customWrapperName}`
          }
        })
        this.generateConfigFile(compilation, `${name}/${customWrapperName}`, {
          component: true,
          usingComponents: {
            [baseCompName]: `./${baseCompName}`,
            [customWrapperName]: `./${customWrapperName}`
          }
        })
        this.generateTemplateFile(compilation, `${name}/${baseCompName}`, template.buildBaseComponentTemplate, this.options.fileType.templ)
      }
      this.generateTemplateFile(compilation, `${name}/${customWrapperName}`, template.buildCustomComponentTemplate, this.options.fileType.templ)
      this.generateXSFile(compilation, `${name}/utils`, isBuildPlugin)
    })
    this.components.forEach(component => {
      const importBaseTemplatePath = promoteRelativePath(path.relative(component.path, path.join(sourceDir, this.getTemplatePath(baseTemplateName))))
      const config = this.filesConfig[this.getConfigFilePath(component.name)]
      if (config) {
        this.generateConfigFile(compilation, component.path, config.content)
      }
      if (!component.isNative) {
        this.generateTemplateFile(compilation, component.path, template.buildPageTemplate, importBaseTemplatePath)
      }
    })
    this.pages.forEach(page => {
      const importBaseTemplatePath = promoteRelativePath(path.relative(page.path, path.join(sourceDir, this.getTemplatePath(baseTemplateName))))
      const config = this.filesConfig[this.getConfigFilePath(page.name)]
      let isIndependent = false
      let independentName = ''
      this.independentPackages.forEach((pages, name) => {
        if (pages.includes(page.path)) {
          isIndependent = true
          independentName = name
        }
      })
      if (config) {
        let importBaseCompPath = promoteRelativePath(path.relative(page.path, path.join(sourceDir, this.getTargetFilePath(this.getIsBuildPluginPath(baseCompName, isBuildPlugin), ''))))
        let importCustomWrapperPath = promoteRelativePath(path.relative(page.path, path.join(sourceDir, this.getTargetFilePath(this.getIsBuildPluginPath(customWrapperName, isBuildPlugin), ''))))
        if (isIndependent) {
          importBaseCompPath = promoteRelativePath(path.relative(page.path, path.join(sourceDir, independentName, this.getTargetFilePath(this.getIsBuildPluginPath(baseCompName, isBuildPlugin), ''))))
          importCustomWrapperPath = promoteRelativePath(path.relative(page.path, path.join(sourceDir, independentName, this.getTargetFilePath(this.getIsBuildPluginPath(customWrapperName, isBuildPlugin), ''))))
        }
        config.content.usingComponents = {
          [customWrapperName]: importCustomWrapperPath,
          ...config.content.usingComponents
        }
        if (!template.isSupportRecursive && !page.isNative) {
          config.content.usingComponents[baseCompName] = importBaseCompPath
        }
        this.generateConfigFile(compilation, page.path, config.content)
      }
      if (!page.isNative) {
        this.generateTemplateFile(compilation, page.path, template.buildPageTemplate, importBaseTemplatePath)
      }
    })
    this.generateTabBarFiles(compilation)
    this.injectCommonStyles(compilation)
    if (this.themeLocation) {
      this.generateDarkModeFile(compilation)
    }
    if (isBuildPlugin) {
      const pluginJSONPath = path.join(sourceDir, 'plugin', 'plugin.json')
      if (fs.existsSync(pluginJSONPath)) {
        const pluginJSON = fs.readJSONSync(pluginJSONPath)
        this.modifyPluginJSON(pluginJSON)
        const relativePath = pluginJSONPath.replace(sourceDir, '').replace(/\\/g, '/')
        compilation.assets[relativePath] = {
          size: () => JSON.stringify(pluginJSON).length,
          source: () => JSON.stringify(pluginJSON, null, 2)
        }
      }
    }
    if (typeof modifyBuildAssets === 'function') {
      await modifyBuildAssets(compilation.assets, this)
    }
  }

  generateConfigFile (compilation: webpack.compilation.Compilation, filePath: string, config: Config & { component?: boolean }) {
    const fileConfigName = this.getConfigPath(this.getComponentName(filePath))
    const unOfficalConfigs = ['enableShareAppMessage', 'enableShareTimeline', 'components']
    unOfficalConfigs.forEach(item => {
      delete config[item]
    })
    const fileConfigStr = JSON.stringify(config)
    compilation.assets[fileConfigName] = {
      size: () => fileConfigStr.length,
      source: () => fileConfigStr
    }
  }

  generateTemplateFile (compilation: webpack.compilation.Compilation, filePath: string, templateFn: (...args) => string, ...options) {
    let templStr = templateFn(...options)
    const fileTemplName = this.getTemplatePath(this.getComponentName(filePath))

    if (this.options.minifyXML?.collapseWhitespace) {
      templStr = minify(templStr, {
        collapseWhitespace: true,
        keepClosingSlash: true
      })
    }

    compilation.assets[fileTemplName] = {
      size: () => templStr.length,
      source: () => templStr
    }
  }

  generateXSFile (compilation: webpack.compilation.Compilation, xsPath, isBuildPlugin: boolean) {
    const ext = this.options.fileType.xs
    if (ext == null) {
      return
    }

    const xs = this.options.template.buildXScript()
    const fileXsName = this.getTargetFilePath(xsPath, ext)
    const filePath = this.getIsBuildPluginPath(fileXsName, isBuildPlugin)
    compilation.assets[filePath] = {
      size: () => xs.length,
      source: () => xs
    }
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
  generateDarkModeFile (compilation: webpack.compilation.Compilation) {
    const themeLocationPath = path.resolve(this.options.sourceDir, this.themeLocation)
    if (fs.existsSync(themeLocationPath)) {
      const themeLocationStat = fs.statSync(themeLocationPath)
      const themeLocationSource = fs.readFileSync(themeLocationPath)
      compilation.assets[this.themeLocation] = {
        size: () => themeLocationStat.size,
        source: () => themeLocationSource
      }
    }
  }

  /**
   * 输出 tabbar icons 文件
   */
  generateTabBarFiles (compilation: webpack.compilation.Compilation) {
    this.tabBarIcons.forEach(icon => {
      const iconPath = path.resolve(this.options.sourceDir, icon)
      if (fs.existsSync(iconPath)) {
        const iconStat = fs.statSync(iconPath)
        const iconSource = fs.readFileSync(iconPath)
        compilation.assets[icon] = {
          size: () => iconStat.size,
          source: () => iconSource
        }
      }
    })
  }

  /**
   * 小程序全局样式文件中引入 common chunks 中的公共样式文件
   */
  injectCommonStyles ({ assets }: webpack.compilation.Compilation) {
    const styleExt = this.options.fileType.style
    const appStyle = `app${styleExt}`
    const REG_STYLE_EXT = new RegExp(`\\.(${styleExt.replace('.', '')})(\\?.*)?$`)

    if (!assets[appStyle]) return

    const originSource: string = assets[appStyle].source()
    const source = new ConcatSource()
    source.add(originSource)

    // 组件公共样式需要放在 app 全局样式之后：https://github.com/NervJS/taro/pull/6125
    Object.keys(assets).forEach(assetName => {
      const fileName = path.basename(assetName, path.extname(assetName))
      if ((REG_STYLE.test(assetName) || REG_STYLE_EXT.test(assetName)) && this.options.commonChunks.includes(fileName)) {
        source.add('\n')
        source.add(`@import ${JSON.stringify(urlToRequest(assetName))};`)
        assets[appStyle] = {
          size: () => source.source().length,
          source: () => source.source()
        }
      }
    })
  }

  addTarBarFilesToDependencies (compilation: webpack.compilation.Compilation) {
    const { fileDependencies } = compilation
    this.tabBarIcons.forEach(icon => {
      if (!fileDependencies.has(icon)) {
        fileDependencies.add(icon)
      }
    })
  }
}
