import * as t from 'babel-types'
import traverse, { NodePath } from 'babel-traverse'
import { transform } from 'babel-core'
import { buildImportStatement, codeFrameError } from './utils'
import { usedComponents } from './wxml'
import { PageLifecycle } from './lifecycle'

export function parseScript (script: string) {
  const { ast } = transform(script, {
    parserOpts: {
      sourceType: 'module',
      plugins: [
        'classProperties',
        'jsx',
        'flow',
        'flowComment',
        'trailingFunctionCommas',
        'asyncFunctions',
        'exponentiationOperator',
        'asyncGenerators',
        'objectRestSpread',
        'decorators',
        'dynamicImport'
      ]
    }
  }) as { ast: t.File }
  let classDecl!: t.ClassDeclaration
  traverse(ast, {
    Program (path) {
      path.scope.rename('wx', 'Taro')
    },
    CallExpression (path) {
      const callee = path.get('callee')
      if (callee.isIdentifier({ name: 'Page' })) {
        classDecl = parsePage(path)!
        path.insertAfter(classDecl)
        path.remove()
        path.stop()
      }
    }
  })

  const taroComponentsImport = buildImportStatement('@tarojs/components', [...usedComponents])
  const taroImport = buildImportStatement('@tarojs/taro', [], 'Taro')
  ast.program.body.unshift(taroComponentsImport, taroImport)
}

const defaultClassName = 'C'

function parsePage (path: NodePath<t.CallExpression>) {
  const arg = path.get('arguments')[0]
  if (!arg || !arg.isObjectExpression()) {
    return
  }
  const props = arg.get('properties')
  const properties = props.filter(p => !p.isSpreadProperty()) as NodePath<t.ObjectProperty | t.ObjectMethod>[]
  if (properties.length !== props.length) {
    throw new Error('不支持编译在 Page 对象中使用解构(`...` spread property)语法')
  }

  const classBody = properties.map(prop => {
    const key = prop.get('key')
    const value = prop.get('value')
    if (!key.isIdentifier()) {
      throw codeFrameError(key.node, 'Page 对象的键值只能是字符串')
    }
    const name = key.node.name
    if (name === 'data') {
      return t.classProperty(t.identifier('state'), value.node)
    }
    if (PageLifecycle.has(name)) {
      const lifecycle = PageLifecycle.get(name)!
      return t.classMethod('method', t.identifier(lifecycle), [], value.node as any)
    }
    if (prop.isObjectMethod()) {
      const body = prop.get('body')
      return t.classProperty(t.identifier(name), t.arrowFunctionExpression([], body.node))
    }
    return t.classProperty(t.identifier(name), value.isFunctionExpression() ? t.arrowFunctionExpression(value.node.params, value.node.body) : value.node)
  })

  return t.classDeclaration(
    t.identifier(defaultClassName),
    t.memberExpression(t.identifier('Taro'), t.identifier('Component')),
    t.classBody(classBody)
  )
}

// function renameSetData (path: NodePath<t.CallExpression>, guard?: (node: NodePath<t.Node>) => node is NodePath<t.Identifier>) {
//   const callee = path.get('callee')
//   if (callee.isMemberExpression() && callee.get('property').isIdentifier({ name: 'setData' })) {
//     const obj = callee.get('object')
//     const property = callee.get('property')
//     if (obj.isThisExpression()) {
//       property.replaceWith(t.identifier('setState'))
//       return
//     }
//   }
// }
