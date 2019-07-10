import * as t from 'babel-types'
import traverse, { NodePath, Visitor } from 'babel-traverse'
import * as template from 'babel-template'
import { buildImportStatement, codeFrameError, buildRender, buildBlockElement, parseCode, isAliasThis, isValidVarName } from './utils'
import { WXS } from './wxml'
import { PageLifecycle, Lifecycle } from './lifecycle'
import { usedComponents, globals } from './global'

const defaultClassName = '_C'

const buildDecorator = (type: string, id?: string) => id ? t.decorator(
  t.callExpression(t.identifier('withWeapp'), [t.stringLiteral(type), t.identifier(id)])
) : t.decorator(
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
          refId,
          wxses
        )
        if (componentType !== 'App' && classDecl.decorators!.length === 0) {
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

const staticProps = ['externalClasses', 'relations', 'options']

function parsePage (
  pagePath: NodePath<t.CallExpression>,
  returned: t.Expression,
  json?: t.ObjectExpression,
  componentType?: string,
  refId?: Set<string>,
  wxses?: WXS[]
) {
  const stateKeys: string[] = []
  let weappConf: string | null = null
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
        const property = callee.get('property')
        if (object.isIdentifier()) {
          const objectName = object.node.name
          if (objectName === 'wx') {
            object.replaceWith(t.identifier('Taro'))
          }
        }

        let isThis = property.isThisExpression()

        if (property.isIdentifier() && object.isIdentifier()) {
          const propertyName = property.node.name
          const objectName = object.node.name
          if (PageLifecycle.has(propertyName) && isAliasThis(property, objectName)) {
            isThis = true
          }

          if (isThis && PageLifecycle.has(propertyName)) {
            property.replaceWith(t.identifier(PageLifecycle.get(propertyName)))
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

  let classBody: any = []
  if (arg.isObjectExpression()) {
    const defaultProps: { name: string, value: any }[] = []
    const props = arg.get('properties')
    const properties = props.filter(p => !p.isSpreadProperty()).concat(methods) as NodePath<
      t.ObjectProperty | t.ObjectMethod
    >[]

    classBody = properties.map(prop => {
      const key = prop.get('key')
      const value = prop.get('value')
      let params = prop.isObjectMethod()
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
                let propKey = ''
                if (t.isStringLiteral(prop.key)) {
                  propKey = prop.key.value
                }
                if (t.isIdentifier(prop.key)) {
                  propKey = prop.key.name
                }

                if (!isValidVarName(propKey)) {
                  throw codeFrameError(prop, `${propKey} 不是一个合法的 JavaScript 变量名`)
                }

                if (propKey) {
                  currentStateKeys.push(propKey)
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
                      if (!isValidVarName(propKey)) {
                        throw codeFrameError(prop, `${propKey} 不是一个合法的 JavaScript 变量名`)
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
        if (name === 'onLoad' && t.isIdentifier(params[0])) {
          params = [t.assignmentPattern(params[0] as t.Identifier, t.logicalExpression('||', t.memberExpression(
            t.memberExpression(
              t.thisExpression(),
              t.identifier('$router')
            ),
            t.identifier('params')
          ), t.objectExpression([])))]
        }
        if (prop.isObjectMethod()) {
          const body = prop.get('body')
          const cm = t.classMethod('method', t.identifier(lifecycle), params, body.node)
          cm.async = isAsync
          return cm
        }
        const node = value.node
        const method = t.isFunctionExpression(node) || t.isArrowFunctionExpression(node)
          ? t.classProperty(t.identifier(lifecycle), t.arrowFunctionExpression(params, node.body, isAsync))
          : t.classProperty(t.identifier(lifecycle), node)
        return method
      }
      let hasArguments = false
      prop.traverse({
        Identifier (path) {
          if (path.node.name === 'arguments') {
            hasArguments = true
            path.stop()
          }
        }
      })

      if (prop.isObjectMethod()) {
        const body = prop.get('body')
        if (hasArguments) {
          return t.classMethod('method', t.identifier(name), params, body.node)
        }
        return t.classProperty(
          t.identifier(name),
          t.arrowFunctionExpression(params, body.node, isAsync)
        )
      }

      if (hasArguments && (value.isFunctionExpression() || value.isArrowFunctionExpression())) {
        const method = t.classMethod('method', t.identifier(name), params, value.node.body as any)
        method.async = isAsync
        return method
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

    if (globals.hasCatchTrue) {
      classBody.push(t.classMethod('method', t.identifier('privateStopNoop'), [t.identifier('e')], t.blockStatement([
        t.expressionStatement(
          t.callExpression(
            t.memberExpression(t.identifier('e'), t.identifier('stopPropagation')),
            []
          )
        )
      ])))
    }

    if (defaultProps.length) {
      let classProp = t.classProperty(t.identifier('defaultProps'), t.objectExpression(
        defaultProps.map(p => t.objectProperty(t.identifier(p.name), p.value))
      )) as any
      classProp.static = true
      classBody.unshift(classProp)
    }
  } else if (arg.isIdentifier()) {
    weappConf = arg.node.name
  } else {
    throw codeFrameError(arg.node, `${componentType || '组件'} 的第一个参数必须是一个对象或变量才能转换。`)
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

  const wxsNames = new Set(wxses ? wxses.map(w => w.module) : [])

  const renderFunc = buildRender(returned, stateKeys.filter(s => !wxsNames.has(s)), propsKeys)

  const classDecl = t.classDeclaration(
    t.identifier(componentType === 'App' ? 'App' : defaultClassName),
    t.memberExpression(t.identifier('Taro'), t.identifier('Component')),
    t.classBody(
      classBody.concat(renderFunc)
    ),
    []
  )

  if (weappConf) {
    classDecl.decorators = [buildDecorator(componentType || 'Page', weappConf)]
  }

  return classDecl
}
