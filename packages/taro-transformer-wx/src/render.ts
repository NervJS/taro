import { NodePath, Scope, Visitor } from 'babel-traverse'
import * as t from 'babel-types'
import {
  newJSXIfAttr,
  reverseBoolean,
  findIdentifierFromStatement,
  getArgumentName,
  toLetters,
  isEmptyDeclarator,
  codeFrameError,
  isBlockIfStatement,
  findFirstIdentifierFromMemberExpression,
  setTemplate,
  isContainFunction,
  buildConstVariableDeclaration,
  incrementId,
  isArrayMapCallExpression,
  generateAnonymousState,
  hasComplexExpression
} from './utils'
import { difference } from 'lodash'
import {
  setJSXAttr,
  buildBlockElement,
  parseJSXElement,
  generateHTMLTemplate
} from './jsx'
import { DEFAULT_Component_SET, MAP_CALL_ITERATOR, LOOP_STATE, LOOP_CALLEE } from './constant'
import generate from 'babel-generator'
const template = require('babel-template')

type ClassMethodsMap = Map<string, NodePath<t.ClassMethod | t.ClassProperty>>

const calleeId = incrementId()

interface JSXHandler {
  parentNode: t.Node
  parentPath: NodePath<t.Node>
  statementParent: NodePath<t.Node>
  isReturnStatement: boolean
  isFinalReturn: boolean
}

function handleJSXElement (
  jsxElementPath: NodePath<t.JSXElement>,
  func: ({ parentNode, parentPath, statementParent, isReturnStatement, isFinalReturn }: JSXHandler) => void
) {
  const parentNode = jsxElementPath.parent
  const parentPath = jsxElementPath.parentPath
  const isJSXChildren = t.isJSXElement(parentNode)
  if (!isJSXChildren) {
    let statementParent = jsxElementPath.getStatementParent()
    const isReturnStatement = statementParent.isReturnStatement()
    const isFinalReturn = statementParent.getFunctionParent().isClassMethod()
    if (
      !(
        statementParent.isVariableDeclaration() ||
        statementParent.isExpressionStatement()
      )
    ) {
      statementParent = statementParent.findParent(
        s => s.isVariableDeclaration() || s.isExpressionStatement()
      ) as NodePath<t.Statement>
    }
    func({ parentNode, parentPath, statementParent, isReturnStatement, isFinalReturn })
  }
}

function isContainStopPropagation (path: NodePath<t.Node>) {
  let matched = false
  path.traverse({
    Identifier (p) {
      if (
        p.node.name === 'stopPropagation' &&
        p.parentPath.parentPath.isCallExpression()
      ) {
        matched = true
      }
    }
  })
  return matched
}

function buildComponentPathDataset (path: NodePath<t.Node>) {
  const parentPath = path.parentPath
  if (parentPath.isJSXOpeningElement()) {
    parentPath.node.attributes.push(
      t.jSXAttribute(
        t.jSXIdentifier('data-component-path'),
        t.stringLiteral('{{$path}}')
      )
    )
  }
}

function buildAssignState (
  pendingState: t.ObjectExpression
) {
  return t.expressionStatement(
    t.callExpression(
      t.memberExpression(t.identifier('Object'), t.identifier('assign')),
      [
        t.memberExpression(t.thisExpression(), t.identifier('state')),
        pendingState
      ]
    )
  )
}

function copyStateToShalowData () {
  return t.expressionStatement(
    t.assignmentExpression(
      '=',
      t.memberExpression(
        t.memberExpression(t.thisExpression(), t.identifier('state')),
        t.identifier('__data')
      ),
      t.callExpression(
        t.memberExpression(t.identifier('Object'), t.identifier('assign')),
        [
          t.objectExpression([]),
          t.memberExpression(t.thisExpression(), t.identifier('state'))
        ]
      )
    )
  )
}

export class RenderParser {
  public outputTemplate: string

  private classProperties = new Set<t.ClassProperty>()
  private templates = new Map<string, t.JSXElement>()
  private jsxDeclarations = new Set<NodePath<t.Node>>()
  private loopScopes = new Set<string>()
  private returnedPaths: NodePath<t.Node>[] = []
  private usedThisState = new Set<string>()
  private loopComponents = new Map<NodePath<t.CallExpression>, NodePath<t.JSXElement>>()
  private loopRefIdentifiers = new Map<t.Identifier, NodePath<t.CallExpression>>()

