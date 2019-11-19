import * as path from 'path'
import * as fs from 'fs-extra'

import * as webpack from 'webpack'
import * as SingleEntryDependency from 'webpack/lib/dependencies/SingleEntryDependency'
import * as FunctionModulePlugin from 'webpack/lib/FunctionModulePlugin'
import * as JsonpTemplatePlugin from 'webpack/lib/web/JsonpTemplatePlugin'
import * as NodeSourcePlugin from 'webpack/lib/node/NodeSourcePlugin'
import * as LoaderTargetPlugin from 'webpack/lib/LoaderTargetPlugin'
import { AppConfig } from '@tarojs/taro'

import { BUILD_TYPES, MINI_APP_FILES, CONFIG_MAP, META_TYPE, NODE_MODULES_REG, FRAMEWORK_MAP, VUE_EXT, SCRIPT_EXT } from '../utils/constants'
import { resolveMainFilePath, readConfig, isEmptyObject, promoteRelativePath } from '../utils'
import TaroSingleEntryDependency from '../dependencies/TaroSingleEntryDependency'
import { buildBaseTemplate, buildPageTemplate, buildXScript } from '../template'
import TaroNormalModulesPlugin from './TaroNormalModulesPlugin'
import TaroLoadChunksPlugin from './TaroLoadChunksPlugin'
import { setAdapter } from '../template/adapters'

const PLUGIN_NAME = 'TaroMiniPlugin'

interface IComponent {
  name: string,
  path: string,
  isNative: boolean
}

interface ITaroMiniPluginOptions {
  buildAdapter: BUILD_TYPES
  sourceDir: string
  commonChunks: string[]
  framework: string
  baseLevel: number
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

export default class TaroMiniPlugin {
  options: ITaroMiniPluginOptions
  context: string
  appEntry: string
  appConfig: AppConfig
  filesConfig: object
  pages: Set<IComponent>
  components: Set<IComponent>

  constructor (options = {}) {
    this.options = Object.assign({
      buildAdapter: BUILD_TYPES.WEAPP,
      sourceDir: '',
      framework: 'nerv',
      commonChunks: ['runtime', 'vendors'],
      baseLevel: 10
    }, options)
    setAdapter(this.options.buildAdapter)
    this.pages = new Set()
    this.components = new Set()
    this.filesConfig = {}
  }

  tryAsync = fn => async (arg, callback) => {
    try {
      await fn(arg)
      callback()
    } catch (err) {
      callback(err)
    }
  }

  apply (compiler: webpack.Compiler) {
    this.context = compiler.context
    this.appConfig = this.getAppConfig(compiler)
    compiler.hooks.run.tapAsync(
      PLUGIN_NAME,
      this.tryAsync(async (compiler: webpack.Compiler) => {
        await this.run(compiler)
      })
    )

    compiler.hooks.watchRun.tapAsync(
      PLUGIN_NAME,
      this.tryAsync(async (compiler: webpack.Compiler) => {
        await this.run(compiler)
      })
    )

    compiler.hooks.emit.tapAsync(
      PLUGIN_NAME,
      this.tryAsync(async compilation => {
        await this.generateMiniFiles(compilation)
      })
    )

    compiler.hooks.compilation.tap(PLUGIN_NAME, (compilation, { normalModuleFactory }) => {
      compilation.dependencyFactories.set(SingleEntryDependency, normalModuleFactory)
      compilation.dependencyFactories.set(TaroSingleEntryDependency as any, normalModuleFactory)

      compilation.hooks.normalModuleLoader.tap(PLUGIN_NAME, (loaderContext, module: any) => {
        const { framework } = this.options

        if (module.miniType === META_TYPE.ENTRY) {
          module.loaders.unshift({
            loader: '@tarojs/taro-loader',
            options: {
              framework
            }
          })
        } else if (module.miniType === META_TYPE.PAGE) {
          module.loaders.unshift({
            loader: '@tarojs/taro-loader/lib/page',
            options: {
              framework
            }
          })
        }
      })
    })

    new TaroNormalModulesPlugin().apply(compiler)

    new TaroLoadChunksPlugin({
      commonChunks: this.options.commonChunks,
      buildAdapter: this.options.buildAdapter,
      framework: this.options.framework,
      isBuildPlugin: false
    }).apply(compiler)
  }

  getAppConfig (compiler) {
    const originalEntry = compiler.options.entry
    const originalEntryPath = path.resolve(this.context, originalEntry.app[0])
    const appConfigPath = this.getConfigFilePath(originalEntryPath)
    const appConfig = readConfig(appConfigPath)
    this.appEntry = originalEntryPath
    compiler.options.entry = {}
    if (isEmptyObject(appConfig)) {
      throw new Error('缺少 app 全局配置，请检查！')
    }
    return appConfig
  }

  getPagesConfig () {
    this.pages.forEach(page => {
      this.compileFile(page)
    })
  }

