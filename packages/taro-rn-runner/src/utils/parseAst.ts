import { Config as IConfig } from '@tarojs/taro'
import * as t from 'babel-types'
import traverse from 'babel-traverse'
import { transformFromAst } from 'babel-core'

import { BUILD_TYPES, taroJsComponents, QUICKAPP_SPECIAL_COMPONENTS } from './constants'
import { traverseObjectNode, isNpmPkg } from '../utils'
import * as _ from 'lodash'

export default function parseAst (
  ast: t.File,
  buildAdapter: BUILD_TYPES
): {
  configObj: IConfig,
  hasEnablePageScroll: boolean,
  taroSelfComponents: Set<string>,
} {
  let configObj = {}
  let hasEnablePageScroll
  const taroSelfComponents = new Set<string>()
  const isQuickApp = buildAdapter === BUILD_TYPES.QUICKAPP
  let componentClassName: string = ''

  const newAst = transformFromAst(ast, '', {
    plugins: [
      [require('babel-plugin-preval')]
    ]
  }).ast as t.File

  traverse(newAst, {
    ClassDeclaration (astPath) {
      const node = astPath.node
      let hasCreateData = false
      if (node.superClass) {
        astPath.traverse({
          ClassMethod (astPath) {
            if (astPath.get('key').isIdentifier({name: '_createData'})) {
              hasCreateData = true
            }
          }
        })
        if (hasCreateData) {
          astPath.traverse({
            ClassMethod (astPath) {
              const node = astPath.node
              if (node.kind === 'constructor') {
                astPath.traverse({
                  ExpressionStatement (astPath) {
                    const node = astPath.node
                    if (node.expression &&
                      node.expression.type === 'AssignmentExpression' &&
                      node.expression.operator === '=') {
                      const left = node.expression.left
                      if (left.type === 'MemberExpression' &&
                        left.object.type === 'ThisExpression' &&
                        left.property.type === 'Identifier' &&
                        left.property.name === 'config') {
                        configObj = traverseObjectNode(node.expression.right, buildAdapter)
                      }
                    }
                  }
                })
              }
            }
          })
          if (node.id === null) {
            componentClassName = '_TaroComponentClass'
          } else if (node.id.name === 'App') {
            componentClassName = '_App'
          } else {
            componentClassName = node.id.name
          }
        }
      }
    },
    ClassExpression (astPath) {
      const node = astPath.node
      if (node.superClass) {
        let hasCreateData = false
        astPath.traverse({
          ClassMethod (astPath) {
            if (astPath.get('key').isIdentifier({name: '_createData'})) {
              hasCreateData = true
            }
          }
        })
        if (hasCreateData) {
          if (node.id === null) {
            const parentNode = astPath.parentPath.node as any
            if (t.isVariableDeclarator(astPath.parentPath)) {
              componentClassName = parentNode.id.name
            } else {
              componentClassName = '_TaroComponentClass'
            }
          } else if (node.id.name === 'App') {
            componentClassName = '_App'
          } else {
            componentClassName = node.id.name
          }
        }
      }
    },
    ClassMethod (astPath) {
      const keyName = (astPath.get('key').node as t.Identifier).name
      if (keyName === 'onPageScroll' || keyName === 'onReachBottom') {
        hasEnablePageScroll = true
      }
    },
    ClassProperty (astPath) {
      const node = astPath.node
      const keyName = node.key.name
      if (keyName === 'config') {
        // console.log(node, buildAdapter)
        configObj = traverseObjectNode(node, buildAdapter)
      }
    },
    ImportDeclaration (astPath) {
      const node = astPath.node
      const source = node.source
      let value = source.value
      const specifiers = node.specifiers
      if (isNpmPkg(value) && isQuickApp && value === taroJsComponents) {
        specifiers.forEach(specifier => {
          const name = specifier.local.name
          if (!QUICKAPP_SPECIAL_COMPONENTS.has(name)) {
            taroSelfComponents.add(_.kebabCase(name))
          }
        })
        astPath.remove()
      }
    },
    CallExpression (astPath) {
      const node = astPath.node
      const callee = node.callee as t.Identifier
      if (callee.name === 'require') {
        const args = node.arguments as t.StringLiteral[]
        let value = args[0].value
        const parentNode = astPath.parentPath.parentPath.node as t.VariableDeclaration
        if (isNpmPkg(value) && isQuickApp && value === taroJsComponents) {
          if (parentNode.declarations.length === 1 && parentNode.declarations[0].init) {
            const id = parentNode.declarations[0].id
            if (id.type === 'ObjectPattern') {
              const properties = id.properties as any
              properties.forEach(p => {
                if (p.type === 'ObjectProperty' && p.value.type === 'Identifier') {
                  taroSelfComponents.add(_.kebabCase(p.value.name))
                }
              })
            }
          }
          astPath.remove()
        }
      }
    },
    AssignmentExpression (astPath) {
      const node = astPath.node
      const left = node.left
      if (t.isMemberExpression(left) && t.isIdentifier(left.object)) {
        if (left.object.name === componentClassName
          && t.isIdentifier(left.property)
          && left.property.name === 'config') {
          configObj = traverseObjectNode(node.right, buildAdapter)
        }
      }
    }
  })

  return {
    configObj,
    hasEnablePageScroll,
    taroSelfComponents
  }
}
