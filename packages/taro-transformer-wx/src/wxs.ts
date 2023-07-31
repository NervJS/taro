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
        const arg = path.node.arguments[0]
        if (t.isStringLiteral(arg)) {
          const regex = arg.extra?.raw as string
          const regexWithoutQuotes = regex.replace(/^'(.*)'$/, '$1')
          const newExpr = t.newExpression(t.identifier('RegExp'), [
            t.stringLiteral(regexWithoutQuotes),
            t.stringLiteral('g'),
          ])
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
