import { transformAsync, transformSync } from '@babel/core'
import { SCRIPT_EXT } from '@tarojs/helper'

import type * as BabelCore from '@babel/core'
import type { Identifier } from '@babel/types'
import type { ViteHarmonyCompilerContext } from '@tarojs/taro/types/compile/viteCompilerContext'
import type { PluginOption } from 'vite'

export default (viteCompilerContext: ViteHarmonyCompilerContext): PluginOption => {
  return [{
    name: '',
    enforce: 'pre',
    transform (code, id) {
      if (/(\.(et|j|t)sx?|\.vue)$/.test(id.split('?')[0])) {
        const result = transformSync(code, {
          filename: id,
          plugins: [
            [
              function renameImportPlugin (babel: typeof BabelCore): BabelCore.PluginObj<BabelCore.PluginPass> {
                const t = babel.types
                return {
                  name: 'taro-rename-import-plugin',
                  visitor: {
                    ImportDeclaration (ast) {
                      if (ast.node.source.value !== '@tarojs/components') return

                      const newSpecifiers = ast.node.specifiers.map(node => {
                        if (t.isImportSpecifier(node)) {
                          const { imported, local } = node
                          const property = t.isIdentifier(imported) ? imported.name : imported.value
                          return t.importSpecifier(local, t.identifier(`Taro${property}TagName`))
                        }
                        return node
                      })
                      ast.node.source.value = '@tarojs/components/tag'
                      ast.node.specifiers = newSpecifiers
                    },
                    ExportNamedDeclaration(ast) {
                      const { node } = ast
                      if (node.source && node.source.value === '@tarojs/components') {
                        const newSpecifiers = node.specifiers.map(specifier => {
                          if (t.isExportSpecifier(specifier)) {
                            const exportedName = (specifier.exported as Identifier).name
                            return t.exportSpecifier(t.identifier(`Taro${exportedName}TagName`), specifier.exported)
                          }
                          return specifier
                        })

                        node.source.value = '@tarojs/components/tag'
                        node.specifiers = newSpecifiers
                      }
                    }
                  },
                }
              }
            ],
          ],
        })

        return {
          code: result?.code || code,
          map: result?.map || null,
        }
      }

      return null
    }
  }, {
    name: 'taro:vite-import-api',
    enforce: 'post',
    async transform(code, id) {
      const exts = Array.from(new Set(viteCompilerContext.frameworkExts.concat(SCRIPT_EXT)))

      if (id.startsWith(viteCompilerContext.sourceDir) && exts.some((ext: string) => id.includes(ext))) {
        // TODO 后续考虑使用 SWC 插件的方式实现
        const result = await transformAsync(code, {
          filename: id,
          plugins: [
            [
              require('babel-plugin-transform-taroapi'),
              {
                packageName: '@tarojs/taro',
              },
            ],
          ],
        })
        return {
          code: result?.code || code,
          map: result?.map || null,
        }
      }
    },
  }]
}
