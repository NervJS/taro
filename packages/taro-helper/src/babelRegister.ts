import type { NodePath, parse, PluginItem } from '@babel/core'

/**
 * Inject `defineAppConfig` and `definePageConfig`
 * require header at the top of a config file,
 * without the need to specifically require them
 * if they are used
*/
export function injectDefineConfigHeader (babel: { parse: typeof parse }): PluginItem {
  const appConfig = 'function defineAppConfig(config) { return config }'
  const pageConfig = 'function definePageConfig(config) { return config }'
  const importNative = "function importNativeComponent(path = '', name = '', exportName = '') { return name }"

  const prependHeader = (nodePath: NodePath<any>, header: string) => {
    const parsedHeader = babel.parse(header, { filename: '' })?.program.body[0]
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
          case 'importNativeComponent':
            return prependHeader(nodePath, importNative)
          default:
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
