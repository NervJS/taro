import * as path from 'path'
import * as fs from 'fs-extra'

import * as webpack from 'webpack'
import * as SingleEntryDependency from 'webpack/lib/dependencies/SingleEntryDependency'
import * as FunctionModulePlugin from 'webpack/lib/FunctionModulePlugin'
import * as JsonpTemplatePlugin from 'webpack/lib/web/JsonpTemplatePlugin'
import * as NodeSourcePlugin from 'webpack/lib/node/NodeSourcePlugin'
import * as LoaderTargetPlugin from 'webpack/lib/LoaderTargetPlugin'
import { AppConfig } from '@tarojs/taro'
import {
  resolveMainFilePath,
  readConfig,
  isEmptyObject,
  promoteRelativePath,
  BUILD_TYPES,
  MINI_APP_FILES,
  CONFIG_MAP,
  META_TYPE,
  NODE_MODULES_REG,
  FRAMEWORK_MAP,
  VUE_EXT,
  SCRIPT_EXT,
  printLog,
  processTypeEnum
} from '@tarojs/runner-utils'

import TaroSingleEntryDependency from '../dependencies/TaroSingleEntryDependency'
import { buildBaseTemplate, buildPageTemplate, buildXScript, buildBaseComponentTemplate } from '../template'
import TaroNormalModulesPlugin from './TaroNormalModulesPlugin'
import TaroLoadChunksPlugin from './TaroLoadChunksPlugin'
import { setAdapter } from '../template/adapters'
import { componentConfig } from '../template/component'
import { validatePrerenderPages, PrerenderConfig } from '../prerender/prerender'
import { AddPageChunks, IComponent } from '../utils/types'

const PLUGIN_NAME = 'TaroMiniPlugin'

interface ITaroMiniPluginOptions {
  buildAdapter: BUILD_TYPES
  sourceDir: string
  commonChunks: string[]
  framework: string
  baseLevel: number
  prerender?: PrerenderConfig
  addChunkPages?: AddPageChunks
}

export interface IComponentObj {
  name?: string,
  path: string | null,
  type?: string
}

export const createTarget = function createTarget (_) {
  return (compiler: webpack.compiler.Compiler) => {
    const { options } = compiler
    new JsonpTemplatePlugin().apply(compiler)
    new FunctionModulePlugin(options.output).apply(compiler)
    new NodeSourcePlugin(options.node).apply(compiler)
    new LoaderTargetPlugin('node').apply(compiler)
  }
}

export const Targets = {
  [BUILD_TYPES.WEAPP]: createTarget(BUILD_TYPES.WEAPP),
  [BUILD_TYPES.ALIPAY]: createTarget(BUILD_TYPES.ALIPAY),
  [BUILD_TYPES.SWAN]: createTarget(BUILD_TYPES.SWAN),
  [BUILD_TYPES.TT]: createTarget(BUILD_TYPES.TT),
  [BUILD_TYPES.QQ]: createTarget(BUILD_TYPES.QQ),
  [BUILD_TYPES.JD]: createTarget(BUILD_TYPES.JD),
  [BUILD_TYPES.QUICKAPP]: createTarget(BUILD_TYPES.QUICKAPP)
}

function isLoaderExist (loaders, loaderName) {
  return loaders.some(item => item.loader === loaderName)
}

export default class TaroMiniPlugin {
  options: ITaroMiniPluginOptions
  context: string
  appEntry: string
  appConfig: AppConfig
  filesConfig: object
  isWatch: boolean
  pages: Set<IComponent>
  components: Set<IComponent>
  tabBarIcons: Set<string>
  prerenderPages: Set<string>
  dependencies: Map<string, TaroSingleEntryDependency>

  constructor (options = {}) {
    this.options = Object.assign({
      buildAdapter: BUILD_TYPES.WEAPP,
      sourceDir: '',
      framework: 'nerv',
      commonChunks: ['runtime', 'vendors'],
      baseLevel: 16
    }, options)
    setAdapter(this.options.buildAdapter)
    this.isWatch = false
    this.pages = new Set()
    this.components = new Set()
    this.filesConfig = {}
    this.tabBarIcons = new Set()
    this.dependencies = new Map()
  }

