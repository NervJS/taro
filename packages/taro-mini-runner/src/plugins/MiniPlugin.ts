
import * as path from 'path'
import * as fs from 'fs-extra'

import wxTransformer from '@tarojs/transformer-wx'
import * as webpack from 'webpack'
import * as SingleEntryDependency from 'webpack/lib/dependencies/SingleEntryDependency'
import * as FunctionModulePlugin from 'webpack/lib/FunctionModulePlugin'
import * as JsonpTemplatePlugin from 'webpack/lib/web/JsonpTemplatePlugin'
import * as NodeSourcePlugin from 'webpack/lib/node/NodeSourcePlugin'
import * as LoaderTargetPlugin from 'webpack/lib/LoaderTargetPlugin'
import { merge, defaults, kebabCase } from 'lodash'
import * as t from 'babel-types'
import traverse from 'babel-traverse'
import { Config as IConfig, PageConfig } from '@tarojs/taro'
import * as _ from 'lodash'
import { ConcatSource } from 'webpack-sources'
import { urlToRequest } from 'loader-utils'

import { REG_TYPESCRIPT, BUILD_TYPES, PARSE_AST_TYPE, MINI_APP_FILES, NODE_MODULES_REG, CONFIG_MAP, taroJsFramework, taroJsQuickAppComponents, REG_SCRIPTS, processTypeEnum, REG_STYLE } from '../utils/constants'
import { IComponentObj, AddPageChunks, IComponent } from '../utils/types'
import { resolveScriptPath, buildUsingComponents, isNpmPkg, resolveNpmSync, isEmptyObject, promoteRelativePath, printLog, isAliasPath, replaceAliasPath } from '../utils'
import TaroSingleEntryDependency from '../dependencies/TaroSingleEntryDependency'
import { getTaroJsQuickAppComponentsPath, generateQuickAppUx, getImportTaroSelfComponents, getImportCustomComponents, generateQuickAppManifest } from '../utils/helper'
import parseAst from '../utils/parseAst'
import rewriterTemplate from '../quickapp/template-rewriter'

import TaroLoadChunksPlugin from './TaroLoadChunksPlugin'
import TaroNormalModulesPlugin from './TaroNormalModulesPlugin'
import MiniLoaderPlugin from './MiniLoaderPlugin'

interface IMiniPluginOptions {
  appEntry?: string,
  buildAdapter: BUILD_TYPES,
  nodeModulesPath: string,
  sourceDir: string,
  outputDir: string,
  quickappJSON?: any,
  designWidth: number,
  commonChunks: string[],
  pluginConfig?: object,
  pluginMainEntry?: string,
  isBuildPlugin: boolean,
  alias: object
  addChunkPages?: AddPageChunks,
  constantsReplaceList: object,
}

export interface ITaroFileInfo {
  [key: string]: {
    type: PARSE_AST_TYPE,
    config: IConfig,
    template?: string,
    code?: string,
    importStyles?: Set<string>,
    taroSelfComponents?: Set<{
      name: string,
      path: string
    }>
  }
}

const PLUGIN_NAME = 'MiniPlugin'

let taroFileTypeMap: ITaroFileInfo = {}

const quickappCommonStyle = 'common'

export const createTarget = function createTarget (name) {
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
  [BUILD_TYPES.QUICKAPP]: createTarget(BUILD_TYPES.QUICKAPP)
}

export function isFileToBeTaroComponent (
  code: string,
  sourcePath: string,
  buildAdapter: BUILD_TYPES,
  constantsReplaceList: object
) {
  try {
    const transformResult = wxTransformer({
      code,
      sourcePath: sourcePath,
      isTyped: REG_TYPESCRIPT.test(sourcePath),
      adapter: buildAdapter,
      isNormal: true,
      env: constantsReplaceList
    })
    const { ast } = transformResult
    let isTaroComponent = false

    traverse(ast, {
      ClassDeclaration (astPath) {
        astPath.traverse({
          ClassMethod (astPath) {
            if (astPath.get('key').isIdentifier({ name: 'render' })) {
              astPath.traverse({
                JSXElement () {
                  isTaroComponent = true
                }
              })
            }
          }
        })
      },

      ClassExpression (astPath) {
        astPath.traverse({
          ClassMethod (astPath) {
            if (astPath.get('key').isIdentifier({ name: 'render' })) {
              astPath.traverse({
                JSXElement () {
                  isTaroComponent = true
                }
              })
            }
          }
        })
      }
    })

    return {
      isTaroComponent,
      transformResult
    }
  } catch (error) {
    return error
  }
}

export default class MiniPlugin {
  options: IMiniPluginOptions
  appEntry: string
  pages: Set<IComponent>
  components: Set<IComponent>
  sourceDir: string
  outputDir: string
  context: string
  appConfig: IConfig
  pageConfigs: Map<string, PageConfig>
  changedFile: string
  tabBarIcons: Set<string>
  quickappStyleFiles: Set<any>
  isWatch: boolean
  errors: any[]
  changedFileType: PARSE_AST_TYPE | undefined
  addedComponents: Set<IComponent>
  pageComponentsDependenciesMap: Map<string, Set<IComponentObj>>
  dependencies: Map<string, TaroSingleEntryDependency>
  quickappImports: Map<string, Set<{ path: string, name: string }>>
  subPackages: Set<string>