  private renderPath: NodePath<t.ClassMethod>
  private methods: ClassMethodsMap
  private initState: Set<string>
  private isRoot: boolean
  private instanceName: string
  private referencedIdentifiers: Set<t.Identifier>
  private customComponentNames: Set<string>
  private renderScope: Scope
  private usedState: Set<string>

  private finalReturnElement!: t.JSXElement

  private loopComponentVisitor: Visitor = {
    VariableDeclarator (path) {
      const id = path.get('id')
      const init = path.get('init')
      const parentPath = path.parentPath
      if (
        id.isObjectPattern() &&
        init.isThisExpression() &&
        parentPath.isVariableDeclaration()
      ) {
        const { properties } = id.node
        const declareState = template('const state = this.state;')()
        if (properties.length > 1) {
          const index = properties.findIndex(p => t.isObjectProperty(p) && t.isIdentifier(p.key, { name: 'state' }))
          properties.splice(index, 1)
          parentPath.insertAfter(declareState)
        } else {
          parentPath.insertAfter(declareState)
          parentPath.remove()
        }
      }
    },
    JSXElement: {
      enter: (jsxElementPath: NodePath<t.JSXElement>) => {
        handleJSXElement(jsxElementPath, ({ parentNode, parentPath, statementParent }) => {
          if (t.isLogicalExpression(parentNode)) {
            const { left, operator } = parentNode
            const leftExpression = parentPath.get('left') as NodePath<t.Expression>
            if (operator === '&&' && t.isExpression(left)) {
              if (hasComplexExpression(leftExpression)) {
                generateAnonymousState(parentPath.scope, leftExpression, this.referencedIdentifiers, true)
              }
              newJSXIfAttr(jsxElementPath.node, leftExpression.node)
              parentPath.replaceWith(jsxElementPath.node)
              if (statementParent) {
                const name = findIdentifierFromStatement(statementParent.node as t.VariableDeclaration)
                setTemplate(name, jsxElementPath, this.templates)
                // name && templates.set(name, path.node)
              }
            }
          } else if (t.isConditionalExpression(parentNode)) {
            const { consequent, alternate } = parentNode
            const testExpression = parentPath.get('test') as NodePath<t.Expression>
            const block = buildBlockElement()
            if (hasComplexExpression(testExpression)) {
              generateAnonymousState(parentPath.scope, testExpression, this.referencedIdentifiers, true)
            }
            const test = testExpression.node
            if (t.isJSXElement(consequent) && t.isLiteral(alternate)) {
              const { value, confident } = parentPath.get('alternate').evaluate()
              if (confident && !value) {
                newJSXIfAttr(block, test)
                block.children = [ jsxElementPath.node ]
                // newJSXIfAttr(jsxElementPath.node, test)
                parentPath.replaceWith(block)
                if (statementParent) {
                  const name = findIdentifierFromStatement(
                    statementParent.node as t.VariableDeclaration
                  )
                  setTemplate(name, jsxElementPath, this.templates)
                  // name && templates.set(name, path.node)
                }
              }
            } else if (t.isLiteral(consequent) && t.isJSXElement(alternate)) {
              if (t.isNullLiteral(consequent)) {
                newJSXIfAttr(block, reverseBoolean(test))
                // newJSXIfAttr(jsxElementPath.node, reverseBoolean(test))
                parentPath.replaceWith(block)
                if (statementParent) {
                  const name = findIdentifierFromStatement(
                    statementParent.node as t.VariableDeclaration
                  )
                  setTemplate(name, jsxElementPath, this.templates)
                  // name && templates.set(name, path.node)
                }
              }
            } else if (t.isJSXElement(consequent) && t.isJSXElement(alternate)) {
              const block2 = buildBlockElement()
              block.children = [consequent]
              newJSXIfAttr(block, test)
              setJSXAttr(block2, 'wx:else')
              block2.children = [alternate]
              const parentBlock = buildBlockElement()
              parentBlock.children = [block, block2]
              parentPath.replaceWith(parentBlock)
              if (statementParent) {
                const name = findIdentifierFromStatement(
                  statementParent.node as t.VariableDeclaration
                )
                setTemplate(name, jsxElementPath, this.templates)
              }
            } else {
              // console.log('todo')
            }
          }
        })
      },
      exit: (jsxElementPath: NodePath<t.JSXElement>) => {
        handleJSXElement(jsxElementPath, ({ parentNode, parentPath, statementParent, isFinalReturn }) => {
          this.jsxDeclarations.add(statementParent)
          if (t.isReturnStatement(parentNode)) {
            if (!isFinalReturn) {
              const callExpr = parentPath.findParent(p => p.isCallExpression())
              if (callExpr.isCallExpression()) {
                const callee = callExpr.node.callee
                if (this.loopComponents.has(callExpr)) {
                  return
                }
                if (
                  t.isMemberExpression(callee) &&
                  t.isIdentifier(callee.property) &&
                  callee.property.name === 'map'
                ) {
                  let ary = callee.object
                  if (t.isCallExpression(ary) || isContainFunction(callExpr.get('callee').get('object'))) {
                    const variableName = `${LOOP_CALLEE}_${calleeId()}`
                    callExpr.getStatementParent().insertBefore(
                      buildConstVariableDeclaration(variableName, ary)
                    )
                    ary = t.identifier(variableName)
                  }
                  if (t.isMemberExpression(ary)) {
                    const id = findFirstIdentifierFromMemberExpression(ary)
                    if (t.isIdentifier(id)) {
                      this.referencedIdentifiers.add(id)
                    }
                  } else if (t.isIdentifier(ary)) {
                    const parentCallExpr = callExpr.find(p => p.isCallExpression())
                    if (!isArrayMapCallExpression(parentCallExpr) && parentCallExpr !== callExpr) {
                      this.referencedIdentifiers.add(ary)
                    }
                  }
                  setJSXAttr(jsxElementPath.node, 'wx:for', t.jSXExpressionContainer(ary))
                  const [func] = callExpr.node.arguments
                  if (
                    t.isFunctionExpression(func) ||
                    t.isArrowFunctionExpression(func)
                  ) {
                    const [item, index] = func.params
                    if (t.isIdentifier(item)) {
                      setJSXAttr(
                        jsxElementPath.node,
                        'wx:for-item',
                        t.stringLiteral(item.name)
                      )
                      this.loopScopes.add(item.name)
                    } else if (t.isObjectPattern(item)) {
                      throw codeFrameError(item.loc, 'JSX map 循环参数暂时不支持使用 Object pattern 解构。')
                    } else {
                      setJSXAttr(
                        jsxElementPath.node,
                        'wx:for-item',
                        t.stringLiteral('__item')
                      )
                    }
                    if (t.isIdentifier(index)) {
                      setJSXAttr(
                        jsxElementPath.node,
                        'wx:for-index',
                        t.stringLiteral(index.name)
                      )
                      this.loopScopes.add(index.name)
                    }
                    this.loopComponents.set(callExpr, jsxElementPath)
                    // caller.replaceWith(jsxElementPath.node)
                    if (statementParent) {
                      const name = findIdentifierFromStatement(
                        statementParent.node as t.VariableDeclaration
                      )
                      // setTemplate(name, path, templates)
                      name && this.templates.set(name, jsxElementPath.node)
                    }
                  }
                }
              }
            }
          } else if (t.isArrowFunctionExpression(parentNode)) {
            parentPath.replaceWith(
              t.arrowFunctionExpression(parentNode.params, t.blockStatement([
                t.returnStatement(jsxElementPath.node)
              ]))
            )
          }
        })
      }
    }
  }

