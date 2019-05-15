import * as path from 'path'
import * as fs from 'fs-extra'

import * as wxTransformer from '@tarojs/transformer-wx'
import * as webpack from 'webpack'
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

const PLUGIN_NAME = 'MiniPlugin'

export default class MiniPlugin {
  options: IMiniPluginOptions
  appEntry: string
  pages: Set<string>
  components: Set<string>
  sourceDir: string

  constructor (options = {}) {
    this.options = defaults(options || {}, {
      buildAdapter: BUILD_TYPES.WEAPP
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
    this.pages = new Set([...appPages.map(item => resolveScriptPath(path.join(this.sourceDir, item)))])
  }

  getComponents (fileList: Set<string>, isRoot: boolean) {
    const { buildAdapter } = this.options
    fileList.forEach(file => {
      const code = fs.readFileSync(file).toString()
      const transformResult = wxTransformer({
        code,
        sourcePath: file,
        isTyped: REG_TYPESCRIPT.test(file),
        isRoot,
        adapter: buildAdapter
      })
      let depComponents = transformResult.components
      if (depComponents && depComponents.length) {
        depComponents.forEach(item => {
          const componentPath = resolveScriptPath(path.resolve(path.dirname(file), item.path))
          if (fs.existsSync(componentPath)) {
            this.components.add(componentPath)
            this.getComponents(new Set([componentPath]), false)
          }
        })
      }
    })
  }

  run (compiler: webpack.Compiler) {
    this.appEntry = this.getAppEntry(compiler)
    this.getPages()
    this.getComponents(this.pages, true)
  }
}
