import * as path from 'path'
import * as fs from 'fs-extra'

import * as wxTransformer from '@tarojs/transformer-wx'
import * as webpack from 'webpack'
import * as SingleEntryPlugin from 'webpack/lib/SingleEntryPlugin'
import * as FunctionModulePlugin from 'webpack/lib/FunctionModulePlugin'
import * as NodeSourcePlugin from 'webpack/lib/node/NodeSourcePlugin'
import * as JsonpTemplatePlugin from 'webpack/lib/JsonpTemplatePlugin'
import * as LoaderTargetPlugin from 'webpack/lib/LoaderTargetPlugin'
import { defaults } from 'lodash'
import * as t from 'babel-types'
import traverse from 'babel-traverse'
import { Config as IConfig } from '@tarojs/taro'

import { REG_TYPESCRIPT, BUILD_TYPES } from '../utils/constants'
import { traverseObjectNode, resolveScriptPath } from '../utils'

interface IMiniPluginOptions {
  appEntry?: string,
  buildAdapter: BUILD_TYPES
}

interface IComponent { name: string, path: string }

const PLUGIN_NAME = 'MiniPlugin'

const taroFileTypeMap = {}

export enum TARO_FILE_TYPE {
  APP = 'APP',
  PAGE = 'PAGE',
  COMPONENT = 'COMPONENT'
}

export const createTarget = function createTarget(name) {
	const target = compiler => {
		const { options } = compiler
		compiler.apply(
			new JsonpTemplatePlugin(options.output),
			new FunctionModulePlugin(options.output),
			new NodeSourcePlugin(options.node),
			new LoaderTargetPlugin('web')
		)
	}

	const creater = new Function(
		`var t = arguments[0]; return function ${name}(c) { return t(c); }`
	);
	return creater(target)
}

export const Targets = {
  [BUILD_TYPES.WEAPP]: createTarget(BUILD_TYPES.WEAPP),
  [BUILD_TYPES.ALIPAY]: createTarget(BUILD_TYPES.ALIPAY),
  [BUILD_TYPES.SWAN]: createTarget(BUILD_TYPES.SWAN),
  [BUILD_TYPES.TT]: createTarget(BUILD_TYPES.TT),
  [BUILD_TYPES.QQ]: createTarget(BUILD_TYPES.QQ),
}

export default class MiniPlugin {
  options: IMiniPluginOptions
  appEntry: string
  pages: Set<IComponent>
  components: Set<IComponent>
  sourceDir: string

  constructor (options = {}) {
    this.options = defaults(options || {}, {
      buildAdapter: BUILD_TYPES.WEAPP,
      commonLibName: 'lib.js'
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

  apply (compiler: webpack.Compiler) {
    compiler.hooks.run.tapAsync(
			PLUGIN_NAME,
			this.tryAsync(async (compiler: webpack.Compiler) => {
				await this.run(compiler)
			})
    )
  }

  getAppEntry (compiler) {
    if (this.options.appEntry) {
      return this.options.appEntry
    }
    const { entry } = compiler.options
    function getEntryPath (entry) {
      if (Array.isArray(entry)) {
        return entry.map(item => getEntryPath[item]).find(item => item)
      }
      if (typeof entry === 'object') {
        return entry['app']
      }
      return entry
    }
    const appEntryPath = getEntryPath(entry)
    this.sourceDir = path.dirname(appEntryPath)
    taroFileTypeMap[appEntryPath] = TARO_FILE_TYPE.APP
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

  getPages () {
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
    this.pages = new Set([
      ...appPages.map(item => {
        const pagePath = resolveScriptPath(path.join(this.sourceDir, item))
        taroFileTypeMap[pagePath] = TARO_FILE_TYPE.PAGE
        return { name: item, path: pagePath }
      })
    ])
  }

  getComponents (fileList: Set<IComponent>, isRoot: boolean) {
    const { buildAdapter } = this.options
    fileList.forEach(file => {
      const code = fs.readFileSync(file.path).toString()
      const transformResult = wxTransformer({
        code,
        sourcePath: file.path,
        isTyped: REG_TYPESCRIPT.test(file.path),
        isRoot,
        adapter: buildAdapter
      })

      let depComponents = transformResult.components
      if (depComponents && depComponents.length) {
        depComponents.forEach(item => {
          const componentPath = resolveScriptPath(path.resolve(path.dirname(file.path), item.path))
          if (fs.existsSync(componentPath) && !Array.from(this.components).some(item => item.path === componentPath)) {
            taroFileTypeMap[componentPath] = TARO_FILE_TYPE.COMPONENT
            const componentName = componentPath.replace(this.sourceDir, '').replace(/\\/g, '/').replace(path.extname(componentPath), '')
            const componentObj = { name: componentName, path: componentPath }
            this.components.add(componentObj)
            this.getComponents(new Set([componentObj]), false)
          }
        })
      }
    })
  }

  addEntries (compiler: webpack.Compiler) {
    const mainFiles = new Set([ ...this.pages, ...this.components ])
    mainFiles.add({
      name: 'app',
      path: this.appEntry
    })
    mainFiles.forEach(item => {
      compiler.hooks.make.tapAsync(PLUGIN_NAME, (compilation: webpack.compilation.Compilation, callback) => {
        const dep = SingleEntryPlugin.createDependency(item.path, item.name)
        compilation.addEntry(this.sourceDir, dep, item.name, callback)
      })
    })
  }

  run (compiler: webpack.Compiler) {
    this.appEntry = this.getAppEntry(compiler)
    this.getPages()
    this.getComponents(this.pages, true)
    this.addEntries(compiler)
  }

  static getTaroFileTypeMap () {
    return taroFileTypeMap
  }
}
