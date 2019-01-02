import { Visitor } from 'babel-traverse'
import { codeFrameError, buildConstVariableDeclaration } from './utils'
import * as t from 'babel-types'
import { cloneDeep } from 'lodash'

export const functionalComponent: () => {
  visitor: Visitor
} = () => {
  return {
    visitor: {
      JSXElement (path) {
        const functionDecl = path.findParent(p => p.isFunctionDeclaration())
        if (functionDecl && functionDecl.isFunctionDeclaration()) {
          const hasClassDecl = functionDecl.findParent(p => p.isClassDeclaration())
          if (hasClassDecl) {
            return
          }
          const { id, body, params } = functionDecl.node
          let arg: null | t.LVal = null
          if (params.length > 1) {
            throw codeFrameError(id, '函数式组件的参数最多只能传入一个')
          } else if (params.length === 1) {
            arg = params[0]
          }
          const cloneBody = cloneDeep(body)
          if (arg) {
            if (t.isIdentifier(arg)) {
              cloneBody.body.push(buildConstVariableDeclaration(arg.name, t.memberExpression(t.thisExpression(), t.identifier('props'))))
            } else if (t.isObjectPattern(arg)) {
              cloneBody.body.push(
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
