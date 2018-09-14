import { NodePath, Scope, Visitor } from 'babel-traverse'
import * as t from 'babel-types'
import {
  newJSXIfAttr,
  reverseBoolean,
  findIdentifierFromStatement,
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
  hasComplexExpression,
  findMethodName,
  isVarName,
  setParentCondition
} from './utils'
import { difference } from 'lodash'
import {
  setJSXAttr,
  buildBlockElement,
  parseJSXElement
} from './jsx'
import { DEFAULT_Component_SET, MAP_CALL_ITERATOR, LOOP_STATE, LOOP_CALLEE, THIRD_PARTY_COMPONENTS, LOOP_ORIGINAL, INTERNAL_GET_ORIGNAL } from './constant'
import generate from 'babel-generator'
const template = require('babel-template')

type ClassMethodsMap = Map<string, NodePath<t.ClassMethod | t.ClassProperty>>

const calleeId = incrementId()

function isClassDcl (p: NodePath<t.Node>) {
  return p.isClassExpression() || p.isClassDeclaration()
}

interface JSXHandler {
  parentNode: t.Node
  parentPath: NodePath<t.Node>
  statementParent: NodePath<t.Node>
  isReturnStatement?: boolean
  isFinalReturn?: boolean
}

function isChildrenOfJSXAttr (p: NodePath<t.Node>) {
  return !!p.findParent(p => p.isJSXAttribute())
}