  private jsxElementVisitor: Visitor = {
    JSXElement: (jsxElementPath) => {
      handleJSXElement(jsxElementPath, ({ parentNode, parentPath, statementParent, isFinalReturn }) => {
        // this.jsxDeclarations.add(statementParent)
        /**
         * @TODO
         * 有空做一个 TS 的 pattern matching 函数
         * 把分支重构出来复用
         */
        if (t.isVariableDeclarator(parentNode)) {
          if (statementParent) {
            const name = findIdentifierFromStatement(statementParent.node as t.VariableDeclaration)
            // setTemplate(name, path, templates)
            name && this.templates.set(name, jsxElementPath.node)
          }
        } else if (t.isLogicalExpression(parentNode)) {
          //
        } else if (t.isConditionalExpression(parentNode)) {
          //
        } else if (t.isReturnStatement(parentNode)) {
          if (!isFinalReturn) {
            //
          } else {
            const ifStatement = parentPath.findParent(p => p.isIfStatement())
            const blockStatement = parentPath.findParent(p => p.isBlockStatement())
            const block = this.finalReturnElement || buildBlockElement()
            if (isBlockIfStatement(ifStatement, blockStatement)) {
              const { test, alternate, consequent } = ifStatement.node
              if (alternate === blockStatement.node) {
                throw codeFrameError(parentNode.loc, '不必要的 else 分支，请遵从 ESLint consistent-return: https://eslint.org/docs/rules/consistent-return')
              } else if (consequent === blockStatement.node) {
                const parentIfStatement = ifStatement.findParent(p => p.isIfStatement())
                if (parentIfStatement) {
                  setJSXAttr(
                    jsxElementPath.node,
                    'wx:elif',
                    t.jSXExpressionContainer(test)
                  )
                } else {
                  newJSXIfAttr(jsxElementPath.node, test)
                }
              }
            } else if (block.children.length !== 0) {
              setJSXAttr(jsxElementPath.node, 'wx:else')
            }
            block.children.push(jsxElementPath.node)
            this.finalReturnElement = block
            this.returnedPaths.push(parentPath)
          }
        } else if (t.isArrowFunctionExpression(parentNode)) {
          // console.log('arrow')
        } else if (t.isAssignmentExpression(parentNode)) {
          if (t.isIdentifier(parentNode.left)) {
            const name = parentNode.left.name
            const bindingNode = this.renderScope.getOwnBinding(name)!.path.node
            const block = this.templates.get(name) || buildBlockElement()
            if (isEmptyDeclarator(bindingNode)) {
              const ifStatement = parentPath.findParent(p => p.isIfStatement())
              const blockStatement = parentPath.findParent(p =>
                p.isBlockStatement()
              )
              if (isBlockIfStatement(ifStatement, blockStatement)) {
                const { test, alternate, consequent } = ifStatement.node
                if (alternate === blockStatement.node) {
                  setJSXAttr(jsxElementPath.node, 'wx:else')
                } else if (consequent === blockStatement.node) {
                  const parentIfStatement = ifStatement.findParent(p =>
                    p.isIfStatement()
                  ) as NodePath<t.IfStatement>
                  if (parentIfStatement && parentIfStatement.get('alternate') === ifStatement) {
                    setJSXAttr(
                      jsxElementPath.node,
                      'wx:elif',
                      t.jSXExpressionContainer(test)
                    )
                  } else {
                    if (parentIfStatement) {
                      newJSXIfAttr(block, parentIfStatement.node.test)
                    }
                    newJSXIfAttr(jsxElementPath.node, test)
                  }
                }
                block.children.push(jsxElementPath.node)
                // setTemplate(name, path, templates)
                name && this.templates.set(name, block)
              }
            } else {
              throw codeFrameError(
                jsxElementPath.node.loc,
                '请将 JSX 赋值表达式初始化为 null，然后再进行 if 条件表达式赋值。'
              )
            }
          }
        } else if (!t.isJSXElement(parentNode)) {
          // throwError(path, '考虑只对 JSX 元素赋值一次。')
        }
      })

      // handle jsx attrs
      const openingElementPath = jsxElementPath.get('openingElement')
      openingElementPath.traverse(this.jsxAttrVisitor)
    }
  }

