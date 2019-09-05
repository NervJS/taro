
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
import { Config as IConfig } from '@tarojs/taro'

import { REG_TYPESCRIPT, BUILD_TYPES, PARSE_AST_TYPE, MINI_APP_FILES, NODE_MODULES_REG, CONFIG_MAP, taroJsFramework } from '../utils/constants'
import { IComponentObj } from '../utils/types'
import { traverseObjectNode, resolveScriptPath, buildUsingComponents, isNpmPkg, resolveNpmSync, isEmptyObject } from '../utils'
import TaroSingleEntryDependency from '../dependencies/TaroSingleEntryDependency'

import TaroLoadChunksPlugin from './TaroLoadChunksPlugin'
import TaroNormalModulesPlugin from './TaroNormalModulesPlugin'
import VirtualModulePlugin from './VirtualModulePlugin/VirtualModulePlugin'

interface IMiniPluginOptions {
  appEntry?: string,
  buildAdapter: BUILD_TYPES,
  commonChunks: string[]
}

export interface ITaroFileInfo {
  [key: string]: {
    type: PARSE_AST_TYPE,
    config: IConfig,
    template?: string,
    code?: string
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
    new LoaderTargetPlugin('web').apply(compiler)
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
  context: string

  constructor (options = {}) {
    this.options = defaults(options || {}, {
      buildAdapter: BUILD_TYPES.WEAPP,
      commonChunks: ['runtime', 'vendors']
    })

    this.pages = new Set()
    this.components = new Set()
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
        this.run(compiler)
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
      taroFileTypeMap
    }).apply(compiler)

    new TaroNormalModulesPlugin().apply(compiler)
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
    this.sourceDir = path.dirname(appEntryPath)
    compiler.options.entry = {}
    return appEntryPath
  }

  parseAst (
    ast: t.File,
    buildAdapter: BUILD_TYPES
  ): {
    configObj: IConfig
  } {
    let configObj = {}
    traverse(ast, {
      ClassDeclaration (astPath) {
        const node = astPath.node
        let hasCreateData = false
        if (node.superClass) {
          astPath.traverse({
            ClassMethod (astPath) {
              if (astPath.get('key').isIdentifier({ name: '_createData' })) {
                hasCreateData = true
              }
            }
          })
          if (hasCreateData) {
            astPath.traverse({
              ClassMethod (astPath) {
                const node = astPath.node
                if (node.kind === 'constructor') {
                  astPath.traverse({
                    ExpressionStatement (astPath) {
                      const node = astPath.node
                      if (node.expression &&
                        node.expression.type === 'AssignmentExpression' &&
                        node.expression.operator === '=') {
                        const left = node.expression.left
                        if (left.type === 'MemberExpression' &&
                          left.object.type === 'ThisExpression' &&
                          left.property.type === 'Identifier' &&
                          left.property.name === 'config') {
                          configObj = traverseObjectNode(node.expression.right, buildAdapter)
                        }
                      }
                    }
                  })
                }
              }
            })
          }
        }
      },
      ClassProperty (astPath) {
        const node = astPath.node
        const keyName = node.key.name
        if (keyName === 'config') {
          configObj = traverseObjectNode(node, buildAdapter)
        }
      }
    })

    return {
      configObj
    }
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
    const { configObj } = this.parseAst(transformResult.ast, buildAdapter)
    const appPages = configObj.pages
    if (!appPages || appPages.length === 0) {
      throw new Error('缺少页面')
    }
    this.getSubPackages(configObj)
    this.generateTabBarFiles(compiler, configObj)
    taroFileTypeMap[this.appEntry] = {
      type: PARSE_AST_TYPE.ENTRY,
      config: configObj,
      template: transformResult.template,
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

  getComponents (fileList: Set<IComponent>, isRoot: boolean) {
    const { buildAdapter } = this.options
    fileList.forEach(file => {
      const isNative = file.isNative
      const isComponentConfig = isRoot ? {} : { component: true }

      let configObj
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
        const transformResult = wxTransformer({
          code,
          sourcePath: file.path,
          isTyped: REG_TYPESCRIPT.test(file.path),
          isRoot,
          adapter: buildAdapter
        })
        configObj = this.parseAst(transformResult.ast, buildAdapter).configObj
        const usingComponents = configObj.usingComponents
        if (usingComponents) {
          Object.keys(usingComponents).forEach(item => {
            transformResult.components.push({
              name: item,
              path: usingComponents[item]
            })
          })
        }
        depComponents = transformResult.components
        template = transformResult.template
        code = transformResult.code
      }
      depComponents = depComponents.filter(item => !/^plugin:\/\//.test(item.path))
      this.transfromComponentsPath(depComponents)
      taroFileTypeMap[file.path] = {
        type: isRoot ? PARSE_AST_TYPE.PAGE : PARSE_AST_TYPE.COMPONENT,
        config: merge({}, isComponentConfig, buildUsingComponents(file.path, this.sourceDir, {}, depComponents), configObj),
        template,
        code
      }

      if (depComponents && depComponents.length) {
        depComponents.forEach(item => {
          const componentPath = resolveScriptPath(path.resolve(path.dirname(file.path), item.path))
          if (fs.existsSync(componentPath) && !Array.from(this.components).some(item => item.path === componentPath)) {
            let componentName
            if (NODE_MODULES_REG.test(componentPath)) {
              componentName = componentPath.replace(this.context, '').replace(/\\/g, '/').replace(path.extname(componentPath), '')
              componentName = componentName.replace(/node_modules/gi, 'npm')
            } else {
              componentName = componentPath.replace(this.sourceDir, '').replace(/\\/g, '/').replace(path.extname(componentPath), '')
            }
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
      const itemInfo = taroFileTypeMap[item]
      if (itemInfo.type !== PARSE_AST_TYPE.ENTRY) {
        compilation.assets[templatePath] = {
          size: () => itemInfo.template!.length,
          source: () => itemInfo.template
        }
      }
      const jsonStr = JSON.stringify(itemInfo.config)
      compilation.assets[jsonPath] = {
        size: () => jsonStr.length,
        source: () => jsonStr
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
