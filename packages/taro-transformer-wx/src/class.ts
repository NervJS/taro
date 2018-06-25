import { NodePath, Scope } from 'babel-traverse'
import * as t from 'babel-types'
import {
  codeFrameError,
  isNumeric,
  pathResolver,
  incrementId,
  createUUID,
  findFirstIdentifierFromMemberExpression,
  isArrayMapCallExpression,
  hasComplexExpression,
  generateAnonymousState
} from './utils'
import {
  buildRefTemplate
} from './jsx'
import { DEFAULT_Component_SET, INTERNAL_SAFE_GET, MAP_CALL_ITERATOR, INTERNAL_DYNAMIC } from './constant'
import { createHTMLElement } from './create-html-element'
import generate from 'babel-generator'
import { uniqBy } from 'lodash'
import { RenderParser } from './render'

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

interface LoopComponents {
  level?: number,
  name: string,
  parent: NodePath<t.CallExpression> | null,
  element: NodePath<t.JSXElement>
}

function resetThisState () {
  return t.expressionStatement(
    t.assignmentExpression(
      '=',
      t.memberExpression(t.thisExpression(), t.identifier('state')),
      t.callExpression(
        t.memberExpression(t.thisExpression(), t.identifier('_createData')),
        []
      )
    )
  )
}

interface Result {
  template: string
  components: {
    name: string,
    path: string
  }[]
}

type TypeLoopComponents = Map<NodePath<t.CallExpression>, Array<LoopComponents>>

class Transformer {
  public result: Result = {
    template: '',
    components: []
  }
  private methods: ClassMethodsMap = new Map()
  private initState: Set<string> = new Set()
  private jsxReferencedIdentifiers = new Set<t.Identifier>()
  private customComponents: Map<NodePath<t.JSXElement>, string> = new Map()
  private loopComponents: TypeLoopComponents = new Map()
  private renderMethod: null | NodePath<t.ClassMethod> = null
  private duplicateComponents: Map<string, number> = new Map()
  private moduleNames: string[]
  private classPath: NodePath<t.ClassDeclaration>
  private isRoot: boolean
  private location: string
  private componentSourceMap: Map<string, string[]>
  private customComponentNames = new Set<string>()
  private usedState = new Set<string>()