  private jsxAttrVisitor: Visitor = {
    JSXExpressionContainer: (path) => {
      const expression = path.get('expression') as NodePath<t.Expression>
      if (expression.isStringLiteral()) {
        path.replaceWith(expression)
      } else if (expression.isCallExpression()) {
        const node = expression.node
        if (
          t.isMemberExpression(node.callee) &&
          t.isIdentifier(node.callee.property) &&
          node.callee.property.name === 'bind'
        ) {
          const JSXElement: any = path.findParent(p => p.isJSXElement())
            .node
          // const JSXAttribute = path.findParent(p => p.isJSXAttribute())
          let bindCalleeName: string | null = null
          if (t.isIdentifier(node.callee.object)) {
            bindCalleeName = node.callee.object.name
          } else if (t.isMemberExpression(node.callee.object)) {
            if (t.isIdentifier(node.callee.object.property)) {
              bindCalleeName = node.callee.object.property.name
            }
          }
          if (bindCalleeName !== null) {
            node.arguments.forEach((arg, index) => {
              const argName = getArgumentName(arg)
              const isLiteral = t.isLiteral(arg)
              if (index === 0) {
                setJSXAttr(
                  JSXElement,
                  `data-event-${bindCalleeName}-scope`,
                  t.stringLiteral(argName)
                )
              } else {
                if (path.scope.hasBinding(argName) && t.isIdentifier(arg)) {
                  this.addRefIdentifier(path, arg)
                  // referencedIdentifiers.add(arg)
                }
                setJSXAttr(
                  JSXElement,
                  `data-event-${bindCalleeName}-arg-${toLetters(index)}`,
                  isLiteral
                    ? t.stringLiteral(argName)
                    : t.jSXExpressionContainer(t.identifier(argName))
                )
              }
            })
            setJSXAttr(JSXElement, 'data-component-path', t.stringLiteral('{{$path}}'))
            expression.replaceWith(t.stringLiteral(`${!this.isRoot ? `${this.instanceName}__` : ''}${bindCalleeName}`))
          }
        }
      }
    },
    MemberExpression: (path) => {
      const id = findFirstIdentifierFromMemberExpression(path.node)
      const bindId = this.renderScope.getOwnBindingIdentifier(id.name)
      const { object, property } = path.node
      if (
        t.isMemberExpression(object) &&
        t.isThisExpression(object.object) &&
        t.isIdentifier(object.property, { name: 'state' })
      ) {
        if (t.isIdentifier(property)) {
          this.usedThisState.add(property.name)
        } else if (t.isMemberExpression(property)) {
          const id = findFirstIdentifierFromMemberExpression(property)
          if (id && this.renderScope.hasBinding(id.name)) {
            this.usedThisState.add(id.name)
          }
        }
      }
      if (bindId) {
        this.addRefIdentifier(path, bindId)
        // referencedIdentifiers.add(bindId)
      }
    },
    JSXAttribute: (path) => {
      const { name, value } = path.node
      let eventShouldBeCatched = false
      const jsxElementPath = path.parentPath.parentPath
      if (t.isJSXIdentifier(name) && jsxElementPath.isJSXElement()) {
        if (!this.isRoot && name.name.startsWith('on')) {
          buildComponentPathDataset(path)
          const alreadySet = jsxElementPath.node.openingElement.attributes.some(attr => {
            return t.isJSXIdentifier(attr.name) && attr.name.name === 'data-component-class'
          })
          if (!alreadySet) {
            setJSXAttr(jsxElementPath.node, 'data-component-class', t.stringLiteral(this.instanceName))
          }
        }
        if (name.name === 'key') {
          path.get('name').replaceWith(t.jSXIdentifier('wx:key'))
        } else if (
          name.name.startsWith('on')
        ) {
          if (t.isJSXExpressionContainer(value)) {
            let methodName
            if (
              t.isIdentifier(value.expression) ||
              t.isJSXIdentifier(value.expression)
            ) {
              methodName = value.expression.name
            } else if (
              t.isMemberExpression(value.expression) &&
              t.isIdentifier(value.expression.property)
            ) {
              const { code } = generate(value.expression)
              const ids = code.split('.')
              if (ids[0] === 'this' && ids[1] === 'props' && ids[2]) {
                // const method = ids
              } else {
                methodName = value.expression.property.name
              }
            } else if (
              t.isCallExpression(value.expression) &&
              t.isMemberExpression(value.expression.callee) &&
              t.isIdentifier(value.expression.callee.object)
            ) {
              methodName = value.expression.callee.object.name
            } else if (
              t.isCallExpression(value.expression) &&
              t.isMemberExpression(value.expression.callee) &&
              t.isMemberExpression(value.expression.callee.object) &&
              t.isIdentifier(value.expression.callee.property) &&
              value.expression.callee.property.name === 'bind' &&
              t.isIdentifier(value.expression.callee.object.property)
            ) {
              methodName = value.expression.callee.object.property.name
            } else {
              throw codeFrameError(path.node.loc, '当 props 为事件时(props name 以 `on` 开头)，只能传入一个 this 作用域下的函数。')
            }
            if (this.methods.has(methodName)) {
              const method = this.methods.get(methodName)!
              if (t.isIdentifier(method.node.key)) {
                method.node.key = t.identifier('__event_' + `${this.isRoot ? '' : `${this.instanceName}__`}` + methodName)
              }
              if (!this.isRoot && !generate(value.expression).code.includes('.bind')) {
                path.node.value = t.stringLiteral(`${this.instanceName}__${methodName}`)
              }
              eventShouldBeCatched = isContainStopPropagation(method)
            }
          }
          if (
            t.isJSXIdentifier(jsxElementPath.node.openingElement.name)
            && DEFAULT_Component_SET.has(jsxElementPath.node.openingElement.name.name)
          ) {
            let transformName = `${eventShouldBeCatched ? 'catch' : 'bind'}`
              + name.name.slice(2, name.name.length).toLowerCase()
            if (name.name === 'onClick') {
              transformName = eventShouldBeCatched ? 'catchtap' : 'bindtap'
            }
            path.node.name = t.jSXIdentifier(transformName)
          }
          // let transformName = `${eventShouldBeCatched ? 'catch' : 'bind'}` + name.name.slice(2, name.name.length)
          // transformName = eventShouldBeCatched
          //   ? CATCH_EVENT_MAP.get(name.name)!
          //   : BIND_EVENT_MAP.get(name.name)!
        }
      }
    },
    Identifier: (path) => {
      const parentPath = path.parentPath
      if (
        parentPath.isConditionalExpression() ||
        parentPath.isLogicalExpression() ||
        parentPath.isJSXExpressionContainer() ||
        this.renderScope.hasOwnBinding(path.node.name)
      ) {
        const codes = parentPath.getSource().split('.')
        if (!(codes[0] === 'this' && codes[1] === 'state')) {
          this.addRefIdentifier(path, path.node)
          // referencedIdentifiers.add(path.node)
        }
      }
    },
    ArrowFunctionExpression: (path) => {
      const uid = path.scope.generateUid('_anonymous_function_')
      const c = t.classProperty(t.identifier(uid), path.node)
      this.classProperties.add(c)
    }
  }

