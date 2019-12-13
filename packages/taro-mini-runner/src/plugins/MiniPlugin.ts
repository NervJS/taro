
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

import { REG_TYPESCRIPT, BUILD_TYPES, PARSE_AST_TYPE, MINI_APP_FILES, NODE_MODULES_REG, CONFIG_MAP, taroJsFramework, REG_SCRIPTS } from '../utils/constants'
import { IComponentObj } from '../utils/types'
import { resolveScriptPath, buildUsingComponents, isNpmPkg, resolveNpmSync, isEmptyObject, promoteRelativePath } from '../utils'
import TaroSingleEntryDependency from '../dependencies/TaroSingleEntryDependency'
import { getTaroJsQuickAppComponentsPath, generateQuickAppUx, getImportTaroSelfComponents, generateQuickAppManifest } from '../utils/helper'
import parseAst from '../utils/parseAst'

import TaroLoadChunksPlugin from './TaroLoadChunksPlugin'
import TaroNormalModulesPlugin from './TaroNormalModulesPlugin'
import VirtualModulePlugin from './VirtualModulePlugin/VirtualModulePlugin'

interface IMiniPluginOptions {
  appEntry?: string,
  buildAdapter: BUILD_TYPES,
  nodeModulesPath: string,
  sourceDir: string,
  outputDir: string,
  quickappJSON?: any,
  designWidth: number,
  commonChunks: string[]
}

export interface ITaroFileInfo {
  [key: string]: {
    type: PARSE_AST_TYPE,
    config: IConfig,
    template?: string,
    code?: string,
    taroSelfComponents?: Set<{
      name: string,
      path: string
    }>
  }
}

interface IComponent { name: string, path: string, isNative: boolean }

const PLUGIN_NAME = 'MiniPlugin'

