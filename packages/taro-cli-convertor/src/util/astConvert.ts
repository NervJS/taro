import generate from '@babel/generator'
import { NodePath } from '@babel/traverse'
import * as t from '@babel/types'

// 最低限度的转义： https://github.com/mathiasbynens/jsesc#minimal
export function generateMinimalEscapeCode (ast: t.File) {
  return generate(ast as any, {
    jsescOption: {
      minimal: true,
    },
  }).code
}

// 判断是否已经引入 @tarojs/taro
export function hasTaroImport (bodyNode: NodePath<t.Node>[]) {
  return bodyNode.some((astPath) => {
    // import Taro from '@tarojs/taro'
    if (astPath.isImportDeclaration()) {
      return astPath.node.source.value === '@tarojs/taro'
    } else if (astPath.isVariableDeclaration() && astPath.node.declarations.length === 1) {
      // const Taro = require('@tarojs/taro')
      const declaration: t.VariableDeclarator = astPath.node.declarations[0]
      return (
        declaration.init != null &&
        declaration.init.type === 'CallExpression' &&
        declaration.init.callee.type === 'Identifier' &&
        declaration.init.callee.name === 'require' &&
        declaration.init.arguments.length === 1 &&
        declaration.init.arguments[0].type === 'StringLiteral' &&
        declaration.init.arguments[0].value === '@tarojs/taro'
      )
    }
    return false
  })
}

// 根据关键字exports判断是否为commonjs模块
export function isCommonjsModule (bodyNode: NodePath<t.Node>[]) {
  return bodyNode.some((p) => {
    if (t.isExpressionStatement(p) && t.isAssignmentExpression(p.expression)) {
      const expression = p.expression
      // 1、module.exports.num = num 2、module.exports = {}
      const isModuleExports =
        (expression.left.type === 'MemberExpression' &&
          expression.left.object.type === 'MemberExpression' &&
          expression.left.object.property.type === 'Identifier' &&
          expression.left.object.property.name === 'exports') ||
        (expression.left.type === 'MemberExpression' &&
          expression.left.property.type === 'Identifier' &&
          expression.left.property.name === 'exports')

      // exports.num = num
      const isExports =
        expression.left.type === 'MemberExpression' &&
        expression.left.object.type === 'Identifier' &&
        expression.left.object.name === 'exports'
      return isModuleExports || isExports
    }
    return false
  })
}

/**
 * 判断节点是否为commonjs的导入
 *
 * @param {NodePath<t.Node>} bodyNode
 * @returns {boolean}
 */
export function isCommonjsImport (bodyNode: NodePath<t.Node>) {
  if (bodyNode.isVariableDeclaration() && bodyNode.node.declarations.length === 1) {
    const declaration: t.VariableDeclarator = bodyNode.node.declarations[0]
    return (
      declaration.init != null &&
      declaration.init.type === 'CallExpression' &&
      declaration.init.callee.type === 'Identifier' &&
      declaration.init.callee.name === 'require'
    )
  }
  return false
}