  compileFile (file: IComponent) {
    const filePath = file.path
    const fileConfigPath = this.getConfigFilePath(filePath)
    const fileConfig = readConfig(fileConfigPath)
    const usingComponents = fileConfig.usingComponents
    this.filesConfig[file.name] = fileConfig
    if (usingComponents) {
      const depComponents = usingComponents ? Object.keys(usingComponents).map(item => ({
        name: item,
        path: usingComponents[item]
      })) : []
      depComponents.forEach(item => {
        const componentPath = resolveMainFilePath(path.resolve(path.dirname(file.path), item.path))
        if (fs.existsSync(componentPath) && !Array.from(this.components).some(item => item.path === componentPath)) {
          const componentName = this.getComponentName(componentPath)
          const componentTempPath = this.getTemplatePath(componentPath)
          const isNative = this.isNativePageORComponent(componentTempPath)
          const componentObj = { name: componentName, path: componentPath, isNative }
          this.components.add(componentObj)
          this.compileFile(componentObj)
        }
      })
    }
  }

  getPages () {
    if (isEmptyObject(this.appConfig)) {
      throw new Error('缺少 app 全局配置，请检查！')
    }
    const appPages = this.appConfig.pages
    if (!appPages || !appPages.length) {
      throw new Error('全局配置缺少 pages 字段，请检查！')
    }
    const { framework } = this.options
    this.pages = new Set([
      ...appPages.map(item => {
        const pagePath = resolveMainFilePath(path.join(this.options.sourceDir, item), framework === FRAMEWORK_MAP.VUE ? VUE_EXT : SCRIPT_EXT)
        const pageTemplatePath = this.getTemplatePath(pagePath)
        const isNative = this.isNativePageORComponent(pageTemplatePath)
        return { name: item, path: pagePath, isNative }
      })
    ])
    this.getSubPackages(this.appConfig)
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
                isNative
              })
            }
          })
        }
      })
    }
  }

  generateTabBarFiles (compiler, appConfig) {
    const tabBar = appConfig.tabBar
    const { buildAdapter: adapter, sourceDir } = this.options
    if (tabBar && typeof tabBar === 'object' && !isEmptyObject(tabBar)) {
      const {
        list: listConfig,
        iconPath: pathConfig,
        selectedIconPath: selectedPathConfig
      } = CONFIG_MAP[adapter]

      const list = tabBar[listConfig] || []
      const tabBarIcons: string[] = []
      list.forEach(item => {
        item[pathConfig] && tabBarIcons.push(item[pathConfig])
        item[selectedPathConfig] && tabBarIcons.push(item[selectedPathConfig])
      })
      tabBarIcons.map(item => {
        const itemPath = path.resolve(sourceDir, item)
        this.addEntry(compiler, itemPath, item, META_TYPE.STATIC)
      })
    }
  }

  addEntry (compiler: webpack.Compiler, entryPath, entryName, entryType) {
    compiler.hooks.make.tapAsync(PLUGIN_NAME, (compilation: webpack.compilation.Compilation, callback) => {
      const dep = new TaroSingleEntryDependency(entryPath, entryName, { name: entryName }, entryType)
      compilation.addEntry(this.options.sourceDir, dep, entryName, callback)
    })
  }

  addEntries (compiler: webpack.Compiler) {
    this.addEntry(compiler, this.appEntry, 'app', META_TYPE.ENTRY)
    this.pages.forEach(item => {
      if (item.isNative) {
        this.addEntry(compiler, item.path, item.name, META_TYPE.NORMAL)
      } else {
        this.addEntry(compiler, item.path, item.name, META_TYPE.PAGE)
      }
    })
    this.components.forEach(item => {
      if (item.isNative) {
        this.addEntry(compiler, item.path, item.name, META_TYPE.NORMAL)
      } else {
        this.addEntry(compiler, item.path, item.name, META_TYPE.COMPONENT)
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

  generateTemplateFile (compilation, filePath, templateFn, options?) {
    const templStr = templateFn(options)
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

  generateMiniFiles (compilation: webpack.compilation.Compilation) {
    const baseTemplateName = 'base'
    const { baseLevel } = this.options
    this.generateConfigFile(compilation, this.appEntry, this.appConfig)
    this.generateTemplateFile(compilation, baseTemplateName, buildBaseTemplate, baseLevel)
    this.generateXSFile(compilation)
    this.components.forEach(component => {
      const importBaseTemplatePath = promoteRelativePath(path.relative(component.path, path.join(this.options.sourceDir, this.getTemplatePath(baseTemplateName))))
      this.generateConfigFile(compilation, component.path, this.filesConfig[component.name])
      this.generateTemplateFile(compilation, component.path, buildPageTemplate, importBaseTemplatePath)
    })
    this.pages.forEach(page => {
      const importBaseTemplatePath = promoteRelativePath(path.relative(page.path, path.join(this.options.sourceDir, this.getTemplatePath(baseTemplateName))))
      this.generateConfigFile(compilation, page.path, this.filesConfig[page.name])
      this.generateTemplateFile(compilation, page.path, buildPageTemplate, importBaseTemplatePath)
    })
  }

  run (compiler) {
    this.getPages()
    this.getPagesConfig()
    this.generateTabBarFiles(compiler, this.appConfig)
    this.addEntries(compiler)
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

  isNativePageORComponent (templatePath) {
    return fs.existsSync(templatePath)
  }

  getConfigFilePath (filePath) {
    return resolveMainFilePath(`${filePath.replace(path.extname(filePath), '')}.config`)
  }

  getTemplatePath (filePath) {
    return this.getTargetFilePath(filePath, MINI_APP_FILES[this.options.buildAdapter].TEMPL)
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
