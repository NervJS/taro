import TaroSingleEntryDependency from '../dependencies/TaroSingleEntryDependency'
import { componentConfig, componentNameSet, elementNameSet } from '../utils/component'
import { isRenderNode } from './TaroComponentsExportsPlugin'
import TaroNormalModule, { TaroBaseNormalModule } from './TaroNormalModule'

import type { Func } from '@tarojs/taro/types/compile'
import type AcornWalk from 'acorn-walk'
import type { Compiler } from 'webpack'

const walk = require('acorn-walk') as typeof AcornWalk

const PLUGIN_NAME = 'TaroNormalModulesPlugin'

export default class TaroNormalModulesPlugin {
  isCache = true

  onParseCreateElement: Func | undefined

  constructor (onParseCreateElement: Func | undefined) {
    this.onParseCreateElement = onParseCreateElement
  }

  apply (compiler: Compiler) {
    compiler.hooks.compilation.tap(PLUGIN_NAME, (compilation, { normalModuleFactory }) => {
      // cache 开启后，会跳过 JavaScript parser 环节，因此需要收集组件信息，在 finishModules 阶段处理
      compilation.hooks.finishModules.tap(PLUGIN_NAME, (_) => {
        if (!this.isCache) return

        for (const name of elementNameSet) {
          this.onParseCreateElement?.(name, componentConfig)
        }

        for (const name of componentNameSet) {
          if (name === 'CustomWrapper' && !componentConfig.thirdPartyComponents.get('custom-wrapper')) {
            componentConfig.thirdPartyComponents.set('custom-wrapper', new Set())

            return
          }
        }
      })

      normalModuleFactory.hooks.createModule.tapPromise(PLUGIN_NAME, (data, { dependencies }) => {
        const dependency = dependencies[0]
        if (dependency instanceof TaroSingleEntryDependency) {
          return Promise.resolve(new TaroNormalModule(Object.assign(data,
            { miniType: dependency.miniType, name: dependency.name }
          )))
        }
        return Promise.resolve(new TaroBaseNormalModule(data))
      })

      // react 的第三方组件支持
      normalModuleFactory.hooks.parser.for('javascript/auto').tap(PLUGIN_NAME, (parser) => {
        parser.hooks.program.tap(PLUGIN_NAME, (ast) => {
          this.isCache = false

          const currentModule = parser.state.current as TaroBaseNormalModule
          currentModule.clear()

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

              if (type.value) {
                this.onParseCreateElement?.(type.value, componentConfig)
                currentModule.elementNameSet.add(type.value)
              }

              if (componentName) {
                currentModule.componentNameSet.add(componentName)
                if (componentName === 'CustomWrapper' && !componentConfig.thirdPartyComponents.get('custom-wrapper')) {
                  componentConfig.thirdPartyComponents.set('custom-wrapper', new Set())
                }
              }

              if (componentConfig.thirdPartyComponents.size === 0) {
                return
              }
              const attrs = componentConfig.thirdPartyComponents.get(type.value)

              if (attrs == null || !prop || prop.type !== 'ObjectExpression') {
                return
              }

              const props = prop.properties
                .filter(p => p.type === 'Property' && p.key.type === 'Identifier' && p.key.name !== 'children' && p.key.name !== 'id')
              const res = props.map(p => p.key.name).join('|')

              props.forEach(p => attrs.add(p.key.name))

              currentModule.collectProps[type.value] = res
            },
          })
        })
      })
    })
  }
}
