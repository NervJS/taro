import generate from '@babel/generator'
import traverse, { Visitor } from '@babel/traverse'
import * as t from '@babel/types'

import { TransformResult } from './index'

export function traverseWxsFile(ast: t.File, defaultResult: TransformResult) {
  const vistor: Visitor = {
    BlockStatement(path) {
      path.scope.rename('wx', 'Taro')
    },
    Identifier(path) {
      if (path.isReferenced() && path.node.name === 'wx') {
        path.replaceWith(t.identifier('Taro'))
      }
    },
    CallExpression(path) {
      // wxs文件中的getRegExp转换为new RegExp
      if (t.isIdentifier(path.node.callee, { name: 'getRegExp' })) {
        // 根据正则表达式是否定义了正则匹配修饰符，有则不变，没有就用默认
        if (path.node.arguments.length > 1) {
          const regex = path.node.arguments[0]
          const modifier = path.node.arguments[1]
          if (t.isStringLiteral(regex) && t.isStringLiteral(modifier)) {
            const regexStr = regex.extra?.raw as string
            const regexModifier = modifier.extra?.rawValue as string
            const regexWithoutQuotes = regexStr.replace(/^['"](.*)['"]$/, '$1')
            const newExpr = t.newExpression(t.identifier('RegExp'), [
              t.stringLiteral(regexWithoutQuotes),
              t.stringLiteral(regexModifier),
            ])
            path.replaceWith(newExpr)
          } else if (t.isIdentifier(regex) || t.isIdentifier(modifier)) {
            throw new Error('getRegExp 函数暂不支持传入变量类型的参数')
          } else {
            throw new Error('getRegExp 函数暂不支持传入非字符串类型的参数')
          }
        } else if (path.node.arguments.length === 1) {
          const regex = path.node.arguments[0]
          if (t.isStringLiteral(regex)) {
            const regexStr = regex.extra?.raw as string
            const regexWithoutQuotes = regexStr.replace(/^['"](.*)['"]$/, '$1')
            const newExpr = t.newExpression(t.identifier('RegExp'), [
              t.stringLiteral(regexWithoutQuotes)
            ])
            path.replaceWith(newExpr)
          } else if (t.isIdentifier(regex)) {
            throw new Error('getRegExp 函数暂不支持传入变量类型的参数')
          } else {
            throw new Error('getRegExp 函数暂不支持传入非字符串类型的参数')
          }
        } else {
          const newExpr = t.newExpression(t.identifier('RegExp'), [])
          path.replaceWith(newExpr)
        }
      }
    },
  }

  traverse(ast, vistor)

  const code = generate(ast.program as any).code
  return {
    ...defaultResult,
    ast,
    code,
  }
}
