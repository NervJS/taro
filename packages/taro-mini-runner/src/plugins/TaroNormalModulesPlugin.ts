import webpack from 'webpack'

import TaroNormalModule from './TaroNormalModule'
import TaroSingleEntryDependency from '../dependencies/TaroSingleEntryDependency'
import { componentConfig } from '../template/component'
import { Func } from '../utils/types'

const walk = require('acorn-walk')

const PLUGIN_NAME = 'TaroNormalModulesPlugin'

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
          walk.simple(ast, {
            CallExpression: node => {
              const callee = node.callee
              if (callee.type === 'MemberExpression') {
                if (callee.property.name !== 'createElement') {
                  return
                }
              } else {
                // 兼容 react17 new jsx transtrom
                if (callee.name !== '_jsx' && callee.name !== '_jsxs') {
                  return
                }
              }

              const [type, prop] = node.arguments
              const componentName = type.name

              this.onParseCreateElement?.(type.value, componentConfig)

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
                .filter(p => p.type === 'Property' && p.key.type === 'Identifier')
                .forEach(p => attrs.add(p.key.name))
            }
          })
        })
      })
    })
  }
}
