import * as t from 'babel-types'
import traverse, { NodePath } from 'babel-traverse'
import { transform } from 'babel-core'
import * as template from 'babel-template'
import { buildImportStatement, codeFrameError, buildRender } from './utils'
import { WXS } from './wxml'
import { PageLifecycle, Lifecycle } from './lifecycle'
import { usedComponents } from './global'

const buildDecorator = (type: string) => t.decorator(
  t.callExpression(t.identifier('withWeapp'), [t.stringLiteral(type)])
)

export function parseScript (
  script?: string,
  returned?: t.Expression,
  json?: t.ObjectExpression,
  wxses: WXS[] = []
) {
  script = script || 'Page({})'
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
            t.memberExpression(t.identifier('Taro'), callee.node)
          )
        }
      }
      if (callee.isMemberExpression()) {
        const object = callee.get('object')
        if (object.isIdentifier({ name: 'wx' })) {
          object.replaceWith(t.identifier('Taro'))
        }
      }
      if (
        callee.isIdentifier({ name: 'Page' }) ||
        callee.isIdentifier({ name: 'Component' }) ||
        callee.isIdentifier({ name: 'App' })
      ) {
        const componentType = callee.node.name
        classDecl = parsePage(
          path,
          returned || t.nullLiteral(),
          json,
          componentType
        )!
        if (componentType !== 'App') {
          classDecl.decorators = [buildDecorator(componentType)]
        }
        path.insertAfter(t.exportDefaultDeclaration(classDecl))
        path.remove()
      }
    }
  })

  const taroComponentsImport = buildImportStatement('@tarojs/components', [
    ...usedComponents
  ])
  const taroImport = buildImportStatement('@tarojs/taro', [], 'Taro')
  const withWeappImport = buildImportStatement(
    '@tarojs/with-weapp',
    [],
    'withWeapp'
  )
  ast.program.body.unshift(
    taroComponentsImport,
    taroImport,
    withWeappImport,
    ...wxses.map(wxs => buildImportStatement(wxs.src, [], wxs.module))
  )

  return ast
}

const defaultClassName = '_C'

function parsePage (
  path: NodePath<t.CallExpression>,
  returned: t.Expression,
  json?: t.ObjectExpression,
  componentType?: string
) {
  const stateKeys: string[] = []
  const propsKeys: string[] = []
  const arg = path.get('arguments')[0]
  if (!arg || !arg.isObjectExpression()) {
    return
  }
  const props = arg.get('properties')
  const properties = props.filter(p => !p.isSpreadProperty()) as NodePath<
    t.ObjectProperty | t.ObjectMethod
  >[]
  if (properties.length !== props.length) {
    throw new Error(
      '不支持编译在 Page 对象中使用解构(`...` spread property)语法'
    )
  }

  let classBody = properties.map(prop => {
    const key = prop.get('key')
    const value = prop.get('value')
    const params = prop.isObjectMethod()
      ? prop.node.params
      : value.isFunctionExpression() || value.isArrowFunctionExpression()
        ? value.node.params
        : []
    if (!key.isIdentifier()) {
      throw codeFrameError(key.node, 'Page 对象的键值只能是字符串')
    }
    const name = key.node.name
    if (name === 'data') {
      if (value.isObjectExpression()) {
        value
          .get('properties')
          .map(p => p.node)
          .forEach(prop => {
            if (t.isObjectProperty(prop)) {
              if (t.isStringLiteral(prop.key)) {
                stateKeys.push(prop.key.value)
              }
              if (t.isIdentifier(prop.key)) {
                stateKeys.push(prop.key.name)
              }
            }
          })
      }
      return t.classProperty(t.identifier('state'), value.node)
    }
    if (name === 'properties') {
      if (value.isObjectExpression()) {
        value
          .get('properties')
          .map(p => p.node)
          .forEach(prop => {
            if (t.isObjectProperty(prop)) {
              if (t.isStringLiteral(prop.key)) {
                propsKeys.push(prop.key.value)
              }
              if (t.isIdentifier(prop.key)) {
                propsKeys.push(prop.key.name)
              }
            }
          })
      }
      return false
    }
    if (PageLifecycle.has(name)) {
      const lifecycle = PageLifecycle.get(name)!
      const node = value.node as
        | t.FunctionExpression
        | t.ArrowFunctionExpression
      return t.classMethod(
        'method',
        t.identifier(lifecycle),
        params,
        node ? node.body as t.BlockStatement : (prop.get('body') as any).node
      )
    }
    if (prop.isObjectMethod()) {
      const body = prop.get('body')
      return t.classProperty(
        t.identifier(name),
        t.arrowFunctionExpression(params, body.node)
      )
    }
    return t.classProperty(
      t.identifier(name),
      value.isFunctionExpression() || value.isArrowFunctionExpression()
        ? t.arrowFunctionExpression(value.node.params, value.node.body)
        : value.node
    )
  })

  if (json && t.isObjectExpression(json)) {
    classBody.push(t.classProperty(t.identifier('config'), json))
  }

  if (componentType === 'App') {
    let hasWillMount = false
    const globalData = template(`this.$app.globalData = this.globalData`)()
    for (const method of classBody) {
      if (!method) {
        continue
      }
      if (!t.isClassMethod(method)) {
        continue
      }
      if (t.isIdentifier(method.key, { name: Lifecycle.componentWillMount })) {
        hasWillMount = true
        method.body.body.unshift(globalData)
      }
    }
    if (!hasWillMount) {
      classBody.push(
        t.classMethod(
          'method',
          t.identifier(Lifecycle.componentWillMount),
          [],
          t.blockStatement([globalData])
        )
      )
    }
  }

  const renderFunc = buildRender(returned, stateKeys, propsKeys)

  return t.classDeclaration(
    t.identifier(componentType === 'App' ? 'App' : defaultClassName),
    t.memberExpression(t.identifier('Taro'), t.identifier('Component')),
    t.classBody(
      (classBody.filter(Boolean) as t.ClassMethod[]).concat(renderFunc)
    ),
    []
  )
}