const taroFileTypeMap: ITaroFileInfo = {}

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
  buildAdapter: BUILD_TYPES
) {
  const transformResult = wxTransformer({
    code,
    sourcePath: sourcePath,
    isTyped: REG_TYPESCRIPT.test(sourcePath),
    adapter: buildAdapter,
    isNormal: true
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

  constructor (options = {}) {
    this.options = defaults(options || {}, {
      buildAdapter: BUILD_TYPES.WEAPP,
      nodeModulesPath: '',
      sourceDir: '',
      outputDir: '',
      designWidth: 750,
      commonChunks: ['runtime', 'vendors']
    })
    this.sourceDir = this.options.sourceDir
    this.outputDir = this.options.outputDir

    this.pages = new Set()
    this.components = new Set()
    this.pageConfigs = new Map()
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
			})
    )

    compiler.hooks.compilation.tap(PLUGIN_NAME, (compilation, { normalModuleFactory }) => {
      compilation.dependencyFactories.set(SingleEntryDependency, normalModuleFactory)
      compilation.dependencyFactories.set(TaroSingleEntryDependency, normalModuleFactory)
    })

    compiler.hooks.emit.tapAsync(
      PLUGIN_NAME,
      this.tryAsync(async compilation => {
        await this.generateMiniFiles(compilation)
      })
    )

    new TaroLoadChunksPlugin({
      commonChunks: this.options.commonChunks,
      buildAdapter: this.options.buildAdapter
    }).apply(compiler)

    new TaroNormalModulesPlugin().apply(compiler)
  }

  getChangedFiles (compiler) {
    const { watchFileSystem } = compiler;
    const watcher = watchFileSystem.watcher || watchFileSystem.wfs.watcher;

    return Object.keys(watcher.mtimes)
  }

  getAppEntry (compiler) {
    if (this.options.appEntry) {
      return this.options.appEntry
    }
    const { entry } = compiler.options
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
    const { isTaroComponent, transformResult } = isFileToBeTaroComponent(code, component.path as string, adapter)
    if (isTaroComponent) {
      return component.path
    }
    const { ast } = transformResult
    traverse(ast, {
      ExportNamedDeclaration (astPath) {
        const node = astPath.node
        const specifiers = node.specifiers
        const source = node.source
        if (source && source.type === 'StringLiteral') {
          specifiers.forEach(specifier => {
            const exported = specifier.exported
            if (kebabCase(exported.name) === component.name) {
              componentRealPath = resolveScriptPath(path.resolve(path.dirname(component.path as string), source.value))
            }
          })
        } else {
          specifiers.forEach(specifier => {
            const exported = specifier.exported
            if (kebabCase(exported.name) === component.name) {
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

  transfromComponentsPath (components: IComponentObj[]) {
    const { buildAdapter } = this.options
    components.forEach(component => {
      const componentPath = component.path
      if (componentPath && isNpmPkg(componentPath)) {
        const res = resolveNpmSync(componentPath, this.context)
        const code = fs.readFileSync(res).toString()
        const newComponent = Object.assign({}, component, { path: res })
        const realComponentPath = this.getNpmComponentRealPath(code, newComponent, buildAdapter)
        component.path = realComponentPath
      }
    })
  }

  generateTabBarFiles (compiler, appConfig) {
    const tabBar = appConfig.tabBar
    const { buildAdapter } = this.options
    if (tabBar && typeof tabBar === 'object' && !isEmptyObject(tabBar)) {
      const {
        list: listConfig,
        iconPath: pathConfig,
        selectedIconPath: selectedPathConfig
      } = CONFIG_MAP[buildAdapter]

      const list = tabBar[listConfig] || []
      let tabBarIcons: string[] = []
      list.forEach(item => {
        item[pathConfig] && tabBarIcons.push(item[pathConfig])
        item[selectedPathConfig] && tabBarIcons.push(item[selectedPathConfig])
      })
      tabBarIcons.map(item => {
        const itemPath = path.resolve(this.sourceDir, item)
        this.addEntry(compiler, itemPath, item, PARSE_AST_TYPE.STATIC)
      })
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
            this.pages.forEach(({ name }) => {
              if (name === pageItem) {
                hasPageIn = true
              }
            })
            if (!hasPageIn) {
              const pagePath = resolveScriptPath(path.join(this.sourceDir, pageItem))
              const templatePath = this.getTemplatePath(pagePath)
              const isNative = this.isNativePageORComponent(templatePath, fs.readFileSync(pagePath).toString())
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

  getPages (compiler) {
    const { buildAdapter } = this.options
    const appEntry = this.appEntry
    const code = fs.readFileSync(appEntry).toString()
    const transformResult = wxTransformer({
      code,
      sourcePath: appEntry,
      isTyped: REG_TYPESCRIPT.test(appEntry),
      isApp: true,
      adapter: buildAdapter
    })
    const { configObj } = parseAst(transformResult.ast, buildAdapter)
    const appPages = configObj.pages
    this.appConfig = configObj
    if (!appPages || appPages.length === 0) {
      throw new Error('缺少页面')
    }
    this.getSubPackages(configObj)
    this.generateTabBarFiles(compiler, configObj)
    const template = ''
    taroFileTypeMap[this.appEntry] = {
      type: PARSE_AST_TYPE.ENTRY,
      config: configObj,
      template,
      code: transformResult.code
    }
    this.pages = new Set([
      ...appPages.map(item => {
        const pagePath = resolveScriptPath(path.join(this.sourceDir, item))
        const pageTemplatePath = this.getTemplatePath(pagePath)
        const isNative = this.isNativePageORComponent(pageTemplatePath, fs.readFileSync(pagePath).toString())
        return { name: item, path: pagePath, isNative }
      })
    ])
  }

  isNativePageORComponent (templatePath, jsContent) {
    return fs.existsSync(templatePath) && jsContent.indexOf(taroJsFramework) < 0
  }

  getComponentName (componentPath) {
    let componentName
    if (NODE_MODULES_REG.test(componentPath)) {
      componentName = componentPath.replace(this.context, '').replace(/\\/g, '/').replace(path.extname(componentPath), '')
      componentName = componentName.replace(/node_modules/gi, 'npm')
    } else {
      componentName = componentPath.replace(this.sourceDir, '').replace(/\\/g, '/').replace(path.extname(componentPath), '')
    }

    return componentName.replace(/^(\/|\\)/, '')
  }

  getComponents (fileList: Set<IComponent>, isRoot: boolean) {
    const { buildAdapter } = this.options
    const isQuickApp = buildAdapter === BUILD_TYPES.QUICKAPP
    fileList.forEach(file => {
      const isNative = file.isNative
      const isComponentConfig = isRoot ? {} : { component: true }

      let configObj
      let taroSelfComponents
      let depComponents
      let template
      let code = fs.readFileSync(file.path).toString()
      if (isNative) {
        const templatePath = this.getTemplatePath(file.path)
        const configPath = this.getConfigPath(file.path)
        if (fs.existsSync(templatePath)) {
          template = fs.readFileSync(templatePath).toString()
        }
        if (fs.existsSync(configPath)) {
          configObj = JSON.parse(fs.readFileSync(configPath).toString())
          const usingComponents = configObj.usingComponents
          depComponents = usingComponents ? Object.keys(usingComponents).map(item => ({
            name: item,
            path: usingComponents[item]
          })) : []
        }
      } else {
        const rootProps: { [key: string]: any } = {}
        if (isQuickApp && isRoot) {
          // 如果是快应用，需要提前解析一次 ast，获取 config
          const aheadTransformResult = wxTransformer({
            code,
            sourcePath: file.path,
            isRoot,
            isTyped: REG_TYPESCRIPT.test(file.path),
            adapter: buildAdapter
          })
          const res = parseAst(aheadTransformResult.ast, buildAdapter)
          if (res.configObj.enablePullDownRefresh || (this.appConfig.window && this.appConfig.window.enablePullDownRefresh)) {
            rootProps.enablePullDownRefresh = true
          }
          if (this.appConfig.tabBar) {
            rootProps.tabBar = this.appConfig.tabBar
          }
          rootProps.pagePath = file.path.replace(this.sourceDir, '').replace(path.extname(file.path), '')
          if (res.hasEnablePageScroll) {
            rootProps.enablePageScroll = true
          }
        }
        const transformResult = wxTransformer({
          code,
          sourcePath: file.path,
          isTyped: REG_TYPESCRIPT.test(file.path),
          isRoot,
          rootProps: isEmptyObject(rootProps) || rootProps,
          adapter: buildAdapter
        })
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
        template = transformResult.template
        code = transformResult.code
      }
      depComponents = depComponents.filter(item => !/^plugin:\/\//.test(item.path))
      this.transfromComponentsPath(depComponents)
      if (isQuickApp) {
        const scriptPath = file.path
        const outputScriptPath = scriptPath.replace(this.sourceDir, this.outputDir).replace(path.extname(scriptPath), MINI_APP_FILES[buildAdapter].SCRIPT)
        const importTaroSelfComponents = getImportTaroSelfComponents(outputScriptPath, this.options.nodeModulesPath, this.outputDir, taroSelfComponents)
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
        const importCustomComponents = new Set(depComponents.map(item => {
          return {
            path: item.path,
            name: item.name as string
          }
        }))
        template = generateQuickAppUx({
          template,
          imports: new Set([...importTaroSelfComponents, ...importUsingComponent, ...importCustomComponents])
        })
      }
      taroFileTypeMap[file.path] = {
        type: isRoot ? PARSE_AST_TYPE.PAGE : PARSE_AST_TYPE.COMPONENT,
        config: merge({}, isComponentConfig, buildUsingComponents(file.path, this.sourceDir, {}, depComponents), configObj),
        template,
        code
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
        depComponents.forEach(item => {
          const componentPath = resolveScriptPath(path.resolve(path.dirname(file.path), item.path))
          if (fs.existsSync(componentPath) && !Array.from(this.components).some(item => item.path === componentPath)) {
            const componentName = this.getComponentName(componentPath)
            const componentTempPath = this.getTemplatePath(componentPath)
            const isNative = this.isNativePageORComponent(componentTempPath, fs.readFileSync(componentPath).toString())
            const componentObj = { name: componentName, path: componentPath, isNative }
            this.components.add(componentObj)
            this.getComponents(new Set([componentObj]), false)
          }
        })
      }
    })
  }

  addEntry (compiler: webpack.Compiler, entryPath, entryName, entryType) {
    compiler.hooks.make.tapAsync(PLUGIN_NAME, (compilation: webpack.compilation.Compilation, callback) => {
      const dep = new TaroSingleEntryDependency(entryPath, entryName, { name: entryName }, entryType)
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
    this.components.forEach(item => {
      if (item.isNative) {
        this.addEntry(compiler, item.path, item.name, PARSE_AST_TYPE.NORMAL)
      } else {
        this.addEntry(compiler, item.path, item.name, PARSE_AST_TYPE.COMPONENT)
      }
    })
  }

  generateMiniFiles (compilation: webpack.compilation.Compilation) {
    const { buildAdapter } = this.options
    const isQuickApp = buildAdapter === BUILD_TYPES.QUICKAPP
    Object.keys(taroFileTypeMap).forEach(item => {
      let relativePath
      if (NODE_MODULES_REG.test(item)) {
        relativePath = item.replace(this.context, '').replace(/node_modules/gi, 'npm')
      } else {
        relativePath = item.replace(this.sourceDir, '')
      }
      const extname = path.extname(item)
      const templatePath = relativePath.replace(extname, MINI_APP_FILES[buildAdapter].TEMPL)
      const jsonPath = relativePath.replace(extname, MINI_APP_FILES[buildAdapter].CONFIG)
      const scriptPath = relativePath.replace(extname, MINI_APP_FILES[buildAdapter].SCRIPT)
      const stylePath = relativePath.replace(extname, MINI_APP_FILES[buildAdapter].STYLE)
      const itemInfo = taroFileTypeMap[item]
      let template = itemInfo.template
      if (!isQuickApp) {
        const jsonStr = JSON.stringify(itemInfo.config)
        compilation.assets[jsonPath] = {
          size: () => jsonStr.length,
          source: () => jsonStr
        }
      } else {
        let hitScriptItem
        Object.keys(compilation.assets).forEach(item => {
          if (stylePath.indexOf(item) >= 0) {
            const relativeStylePath = promoteRelativePath(path.relative(scriptPath, stylePath))
            template = `<style src='${relativeStylePath}'></style>\n` + template
          }
          if (scriptPath.indexOf(item) >= 0) {
            let scriptContent = compilation.assets[item]._source.source()
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
        const quickappJSONStr = JSON.stringify(quickappJSON)
        compilation.assets['./manifest.json'] = {
          size: () => quickappJSONStr.length,
          source: () => quickappJSONStr
        }
      }
      if (template && (!this.changedFile || this.changedFile === item)) {
        compilation.assets[templatePath] = {
          size: () => template!.length,
          source: () => template
        }
      }
      if (itemInfo.taroSelfComponents) {
        itemInfo.taroSelfComponents.forEach(item => {
          if (fs.existsSync(item.path)) {
            const content = fs.readFileSync(item.path).toString()
            let relativePath
            if (NODE_MODULES_REG.test(item.path)) {
              relativePath = item.path.replace(this.context, '').replace(/node_modules/gi, 'npm')
            } else {
              relativePath = item.path.replace(this.sourceDir, '')
            }
            compilation.assets[relativePath] = {
              size: () => content.length,
              source: () => content
            }
          }
        })
      }
    })
  }

  transferFileContent (compiler: webpack.Compiler) {
    Object.keys(taroFileTypeMap).forEach(item => {
      const relativePath = item.replace(compiler.context, '')
      const itemInfo = taroFileTypeMap[item]
      new VirtualModulePlugin({
        moduleName: relativePath,
        contents: itemInfo.code
      }).apply(compiler)
    })
  }

  run (compiler: webpack.Compiler) {
    this.getPages(compiler)
    this.getComponents(this.pages, true)
    this.addEntries(compiler)
    this.transferFileContent(compiler)
  }

  watchRun (compiler: webpack.Compiler, changedFiles: string[]) {
    const changedFile = changedFiles[0]
    if (REG_SCRIPTS.test(changedFile)) {
      this.changedFile = changedFile
      this.run(compiler)
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
}
