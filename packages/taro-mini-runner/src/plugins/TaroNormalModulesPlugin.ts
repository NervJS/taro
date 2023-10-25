import webpack from 'webpack'

import TaroSingleEntryDependency from '../dependencies/TaroSingleEntryDependency'
import { componentConfig } from '../template/component'
import TaroNormalModule from './TaroNormalModule'

import type { Func } from '@tarojs/taro/types/compile'
import type AcornWalk from 'acorn-walk'

const walk = require('acorn-walk') as typeof AcornWalk

const PLUGIN_NAME = 'TaroNormalModulesPlugin'

function isRenderNode (node: acorn.Node, ancestors: any = []): boolean {
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

export default class TaroNormalModulesPlugin {
  onParseCreateElement: Func | undefined

  constructor (onParseCreateElement: Func | undefined) {
    this.onParseCreateElement = onParseCreateElement
  }

  apply (compiler: webpack.Compiler) {
    compiler.hooks.compilation.tap(PLUGIN_NAME, (_, { normalModuleFactory }) => {
      normalModuleFactory.hooks.createModule.tap(PLUGIN_NAME, data => {
        const dependency = data.dependencies[0]
        if (dependency.constructor === TaroSingleEntryDependency) {
          return new TaroNormalModule(Object.assign(data, { miniType: dependency.miniType, name: dependency.name }))
        }
      })

      // react 的第三方组件支持
      normalModuleFactory.hooks.parser.for('javascript/auto').tap(PLUGIN_NAME, (parser) => {
        parser.hooks.program.tap(PLUGIN_NAME, (ast) => {
          walk.ancestor(ast, {
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
              const [type, prop] = node.arguments
              const componentName = type.name

              type.value && this.onParseCreateElement?.(type.value, componentConfig)

              if (componentName === 'CustomWrapper' && !componentConfig.thirdPartyComponents.get('custom-wrapper')) {
                componentConfig.thirdPartyComponents.set('custom-wrapper', new Set())
              }
              if (componentConfig.thirdPartyComponents.size === 0) {
                return
              }
              const attrs = componentConfig.thirdPartyComponents.get(type.value)

              if (attrs == null || !prop || prop.type !== 'ObjectExpression') {
                return
              }

              prop.properties
                .filter(p => p.type === 'Property' && p.key.type === 'Identifier' && p.key.name !== 'children' && p.key.name !== 'id')
                .forEach(p => attrs.add(p.key.name))
            }
          }, {
            ...walk.base, Import: walk.base.Import || (() => {})
          })
        })
      })
    })
  }
}
