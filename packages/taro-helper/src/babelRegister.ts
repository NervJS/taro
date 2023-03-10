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

import * as path from 'path'

import type { NodePath, PluginItem } from '@babel/core'

/**
 * Inject `defineAppConfig` and `definePageConfig`
 * require header at the top of a config file,
 * without the need to specifically require them
 * if they are used
*/
export function injectDefineConfigHeader (babel: any): PluginItem {
  const appConfig = 'function defineAppConfig(config) { return config }'
  const pageConfig = 'function definePageConfig(config) { return config }'

  const prependHeader = (nodePath: NodePath<any>, header: string) => {
    const parsedHeader = babel.parse(header, { filename: '' }).program.body[0]
    nodePath.node.body.unshift(parsedHeader)
  }

  const enterHandler = (nodePath: NodePath<any>) => {
    const { scope, node } = nodePath

    scope.traverse(node, {
      CallExpression (p) {
        const callee = p.node.callee
        // @ts-ignore
        switch (callee.name) {
          case 'defineAppConfig':
            return prependHeader(nodePath, appConfig)
          case 'definePageConfig':
            return prependHeader(nodePath, pageConfig)
        }
      }
    })
  }

  return {
    visitor: {
      Program: { enter: enterHandler }
    }
  }
}

export default function createBabelRegister ({ only }) {
  require('@babel/register')({
    only: Array.from(new Set([...only])),
    presets: [
      require.resolve('@babel/preset-env'),
      require.resolve('@babel/preset-typescript')
    ],
    plugins: [
      injectDefineConfigHeader,
      [require.resolve('@babel/plugin-proposal-decorators'), {
        legacy: true
      }],
      require.resolve('@babel/plugin-proposal-object-rest-spread'),
      [require.resolve('@babel/plugin-transform-runtime'), {
        corejs: false,
        helpers: true,
        regenerator: true,
        useESModules: false,
        version: '^7.7.7',
        absoluteRuntime: path.resolve(__dirname, '..', 'node_modules/@babel/runtime')
      }]
    ],
    extensions: ['.jsx', '.js', '.ts', '.tsx'],
    babelrc: false,
    configFile: false,
    cache: false
  })
}
