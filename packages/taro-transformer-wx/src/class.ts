import { NodePath } from 'babel-traverse'
import * as t from 'babel-types'
import {
  codeFrameError,
  hasComplexExpression,
  generateAnonymousState,
  findMethodName,
  pathResolver,
  createRandomLetters
} from './utils'
import { DEFAULT_Component_SET } from './constant'
import { kebabCase } from 'lodash'
import { RenderParser } from './render'
import generate from 'babel-generator'

type ClassMethodsMap = Map<string, NodePath<t.ClassMethod | t.ClassProperty>>

function buildConstructor () {
  const ctor = t.classMethod(
    'constructor',
    t.identifier('constructor'),
    [t.identifier('props')],
    t.blockStatement([
      t.expressionStatement(
        t.callExpression(t.identifier('super'), [
          t.identifier('props')
        ])
      )
    ])
  )
  return ctor
}

interface Result {
  template: string
  components: {
    name: string,
    path: string
  }[]
}

class Transformer {
  public result: Result = {
    template: '',
    components: []
  }
  private methods: ClassMethodsMap = new Map()
  private initState: Set<string> = new Set()
  private jsxReferencedIdentifiers = new Set<t.Identifier>()
  private customComponents: Map<string, string> = new Map()
  private anonymousMethod: Map<string, string> = new Map()
  private renderMethod: null | NodePath<t.ClassMethod> = null
  private moduleNames: string[]
  private classPath: NodePath<t.ClassDeclaration>
  private customComponentNames = new Set<string>()
  private usedState = new Set<string>()
  private loopStateName: Map<NodePath<t.CallExpression>, string> = new Map()
  private customComponentData: Array<t.ObjectProperty> = []
  private componentProperies = new Set<string>()
  private sourcePath: string

  constructor (
    path: NodePath<t.ClassDeclaration>,
    sourcePath: string
  ) {
    this.classPath = path
    this.sourcePath = sourcePath
    this.moduleNames = Object.keys(path.scope.getAllBindings('module'))
    this.compile()
  }

  traverse () {
    const self = this
    self.classPath.traverse({
      ClassMethod (path) {
        const node = path.node
        if (t.isIdentifier(node.key)) {
          const name = node.key.name
          self.methods.set(name, path)
          if (name === 'render') {
            self.renderMethod = path
          }
          if (name === 'constructor') {
            path.traverse({
              AssignmentExpression (p) {
                if (
                  t.isMemberExpression(p.node.left) &&
                  t.isThisExpression(p.node.left.object) &&
                  t.isIdentifier(p.node.left.property) &&
                  p.node.left.property.name === 'state' &&
                  t.isObjectExpression(p.node.right)
                ) {
                  const properties = p.node.right.properties
                  properties.forEach(p => {
                    if (t.isObjectProperty(p) && t.isIdentifier(p.key)) {
                      self.initState.add(p.key.name)
                    }
                  })
                }
              }
            })
          }
        }
      },
      ClassProperty (path) {
        const { key: { name }, value } = path.node
        if (t.isArrowFunctionExpression(value) || t.isFunctionExpression(value)) {
          self.methods.set(name, path)
        }
        if (name === 'state' && t.isObjectExpression(value)) {
          value.properties.forEach(p => {
            if (t.isObjectProperty(p)) {
              if (t.isIdentifier(p.key)) {
                self.initState.add(p.key.name)
              }
            }
          })
        }
      },
      JSXExpressionContainer (path) {
        path.traverse({
          MemberExpression (path) {
            const sibling = path.getSibling('property')
            if (
              path.get('object').isThisExpression() &&
              path.get('property').isIdentifier({ name: 'props' }) &&
              sibling.isIdentifier()
            ) {
              const attr = path.findParent(p => p.isJSXAttribute()) as NodePath<t.JSXAttribute>
              const isFunctionProp = attr && typeof attr.node.name.name === 'string' && attr.node.name.name.startsWith('on')
              if (!isFunctionProp) {
                self.usedState.add(sibling.node.name)
              }
            }
          }
        })

        const expression = path.get('expression') as NodePath<t.Expression>
        const scope = self.renderMethod && self.renderMethod.scope || path.scope
        const calleeExpr = expression.get('callee')
        if (
          hasComplexExpression(expression) &&
          !(calleeExpr &&
            calleeExpr.isMemberExpression() &&
            calleeExpr.get('object').isMemberExpression() &&
            calleeExpr.get('property').isIdentifier({ name: 'bind' })) // is not bind
        ) {
          generateAnonymousState(scope, expression, self.jsxReferencedIdentifiers)
        }
        const attr = path.findParent(p => p.isJSXAttribute()) as NodePath<t.JSXAttribute>
        if (!attr) return
        const key = attr.node.name
        const value = attr.node.value
        if (t.isJSXIdentifier(key) && key.name.startsWith('on') && t.isJSXExpressionContainer(value)) {
          const expr = value.expression
          if (t.isCallExpression(expr) && t.isMemberExpression(expr.callee) && t.isIdentifier(expr.callee.property, { name: 'bind' })) {
            self.buildAnonymousFunc(attr, expr, true)
          } else if (t.isMemberExpression(expr)) {
            self.buildAnonymousFunc(attr, expr as any, false)
          } else {
            throw codeFrameError(expr.loc, '事件传参只能在类作用域下的值(this.handleXX || this.props.handleXX)，或使用 bind。')
          }
        }
      },
      JSXElement (path) {
        const id = path.node.openingElement.name
        if (
          t.isJSXIdentifier(id) &&
          !DEFAULT_Component_SET.has(id.name) &&
          self.moduleNames.indexOf(id.name) !== -1
        ) {
          const name = id.name
          const binding = self.classPath.scope.getBinding(name)
          if (binding && t.isImportDeclaration(binding.path.parent)) {
            self.customComponents.set(name, binding.path.parent.source.value)
          }
        }
      },
      MemberExpression (path) {
        const object = path.get('object')
        const property = path.get('property')
        if (
          !(
            object.isThisExpression() && property.isIdentifier({ name: 'props' })
          )
        ) {
          return
        }

        const parentPath = path.parentPath
        if (parentPath.isMemberExpression()) {
          const siblingProp = parentPath.get('property')
          if (siblingProp.isIdentifier()) {
            const name = siblingProp.node.name
            if (name === 'children') {
              parentPath.replaceWith(t.jSXElement(t.jSXOpeningElement(t.jSXIdentifier('slot'), [], true), t.jSXClosingElement(t.jSXIdentifier('slot')), [], true))
            } else {
              self.componentProperies.add(siblingProp.node.name)
            }
            const grandParentPath = parentPath.parentPath
            if (grandParentPath.isCallExpression()) {
              const args = grandParentPath.node.arguments
              grandParentPath.replaceWith(
                t.callExpression(
                  t.memberExpression(t.thisExpression(), t.identifier('__triggerPropsFn')),
                  [t.stringLiteral(name), t.arrayExpression(args)]
                )
              )
            }
          }
        } else if (parentPath.isVariableDeclarator()) {
          const siblingId = parentPath.get('id')
          if (siblingId.isObjectPattern()) {
            const properties = siblingId.node.properties
            for (const prop of properties) {
              if (t.isRestProperty(prop)) {
                throw codeFrameError(prop.loc, 'this.props 不支持使用 rest property 语法，请把每一个 prop 都单独列出来')
              } else if (t.isIdentifier(prop.key)) {
                self.componentProperies.add(prop.key.name)
              }
            }
          }
        }
      }
    })
  }

