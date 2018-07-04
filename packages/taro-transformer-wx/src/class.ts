import { NodePath } from 'babel-traverse'
import * as t from 'babel-types'
import {
  codeFrameError,
  isNumeric,
  pathResolver,
  incrementId,
  findFirstIdentifierFromMemberExpression,
  isArrayMapCallExpression,
  hasComplexExpression,
  generateAnonymousState,
  buildConstVariableDeclaration,
  createUUID
} from './utils'
import {
  buildRefTemplate,
  setJSXAttr
} from './jsx'
import { DEFAULT_Component_SET, INTERNAL_SAFE_GET, MAP_CALL_ITERATOR, INTERNAL_DYNAMIC } from './constant'
import { createHTMLElement } from './create-html-element'
import generate from 'babel-generator'
import { uniqBy, cloneDeep } from 'lodash'
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

const anonymousPropsFunctionId = incrementId()

interface LoopComponents {
  level?: number,
  name: string,
  parent: NodePath<t.CallExpression> | null,
  element: NodePath<t.JSXElement>
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
  private loopStateName: Map<NodePath<t.CallExpression>, string> = new Map()
  private customComponentData: Array<t.ObjectProperty> = []

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

  renameImportJSXElement (name: string, path: NodePath<t.JSXElement>) {
    if (this.duplicateComponents.has(name)) {
      const times = this.duplicateComponents.get(name)!
      this.duplicateComponents.set(name, times + 1)
      const newName = `${name}_${times + 1}`
      this.customComponents.set(path, newName)
      return `$$${newName}`
    } else {
      this.duplicateComponents.set(name, 0)
      return `$$${name}`
    }
  }

  setComponents () {
    const body = this.classPath.node.body.body
    this.classPath.node.body.body = [
      build$ComponentsProperty(this.customComponents, this.loopComponents),
      ...body
    ]
  }

  handleLoopComponents () {
    if (this.loopComponents.size > 0) {
      const properties: t.ObjectProperty[] = []
      this.loopComponents.forEach((loopComponents, rootCallExpression) => {
        let iterator
        let index
        let blockStatement: t.Statement[] = []
        const callee = rootCallExpression.node.callee
        const calleeCode = generate(callee).code
        let nodes: t.ObjectExpression[] = []
        const uuid = createUUID()
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
          const node = this.generateTopLoopNodes(name, component, uuid, subscript.slice(0, subscript.length - 3), parent, iterator.name, index)
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
        const stateNameDecl = buildConstVariableDeclaration('stateName', t.stringLiteral(stateName))
        const returnStatement = t.returnStatement(
          t.objectExpression([
            t.objectProperty(t.identifier('stateName'), t.identifier('stateName')),
            t.objectProperty(t.identifier('loopComponents'), t.callExpression(t.identifier(INTERNAL_DYNAMIC), [
              t.thisExpression(), t.identifier('nodes'), buildInternalSafeGet(stateName), t.stringLiteral(uuid)
            ]))
          ])
        )
        const nodeDeclare = t.variableDeclaration('const', [
          t.variableDeclarator(t.identifier('nodes'), t.arrayExpression(
            nodes
          ))
        ])
        blockStatement.push(stateNameDecl)
        blockStatement.push(nodeDeclare)
        blockStatement.push(returnStatement)
        this.loopStateName.set(rootCallExpression, uuid)
        properties.push(
          t.objectProperty(t.identifier(uuid), t.arrowFunctionExpression([], t.blockStatement(blockStatement)))
        )
      })
      let hasDynamicComponents = false
      for (const property of this.classPath.node.body.body) {
        if (
          t.isClassProperty(property) &&
          property.key.name === '$dynamicComponents' &&
          t.isObjectExpression(property.value)
        ) {
          hasDynamicComponents = true
          property.value = t.objectExpression(
            property.value.properties.concat(properties)
          )
        }
      }
      if (!hasDynamicComponents) {
        this.classPath.node.body.body.unshift(
          t.classProperty(
            t.identifier('$dynamicComponents'),
            t.objectExpression(properties)
          )
        )
      }
    }
  }

  generateCustomComponentState = (name: string, component: NodePath<t.JSXElement>, uuid: string) => {
    const properties: t.ObjectProperty[] = []
    const pathObj = t.objectProperty(t.identifier('$path'), t.stringLiteral(uuid + '_0'))
    const attrs = component.node.openingElement.attributes
    for (const attr of attrs) {
      const name = attr.name.name as string
      let value = attr.value as t.Expression
      if (value === null) {
        attr.value = t.jSXExpressionContainer(t.booleanLiteral(true))
      }
      if (t.isJSXExpressionContainer(attr.value)) {
        value = attr.value.expression
      }
      properties.push(t.objectProperty(t.identifier(name), cloneDeep(value)))
    }
    this.customComponentData.push(
      t.objectProperty(t.identifier(name), t.arrayExpression(
        [t.objectExpression([pathObj].concat(properties))]
      ))
    )
  }

