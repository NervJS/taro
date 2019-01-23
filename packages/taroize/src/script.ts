import * as t from 'babel-types'
import traverse, { NodePath, Visitor } from 'babel-traverse'
import * as template from 'babel-template'
import { buildImportStatement, codeFrameError, buildRender, buildBlockElement, parseCode } from './utils'
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
  wxses: WXS[] = [],
  refId?: Set<string>
) {
  script = script || 'Page({})'
  if (t.isJSXText(returned as any)) {
    const block = buildBlockElement()
    block.children = [returned as any]
    returned = block
  }
  let ast = parseCode(script)
  let classDecl!: t.ClassDeclaration
  let foundWXInstance = false
  const vistor: Visitor = {
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
        foundWXInstance = true
        const componentType = callee.node.name
        classDecl = parsePage(
          path,
          returned || t.nullLiteral(),
          json,
          componentType,
          refId
        )!
        if (componentType !== 'App') {
          classDecl.decorators = [buildDecorator(componentType)]
        }
        ast.program.body.push(
          classDecl,
          t.exportDefaultDeclaration(t.identifier(componentType !== 'App' ? defaultClassName : 'App'))
        )
        // path.insertAfter(t.exportDefaultDeclaration(t.identifier(defaultClassName)))
        path.remove()
      }
    }
  }

  traverse(ast, vistor)

  if (!foundWXInstance) {
    ast = parseCode(script + ';Component({})')
    traverse(ast, vistor)
  }

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
    ...wxses.filter(wxs => !wxs.src.startsWith('./wxs__')).map(wxs => buildImportStatement(wxs.src, [], wxs.module))
  )

  return ast
}

const defaultClassName = '_C'

const staticProps = ['externalClasses', 'relations', 'options']

