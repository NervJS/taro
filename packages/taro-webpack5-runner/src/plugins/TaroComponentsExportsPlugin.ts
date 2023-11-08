import { FRAMEWORK_MAP, taroJsComponents } from '@tarojs/helper'
import { toDashed } from '@tarojs/shared'

import { componentConfig } from '../utils/component'

import type { Func } from '@tarojs/taro/types/compile'
import type AcornWalk from 'acorn-walk'
import type { Compiler, NormalModule } from 'webpack'

const walk = require('acorn-walk') as typeof AcornWalk
const NullDependency = require('webpack/lib/dependencies/NullDependency')

const PLUGIN_NAME = 'TaroComponentsExportsPlugin'

interface IOptions {
  framework: FRAMEWORK_MAP
  onParseCreateElement?: Func
}

export function isRenderNode (node: acorn.Node, ancestors: any = []): boolean {
  let renderFn
  const hasRenderMethod = ancestors.some((ancestor) => {
    if (ancestor.type === 'FunctionExpression' && ancestor?.id?.name === 'render') {
      renderFn = ancestor.params[0]?.name
      return true
    } else {
      return false
    }
  })
  // @ts-ignore
  return hasRenderMethod && node.callee.name === renderFn
}

// TODO 合并 TaroNormalModulesPlugin 逻辑
export default class TaroComponentsExportsPlugin {
  onParseCreateElement?: Func
  #componentsExports: Set<string>

  constructor (protected options?: IOptions) {
    this.#componentsExports = new Set<string>()
    this.onParseCreateElement = options?.onParseCreateElement
  }

  apply (compiler: Compiler) {
    compiler.hooks.compilation.tap(PLUGIN_NAME, (compilation, { normalModuleFactory }) => {
      // react 的第三方组件支持
      normalModuleFactory.hooks.parser.for('javascript/auto').tap(PLUGIN_NAME, (parser) => {
        parser.hooks.program.tap(PLUGIN_NAME, (program) => {
          walk.simple(program, {
            CallExpression: (node, ancestors) => {
              // @ts-ignore
              const callee = node.callee

              if (callee.type === 'MemberExpression') {
                if (callee.property.name !== 'createElement') {
                  return
                }
              } else {
                const nameOfCallee = callee.name
                if (
                  // 兼容 react17 new jsx transform
                  nameOfCallee !== '_jsx' && nameOfCallee !== '_jsxs' &&
                  // 兼容 Vue 3.0 渲染函数及 JSX
                  !(nameOfCallee && nameOfCallee.includes('createVNode')) &&
                  !(nameOfCallee && nameOfCallee.includes('createBlock')) &&
                  !(nameOfCallee && nameOfCallee.includes('createElementVNode')) &&
                  !(nameOfCallee && nameOfCallee.includes('createElementBlock')) &&
                  !(nameOfCallee && nameOfCallee.includes('resolveComponent')) && // 收集使用解析函数的组件名称
                  // 兼容 Vue 2.0 渲染函数及 JSX
                  !isRenderNode(node, ancestors)
                ) {
                  return
                }
              }

              // @ts-ignore
              const type = node.arguments[0]
              if (type?.value) {
                this.onParseCreateElement?.(type.value, componentConfig)
                this.#componentsExports.add(type.value)
              }
            }
          }, {
            ...walk.base, Import: walk.base.Import || (() => {})
          })
        })
      })

      compilation.hooks.finishModules.tap(PLUGIN_NAME, (modules) => {
        const module: NormalModule = Array.from(modules).find((e: any) => e.rawRequest === taroJsComponents) as any
        if (!module) return
        // Note: 仅在生产环境使用
        if (compiler.options.mode === 'production' && !componentConfig.includeAll) {
          if (this.#componentsExports.size > 0) {
            compilation.dependencyTemplates.set(
              NullDependency,
              new NullDependency.Template()
            )
            module.dependencies = module.dependencies.map((dependency: any) => {
              if (!dependency?.name) return dependency
              const name = toDashed(dependency.name)
              const taroName = `taro-${name}`
              // Note: Vue2 目前无法解析，需要考虑借助 componentConfig.includes 优化
              const isIncluded = componentConfig.includes.has(name) || this.#componentsExports.has(taroName)
              if (!isIncluded || componentConfig.exclude.has(name)) {
                /** Note: 使用 Null 依赖替换不需要的依赖
                 * - 果使用 `compilation.moduleGraph.removeConnection` 移除会导致引用问题；
                 * - 使用 compilation.moduleGraph.getConnection(dependency)?.setActive 会残留依赖名称，轻微影包胞体大小
                 */
                return new NullDependency()
              }
              return dependency
            })
          }
        }
      })

      normalModuleFactory.hooks.afterResolve.tap(PLUGIN_NAME, (resolveData) => {
        if (resolveData.request === taroJsComponents) {
          resolveData.dependencies.forEach((dependency: any) => {
            if (dependency.usedByExports && dependency.ids?.length > 0) {
              dependency.ids.forEach(item => {
                componentConfig.includes.add(toDashed(item))
                this.#componentsExports.add(`taro-${toDashed(item)}`)
              })
            } else if (dependency.type === 'harmony import specifier') {
              componentConfig.includeAll = true
            }
          })
        }
      })
    })
  }
}