  private visitors: Visitor = {
    NullLiteral (path) {
      const statementParent = path.getStatementParent()
      if (statementParent && statementParent.isReturnStatement()) {
        path.replaceWith(
          t.jSXElement(
            t.jSXOpeningElement(
              t.jSXIdentifier('View'),
              []
            ),
            undefined,
            [],
            true
          )
        )
      }
    },
    ...this.jsxElementVisitor,
    JSXExpressionContainer: (path) => {
      // todo
      if (!t.isJSXAttribute(path.parent)) {
        path.traverse({
          Identifier: (path) => {
            const parentPath = path.parentPath
            if (
              parentPath.isConditionalExpression() ||
              parentPath.isLogicalExpression() ||
              path.isReferencedIdentifier()
            ) {
              const name = path.node.name
              if (Object.keys(this.renderScope.getAllBindings()).includes(name)) {
                this.addRefIdentifier(path, path.node)
                // referencedIdentifiers.add(path.node)
              }
              if (this.templates.has(name)) {
                path.replaceWith(this.templates.get(name)!)
              }
            }
          }
        })
      }
    }
  }

  constructor (
    renderPath: NodePath<t.ClassMethod>,
    methods: ClassMethodsMap,
    initState: Set<string>,
    isRoot: boolean,
    instanceName: string,
    referencedIdentifiers: Set<t.Identifier>,
    customComponentNames: Set<string>,
    usedState: Set<string>
  ) {
    this.renderPath = renderPath
    this.methods = methods
    this.initState = initState
    this.isRoot = isRoot
    this.instanceName = instanceName
    this.referencedIdentifiers = referencedIdentifiers
    this.customComponentNames = customComponentNames
    this.usedState = usedState
    const renderBody = renderPath.get('body')
    this.renderScope = renderBody.scope

    const [, error] = renderPath.node.body.body.filter(s => t.isReturnStatement(s))
    if (error) {
      throw codeFrameError(error.loc, 'render 函数顶级作用域暂时只支持一个 return')
    }

    renderBody.traverse(this.loopComponentVisitor)
    this.handleLoopComponents()
    renderBody.traverse(this.visitors)
    this.setOutputTemplate()
    this.removeJSXStatement()
    this.setUsedState()
    this.setPendingState()
    this.createData()
  }