  tryAsync = fn => async (arg, callback) => {
    try {
      await fn(arg)
      callback()
    } catch (err) {
      callback(err)
    }
  }

  apply (compiler) {
    this.context = compiler.context
    this.appEntry = this.getAppEntry(compiler)
    compiler.hooks.run.tapAsync(
      PLUGIN_NAME,
      this.tryAsync(async (compiler: webpack.Compiler) => {
        await this.run(compiler)
        new TaroLoadChunksPlugin({
          commonChunks: this.options.commonChunks,
          buildAdapter: this.options.buildAdapter,
          isBuildPlugin: false,
          addChunkPages: this.options.addChunkPages,
          pages: this.pages,
          framework: this.options.framework
        }).apply(compiler)
      })
    )

    compiler.hooks.watchRun.tapAsync(
      PLUGIN_NAME,
      this.tryAsync(async (compiler: webpack.Compiler) => {
        const changedFiles = this.getChangedFiles(compiler)
        if (changedFiles.length) {
          this.isWatch = true
        }
        await this.run(compiler)
        new TaroLoadChunksPlugin({
          commonChunks: this.options.commonChunks,
          buildAdapter: this.options.buildAdapter,
          isBuildPlugin: false,
          addChunkPages: this.options.addChunkPages,
          pages: this.pages,
          framework: this.options.framework
        }).apply(compiler)
      })
    )

    compiler.hooks.make.tapAsync(
      PLUGIN_NAME,
      this.tryAsync(async (compilation: webpack.compilation.Compilation) => {
        const dependencies = this.dependencies
        const promises: any[] = []
        dependencies.forEach(dep => {
          promises.push(new Promise((resolve, reject) => {
            compilation.addEntry(this.options.sourceDir, dep, dep.name, err => err ? reject(err) : resolve())
          }))
        })
        await Promise.all(promises)
      })
    )

    compiler.hooks.emit.tapAsync(
      PLUGIN_NAME,
      this.tryAsync(async compilation => {
        await this.generateMiniFiles(compilation)
      })
    )

    compiler.hooks.afterEmit.tapAsync(
      PLUGIN_NAME,
      this.tryAsync(async compilation => {
        await this.addTarBarFilesToDependencies(compilation)
      })
    )

    compiler.hooks.compilation.tap(PLUGIN_NAME, (compilation, { normalModuleFactory }) => {
      compilation.dependencyFactories.set(SingleEntryDependency, normalModuleFactory)
      compilation.dependencyFactories.set(TaroSingleEntryDependency as any, normalModuleFactory)

      compilation.hooks.normalModuleLoader.tap(PLUGIN_NAME, (loaderContext, module: any) => {
        const { framework } = this.options
        if (module.miniType === META_TYPE.ENTRY) {
          const loaderName = '@tarojs/taro-loader'
          if (!isLoaderExist(module.loaders, loaderName)) {
            module.loaders.unshift({
              loader: loaderName,
              options: {
                framework,
                prerender: this.prerenderPages.size > 0
              }
            })
          }
        } else if (module.miniType === META_TYPE.PAGE) {
          const loaderName = '@tarojs/taro-loader/lib/page'
          if (!isLoaderExist(module.loaders, loaderName)) {
            module.loaders.unshift({
              loader: loaderName,
              options: {
                framework,
                name: module.name,
                prerender: this.prerenderPages.has(module.name)
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
                name: module.name,
                prerender: this.prerenderPages.has(module.name)
              }
            })
          }
        }
      })

      compilation.hooks.afterOptimizeAssets.tap(PLUGIN_NAME, (assets) => {
        Object.keys(assets).forEach(assetPath => {
          const styleExt = MINI_APP_FILES[this.options.buildAdapter].STYLE
          if (new RegExp(`${styleExt}.js$`).test(assetPath)) {
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

    new TaroNormalModulesPlugin().apply(compiler)
  }

  getAppEntry (compiler) {
    const originalEntry = compiler.options.entry
    compiler.options.entry = {}
    return path.resolve(this.context, originalEntry.app[0])
  }

  getAppConfig () {
    const appConfigPath = this.getConfigFilePath(this.appEntry)
    const appConfig = readConfig(appConfigPath)
    const appConfigName = path.basename(appConfigPath).replace(path.extname(appConfigPath), '')
    this.filesConfig[appConfigName] = {
      content: appConfig,
      path: appConfigPath
    }
    if (isEmptyObject(appConfig)) {
      throw new Error('缺少 app 全局配置，请检查！')
    }
    return appConfig
  }

  getPagesConfig () {
    this.pages.forEach(page => {
      if (!this.isWatch) {
        printLog(processTypeEnum.COMPILE, '发现页面', this.getShowPath(page.path))
      }
      this.compileFile(page)
    })
  }

  replaceExt (file: string, ext: string) {
    return path.join(path.dirname(file), path.basename(file, path.extname(file)) + `${ext}`)
  }

  compileFile (file: IComponent) {
    const filePath = file.path
    const fileConfigPath = file.isNative ? this.replaceExt(filePath, '.json') : this.getConfigFilePath(filePath)
    const fileConfig = readConfig(fileConfigPath)
    const usingComponents = fileConfig.usingComponents
    this.filesConfig[this.getConfigFilePath(file.name)] = {
      content: fileConfig,
      path: fileConfigPath
    }
    if (usingComponents) {
      const componentNames = Object.keys(usingComponents)
      const depComponents: Array<{ name: string, path: string }> = []
      for (const compName of componentNames) {
        depComponents.push({
          name: compName,
          path: usingComponents[compName]
        })

        if (!componentConfig.thirdPartyComponents.has(compName)) {
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
            stylePath: isNative ? this.getStylePath(componentPath) : null,
            templatePath: isNative ? this.getTemplatePath(componentPath) : null
          }
          this.components.add(componentObj)
          this.compileFile(componentObj)
        }
      })
    }
  }

  getPages (compiler) {
    if (isEmptyObject(this.appConfig)) {
      throw new Error('缺少 app 全局配置，请检查！')
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
    this.getSubPackages(this.appConfig)
    this.getTabBarFiles(this.appConfig)
    this.pages = new Set([
      ...this.pages,
      ...appPages.map(item => {
        const pagePath = resolveMainFilePath(path.join(this.options.sourceDir, item), framework === FRAMEWORK_MAP.VUE ? VUE_EXT : SCRIPT_EXT)
        const pageTemplatePath = this.getTemplatePath(pagePath)
        const isNative = this.isNativePageORComponent(pageTemplatePath)
        return {
          name: item,
          path: pagePath,
          isNative,
          stylePath: isNative ? this.getStylePath(pagePath) : null,
          templatePath: isNative ? this.getTemplatePath(pagePath) : null
        }
      })
    ])
  }

  getSubPackages (appConfig) {
    const subPackages = appConfig.subPackages || appConfig.subpackages
    const { framework } = this.options
    if (subPackages && subPackages.length) {
      subPackages.forEach(item => {
        if (item.pages && item.pages.length) {
          const root = item.root
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
              const pagePath = resolveMainFilePath(path.join(this.options.sourceDir, pageItem), framework === FRAMEWORK_MAP.VUE ? VUE_EXT : SCRIPT_EXT)
              const templatePath = this.getTemplatePath(pagePath)
              const isNative = this.isNativePageORComponent(templatePath)
              this.pages.add({
                name: pageItem,
                path: pagePath,
                isNative,
                stylePath: isNative ? this.getStylePath(pagePath) : null,
                templatePath: isNative ? this.getTemplatePath(pagePath) : null
              })
            }
          })
        }
      })
    }
  }

  getConfigFiles (compiler: webpack.Compiler) {
    const filesConfig = this.filesConfig
    Object.keys(filesConfig).forEach(item => {
      if (fs.existsSync(filesConfig[item].path)) {
        this.addEntry(filesConfig[item].path, item, META_TYPE.CONFIG)
      }
    })
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

  getTabBarFiles (appConfig) {
    const tabBar = appConfig.tabBar
    const { buildAdapter, sourceDir } = this.options
    if (tabBar && typeof tabBar === 'object' && !isEmptyObject(tabBar)) {
      const {
        list: listConfig,
        iconPath: pathConfig,
        selectedIconPath: selectedPathConfig
      } = CONFIG_MAP[buildAdapter]

      const list = tabBar[listConfig] || []
      list.forEach(item => {
        item[pathConfig] && this.tabBarIcons.add(item[pathConfig])
        item[selectedPathConfig] && this.tabBarIcons.add(item[selectedPathConfig])
      })
      if (tabBar.custom) {
        const customTabBarPath = path.join(sourceDir, 'custom-tab-bar')
        const customTabBarComponentPath = resolveMainFilePath(customTabBarPath)
        if (fs.existsSync(customTabBarComponentPath)) {
          const customTabBarComponentTemplPath = this.getTemplatePath(customTabBarComponentPath)
          const isNative = this.isNativePageORComponent(customTabBarComponentTemplPath)
          if (!this.isWatch) {
            printLog(processTypeEnum.COMPILE, '自定义 tabBar', this.getShowPath(customTabBarComponentPath))
          }
          const componentObj = {
            name: 'custom-tab-bar/index',
            path: customTabBarComponentPath,
            isNative,
            stylePath: isNative ? this.getStylePath(customTabBarComponentPath) : null,
            templatePath: isNative ? this.getTemplatePath(customTabBarComponentPath) : null
          }
          this.compileFile(componentObj)
          this.components.add(componentObj)
        }
      }
    }
  }

  generateTabBarFiles (compilation) {
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

  addTarBarFilesToDependencies (compilation: webpack.compilation.Compilation) {
    const { fileDependencies } = compilation
    this.tabBarIcons.forEach(icon => {
      if (!fileDependencies.has(icon)) {
        fileDependencies.add(icon)
      }
    })
  }

  addEntry (entryPath, entryName, entryType) {
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

  addEntries () {
    this.addEntry(this.appEntry, 'app', META_TYPE.ENTRY)
    this.addEntry(path.resolve(__dirname, '..', 'template/comp'), 'comp', META_TYPE.STATIC)
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

  generateConfigFile (compilation, filePath, config) {
    const fileConfigName = this.getConfigPath(this.getComponentName(filePath))
    const fileConfigStr = JSON.stringify(config)
    compilation.assets[fileConfigName] = {
      size: () => fileConfigStr.length,
      source: () => fileConfigStr
    }
  }

  generateTemplateFile (compilation, filePath, templateFn, ...options) {
    const templStr = templateFn(...options)
    const fileTemplName = this.getTemplatePath(this.getComponentName(filePath))
    compilation.assets[fileTemplName] = {
      size: () => templStr.length,
      source: () => templStr
    }
  }

  generateXSFile (compilation: webpack.compilation.Compilation) {
    const ext = MINI_APP_FILES[this.options.buildAdapter].XS
    if (ext == null) {
      return
    }

    const xs = buildXScript()
    const filePath = this.getTargetFilePath('utils', ext)
    compilation.assets[filePath] = {
      size: () => xs.length,
      source: () => xs
    }
  }

  get supportRecursive () {
    return this.options.buildAdapter !== BUILD_TYPES.WEAPP && this.options.buildAdapter !== BUILD_TYPES.QQ
  }

  generateMiniFiles (compilation: webpack.compilation.Compilation) {
    const baseTemplateName = 'base'
    const baseCompName = 'comp'
    const { baseLevel } = this.options
    this.generateConfigFile(compilation, this.appEntry, this.appConfig)
    this.generateConfigFile(compilation, baseCompName, {
      component: true,
      usingComponents: {
        [baseCompName]: `./${baseCompName}`
      }
    })
    this.generateTemplateFile(compilation, baseTemplateName, buildBaseTemplate, baseLevel, this.supportRecursive)
    if (!this.supportRecursive) {
      this.generateTemplateFile(compilation, baseCompName, buildBaseComponentTemplate)
    }
    this.generateXSFile(compilation)
    this.components.forEach(component => {
      const importBaseTemplatePath = promoteRelativePath(path.relative(component.path, path.join(this.options.sourceDir, this.getTemplatePath(baseTemplateName))))
      const config = this.filesConfig[this.getConfigFilePath(component.name)]
      if (config) {
        this.generateConfigFile(compilation, component.path, config.content)
      }
      if (!component.isNative) {
        this.generateTemplateFile(compilation, component.path, buildPageTemplate, importBaseTemplatePath)
      }
    })
    this.pages.forEach(page => {
      const importBaseTemplatePath = promoteRelativePath(path.relative(page.path, path.join(this.options.sourceDir, this.getTemplatePath(baseTemplateName))))
      const config = this.filesConfig[this.getConfigFilePath(page.name)]
      if (config) {
        if (!this.supportRecursive) {
          const importBaseCompPath = promoteRelativePath(path.relative(page.path, path.join(this.options.sourceDir, this.getTargetFilePath(baseCompName, ''))))
          config.content.usingComponents = {
            [baseCompName]: importBaseCompPath,
            ...config.content.usingComponents
          }
        }
        this.generateConfigFile(compilation, page.path, config.content)
      }
      if (!page.isNative) {
        this.generateTemplateFile(compilation, page.path, buildPageTemplate, importBaseTemplatePath)
      }
    })
    this.generateTabBarFiles(compilation)
  }

  run (compiler) {
    this.appConfig = this.getAppConfig()
    this.getPages(compiler)
    this.getPagesConfig()
    this.getConfigFiles(compiler)
    this.addEntries()
  }

  getComponentName (componentPath) {
    let componentName
    if (NODE_MODULES_REG.test(componentPath)) {
      componentName = componentPath.replace(this.context, '').replace(/\\/g, '/').replace(path.extname(componentPath), '')
      componentName = componentName.replace(/node_modules/gi, 'npm')
    } else {
      componentName = componentPath.replace(this.options.sourceDir, '').replace(/\\/g, '/').replace(path.extname(componentPath), '')
    }

    return componentName.replace(/^(\/|\\)/, '')
  }

  getChangedFiles (compiler) {
    const { watchFileSystem } = compiler
    const watcher = watchFileSystem.watcher || watchFileSystem.wfs.watcher

    return Object.keys(watcher.mtimes)
  }

  isNativePageORComponent (templatePath) {
    return fs.existsSync(templatePath)
  }

  getShowPath (filePath) {
    return filePath.replace(this.context, '').replace(/\\/g, '/').replace(/^\//, '')
  }

  getConfigFilePath (filePath) {
    return resolveMainFilePath(`${filePath.replace(path.extname(filePath), '')}.config`)
  }

  getTemplatePath (filePath) {
    return this.getTargetFilePath(filePath, MINI_APP_FILES[this.options.buildAdapter].TEMPL)
  }

  getStylePath (filePath) {
    return this.getTargetFilePath(filePath, MINI_APP_FILES[this.options.buildAdapter].STYLE)
  }

  getConfigPath (filePath) {
    return this.getTargetFilePath(filePath, MINI_APP_FILES[this.options.buildAdapter].CONFIG)
  }

  getTargetFilePath (filePath, targetExtname) {
    const extname = path.extname(filePath)
    if (extname) {
      return filePath.replace(extname, targetExtname)
    }
    return filePath + targetExtname
  }
}