function isContainStopPropagation (path: NodePath<t.Node> | null | undefined) {
  let matched = false
  if (path) {
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
  }
  return matched
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

export class RenderParser {
  public outputTemplate: string

  private classProperties = new Set<t.ClassProperty>()
  private templates = new Map<string, t.JSXElement>()
  private jsxDeclarations = new Set<NodePath<t.Node>>()
  private loopScopes = new Set<string>()
  private returnedPaths: NodePath<t.Node>[] = []
  private usedThisState = new Set<string>()
  private loopComponents = new Map<NodePath<t.CallExpression>, NodePath<t.JSXElement>>()
  private loopRefIdentifiers = new Map<string, NodePath<t.CallExpression>>()
  private reserveStateWords = new Set(['state', 'props'])
  private topLevelIfStatement = new Set<NodePath<t.IfStatement>>()
  private usedEvents = new Set<string>()
  private customComponentNames: Set<string>
  private originalCallee = new Map<t.Expression, t.JSXElement>()

  private renderPath: NodePath<t.ClassMethod>
  private methods: ClassMethodsMap
  private initState: Set<string>
  private referencedIdentifiers: Set<t.Identifier>
  private renderScope: Scope
  private usedState: Set<string>
  private loopStateName: Map<NodePath<t.CallExpression>, string>
  private customComponentData: Array<t.ObjectProperty>
  private componentProperies: Set<string>

  private finalReturnElement!: t.JSXElement

  handleJSXElement = (
    jsxElementPath: NodePath<t.JSXElement>,
    func: ({ parentNode, parentPath, statementParent, isReturnStatement, isFinalReturn }: JSXHandler) => void
  ) => {
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
      if (t.isVariableDeclarator(parentNode)) {
        if (statementParent) {
          const name = findIdentifierFromStatement(statementParent.node as t.VariableDeclaration)
          // setTemplate(name, path, templates)
          name && this.templates.set(name, jsxElementPath.node)
        }
      }
      func({ parentNode, parentPath, statementParent, isReturnStatement, isFinalReturn })
    }
  }

  handleConditionExpr ({ parentNode, parentPath, statementParent }: JSXHandler, jsxElementPath: NodePath<t.JSXElement>) {
    if (t.isLogicalExpression(parentNode)) {
      const { left, operator, right } = parentNode
      const leftExpression = parentPath.get('left') as NodePath<t.Expression>
      if (operator === '&&' && t.isExpression(left)) {
        if (hasComplexExpression(leftExpression)) {
          generateAnonymousState(this.renderScope, leftExpression, this.referencedIdentifiers, true)
        }
        const block = buildBlockElement()
        newJSXIfAttr(block, leftExpression.node)
        block.children = [jsxElementPath.node]
        parentPath.replaceWith(block)
        if (statementParent) {
          const name = findIdentifierFromStatement(statementParent.node as t.VariableDeclaration)
          setTemplate(name, jsxElementPath, this.templates)
          // name && templates.set(name, path.node)
        }
      }
      if (operator === '||' && t.isExpression(left)) {
        const newNode = t.conditionalExpression(left, left, right)
        parentPath.replaceWith(newNode)
        // this.handleConditionExpr({ parentNode: newNode, parentPath, statementParent }, jsxElementPath)
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
          block.children = [ jsxElementPath.node ]
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
        block.children = [t.jSXExpressionContainer(consequent)]
        newJSXIfAttr(block, test)
        const block2 = buildBlockElement()
        setJSXAttr(block2, 'wx:else')
        block2.children = [t.jSXExpressionContainer(alternate)]
        const parentBlock = buildBlockElement()
        parentBlock.children = [block, block2]
        parentPath.replaceWith(parentBlock)
        if (statementParent) {
          const name = findIdentifierFromStatement(
            statementParent.node as t.VariableDeclaration
          )
          setTemplate(name, jsxElementPath, this.templates)
        }
      }
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
    const classPath = this.renderPath.findParent(isClassDcl) as NodePath<t.ClassDeclaration>
    classPath.node.body.body.unshift(classProp)
  }

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
        this.handleJSXElement(jsxElementPath, (options) => {
          this.handleConditionExpr(options, jsxElementPath)
        })
      },
      exit: (jsxElementPath: NodePath<t.JSXElement>) => {
        this.handleJSXElement(jsxElementPath, ({ parentNode, parentPath, statementParent, isFinalReturn }) => {
          if (statementParent && statementParent.findParent(p => p === this.renderPath)) {
            this.jsxDeclarations.add(statementParent)
          }
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
                  this.originalCallee.set(ary, jsxElementPath.node)

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
      this.handleJSXElement(jsxElementPath, (options) => {
        const { parentNode, parentPath, isFinalReturn } = options
        this.handleConditionExpr(options, jsxElementPath)
        // this.jsxDeclarations.add(statementParent)
        /**
         * @TODO
         * 有空做一个 TS 的 pattern matching 函数
         * 把分支重构出来复用
         */
        if (t.isReturnStatement(parentNode)) {
          if (!isFinalReturn) {
            //
          } else {
            const ifStatement = parentPath.findParent(p => p.isIfStatement())
            const blockStatement = parentPath.findParent(p => p.isBlockStatement() && p.parentPath === ifStatement) as NodePath<t.BlockStatement>
            if (blockStatement && blockStatement.isBlockStatement()) {
              blockStatement.traverse({
                VariableDeclarator: (p) => {
                  const { id, init } = p.node
                  if (t.isIdentifier(id)) {
                    if (id.name.startsWith('loopArray')) {
                      this.renderPath.node.body.body.unshift(
                        t.variableDeclaration('let', [t.variableDeclarator(t.identifier(id.name))])
                      )
                      p.parentPath.replaceWith(
                        template('ID = INIT;')({ ID: t.identifier(id.name), INIT: init })
                      )
                    } else {
                      const newId = this.renderScope.generateDeclaredUidIdentifier('$' + id.name)
                      this.renderScope.rename(id.name, newId.name)
                      p.parentPath.replaceWith(
                        template('ID = INIT;')({ ID: newId, INIT: init })
                      )
                    }
                  }
                }
              })
            }
            const block = this.finalReturnElement || buildBlockElement()
            if (isBlockIfStatement(ifStatement, blockStatement)) {
              const { test, alternate, consequent } = ifStatement.node
              // blockStatement.node.body.push(t.returnStatement(
              //   t.memberExpression(t.thisExpression(), t.identifier('state'))
              // ))
              if (alternate === blockStatement.node) {
                throw codeFrameError(parentNode.loc, '不必要的 else 分支，请遵从 ESLint consistent-return: https://eslint.org/docs/rules/consistent-return')
              } else if (consequent === blockStatement.node) {
                const parentIfStatement = ifStatement.findParent(p => p.isIfStatement())
                if (parentIfStatement) {
                  setJSXAttr(
                    jsxElementPath.node,
                    'wx:elif',
                    t.jSXExpressionContainer(test),
                    jsxElementPath
                  )
                } else {
                  if (this.topLevelIfStatement.size > 0) {
                    setJSXAttr(
                      jsxElementPath.node,
                      'wx:elif',
                      t.jSXExpressionContainer(test),
                      jsxElementPath
                    )
                  } else {
                    newJSXIfAttr(jsxElementPath.node, test, jsxElementPath)
                    this.topLevelIfStatement.add(ifStatement)
                  }
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
                      t.jSXExpressionContainer(test),
                      jsxElementPath
                    )
                  } else {
                    if (parentIfStatement) {
                      newJSXIfAttr(block, parentIfStatement.node.test, jsxElementPath)
                    }
                    newJSXIfAttr(jsxElementPath.node, test, jsxElementPath)
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
      jsxElementPath.traverse(this.jsxAttrVisitor)
    }
  }

  private jsxAttrVisitor: Visitor = {
    JSXExpressionContainer: (path) => {
      if (!isChildrenOfJSXAttr(path)) {
        return
      }
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
            const args = expression.get('arguments') as any
            (args as NodePath<t.Node>[]).forEach((arg, index) => {
              const node = arg.node
              const argName = generate(node).code
              if (index === 0) {
                setJSXAttr(
                  JSXElement,
                  `data-e-${bindCalleeName}-so`,
                  t.stringLiteral(argName)
                )
              } else {
                let expr: any = null
                if (t.isIdentifier(node) && path.scope.hasBinding(argName)) {
                  this.addRefIdentifier(path, node as t.Identifier)
                  expr = t.jSXExpressionContainer(node)
                } else if (node.type === 'NumericLiteral' || t.isStringLiteral(node) || t.isBooleanLiteral(node) || t.isNullLiteral(node)) {
                  expr = t.jSXExpressionContainer(node as any)
                } else if (hasComplexExpression(arg)) {
                  const id = generateAnonymousState(this.renderScope, arg as any, this.referencedIdentifiers)
                  expr = t.jSXExpressionContainer(id)
                } else {
                  expr = t.jSXExpressionContainer(t.identifier(argName))
                }
                setJSXAttr(
                  JSXElement,
                  `data-e-${bindCalleeName}-a-${toLetters(index)}`,
                  expr!
                )
              }
            })
            expression.replaceWith(t.stringLiteral(`${bindCalleeName}`))
          }
        }
      }
    },
    JSXAttribute: (path) => {
      const { name, value } = path.node
      let eventShouldBeCatched = false
      const jsxElementPath = path.parentPath.parentPath
      if (t.isJSXIdentifier(name) && jsxElementPath.isJSXElement()) {
        const componentName = (jsxElementPath.node.openingElement as any).name.name
        if (name.name === 'key') {
          if (THIRD_PARTY_COMPONENTS.has(componentName as string)) {
            return
          }
          const jsx = path.findParent(p => p.isJSXElement())
          const loopBlock = jsx.findParent(p => {
            if (p.isJSXElement()) {
              const element = p.get('openingElement') as NodePath<t.JSXOpeningElement>
              if (element.get('name').isJSXIdentifier({ name: 'block' })) {
                const attrs = element.node.attributes
                const hasWXForLoop = attrs.some(attr => t.isJSXIdentifier(attr.name, { name: 'wx:for' }))
                const hasWXKey = attrs.some(attr => t.isJSXIdentifier(attr.name, { name: 'wx:key' }))
                return hasWXForLoop && !hasWXKey
              }
            }
            return false
          }) as NodePath<t.JSXElement>
          if (loopBlock) {
            setJSXAttr(loopBlock.node, 'wx:key', value)
            path.remove()
          } else {
            path.get('name').replaceWith(t.jSXIdentifier('wx:key'))
          }
        } else if (
          name.name.startsWith('on')
        ) {
          if (t.isJSXExpressionContainer(value)) {
            const methodName = findMethodName(value.expression)
            methodName && this.usedEvents.add(methodName)
            const method = this.methods.get(methodName)
            // if (method && t.isIdentifier(method.node.key)) {
            //   this.usedEvents.add(methodName)
            // } else if (method === null) {
            //   this.usedEvents.add(methodName)
            // }
            if (!generate(value.expression).code.includes('.bind')) {
              path.node.value = t.stringLiteral(`${methodName}`)
            }
            if (this.methods.has(methodName)) {
              eventShouldBeCatched = isContainStopPropagation(method)
            }
            const componentName = jsxElementPath.node.openingElement.name
            if (t.isJSXIdentifier(componentName) && !DEFAULT_Component_SET.has(componentName.name)) {
              const element = path.parent as t.JSXOpeningElement
              if (process.env.NODE_ENV !== 'test') {
                const fnName = `__fn_${name.name}`
                element.attributes = element.attributes.concat([t.jSXAttribute(t.jSXIdentifier(fnName))])
              }
            }
          }
          if (
            t.isJSXIdentifier(jsxElementPath.node.openingElement.name)
          ) {
            const componentName = jsxElementPath.node.openingElement.name.name
            if (DEFAULT_Component_SET.has(componentName)) {
              let transformName = `${eventShouldBeCatched ? 'catch' : 'bind'}`
                + name.name.slice(2).toLowerCase()
              if (name.name === 'onClick') {
                transformName = eventShouldBeCatched ? 'catchtap' : 'bindtap'
              }
              path.node.name = t.jSXIdentifier(transformName)
            } else if (THIRD_PARTY_COMPONENTS.has(componentName)) {
              path.node.name = t.jSXIdentifier('bind' + name.name.slice(2))
            } else {
              path.node.name = t.jSXIdentifier('bind' + name.name.toLowerCase())
            }
          }
          // let transformName = `${eventShouldBeCatched ? 'catch' : 'bind'}` + name.name.slice(2, name.name.length)
          // transformName = eventShouldBeCatched
          //   ? CATCH_EVENT_MAP.get(name.name)!
          //   : BIND_EVENT_MAP.get(name.name)!
        }
      }
    },
    Identifier: (path) => {
      if (!isChildrenOfJSXAttr(path)) {
        return
      }
      if (!path.isReferencedIdentifier()) {
        return
      }
      const parentPath = path.parentPath
      if (
        parentPath.isConditionalExpression() ||
        parentPath.isLogicalExpression() ||
        parentPath.isJSXExpressionContainer() ||
        this.renderScope.hasOwnBinding(path.node.name)
      ) {
        this.addRefIdentifier(path, path.node)
      }
    },
    MemberExpression: (path) => {
      if (!isChildrenOfJSXAttr(path)) {
        return
      }
      if (!path.isReferencedMemberExpression() || path.parentPath.isMemberExpression()) {
        return
      }
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
        return
      }
      const code = generate(path.node).code
      if (code.includes('this.$router.params') && t.isIdentifier(property)) {
        const name = this.renderScope.generateUid(property.name)
        const dcl = buildConstVariableDeclaration(name, path.node)
        this.renderPath.node.body.body.unshift(dcl)
        path.replaceWith(t.identifier(name))
      }
      const parentPath = path.parentPath
      const id = findFirstIdentifierFromMemberExpression(path.node)
      if (t.isThisExpression(id)) {
        return
      }
      if (
        parentPath.isConditionalExpression() ||
        parentPath.isLogicalExpression() ||
        parentPath.isJSXExpressionContainer() ||
        (this.renderScope.hasOwnBinding(id.name))
      ) {
        this.addRefIdentifier(path, id)
      }
    },
    ArrowFunctionExpression: (path) => {
      if (!isChildrenOfJSXAttr(path)) {
        return
      }
      const uid = path.scope.generateUid('_anonymous_function_')
      const c = t.classProperty(t.identifier(uid), path.node)
      this.classProperties.add(c)
    }
  }

  private visitors: Visitor = {
    JSXEmptyExpression (path) {
      const parent = path.parentPath
      if (path.parentPath.isJSXExpressionContainer()) {
        parent.remove()
      }
    },
    NullLiteral (path) {
      const statementParent = path.getStatementParent()
      if (statementParent && statementParent.isReturnStatement() && !t.isBinaryExpression(path.parent) && !isChildrenOfJSXAttr(path)) {
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
    referencedIdentifiers: Set<t.Identifier>,
    usedState: Set<string>,
    loopStateName: Map<NodePath<t.CallExpression>, string>,
    customComponentNames: Set<string>,
    customComponentData: Array<t.ObjectProperty>,
    componentProperies: Set<string>
  ) {
    this.renderPath = renderPath
    this.methods = methods
    this.initState = initState
    this.referencedIdentifiers = referencedIdentifiers
    this.loopStateName = loopStateName
    this.usedState = usedState
    this.customComponentNames = customComponentNames
    this.customComponentData = customComponentData
    this.componentProperies = componentProperies
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
    this.setCustomEvent()
    this.createData()
    this.setProperies()
  }

  addRefIdentifier (path: NodePath<t.Node>, id: t.Identifier) {
    const arrayMap = path.findParent(p => isArrayMapCallExpression(p))
    if (arrayMap && arrayMap.isCallExpression()) {
      this.loopRefIdentifiers.set(id.name, arrayMap)
    } else {
      id && this.referencedIdentifiers.add(id)
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
      let hasOriginalRef = false
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
          stateToBeAssign.forEach(s => this.loopRefIdentifiers.set(s, callee))
          const properties = Array.from(stateToBeAssign).map(state => t.objectProperty(t.identifier(state), t.identifier(state)))
          // tslint:disable-next-line:no-inner-declarations
          function replaceOriginal (path, parent, name) {
            if (
              path.isReferencedIdentifier() &&
              name === item.name &&
              !(t.isMemberExpression(parent) && t.isIdentifier(parent.property, { name: LOOP_ORIGINAL })) &&
              !(t.isMemberExpression(parent) && t.isIdentifier(parent.property) && (parent.property.name.startsWith(LOOP_STATE) || parent.property.name.startsWith(LOOP_CALLEE)))
            ) {
              path.replaceWith(t.memberExpression(
                t.identifier(item.name),
                t.identifier(LOOP_ORIGINAL)
              ))
              hasOriginalRef = true
            }
          }
          const bodyPath = (callee.get('arguments') as any)[0].get('body')
          bodyPath.traverse({
            Identifier (path) {
              const name = path.node.name
              const parent = path.parent
              replaceOriginal(path, parent, name)
            }
          })
          component.traverse({
            Identifier (path) {
              const name = path.node.name
              const parent = path.parent
              if (stateToBeAssign.has(name) && path.isReferencedIdentifier()) {
                path.replaceWith(
                  t.memberExpression(
                    t.identifier(item.name),
                    path.node
                  )
                )
                hasOriginalRef = true
              }

              replaceOriginal(path, parent, name)
            },
            MemberExpression (path) {
              const id = findFirstIdentifierFromMemberExpression(path.node)
              if (stateToBeAssign.has(id.name)) {
                path.node.object = t.identifier(item.name + '.' + id.name)
              }
            }
          })
          if (hasOriginalRef) {
            const originalProp = t.objectProperty(
              t.identifier(LOOP_ORIGINAL),
              t.memberExpression(
                t.identifier(item.name),
                t.identifier(LOOP_ORIGINAL)
              )
            )
            properties.push(originalProp)
            body.unshift(
              t.expressionStatement(t.assignmentExpression('=', t.identifier(item.name), t.objectExpression([
                t.objectProperty(
                  t.identifier(LOOP_ORIGINAL),
                  t.callExpression(t.identifier(INTERNAL_GET_ORIGNAL), [t.identifier(item.name)])
                )
              ])))
            )
          }
          const returnStatement = t.returnStatement(properties.length ? t.objectExpression(properties) : item)
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
            this.loopStateName.forEach((newName, callExpr) => {
              if (callExpr === callee) {
                const classBody = this.renderPath.parent as t.ClassBody
                for (const property of classBody.body) {
                  if (t.isClassProperty(property) && property.key.name === '$dynamicComponents') {
                    const objects = property.value as t.ObjectExpression
                    for (const objProp of objects.properties) {
                      if (t.isObjectProperty(objProp) && t.isIdentifier(objProp.key, { name: newName })) {
                        const func = objProp.value as any
                        func.body.body[0] = buildConstVariableDeclaration('stateName', t.stringLiteral(stateName))
                      }
                    }
                  }
                }
              }
            })
            // setJSXAttr(returned, 'wx:for', t.identifier(stateName))
            this.addRefIdentifier(callee, t.identifier(stateName))
            // this.referencedIdentifiers.add(t.identifier(stateName))
            setJSXAttr(component.node, 'wx:for', t.jSXExpressionContainer(t.identifier(stateName)))
            const decl = buildConstVariableDeclaration(stateName, setParentCondition(component, callee.node, true))
            let inserted = false
            const returnBody = this.renderPath.node.body.body
            for (let index = 0; index < returnBody.length; index++) {
              const node = returnBody[index]
              const statement = callee.getStatementParent().node
              if (node === statement) {
                returnBody.splice(index, 0, decl)
                inserted = true
                break
              }
              if (t.isIfStatement(node)) {
                const block = node.consequent
                if (t.isBlockStatement(block)) {
                  for (let ii = 0; ii < block.body.length; ii++) {
                    const st = block.body[ii]
                    if (st === statement) {
                      block.body.splice(ii, 0, decl)
                      inserted = true
                      break
                    }
                  }
                }
              }
            }
            if (!inserted) {
              returnBody.push(decl)
            }
          }
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
    this.outputTemplate = parseJSXElement(this.finalReturnElement)
  }

  removeJSXStatement () {
    this.jsxDeclarations.forEach(d => d && d.remove())
    this.returnedPaths.forEach((p: NodePath<t.ReturnStatement>) => {
      const ifStem = p.findParent(_ => _.isIfStatement())
      if (ifStem) {
        const node = p.node
        if (t.isJSXElement(node.argument)) {
          const jsx = node.argument
          if (jsx.children.length === 0 && jsx.openingElement.attributes.length === 0) {
            node.argument = t.nullLiteral()
          } else {
            p.remove()
          }
        } else {
          const isValid = p.get('argument').evaluateTruthy()
          if (!isValid) {
            node.argument = t.nullLiteral()
          } else {
            p.remove()
          }
        }
      } else {
        p.remove()
      }
    })
  }

  setReserveWord = (word: string) => {
    const binding = this.renderScope.getOwnBinding(word)
    let hasStateId = false
    if (binding) {
      const path = binding.path
      const id = path.get('id')
      const init = path.get('init')
      if (init.isThisExpression()) {
        return hasStateId
      }
      if (id.isObjectPattern()) {
        hasStateId = id.node.properties.some(p => {
          return (t.isObjectProperty(p) && t.isIdentifier(p.key, { name: word }))
            || (t.isRestProperty(p) && t.isIdentifier(p.argument, { name: word }))
        })
      } else if (id.isIdentifier({ name: word })) {
        hasStateId = true
      }
      if (hasStateId) {
        this.referencedIdentifiers.add(t.identifier(word))
      }
    }
    if (hasStateId) {
      this.reserveStateWords.delete(word)
    }
  }

  setCustomEvent () {
    const classPath = this.renderPath.findParent(isClassDcl) as NodePath<t.ClassDeclaration>
    let classProp = t.classProperty(t.identifier('$$events'), t.arrayExpression(Array.from(this.usedEvents).map(s => t.stringLiteral(s)))) as any // babel 6 typing 没有 static
    classProp.static = true
    classPath.node.body.body.unshift(classProp)
  }

  setUsedState () {
    Array.from(this.reserveStateWords).forEach(this.setReserveWord)
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
    const classPath = this.renderPath.findParent(isClassDcl) as NodePath<t.ClassDeclaration>
    classPath.node.body.body.unshift(t.classProperty(t.identifier('$usedState'), t.arrayExpression(
      [...new Set(
        usedState
        .filter(s => !this.loopScopes.has(s.split('.')[0]))
        .filter(i => i !== MAP_CALL_ITERATOR && !this.reserveStateWords.has(i))
        .filter(i => isVarName(i))
        .filter(i => !this.loopRefIdentifiers.has(i))
        .concat(Array.from(this.customComponentNames))
      )]
        .map(s => t.stringLiteral(s))
    )))
  }

  setPendingState () {
    let properties = Array.from(
        new Set(Array.from(this.referencedIdentifiers)
        .map(i => i.name))
      )
      .filter(i => {
        return !this.methods.has(i)
      })
      .filter(i => !this.loopScopes.has(i))
      .filter(i => !this.initState.has(i))
      .filter(i => !this.templates.has(i))
      .filter(i => isVarName(i))
      .filter(i => i !== MAP_CALL_ITERATOR && !this.reserveStateWords.has(i))
      .filter(i => !i.startsWith('$$'))
      .filter(i => !this.loopRefIdentifiers.has(i))
      .map(i => t.objectProperty(t.identifier(i), t.identifier(i)))
    if (this.customComponentData.length > 0) {
      properties = properties.concat(this.customComponentData)
    }
    const pendingState = t.objectExpression(properties)
    this.renderPath.node.body.body = this.renderPath.node.body.body.concat(
      buildAssignState(pendingState),
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

    this.renderPath.node.body.body.unshift(
      template(`this.__state = arguments[0] || this.state || {};`)(),
      template(`this.__props = arguments[1] || this.props || {};`)()
    )

    if (t.isIdentifier(this.renderPath.node.key)) {
      this.renderPath.node.key.name = '_createData'
    }
  }
}