  addRefIdentifier (path: NodePath<t.Node>, id: t.Identifier) {
    const arrayMap = path.findParent(p => isArrayMapCallExpression(p))
    if (arrayMap && arrayMap.isCallExpression()) {
      this.loopRefIdentifiers.set(id, arrayMap)
    } else {
      this.referencedIdentifiers.add(id)
    }
  }

  /**
   * jsxDeclarations,
   * renderScope,
   * methods,
   * loopScopes,
   * initState,
   * templates
   */
  handleLoopComponents = () => {
    const loopArrayId = incrementId()
    const replaceQueue: Function[] = []
    this.loopComponents.forEach((component, callee) => {
      for (const dcl of this.jsxDeclarations) {
        const isChildren = dcl && dcl.findParent(d => d === callee)
        if (isChildren) {
          this.jsxDeclarations.delete(dcl)
          dcl.remove()
        }
      }
      const blockStatementPath = component.findParent(p => p.isBlockStatement()) as NodePath<t.BlockStatement>
      const body = blockStatementPath.node.body
      let stateToBeAssign = new Set<string>(
        difference(
          Object.keys(blockStatementPath.scope.getAllBindings()),
          Object.keys(this.renderScope.getAllBindings())
        ).filter(i => {
          return !this.methods.has(i)
        })
        .filter(i => !this.loopScopes.has(i))
        .filter(i => !this.initState.has(i))
        .filter(i => !this.templates.has(i))
        .filter(i => !i.includes('.'))
        .filter(i => i !== MAP_CALL_ITERATOR)
      )
      if (body.length > 1) {
        const [ func ] = callee.node.arguments
        if (t.isFunctionExpression(func) || t.isArrowFunctionExpression(func)) {
          const [ item ] = func.params as t.Identifier[]
          for (const [ index, statement ] of body.entries()) {
            if (t.isVariableDeclaration(statement)) {
              for (const dcl of statement.declarations) {
                if (t.isIdentifier(dcl.id)) {
                  const name = dcl.id.name
                  if (name.startsWith(LOOP_STATE) || name.startsWith(LOOP_CALLEE)) {
                    stateToBeAssign.add(name)
                    dcl.id = t.identifier(name)
                  }
                }
              }
            }
            if (t.isReturnStatement(statement)) {
              body.splice(index, 1)
            }
          }
          const properties = Array.from(stateToBeAssign).map(state => t.objectProperty(t.identifier(state), t.identifier(state)))
          const returnStatement = t.returnStatement(t.objectExpression(
            [t.spreadProperty(t.identifier(item.name)), ...properties]
          ))
          component.traverse({
            Identifier (path) {
              if (stateToBeAssign.has(path.node.name) && path.isReferencedIdentifier()) {
                path.replaceWith(
                  t.memberExpression(
                    t.identifier(item.name),
                    path.node
                  )
                )
              }
            },
            MemberExpression (path) {
              const id = findFirstIdentifierFromMemberExpression(path.node)
              if (stateToBeAssign.has(id.name)) {
                path.node.object = t.identifier(item.name + '.' + id.name)
              }
            }
          })
          const parentCallee = callee.findParent(c => isArrayMapCallExpression(c))
          if (isArrayMapCallExpression(parentCallee)) {
            const [ func ] = parentCallee.node.arguments
            const { object } = callee.node.callee as t.MemberExpression
            if (t.isFunctionExpression(func) || t.isArrowFunctionExpression(func)) {
              const funcBody = func.body
              if (t.isBlockStatement(funcBody)) {
                if (t.isIdentifier(object) || t.isMemberExpression(object)) {
                  funcBody.body.splice(
                    funcBody.body.length - 1,
                    0,
                    t.expressionStatement(
                      t.assignmentExpression(
                        '=',
                        object,
                        callee.node
                      )
                    )
                  )
                } else {
                  throw codeFrameError(object.loc, '请简化该表达式为标识符或成员表达式')
                }
              }
            }
            body.push(returnStatement)
          } else {
            body.push(returnStatement)
            const stateName = 'loopArray' + loopArrayId()
            // setJSXAttr(returned, 'wx:for', t.identifier(stateName))
            this.referencedIdentifiers.add(t.identifier(stateName))
            setJSXAttr(component.node, 'wx:for', t.jSXExpressionContainer(t.identifier(stateName)))
            this.renderPath.node.body.body.push(
              buildConstVariableDeclaration(stateName, callee.node)
            )
          }
          // console.log(callee.getSource())
        }
      }
      replaceQueue.push(() => {
        const statement = component.getStatementParent()
        callee.replaceWith(
          statement.isReturnStatement()
          ? statement.get('argument').node
          : component.node
        )
      })
    })
    replaceQueue.forEach(func => func())
  }

