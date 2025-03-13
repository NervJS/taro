import { transformSync } from '@babel/core'
import inject from '@rollup/plugin-inject'
import { SCRIPT_EXT } from '@tarojs/helper'

import type * as BabelCore from '@babel/core'
import type { RollupInjectOptions } from '@rollup/plugin-inject'
import type { PluginOption } from 'vite'
import type Harmony from '..'

export default function (this: Harmony): PluginOption {
  const that = this
  const packageName = '@tarojs/taro'
  const bindingName = 'Taro'
  const businessId = this.config.defineConstants?.LOCATION_APIKEY?.replace(/^['"]|['"]$/g, '')
  function getInjectOption(taroConfig): RollupInjectOptions {
    const options: RollupInjectOptions = {
      window: ['@tarojs/runtime', 'window'],
      document: ['@tarojs/runtime', 'document'],
      navigator: ['@tarojs/runtime', 'navigator'],
      requestAnimationFrame: ['@tarojs/runtime', 'requestAnimationFrame'],
      cancelAnimationFrame: ['@tarojs/runtime', 'cancelAnimationFrame'],
      Element: ['@tarojs/runtime', 'TaroElement'],
      SVGElement: ['@tarojs/runtime', 'SVGElement'],
      MutationObserver: ['@tarojs/runtime', 'MutationObserver'],
      history: ['@tarojs/runtime', 'history'],
      location: ['@tarojs/runtime', 'location'],
      URLSearchParams: ['@tarojs/runtime', 'URLSearchParams'],
      getComputedStyle: ['@tarojs/runtime', 'getComputedStyle'],
      URL: ['@tarojs/runtime', 'URL'],
      wx: ['@tarojs/taro', '*'],
      getCurrentPages: ['@tarojs/taro', 'getCurrentPages'],
      IntersectionObserver: ['@tarojs/taro', 'IntersectionObserver'],
      Intl: ['intl', '*']
    }

    const injectOptions = taroConfig.injectOptions

    if (injectOptions?.include) {
      for (const key in injectOptions.include) {
        options[key] = injectOptions.include[key]
      }
    }

    if (injectOptions?.exclude?.length) {
      injectOptions.exclude.forEach((item) => {
        delete options[item]
      })
    }

    return options
  }
  return {
    name: 'taro:vite-add-method-env',
    config: (config) => {
      if (Array.isArray(config.build?.rollupOptions?.plugins)) {
        const idx = config.build.rollupOptions.plugins.findIndex(e => e && (e as Plugin).name === 'inject')
        if (idx >= 0) config.build.rollupOptions.plugins.splice(idx, 1, inject(getInjectOption(this.ctx.initialConfig)))
      }
    },
    transform (code, id) {
      const pluginContext = this
      const { runnerUtils } = that.context
      const { getViteHarmonyCompilerContext } = runnerUtils
      const compiler = getViteHarmonyCompilerContext(pluginContext)
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
      })

      return {
        code: result?.code || code,
        map: result?.map || null,
      }
    }
  }
}