  constructor (options = {}) {
    this.options = defaults(options || {}, {
      buildAdapter: BUILD_TYPES.WEAPP,
      nodeModulesPath: '',
      sourceDir: '',
      outputDir: '',
      designWidth: 750,
      commonChunks: ['runtime', 'vendors', 'taro', 'common'],
      isBuildPlugin: false,
      alias: {},
      constantsReplaceList:{}
    })
    this.sourceDir = this.options.sourceDir
    this.outputDir = this.options.outputDir

    this.pages = new Set()
    this.components = new Set()
    this.pageConfigs = new Map()
    this.tabBarIcons = new Set()
    this.quickappStyleFiles = new Set()
    this.isWatch = false
    this.errors = []
    this.addedComponents = new Set()
    this.pageComponentsDependenciesMap = new Map()
    this.dependencies = new Map()
    this.quickappImports = new Map()
    this.subPackages = new Set()

    this.parseConstantsList()
  }

  tryAsync = fn => async (arg, callback) => {
		try {
			await fn(arg)
			callback()
		} catch (err) {
			callback(err)
		}
  }

  parseConstantsList () {
    const parsedConstantsReplaceList = {}
    Object.keys(this.options.constantsReplaceList).forEach(key => {
      try {
        parsedConstantsReplaceList[key] = JSON.parse(this.options.constantsReplaceList[key])
      } catch (error) {
        parsedConstantsReplaceList[key] = this.options.constantsReplaceList[key]
      }
    })
    this.options.constantsReplaceList = parsedConstantsReplaceList
  }