  setOutputTemplate () {
    this.outputTemplate = !this.isRoot
      ? generateHTMLTemplate(this.finalReturnElement, this.instanceName)
      : parseJSXElement(this.finalReturnElement)
    this.templates.forEach((template, name) => {
      this.outputTemplate += ` ${generateHTMLTemplate(template, name)}`
    })
  }

  removeJSXStatement () {
    this.jsxDeclarations.forEach(d => d && d.remove())
    this.returnedPaths.forEach(p => p.remove())
  }

  setUsedState () {
    const usedState = Array.from(
      new Set(
        Array.from(this.referencedIdentifiers)
          .map(i => i.name)
          .concat([...this.initState, ...this.usedThisState])
        )
    )
    .concat(...this.usedState)
    // .filter(i => {
    //   return !methods.has(i)
    // })
    .filter(i => !this.loopScopes.has(i))
    .filter(i => !this.templates.has(i))
    const classPath = this.renderPath.findParent(p => p.isClassDeclaration()) as NodePath<t.ClassDeclaration>
    classPath.node.body.body.unshift(t.classProperty(t.identifier('$usedState'), t.arrayExpression(
      [...new Set(
        usedState
        .filter(s => !this.loopScopes.has(s.split('.')[0]))
        .filter(i => i !== MAP_CALL_ITERATOR && i !== 'state' && i !== 'props')
        .concat(Array.from(this.customComponentNames))
      )]
        .map(s => t.stringLiteral(s))
    )))
  }

