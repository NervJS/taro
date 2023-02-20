import { taroJsComponents } from '@tarojs/helper'
import { toDashed } from '@tarojs/shared'

import { componentConfig } from '../utils/component'

import type { Func } from '@tarojs/taro/types/compile'
import type { Compiler } from 'webpack'

const walk = require('acorn-walk')

const PLUGIN_NAME = 'TaroComponentsExportsPlugin'

export default class TaroComponentsExportsPlugin {
  onParseCreateElement?: Func

  constructor (onParseCreateElement?: Func) {
    this.onParseCreateElement = onParseCreateElement
  }

  apply (compiler: Compiler) {
    compiler.hooks.normalModuleFactory.tap(PLUGIN_NAME, (normalModuleFactory) => {
      normalModuleFactory.hooks.afterResolve.tap(PLUGIN_NAME, (resolveData) => {
        if (resolveData.request === taroJsComponents) {
          resolveData.dependencies.forEach((dependency: any) => {
            if (dependency.usedByExports && dependency.ids?.lenght > 0) {
              dependency.ids.forEach(item => componentConfig.includes.add(toDashed(item)))
            }
          })
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

              const type = node.arguments[0]
              type.value && this.onParseCreateElement?.(type.value, componentConfig)
            }
          }, {
            ...walk.base, Import: walk.base.Import || (() => {})
          })
        })
      })
    })
  }
}
