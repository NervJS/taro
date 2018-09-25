import * as t from 'babel-types'
import traverse, { NodePath } from 'babel-traverse'
import { transform } from 'babel-core'
import { buildImportStatement, codeFrameError } from './utils'
import { usedComponents } from './wxml'
import { PageLifecycle } from './lifecycle'

export function parseScript (script: string, returned: t.Expression, json?: t.ObjectExpression) {
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
    BlockStatement (path) {
      path.scope.rename('wx', 'Taro')
    },
    CallExpression (path) {
      const callee = path.get('callee')
      if (callee.isIdentifier()) {
        const name = callee.node.name
        if (name === 'getApp' || name === 'getCurrentPages') {
          callee.replaceWith(
            t.memberExpression(
              t.identifier('Taro'),
              callee.node
            )
          )
        }
      }
      if (callee.isMemberExpression()) {
        const object = callee.get('object')
        if (object.isIdentifier({ name: 'wx' })) {
          object.replaceWith(t.identifier('Taro'))
        }
      }
      if (callee.isIdentifier({ name: 'Page' }) || callee.isIdentifier({ name: 'Component' })) {
        classDecl = parsePage(path, returned, json)!
        path.insertAfter(
          t.exportDefaultDeclaration(classDecl)
        )
        path.remove()
      }
    }
  })

  const taroComponentsImport = buildImportStatement('@tarojs/components', [...usedComponents])
  const taroImport = buildImportStatement('@tarojs/taro', [], 'Taro')
  ast.program.body.unshift(taroComponentsImport, taroImport)

  return ast
}

function buildRender (returned: t.Expression) {
  const stateDecl = t.variableDeclaration('const', [t.variableDeclarator(
    t.objectPattern(stateKeys.map(s => t.objectProperty(t.identifier(s), t.identifier(s))) as any),
    t.memberExpression(t.thisExpression(), t.identifier('state'))
  )])

  const returnStatement = t.returnStatement(returned)
  return t.classMethod('method', t.identifier('render'), [], t.blockStatement([
    stateDecl,
    returnStatement
  ]))
}

const defaultClassName = 'C'

const stateKeys: string[] = []

function parsePage (path: NodePath<t.CallExpression>, returned: t.Expression, json?: t.ObjectExpression) {
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
      if (value.isObjectExpression()) {
        value.get('properties').map(p => p.node).forEach(prop => {
          if (t.isObjectProperty(prop) && t.isIdentifier(prop.key)) {
            stateKeys.push(prop.key.name)
          }
        })
      }
      return t.classProperty(t.identifier('state'), value.node)
    }
    if (PageLifecycle.has(name)) {
      const lifecycle = PageLifecycle.get(name)!
      const node = value.node as t.FunctionExpression | t.ArrowFunctionExpression
      return t.classMethod('method', t.identifier(lifecycle), [], node.body as any)
    }
    if (prop.isObjectMethod()) {
      const body = prop.get('body')
      return t.classProperty(t.identifier(name), t.arrowFunctionExpression([], body.node))
    }
    return t.classProperty(t.identifier(name), value.isFunctionExpression() ? t.arrowFunctionExpression(value.node.params, value.node.body) : value.node)
  })

  if (json && t.isObjectExpression(json)) {
    classBody.push(
      t.classProperty(
        t.identifier('config'),
        json
      )
    )
  }

  const renderFunc = buildRender(returned)

  return t.classDeclaration(
    t.identifier(defaultClassName),
    t.memberExpression(t.identifier('Taro'), t.identifier('Component')),
    t.classBody(classBody.concat(renderFunc)),
    []
  )
}
