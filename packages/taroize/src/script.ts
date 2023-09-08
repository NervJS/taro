import traverse, { NodePath, Visitor } from '@babel/traverse'
import * as t from '@babel/types'

import { usedComponents } from './global'
import { buildBlockElement, buildImportStatement, buildRender, codeFrameError, parseCode } from './utils'
import { WXS } from './wxml'

const defaultClassName = '_C'

const buildDecorator = (id: t.Identifier | t.ObjectExpression, isApp = false) => {
  const args: any[] = [id]
  isApp && args.push(t.booleanLiteral(true))
  return t.decorator(t.callExpression(t.identifier('withWeapp'), args))
}

export function replaceIdentifier (callee: NodePath<t.Node>) {
  if (callee.isIdentifier()) {
    const name = callee.node.name
    if (name === 'getApp' || name === 'getCurrentPages') {
      callee.replaceWith(t.memberExpression(t.identifier('Taro'), callee.node))
    }
  }
}

// babel 6升级babel 7适配
export function replaceMemberExpression (callee: NodePath<t.Node>) {
  if (callee.isMemberExpression()) {
    const object = callee.get('object') as NodePath<t.Identifier>
    if (t.isIdentifier(object.node, { name: 'wx' })) {
      object.replaceWith(t.identifier('Taro'))
    }
  }
}

export function parseScript (
  script?: string,
  scriptPath?: string,
  returned?: t.Expression,
  wxses: WXS[] = [],
  refId?: Set<string>,
  isApp = false
) {
  script = script || 'Page({})'
  if (t.isJSXText(returned as any)) {
    const block = buildBlockElement()
    block.children = [returned as any]
    returned = block
  }
  let ast = parseCode(script, scriptPath as string)
  let classDecl!: t.ClassDeclaration
  let foundWXInstance = false
  const vistor: Visitor = {
    BlockStatement (path) {
      path.scope.rename('wx', 'Taro')
    },
    Identifier (path) {
      if (path.isReferenced() && path.node.name === 'wx') {
        path.replaceWith(t.identifier('Taro'))
      }
    },
    CallExpression (path) {
      const callee = path.get('callee')
      replaceIdentifier(callee as NodePath<t.Node>)
      replaceMemberExpression(callee as NodePath<t.Node>)
      if (
        callee.isIdentifier({ name: 'Page' }) ||
        callee.isIdentifier({ name: 'Component' }) ||
        callee.isIdentifier({ name: 'App' })
      ) {
        foundWXInstance = true
        const componentType = callee.node.name
        classDecl = parsePage(path, returned || t.nullLiteral(), componentType, refId, wxses, isApp)
        ast.program.body.push(
          classDecl,
          t.exportDefaultDeclaration(t.identifier(componentType !== 'App' ? defaultClassName : 'App'))
        )
        // path.insertAfter(t.exportDefaultDeclaration(t.identifier(defaultClassName)))
        path.remove()
      }
    },
    VariableDeclaration (path) {
      const variableDeclarator = path.node.declarations[0]
      variableDeclarator.init
      if (t.isVariableDeclarator(variableDeclarator)) {
        // 去除commonjs转es6生成的var module = {exports: {},}
        if (
          t.isIdentifier(variableDeclarator.id) &&
          variableDeclarator.id.name === 'module' &&
          t.isObjectExpression(variableDeclarator.init)
        ) {
          const init: t.ObjectExpression = variableDeclarator.init
          if (
            init.properties &&
            init.properties.length > 0 &&
            t.isObjectProperty(init.properties[0]) &&
            t.isIdentifier(init.properties[0].key) &&
            init.properties[0].key.name === 'exports'
          ) {
            path.remove()
          }
        }
        // 去除commonjs转es6生成的var exports = module.exports
        if (
          t.isIdentifier(variableDeclarator.id) &&
          variableDeclarator.id.name === 'exports' &&
          t.isMemberExpression(variableDeclarator.init)
        ) {
          const init: t.MemberExpression = variableDeclarator.init
          if (
            t.isIdentifier(init.object) &&
            init.object.name === 'module' &&
            t.isIdentifier(init.property) &&
            init.property.name === 'exports'
          ) {
            path.remove()
          }
        }
      }
    },
    ExportDefaultDeclaration (path) {
      const declaration = path.node.declaration
      // 去除commonjs转es6生成的export default module.exports
      if (t.isMemberExpression(declaration)) {
        if (
          t.isIdentifier(declaration.object) &&
          declaration.object.name === 'module' &&
          t.isIdentifier(declaration.property) &&
          declaration.property.name === 'exports'
        ) {
          path.remove()
        }
      }
    },
  }

  traverse(ast, vistor)

  if (!foundWXInstance) {
    ast = parseCode(script + ';Component({})')
    traverse(ast, vistor)
  }

  const taroComponentsImport = buildImportStatement('@tarojs/components', [...usedComponents])
  const taroImport = buildImportStatement('@tarojs/taro', [], 'Taro')
  const reactImport = buildImportStatement('react', [], 'React')
  const withWeappImport = buildImportStatement('@tarojs/with-weapp', [], 'withWeapp')
  ast.program.body.unshift(
    taroComponentsImport,
    reactImport,
    taroImport,
    withWeappImport,
    ...wxses.filter((wxs) => !wxs.src.startsWith('./wxs__')).map((wxs) => buildImportStatement(wxs.src, [], wxs.module))
  )

  return ast
}

function parsePage (
  pagePath: NodePath<t.CallExpression>,
  returned: t.Expression,
  componentType?: string,
  refId?: Set<string>,
  wxses?: WXS[],
  isApp = false
) {
  const stateKeys: string[] = []
  pagePath.traverse({
    CallExpression (path) {
      const callee = path.get('callee')
      replaceIdentifier(callee as NodePath<t.Node>)
      replaceMemberExpression(callee as NodePath<t.Node>)
    },
  })
  if (refId) {
    refId.forEach((id) => {
      if (!stateKeys.includes(id)) {
        stateKeys.push(id)
      }
    })
  }
  const propsKeys: string[] = []
  const arg = pagePath.get('arguments')[0]

  const classBody: any[] = []
  if (arg.isObjectExpression() || arg.isIdentifier()) {
    //
  } else {
    throw codeFrameError(arg.node, `${componentType || '组件'} 的第一个参数必须是一个对象或变量才能转换。`)
  }

  const wxsNames = new Set(wxses ? wxses.map((w) => w.module) : [])

  const renderFunc = buildRender(
    componentType === 'App'
      ? t.memberExpression(t.memberExpression(t.thisExpression(), t.identifier('props')), t.identifier('children'))
      : returned,
    stateKeys.filter((s) => !wxsNames.has(s)),
    propsKeys
  )

  const classDecl = t.classDeclaration(
    t.identifier(componentType === 'App' ? 'App' : defaultClassName),
    t.memberExpression(t.identifier('React'), t.identifier('Component')),
    t.classBody(classBody.concat(renderFunc)),
    []
  )

  classDecl.decorators = [buildDecorator(arg.node, isApp)]

  return classDecl
}
