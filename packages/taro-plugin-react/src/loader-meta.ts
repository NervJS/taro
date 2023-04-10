import { isWebPlatform } from '@tarojs/shared'
import * as acorn from 'acorn'
import * as walk from 'acorn-walk'

import { Frameworks } from './index'

interface ILoaderMeta {
  importFrameworkStatement: string
  mockAppStatement: string
  frameworkArgs: string
  creator: string
  creatorLocation: string
  extraImportForWeb: string
  execBeforeCreateWebApp: string
  importFrameworkName: string
  isNeedRawLoader?: boolean
  modifyConfig?: (config: Record<string, any>, source: string) => void
}

function addConfig (source) {
  const configsMap = {
    enableShareAppMessage: ['onShareAppMessage', 'useShareAppMessage'],
    enableShareTimeline: ['onShareTimeline', 'useShareTimeline']
  }
  const ast = acorn.parse(source, {
    ecmaVersion: 'latest',
    sourceType: 'module'
  })

  const additionConfig: Record<string, any> = {}

  function check (name: string) {
    Object.keys(configsMap).forEach(configName => {
      const apis: string[] = configsMap[configName]
      if (apis.includes(name)) {
        additionConfig[configName] = true
      }
    })
  }

  walk.simple(ast, {
    FunctionExpression (node: any) {
      if (!node.id || !node.id.name) return
      check(node.id.name)
    },
    FunctionDeclaration (node: any) {
      if (!node.id || !node.id.name) return
      check(node.id.name)
    },
    CallExpression (node: any) {
      const { callee } = node
      if (callee.type === 'Identifier') {
        check(callee.name)
      } else if (callee.type === 'MemberExpression') {
        if (callee.property.type === 'Identifier') {
          check(callee.property.name)
        } else if (callee.property.type === 'Literal') {
          check(callee.property.value)
        }
      }
      node.arguments.forEach(item => {
        if (item.type === 'Literal' && item.value) {
          check(item.value)
        }
      })
    }
  })

  return additionConfig
}

const nervMeta = {
  importFrameworkStatement: `
import Nerv from 'nervjs';
`,
  mockAppStatement: `
class App extends Nerv.Component {
render () {
  return this.props.children
}
}
`,
  frameworkArgs: 'Nerv, Nerv, config',
  importFrameworkName: 'Nerv'
}

export function getLoaderMeta (framework: Frameworks): ILoaderMeta {
  const loaderMeta = {
    importFrameworkStatement: `
import * as React from 'react'
import ReactDOM from 'react-dom'
`,
    mockAppStatement: `
class App extends React.Component {
  render () {
    return this.props.children
  }
}
`,
    frameworkArgs: 'React, ReactDOM, config',
    creator: 'createReactApp',
    creatorLocation: '@tarojs/plugin-framework-react/dist/runtime',
    importFrameworkName: 'React',
    extraImportForWeb: '',
    execBeforeCreateWebApp: '',
    modifyConfig (config, source) {
      Object.assign(config, addConfig(source))
    }
  }
  if (framework === 'nerv') {
    Object.assign(loaderMeta, nervMeta)
  }

  if (isWebPlatform()) {
    if(framework === 'react') {
      const react = require('react')
      const majorVersion = Number((react.version || '18').split('.')[0])
      if( majorVersion >= 18) {
        // Note: In react 18 or above, should using react-dom/client
        loaderMeta.importFrameworkStatement = loaderMeta.importFrameworkStatement.replace('\'react-dom\'', '\'react-dom/client\'')
        loaderMeta.extraImportForWeb += `import { findDOMNode, render, unstable_batchedUpdates } from 'react-dom'\n`
        loaderMeta.execBeforeCreateWebApp += `Object.assign(ReactDOM, { findDOMNode, render, unstable_batchedUpdates })\n`
      }
    }
  }
  return loaderMeta
}