function parsePage (
  pagePath: NodePath<t.CallExpression>,
  returned: t.Expression,
  json?: t.ObjectExpression,
  componentType?: string,
  refId?: Set<string>
) {
  const stateKeys: string[] = []
  let methods: NodePath<
    t.ObjectProperty | t.ObjectMethod
  >[] = []
  pagePath.traverse({
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
        if (object.isIdentifier()) {
          const methodName = object.node.name
          const hooks = ['onLoad', 'onShow', 'onReady', 'onHide', 'onUnload', 'onError', 'onLaunch']
          hooks.forEach(hook => {
            if (methodName === hook) {
              object.replaceWith(t.identifier(PageLifecycle.get(methodName)!))
            }
          })
          if (methodName === 'wx') {
            object.replaceWith(t.identifier('Taro'))
          }
        }
      }
    },
    ObjectProperty (path) {
      const { key, value } = path.node
      if (!t.isIdentifier(key, { name: 'methods' }) || path.parentPath !== pagePath.get('arguments')[0] || !t.isObjectExpression(value)) {
        return
      }
      methods = path.get('value.properties') as NodePath<
        t.ObjectProperty | t.ObjectMethod
      >[]
      path.remove()
    }
  })
  if (refId) {
    refId.forEach(id => {
      if (!stateKeys.includes(id)) {
        stateKeys.push(id)
      }
    })
  }
  const propsKeys: string[] = []
  const arg = pagePath.get('arguments')[0]
  if (!arg || !arg.isObjectExpression()) {
    throw codeFrameError(arg.node, `${componentType || '组件'} 的第一个参数必须是一个对象才能转换。`)
  }
  const defaultProps: { name: string, value: any }[] = []
  const props = arg.get('properties')
  const properties = props.filter(p => !p.isSpreadProperty()).concat(methods) as NodePath<
    t.ObjectProperty | t.ObjectMethod
  >[]

  let classBody = properties.map(prop => {
    const key = prop.get('key')
    const value = prop.get('value')
    const params = prop.isObjectMethod()
      ? prop.node.params
      : value.isFunctionExpression() || value.isArrowFunctionExpression()
        ? value.node.params
        : []
    const isAsync = prop.isObjectMethod()
      ? prop.node.async
      : value.isFunctionExpression() || value.isArrowFunctionExpression()
        ? value.node.async
        : false
    if (!key.isIdentifier()) {
      throw codeFrameError(key.node, 'Page 对象的键值只能是字符串')
    }
    const name = key.node.name
    const currentStateKeys: string[] = []
    if (name === 'data') {
      if (value.isObjectExpression()) {
        value
          .get('properties')
          .map(p => p.node)
          .forEach(prop => {
            if (t.isObjectProperty(prop)) {
              if (t.isStringLiteral(prop.key)) {
                currentStateKeys.push(prop.key.value)
              }
              if (t.isIdentifier(prop.key)) {
                currentStateKeys.push(prop.key.name)
              }
            }
          })
      }
      return t.classProperty(t.identifier('state'), value.node)
    }
    if (name === 'properties') {
      const observeProps: { name: string, observer: any }[] = []
      if (value.isObjectExpression()) {
        value
          .get('properties')
          .map(p => p.node)
          .forEach(prop => {
            if (t.isObjectProperty(prop)) {
              let propKey: string | null = null
              if (t.isStringLiteral(prop.key)) {
                propKey = prop.key.value
              }
              if (t.isIdentifier(prop.key)) {
                propKey = prop.key.name
                // propsKeys.push(prop.key.name)
              }
              if (t.isObjectExpression(prop.value) && propKey) {
                for (const p of prop.value.properties) {
                  if (t.isObjectProperty(p)) {
                    let key: string | null = null
                    if (t.isStringLiteral(p.key)) {
                      key = p.key.value
                    }
                    if (t.isIdentifier(p.key)) {
                      key = p.key.name
                    }
                    if (key === 'value') {
                      defaultProps.push({
                        name: propKey,
                        value: p.value
                      })
                    } else if (key === 'observer') {
                      observeProps.push({
                        name: propKey,
                        observer: p.value
                      })
                    }
                  }
                  if (t.isObjectMethod(p) && t.isIdentifier(p.key, { name: 'observer' })) {
                    observeProps.push({
                      name: propKey,
                      observer: t.arrowFunctionExpression(p.params, p.body, p.async)
                    })
                  }
                }
              }
              if (propKey) {
                propsKeys.push(propKey)
              }
            }
          })
      }
      currentStateKeys.forEach(s => {
        if (propsKeys.includes(s)) {
          throw new Error(`当前 Component 定义了重复的 data 和 properites: ${s}`)
        }
      })
      stateKeys.push(...currentStateKeys)
      return t.classProperty(t.identifier('_observeProps'), t.arrayExpression(
        observeProps.map(p => t.objectExpression([
          t.objectProperty(
            t.identifier('name'),
            t.stringLiteral(p.name)
          ),
          t.objectProperty(
            t.identifier('observer'),
            p.observer
          )
        ]))
      ))
    }
    if (PageLifecycle.has(name)) {
      const lifecycle = PageLifecycle.get(name)!
      const node = value.node as
        | t.FunctionExpression
        | t.ArrowFunctionExpression
      const method = t.classMethod(
        'method',
        t.identifier(lifecycle),
        params,
        node ? node.body as t.BlockStatement : (prop.get('body') as any).node
      )
      method.async = isAsync
      return method
    }
    if (prop.isObjectMethod()) {
      const body = prop.get('body')
      return t.classProperty(
        t.identifier(name),
        t.arrowFunctionExpression(params, body.node, isAsync)
      )
    }
    const classProp = t.classProperty(
      t.identifier(name),
      value.isFunctionExpression() || value.isArrowFunctionExpression()
        ? t.arrowFunctionExpression(value.node.params, value.node.body, isAsync)
        : value.node
    ) as any

    if (staticProps.includes(name)) {
      classProp.static = true
    }

    return classProp
  })

  if (defaultProps.length) {
    let classProp = t.classProperty(t.identifier('defaultProps'), t.objectExpression(
      defaultProps.map(p => t.objectProperty(t.identifier(p.name), p.value))
    )) as any
    classProp.static = true
    classBody.unshift(classProp)
  }

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
      classBody.concat(renderFunc)
    ),
    []
  )
}
