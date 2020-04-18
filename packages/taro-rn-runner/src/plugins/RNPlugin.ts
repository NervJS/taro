import * as path from 'path'
import * as fs from 'fs-extra'
import { getTransformResult } from '../utils/codeTransform'
import * as webpack from 'webpack'
import * as SingleEntryDependency from 'webpack/lib/dependencies/SingleEntryDependency'
import * as FunctionModulePlugin from 'webpack/lib/FunctionModulePlugin'
import * as JsonpTemplatePlugin from 'webpack/lib/web/JsonpTemplatePlugin'
import * as NodeSourcePlugin from 'webpack/lib/node/NodeSourcePlugin'
import * as LoaderTargetPlugin from 'webpack/lib/LoaderTargetPlugin'
import { defaults, kebabCase } from 'lodash'
import * as t from 'babel-types'
import traverse from 'babel-traverse'
import { Config as IConfig, PageConfig } from '@tarojs/taro'
import { SyncHook } from 'tapable'
import * as _ from 'lodash'
import { compileStyle } from '../style'

import {
  // REG_TYPESCRIPT,
  BUILD_TYPES,
  PARSE_AST_TYPE,
  MINI_APP_FILES,
  NODE_MODULES_REG,
  CONFIG_MAP,
  taroJsFramework,
  REG_SCRIPTS,
  processTypeEnum,
  REG_STYLE
} from '../utils/constants'
import { IComponentObj, AddPageChunks } from '../utils/types'
import {
  resolveScriptPath,
  isNpmPkg,
  resolveNpmSync,
  isEmptyObject,
  printLog,
  isAliasPath,
  replaceAliasPath
} from '../utils'
import TaroSingleEntryDependency from '../dependencies/TaroSingleEntryDependency'
// import { getTaroJsQuickAppComponentsPath } from '../utils/helper'
import parseAst from '../utils/parseAst'
import TaroLoadChunksPlugin from './TaroLoadChunksPlugin'
import TaroNormalModulesPlugin from './TaroNormalModulesPlugin'
import VirtualModulePlugin from './VirtualModulePlugin/VirtualModulePlugin'
import chalk from 'chalk'

interface IRNPluginOptions {
  appEntry?: string,
  buildAdapter: BUILD_TYPES,
  nodeModulesPath: string,
  sourceDir: string,
  outputDir: string,
  quickappJSON?: any,
  designWidth: number,
  commonChunks: string[],
  pluginConfig?: object,
  isBuildPlugin: boolean,
  alias: object,
  addChunkPages?: AddPageChunks,
  appJson?: object
}

export interface ITaroFileInfo {
  [key: string]: {
    type: PARSE_AST_TYPE,
    config?: IConfig,
    template?: string,
    code?: string,
    style?: string,
    taroSelfComponents?: Set<{
      name: string,
      path: string
    }>
  }
}

interface IComponent {
  name: string,
  path: string,
  isNative: boolean
}

const PLUGIN_NAME = 'RNPlugin'

let taroFileTypeMap: ITaroFileInfo = {}
let generateFileCache: any = {}