  setPendingState () {
    const pendingState = t.objectExpression(
      Array.from(
        new Set(Array.from(this.referencedIdentifiers)
        .map(i => i.name))
      )
      .filter(i => {
        return !this.methods.has(i)
      })
      .filter(i => !this.loopScopes.has(i))
      .filter(i => !this.initState.has(i))
      .filter(i => !this.templates.has(i))
      .filter(i => !i.includes('.'))
      .filter(i => i !== MAP_CALL_ITERATOR && i !== 'state' && i !== 'props')
      .map(i => t.objectProperty(t.identifier(i), t.identifier(i)))
    )
    this.renderPath.node.body.body = this.renderPath.node.body.body.concat(
      buildAssignState(pendingState),
      copyStateToShalowData(),
      t.returnStatement(
        t.memberExpression(t.thisExpression(), t.identifier('state'))
      )
    )
  }

  createData () {
    const renderBody = this.renderPath.get('body')
    renderBody.traverse({
      ThisExpression (path) {
        const property = path.getSibling('property')
        if (property.isIdentifier({ name : 'state' })) {
          property.replaceWith(t.identifier('__state'))
        }
        if (property.isIdentifier({ name : 'props' })) {
          property.replaceWith(t.identifier('__props'))
        }
      }
    })

    renderBody.insertAfter(
      template(`
        delete this.__props;
        const __state = this.__state;
        delete this.__state;
        return __state;
      `)()
    )
    this.renderPath.node.body.body.unshift(
      template(`this.__state = arguments[0] || this.state || {};`)(),
      template(`this.__props = arguments[1] || this.props || {};`)()
    )

    if (t.isIdentifier(this.renderPath.node.key)) {
      this.renderPath.node.key.name = '_createData'
    }
  }
}
