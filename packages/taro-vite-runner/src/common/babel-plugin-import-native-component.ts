import { resolveMainFilePath } from '@tarojs/helper'
import path from 'path'

import type * as BabelCore from '@babel/core'
import type { ViteHarmonyCompilerContext, ViteMiniCompilerContext } from '@tarojs/taro/types/compile/viteCompilerContext'

const IMPORT_COMPONENT_NAME = 'importNativeComponent'

type TCallback = (path: string | false, name?: string, exportName?: string) => string
export default (compiler: ViteHarmonyCompilerContext | ViteMiniCompilerContext, id: string, cb: TCallback) => {
  return function pluginImportNativeComponent (babel: typeof BabelCore): BabelCore.PluginObj<BabelCore.PluginPass> {
    const t = babel.types
    let enableImportComponent = true

    return {
      name: 'plugin:import-native-component',
      visitor: {
        CallExpression(ast) {
          // 识别所有 importNativeComponent 函数调用, 并替换为对应的组件名
          if (t.isIdentifier(ast.node.callee, { name: IMPORT_COMPONENT_NAME })) {
            const pathArg = resolveMainFilePath(
              path.resolve(
                path.dirname(id),
                compiler.resolvePageImportPath(id, t.isStringLiteral(ast.node.arguments[0]) ? ast.node.arguments[0].value : '')
              )
            )
            const nameArg = t.isStringLiteral(ast.node.arguments[1]) ? ast.node.arguments[1].value : ''
            const exportNameArg = t.isStringLiteral(ast.node.arguments[2]) ? ast.node.arguments[2].value : 'default'

            if (enableImportComponent) {
              const nativeName = cb(pathArg, nameArg, exportNameArg)
              ast.replaceWith(t.stringLiteral(nativeName))
            }
          }
        },
        FunctionDeclaration(ast) {
          if (t.isIdentifier(ast.node.id, { name: IMPORT_COMPONENT_NAME })) {
            enableImportComponent = false
            cb(false)
          }
        },
        ImportDeclaration(ast) {
          ast.node.specifiers.forEach(specifier => {
            if (
              (t.isImportSpecifier(specifier) || t.isImportDefaultSpecifier(specifier)) &&
                        specifier.local.name === IMPORT_COMPONENT_NAME
            ) {
              enableImportComponent = false
              cb(false)
            }
          })
        },
        VariableDeclarator(ast) {
          if (
            t.isIdentifier(ast.node.id, { name: IMPORT_COMPONENT_NAME }) &&
                      (t.isArrowFunctionExpression(ast.node.init) ||
                       t.isFunctionExpression(ast.node.init))
          ) {
            enableImportComponent = false
            cb(false)
          }
        }
      }
    }
  }
}