export const createTarget = function createTarget (name) {
  return (compiler: webpack.compiler.Compiler) => {
    const {options} = compiler
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
  [BUILD_TYPES.QUICKAPP]: createTarget(BUILD_TYPES.QUICKAPP),
  [BUILD_TYPES.RN]: createTarget(BUILD_TYPES.RN)
}

export function isFileToBeTaroComponent (
  code: string,
  sourcePath: string,
  buildAdapter: BUILD_TYPES
) {
  try {
    const transformResult = getTransformResult({
      code,
      sourcePath: sourcePath
    })
    const {ast} = transformResult
    let isTaroComponent = false
    // @ts-ignore
    traverse(ast, {
      ClassDeclaration (astPath) {
        astPath.traverse({
          ClassMethod (astPath) {
            if (astPath.get('key').isIdentifier({name: 'render'})) {
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
            if (astPath.get('key').isIdentifier({name: 'render'})) {
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

export default class RNPlugin {
  options: IRNPluginOptions
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

  constructor (options = {}) {
    this.options = defaults(options || {}, {
      buildAdapter: BUILD_TYPES.RN,
      nodeModulesPath: '',
      sourceDir: '',
      outputDir: '',
      designWidth: 750,
      commonChunks: ['runtime', 'vendors', 'taro', 'common'],
      isBuildPlugin: false,
      alias: {}
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

    // custom hooks
    compiler.hooks.getPages = new SyncHook(['pages'])

    // 开始读取 records 之前，钩入(hook into) compiler。
    compiler.hooks.run.tapAsync(
      PLUGIN_NAME,
      this.tryAsync(async (compiler: webpack.Compiler) => {
        await this.run(compiler)
      })
    )

    // 监听模式下，一个新的编译(compilation)触发之后，执行一个插件，但是是在实际编译开始之前。
    compiler.hooks.watchRun.tapAsync(
      PLUGIN_NAME,
      this.tryAsync(async (compiler: webpack.Compiler) => {
        const changedFiles = this.getChangedFiles(compiler)
        if (!changedFiles.length) {
          await this.run(compiler)
        } else {
          await this.watchRun(compiler, changedFiles)
        }
      })
    )

    compiler.hooks.compilation.tap(PLUGIN_NAME, (compilation, {normalModuleFactory}) => {
      compilation.hooks.finishModules.tap(PLUGIN_NAME, (modules) => {
        // console.log(modules)
      })
    })

    // 🤔️ 编译(compilation)创建之后，执行插件。 compilation.dependencyFactories？
    compiler.hooks.compilation.tap(PLUGIN_NAME, (compilation, {normalModuleFactory}) => {
      compilation.dependencyFactories.set(SingleEntryDependency, normalModuleFactory)
      compilation.dependencyFactories.set(TaroSingleEntryDependency, normalModuleFactory)
    })

    // 生成资源到 output 目录之前。
    compiler.hooks.emit.tapAsync(
      PLUGIN_NAME,
      this.tryAsync(async compilation => {
        compilation.errors = compilation.errors.concat(this.errors)
        // genetate template styles json 配置和 taroSelfComponents
        await this.generateMiniFiles(compilation)
        await this.generateStyleSheet(compilation)
        await this.generateRNEntry(compilation)
        this.addedComponents.clear()
      })
    )

    // 生成资源到 output 目录之后。
    compiler.hooks.afterEmit.tapAsync(
      PLUGIN_NAME,
      this.tryAsync(async compilation => {
        try {
          await this.addTarBarFilesToDependencies(compilation)
        } catch (e) {
          console.log(chalk.red(e))
        }
      })
    )

    new TaroLoadChunksPlugin({
      commonChunks: this.options.commonChunks,
      buildAdapter: this.options.buildAdapter,
      isBuildPlugin: this.options.isBuildPlugin,
      addChunkPages: this.options.addChunkPages
    }).apply(compiler)

    //🤔️ TaroSingleEntryDependency 映射到 TaroNormalModule
    new TaroNormalModulesPlugin().apply(compiler)
  }

  getChangedFiles (compiler) {
    const {watchFileSystem} = compiler
    const watcher = watchFileSystem.watcher || watchFileSystem.wfs.watcher

    return Object.keys(watcher.mtimes)
  }

  getAppEntry (compiler) {
    const {entry} = compiler.options
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
    // @ts-ignore
    const isTaroComponentRes = this.judgeFileToBeTaroComponent(code, component.path, adapter)
    if (isTaroComponentRes == null) {
      return null
    }
    const {isTaroComponent, transformResult} = isTaroComponentRes
    // @ts-ignore
    const isNativePageOrComponent = this.isNativePageOrComponent(this.getTemplatePath(component.path), fs.readFileSync(component.path).toString())
    if (isTaroComponent || isNativePageOrComponent) {
      return component.path
    }
    // @ts-ignore
    const componentName = component.name!.split('|')[1] || component.name
    const {ast} = transformResult
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
        if (astPath.get('callee').isIdentifier({name: 'require'})) {
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
    const {alias} = this.options
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
          // const code = fs.readFileSync(realComponentPath).toString()
          // const newComponent = Object.assign({}, component, {path: realComponentPath})
          // realComponentPath = this.getNpmComponentRealPath(code, newComponent, buildAdapter)
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

  getTabBarFiles (compiler: webpack.Compiler, appConfig) {
    const tabBar = appConfig.tabBar
    const {buildAdapter} = this.options
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
            isNative
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
          item.pages.forEach(page => {
            let pageItem = `${root}/${page}`
            pageItem = pageItem.replace(/\/{2,}/g, '/')
            let hasPageIn = false
            this.pages.forEach(({name}) => {
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
                isNative
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

  getPages (compiler: webpack.Compiler) {
    const {buildAdapter} = this.options
    const appEntry = this.appEntry
    const code = fs.readFileSync(appEntry).toString()
    try {
      const transformResult = getTransformResult({
        code,
        sourcePath: appEntry,
        sourceDir: this.sourceDir
      })
      // get appEntry configObj , inject pages , config
      // @ts-ignore
      const {configObj} = parseAst(transformResult.ast, buildAdapter)
      const appPages = configObj.pages
      this.appConfig = configObj
      if (!appPages || appPages.length === 0) {
        throw new Error('缺少页面')
      }
      if (!this.isWatch) {
        printLog(processTypeEnum.COMPILE, '发现入口', this.getShowPath(appEntry))
      }
      this.getSubPackages(configObj)
      this.getTabBarFiles(compiler, configObj)
      // const template = ''
      taroFileTypeMap[this.appEntry] = {
        type: PARSE_AST_TYPE.ENTRY,
        // config: configObj,
        // template,
        code: transformResult.code
      }
      this.pages = new Set([
        ...this.pages,
        ...appPages.map(item => {
          const pagePath = resolveScriptPath(path.join(this.sourceDir, item))
          const pageTemplatePath = this.getTemplatePath(pagePath)
          const isNative = this.isNativePageOrComponent(pageTemplatePath, fs.readFileSync(pagePath).toString())
          return {name: item, path: pagePath, isNative}
        })
      ])
      // pass page to TaroLoadChunksPlugin
      ;(compiler.hooks as any).getPages.call(this.pages)
    } catch (error) {
      console.log(chalk.red('in getPages', error.stack))
      throw error
      if (error.codeFrame) {
        this.errors.push(new Error(error.message + '\n' + error.codeFrame))
      } else {
        this.errors.push(error)
      }
    }
  }

  getPluginFiles (compiler) {
    const fileList = new Set<IComponent>()
    const {pluginConfig, buildAdapter} = this.options
    let normalFiles = new Set<IComponent>()
    Object.keys(this.appEntry).forEach(key => {
      const filePath = this.appEntry[key][0]
      const code = fs.readFileSync(filePath).toString()
      const isTaroComponentRes = this.judgeFileToBeTaroComponent(code, filePath, buildAdapter)
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
      } else {
        this.addEntry(compiler, item.path, item.name, PARSE_AST_TYPE.PAGE)
      }
    })
    // this.components.forEach(item => {
    //   if (item.isNative) {
    //     this.addEntry(compiler, item.path, item.name, PARSE_AST_TYPE.NORMAL)
    //   } else {
    //     this.addEntry(compiler, item.path, item.name, PARSE_AST_TYPE.COMPONENT)
    //   }
    // })
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
    const {buildAdapter} = this.options
    // const isQuickApp = buildAdapter === BUILD_TYPES.QUICKAPP
    fileList.forEach(file => {
      try {
        // const isNative = file.isNative
        // const isComponentConfig = isRoot ? {} : {component: true}

        let configObj
        let taroSelfComponents
        let depComponents
        // let template
        let code = fs.readFileSync(file.path).toString()
        // get ast and components
        const transformResult = getTransformResult({
          code,
          sourcePath: file.path,
          sourceDir: this.sourceDir,
          isRoot
        })
        const {alias} = this.options
        // replace alias to relative path
        transformResult.components = transformResult.components.map((item => {
          if (isAliasPath(item.path, alias)) {
            item.path = replaceAliasPath(file.path, item.path, alias)
          }
          return item
        }))
        // console.log('RNPlugin getComponents',transformResult.components)
        transformResult.components = transformResult.components.filter((item) => !isNpmPkg(item.path))
        // @ts-ignore
        let parseAstRes = parseAst(transformResult.ast, buildAdapter)
        configObj = parseAstRes.configObj
        if (isRoot) {
          const showPath = file.path.replace(this.sourceDir, '').replace(path.extname(file.path), '')
          this.pageConfigs.set(showPath, configObj)
        }
        taroSelfComponents = parseAstRes.taroSelfComponents
        const usingComponents = configObj.usingComponents
        if (usingComponents) {
          Object.keys(usingComponents).forEach(item => {
            // @ts-ignore
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
        // template = transformResult.template
        // code = transformResult.code
        depComponents = depComponents.filter(item => !/^plugin:\/\//.test(item.path))
        this.transformComponentsPath(file.path, depComponents)
        if (!this.isWatch) {
          printLog(processTypeEnum.COMPILE, isRoot ? '发现页面' : '发现组件', this.getShowPath(file.path))
        }
        taroFileTypeMap[file.path] = {
          type: isRoot ? PARSE_AST_TYPE.PAGE : PARSE_AST_TYPE.COMPONENT,
          // config: merge({}, isComponentConfig, buildUsingComponents(file.path, this.sourceDir, alias, depComponents), configObj),
          // template,
          code
        }
        // if (depComponents && depComponents.length) {
        //   depComponents.forEach(item => {
        //     const componentPath = resolveScriptPath(path.resolve(path.dirname(file.path), item.path))
        //     if (fs.existsSync(componentPath) && !Array.from(this.components).some(item => item.path === componentPath)) {
        //       const componentName = this.getComponentName(componentPath)
        //       const componentTempPath = this.getTemplatePath(componentPath)
        //       const isNative = this.isNativePageOrComponent(componentTempPath, fs.readFileSync(componentPath).toString())
        //       const componentObj = {name: componentName, path: componentPath, isNative}
        //       this.components.add(componentObj)
        //       this.addedComponents.add(componentObj)
        //       this.getComponents(compiler, new Set([componentObj]), false)
        //     }
        //   })
        // }
      } catch (error) {
        console.log(chalk.red(error.stack))
        if (error.codeFrame) {
          this.errors.push(new Error(error.message + '\n' + error.codeFrame))
        } else {
          this.errors.push(error)
        }
      }
    })
  }

  addEntry (compiler: webpack.Compiler, entryPath, entryName, entryType) {
    compiler.hooks.make.tapAsync(PLUGIN_NAME, (compilation: webpack.compilation.Compilation, callback) => {
      const dep = new TaroSingleEntryDependency(entryPath, entryName, {name: entryName}, entryType)
      compilation.addEntry(this.sourceDir, dep, entryName, callback)
    })
  }

  addEntries (compiler: webpack.Compiler) {
    this.addEntry(compiler, this.appEntry, 'app', PARSE_AST_TYPE.ENTRY)
    this.pages.forEach(item => {
      if (item.isNative) {
        this.addEntry(compiler, item.path, item.name, PARSE_AST_TYPE.NORMAL)
      } else {
        this.addEntry(compiler, item.path, item.name, PARSE_AST_TYPE.PAGE)
      }
    })
    // this.components.forEach(item => {
    //   if (item.isNative) {
    //     this.addEntry(compiler, item.path, item.name, PARSE_AST_TYPE.NORMAL)
    //   } else {
    //     this.addEntry(compiler, item.path, item.name, PARSE_AST_TYPE.COMPONENT)
    //   }
    // })
  }

  generateMiniFiles (compilation: webpack.compilation.Compilation) {
    // const isQuickApp = buildAdapter === BUILD_TYPES.QUICKAPP
    Object.keys(taroFileTypeMap).forEach(item => {
      // console.log('generateMiniFiles', taroFileTypeMap)
      const itemInfo = taroFileTypeMap[item]
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
  }

  generateRNEntry (compilation: webpack.compilation.Compilation) {
    const {appJson = {}} = this.options
    const appJsonObject = Object.assign({
      name: _.camelCase(require(path.join(process.cwd(), 'package.json')).name)
    }, appJson)
    const indexJsCode = `
    import {AppRegistry} from 'react-native';
    import App from './app.js';
    import {name as appName} from './app.json';
    AppRegistry.registerComponent(appName, () => App);`
    const indexJsonCode: string = JSON.stringify(appJsonObject, null, 2)
    const indexPath = 'index.js'
    const indexJsonPath = 'app.json'
    // cache
    if (generateFileCache[indexPath] && generateFileCache[indexPath].code === indexJsCode) return
    generateFileCache[indexPath] = {code: indexJsCode}
    compilation.assets[indexPath] = {
      size: () => indexJsCode.length,
      source: () => indexJsCode
    }
    compilation.assets[indexJsonPath] = {
      size: () => indexJsonCode.length,
      source: () => indexJsonCode
    }
    printLog(processTypeEnum.GENERATE, 'JSON', indexJsonPath)
    printLog(processTypeEnum.GENERATE, 'JS', indexPath)
  }

  generateStyleSheet (compilation: webpack.compilation.Compilation) {
    // emit 是异步 hook，使用 tapAsync 触及它，还可以使用 tapPromise/tap(同步)
    // console.log('generateStyleSheet', compilation.assets)
    Object.keys(compilation.assets).forEach(fileName => {
      const fileInfo = compilation.assets[fileName]
      if (!REG_STYLE.test(fileName)) return
      const relativePath = this.getRelativePath(fileName)
      // const extname = path.extname(fileName)
      // const styleSheetPath = relativePath.replace(extname, '_styles.js').replace(/\\/g, '/')
      const styleSheetPath = path.join(path.dirname(relativePath), 'index_styles.js')
      delete compilation.assets[fileName]
      const css = fileInfo.source()
      // cache
      if (generateFileCache[fileName] && generateFileCache[fileName].code === css) return
      generateFileCache[fileName] = {code: css}
      const styleSheetSource = compileStyle(css, relativePath)
      compilation.assets[styleSheetPath] = {
        size: () => styleSheetSource.length,
        source: () => styleSheetSource
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
    const {fileDependencies} = compilation
    this.tabBarIcons.forEach(icon => {
      if (!fileDependencies.has(icon)) {
        fileDependencies.add(icon)
      }
    })
  }

  transferFileContent (compiler: webpack.Compiler) {
    Object.keys(taroFileTypeMap).forEach(item => {
      const itemInfo = taroFileTypeMap[item]
      if (typeof itemInfo.code === 'string') {
        new VirtualModulePlugin({
          path: item,
          contents: itemInfo.code
        }).apply(compiler)
      }
    })
  }

  judgeFileToBeTaroComponent (
    code: string,
    sourcePath: string,
    buildAdapter: BUILD_TYPES
  ) {
    const isTaroComponentRes = isFileToBeTaroComponent(code, sourcePath, buildAdapter)
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
    if (!this.options.isBuildPlugin) {
      this.getPages(compiler)
      this.getComponents(compiler, this.pages, true)
      this.addEntries(compiler)
    } else {
      this.getPluginFiles(compiler)
    }
    this.transferFileContent(compiler)
  }

  watchRun (compiler: webpack.Compiler, changedFiles: string[]) {
    const changedFile = changedFiles[0]
    printLog(processTypeEnum.MODIFY, '文件变动', changedFile)
    this.isWatch = true
    if (REG_SCRIPTS.test(changedFile)) {
      this.changedFile = changedFile
      let {type, obj} = this.getChangedFileInfo(changedFile)
      this.errors = []
      if (!type) {
        const code = fs.readFileSync(changedFile).toString()
        const isTaroComponentRes = this.judgeFileToBeTaroComponent(code, changedFile, this.options.buildAdapter)
        if (isTaroComponentRes == null) {
          return
        }
        if (isTaroComponentRes.isTaroComponent) {
          type = PARSE_AST_TYPE.COMPONENT
          obj = {
            name: changedFile.replace(this.sourceDir, '').replace(path.extname(changedFile), ''),
            path: changedFile,
            isNative: this.isNativePageOrComponent(this.getTemplatePath(changedFile), code)
          }
        }
      }
      this.changedFileType = type
      if (this.changedFileType === PARSE_AST_TYPE.ENTRY
        || this.changedFileType === PARSE_AST_TYPE.PAGE
        || this.changedFileType === PARSE_AST_TYPE.COMPONENT) {
        // this.components.forEach(component => {
        //   if (component.path === changedFile) {
        //     this.components.delete(component)
        //   }
        // })
        if (this.changedFileType === PARSE_AST_TYPE.ENTRY) {
          this.run(compiler)
        } else {
          if (!this.options.isBuildPlugin) {
            this.getComponents(compiler, new Set([obj]), this.changedFileType === PARSE_AST_TYPE.PAGE)
            if (this.addedComponents.size) {
              // this.addedComponents.forEach(item => {
              //   if (item.isNative) {
              //     this.addEntry(compiler, item.path, item.name, PARSE_AST_TYPE.NORMAL)
              //   } else {
              //     this.addEntry(compiler, item.path, item.name, PARSE_AST_TYPE.COMPONENT)
              //   }
              // })
            }
          } else {
            this.getPluginFiles(compiler)
          }
          this.transferFileContent(compiler)
        }
        // if (obj && type === PARSE_AST_TYPE.COMPONENT && !this.components.has(obj)) {
        //   this.components.add(obj)
        // }
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
    // this.components.forEach(component => {
    //   if (component.path === filePath) {
    //     type = PARSE_AST_TYPE.COMPONENT
    //     obj = component
    //   }
    // })
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