  apply (compiler) {
    this.context = compiler.context
    this.appEntry = this.getAppEntry(compiler)
    let taroLoadChunksPlugin
    const commonStyles: Set<string> = new Set()
    compiler.hooks.run.tapAsync(
			PLUGIN_NAME,
			this.tryAsync(async (compiler: webpack.Compiler) => {
        await this.run(compiler)
        if(taroLoadChunksPlugin) taroLoadChunksPlugin.destroy()
        taroLoadChunksPlugin = new TaroLoadChunksPlugin({
          commonChunks: this.options.commonChunks,
          buildAdapter: this.options.buildAdapter,
          isBuildPlugin: this.options.isBuildPlugin,
          addChunkPages: this.options.addChunkPages,
          pages: this.pages,
          depsMap: this.pageComponentsDependenciesMap,
          sourceDir: this.sourceDir,
          subPackages: this.subPackages
        })
        taroLoadChunksPlugin.apply(compiler)
			})
    )

    compiler.hooks.watchRun.tapAsync(
			PLUGIN_NAME,
			this.tryAsync(async (compiler: webpack.Compiler) => {
        const changedFiles = this.getChangedFiles(compiler)
        if (!changedFiles.length) {
          await this.run(compiler)
        } else {
          await this.watchRun(compiler, changedFiles)
        }
        if(taroLoadChunksPlugin) taroLoadChunksPlugin.destroy()
        taroLoadChunksPlugin = new TaroLoadChunksPlugin({
          commonChunks: this.options.commonChunks,
          buildAdapter: this.options.buildAdapter,
          isBuildPlugin: this.options.isBuildPlugin,
          addChunkPages: this.options.addChunkPages,
          pages: this.pages,
          depsMap: this.pageComponentsDependenciesMap,
          sourceDir: this.sourceDir,
          subPackages: this.subPackages
        })
        taroLoadChunksPlugin.apply(compiler)
			})
    )

    compiler.hooks.make.tapAsync(PLUGIN_NAME, (compilation: webpack.compilation.Compilation, callback) => {
      const dependencies = this.dependencies
      const promises: any[] = []
      dependencies.forEach(dep => {
        promises.push(new Promise((resolve, reject) => {
          compilation.addEntry(this.sourceDir, dep, dep.name, err => err ? reject(err) : resolve())
        }))
      })
      Promise.all(promises).then(() => callback(), callback)
    })

    compiler.hooks.compilation.tap(PLUGIN_NAME, (compilation, { normalModuleFactory }) => {
      compilation.dependencyFactories.set(SingleEntryDependency, normalModuleFactory)
      compilation.dependencyFactories.set(TaroSingleEntryDependency, normalModuleFactory)

      compilation.hooks.afterOptimizeChunkAssets.tap(PLUGIN_NAME, chunks => {
        chunks.forEach(chunk => {
          const id = typeof chunk.id === 'string' ? chunk.id : chunk.name
          this.options.commonChunks.forEach(commonName => {
            if (id === commonName) {
              const _modules = chunk._modules
              if (_modules) {
                for (const mod of _modules) {
                  if (REG_STYLE.test(mod.resource)) {
                    commonStyles.add(mod.resource)
                  }
                }
              }
            }
          })
        })
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

    compiler.hooks.emit.tapAsync(
      PLUGIN_NAME,
      this.tryAsync(async compilation => {
        compilation.errors = compilation.errors.concat(this.errors)
        await this.generateMiniFiles(compilation, commonStyles)
        this.addedComponents.clear()
      })
    )

    compiler.hooks.afterEmit.tapAsync(
      PLUGIN_NAME,
      this.tryAsync(async compilation => {
        await this.addTarBarFilesToDependencies(compilation)
      })
    )

    new TaroNormalModulesPlugin().apply(compiler)
    new MiniLoaderPlugin({
      buildAdapter: this.options.buildAdapter,
      sourceDir: this.sourceDir
    }).apply(compiler)
  }

  getChangedFiles (compiler) {
    const { watchFileSystem } = compiler
    const watcher = watchFileSystem.watcher || watchFileSystem.wfs.watcher

    return Object.keys(watcher.mtimes)
  }

  getAppEntry (compiler) {
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
      const app = entry['app']
      if (Array.isArray(app)) {
        return app[0]
      }
      return app
    }
    const appEntryPath = getEntryPath(entry)
    compiler.options.entry = {}
    return appEntryPath
  }

  getNpmComponentRealPath (code: string, component: IComponentObj, adapter: BUILD_TYPES): string | null {
    let componentRealPath: string | null = null
    let importExportName
    const isTaroComponentRes = this.judgeFileToBeTaroComponent(code, component.path as string, adapter)
    if (isTaroComponentRes == null) {
      return null
    }
    const { isTaroComponent, transformResult } = isTaroComponentRes
    const isNativePageOrComponent = this.isNativePageOrComponent(this.getTemplatePath(component.path), fs.readFileSync(component.path).toString())
    if (isTaroComponent || isNativePageOrComponent) {
      return component.path
    }
    const componentName = component.name!.split('|')[1] || component.name
    const { ast } = transformResult
    traverse(ast, {
      ExportNamedDeclaration (astPath) {
        const node = astPath.node
        const specifiers = node.specifiers
        const source = node.source
        if (source && source.type === 'StringLiteral') {
          specifiers.forEach(specifier => {
            const exported = specifier.exported
            if (kebabCase(exported.name) === componentName) {
              componentRealPath = resolveScriptPath(path.resolve(path.dirname(component.path as string), source.value))
            }
          })
        } else {
          specifiers.forEach(specifier => {
            const exported = specifier.exported
            if (kebabCase(exported.name) === componentName) {
              importExportName = exported.name
            }
          })
        }
      },

      ExportDefaultDeclaration (astPath) {
        const node = astPath.node
        const declaration = node.declaration as t.Identifier
        if (component.type === 'default') {
          importExportName = declaration.name
        }
      },

      CallExpression (astPath) {
        if (astPath.get('callee').isIdentifier({ name: 'require' })) {
          const arg = astPath.get('arguments')[0]
          if (t.isStringLiteral(arg.node)) {
            componentRealPath = resolveScriptPath(path.resolve(path.dirname(component.path as string), arg.node.value))
          }
        }
      },

      Program: {
        exit (astPath) {
          astPath.traverse({
            ImportDeclaration (astPath) {
              const node = astPath.node
              const specifiers = node.specifiers
              const source = node.source
              if (importExportName) {
                specifiers.forEach(specifier => {
                  const local = specifier.local
                  if (local.name === importExportName) {
                    componentRealPath = resolveScriptPath(path.resolve(path.dirname(component.path as string), source.value))
                  }
                })
              }
            }
          })
        }
      }
    })
    if (componentRealPath) {
      component.path = componentRealPath
      code = fs.readFileSync(componentRealPath).toString()
      componentRealPath = this.getNpmComponentRealPath(code, component, adapter)
    }
    return componentRealPath
  }

  transformComponentsPath (filePath, components: IComponentObj[]) {
    const { buildAdapter, alias } = this.options
    components.forEach(component => {
      try {
        let componentPath = component.path
        let realComponentPath
        if (componentPath) {
          if (isNpmPkg(componentPath)) {
            if (isAliasPath(componentPath, alias)) {
              componentPath = replaceAliasPath(filePath, componentPath, alias)
              realComponentPath = resolveScriptPath(path.resolve(filePath, '..', componentPath as string))
            } else {
              realComponentPath = resolveNpmSync(componentPath, this.options.nodeModulesPath)
            }
          } else {
            realComponentPath = resolveScriptPath(path.resolve(filePath, '..', componentPath as string))
          }
          const code = fs.readFileSync(realComponentPath).toString()
          const newComponent = Object.assign({}, component, { path: realComponentPath })
          realComponentPath = this.getNpmComponentRealPath(code, newComponent, buildAdapter)
          component.path = realComponentPath
        }
      } catch (error) {
        if (error.codeFrame) {
          this.errors.push(new Error(error.message + '\n' + error.codeFrame))
        } else {
          this.errors.push(error)
        }
      }
    })
  }

  getTabBarFiles (compiler: webpack.Compiler,appConfig) {
    const tabBar = appConfig.tabBar
    const { buildAdapter } = this.options
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
        const customTabBarPath = path.join(this.sourceDir, 'custom-tab-bar')
        const customTabBarComponentPath = resolveScriptPath(customTabBarPath)
        if (fs.existsSync(customTabBarComponentPath)) {
          const customTabBarComponentTemplPath = this.getTemplatePath(customTabBarComponentPath)
          const isNative = this.isNativePageOrComponent(customTabBarComponentTemplPath, fs.readFileSync(customTabBarComponentPath).toString())
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
          this.components.add(componentObj)
          this.getComponents(compiler, new Set([componentObj]), false)
        }
      }
    }
  }

  getSubPackages (appConfig) {
    const subPackages = appConfig.subPackages || appConfig['subpackages']
    if (subPackages && subPackages.length) {
      subPackages.forEach(item => {
        if (item.pages && item.pages.length) {
          const root = item.root
          this.subPackages.add(root)
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
              const pagePath = resolveScriptPath(path.join(this.sourceDir, pageItem))
              const templatePath = this.getTemplatePath(pagePath)
              const isNative = this.isNativePageOrComponent(templatePath, fs.readFileSync(pagePath).toString())
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

  getShowPath (filePath) {
    return filePath.replace(this.context, '').replace(/\\/g, '/').replace(/^\//, '')
  }

  getPages (compiler) {
    const { buildAdapter, constantsReplaceList, nodeModulesPath, alias } = this.options
    const appEntry = this.appEntry
    const code = fs.readFileSync(appEntry).toString()
    try {
      const transformResult = wxTransformer({
        code,
        sourcePath: appEntry,
        sourceDir: this.sourceDir,
        isTyped: REG_TYPESCRIPT.test(appEntry),
        isApp: true,
        adapter: buildAdapter,
        env: constantsReplaceList
      })
      const { configObj, importStyles } = parseAst(transformResult.ast, buildAdapter, appEntry, nodeModulesPath, alias)
      const appPages = configObj.pages
      this.appConfig = configObj
      compiler.appConfig = configObj
      if (!appPages || appPages.length === 0) {
        throw new Error('缺少页面')
      }
      if (!this.isWatch) {
        printLog(processTypeEnum.COMPILE, '发现入口', this.getShowPath(appEntry))
      }
      this.getSubPackages(configObj)
      this.getTabBarFiles(compiler, configObj)
      taroFileTypeMap[this.appEntry] = {
        type: PARSE_AST_TYPE.ENTRY,
        config: configObj,
        code: transformResult.code,
        importStyles
      }
      this.pages = new Set([
        ...this.pages,
        ...appPages.map(item => {
          const pagePath = resolveScriptPath(path.join(this.sourceDir, item))
          const pageTemplatePath = this.getTemplatePath(pagePath)
          const isNative = this.isNativePageOrComponent(pageTemplatePath, fs.readFileSync(pagePath).toString())
          return {
            name: item,
            path: pagePath,
            isNative,
            stylePath: isNative ? this.getStylePath(pagePath) : null,
            templatePath: isNative ? this.getTemplatePath(pagePath) : null
          }
        })
      ])
    } catch (error) {
      if (error.codeFrame) {
        this.errors.push(new Error(error.message + '\n' + error.codeFrame))
      } else {
        this.errors.push(error)
      }
    }
  }

  getPluginFiles (compiler) {
    const fileList = new Set<IComponent>()
    const { pluginConfig, buildAdapter } = this.options
    let normalFiles = new Set<IComponent>()
    Object.keys(this.appEntry).forEach(key => {
      const filePath = this.appEntry[key][0]
      const code = fs.readFileSync(filePath).toString()
      const isTaroComponentRes = this.judgeFileToBeTaroComponent(code, filePath, buildAdapter)
      if (key === this.options.pluginMainEntry) {
        this.addEntry(compiler, filePath, key, PARSE_AST_TYPE.EXPORTS)
      }
      if (isTaroComponentRes == null) {
        return null
      }
      if (isTaroComponentRes.isTaroComponent) {
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
            this.getComponents(compiler, fileList, isPage)
          } else if (isComponent) {
            this.components.add({
              name: key,
              path: filePath,
              isNative: false
            })
            this.getComponents(compiler, fileList, false)
          } else {
            normalFiles.add({
              name: key,
              path: filePath,
              isNative: true
            })
          }
        }
      }
    })
    normalFiles.forEach(item => {
      this.addEntry(compiler, item.path, item.name, PARSE_AST_TYPE.NORMAL)
    })
    this.pages.forEach(item => {
      if (item.isNative) {
        this.addEntry(compiler, item.path, item.name, PARSE_AST_TYPE.NORMAL)
        if (item.stylePath && fs.existsSync(item.stylePath)) {
          this.addEntry(compiler, item.stylePath, this.getStylePath(item.name), PARSE_AST_TYPE.NORMAL)
        }
        if (item.templatePath && fs.existsSync(item.templatePath)) {
          this.addEntry(compiler, item.templatePath, this.getTemplatePath(item.name), PARSE_AST_TYPE.NORMAL)
        }
      } else {
        this.addEntry(compiler, item.path, item.name, PARSE_AST_TYPE.PAGE)
      }
    })
    this.components.forEach(item => {
      if (item.isNative) {
        this.addEntry(compiler, item.path, item.name, PARSE_AST_TYPE.NORMAL)
        if (item.stylePath && fs.existsSync(item.stylePath)) {
          this.addEntry(compiler, item.stylePath, this.getStylePath(item.name), PARSE_AST_TYPE.NORMAL)
        }
        if (item.templatePath && fs.existsSync(item.templatePath)) {
          this.addEntry(compiler, item.templatePath, this.getTemplatePath(item.name), PARSE_AST_TYPE.NORMAL)
        }
      } else {
        this.addEntry(compiler, item.path, item.name, PARSE_AST_TYPE.COMPONENT)
      }
    })
  }

  isNativePageOrComponent (templatePath, jsContent) {
    return fs.existsSync(templatePath) && jsContent.indexOf(taroJsFramework) < 0
  }

  getComponentName (componentPath) {
    return this.getRelativePath(componentPath)
      .replace(/\\/g, '/')
      .replace(path.extname(componentPath), '')
      .replace(/^(\/|\\)/, '')
  }

  getComponents (compiler: webpack.Compiler, fileList: Set<IComponent>, isRoot: boolean) {
    const { buildAdapter, alias, constantsReplaceList, nodeModulesPath } = this.options
    const isQuickApp = buildAdapter === BUILD_TYPES.QUICKAPP
    const isSwanApp = buildAdapter === BUILD_TYPES.SWAN
    fileList.forEach(file => {
      try {
        const isNative = file.isNative
        const isComponentConfig = isRoot && !isSwanApp ? {} : { component: true }

        let configObj
        let taroSelfComponents
        let depComponents
        let code = fs.readFileSync(file.path).toString()
        let importStyles
        if (isNative) {
          const configPath = this.getConfigPath(file.path)
          if (fs.existsSync(configPath)) {
            configObj = JSON.parse(fs.readFileSync(configPath).toString())
            const usingComponents = configObj.usingComponents
            depComponents = usingComponents ? Object.keys(usingComponents).map(item => ({
              name: item,
              path: usingComponents[item]
            })) : []
          }
        } else {
          if (isQuickApp && isRoot) {
            const styleName = this.getStylePath(quickappCommonStyle)
            const taroJsQuickAppStylesPath = path.resolve(this.options.nodeModulesPath, taroJsQuickAppComponents, 'src/common/css')
            const sourceStylePath = path.resolve(taroJsQuickAppStylesPath, styleName)
            this.quickappStyleFiles.add({
              path: sourceStylePath,
              name: styleName
            })
          }
          const transformResult = wxTransformer({
            code,
            sourcePath: file.path,
            sourceDir: this.sourceDir,
            isTyped: REG_TYPESCRIPT.test(file.path),
            isRoot,
            adapter: buildAdapter,
            env: constantsReplaceList
          })
          let parseAstRes = parseAst(transformResult.ast, buildAdapter, file.path, nodeModulesPath, alias)
          configObj = parseAstRes.configObj
          importStyles = parseAstRes.importStyles
          if (isRoot) {
            const showPath = file.path.replace(this.sourceDir, '').replace(path.extname(file.path), '')
            this.pageConfigs.set(showPath, configObj)
          }
          taroSelfComponents = parseAstRes.taroSelfComponents
          const usingComponents = configObj.usingComponents
          if (usingComponents) {
            Object.keys(usingComponents).forEach(item => {
              transformResult.components.push({
                name: item,
                path: usingComponents[item]
              })
            })
          }
          if (isRoot) {
            taroSelfComponents.add('taro-page')
          }
          depComponents = transformResult.components
          code = transformResult.code
        }
        depComponents = depComponents.filter(item => !/^(plugin|dynamicLib|plugin-private):\/\//.test(item.path))
        this.transformComponentsPath(file.path, depComponents)
        if (isQuickApp) {
          const scriptPath = file.path
          const outputScriptPath = scriptPath.replace(this.sourceDir, this.outputDir).replace(path.extname(scriptPath), MINI_APP_FILES[buildAdapter].SCRIPT)
          const importTaroSelfComponents = getImportTaroSelfComponents(outputScriptPath, this.options.nodeModulesPath, this.outputDir, taroSelfComponents)
          const importCustomComponents = getImportCustomComponents(file.path, depComponents)
          const usingComponents = configObj.usingComponents
          let importUsingComponent: any = new Set([])
          if (usingComponents) {
            importUsingComponent = new Set(Object.keys(usingComponents).map(item => {
              return {
                name: item,
                path: usingComponents[item]
              }
            }))
          }
          this.quickappImports.set(scriptPath, new Set([...importTaroSelfComponents, ...importUsingComponent, ...importCustomComponents]))
        }
        if (!this.isWatch) {
          printLog(processTypeEnum.COMPILE, isRoot ? '发现页面' : '发现组件', this.getShowPath(file.path))
        }
        taroFileTypeMap[file.path] = {
          type: isRoot ? PARSE_AST_TYPE.PAGE : PARSE_AST_TYPE.COMPONENT,
          config: merge({}, isComponentConfig, buildUsingComponents(file.path, this.sourceDir, alias, depComponents), configObj),
          code,
          importStyles
        }
        if (isQuickApp && taroSelfComponents) {
          taroFileTypeMap[file.path].taroSelfComponents = new Set(Array.from(taroSelfComponents).map(item => {
            const taroJsQuickAppComponentsPath = getTaroJsQuickAppComponentsPath(this.options.nodeModulesPath)
            const componentPath = path.join(taroJsQuickAppComponentsPath, item as string, `index${MINI_APP_FILES[buildAdapter].TEMPL}`)
            return {
              name: item as string,
              path: componentPath
            }
          }))
        }
        if (depComponents && depComponents.length) {
          const componentsList = new Set<IComponentObj>()
          depComponents.forEach(item => {
            const componentPath = resolveScriptPath(path.resolve(path.dirname(file.path), item.path))
            if (fs.existsSync(componentPath) && !Array.from(this.components).some(item => item.path === componentPath)) {
              const componentName = this.getComponentName(componentPath)
              const componentTempPath = this.getTemplatePath(componentPath)
              const isNative = this.isNativePageOrComponent(componentTempPath, fs.readFileSync(componentPath).toString())
              const componentObj = {
                name: componentName,
                path: componentPath,
                isNative,
                stylePath: isNative ? this.getStylePath(componentPath) : null,
                templatePath: isNative ? this.getTemplatePath(componentPath) : null
              }
              this.components.add(componentObj)
              this.addedComponents.add(componentObj)
              componentsList.add(componentObj)
              this.pageComponentsDependenciesMap.set(file.path, componentsList)
              this.getComponents(compiler, new Set([componentObj]), false)
            }
          })
        }
      } catch (error) {
        if (error.codeFrame) {
          this.errors.push(new Error(error.message + '\n' + error.codeFrame))
        } else {
          this.errors.push(error)
        }
      }
    })
  }

  addEntry (compiler: webpack.Compiler, entryPath, entryName, entryType) {
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

  addEntries (compiler: webpack.Compiler) {
    this.addEntry(compiler, this.appEntry, 'app', PARSE_AST_TYPE.ENTRY)
    this.pages.forEach(item => {
      if (item.isNative) {
        this.addEntry(compiler, item.path, item.name, PARSE_AST_TYPE.NORMAL)
        if (item.stylePath && fs.existsSync(item.stylePath)) {
          this.addEntry(compiler, item.stylePath, this.getStylePath(item.name), PARSE_AST_TYPE.NORMAL)
        }
        if (item.templatePath && fs.existsSync(item.templatePath)) {
          this.addEntry(compiler, item.templatePath, this.getTemplatePath(item.name), PARSE_AST_TYPE.NORMAL)
        }
      } else {
        this.addEntry(compiler, item.path, item.name, PARSE_AST_TYPE.PAGE)
      }
    })
    this.components.forEach(item => {
      if (item.isNative) {
        this.addEntry(compiler, item.path, item.name, PARSE_AST_TYPE.NORMAL)
        if (item.stylePath && fs.existsSync(item.stylePath)) {
          this.addEntry(compiler, item.stylePath, this.getStylePath(item.name), PARSE_AST_TYPE.NORMAL)
        }
        if (item.templatePath && fs.existsSync(item.templatePath)) {
          this.addEntry(compiler, item.templatePath, this.getTemplatePath(item.name), PARSE_AST_TYPE.NORMAL)
        }
      } else {
        this.addEntry(compiler, item.path, item.name, PARSE_AST_TYPE.COMPONENT)
      }
    })
  }

  generateMiniFiles (compilation: webpack.compilation.Compilation, commonStyles: Set<string>) {
    const { buildAdapter, commonChunks } = this.options
    const isQuickApp = buildAdapter === BUILD_TYPES.QUICKAPP
    Object.keys(taroFileTypeMap).forEach(item => {
      const relativePath = this.getRelativePath(item)
      const extname = path.extname(item)
      let jsonPath = relativePath.replace(extname, MINI_APP_FILES[buildAdapter].CONFIG).replace(/\\/g, '/').replace(/^\//, '')
      const scriptPath = relativePath.replace(extname, MINI_APP_FILES[buildAdapter].SCRIPT).replace(/\\/g, '/').replace(/^\//, '')
      const templatePath = relativePath.replace(extname, MINI_APP_FILES[buildAdapter].TEMPL).replace(/\\/g, '/').replace(/^\//, '')
      const stylePath = relativePath.replace(extname, MINI_APP_FILES[buildAdapter].STYLE).replace(/\\/g, '/').replace(/^\//, '')
      const itemInfo = taroFileTypeMap[item]
      if (itemInfo.type === PARSE_AST_TYPE.ENTRY) {
        jsonPath = relativePath.replace(RegExp(`(.${buildAdapter})?${extname}$`), MINI_APP_FILES[buildAdapter].CONFIG).replace(/\\/g, '/').replace(/^\//, '')
      }
      if (!isQuickApp) {
        const jsonStr = JSON.stringify(itemInfo.config)
        compilation.assets[jsonPath] = {
          size: () => jsonStr.length,
          source: () => jsonStr
        }
      } else {
        let hitScriptItem
        let template = compilation.assets[templatePath]
        template = generateQuickAppUx({
          template: template ? (template._source ? template._source.source() : template._value) : '',
          imports: this.quickappImports.get(item)
        })
        template = template ? rewriterTemplate(template) : template
        Object.keys(compilation.assets).forEach(item => {
          if (stylePath.indexOf(item) >= 0) {
            const relativeStylePath = promoteRelativePath(path.relative(scriptPath, stylePath))
            template = `<style src='${relativeStylePath}'></style>\n` + template
          }
          if (scriptPath.indexOf(item) >= 0) {
            const assetItem = compilation.assets[item]
            let scriptContent = assetItem._source ? assetItem._source.source() : assetItem._value
            scriptContent = `let exportRes;\n${scriptContent}\nexport default exportRes;`
            hitScriptItem = item
            template += `\n<script>${scriptContent}</script>`
          }
        })
        if (hitScriptItem) {
          delete compilation.assets[hitScriptItem]
        }
        const quickappJSON = generateQuickAppManifest({
          appConfig: this.appConfig,
          designWidth: this.options.designWidth,
          pageConfigs: this.pageConfigs,
          quickappJSON: this.options.quickappJSON
        })
        const quickappJSONStr = JSON.stringify(quickappJSON).replace(/\\\\/g, '/')
        compilation.assets['./manifest.json'] = {
          size: () => quickappJSONStr.length,
          source: () => quickappJSONStr
        }
        compilation.assets[templatePath] = {
          size: () => template.length,
          source: () => template
        }
      }
      if (itemInfo.taroSelfComponents) {
        itemInfo.taroSelfComponents.forEach(item => {
          if (fs.existsSync(item.path)) {
            const content = fs.readFileSync(item.path).toString()
            const relativePath = this.getRelativePath(item.path).replace(/\\/g, '/')
            compilation.assets[relativePath] = {
              size: () => content.length,
              source: () => content
            }
          }
        })
      }
      // 处理公共样式引入
      // 2.1.1 开始只有引用到公共样式的组件或页面文件里会引入 common 公共样式
      const importStyles = itemInfo.importStyles
      let needAddCommon = false
      if (importStyles && importStyles.size && commonStyles.size) {
        commonStyles.forEach(val => {
          if (importStyles.has(val)) {
            needAddCommon = true
          }
        })
      }
      const assets = compilation.assets
      const asset = assets[stylePath]
      if (needAddCommon) {
        const source = new ConcatSource()
        Object.keys(assets).forEach(assetName => {
          const fileName = path.basename(assetName, path.extname(assetName))
          if (REG_STYLE.test(assetName) && commonChunks.includes(fileName)) {
            source.add(`@import ${JSON.stringify(urlToRequest(promoteRelativePath(path.relative(stylePath, assetName))))};`)
            source.add('\n')
          }
        })
        if (asset) {
          const _source = asset._source || asset._value
          source.add(_source)
        }
        assets[stylePath] = {
          size: () => source.source().length,
          source: () => source.source()
        }
      } else {
        if (asset) {
          const value = asset._source ? asset._source.source() : asset._value
          if (value) {
            let commonStylePath
            Object.keys(assets).forEach(assetName => {
              const fileName = path.basename(assetName, path.extname(assetName))
              if (REG_STYLE.test(assetName) && commonChunks.includes(fileName)) {
                commonStylePath = promoteRelativePath(path.relative(stylePath, assetName))
              }
            })
            const newValue = value.split('\n').map(item => {
              if (commonStylePath && item.indexOf(commonStylePath) >= 0) {
                return
              }
              return item
            }).filter(item => item).join('\n')
            assets[stylePath] = {
              size: () => newValue.length,
              source: () => newValue
            }
          }
        }
      }
    })

    this.tabBarIcons.forEach(icon => {
      const iconPath = path.resolve(this.sourceDir, icon)
      if (fs.existsSync(iconPath)) {
        const iconStat = fs.statSync(iconPath)
        const iconSource = fs.readFileSync(iconPath)
        compilation.assets[icon] = {
					size: () => iconStat.size,
					source: () => iconSource
				}
      }
    })

    this.quickappStyleFiles.forEach(item => {
      if (fs.existsSync(item.path)) {
        const styleContent = fs.readFileSync(item.path).toString()
        const relativePath = this.getRelativePath(item.path).replace(/\\/g, '/')
        compilation.assets[relativePath] = {
          size: () => styleContent.length,
          source: () => styleContent
        }
      }
    })
  }

  getRelativePath (filePath) {
    let relativePath
    if (NODE_MODULES_REG.test(filePath)) {
      relativePath = filePath.replace(this.options.nodeModulesPath, 'npm')
    } else {
      relativePath = filePath.replace(this.sourceDir, '')
    }
    return relativePath
  }

  addTarBarFilesToDependencies (compilation: webpack.compilation.Compilation) {
    const { fileDependencies } = compilation
    this.tabBarIcons.forEach(icon => {
      if (!fileDependencies.has(icon)) {
        fileDependencies.add(icon)
      }
    })
  }

  judgeFileToBeTaroComponent (
    code: string,
    sourcePath: string,
    buildAdapter: BUILD_TYPES
  ) {
    const { constantsReplaceList } = this.options
    const isTaroComponentRes = isFileToBeTaroComponent(code, sourcePath, buildAdapter, constantsReplaceList)
    if (isTaroComponentRes instanceof Error) {
      if ((isTaroComponentRes as any).codeFrame) {
        this.errors.push(isTaroComponentRes)
      } else {
        this.errors.push(isTaroComponentRes)
      }
      return null
    }
    return isTaroComponentRes
  }

  run (compiler: webpack.Compiler) {
    this.errors = []
    this.pages = new Set()
    this.components = new Set()
    this.pageConfigs = new Map()
    this.tabBarIcons = new Set()
    this.quickappStyleFiles = new Set()
    this.addedComponents = new Set()
    if (!this.options.isBuildPlugin) {
      this.getPages(compiler)
      this.getComponents(compiler, this.pages, true)
      this.addEntries(compiler)
    } else {
      this.getPluginFiles(compiler)
    }
  }

  watchRun (compiler: webpack.Compiler, changedFiles: string[]) {
    const changedFile = changedFiles[0]
    this.isWatch = true
    if (REG_SCRIPTS.test(changedFile)) {
      this.changedFile = changedFile
      let { type, obj } = this.getChangedFileInfo(changedFile)
      this.errors = []
      if (!type) {
        const code = fs.readFileSync(changedFile).toString()
        const isTaroComponentRes = this.judgeFileToBeTaroComponent(code, changedFile, this.options.buildAdapter)
        if (isTaroComponentRes == null) {
          return
        }
        if (isTaroComponentRes.isTaroComponent) {
          const isNative = this.isNativePageOrComponent(this.getTemplatePath(changedFile), code)
          type = PARSE_AST_TYPE.COMPONENT
          obj = {
            name: changedFile.replace(this.sourceDir, '').replace(path.extname(changedFile), ''),
            path: changedFile,
            isNative,
            stylePath: isNative ? this.getStylePath(changedFile) : null,
            templatePath: isNative ? this.getTemplatePath(changedFile) : null
          }
        }
      }
      this.changedFileType = type
      if (this.changedFileType === PARSE_AST_TYPE.ENTRY
        || this.changedFileType === PARSE_AST_TYPE.PAGE
        || this.changedFileType === PARSE_AST_TYPE.COMPONENT) {
        this.components.forEach(component => {
          if (component.path === changedFile) {
            this.components.delete(component)
          }
        })
        if (this.changedFileType === PARSE_AST_TYPE.ENTRY) {
          this.run(compiler)
        } else {
          if (!this.options.isBuildPlugin) {
            this.getComponents(compiler, new Set([obj]), this.changedFileType === PARSE_AST_TYPE.PAGE)
            if (this.addedComponents.size) {
              this.addedComponents.forEach(item => {
                if (item.isNative) {
                  this.addEntry(compiler, item.path, item.name, PARSE_AST_TYPE.NORMAL)
                  if (item.stylePath && fs.existsSync(item.stylePath)) {
                    this.addEntry(compiler, item.stylePath, this.getStylePath(item.name), PARSE_AST_TYPE.NORMAL)
                  }
                  if (item.templatePath && fs.existsSync(item.templatePath)) {
                    this.addEntry(compiler, item.templatePath, this.getTemplatePath(item.name), PARSE_AST_TYPE.NORMAL)
                  }
                } else {
                  this.addEntry(compiler, item.path, item.name, PARSE_AST_TYPE.COMPONENT)
                }
              })
            }
          } else {
            this.getPluginFiles(compiler)
          }
        }
        if (obj && type === PARSE_AST_TYPE.COMPONENT
            && !Array.from(this.components).some(item => item.path === obj.path)) {
          this.components.add(obj)
        }
      }
    }
  }

  getChangedFileInfo (filePath) {
    let type
    let obj
    this.pages.forEach(page => {
      if (page.path === filePath) {
        type = PARSE_AST_TYPE.PAGE
        obj = page
      }
    })
    this.components.forEach(component => {
      if (component.path === filePath) {
        type = PARSE_AST_TYPE.COMPONENT
        obj = component
      }
    })
    if (filePath === this.appEntry) {
      type = PARSE_AST_TYPE.ENTRY
    }
    return {
      type,
      obj
    }
  }

  getTargetFilePath (filePath, targetExtname) {
    const extname = path.extname(filePath)
    if (extname) {
      return filePath.replace(extname, targetExtname)
    }
    return filePath + targetExtname
  }

  getTemplatePath (filePath) {
    return this.getTargetFilePath(filePath, MINI_APP_FILES[this.options.buildAdapter].TEMPL)
  }

  getConfigPath (filePath) {
    return this.getTargetFilePath(filePath, MINI_APP_FILES[this.options.buildAdapter].CONFIG)
  }

  getStylePath (filePath) {
    return this.getTargetFilePath(filePath, MINI_APP_FILES[this.options.buildAdapter].STYLE)
  }

  static getTaroFileTypeMap () {
    return taroFileTypeMap
  }

  static init () {
    taroFileTypeMap = {}
  }
}
