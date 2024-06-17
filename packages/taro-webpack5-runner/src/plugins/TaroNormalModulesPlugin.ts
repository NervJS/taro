import TaroSingleEntryDependency from '../dependencies/TaroSingleEntryDependency'
import { componentConfig, componentNameSet, elementNameSet } from '../utils/component'
import TaroNormalModule, { TaroBaseNormalModule } from './TaroNormalModule'

import type { Func } from '@tarojs/taro/types/compile'
import type acorn from 'acorn'
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
            { miniType: dependency.miniType, name: dependency.name, isNativePage: dependency.options.isNativePage }
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
            CallExpression: (node, _ancestors) => {
              // @ts-ignore
              const callee = node.callee

              if (callee.type === 'MemberExpression') {
                if (callee.property.type !== 'Identifier') {
                  return
                }
                if (callee.property.name !== 'createElement') {
                  return
                }
              } else {
                const nameOfCallee = (callee as acorn.Identifier).name
                if (
                  // 兼容 react17 new jsx transtrom 以及esbuild-loader的ast兼容问题
                  !/^_?jsxs?$/.test(nameOfCallee) &&
                  // 兼容 Vue 3.0 渲染函数及 JSX
                  !(nameOfCallee && nameOfCallee.includes('createVNode')) &&
                  !(nameOfCallee && nameOfCallee.includes('createBlock')) &&
                  !(nameOfCallee && nameOfCallee.includes('createElementVNode')) &&
                  !(nameOfCallee && nameOfCallee.includes('createElementBlock')) &&
                  !(nameOfCallee && nameOfCallee.includes('resolveComponent')) && // 收集使用解析函数的组件名称
                  !(nameOfCallee && nameOfCallee.includes('_$createElement')) // solidjs创建元素
                ) {
                  return
                }
              }

              const [type, prop] = node.arguments

              if (!type) return

              const componentName = (type as acorn.Identifier).name

              if ((type as acorn.Literal).value) {
                this.onParseCreateElement?.((type as acorn.Literal).value, componentConfig)
                // @ts-ignore
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
              // @ts-ignore
              const attrs = componentConfig.thirdPartyComponents.get(type.value)

              if (attrs == null || !prop || prop.type !== 'ObjectExpression') {
                return
              }

              function getPropName (key): string {
                return key.type === 'Identifier' ? key.name : (key.type === 'Literal' ? key.value : null)
              }

              const props = prop.properties
                .filter(p => {
                  if (p.type !== 'Property') return false

                  const propName = getPropName(p.key)
                  return propName && propName !== 'children' && propName !== 'id'
                })
              // @ts-ignore
              const res = props.map(p => getPropName(p.key)).join('|')
              // @ts-ignore
              props.forEach(p => attrs.add(getPropName(p.key)))
              // @ts-ignore
              currentModule.collectProps[type.value] = res
            },
          })
        })
      })
    })
  }
}
