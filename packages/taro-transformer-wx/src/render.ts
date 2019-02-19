import traverse, { NodePath, Scope, Visitor } from 'babel-traverse'
import * as t from 'babel-types'
import { transform as parse } from 'babel-core'
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
  setParentCondition,
  isContainJSXElement,
  getSlotName,
  getSuperClassCode,
  isContainStopPropagation
} from './utils'
import { difference, get as safeGet, cloneDeep } from 'lodash'
import {
  setJSXAttr,
  buildBlockElement,
  parseJSXElement
} from './jsx'
import {
  DEFAULT_Component_SET,
  MAP_CALL_ITERATOR,
  LOOP_STATE,
  LOOP_CALLEE,
  THIRD_PARTY_COMPONENTS,
  LOOP_ORIGINAL,
  INTERNAL_GET_ORIGNAL,
  GEL_ELEMENT_BY_ID,
  ALIPAY_BUBBLE_EVENTS
} from './constant'
import { Adapter, Adapters } from './adapter'
import { transformOptions, buildBabelTransformOptions } from './options'
import generate from 'babel-generator'
import { LoopRef } from './interface'
const template = require('babel-template')

type ClassMethodsMap = Map<string, NodePath<t.ClassMethod | t.ClassProperty>>

function findParents (path: NodePath<t.Node>, cb: (p: NodePath<t.Node>) => boolean) {
  const parents: NodePath<t.Node>[] = []
  // tslint:disable-next-line:no-conditional-assignment
  while (path = path.parentPath) {
    if (cb(path)) {
      parents.push(path)
    }
  }

  return parents
}

function isClassDcl (p: NodePath<t.Node>) {
  return p.isClassExpression() || p.isClassDeclaration()
}

interface JSXHandler {
  parentNode: t.Node
  parentPath: NodePath<t.Node>
  statementParent?: NodePath<t.Node>
  isReturnStatement?: boolean
  isFinalReturn?: boolean
}