  setCustomDynamicComponents () {
    const properties: t.ObjectProperty[] = []
    this.customComponents.forEach((name, component) => {
      let blockStatement: t.Statement[] = []
      let nodes: t.ObjectExpression[] = []
      const uuid = createUUID()
      const newName = this.renameImportJSXElement(name, component)
      this.generateCustomComponentState(newName, component, uuid)
      const nodeDeclare = t.variableDeclaration('const', [
        t.variableDeclarator(t.identifier('nodes'), t.arrayExpression(
          nodes
        ))
      ])
      const node = this.generateTopLoopNodes(name, component, uuid, '', null, undefined, undefined, false)
      nodes.push(node)
      properties.push(
        t.objectProperty(t.identifier(uuid), t.arrowFunctionExpression([], t.blockStatement(blockStatement)))
      )
      const returnStatement = t.returnStatement(
        t.objectExpression([
          t.objectProperty(t.identifier('stateName'), t.stringLiteral(newName)),
          t.objectProperty(t.identifier('loopComponents'), t.callExpression(t.identifier(INTERNAL_DYNAMIC), [
            t.thisExpression(), t.identifier('nodes'), buildInternalSafeGet(newName), t.stringLiteral(uuid + '_0')
          ]))
        ])
      )
      blockStatement.push(nodeDeclare)
      blockStatement.push(returnStatement)
    })
    this.classPath.node.body.body.unshift(
      t.classProperty(
        t.identifier('$dynamicComponents'),
        t.objectExpression(properties)
      )
    )
  }

  generateTopLoopNodes (
    name: string,
    component: NodePath<t.JSXElement>,
    oldId: string,
    subscript: string,
    parent: NodePath<t.CallExpression> | null,
    iterator?: string,
    index?: t.Identifier,
    isLoop = true
  ) {
    const properties: t.ObjectProperty[] = []
    const self = this
    const uuid = isLoop ? oldId : oldId + '_0'
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
            } else if (index && expresion.name === index.name) {
              replacement = t.identifier(index.name)
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
              const id = `$$anonymousPropsFunction_${anonymousPropsFunctionId()}`
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
                /**
                 * @TODO 这里应该判断 refid 是 state 还是 props
                 */
                const { parent, node } = path
                if (node.name === MAP_CALL_ITERATOR || !path.isReferencedIdentifier()) {
                  return
                }
                const isIndex = index && index.name !== node.name
                if (!t.isMemberExpression(parent) && node.name !== INTERNAL_SAFE_GET && !isIndex) {
                  let replacement = t.memberExpression(
                    t.memberExpression(
                      t.thisExpression(),
                      t.identifier('state')
                    ),
                    node
                  ) as any
                  if (node.name === iterator) {
                    replacement = t.identifier(MAP_CALL_ITERATOR)
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
    const argsFunction = t.objectMethod('method', t.identifier('args'), isLoop ? [t.identifier(MAP_CALL_ITERATOR), t.identifier('index')] : [],
      t.blockStatement(
        [
          t.returnStatement(t.objectExpression(properties.concat([t.objectProperty(t.identifier('$path'), t.stringLiteral(uuid))])))
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

  handleUtilAssign (jsx: NodePath<t.JSXElement>, iterator?: string) {
    const attrs = jsx.node.openingElement.attributes
    // console.log('item', iterator)
    let key!: t.JSXAttribute
    let str = `utils.assign(${iterator || '{}'}, {`
    let hasProp = false
    for (const attr of attrs) {
      const name = attr.name.name as string
      if (name === 'key') {
        key = attr
      } else if (name.startsWith('on')) {
        //
      } else {
        if (attr.value === null) {
          attr.value = t.jSXExpressionContainer(t.booleanLiteral(true))
        }
        const value = t.isJSXExpressionContainer(attr.value) ? attr.value.expression : attr.value
        str += name + ':' + generate(value).code.replace(/(this\.props\.)|(this\.state\.)/g, '')
        .replace(/__item/g, iterator || 'item') + ','
        hasProp = true
      }
    }
    str = str.slice(0, str.length - 1)
    if (!hasProp) {
      str = str.slice(0, str.length - 2)
      // str = str.replace('/\,/g', '')
    }
    str += `${hasProp ? '}' : ''})`
    return {
      key,
      str
    }
  }

  replaceImportedJSXElement () {
    this.customComponents.forEach((name, path) => {
      const jsx = buildRefTemplate(findImportedName(name), name)
      setJSXAttr(
        jsx,
        'wx:for-item',
        t.stringLiteral('item')
      )
      setJSXAttr(
        jsx,
        'data',
        t.jSXExpressionContainer(
          t.identifier('...item')
        )
      )
      setJSXAttr(
        jsx,
        'wx:for',
        t.jSXExpressionContainer(
          t.identifier('$$' + name)
        )
      )
      path.replaceWith(jsx)
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
    if (!this.methods.has('constructor')) {
      const ctor = buildConstructor()
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
          this.usedState,
          this.loopStateName,
          this.customComponentNames,
          this.customComponentData
        ).outputTemplate
    } else {
      throw codeFrameError(this.classPath.node.loc, '没有定义 render 方法')
    }
  }

  compile () {
    this.traverse()
    this.setCustomDynamicComponents()
    this.handleLoopComponents()
    this.setComponents()
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

function findImportedName (name: string) {
  return isNumeric(name.slice(-1)) && name.slice(-2)[0] === '_'
    ? name.slice(0, name.length - 2)
    : name
}

function build$ComponentsProperty (
  importedJSXElement: Map<NodePath<t.JSXElement>, string>,
  loopComponents: TypeLoopComponents
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
  loopComponents.forEach(lc => {
    lc.forEach(c => {
      if (!properties.some(p => t.isIdentifier(p.key) && p.key.name === c.name)) {
        properties.push(
          t.objectProperty(
            t.identifier(c.name),
            t.identifier(
              findImportedName(c.name)
            )
          )
        )
      }
    })
  })
  return t.classProperty(
    t.identifier('$components'),
    t.objectExpression(properties)
  )
}

export { Transformer }
