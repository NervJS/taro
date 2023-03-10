/* 
 *  MIT License
 *  
 *  Copyright (c) 2018 O2Team、58.com、other contributors
 *  
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *  
 *  The above copyright notice and this permission notice shall be included in all
 *  copies or substantial portions of the Software.
 *  
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 */

import webpack from 'webpack'

import TaroSingleEntryDependency from '../dependencies/TaroSingleEntryDependency'
import { componentConfig } from '../template/component'
import TaroNormalModule from './TaroNormalModule'

import type { Func } from '@tarojs/taro/types/compile'

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
          }, {
            ...walk.base, Import: walk.base.Import || (() => {})
          })
        })
      })
    })
  }
}
