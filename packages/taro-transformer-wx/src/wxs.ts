import generate from '@babel/generator'
import traverse, { Visitor } from '@babel/traverse'
import * as t from '@babel/types'

import { TransformResult } from './index'
import { getLineBreak, updateLogFileContent } from './utils'

export function traverseWxsFile(ast: t.File, defaultResult: TransformResult) {
  updateLogFileContent(`INFO [taro-transformer-wx] traverseWxsFile - 进入函数 ${getLineBreak()}`)
  const vistor: Visitor = {
    BlockStatement(path) {
      updateLogFileContent(`INFO [taro-transformer-wx] traverseWxsFile - 解析BlockStatement ${getLineBreak()}${path} ${getLineBreak()}`)
      path.scope.rename('wx', 'Taro')
    },
    Identifier(path) {
      updateLogFileContent(`INFO [taro-transformer-wx] traverseWxsFile - 解析Identifier ${getLineBreak()}${path} ${getLineBreak()}`)
      if (path.isReferenced() && path.node.name === 'wx') {
        path.replaceWith(t.identifier('Taro'))
      }
    },
    CallExpression(path) {
      updateLogFileContent(`INFO [taro-transformer-wx] traverseWxsFile - 解析CallExpression ${getLineBreak()}${path} ${getLineBreak()}`)
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
            updateLogFileContent(`ERROR [taro-transformer-wx] traverseWxsFile - getRegExp 函数暂不支持传入变量类型的参数 ${getLineBreak()}`)
            throw new Error('getRegExp 函数暂不支持传入变量类型的参数')
          } else {
            updateLogFileContent(`ERROR [taro-transformer-wx] traverseWxsFile - getRegExp 函数暂不支持传入非字符串类型的参数 ${getLineBreak()}`)
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
            updateLogFileContent(`ERROR [taro-transformer-wx] traverseWxsFile - getRegExp 函数暂不支持传入变量类型的参数 ${getLineBreak()}`)
            throw new Error('getRegExp 函数暂不支持传入变量类型的参数')
          } else {
            updateLogFileContent(`ERROR [taro-transformer-wx] traverseWxsFile - getRegExp 函数暂不支持传入非字符串类型的参数 ${getLineBreak()}`)
            throw new Error('getRegExp 函数暂不支持传入非字符串类型的参数')
          }
        } else {
          const newExpr = t.newExpression(t.identifier('RegExp'), [])
          path.replaceWith(newExpr)
        }
      }
      // wxs文件中getDate()转换为new Date()
      if (t.isIdentifier(path.node.callee, { name: 'getDate' })) {
        let argument: any = []
        let newDate: t.NewExpression
        const date = path.node.arguments[0]
        if (t.isStringLiteral(date)) {
          argument = path.node.arguments.map((item) => t.stringLiteral(item.extra?.rawValue as string))
          newDate = t.newExpression(t.identifier('Date'), [...argument])
        } else if (t.isNumericLiteral(date)) {
          argument = path.node.arguments.map((item) => t.numericLiteral(item.extra?.rawValue as number))
          newDate = t.newExpression(t.identifier('Date'), [...argument])
        } else {
          newDate = t.newExpression(t.identifier('Date'), [])
        }
        path.replaceWith(newDate)
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