  constructor (
    path: NodePath<t.ClassDeclaration>,
    isRoot: boolean,
    componentSourceMap: Map<string, string[]>,
    location: string
  ) {
    this.classPath = path
    this.isRoot = isRoot
    this.componentSourceMap = componentSourceMap
    this.location = location
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
      },
      JSXElement (path) {
        const id = path.node.openingElement.name
        if (
          t.isJSXIdentifier(id) &&
          !DEFAULT_Component_SET.has(id.name) &&
          self.moduleNames.indexOf(id.name) !== -1
        ) {
          const callExpression = path.findParent(p => p.isCallExpression())
          if (isArrayMapCallExpression(callExpression)) {
            let parentCallExpression = callExpression.findParent(p => isArrayMapCallExpression(p))
            if (parentCallExpression) {
              while (true) {
                const temp = parentCallExpression.findParent(p => isArrayMapCallExpression(p))
                if (!temp) {
                  break
                }
                parentCallExpression = temp
              }
              const loopComponent: LoopComponents = {
                parent: callExpression,
                element: path,
                name: id.name
              }
              if (self.loopComponents.has(parentCallExpression as any)) {
                const loopComponents = self.loopComponents.get(parentCallExpression as any)!
                self.loopComponents.set(parentCallExpression as any, loopComponents.concat(loopComponent))
              } else {
                self.loopComponents.set(
                  parentCallExpression as any,
                  [loopComponent]
                )
              }
              // self.subLoopComponents.set(path, id.name)
            } else {
              const loopComponent: LoopComponents = {
                parent: null,
                element: path,
                name: id.name
              }
              if (self.loopComponents.has(callExpression as any)) {
                const loopComponents = self.loopComponents.get(callExpression as any)!
                self.loopComponents.set(callExpression as any, loopComponents.concat(loopComponent))
              } else {
                self.loopComponents.set(
                  callExpression as any,
                  [loopComponent]
                )
              }
              // self.topLoopComponents.set(path, id.name)
            }
          } else {
            self.customComponents.set(path, id.name)
          }
        }
      }
    })
  }

  renameImportJSXElement () {
    this.customComponents.forEach((name, path) => {
      if (this.duplicateComponents.has(name)) {
        const times = this.duplicateComponents.get(name)!
        this.duplicateComponents.set(name, times + 1)
        this.customComponents.set(path, `${name}_${times + 1}`)
      } else {
        this.duplicateComponents.set(name, 0)
      }
    })
  }

  setProps () {
    const body = this.classPath.node.body.body
    this.classPath.node.body.body = [
      build$PropsProperty(this.customComponents, body, this.jsxReferencedIdentifiers, this.renderMethod!.get('body').scope),
      build$ComponentsProperty(this.customComponents),
      ...body
    ]
  }

  handleLoopComponents () {
    const uid = incrementId()
    if (this.loopComponents.size > 0) {
      const properties: t.ObjectProperty[] = []
      this.loopComponents.forEach((loopComponents, rootCallExpression) => {
        let iterator
        let index
        let blockStatement: t.Statement[] = []
        const callee = rootCallExpression.node.callee
        const calleeCode = generate(callee).code
        let nodes: t.ObjectExpression[] = []
        loopComponents.forEach((loopComponent) => {
          const { name, element: component, parent } = loopComponent
          let subscript = ''
          const callExpression = component.findParent(p => isArrayMapCallExpression(p)) as NodePath<t.CallExpression>
          const mapFunction = callExpression.node.arguments[0]
          if (t.isFunctionExpression(mapFunction) || t.isArrowFunctionExpression(mapFunction)) {
            iterator = mapFunction.params[0]
            index = mapFunction.params[1]
          }
          // @TODO: children 同级的情况
          if (parent) {
            const callee = callExpression.node.callee
            const calleeCode = generate(callee).code
            subscript = calleeCode.split('.').slice(1, calleeCode.split('.').length).join('')
          }
          const node = this.generateTopLoopNodes(name, component, uid, subscript.slice(0, subscript.length - 3), parent, iterator.name, index)
          nodes.push(node)
        })
        let stateName = ''

        if (!isContainThis(rootCallExpression.node.callee)) {
          stateName = calleeCode.slice(0, calleeCode.length - 4)
        } else {
          // todo 找倒数第二个 callee id
          let ary = calleeCode.split('.')
          stateName = ary[1] === 'state' || ary[1] === 'props' || ary[1] === '__state' || ary[1] === '__props'
            ? ary[2] : ary[1]
        }

        const returnStatement = t.returnStatement(
          t.objectExpression([
            t.objectProperty(t.identifier('stateName'), t.stringLiteral(stateName)),
            t.objectProperty(t.identifier('loopComponents'), t.callExpression(t.identifier(INTERNAL_DYNAMIC), [
              t.thisExpression(), t.identifier('nodes'), buildInternalSafeGet(stateName), t.stringLiteral(stateName)
            ]))
          ])
        )
        const nodeDeclare = t.variableDeclaration('const', [
          t.variableDeclarator(t.identifier('nodes'), t.arrayExpression(
            nodes
          ))
        ])
        blockStatement.push(nodeDeclare)
        blockStatement.push(returnStatement)
        properties.push(
          // t.objectMethod('method', t.identifier(createUUID()), [], t.blockStatement(blockStatement)),
          t.objectProperty(t.identifier(createUUID()), t.arrowFunctionExpression([], t.blockStatement(blockStatement)))
        )
      })
      this.classPath.node.body.body.unshift(
        t.classProperty(
          t.identifier('$dynamicComponents'),
          t.objectExpression(properties)
        )
      )
    }
  }

  generateTopLoopNodes (
    name: string,
    component: NodePath<t.JSXElement>,
    uid: () => number,
    subscript: string,
    parent: NodePath<t.CallExpression> | null,
    iterator?: string,
    index?: string
  ) {
    const properties: t.ObjectProperty[] = []
    const self = this
    component.traverse({
      JSXAttribute (path) {
        const attr = path.node
        const name = attr.name as t.JSXIdentifier
        let value!: t.Expression
        if (name.name === 'key') {
          return
        }
        if (t.isJSXElement(attr.value)) {
          throw codeFrameError(attr.loc, 'JSX 参数不支持传入 JSX 元素')
        } else if (t.isJSXExpressionContainer(attr.value)) {
          const expresion = attr.value.expression
          const expresionPath = path.get('value').get('expression')
          if (t.isIdentifier(expresion)) {
            // TODO: 查看当前 value 的作用域
            let replacement: any = t.memberExpression(
              t.memberExpression(
                t.thisExpression(),
                t.identifier('state')
              ),
              expresion
            )
            if (expresion.name === iterator) {
              replacement = t.identifier(MAP_CALL_ITERATOR)
            } else if (expresion.name === index) {
              replacement = t.identifier(index)
            }
            expresionPath.replaceWith(replacement)
          } else if (t.isMemberExpression(expresion)) {
            if (!t.isThisExpression(expresion.object) && !isContainThis(expresion)) {
              let replacement: any = buildInternalSafeGet(generate(expresion).code, true)
              const id = findFirstIdentifierFromMemberExpression(expresion)
              if (id.name === iterator) {
                id.name = MAP_CALL_ITERATOR
                replacement = expresion
              }
              expresionPath.replaceWith(replacement)
            } else if (isNeedClassMethodWrapper(name.name, expresion)) {
              const id = `$$anonymousPropsFunction_${uid()}`
              path.get('value').get('expression').replaceWith(
                t.memberExpression(
                  t.thisExpression(),
                  t.identifier(id)
                )
              )
              self.classPath.node.body.body.push(buildAnonymousClassMethod(expresion, id))
            }
          } else {
            expresionPath.traverse({
              Identifier (path) {
                const { parent, node } = path
                if (!t.isMemberExpression(parent) && node.name !== INTERNAL_SAFE_GET) {
                  let replacement = t.memberExpression(
                    t.memberExpression(
                      t.thisExpression(),
                      t.identifier('state')
                    ),
                    node
                  )
                  if (node.name === iterator) {
                    replacement = t.memberExpression(
                      t.identifier(MAP_CALL_ITERATOR),
                      t.identifier(iterator)
                    )
                  } else if (node.name === index) {
                    replacement = t.memberExpression()
                  }
                  path.replaceWith(replacement)
                }
              },
              MemberExpression (path) {
                const { parent, node } = path
                if (!isContainThis(node)) {
                  let replacement: t.Expression = node
                  const id = findFirstIdentifierFromMemberExpression(node)
                  if (id.name === iterator) {
                    id.name = MAP_CALL_ITERATOR
                    replacement = node
                    // console.log('fuck')
                    // node.object = id
                  }
                  if (parent !== expresion && path.scope.hasBinding(
                    findFirstIdentifierFromMemberExpression(replacement).name
                  )) {
                    replacement = buildInternalSafeGet(generate(node).code)
                  }
                  if (replacement !== node) {
                    path.replaceWith(replacement)
                  }
                }
              }
            })
          }
          value = attr.value.expression
        } else {
          value = attr.value
        }
        properties.push(
          t.objectProperty(t.identifier(name.name), value === null ? t.booleanLiteral(true) : value)
        )
      }
    })
    const argsFunction = t.objectMethod('method', t.identifier('args'), [t.identifier(MAP_CALL_ITERATOR), t.identifier('index')],
      t.blockStatement(
        [
          t.returnStatement(t.objectExpression(properties))
        ]
      )
    )
    const objectName = t.objectProperty(t.identifier('name'), t.stringLiteral(name))
    const objectPath = t.objectProperty(t.identifier('path'), t.identifier(name))
    const objectSubscript = t.objectProperty(t.identifier('subscript'), t.stringLiteral(subscript))
    const object = t.objectExpression([
      objectName,
      objectPath,
      objectSubscript,
      argsFunction
    ])
    return parent
      ? t.objectExpression([t.objectProperty(
        t.identifier('children'),
        t.arrayExpression([object])
      )])
      : object
  }

  setComponentResult () {
    this.componentSourceMap.forEach((names, source) => {
      let name = ''
      names.forEach(n => {
        this.loopComponents.forEach((lc) => {
          lc.forEach(c => {
            if (names.includes(c.name)) {
              name = names[0]
            }
          })
        })
        if (this.duplicateComponents.has(n)) {
          name = n
        }
      })

      if (name) {
        this.result.components.push({
          name,
          path: source
        })
      }
    })
    this.result.components = uniqBy(this.result.components, 'name')
  }

  replaceImportedJSXElement () {
    this.customComponents.forEach((name, path) => {
      path.replaceWith(
        buildRefTemplate(findImportedName(name), name)
      )
      this.customComponentNames.add('$$' + name)
    })
    this.loopComponents.forEach(lc => {
      lc.forEach(c => {
        const callExpression = c.element.find(p => isArrayMapCallExpression(p)) as NodePath<t.CallExpression>
        const [ func ] = callExpression.node.arguments
        if (
          t.isFunctionExpression(func) ||
          t.isArrowFunctionExpression(func)
        ) {
          const [ item ] = func.params
          if (t.isIdentifier(item)) {
            const key = c.element.node.openingElement.attributes.find(attr => attr.name.name === 'key')
            c.element.replaceWith(
              buildRefTemplate(findImportedName(c.name), item.name, true, key)
            )
          }
        }
      })
    })
    this.result.template = this.result.components.reduce((acc, { path }, index) => {
      return acc + `${index === 0 ? '' : `\n` }` + createHTMLElement({
        name: 'import',
        attributes: {
          src: pathResolver(path, this.location)
        },
        value: ''
      })
    }, '')
  }

  resetConstructor () {
    if (this.methods.has('constructor')) {
      const ctor = this.methods.get('constructor')
      if (ctor && ctor.isClassMethod()) {
        ctor.node.body.body.push(resetThisState())
      }
    } else {
      const ctor = buildConstructor()
      ctor.body.body.push(resetThisState())
      this.classPath.node.body.body.unshift(ctor)
    }
  }

  parseRender () {
    if (this.renderMethod) {
      const instanceName = this.classPath.node.id.name
      this.result.template = this.result.template
        + new RenderParser(
          this.renderMethod,
          this.methods,
          this.initState,
          this.isRoot,
          instanceName,
          this.jsxReferencedIdentifiers,
          this.customComponentNames,
          this.usedState
        ).outputTemplate
    } else {
      throw codeFrameError(this.classPath.node.loc, '没有定义 render 方法')
    }
  }

  compile () {
    this.traverse()
    this.handleLoopComponents()
    this.renameImportJSXElement()
    this.setProps()
    this.setComponentResult()
    this.replaceImportedJSXElement()
    this.resetConstructor()
    this.parseRender()
  }
}

