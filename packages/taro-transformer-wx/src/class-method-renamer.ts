import { Visitor, NodePath } from 'babel-traverse'
import * as t from 'babel-types'
import { isDerivedFromThis } from './utils'

function buildMethodName (n: string) {
  return `render${n}`
}

export const buildVistor = () => {
  const renameMap = new Map<string, string>()

  const classMethodRenamer: () => {
    visitor: Visitor
  } = () => {
    return {
      visitor: {
        JSXElement (path) {
          let methodName = ''
          const classMethod = path.findParent(p => p.isClassMethod())
          if (classMethod && classMethod.isClassMethod() && t.isIdentifier(classMethod.node.key)) {
            if (methodName.startsWith('render')) {
              return
            }
            methodName = classMethod.node.key.name
          }

          const classProp = path.findParent(p => p.isClassProperty())
          if (classProp && classProp.isClassProperty()) {
            methodName = classProp.node.key.name
          }

          if (methodName.length > 0 && !methodName.startsWith('render')) {
            renameMap.set(methodName, buildMethodName(methodName))
          }
        },
        Identifier (path: NodePath<t.Identifier>) {
          const name = path.node.name
          if (renameMap.has(name)) {
            const memberExpr = path.parentPath
            if (memberExpr.isMemberExpression() && memberExpr.parentPath.isCallExpression()) {
              const object = memberExpr.get('object')
              if (object.isThisExpression()) {
                path.replaceWith(t.identifier(buildMethodName(name)))
              } else if (object.isIdentifier() && isDerivedFromThis(path.scope, object.node.name)) {
                memberExpr.replaceWith(t.memberExpression(
                  t.thisExpression(),
                  t.identifier(buildMethodName(name))
                ))
              }
            } else if (memberExpr.isCallExpression() && isDerivedFromThis(path.scope, name)) {
              path.scope.rename(name, buildMethodName(name))
            }
          }
        }
      }
    }
  }

  return classMethodRenamer
}
