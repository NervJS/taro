import { componentConfig } from '../template/component'
import { isVirtualModule } from '../utils'

import type { PluginOption } from 'vite'
import type { MiniBuildConfig } from '../utils/types'

export default function (taroConfig: MiniBuildConfig): PluginOption {
  return {
    name: 'taro:vite-native-support',
    moduleParsed ({ id, ast }) {
      if (!isVirtualModule(id) && /\.[jt]sx/.test(id)) {
        const walk = require('acorn-walk')

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
                !(/_?jsxs?/.test(nameOfCallee)) &&
                // 兼容 Vue 3.0 渲染函数及 JSX
                !(nameOfCallee?.includes('createVNode')) &&
                !(nameOfCallee?.includes('createBlock')) &&
                !(nameOfCallee?.includes('createElementVNode')) &&
                !(nameOfCallee?.includes('createElementBlock')) &&
                !(nameOfCallee?.includes('resolveComponent')) // 收集使用解析函数的组件名称
                // TODO: 兼容 vue 2.0 渲染函数及 JSX，函数名 h 与 _c 在压缩后太常见，需要做更多限制后才能兼容
                // nameOfCallee !== 'h' && nameOfCallee !== '_c'
              ) {
                return
              }
            }

            const [type, prop] = node.arguments
            const componentName = type.name

            type.value && taroConfig.onParseCreateElement?.(type.value, componentConfig)

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
      }
    },
  }
}
