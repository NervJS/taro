import { transformSync } from '@babel/core'
import { SCRIPT_EXT } from '@tarojs/helper'

import type * as BabelCore from '@babel/core'
import type { PluginOption } from 'vite'
import type Harmony from '..'

export default function (this: Harmony): PluginOption {
  const that = this
  const packageName = '@tarojs/taro'
  const bindingName = 'Taro'
  const businessId = that.getConfig().defineConstants?.LOCATION_APIKEY?.replace(/^['"]|['"]$/g, '')

  return {
    name: 'taro:vite-add-method-env',
    async transform (code, id) {
      const pluginContext = this
      const { runnerUtils } = that.context
      const { getViteHarmonyCompilerContext } = runnerUtils
      const compiler = await getViteHarmonyCompilerContext(pluginContext)
      const exts = Array.from(new Set(compiler?.frameworkExts.concat(SCRIPT_EXT)))
      if (!exts.some(ext => id?.split('?')[0].endsWith(ext))) {
        return
      }
      let taroName = bindingName
      let imported = false
      const methodName = ['getLocation']

      const result = transformSync(code, {
        filename: id,
        plugins: [
          (babel: typeof BabelCore): BabelCore.PluginObj<BabelCore.PluginPass> => {
            const { types: t } = babel
            return {
              visitor: {
                Program: {
                  enter: (ast) => {
                    taroName = ast.scope.getBinding(bindingName)
                      ? ast.scope.generateUid(bindingName)
                      : bindingName
                  }
                },
                ImportDeclaration(ast) {
                  if (ast.node.source.value !== packageName) return

                  imported = true
                  ast.node.specifiers.forEach(spec => {
                    if (t.isImportDefaultSpecifier(spec)) {
                      taroName = spec.local.name
                    } else if (t.isImportSpecifier(spec)) {
                      const { imported } = spec
                      const propertyName = t.isIdentifier(imported) ? imported.name : imported.value
                      if (methodName.includes(propertyName)) {
                        // Note: 记录当前导入的方法别名
                        methodName.push(spec.local.name)
                      }
                    }
                  })
                },
                CallExpression(path) {
                  if (!imported) return

                  if (!t.isIdentifier(path.node.callee) || !methodName.includes(path.node.callee.name)) return
                  const args = path.node.arguments[0]
                  if (t.isObjectExpression(args)) {
                    const hasBusinessId = args.properties.some(
                      prop => !t.isSpreadElement(prop) && t.isIdentifier(prop.key) && prop.key.name === 'businessId'
                    )

                    if (!hasBusinessId) {
                      if (!businessId) {
                        console.warn(`Error: 使用定位相关 API(${path.node.callee.name}) 时，需要配置 defineConstants.LOCATION_APIKEY 为 businessId.`)
                        return
                      }
                      args.properties.push(
                        t.objectProperty(t.identifier('businessId'), t.stringLiteral(businessId))
                      )
                    }
                  }
                },
                MemberExpression(path) {
                  if (!imported) return

                  if (t.isIdentifier(path.node.object) && path.node.object.name === taroName) {
                    if (t.isIdentifier(path.node.property) && methodName.includes(path.node.property.name)) {
                      const parent = path.findParent(p => p.isCallExpression())
                      if (parent && t.isCallExpression(parent.node)) {
                        const args = parent.node.arguments[0]
                        if (t.isObjectExpression(args)) {
                          const hasBusinessId = args.properties.some(
                            prop => !t.isSpreadElement(prop) && t.isIdentifier(prop.key) && prop.key.name === 'businessId'
                          )

                          if (!hasBusinessId) {
                            if (!businessId) {
                              console.warn(`Error: 使用定位相关 API(${path.node.property.name}) 时，需要配置 defineConstants.LOCATION_APIKEY 为 businessId.`)
                              return
                            }
                            args.properties.push(
                              t.objectProperty(t.identifier('businessId'), t.stringLiteral(businessId))
                            )
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        ],
        sourceType: 'module'
      })

      return {
        code: result?.code || code,
        map: result?.map || null,
      }
    }
  }
}
