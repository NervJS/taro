import * as acorn from 'acorn'

import { type IModuleComponentMeta, moduleComponentMetaMap, syncModuleComponentMetas } from '../utils/context'

import type { LoaderContext } from '@rspack/core'
import type AcornWalk from 'acorn-walk'

const walk = require('acorn-walk') as typeof AcornWalk

function isCreateElementCallee (callee: any): boolean {
  if (!callee) return false
  if (callee.type === 'MemberExpression') {
    return callee.property?.type === 'Identifier' && (
      callee.property.name === 'createElement' ||
      /^_?jsx(s|DEV)?$/.test(callee.property.name)
    )
  }
  if (callee.type === 'Identifier') {
    const name = callee.name || ''
    return (
      /^_?jsx(s|DEV)?$/.test(name) ||
      name === 'createElement' ||
      name.includes('createVNode') ||
      name.includes('createBlock') ||
      name.includes('createElementVNode') ||
      name.includes('createElementBlock') ||
      name.includes('resolveComponent') ||
      name.includes('_$createElement')
    )
  }
  return false
}

export default function taroComponentCollectorLoader (this: LoaderContext<any>, source: string, map?: any) {
  const options = this.getOptions?.() || {}
  const meta: IModuleComponentMeta = {
    elementNames: new Set(),
    componentNames: new Set(),
    thirdPartyProps: new Map()
  }

  try {
    const ast = acorn.parse(source, {
      ecmaVersion: 'latest',
      sourceType: 'module'
    })

    walk.simple(ast as any, {
      CallExpression (node: any) {
        if (!isCreateElementCallee(node.callee)) return

        const [typeNode, propNode] = node.arguments || []
        if (!typeNode) return

        if (typeof typeNode.value === 'string') {
          const tagName = typeNode.value
          meta.elementNames.add(tagName)

          if (propNode && propNode.type === 'ObjectExpression') {
            let propSet = meta.thirdPartyProps.get(tagName)
            if (!propSet) {
              propSet = new Set()
              meta.thirdPartyProps.set(tagName, propSet)
            }
            for (const p of propNode.properties || []) {
              if (p.type === 'Property') {
                const keyName = p.key?.type === 'Identifier' ? p.key.name : (typeof p.key?.value === 'string' ? p.key.value : undefined)
                if (keyName && keyName !== 'children' && keyName !== 'id') {
                  propSet.add(keyName)
                }
              }
            }
          }
        } else if (typeNode.type === 'Identifier' && typeNode.name) {
          meta.componentNames.add(typeNode.name)
        }
      }
    }, {
      ...(walk.base as any),
      Import: (walk.base as any).Import || (() => {})
    } as any)

    moduleComponentMetaMap.set(this.resourcePath, meta)
    syncModuleComponentMetas(options.onParseCreateElement)
  } catch {
    // Ignore AST parse failures on non-standard modules
  }

  this.callback(null, source, map)
}