function isChildrenOfJSXAttr (p: NodePath<t.Node>) {
  return !!p.findParent(p => p.isJSXAttribute())
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
  private loopCalleeId = new Set<t.Identifier>()
  private usedThisProperties = new Set<string>()
  private incrementCalleeId = incrementId()
  private classComputedState = new Set<string>()

  private renderPath: NodePath<t.ClassMethod>
  private methods: ClassMethodsMap
  private initState: Set<string>
  private referencedIdentifiers: Set<t.Identifier>
  private renderScope: Scope
  private usedState: Set<string>
  private loopStateName: Map<NodePath<t.CallExpression>, string>
  private customComponentData: Array<t.ObjectProperty>
  private componentProperies: Set<string>
  private loopRefs: Map<t.JSXElement, LoopRef>

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

  isLiteralOrUndefined = (node: t.Node): node is t.Literal | t.Identifier => t.isLiteral(node) || t.isIdentifier(node, { name: 'undefined' })

  handleConditionExpr ({ parentNode, parentPath, statementParent }: JSXHandler, jsxElementPath: NodePath<t.JSXElement>) {
    if (parentPath.isObjectProperty()) {
      const value = parentPath.get('value')
      if (value !== jsxElementPath) {
        return
      }
      if (!parentPath.parentPath.isObjectExpression()) {
        return
      }
      const properties = parentPath.parentPath.get('properties')
      if (!parentPath.parentPath.parentPath.isMemberExpression()) {
        return
      }
      const rval = parentPath.parentPath.parentPath.get('property')
      if (!rval || !rval.node || !Array.isArray(properties)) {
        return
      }
      const children = properties.map(p => p.node).map((p, index) => {
        const block = buildBlockElement()
        const tester = t.binaryExpression('===', p.key, rval.node as any)
        block.children = [t.jSXExpressionContainer(p.value)]
        if (index === 0) {
          newJSXIfAttr(block, tester)
        } else {
          setJSXAttr(block, Adapter.elseif, t.jSXExpressionContainer(tester))
        }
        return block
      })
      const block = buildBlockElement()
      block.children = children
      parentPath.parentPath.parentPath.replaceWith(block)
    } else if (t.isLogicalExpression(parentNode)) {
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
      if (t.isJSXElement(consequent) && this.isLiteralOrUndefined(alternate)) {
        const { value, confident } = parentPath.get('alternate').evaluate()
        if (confident && !value || t.isIdentifier({ name: 'undefined' })) {
          newJSXIfAttr(block, test)
          block.children = [ jsxElementPath.node ]
          // newJSXIfAttr(jsxElementPath.node, test)
          parentPath.replaceWith(block)
        } else {
          const block2 = buildBlockElement()
          block.children = [consequent]
          newJSXIfAttr(block, test)
          setJSXAttr(block2, Adapter.else)
          block2.children = [t.jSXExpressionContainer(alternate)]
          const parentBlock = buildBlockElement()
          parentBlock.children = [block, block2]
          parentPath.replaceWith(parentBlock)
        }
        if (statementParent) {
          const name = findIdentifierFromStatement(
            statementParent.node as t.VariableDeclaration
          )
          setTemplate(name, jsxElementPath, this.templates)
          // name && templates.set(name, path.node)
        }
      } else if (this.isLiteralOrUndefined(consequent) && t.isJSXElement(alternate)) {
        const { value, confident } = parentPath.get('consequent').evaluate()
        if (confident && !value || t.isIdentifier({ name: 'undefined' })) {
          newJSXIfAttr(block, reverseBoolean(test))
          block.children = [ jsxElementPath.node ]
          // newJSXIfAttr(jsxElementPath.node, test)
          parentPath.replaceWith(block)
        } else {
          const block2 = buildBlockElement()
          block.children = [t.jSXExpressionContainer(consequent)]
          newJSXIfAttr(block, test)
          setJSXAttr(block2, Adapter.else)
          block2.children = [alternate]
          const parentBlock = buildBlockElement()
          parentBlock.children = [block, block2]
          parentPath.replaceWith(parentBlock)
        }
        if (statementParent) {
          const name = findIdentifierFromStatement(
            statementParent.node as t.VariableDeclaration
          )
          setTemplate(name, jsxElementPath, this.templates)
          // name && templates.set(name, path.node)
        }
      } else if (t.isJSXElement(consequent) && t.isJSXElement(alternate)) {
        const block2 = buildBlockElement()
        block.children = [consequent]
        newJSXIfAttr(block, test)
        setJSXAttr(block2, Adapter.else)
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
      } else if (t.isJSXElement(consequent) && t.isCallExpression(alternate) && !isArrayMapCallExpression(parentPath.get('alternate'))) {
        const id = generateAnonymousState(this.renderScope!, parentPath.get('alternate') as any, this.referencedIdentifiers, true)
        parentPath.get('alternate').replaceWith(id)
        //
      } else if (t.isJSXElement(alternate) && t.isCallExpression(consequent) && !isArrayMapCallExpression(parentPath.get('consequent'))) {
        const id = generateAnonymousState(this.renderScope!, parentPath.get('consequent') as any, this.referencedIdentifiers, true)
        parentPath.get('consequent').replaceWith(id)
      } else {
        block.children = [t.jSXExpressionContainer(consequent)]
        newJSXIfAttr(block, test)
        const block2 = buildBlockElement()
        setJSXAttr(block2, Adapter.else)
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
        t.objectProperty(t.stringLiteral(propName), t.objectExpression([
          t.objectProperty(t.stringLiteral('type'), t.nullLiteral()),
          t.objectProperty(t.stringLiteral('value'), t.nullLiteral())
        ]))
      )
    })
    let classProp = t.classProperty(
      t.identifier('properties'),
      t.objectExpression(properties)
    ) as any
    classProp.static = true
    const classPath = this.renderPath.findParent(isClassDcl) as NodePath<t.ClassDeclaration>
    Adapter.type !== Adapters.alipay && classPath.node.body.body.unshift(classProp)
  }

  setLoopRefFlag () {
    if (this.loopRefs.size) {
      const classPath = this.renderPath.findParent(isClassDcl) as NodePath<t.ClassDeclaration>
      classPath.node.body.body.unshift(t.classProperty(t.identifier('$$hasLoopRef'), t.booleanLiteral(true)))
    }
  }

  replaceIdWithTemplate = (handleRefId = false) => (path: NodePath<t.Node>) => {
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
            if (handleRefId && Object.keys(this.renderScope.getAllBindings()).includes(name)) {
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

  hasStateOrProps = (key: 'state' | 'props') => (p: t.AssignmentProperty | t.RestProperty) => t.isObjectProperty(p) && t.isIdentifier(p.key) && p.key.name === key

  private destructStateOrProps (
    key: 'state' | 'props',
    path: NodePath<t.VariableDeclarator>,
    properties: (t.AssignmentProperty | t.RestProperty)[],
    parentPath: NodePath<t.Node>
  ) {
    const hasStateOrProps = properties.filter(p => t.isObjectProperty(p) && t.isIdentifier(p.key) && key === p.key.name)
    if (hasStateOrProps.length === 0) {
      return
    }
    if (hasStateOrProps.length !== properties.length) {
      throw codeFrameError(path.node, 'state 或 props 只能单独从 this 中解构')
    }
    const declareState = template(`const ${key} = this.${key};`)()
    if (properties.length > 1) {
      const index = properties.findIndex(p => t.isObjectProperty(p) && t.isIdentifier(p.key, { name: key }))
      properties.splice(index, 1)
      parentPath.insertAfter(declareState)
    } else {
      parentPath.insertAfter(declareState)
      parentPath.remove()
    }
  }

  private loopComponentVisitor: Visitor = {
    VariableDeclarator: (path) => {
      const id = path.get('id')
      const init = path.get('init')
      const parentPath = path.parentPath
      if (
        id.isObjectPattern() &&
        init.isThisExpression() &&
        parentPath.isVariableDeclaration()
      ) {
        const { properties } = id.node
        this.destructStateOrProps('state', path, properties, parentPath)
        this.destructStateOrProps('props', path, properties, parentPath)
      }
    },
    JSXElement: {
      enter: (jsxElementPath: NodePath<t.JSXElement>) => {
        this.handleJSXElement(jsxElementPath, (options) => {
          this.handleConditionExpr(options, jsxElementPath)
          const ifStem = jsxElementPath.findParent(p => p.isIfStatement()) as NodePath<t.IfStatement>
          if (ifStem && ifStem.findParent(isArrayMapCallExpression)) {
            const block = buildBlockElement()
            block.children = [jsxElementPath.node]
            newJSXIfAttr(block, ifStem.node.test)
            if (!jsxElementPath.node.openingElement.attributes.some(a => a.name.name === Adapter.if)) {
              jsxElementPath.replaceWith(block)
            }
          }
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
                    const variableName = `${LOOP_CALLEE}_${this.incrementCalleeId()}`
                    callExpr.getStatementParent().insertBefore(
                      buildConstVariableDeclaration(variableName, setParentCondition(jsxElementPath, ary, true))
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
                  setJSXAttr(jsxElementPath.node, Adapter.for, t.jSXExpressionContainer(ary))
                  this.loopCalleeId.add(findFirstIdentifierFromMemberExpression(callee))
                  const [func] = callExpr.node.arguments
                  if (
                    t.isFunctionExpression(func) ||
                    t.isArrowFunctionExpression(func)
                  ) {
                    const [item, index] = func.params
                    if (t.isIdentifier(item)) {
                      setJSXAttr(
                        jsxElementPath.node,
                        Adapter.forItem,
                        t.stringLiteral(item.name)
                      )
                      this.loopScopes.add(item.name)
                    } else if (t.isObjectPattern(item)) {
                      throw codeFrameError(item.loc, 'JSX map 循环参数暂时不支持使用 Object pattern 解构。')
                    } else {
                      setJSXAttr(
                        jsxElementPath.node,
                        Adapter.forItem,
                        t.stringLiteral('__item')
                      )
                    }
                    if (t.isIdentifier(index)) {
                      setJSXAttr(
                        jsxElementPath.node,
                        Adapter.forIndex,
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

  private renameIfScopeVaribale = (blockStatement: NodePath<t.BlockStatement>): Visitor => {
    return {
      VariableDeclarator: (p) => {
        const { id, init } = p.node
        const ifStem = p.parentPath.parentPath.parentPath
        if (!ifStem.isIfStatement() || isContainJSXElement(p)) {
          return
        }
        if (t.isIdentifier(id)) {
          if (id.name.startsWith('loopArray') || id.name.startsWith(LOOP_CALLEE)) {
            this.renderPath.node.body.body.unshift(
              t.variableDeclaration('let', [t.variableDeclarator(t.identifier(id.name))])
            )
            p.parentPath.replaceWith(
              template('ID = INIT;')({ ID: t.identifier(id.name), INIT: init })
            )
          } else {
            const newId = this.renderScope.generateDeclaredUidIdentifier('$' + id.name)
            blockStatement.scope.rename(id.name, newId.name)
            p.parentPath.replaceWith(
              template('ID = INIT;')({ ID: newId, INIT: init || t.identifier('undefined') })
            )
          }
        }
      },
      JSXElement: (jsxElementPath) => {
        this.handleJSXElement(jsxElementPath, (options) => {
          this.handleConditionExpr(options, jsxElementPath)
        })
      },
      JSXExpressionContainer: this.replaceIdWithTemplate()
    }
  }

  private handleJSXInIfStatement (jsxElementPath: NodePath<t.JSXElement>, { parentNode, parentPath, isFinalReturn }: JSXHandler) {
    if (t.isReturnStatement(parentNode)) {
      if (!isFinalReturn) {
        return
      } else {
        const ifStatement = parentPath.findParent(p => p.isIfStatement())
        const blockStatement = parentPath.findParent(p => p.isBlockStatement() && (p.parentPath === ifStatement)) as NodePath<t.BlockStatement>
        if (blockStatement && blockStatement.isBlockStatement()) {
          blockStatement.traverse(this.renameIfScopeVaribale(blockStatement))
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
                Adapter.elseif,
                t.jSXExpressionContainer(test),
                jsxElementPath
              )
            } else {
              if (this.topLevelIfStatement.size > 0) {
                setJSXAttr(
                  jsxElementPath.node,
                  Adapter.elseif,
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
          setJSXAttr(jsxElementPath.node, Adapter.else)
        }
        block.children.push(jsxElementPath.node)
        this.finalReturnElement = block
        this.returnedPaths.push(parentPath)
      }
    } else if (t.isArrowFunctionExpression(parentNode)) {
      // console.log('arrow')
    } else if (t.isAssignmentExpression(parentNode)) {
      const ifStatement = parentPath.findParent(p => p.isIfStatement())
      const blockStatement = parentPath.findParent(p => p.isBlockStatement() && (p.parentPath === ifStatement)) as NodePath<t.BlockStatement>
      if (blockStatement && blockStatement.isBlockStatement()) {
        blockStatement.traverse(this.renameIfScopeVaribale(blockStatement))
      }
      if (t.isIdentifier(parentNode.left)) {
        const assignmentName = parentNode.left.name
        const bindingNode = this.renderScope.getOwnBinding(assignmentName)!.path.node
        let block = this.templates.get(assignmentName) || buildBlockElement()
        if (isEmptyDeclarator(bindingNode)) {
          const blockStatement = parentPath.findParent(p =>
            p.isBlockStatement()
          )
          if (isBlockIfStatement(ifStatement, blockStatement)) {
            const { test, alternate, consequent } = ifStatement.node
            if (alternate === blockStatement.node) {
              setJSXAttr(jsxElementPath.node, Adapter.else)
            } else if (consequent === blockStatement.node) {
              const parentIfStatement = ifStatement.findParent(p =>
                p.isIfStatement()
              ) as NodePath<t.IfStatement>
              const assignments: t.AssignmentExpression[] = []
              let isAssignedBefore = false
              // @TODO: 重构这两种循环为通用模块

              // 如果这个 JSX assigmnent 的作用域中有其他的 if block 曾经赋值过，它应该是 else-if
              if (blockStatement && blockStatement.isBlockStatement()) {
                for (const parentStatement of blockStatement.node.body) {
                  if (t.isIfStatement(parentStatement) && t.isBlockStatement(parentStatement.consequent)) {
                    const statements = parentStatement.consequent.body
                    for (const statement of statements) {
                      if (t.isExpressionStatement(statement) && t.isAssignmentExpression(statement.expression) && t.isIdentifier(statement.expression.left, { name: assignmentName })) {
                        isAssignedBefore = true
                      }
                    }
                  }
                }
              }

              // 如果这个 JSX assigmnent 的的父级作用域中的 prev sibling 有相同的赋值，它应该是 else-if
              if (parentIfStatement) {
                const { consequent } = parentIfStatement.node
                if (t.isBlockStatement(consequent)) {
                  const body = consequent.body
                  for (const parentStatement of body) {
                    if (t.isIfStatement(parentStatement) && t.isBlockStatement(parentStatement.consequent)) {
                      const statements = parentStatement.consequent.body
                      for (const statement of statements) {
                        if (t.isExpressionStatement(statement) && t.isAssignmentExpression(statement.expression) && t.isIdentifier(statement.expression.left, { name: assignmentName })) {
                          assignments.push(statement.expression)
                        }
                      }
                    }
                  }
                }
              }
              if (
                (
                  parentIfStatement &&
                  (
                    parentIfStatement.get('alternate') === ifStatement ||
                    assignments.findIndex(a => a === parentNode) > 0
                  )
                )
                ||
                isAssignedBefore
              ) {
                setJSXAttr(
                  jsxElementPath.node,
                  Adapter.elseif,
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
            const ifAttr = block.openingElement.attributes.find(a => a.name.name === Adapter.if)
            if (ifAttr && t.isJSXExpressionContainer(ifAttr.value, { expression: test })) {
              const newBlock = buildBlockElement()
              newBlock.children = [block, jsxElementPath.node]
              block = newBlock
            } else {
              block.children.push(jsxElementPath.node)
            }
            // setTemplate(name, path, templates)
            assignmentName && this.templates.set(assignmentName, block)
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
  }

  private jsxElementVisitor: Visitor = {
    JSXElement: (jsxElementPath) => {
      this.handleJSXElement(jsxElementPath, (options) => {
        this.handleConditionExpr(options, jsxElementPath)
        this.handleJSXInIfStatement(jsxElementPath, options)
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
          const JSXElement = path.findParent(p => p.isJSXElement())
            .node as t.JSXElement
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
            const attr = path.parentPath.node as t.JSXAttribute
            let bindEventName = attr.name.name as string
            bindEventName = bindEventName.replace(/^bind|^catch/, '')

            const args = expression.get('arguments') as any
            (args as NodePath<t.Node>[]).forEach((arg, index) => {
              const node = arg.node
              const argName = generate(node).code
              if (index === 0) {
                setJSXAttr(
                  JSXElement,
                  `data-e-${bindEventName}-so`,
                  t.stringLiteral(argName)
                )
              } else {
                let expr: any = null
                if (t.isIdentifier(node) && path.scope.hasBinding(argName)) {
                  this.addRefIdentifier(path, node as t.Identifier)
                  expr = t.jSXExpressionContainer(node)
                } else if (t.isMemberExpression(node)) {
                  const id = findFirstIdentifierFromMemberExpression(node)
                  this.addRefIdentifier(path, id)
                  expr = t.jSXExpressionContainer(node)
                } else if (node.type === 'NumericLiteral' || t.isStringLiteral(node) || t.isBooleanLiteral(node) || t.isNullLiteral(node)) {
                  expr = t.jSXExpressionContainer(node as any)
                } else if (hasComplexExpression(arg)) {
                  const isCookedLoop = JSXElement.openingElement.attributes.some(attr => attr.name.name === Adapter.for)
                  if (isCookedLoop) {
                    throw codeFrameError(arg.node, '在循环中使用 bind 时，需要声明将此复杂表达式声明为一个变量再放入 bind 参数中。')
                  } else {
                    const id = generateAnonymousState(this.renderScope, arg as any, this.referencedIdentifiers)
                    expr = t.jSXExpressionContainer(id)
                  }
                } else {
                  expr = t.jSXExpressionContainer(t.identifier(argName))
                }
                setJSXAttr(
                  JSXElement,
                  `data-e-${bindEventName}-a-${toLetters(index)}`,
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
        const isThirdPartyKey = name.name === 'taroKey'
        if (name.name === 'key' || isThirdPartyKey) {
          if (THIRD_PARTY_COMPONENTS.has(componentName as string) && !isThirdPartyKey) {
            return
          }
          const jsx = path.findParent(p => p.isJSXElement())
          const loopBlock = jsx.findParent(p => {
            if (p.isJSXElement()) {
              const element = p.get('openingElement') as NodePath<t.JSXOpeningElement>
              if (element.get('name').isJSXIdentifier({ name: 'block' })) {
                const attrs = element.node.attributes
                const hasWXForLoop = attrs.some(attr => t.isJSXIdentifier(attr.name, { name: Adapter.for }))
                const hasWXKey = attrs.some(attr => t.isJSXIdentifier(attr.name, { name: Adapter.key }))
                return hasWXForLoop && !hasWXKey
              }
            }
            return false
          }) as NodePath<t.JSXElement>
          if (loopBlock) {
            setJSXAttr(loopBlock.node, Adapter.key, value)
            path.remove()
          } else {
            path.get('name').replaceWith(t.jSXIdentifier(Adapter.key))
          }
        } else if (
          name.name.startsWith('on')
        ) {
          if (t.isJSXExpressionContainer(value)) {
            const methodName = findMethodName(value.expression)
            methodName && this.usedEvents.add(methodName)
            const method = this.methods.get(methodName)
            const classDecl = path.findParent(p => p.isClassDeclaration())
            const componentName = jsxElementPath.node.openingElement.name
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
            if (classDecl && classDecl.isClassDeclaration()) {
              const superClass = getSuperClassCode(classDecl)
              if (superClass) {
                try {
                  const ast = parse(superClass.code, buildBabelTransformOptions()).ast as t.File
                  traverse(ast, {
                    ClassMethod (p) {
                      if (!p.get('key').isIdentifier({ name: methodName })) {
                        return
                      }
                      eventShouldBeCatched = isContainStopPropagation(method)
                    },
                    ClassProperty (p) {
                      if (!p.get('key').isIdentifier({ name: methodName })) {
                        return
                      }
                      eventShouldBeCatched = isContainStopPropagation(method)
                    }
                  })
                } catch (error) {
                  //
                }
              }
            }
            if (t.isJSXIdentifier(componentName) && !DEFAULT_Component_SET.has(componentName.name)) {
              const element = path.parent as t.JSXOpeningElement
              if (process.env.NODE_ENV !== 'test' && Adapter.type !== Adapters.alipay) {
                const fnName = `__fn_${name.name}`
                element.attributes = element.attributes.concat([t.jSXAttribute(t.jSXIdentifier(fnName))])
              }
            }
          }
          if (
            t.isJSXIdentifier(jsxElementPath.node.openingElement.name)
          ) {
            const componentName = jsxElementPath.node.openingElement.name.name
            if (Adapter.type === Adapters.alipay) {
              let transformName = name.name
              if (DEFAULT_Component_SET.has(componentName) && ALIPAY_BUBBLE_EVENTS.has(name.name)) {
                if (name.name === 'onClick') {
                  transformName = eventShouldBeCatched ? 'catchTap' : 'onTap'
                } else {
                  transformName = `${eventShouldBeCatched ? 'catch' : 'on'}${name.name.slice(2)}`
                }
              }
              path.node.name = t.jSXIdentifier(transformName)
            } else if (DEFAULT_Component_SET.has(componentName)) {
              let transformName = `${eventShouldBeCatched ? 'catch' : 'bind'}`
                + name.name.slice(2).toLowerCase()
              if (name.name === 'onClick') {
                transformName = eventShouldBeCatched ? 'catchtap' : 'bindtap'
              }
              path.node.name = t.jSXIdentifier(transformName)
            } else if (THIRD_PARTY_COMPONENTS.has(componentName)) {
              path.node.name = t.jSXIdentifier('bind' + name.name[2].toLowerCase() + name.name.slice(3))
            } else {
              path.node.name = t.jSXIdentifier('bind' + name.name.toLowerCase())
            }
          }
          // let transformName = `${eventShouldBeCatched ? 'catch' : 'bind'}` + name.name.slice(2, name.name.length)
          // transformName = eventShouldBeCatched
          //   ? CATCH_EVENT_MAP.get(name.name)!
          //   : BIND_EVENT_MAP.get(name.name)!
        } else if (/^render[A-Z]/.test(name.name) && !DEFAULT_Component_SET.has(componentName)) {
          if (!t.isJSXExpressionContainer(value)) {
            throw codeFrameError(value, '以 render 开头的 props 只能传入包含一个 JSX 元素的 JSX 表达式。')
          }
          const expression = value.expression
          if (!t.isJSXElement(expression)) {
            throw codeFrameError(value, '以 render 开头的 props 只能传入包含一个 JSX 元素的 JSX 表达式。')
          }
          const slotName = getSlotName(name.name)
          const slot = cloneDeep(expression)
          setJSXAttr(slot, 'slot', t.stringLiteral(slotName))
          jsxElementPath.node.children.push(slot)
          path.remove()
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
        parentPath.isBinaryExpression() ||
        this.renderScope.hasOwnBinding(path.node.name)
      ) {
        this.addRefIdentifier(path, path.node)
      }
    },
    MemberExpression: {
      exit: (path: NodePath<t.MemberExpression>) => {
        const { object, property } = path.node
        if (!path.isReferencedMemberExpression()) {
          return
        }
        if (!t.isThisExpression(object)) {
          return
        }
        const reserves = new Set([
          'state',
          'props',
          ...this.methods.keys()
        ])
        if (t.isIdentifier(property) || t.isMemberExpression(property)) {
          const id = t.isIdentifier(property) ? property : findFirstIdentifierFromMemberExpression(property)
          if (reserves.has(id.name)) {
            return
          }
          const jsxAttr = path.findParent(p => p.isJSXAttribute()) as NodePath<t.JSXAttribute>
          if (jsxAttr && t.isJSXIdentifier(jsxAttr.node.name) && jsxAttr.node.name.name.startsWith('on')) {
            return
          }
          if (t.isIdentifier(id)) {
            this.referencedIdentifiers.add(id)
            this.usedThisProperties.add(id.name)
          }
        }
      },
      enter: (path) => {
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
          parentPath.isBinaryExpression() ||
          (this.renderScope.hasOwnBinding(id.name))
        ) {
          this.addRefIdentifier(path, id)
        }
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
    VariableDeclarator: (path) => {
      const init = path.get('init')
      const id = path.get('id')
      const ifStem = init.findParent(p => p.isIfStatement())
      if (ifStem && init.node === null) {
        init.replaceWith(t.identifier('undefined'))
      }
      let isDerivedFromState = false
      if (init.isMemberExpression()) {
        const object = init.get('object')
        if (object.isMemberExpression() && object.get('object').isThisExpression() && object.get('property').isIdentifier({ name: 'state' })) {
          isDerivedFromState = true
        }
        if (object.isThisExpression() && init.get('property').isIdentifier({ name: 'state' })) {
          isDerivedFromState = true
        }
      }
      if (!isDerivedFromState) {
        const errMsg = 'Warning: render 函数定义一个不从 this.state 解构或赋值而来的变量，此变量又与 this.state 下的变量重名可能会导致无法渲染。'
        if (id.isIdentifier()) {
          const name = id.node.name
          if (this.initState.has(name)) {
            // tslint:disable-next-line
            console.log(codeFrameError(id.node, errMsg).message)
          }
        }
        if (id.isObjectPattern()) {
          const { properties } = id.node
          for (const p of properties) {
            if (t.isIdentifier(p)) {
              if (this.initState.has(p.name)) {
                // tslint:disable-next-line
                console.log(codeFrameError(id.node, errMsg).message)
              }
            }
            if (t.isSpreadProperty(p) && t.isIdentifier(p.argument)) {
              if (this.initState.has(p.argument.name)) {
                // tslint:disable-next-line
                console.log(codeFrameError(id.node, errMsg).message)
              }
            }
          }
        }
      }
    },
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
    ReturnStatement: (path) => {
      const parentPath = path.parentPath
      if (
        parentPath.parentPath.isClassMethod() ||
        (parentPath.parentPath.isIfStatement() && parentPath.parentPath.parentPath.isClassMethod())
      ) {
        this.replaceIdWithTemplate()(path)
      }
    },

    ...this.jsxElementVisitor,
    JSXExpressionContainer: this.replaceIdWithTemplate(true)
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
    componentProperies: Set<string>,
    loopRefs: Map<t.JSXElement, LoopRef>
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
    this.loopRefs = loopRefs
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
    this.checkDuplicateName()
    this.removeJSXStatement()
    this.setUsedState()
    this.setPendingState()
    this.setCustomEvent()
    this.createData()
    this.setProperies()
    this.setLoopRefFlag()
  }

  checkDuplicateData () {
    this.initState.forEach((stateName) => {
      if (this.templates.has(stateName)) {
        throw codeFrameError(this.templates.get(stateName)!, `自定义变量组件名: \`${stateName}\` 和已有 this.state.${stateName} 重复。请使用另一个变量名。`)
      }
    })

    this.componentProperies.forEach((componentName) => {
      if (this.componentProperies.has(componentName)) {
        throw codeFrameError(this.renderPath.node, `state: \`${componentName}\` 和已有 this.props.${componentName} 重复。请使用另一个变量名。`)
      }
      if (this.templates.has(componentName)) {
        throw codeFrameError(this.templates.get(componentName)!, `自定义变量组件名: \`${componentName}\` 和已有 this.props.${componentName} 重复。请使用另一个变量名。`)
      }
    })
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
    let hasLoopRef = false
    this.loopComponents.forEach((component, callee) => {
      if (!callee.isCallExpression()) {
        return
      }
      for (const dcl of this.jsxDeclarations) {
        const isChildren = dcl && dcl.findParent(d => d === callee)
        if (isChildren) {
          this.jsxDeclarations.delete(dcl)
          dcl.remove()
        }
      }
      const blockStatementPath = component.findParent(p => p.isBlockStatement()) as NodePath<t.BlockStatement>
      const body = blockStatementPath.node.body
      let loopRefComponent: t.JSXElement
      this.loopRefs.forEach((ref, jsx) => {
        if (ref.component.findParent(p => p === component)) {
          loopRefComponent = jsx
        }
      })
      if (this.loopRefs.has(component.node) || loopRefComponent!) {
        hasLoopRef = true
        const ref = this.loopRefs.get(component.node)! || this.loopRefs.get(loopRefComponent)
        const [ func ] = callee.node.arguments
        let indexId: t.Identifier | null = null
        if (t.isFunctionExpression(func) || t.isArrowFunctionExpression(func)) {
          const params = func.params as t.Identifier[]
          indexId = params[1]
        }
        if (indexId === null || !t.isIdentifier(indexId!)) {
          throw codeFrameError(component.node, '在循环中使用 ref 必须暴露循环的第二个参数 `index`')
        }
        const id = typeof ref.id === 'string' ? t.binaryExpression('+', t.stringLiteral(ref.id), indexId) : ref.id
        const refDeclName = '__ref'
        const args: any[] = [
          t.identifier('__scope'),
          t.binaryExpression('+', t.stringLiteral('#'), id)
        ]
        if (ref.type === 'component') {
          args.push(t.stringLiteral('component'))
        }
        const callGetElementById = t.callExpression(t.identifier(GEL_ELEMENT_BY_ID), args)
        const refDecl = buildConstVariableDeclaration(refDeclName,
          process.env.NODE_ENV === 'test' ? callGetElementById : t.logicalExpression('&&', t.identifier('__scope'), t.logicalExpression('&&', t.identifier('__runloopRef'), callGetElementById))
        )
        const callRef = t.callExpression(ref.fn, [t.identifier(refDeclName)])
        const callRefFunc = t.expressionStatement(
          process.env.NODE_ENV === 'test' ? callRef : t.logicalExpression('&&', t.identifier(refDeclName), callRef)
        )
        body.push(refDecl, callRefFunc)
      }
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
          const parents = findParents(callee, (p) => isArrayMapCallExpression(p))
          const iterators = new Set<string>(
            [item.name, ...parents
              .map((p) => safeGet(p, 'node.arguments[0].params[0].name', ''))
              .filter(Boolean)]
          )
          for (const [ index, statement ] of body.entries()) {
            if (t.isVariableDeclaration(statement)) {
              for (const dcl of statement.declarations) {
                if (t.isIdentifier(dcl.id)) {
                  const name = dcl.id.name
                  if (
                    name.startsWith(LOOP_STATE) ||
                    name.startsWith(LOOP_CALLEE)
                  ) {
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
              iterators.has(name) &&
              !(t.isMemberExpression(parent) && t.isIdentifier(parent.property, { name: LOOP_ORIGINAL })) &&
              !(t.isMemberExpression(parent) && t.isIdentifier(parent.property) && (parent.property.name.startsWith(LOOP_STATE) || parent.property.name.startsWith(LOOP_CALLEE)))
            ) {
              path.replaceWith(t.memberExpression(
                t.identifier(name),
                t.identifier(LOOP_ORIGINAL)
              ))
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
          const replacements = new Set()
          component.traverse({
            JSXExpressionContainer: this.replaceIdWithTemplate(),
            Identifier: (path) => {
              const name = path.node.name
              const parent = path.parent
              const parentCallExpr = path.findParent(p => p.isCallExpression())
              if (replacements.has(parent) || (
                this.renderScope.hasOwnBinding(name) &&
                (this.loopCalleeId.has(path.node) || parentCallExpr && this.loopCalleeId.has(parentCallExpr.node as any))
              )) {
                return
              }

              if (stateToBeAssign.has(name) && path.isReferencedIdentifier()) {
                if (t.isMemberExpression(parent) && t.isIdentifier(parent.property, { name: 'map' })) {
                  const grandParentPath = path.parentPath.parentPath
                  if (grandParentPath.isCallExpression() && this.loopComponents.has(grandParentPath)) {
                    return
                  }
                }
                const replacement = t.memberExpression(
                  t.identifier(item.name),
                  path.node
                )
                path.replaceWith(replacement)
                replacements.add(replacement)
              } else {
                replaceOriginal(path, parent, name)
              }

            },
            MemberExpression (path) {
              const { object, property } = path.node
              if (t.isThisExpression(object) && t.isIdentifier(property, { name: 'state' })) {
                if (path.parentPath.isMemberExpression() && path.parentPath.parentPath.isMemberExpression()) {
                  // tslint:disable-next-line
                  console.warn(
                    codeFrameError(path.parentPath.parentPath.node,
                      `在循环中使用 this.state.xx.xx 可能会存在问题，请给 xx 起一个别名，例如 const { xx } = this.state`
                    )
                  )
                }
              }
            }
          })
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
          const returnStatement = t.returnStatement(properties.length ? t.objectExpression(properties) : item)
          const parentCallee = callee.findParent(c => isArrayMapCallExpression(c))
          if (isArrayMapCallExpression(parentCallee)) {
            const [ func ] = parentCallee.node.arguments
            const { object } = callee.node.callee as t.MemberExpression
            if (t.isFunctionExpression(func) || t.isArrowFunctionExpression(func)) {
              const funcBody = func.body
              if (t.isBlockStatement(funcBody)) {
                if (t.isIdentifier(object) || t.isMemberExpression(object)) {
                  const variableName = `${LOOP_CALLEE}_${this.incrementCalleeId()}`
                  funcBody.body.splice(
                    funcBody.body.length - 1,
                    0,
                    buildConstVariableDeclaration(
                      variableName,
                      setParentCondition(component, callee.node, true)
                    )
                  )
                  const iterator = func.params[0]
                  component.node.openingElement.attributes.forEach(attr => {
                    if (attr.name.name === Adapter.for && t.isIdentifier(iterator)) {
                      attr.value = t.jSXExpressionContainer(
                        t.memberExpression(
                          iterator,
                          t.identifier(variableName)
                        )
                      )
                    }
                  })
                } else {
                  throw codeFrameError(object.loc, '多层循环中循环的数组只能是一个变量或成员表达式')
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
            // setJSXAttr(returned, Adapter.for, t.identifier(stateName))
            this.addRefIdentifier(callee, t.identifier(stateName))
            // this.referencedIdentifiers.add(t.identifier(stateName))
            setJSXAttr(component.node, Adapter.for, t.jSXExpressionContainer(t.identifier(stateName)))
            const returnBody = this.renderPath.node.body.body
            const ifStem = callee.findParent(p => p.isIfStatement())
            // @TEST
            if (ifStem && ifStem.isIfStatement()) {
              const consequent = ifStem.get('consequent')
              if (consequent.isBlockStatement()) {
                const assignment = t.expressionStatement(
                  t.assignmentExpression(
                    '=',
                    t.identifier(stateName),
                    setParentCondition(component, callee.node, true)
                  )
                )
                returnBody.unshift(
                  t.variableDeclaration('let', [t.variableDeclarator(t.identifier(stateName))])
                )
                consequent.node.body.push(assignment)
              }
            } else {
              const decl = buildConstVariableDeclaration(stateName, setParentCondition(component, callee.node, true))
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
    if (hasLoopRef) {
      const scopeDecl = template('const __scope = this.$scope')()
      this.renderPath.node.body.body.unshift(scopeDecl)
    }
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
    for (const [ key, method ] of this.methods) {
      if (method) {
        if (method.isClassMethod()) {
          const kind = method.node.kind
          if (kind === 'get') {
            this.classComputedState.add(key)
          }
        }
      }
    }

    const componentProperies = cloneDeep(this.componentProperies)

    componentProperies.forEach(s => {
      if (s.startsWith('__fn_')) {
        const eventName = s.slice(5)
        if (componentProperies.has(eventName)) {
          componentProperies.delete(s)
          componentProperies.delete(eventName)
        }
      }
    })

    Array.from(this.reserveStateWords).forEach(this.setReserveWord)
    const usedState = Array.from(
      new Set(
        Array.from(this.referencedIdentifiers)
          .map(i => i.name)
          .concat([...this.initState, ...this.usedThisState, ...componentProperies, ...this.classComputedState])
        )
    )
    .concat(...this.usedState)
    // .filter(i => {
    //   return !methods.has(i)
    // })
    .filter(i => !this.loopScopes.has(i))
    .filter(i => !this.templates.has(i))
    .filter(Boolean)

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

  checkDuplicateName () {
    this.loopScopes.forEach(s => {
      if (this.renderPath.scope.hasBinding(s)) {
        const err = codeFrameError(this.renderPath.scope.getBinding(s)!.path.node, '此变量声明与循环变量冲突，可能会造成问题。')
        // tslint:disable-next-line
        console.warn('Warning: ', err.message)
        this.loopScopes.delete(s)
      }
    })
  }

  setPendingState () {
    const propertyKeys = Array.from(
        new Set(Array.from(this.referencedIdentifiers)
        .map(i => i.name))
      )
      .filter(i => {
        const method = this.methods.get(i)
        let isGet = false
        if (method) {
          if (method.isClassMethod()) {
            const kind = method.node.kind
            if (kind === 'get') {
              isGet = true
            }
          }
        }
        return !this.methods.has(i) || isGet
      })
      .filter(i => !this.loopScopes.has(i))
      .filter(i => !this.initState.has(i))
      .filter(i => !this.templates.has(i))
      .filter(i => isVarName(i))
      .filter(i => i !== MAP_CALL_ITERATOR && !this.reserveStateWords.has(i))
      .filter(i => !i.startsWith('$$'))
      .filter(i => !this.loopRefIdentifiers.has(i))
    let properties = propertyKeys.map(i => t.objectProperty(t.identifier(i), t.identifier(i)))
    if (this.customComponentData.length > 0) {
      properties = properties.concat(this.customComponentData)
    }
    const pendingState = t.objectExpression(
      properties.concat(
        Adapter.type === Adapters.swan && transformOptions.isRoot ? t.objectProperty(
          t.identifier('_triggerObserer'),
          t.booleanLiteral(false)
        ) : []
      ).concat(
        Array.from(this.classComputedState).filter(i => {
          return !propertyKeys.includes(i)
        }).map(i => {
          return t.objectProperty(
            t.identifier(i),
            t.memberExpression(t.thisExpression(), t.identifier(i))
          )
        })
      )
    )
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

    this.usedThisProperties.forEach(prop => {
      if (this.renderScope.hasBinding(prop)) {
        const binding = this.renderScope.getBinding(prop)!
        throw codeFrameError(binding.path.node, `此变量声明与 this.${prop} 的声明冲突，请更改其中一个变量名。详情见：https://github.com/NervJS/taro/issues/822`)
      }
    })

    this.renderPath.node.body.body.unshift(
      template(`this.__state = arguments[0] || this.state || {};`)(),
      template(`this.__props = arguments[1] || this.props || {};`)(),
      template(`const __runloopRef = arguments[2];`)(),
      this.usedThisProperties.size
        ? t.variableDeclaration(
          'const',
          [
            t.variableDeclarator(
              t.objectPattern(Array.from(this.usedThisProperties).map(p => t.objectProperty(
                t.identifier(p),
                t.identifier(p)
              ) as any)),
              t.thisExpression()
            )
          ]
        )
        : t.emptyStatement()
    )

    if (t.isIdentifier(this.renderPath.node.key)) {
      this.renderPath.node.key.name = '_createData'
    }
  }
}
