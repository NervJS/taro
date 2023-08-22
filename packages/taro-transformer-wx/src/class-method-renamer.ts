import { NodePath, Visitor } from '@babel/traverse'
import * as t from '@babel/types'

import { isDerivedFromThis } from './utils'

function buildMethodName(n: string) {
  return `render${n.charAt(0).toUpperCase() + n.slice(1)}`
}

export const buildVistor = () => {
  const renameMap = new Map<string, string>()

  const classMethodRenamer: () => {
    visitor: Visitor
  } = () => {
    return {
      visitor: {
        JSXElement(path) {
          let methodName = ''
          const classMethod = path.findParent((p) => p.isClassMethod())
          if (classMethod && classMethod.isClassMethod() && t.isIdentifier(classMethod.node.key)) {
            methodName = (classMethod.node.key as any).name
            if (methodName.startsWith('render') || methodName === 'constructor') {
              return
            }
            classMethod.node.key = t.identifier(buildMethodName(methodName))
          }

          const classProp = path.findParent((p) => p.isClassProperty())
          if (classProp && classProp.isClassProperty()) {
            methodName = (classProp.node.key as any).name
            if (methodName.startsWith('render')) {
              return
            }
            if (!t.isArrowFunctionExpression(classProp.node.value)) {
              return
            }
            classProp.replaceWith(
              t.classMethod(
                'method',
                t.identifier(buildMethodName(methodName)),
                (classProp.node.value as any).params,
                t.isBlockStatement((classProp.node.value as any).body)
                  ? (classProp.node.value as any).body
                  : t.blockStatement([t.returnStatement((classProp.node.value as any).body)])
              )
            )
            return
          }

          if (methodName.length > 0 && !methodName.startsWith('render')) {
            renameMap.set(methodName, buildMethodName(methodName))
          }
        },
        Identifier(path: NodePath<t.Identifier>) {
          const name = path.node.name
          if (renameMap.has(name)) {
            const memberExpr = path.parentPath
            if (memberExpr.isMemberExpression() && memberExpr.parentPath.isCallExpression()) {
              const object = memberExpr.get('object')
              if (t.isThisExpression(object)) {
                path.replaceWith(t.identifier(buildMethodName(name)))
              } else if (t.isIdentifier(object) && isDerivedFromThis(path.scope, object.name)) {
                memberExpr.replaceWith(t.memberExpression(t.thisExpression(), t.identifier(buildMethodName(name))))
              }
            } else if (memberExpr.isCallExpression() && isDerivedFromThis(path.scope, name)) {
              path.scope.rename(name, buildMethodName(name))
            }
          }
        },
      },
    }
  }

  return classMethodRenamer
}
