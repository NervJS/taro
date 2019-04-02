import { Visitor } from 'babel-traverse'
import { codeFrameError, buildConstVariableDeclaration } from './utils'
import * as t from 'babel-types'
import { cloneDeep } from 'lodash'

function initialIsCapital (word: string) {
  return word[0] !== word[0].toLowerCase()
}

export const functionalComponent: () => {
  visitor: Visitor
} = () => {
  return {
    visitor: {
      JSXElement (path) {
        const arrowFuncExpr = path.findParent(p => p.isArrowFunctionExpression())
        if (arrowFuncExpr && arrowFuncExpr.isArrowFunctionExpression() && arrowFuncExpr.parentPath.isVariableDeclarator()) {
          const valDecl = arrowFuncExpr.parentPath.parentPath
          if (!valDecl.isVariableDeclaration()) {
            throw codeFrameError(valDecl.node, '函数式组件不能同时定义多个值')
          }
          const id = arrowFuncExpr.parentPath.node.id
          if (!t.isIdentifier(id)) {
            throw codeFrameError(id, '函数式组件只能使用普通标识符定义')
          }
          if (!initialIsCapital(id.name)) {
            throw codeFrameError(id, '组件命名规则请遵守帕斯卡命名法（Pascal Case）')
          }
          const hasClassDecl = arrowFuncExpr.findParent(p => p.isClassDeclaration())
          if (hasClassDecl) {
            // @TODO: 加上链接
            throw codeFrameError(arrowFuncExpr.node, '在类中的函数式组件请写成类函数式组件：参考：')
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
        }

        const functionDecl = path.findParent(p => p.isFunctionDeclaration())
        if (functionDecl && functionDecl.isFunctionDeclaration()) {
          const hasClassDecl = functionDecl.findParent(p => p.isClassDeclaration())
          if (hasClassDecl) {
            // @TODO: 加上链接
            throw codeFrameError(functionDecl.node, '在类中的函数式组件请写成类函数式组件：参考：')
          }
          const { id, body, params } = functionDecl.node
          let arg: null | t.LVal = null
          if (params.length > 1) {
            throw codeFrameError(id, '函数式组件的参数最多只能传入一个')
          } else if (params.length === 1) {
            arg = params[0]
          }
          const cloneBody = cloneDeep(body)
          if (!initialIsCapital(id.name)) {
            throw codeFrameError(id, '组件命名规则请遵守帕斯卡命名法（Pascal Case）')
          }
          if (arg) {
            if (t.isIdentifier(arg)) {
              cloneBody.body.unshift(buildConstVariableDeclaration(arg.name, t.memberExpression(t.thisExpression(), t.identifier('props'))))
            } else if (t.isObjectPattern(arg)) {
              cloneBody.body.unshift(
                t.variableDeclaration('const', [
                  t.variableDeclarator(arg, t.memberExpression(t.thisExpression(), t.identifier('props')))
                ])
              )
            } else {
              throw codeFrameError(arg, '函数式组件只支持传入一个简单标识符或使用对象结构')
            }
          }
          const classDecl = t.classDeclaration(id, t.memberExpression(t.identifier('Taro'), t.identifier('Component')), t.classBody([
            t.classMethod('method', t.identifier('render'), [], cloneBody)
          ]), [])
          functionDecl.replaceWith(classDecl)
        }
      }
    }
  }
}