function buildInternalSafeGet (getter: string, isData?: boolean) {
  return t.callExpression(t.identifier(INTERNAL_SAFE_GET), [
    !isData ? t.memberExpression(t.thisExpression(), t.identifier('state')) : t.identifier(MAP_CALL_ITERATOR),
    t.stringLiteral(getter)
  ])
}

function isNeedClassMethodWrapper (name: string, expresion: t.Expression) {
  if (name.startsWith('on')) {
    const ids = generate(expresion).code.split('.')
    if (ids[0] === 'this' && ids[1] === 'props' && ids[2] && ids[3] !== 'bind') {
      return true
    }
  }
  return false
}

function isContainThis (expresion: t.Expression) {
  const ids = generate(expresion).code.split('.')
  if (ids[0] === 'this') {
    return true
  }
  return false
}

function buildAnonymousClassMethod (expresion: t.Expression, id: string) {
  return t.classMethod(
    'method',
    t.identifier(id),
    [],
    t.blockStatement([
      t.expressionStatement(t.callExpression(expresion, [
        t.spreadElement(t.identifier('arguments'))
      ]))
    ]))
}

function build$PropsProperty (
  importedJSXElement: Map<NodePath<t.JSXElement>, string>,
  body: Array<t.ClassProperty | t.ClassMethod>,
  jsxReferencedIdentifiers: Set<t.Identifier>,
  renderScope: Scope
) {
  const uid = incrementId()
  const properties: Array<t.ObjectMethod> = []
  importedJSXElement.forEach((name, path) => {
    let attrObj = [t.objectProperty(t.identifier('$name'), t.stringLiteral(name))]
    path.traverse({
      Identifier (path) {
        const parentPath = path.parentPath
        if (
          parentPath.isConditionalExpression() ||
          parentPath.isLogicalExpression() ||
          parentPath.isJSXExpressionContainer() ||
          (renderScope.hasBinding(path.node.name) && path.isReferencedIdentifier())
        ) {
          jsxReferencedIdentifiers.add(path.node)
        }
      },
      JSXAttribute (path) {
        const attr = path.node
        const name = attr.name as t.JSXIdentifier
        let value!: t.Expression
        // @TODO: 使用作用域的方法全部替换，现在 cover 的情况太少
        if (t.isJSXElement(attr.value)) {
          throw codeFrameError(attr.loc, 'JSX 参数不支持传入 JSX 元素')
        } else if (t.isJSXExpressionContainer(attr.value)) {
          const expresion = attr.value.expression
          const expresionPath = path.get('value').get('expression')
          if (t.isIdentifier(expresion)) {
            jsxReferencedIdentifiers.add(expresion)
            expresionPath.replaceWith(
              t.memberExpression(
                t.memberExpression(
                  t.thisExpression(),
                  t.identifier('state')
                ),
                expresion
              )
            )
          } else if (t.isMemberExpression(expresion)) {
            if (!t.isThisExpression(expresion.object) && !isContainThis(expresion)) {
              if (t.isIdentifier(expresion.object)) {
                jsxReferencedIdentifiers.add(expresion.object)
              }
              expresionPath.replaceWith(
                buildInternalSafeGet(generate(expresion).code)
              )
            } else if (isNeedClassMethodWrapper(name.name, expresion)) {
              const id = `$anonymousPropsFunction_${uid()}`
              path.get('value').get('expression').replaceWith(
                t.memberExpression(
                  t.thisExpression(),
                  t.identifier(id)
                )
              )
              body.push(buildAnonymousClassMethod(expresion, id))
            }
          } else {
            expresionPath.traverse({
              Identifier (path) {
                const { parent, node } = path
                if (!t.isMemberExpression(parent) && node.name !== INTERNAL_SAFE_GET) {
                  jsxReferencedIdentifiers.add(node)
                  path.replaceWith(
                    t.memberExpression(
                      t.memberExpression(
                        t.thisExpression(),
                        t.identifier('state')
                      ),
                      node
                    )
                  )
                }
              },
              MemberExpression (path) {
                const { parent, node } = path
                if ((parent === expresion) && !isContainThis(node)) {
                  path.replaceWith(buildInternalSafeGet(generate(node).code))
                }
              }
            })
          }
          value = attr.value.expression
        } else {
          value = attr.value
        }
        attrObj.push(
          t.objectProperty(t.identifier(name.name), value === null ? t.booleanLiteral(true) : value)
        )
      }
    })
    properties.push(
      t.objectMethod('method', t.identifier(name), [], t.blockStatement(
        [t.returnStatement(t.objectExpression(attrObj))]
      ))
    )
  })
  // console.log(jsxReferencedIdentifiers)
  return t.classProperty(
    t.identifier('$props'),
    t.objectExpression(properties)
  )
}

function findImportedName (name: string) {
  return isNumeric(name.slice(-1)) && name.slice(-2)[0] === '_'
    ? name.slice(0, name.length - 2)
    : name
}

function build$ComponentsProperty (
  importedJSXElement: Map<NodePath<t.JSXElement>, string>,
  // loopComponents: TypeLoopComponents
) {
  const properties: Array<t.ObjectProperty> = []
  for (const name of importedJSXElement.values()) {
    properties.push(
      t.objectProperty(
        t.identifier(name),
        t.identifier(
          findImportedName(name)
        )
      )
    )
  }
  // loopComponents.forEach(lc => {
  //   lc.forEach(c => {
  //     if (!properties.some(p => t.isIdentifier(p.key) && p.key.name === c.name)) {
  //       properties.push(
  //         t.objectProperty(
  //           t.identifier(c.name),
  //           t.identifier(
  //             findImportedName(c.name)
  //           )
  //         )
  //       )
  //     }
  //   })
  // })
  return t.classProperty(
    t.identifier('$components'),
    t.objectExpression(properties)
  )
}

export { Transformer }
