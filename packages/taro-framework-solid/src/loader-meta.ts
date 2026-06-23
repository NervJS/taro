import * as acorn from 'acorn'
import * as walk from 'acorn-walk'

import type { ILoaderMeta } from '@tarojs/taro/types/compile/config/plugin'

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

export function getLoaderMeta (): ILoaderMeta {
  const loaderMeta = {
    importFrameworkStatement: '',
    mockAppStatement: `
function App(props) {
return null
}
`,
    frameworkArgs: 'config',
    creator: 'createSolidApp',
    creatorLocation: '@tarojs/plugin-framework-solid/dist/runtime',
    importFrameworkName: '',
    extraImportForWeb: '',
    execBeforeCreateWebApp: '',
    modifyConfig (config, source) {
      Object.assign(config, addConfig(source))
    },

  }

  return loaderMeta
}
