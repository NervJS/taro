import { Visitor } from 'babel-traverse'
import { codeFrameError, buildConstVariableDeclaration } from './utils'
import * as t from 'babel-types'
import { cloneDeep } from 'lodash'
import generate from 'babel-generator'
import { DEFAULT_Component_SET } from './constant'
import { injectRenderPropsListener } from './render-props'

function initialIsCapital (word: string) {
  return word[0] !== word[0].toLowerCase()
}

export const Status = {
  isSFC: false
}

export const functionalComponent: () => {
  visitor: Visitor
} = () => {
  return {
    visitor: {
      JSXElement (path) {
        const arrowFuncExpr = path.findParent(p => p.isArrowFunctionExpression())
        const funcExpr = path.findParent(p => p.isFunctionExpression())
        if (funcExpr && funcExpr.isFunctionExpression() && funcExpr.parentPath.isVariableDeclarator()) {
          const { params, body, async } = funcExpr.node
          funcExpr.replaceWith(t.arrowFunctionExpression(params, body, async))
          return
        }
        if (arrowFuncExpr && arrowFuncExpr.isArrowFunctionExpression()) {
          if (arrowFuncExpr.parentPath.isVariableDeclarator()) {
            const valDecl = arrowFuncExpr.parentPath.parentPath
            if (!valDecl.isVariableDeclaration() && !valDecl.isFunctionDeclaration()) {
              throw codeFrameError(valDecl.node, '函数式组件不能同时定义多个值')
            }
            const id = arrowFuncExpr.parentPath.node.id
            if (!t.isIdentifier(id)) {
              throw codeFrameError(id, '函数式组件只能使用普通标识符定义')
            }
            if (!initialIsCapital(id.name)) {
              return
            }
            const hasClassDecl = arrowFuncExpr.findParent(p => p.isClassDeclaration())
            if (hasClassDecl) {
              // @TODO: 加上链接
              return
            }
            const { body } = arrowFuncExpr.node
            if (t.isBlockStatement(body)) {
              valDecl.replaceWith(t.functionDeclaration(id, arrowFuncExpr.node.params, body))
            } else {
              valDecl.replaceWith(t.functionDeclaration(id, arrowFuncExpr.node.params, t.blockStatement([
                t.returnStatement(body)
              ])))
            }
            return
          } else if (arrowFuncExpr.parentPath.isExportDefaultDeclaration()) {
            const { body, params } = arrowFuncExpr.node
            const func = t.functionDeclaration(
              t.identifier('AnonymousSFC'),
              params,
              t.isBlockStatement(body) ? body : t.blockStatement([
                t.returnStatement(body)
              ])
            )
            arrowFuncExpr.parentPath.insertAfter(t.exportDefaultDeclaration(t.identifier('AnonymousSFC')))
            arrowFuncExpr.parentPath.replaceWith(func)
            return
          }
        }

        const functionDecl = path.findParent(p => p.isFunctionDeclaration())
        if (functionDecl && functionDecl.isFunctionDeclaration()) {
          const hasClassDecl = functionDecl.findParent(p => p.isClassDeclaration())
          if (hasClassDecl) {
            // @TODO: 加上链接
            return
          }
          let { id, body, params } = functionDecl.node
          let arg: null | t.LVal = null
          // tslint:disable-next-line: strict-type-predicates
          if (id === null) {
            functionDecl.node.id = t.identifier('YourShouldGiveTheComponentAName')
            id = functionDecl.node.id
          }
          if (params.length > 1) {
            throw codeFrameError(id, '函数式组件的参数最多只能传入一个')
          } else if (params.length === 1) {
            arg = params[0]
          }
          const cloneBody = cloneDeep(body)
          if (!initialIsCapital(id.name)) {
            throw codeFrameError(id, `普通函数式组件命名规则请遵守帕斯卡命名法（Pascal Case), 如果是在函数内声明闭包组件，则需要使用函数表达式的写法。
形如:
const ${id.name} = ${generate(t.arrowFunctionExpression(params, body)).code}
            `)
          }
          if (arg) {
            if (t.isIdentifier(arg)) {
              cloneBody.body.unshift(buildConstVariableDeclaration(arg.name, t.memberExpression(t.thisExpression(), t.identifier('props'))))
            } else if (t.isObjectPattern(arg)) {
              let hasChildren = false
              for (const [index, p] of arg.properties.entries()) {
                if (t.isObjectProperty(p) && t.isIdentifier(p.key, { name: 'children' })) {
                  hasChildren = true
                  arg.properties.splice(index, 1)
                }
              }
              cloneBody.body.unshift(
                t.variableDeclaration('const', [
                  t.variableDeclarator(arg, t.memberExpression(t.thisExpression(), t.identifier('props')))
                ])
              )
              if (hasChildren) {
                cloneBody.body.unshift(
                  t.variableDeclaration('const', [
                    t.variableDeclarator(t.objectPattern([
                      t.objectProperty(t.identifier('children'), t.identifier('children')) as any
                    ]), t.memberExpression(t.thisExpression(), t.identifier('props')))
                  ])
                )
              }
            } else if (t.isAssignmentPattern(arg)) {
              throw codeFrameError(arg, '给函数式组件的第一个参数设置默认参数是没有意义的，因为 props 永远都有值（不传 props 的时候是个空对象），所以默认参数永远都不会执行。')
            } else {
              throw codeFrameError(arg, '函数式组件只支持传入一个简单标识符或使用对象结构')
            }
          }
          Status.isSFC = true
          const classDecl = t.classDeclaration(id, t.memberExpression(t.identifier('Taro'), t.identifier('Component')), t.classBody([
            t.classMethod('method', t.identifier('render'), [], cloneBody)
          ]), [])
          functionDecl.replaceWith(classDecl)
        }
      },
      JSXAttribute (path) {
        const { name, value } = path.node
        const jsxElementPath = path.parentPath.parentPath
        if (t.isJSXIdentifier(name) && jsxElementPath.isJSXElement()) {
          const componentName = (jsxElementPath.node.openingElement as any).name.name
          if (/^render[A-Z]/.test(name.name) && !DEFAULT_Component_SET.has(componentName)) {
            if (!t.isJSXExpressionContainer(value)) {
              throw codeFrameError(value, '以 render 开头的 props 只能传入包含一个 JSX 元素的 JSX 表达式。')
            }
            const expression = value.expression
            if (t.isArrowFunctionExpression(expression)) {
              injectRenderPropsListener(path, name.name, expression, componentName)
            }
          }
        }
      }
    }
  }
}