  buildAnonymousFunc = (attr: NodePath<t.JSXAttribute>, expr: t.CallExpression, isBind = false) => {
    const { code } = generate(expr)
    if (code.startsWith('this.props')) {
      const methodName = findMethodName(expr)
      const hasMethodName = this.anonymousMethod.has(methodName) || !methodName
      const funcName = hasMethodName ? this.anonymousMethod.get(methodName)! : `func__${createRandomLetters(5)}`
      this.anonymousMethod.set(methodName, funcName)
      const newVal = isBind
        ? t.callExpression(t.memberExpression(t.memberExpression(t.thisExpression(), t.identifier(funcName)), t.identifier('bind')), expr.arguments || [])
        : t.memberExpression(t.thisExpression(), t.identifier(funcName))
      attr.get('value.expression').replaceWith(newVal)
      this.methods.set(funcName, null as any)
      this.componentProperies.add(methodName)
      if (hasMethodName) {
        return
      }
      const method = t.classMethod('method', t.identifier(funcName), [], t.blockStatement([
        t.expressionStatement(t.callExpression(
          t.memberExpression(t.thisExpression(), t.identifier('__triggerPropsFn')),
          [t.stringLiteral(methodName), t.arrayExpression([t.spreadElement(t.identifier('arguments'))])]
        ))
      ]))

      this.classPath.node.body.body = this.classPath.node.body.body.concat(method)
    }
  }

  setComponents () {
    this.customComponents.forEach((path, name) => {
      this.result.components.push({
        path: pathResolver(path, this.sourcePath),
        name: kebabCase(name)
      })
    })
  }

  resetConstructor () {
    if (!this.methods.has('constructor')) {
      const ctor = buildConstructor()
      this.classPath.node.body.body.unshift(ctor)
    }
  }

  parseRender () {
    if (this.renderMethod) {
      this.result.template = this.result.template
        + new RenderParser(
          this.renderMethod,
          this.methods,
          this.initState,
          this.jsxReferencedIdentifiers,
          this.usedState,
          this.loopStateName,
          this.customComponentNames,
          this.customComponentData
        ).outputTemplate
    } else {
      throw codeFrameError(this.classPath.node.loc, '没有定义 render 方法')
    }
  }

  setProperies () {
    const properties: t.ObjectProperty[] = []
    this.componentProperies.forEach((propName) => {
      properties.push(
        t.objectProperty(t.stringLiteral(propName), t.nullLiteral())
      )
    })
    let classProp = t.classProperty(
      t.identifier('properties'),
      t.objectExpression(properties)
    ) as any
    classProp.static = true
    this.classPath.node.body.body.unshift(classProp)
  }

  compile () {
    this.traverse()
    this.setComponents()
    this.resetConstructor()
    this.setProperies()
    this.parseRender()
  }
}

export { Transformer }
