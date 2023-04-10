import TaroSingleEntryDependency from '../dependencies/TaroSingleEntryDependency'
import { componentConfig } from '../utils/component'
import TaroNormalModule from './TaroNormalModule'

import type { Func } from '@tarojs/taro/types/compile'
import type { Compiler } from 'webpack'

const walk = require('acorn-walk')

const PLUGIN_NAME = 'TaroNormalModulesPlugin'

export default class TaroNormalModulesPlugin {
  onParseCreateElement: Func | undefined

  constructor (onParseCreateElement: Func | undefined) {
    this.onParseCreateElement = onParseCreateElement
  }

  apply (compiler: Compiler) {
    compiler.hooks.compilation.tap(PLUGIN_NAME, (_, { normalModuleFactory }) => {
      normalModuleFactory.hooks.createModule.tapPromise(PLUGIN_NAME, (data, { dependencies }) => {
        const dependency = dependencies[0]
        if (dependency instanceof TaroSingleEntryDependency) {
          return Promise.resolve(new TaroNormalModule(Object.assign(data,
            { miniType: dependency.miniType, name: dependency.name }
          )))
        }
        return Promise.resolve()
      })

      // react 的第三方组件支持
      normalModuleFactory.hooks.parser.for('javascript/auto').tap(PLUGIN_NAME, (parser) => {
        parser.hooks.program.tap(PLUGIN_NAME, (ast) => {
          walk.simple(ast, {
            CallExpression: node => {
              const callee = node.callee
              if (callee.type === 'MemberExpression') {
                if (callee.property.name !== 'createElement') {
                  return
                }
              } else {
                const nameOfCallee = callee.name
                if (
                  // 兼容 react17 new jsx transtrom
                  nameOfCallee !== '_jsx' && nameOfCallee !== '_jsxs' &&
                  // 兼容 Vue 3.0 渲染函数及 JSX
                  !(nameOfCallee && nameOfCallee.includes('createVNode')) &&
                  !(nameOfCallee && nameOfCallee.includes('createBlock')) &&
                  !(nameOfCallee && nameOfCallee.includes('createElementVNode')) &&
                  !(nameOfCallee && nameOfCallee.includes('createElementBlock')) &&
                  !(nameOfCallee && nameOfCallee.includes('resolveComponent')) // 收集使用解析函数的组件名称
                  // TODO: 兼容 vue 2.0 渲染函数及 JSX，函数名 h 与 _c 在压缩后太常见，需要做更多限制后才能兼容
                  // nameOfCallee !== 'h' && nameOfCallee !== '_c'
                ) {
                  return
                }
              }

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
          })
        })
      })
    })
  }
}
