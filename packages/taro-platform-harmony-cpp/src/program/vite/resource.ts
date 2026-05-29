import { transformSync } from '@babel/core'

import { babelPresets } from '../babel/presets'

import type * as BabelCore from '@babel/core'
import type { PluginOption } from 'vite'
import type Harmony from '..'

/** @deprecated */
export default function (this: Harmony): PluginOption {
  return {
    name: 'taro:vite-harmony-resource',
    enforce: 'pre',
    transform (code: string, id: string) {
      if (/(\.(et|j|t)sx?|\.vue)$/.test(id.split('?')[0]) && !/node_modules/.test(id)) {
        try {
          const result = transformSync(code, {
            filename: id,
            configFile: false,
            presets: babelPresets,
            plugins: [
              (babel: typeof BabelCore): BabelCore.PluginObj<BabelCore.PluginPass> => {
                const { types: t } = babel
                const CurrentLabel = 'Current'
                let hasCurrentReference = false

                return {
                  visitor: {
                    Identifier(path) {
                      if (
                        path.node.name === '$r' &&
                        !path.scope.hasBinding('$r') &&
                        path.parent.type !== 'MemberExpression'
                      ) {
                        hasCurrentReference = true
                        path.replaceWith(
                          t.memberExpression(t.identifier(CurrentLabel), t.identifier('$r'))
                        )
                      }
                    },
                    Program: {
                      exit(path) {
                        if (hasCurrentReference) {
                          let hasCurrentImport = false

                          // 检查是否已有 Current 的导入
                          path.node.body.forEach((node) => {
                            if (
                              t.isImportDeclaration(node) &&
                            node.source.value === '@tarojs/runtime'
                            ) {
                              node.specifiers.forEach((spec) => {
                                if (t.isImportSpecifier(spec)) {
                                  hasCurrentImport = t.isIdentifier(spec.imported) && spec.imported.name === CurrentLabel
                                }
                              })
                            }
                          })

                          // 如果没有，添加导入
                          if (!hasCurrentImport) {
                            const importDeclaration = t.importDeclaration(
                              [
                                t.importSpecifier(
                                  t.identifier(CurrentLabel),
                                  t.identifier(CurrentLabel),
                                ),
                              ],
                              t.stringLiteral('@tarojs/runtime')
                            )
                            path.unshiftContainer('body', importDeclaration)
                          }
                        }
                      },
                    },
                  }
                }
              }
            ]
          })

          return {
            code: result?.code || code,
            map: result?.map || null,
          }
        } catch (error) {
          console.error('vite-harmony-resource transform error:', error)
        }
      }

      return null
    },
  }
}
