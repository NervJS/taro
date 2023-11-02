import { transform as parse } from '@babel/core'
import generate from '@babel/generator'
import traverse, { NodePath, Scope, Visitor } from '@babel/traverse'
import * as t from '@babel/types'
import { cloneDeep, difference, get as safeGet, snakeCase, uniq } from 'lodash'

import { Adapter, Adapters, isNewPropsSystem } from './adapter'
import {
  ALIPAY_BUBBLE_EVENTS,
  CLASS_COMPONENT_UID,
  COMPID,
  DEFAULT_Component_SET,
  DEFAULT_Component_SET_COPY,
  FN_PREFIX,
  GEN_COMP_ID,
  HANDLE_LOOP_REF,
  INTERNAL_GET_ORIGNAL,
  IS_TARO_READY,
  LOOP_CALLEE,
  LOOP_ORIGINAL,
  LOOP_STATE,
  MAP_CALL_ITERATOR,
  PREV_COMPID,
  PROPS_MANAGER,
  THIRD_PARTY_COMPONENTS,
} from './constant'
import { isTestEnv } from './env'
import { Status } from './functional'
import { LoopRef } from './interface'
import { buildBlockElement, generateJSXAttr, parseJSXElement, setJSXAttr } from './jsx'
import { buildBabelTransformOptions, transformOptions } from './options'
import {
  buildConstVariableDeclaration,
  codeFrameError,
  createRandomLetters,
  findFirstIdentifierFromMemberExpression,
  findIdentifierFromStatement,
  findMethodName,
  findParentLoops,
  genCompid,
  generateAnonymousState,
  generateMemberExpressionArray,
  getSlotName,
  getSuperClassCode,
  hasComplexExpression,
  incrementId,
  isArrayMapCallExpression,
  isBlockIfStatement,
  isContainFunction,
  isContainJSXElement,
  isContainStopPropagation,
  isDerivedFromProps,
  isEmptyDeclarator,
  isVarName,
  newJSXIfAttr,
  noop,
  replaceJSXTextWithTextComponent,
  reverseBoolean,
  setAncestorCondition,
  setParentCondition,
  setTemplate,
  toLetters,
} from './utils'

const template = require('@babel/template')
// const template = require('babel-template')

type ClassMethodsMap = Map<string, NodePath<t.ClassMethod | t.ClassProperty>>

function findParents<T>(path: NodePath<t.Node>, predicates: (p: NodePath<t.Node>) => boolean) {
  const parents: NodePath<T>[] = []
  // tslint:disable-next-line:no-conditional-assignment
  while (path.parentPath) {
    if (path.parentPath != null) {
      path = path.parentPath as any
      if (predicates(path)) {
        parents.push(path as any)
      }
    }
  }

  return parents
}

function isClassDcl(p: NodePath<t.Node>) {
  return p.isClassExpression() || p.isClassDeclaration()
}

interface JSXHandler {
  parentNode: t.Node
  parentPath: NodePath<t.Node>
  statementParent?: NodePath<t.Node>
  isReturnStatement?: boolean
  isFinalReturn?: boolean
  isIfStemInLoop?: boolean
}

function isChildrenOfJSXAttr(p: NodePath<t.Node>) {
  return !!p.findParent((p) => p.isJSXAttribute())
}

function buildAssignState(pendingState: t.ObjectExpression) {
  return t.expressionStatement(
    t.callExpression(t.memberExpression(t.identifier('Object'), t.identifier('assign')), [
      t.memberExpression(t.thisExpression(), t.identifier('state')),
      pendingState,
    ])
  )
}

const incrementCalleeId = incrementId()
const incrementLoopArrayId = incrementId()

export class RenderParser {
  public outputTemplate: string

  private classProperties = new Set<t.ClassProperty>()
  private templates = new Map<string, t.JSXElement>()
  private jsxDeclarations = new Set<NodePath<t.Node>>()
  private loopScopes = new Set<string>()
  private returnedPaths: NodePath<t.Node>[] = []
  private usedThisState = new Set<string>()
  private loopComponents = new Map<NodePath<t.CallExpression>, NodePath<t.JSXElement>>()
  private loopComponentNames = new Map<NodePath<t.CallExpression>, string>()
  private loopRefIdentifiers = new Map<string, NodePath<t.CallExpression>>()
  private reserveStateWords = new Set(Status.isSFC ? [] : ['state', 'props'])
  private topLevelIfStatement = new Set<NodePath<t.IfStatement>>()
  private usedEvents = new Set<string>()
  private customComponentNames: Set<string>
  private loopCalleeId = new Set<t.Identifier>()
  private usedThisProperties = new Set<string>()
  private incrementCalleeId = isTestEnv ? incrementId() : incrementCalleeId
  private loopArrayId = isTestEnv ? incrementId() : incrementLoopArrayId
  private classComputedState = new Set<string>()
  private propsSettingExpressions = new Map<t.BlockStatement, (() => t.ExpressionStatement)[]>()
  private genCompidExprs = new Set<t.VariableDeclaration>()
  private loopCallees = new Set<t.Node>()
  private loopIfStemComponentMap = new Map<NodePath<t.CallExpression>, t.JSXElement>()
  private hasNoReturnLoopStem = false
  private isDefaultRender = false
  // private renderArg: t.Identifier | t.ObjectPattern | null = null
  private renderMethodName = ''
  private deferedHandleClosureJSXFunc: Function[] = []
  private ancestorConditions: Set<t.Node> = new Set()

  private renderPath: NodePath<t.ClassMethod>
  private methods: ClassMethodsMap
  private initState: Set<string>
  private referencedIdentifiers: Set<t.Identifier>
  private renderScope: Scope
  private usedState: Set<string>
  private componentProperies: Set<string>
  private loopRefs: Map<t.JSXElement, LoopRef>
  private refObjExpr: t.ObjectExpression[]
  private upperCaseComponentProps: Set<string>

  private finalReturnElement!: t.JSXElement

  handleJSXElement = (
    jsxElementPath: NodePath<t.JSXElement>,
    func: ({ parentNode, parentPath, statementParent, isReturnStatement, isFinalReturn }: JSXHandler) => void
  ) => {
    const parentNode = jsxElementPath.parent as any
    const parentPath = jsxElementPath.parentPath as any
    const isJSXChildren = t.isJSXElement(parentNode)
    if (!isJSXChildren) {
      let statementParent = jsxElementPath.getStatementParent() as any
      const isReturnStatement = statementParent?.isReturnStatement()
      const isIfStemInLoop = this.isIfStemInLoop(jsxElementPath)
      const isFinalReturn = statementParent?.getFunctionParent()?.isClassMethod()
      if (!(statementParent?.isVariableDeclaration() || statementParent?.isExpressionStatement())) {
        statementParent = statementParent?.findParent(
          (s) => s.isVariableDeclaration() || s.isExpressionStatement()
        ) as NodePath<t.Statement>
      }
      if (t.isVariableDeclarator(parentNode)) {
        if (statementParent) {
          const name = findIdentifierFromStatement(statementParent.node as t.VariableDeclaration)
          // setTemplate(name, path, templates)
          name && this.templates.set(name, jsxElementPath.node)
        }
      }
      func({ parentNode, parentPath, statementParent, isReturnStatement, isFinalReturn, isIfStemInLoop })
    }
  }

  private isIfStemInLoop = (p: NodePath<t.JSXElement>): boolean => {
    const ifStem = p.findParent((p) => p.isIfStatement())
    if (ifStem && ifStem.isIfStatement()) {
      const loopStem = ifStem.findParent((p) => p.isCallExpression())
      if (loopStem && isArrayMapCallExpression(loopStem as any)) {
        return true
      }
    }
    return false
  }

  isLiteralOrUndefined = (node: t.Node): node is t.Literal | t.Identifier =>
    t.isLiteral(node) || t.isIdentifier(node, { name: 'undefined' })

  handleConditionExpr({ parentNode, parentPath, statementParent }: JSXHandler, jsxElementPath: NodePath<t.JSXElement>) {
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
      const rval = parentPath.parentPath.parentPath.get('property') as NodePath<t.Node>
      if (!rval || !rval.node || !Array.isArray(properties)) {
        return
      }
      const children = properties
        .map((p) => p)
        .map((p, index) => {
          const block = buildBlockElement()
          const leftExpression = p.key
          const tester = t.binaryExpression('===', leftExpression as any, rval.node as any)
          block.children = [t.jSXExpressionContainer((p.node as any).value)]
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
        if (hasComplexExpression(leftExpression as any)) {
          generateAnonymousState(this.renderScope, leftExpression, this.referencedIdentifiers, true)
        }
        const block = buildBlockElement()
        newJSXIfAttr(block, leftExpression.node)
        block.children = [jsxElementPath.node]
        parentPath.replaceWith(block)
        if (statementParent) {
          const name = findIdentifierFromStatement(statementParent.node as t.VariableDeclaration)
          setTemplate(name, jsxElementPath as any, this.templates)
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
      if (hasComplexExpression(testExpression as any)) {
        generateAnonymousState(parentPath.scope, testExpression, this.referencedIdentifiers, true)
      }
      const test = testExpression.node
      if (t.isJSXElement(consequent) && this.isLiteralOrUndefined(alternate)) {
        const { value, confident } = (parentPath.get('alternate') as NodePath<t.Node>).evaluate()
        if ((confident && !value) || t.isIdentifier({ name: 'undefined' })) {
          newJSXIfAttr(block, test)
          block.children = [jsxElementPath.node]
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
          const name = findIdentifierFromStatement(statementParent.node as t.VariableDeclaration)
          setTemplate(name, jsxElementPath as any, this.templates)
          // name && templates.set(name, path.node)
        }
      } else if (this.isLiteralOrUndefined(consequent) && t.isJSXElement(alternate)) {
        const { value, confident } = (parentPath.get('consequent') as NodePath<t.Node>).evaluate()
        if ((confident && !value) || t.isIdentifier({ name: 'undefined' })) {
          newJSXIfAttr(block, reverseBoolean(test))
          block.children = [jsxElementPath.node]
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
          const name = findIdentifierFromStatement(statementParent.node as t.VariableDeclaration)
          setTemplate(name, jsxElementPath as any, this.templates)
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
          const name = findIdentifierFromStatement(statementParent.node as t.VariableDeclaration)
          setTemplate(name, jsxElementPath as any, this.templates)
        }
      } else if (
        t.isJSXElement(consequent) &&
        t.isCallExpression(alternate) &&
        !isArrayMapCallExpression(parentPath.get('alternate') as any)
      ) {
        const id = generateAnonymousState(
          this.renderScope,
          parentPath.get('alternate') as any,
          this.referencedIdentifiers,
          true
        )
        ;(parentPath.get('alternate') as NodePath<t.Node>).replaceWith(id)
        //
      } else if (
        t.isJSXElement(alternate) &&
        t.isCallExpression(consequent) &&
        !isArrayMapCallExpression(parentPath.get('consequent') as any)
      ) {
        const id = generateAnonymousState(
          this.renderScope,
          parentPath.get('consequent') as any,
          this.referencedIdentifiers,
          true
        )
        ;(parentPath.get('consequent') as NodePath<t.Node>).replaceWith(id)
      } else if (t.isJSXElement(alternate) && isArrayMapCallExpression(parentPath.get('consequent') as any)) {
        //
      } else if (t.isJSXElement(consequent) && isArrayMapCallExpression(parentPath.get('alternate') as any)) {
        //
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
          const name = findIdentifierFromStatement(statementParent.node as t.VariableDeclaration)
          setTemplate(name, jsxElementPath as any, this.templates)
        }
      }
    }
  }

  setProperies() {
    if (!this.isDefaultRender) {
      return
    }
    const properties: t.ObjectProperty[] = []
    this.componentProperies.forEach((propName) => {
      const p =
        Adapters.quickapp === Adapters.quickapp &&
        this.upperCaseComponentProps.has(propName) &&
        !propName.startsWith('prv-fn')
          ? snakeCase(propName)
          : propName
      properties.push(
        t.objectProperty(
          t.stringLiteral(p),
          t.objectExpression([
            t.objectProperty(t.stringLiteral('type'), t.nullLiteral()),
            t.objectProperty(t.stringLiteral('value'), t.nullLiteral()),
          ])
        )
      )
    })
    let classProp = t.classProperty(t.identifier('properties'), t.objectExpression(properties)) as any
    classProp.static = true
    const classPath = this.renderPath.findParent(isClassDcl as any) as NodePath<t.ClassDeclaration>
    Adapter.type !== Adapters.alipay && classPath.node.body.body.unshift(classProp)
  }

  setLoopRefFlag() {
    if (this.loopRefs.size) {
      const classPath = this.renderPath.findParent(isClassDcl as any) as NodePath<t.ClassDeclaration>
      classPath.node.body.body.unshift(t.classProperty(t.identifier('$$hasLoopRef'), t.booleanLiteral(true)))
    }
  }

  replaceIdWithTemplate =
    (handleRefId = false) =>
      (path: NodePath<t.Node>) => {
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
                  this.addRefIdentifier(path as any, path.node as any)
                // referencedIdentifiers.add(path.node)
                }
                if (this.templates.has(name)) {
                  path.replaceWith(this.templates.get(name)!)
                }
              }
            },
          })
        }
      }

  // hasStateOrProps = (key: 'state' | 'props') => (p: t.Identifier | t.AssignmentPattern | t.RestProperty) => t.isObjectProperty(p) && t.isIdentifier(p.key) && p.key.name === key
  hasStateOrProps = (key: 'state' | 'props') => (p: t.ObjectProperty | t.RestElement) =>
    t.isObjectProperty(p) && t.isIdentifier(p.key) && p.key.name === key

  private destructStateOrProps(
    key: 'state' | 'props',
    path: NodePath<t.VariableDeclarator>,
    properties: (t.ObjectProperty | t.RestElement)[],
    parentPath: NodePath<t.Node>
  ) {
    const hasStateOrProps = properties.filter(
      (p) => t.isObjectProperty(p) && t.isIdentifier(p.key) && key === p.key.name
    )
    if (hasStateOrProps.length === 0) {
      return
    }
    if (hasStateOrProps.length !== properties.length) {
      throw codeFrameError(path.node, 'state 或 props 只能单独从 this 中解构')
    }
    const declareState = template(`const ${key} = this.${key};`)()
    if (properties.length > 1) {
      const index = properties.findIndex((p) => t.isIdentifier((p as t.ObjectProperty).key, { name: key }))
      properties.splice(index, 1)
      parentPath.insertAfter(declareState)
    } else {
      parentPath.insertAfter(declareState)
      parentPath.remove()
    }
  }

  private returnedifStemJSX = new Set<Scope>()

  private loopComponentVisitor: Visitor = {
    VariableDeclarator: (path) => {
      const id = path.get('id')
      const init = path.get('init')
      const parentPath = path.parentPath
      if (id.isObjectPattern() && init.isThisExpression() && parentPath.isVariableDeclaration()) {
        const { properties } = id.node
        this.destructStateOrProps('state', path as any, properties as any, parentPath as any)
        this.destructStateOrProps('props', path as any, properties as any, parentPath as any)
      }
    },
    JSXElement: {
      enter: (jsxElementPath: NodePath<t.JSXElement>) => {
        this.handleJSXElement(jsxElementPath, (options) => {
          this.handleConditionExpr(options, jsxElementPath)
          if (this.isIfStemInLoop(jsxElementPath)) {
            this.handleJSXInIfStatement(jsxElementPath, options)
            this.removeJSXStatement()
          }
          if (options.parentPath.isReturnStatement() && this.returnedifStemJSX.has(options.parentPath.scope)) {
            const block = buildBlockElement()
            setJSXAttr(block, Adapter.else)
            block.children = [jsxElementPath.node]
            jsxElementPath.replaceWith(block)
            this.returnedifStemJSX.delete(options.parentPath.scope)
          }
        })
      },
      exit: (jsxElementPath: NodePath<t.JSXElement>) => {
        this.handleJSXElement(jsxElementPath, ({ parentNode, parentPath, statementParent, isFinalReturn }) => {
          if (statementParent && statementParent.findParent((p) => p === this.renderPath)) {
            this.jsxDeclarations.add(statementParent)
          }
          if (t.isReturnStatement(parentNode)) {
            if (!isFinalReturn) {
              const callExpr = parentPath.findParent((p) => p.isCallExpression())
              if (callExpr && callExpr.isCallExpression()) {
                const callee = callExpr.node.callee
                if (this.loopComponents.has(callExpr)) {
                  return
                }
                if (t.isMemberExpression(callee) && t.isIdentifier(callee.property) && callee.property.name === 'map') {
                  let ary = callee.object
                  if (t.isCallExpression(ary) || isContainFunction((callExpr.get('callee') as any).get('object'))) {
                    this.loopCallees.add(ary)
                    const variableName = `${LOOP_CALLEE}_${this.incrementCalleeId()}`
                    callExpr
                      .getStatementParent()
                      ?.insertBefore(
                        buildConstVariableDeclaration(
                          variableName,
                          setParentCondition(jsxElementPath as any, ary, true)
                        )
                      )
                    ary = t.identifier(variableName)
                  }
                  if (t.isMemberExpression(ary)) {
                    const id = findFirstIdentifierFromMemberExpression(ary)
                    if (t.isIdentifier(id)) {
                      this.referencedIdentifiers.add(id)
                    }
                  } else if (t.isIdentifier(ary)) {
                    const parentCallExpr = callExpr.find((p) => p.isCallExpression())
                    if (!isArrayMapCallExpression(parentCallExpr as any) && parentCallExpr !== callExpr) {
                      this.referencedIdentifiers.add(ary)
                    }
                  }
                  const block = buildBlockElement()
                  const hasIfAttr = jsxElementPath.node.openingElement.attributes.find(
                    (a) => t.isJSXAttribute(a) && t.isJSXIdentifier(a.name) && a.name.name === Adapter.if
                  )
                  const needWrapper = Adapters.swan === Adapter.type && hasIfAttr
                  if (needWrapper) {
                    block.children = [jsxElementPath.node]
                    jsxElementPath.replaceWith(block)
                  }
                  setJSXAttr(needWrapper ? block : jsxElementPath.node, Adapter.for, t.jSXExpressionContainer(ary))
                  this.loopCalleeId.add(findFirstIdentifierFromMemberExpression(callee))
                  const [func] = callExpr.node.arguments
                  if (t.isFunctionExpression(func) || t.isArrowFunctionExpression(func)) {
                    const [item, index] = func.params
                    let itemName = ''
                    let indexName = ''
                    if (t.isIdentifier(item)) {
                      if (Adapters.quickapp !== Adapter.type) {
                        setJSXAttr(
                          needWrapper ? block : jsxElementPath.node,
                          Adapter.forItem,
                          t.stringLiteral(item.name)
                        )
                      } else {
                        itemName = item.name
                      }
                      this.loopScopes.add(item.name)
                    } else if (t.isObjectPattern(item)) {
                      throw codeFrameError(item.loc, 'JSX map 循环参数暂时不支持使用 Object pattern 解构。')
                    } else {
                      setJSXAttr(needWrapper ? block : jsxElementPath.node, Adapter.forItem, t.stringLiteral('__item'))
                      func.params[0] = t.identifier('__item')
                    }
                    if (t.isIdentifier(index)) {
                      if (Adapters.quickapp !== Adapter.type) {
                        setJSXAttr(
                          needWrapper ? block : jsxElementPath.node,
                          Adapter.forIndex,
                          t.stringLiteral(index.name)
                        )
                      } else {
                        indexName = index.name
                      }
                      this.loopScopes.add(index.name)
                      // tslint:disable-next-line: strict-type-predicates
                    } else if (index === undefined) {
                      if (process.env.NODE_ENV !== 'test') {
                        const uid = this.renderScope.generateUid('anonIdx')
                        func.params[1] = t.identifier(uid)
                        setJSXAttr(
                          needWrapper ? block : jsxElementPath.node,
                          Adapter.forIndex,
                          t.stringLiteral(this.renderScope.generateUid('anonIdx'))
                        )
                      }
                    } else {
                      throw codeFrameError(index, '包含 JSX 的 map 循环第二个参数只能是一个普通标识符')
                    }
                    if (Adapters.quickapp === Adapter.type) {
                      if (itemName || indexName) {
                        const code = generateJSXAttr(ary)
                        let forExpr: string
                        if (itemName && !indexName) {
                          forExpr = `${itemName} in ${code}`
                        } else {
                          forExpr = `(${indexName}, ${itemName}) in ${code}`
                        }
                        setJSXAttr(jsxElementPath.node, Adapter.for, t.stringLiteral(`{{${forExpr}}}`))
                      }
                      // if (itemName && !indexName) {
                      //   const forExpr = gene
                      // }
                    }
                    this.loopComponents.set(callExpr as any, jsxElementPath)
                    let loopComponentName
                    const parentCallee = callExpr.findParent((c) => isArrayMapCallExpression(c as any))
                    if (isArrayMapCallExpression(parentCallee as any)) {
                      loopComponentName = `${LOOP_CALLEE}_${this.incrementCalleeId()}`
                    } else {
                      loopComponentName = 'loopArray' + this.loopArrayId()
                    }
                    this.loopComponentNames.set(callExpr as any, loopComponentName)
                    // caller.replaceWith(jsxElementPath.node)
                    if (statementParent) {
                      const name = findIdentifierFromStatement(statementParent.node as t.VariableDeclaration)
                      // setTemplate(name, path, templates)
                      name && this.templates.set(name, jsxElementPath.node)
                    }
                  }
                }
              }
            }
          } else if (t.isArrowFunctionExpression(parentNode)) {
            parentPath.replaceWith(
              t.arrowFunctionExpression(parentNode.params, t.blockStatement([t.returnStatement(jsxElementPath.node)]))
            )
          }
        })
      },
    },
  }

  private renameIfScopeVaribale = (blockStatement: NodePath<t.BlockStatement>): Visitor => {
    return {
      VariableDeclarator: (path) => {
        const { id, init } = path.node
        const ifStem = path.parentPath.parentPath?.parentPath
        if (!t.isIfStatement(ifStem) || isContainJSXElement(path as any)) {
          return
        }
        if (t.isIdentifier(id)) {
          if (id.name.startsWith('loopArray') || id.name.startsWith(LOOP_CALLEE)) {
            this.renderPath.node.body.body.unshift(
              t.variableDeclaration('let', [t.variableDeclarator(t.identifier(id.name))])
            )
            path.parentPath.replaceWith(template('ID = INIT;')({ ID: t.identifier(id.name), INIT: init }))
          } else if (id.name.startsWith('$props__')) {
            path.skip()
          } else {
            const newId = this.renderScope.generateDeclaredUidIdentifier('$' + id.name)
            blockStatement.scope.rename(id.name, newId.name)
            path.parentPath.replaceWith(template('ID = INIT;')({ ID: newId, INIT: init || t.identifier('undefined') }))
          }
        }
      },
      JSXElement: (jsxElementPath) => {
        this.handleJSXElement(jsxElementPath, (options) => {
          this.handleConditionExpr(options, jsxElementPath)
        })
      },
      JSXExpressionContainer: this.replaceIdWithTemplate(true) as any,
    }
  }

  findParallelIfStem = (p: NodePath<t.Node>) => {
    const exprs: Set<NodePath<t.IfStatement>> = new Set()
    let expr = p.parentPath
    while (t.isIfStatement(expr)) {
      exprs.add(expr as any)
      expr = expr.parentPath
    }
    return exprs
  }

  private handleJSXInIfStatement(
    jsxElementPath: NodePath<t.JSXElement>,
    { parentNode, parentPath, isFinalReturn, isIfStemInLoop }: JSXHandler
  ) {
    if (t.isReturnStatement(parentNode)) {
      if (!isFinalReturn && !isIfStemInLoop) {
      } else {
        const ifStatement = parentPath.findParent((p) => p.isIfStatement()) as any
        const blockStatement = parentPath.findParent(
          (p) => p.isBlockStatement() && p.parentPath === ifStatement
        ) as NodePath<t.BlockStatement>
        const loopCallExpr = jsxElementPath.findParent((p) =>
          isArrayMapCallExpression(p as any)
        ) as null | NodePath<t.CallExpression>
        if (loopCallExpr && loopCallExpr.findParent((p) => p.isIfStatement())) {
          throw codeFrameError(
            loopCallExpr.node,
            '在循环的上级和内部都有 if-else 的情况，需要把循环的内部 if-else return 的 JSX 设置为一个变量，保证单个 return 语句。\n 示例：https://gist.github.com/yuche/f6a0933df2537407abe0f426f774f670'
          )
        }
        if (blockStatement && blockStatement.isBlockStatement()) {
          blockStatement.traverse(this.renameIfScopeVaribale(blockStatement))
        }

        const blockAttrs: t.JSXAttribute[] = []
        if (isNewPropsSystem() && !this.finalReturnElement && process.env.NODE_ENV !== 'test') {
          if (this.isDefaultRender && Adapter.type !== Adapters.swan) {
            blockAttrs.push(
              t.jSXAttribute(
                t.jSXIdentifier(Adapter.if),
                t.jSXExpressionContainer(t.jSXIdentifier(IS_TARO_READY) as any)
              )
            )
          }
        }
        const block = this.finalReturnElement || buildBlockElement(blockAttrs)
        if (isBlockIfStatement(ifStatement, blockStatement)) {
          let { test, alternate, consequent } = ifStatement.node
          if (hasComplexExpression(ifStatement.get('test') as NodePath<t.Node>)) {
            ifStatement.node.test = test = generateAnonymousState(
              blockStatement.scope,
              ifStatement.get('test') as any,
              this.referencedIdentifiers,
              true
            )
          }
          // blockStatement.node.body.push(t.returnStatement(
          //   t.memberExpression(t.thisExpression(), t.identifier('state'))
          // ))
          if (alternate === blockStatement.node) {
            throw codeFrameError(
              parentNode.loc,
              '不必要的 else 分支，请遵从 ESLint consistent-return: https://eslint.org/docs/rules/consistent-return'
            )
          } else if (consequent === blockStatement.node) {
            const parentIfStatement = ifStatement?.findParent((p) => p.isIfStatement())
            if (parentIfStatement) {
              setJSXAttr(jsxElementPath.node, Adapter.elseif, t.jSXExpressionContainer(test), jsxElementPath)
              if (loopCallExpr && this.loopIfStemComponentMap.has(loopCallExpr)) {
                const block = this.loopIfStemComponentMap.get(loopCallExpr)!
                block.children.push(jsxElementPath.node)
              }
            } else {
              if (isIfStemInLoop && loopCallExpr && loopCallExpr.isCallExpression()) {
                if (this.loopIfStemComponentMap.has(loopCallExpr)) {
                  const component = this.loopIfStemComponentMap.get(loopCallExpr)!
                  newJSXIfAttr(jsxElementPath.node, test, jsxElementPath)
                  component.children.push(jsxElementPath.node)
                } else {
                  newJSXIfAttr(jsxElementPath.node, test, jsxElementPath)
                  this.loopIfStemComponentMap.set(loopCallExpr, block)
                  const arrowFunc = loopCallExpr.node.arguments[0]
                  if (
                    t.isArrowFunctionExpression(arrowFunc) &&
                    t.isBlockStatement(arrowFunc.body) &&
                    !arrowFunc.body.body.some((s) => t.isReturnStatement(s))
                  ) {
                    arrowFunc.body.body.push(t.returnStatement(buildBlockElement()))
                    this.hasNoReturnLoopStem = true
                  }
                }
                let scope
                try {
                  scope = (loopCallExpr.get('arguments')[0].get('body') as NodePath<t.Node>).scope
                } catch (error) {
                  //
                }
                if (scope) {
                  this.returnedifStemJSX.add(scope)
                }
              } else {
                if (this.topLevelIfStatement.size > 0) {
                  setJSXAttr(jsxElementPath.node, Adapter.elseif, t.jSXExpressionContainer(test), jsxElementPath)
                } else {
                  newJSXIfAttr(jsxElementPath.node, test, jsxElementPath)
                  this.topLevelIfStatement.add(ifStatement as any)
                }
              }
            }
          }
        } else if (block.children.length !== 0) {
          if (this.topLevelIfStatement.size > 0) {
            setJSXAttr(jsxElementPath.node, Adapter.else)
          }
        }
        block.children.push(jsxElementPath.node)
        if (!this.loopIfStemComponentMap.has(loopCallExpr as any)) {
          this.finalReturnElement = block
        }
        this.returnedPaths.push(parentPath)
      }
    } else if (t.isArrowFunctionExpression(parentNode)) {
      // console.log('arrow')
    } else if (t.isAssignmentExpression(parentNode)) {
      const ifStatement = parentPath.findParent((p) => p.isIfStatement()) as NodePath<t.IfStatement>
      const blockStatement = parentPath.findParent(
        (p) => p.isBlockStatement() && p.parentPath === ifStatement
      ) as NodePath<t.BlockStatement>
      if (blockStatement && blockStatement.isBlockStatement()) {
        blockStatement.traverse(this.renameIfScopeVaribale(blockStatement))
      }
      if (t.isIdentifier(parentNode.left)) {
        const assignmentName = parentNode.left.name
        const renderScope: Scope = isIfStemInLoop
          ? jsxElementPath
            .findParent((p) => isArrayMapCallExpression(p as any))
            ?.get('arguments')[0]
            .get('body').scope
          : this.renderScope
        const bindingNode = renderScope.getOwnBinding(assignmentName)!.path.node as any
        // tslint:disable-next-line
        const parallelIfStems = this.findParallelIfStem(ifStatement as any)
        const parentIfStatement = ifStatement?.findParent(
          (p) => p.isIfStatement() && !parallelIfStems.has(p as any)
        ) as NodePath<t.IfStatement>
        // @TODO: 重构 this.templates 为基于作用域的 HashMap，现在仍然可能会存在重复的情况
        let block = this.templates.get(assignmentName) || buildBlockElement()
        let isElse = false
        if (isEmptyDeclarator(bindingNode)) {
          const blockStatement = parentPath.findParent((p) => p.isBlockStatement())
          if (isBlockIfStatement(ifStatement, blockStatement)) {
            const { test, alternate, consequent } = ifStatement?.node
            if (alternate === blockStatement?.node) {
              const newBlock = buildBlockElement()
              setJSXAttr(newBlock, Adapter.else)
              newBlock.children = [jsxElementPath.node]
              jsxElementPath.node = newBlock
            } else if (consequent === blockStatement?.node) {
              const parentIfStatement = ifStatement?.findParent((p) => p.isIfStatement()) as NodePath<t.IfStatement>
              const assignments: t.AssignmentExpression[] = []
              let isAssignedBefore = false
              // @TODO: 重构这两种循环为通用模块

              // 如果这个 JSX assigmnent 的作用域中有其他的 if block 曾经赋值过，它应该是 else-if
              if (blockStatement && blockStatement.isBlockStatement()) {
                for (const parentStatement of blockStatement.node.body) {
                  if (t.isIfStatement(parentStatement) && t.isBlockStatement(parentStatement.consequent)) {
                    const statements = parentStatement.consequent.body
                    for (const statement of statements) {
                      if (
                        t.isExpressionStatement(statement) &&
                        t.isAssignmentExpression(statement.expression) &&
                        t.isIdentifier(statement.expression.left, { name: assignmentName })
                      ) {
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
                        if (
                          t.isExpressionStatement(statement) &&
                          t.isAssignmentExpression(statement.expression) &&
                          t.isIdentifier(statement.expression.left, { name: assignmentName })
                        ) {
                          assignments.push(statement.expression)
                        }
                      }
                    }
                  }
                }
              }
              if (
                (parentIfStatement &&
                  (parentIfStatement.get('alternate') === ifStatement ||
                    assignments.findIndex((a) => a === parentNode) > 0)) ||
                isAssignedBefore
              ) {
                setJSXAttr(jsxElementPath.node, Adapter.elseif, t.jSXExpressionContainer(test), jsxElementPath)
              } else {
                if (parentIfStatement) {
                  if (this.isEmptyBlock(block)) {
                    newJSXIfAttr(block, parentIfStatement.node.test, jsxElementPath)
                  } else if (parentIfStatement.node.alternate === ifStatement?.parent) {
                    const newBlock = buildBlockElement()
                    setJSXAttr(newBlock, Adapter.else)
                    this.insertElseBlock(block, newBlock, parentIfStatement.node.test)
                    isElse = true
                  } else {
                    const newBlock = buildBlockElement()
                    setJSXAttr(
                      newBlock,
                      Adapter.elseif,
                      t.jSXExpressionContainer(parentIfStatement.node.test),
                      jsxElementPath
                    )
                    block.children.push(newBlock)
                  }
                }
                newJSXIfAttr(jsxElementPath.node, test, jsxElementPath)
              }
            }
            const ifAttr = block.openingElement.attributes.find(
              (a) => t.isJSXAttribute(a) && t.isJSXIdentifier(a.name) && a.name.name === Adapter.if
            )
            if (ifAttr && t.isJSXAttribute(ifAttr) && t.isJSXExpressionContainer(ifAttr.value, { expression: test })) {
              const newBlock = buildBlockElement()
              newBlock.children = [block, jsxElementPath.node]
              block = newBlock
            } else if (parentIfStatement && ifStatement?.parentPath !== parentIfStatement) {
              let hasNest = false
              this.handleNestedIfStatement(
                block,
                jsxElementPath.node,
                parentIfStatement.node.test,
                hasNest,
                isElse || !!ifStatement?.findParent((p) => p.node === parentIfStatement.node.alternate)
              )
              if (!hasNest && parentIfStatement.get('alternate') !== ifStatement) {
                const ifAttr = block.openingElement.attributes.find(
                  (a) => t.isJSXAttribute(a) && t.isJSXIdentifier(a.name) && a.name.name === Adapter.if
                )
                if (
                  ifAttr &&
                  t.isJSXAttribute(ifAttr) &&
                  t.isJSXExpressionContainer(ifAttr.value, { expression: parentIfStatement.node.test })
                ) {
                  const newBlock = buildBlockElement()
                  block.children.push(jsxElementPath.node)
                  newBlock.children = [block]
                  block = newBlock
                }
              }
            } else {
              block.children.push(jsxElementPath.node)
            }
            // setTemplate(name, path, templates)
            assignmentName && this.templates.set(assignmentName, block)
            if (isIfStemInLoop) {
              this.replaceIdWithTemplate()(renderScope.path as any)
              this.returnedPaths.push(parentPath)
            }
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

  insertElseBlock = (block: t.JSXElement, jsx: t.JSXElement, test: t.Expression) => {
    if (this.isEmptyBlock(block)) {
      return
    }

    for (const child of block.children) {
      if (!t.isJSXElement(child)) {
        continue
      }
      const ifAttr = child.openingElement.attributes.find(
        (a) => t.isJSXAttribute(a) && t.isJSXIdentifier(a.name) && a.name.name === Adapter.if
      )
      const ifElseAttr = child.openingElement.attributes.find(
        (a) => t.isJSXAttribute(a) && t.isJSXIdentifier(a.name) && a.name.name === Adapter.elseif
      )
      if (
        (ifAttr && t.isJSXAttribute(ifAttr) && t.isJSXExpressionContainer(ifAttr.value, { expression: test })) ||
        (ifElseAttr &&
          t.isJSXAttribute(ifElseAttr) &&
          t.isJSXExpressionContainer(ifElseAttr.value, { expression: test }))
      ) {
        block.children.push(jsx)
        break
      } else {
        this.insertElseBlock(child, jsx, test)
      }
    }
  }

  handleNestedIfStatement = (
    block: t.JSXElement,
    jsx: t.JSXElement,
    test: t.Expression,
    hasNest: boolean,
    isElse: boolean
  ) => {
    if (this.isEmptyBlock(block)) {
      return
    }

    for (const [index, child] of block.children.entries()) {
      if (!t.isJSXElement(child)) {
        continue
      }
      const ifAttr = child.openingElement.attributes.find(
        (a) => t.isJSXAttribute(a) && t.isJSXIdentifier(a.name) && a.name.name === Adapter.if
      )
      const ifElseAttr = child.openingElement.attributes.find(
        (a) => t.isJSXAttribute(a) && t.isJSXIdentifier(a.name) && a.name.name === Adapter.elseif
      )
      if (
        (ifAttr && t.isJSXAttribute(ifAttr) && t.isJSXExpressionContainer(ifAttr.value, { expression: test })) ||
        (ifElseAttr &&
          t.isJSXAttribute(ifElseAttr) &&
          t.isJSXExpressionContainer(ifElseAttr.value, { expression: test }))
      ) {
        if (isElse) {
          const nextChild = block.children[index + 1]
          if (t.isJSXElement(nextChild)) {
            nextChild.children.push(jsx)
          }
        } else {
          child.children.push(jsx)
        }
        hasNest = true
        break
      } else {
        this.handleNestedIfStatement(child, jsx, test, hasNest, isElse)
      }
    }
  }

  isEmptyBlock = (block: t.JSXElement) => block.children.length === 0 && block.openingElement.attributes.length === 0

  private genPropsSettingExpression(
    properties: Array<t.ObjectProperty | t.SpreadProperty> | t.Identifier,
    id: t.StringLiteral | t.Identifier,
    previd: t.Identifier
  ): t.Expression {
    return t.callExpression(t.memberExpression(t.identifier(PROPS_MANAGER), t.identifier('set')), [
      Array.isArray(properties) ? t.objectExpression(properties as any) : properties,
      id,
      previd,
    ])
  }

  private getPropsFromAttrs(openingElement: t.JSXOpeningElement): Array<t.ObjectProperty | t.SpreadProperty> {
    const attrs = openingElement.attributes
    const properties: Array<t.ObjectProperty | t.SpreadProperty> = []
    openingElement.attributes = attrs.filter((attr) => {
      if (t.isJSXSpreadAttribute(attr)) {
        // @ts-ignore
        properties.push(t.spreadProperty(attr.argument))
        return false
      } else if (t.isJSXAttribute(attr)) {
        const { name, value } = attr
        if (
          t.isJSXIdentifier(name) &&
          name.name !== 'key' &&
          name.name !== 'id' &&
          !(name.name === 'extraProps' && Adapter.type === Adapters.weapp) &&
          name.name !== Adapter.for &&
          name.name !== Adapter.forItem &&
          name.name !== Adapter.forIndex &&
          name.name.indexOf('render') !== 0 &&
          !t.isJSXElement(value) &&
          !name.name.includes('-')
        ) {
          // tslint:disable-next-line: strict-type-predicates
          const v: t.StringLiteral | t.Expression | t.BooleanLiteral =
            value === null
              ? t.booleanLiteral(true)
              : ((t.isJSXExpressionContainer(value) ? value.expression : value) as
                  | t.StringLiteral
                  | t.Expression
                  | t.BooleanLiteral)
          v && properties.push(t.objectProperty(t.stringLiteral(name.name), v))
          return false
        }
        return true
      }
    })
    return properties
  }

  private prefixExpr = () => (this.isDefaultRender ? t.identifier('__prefix') : t.identifier(CLASS_COMPONENT_UID))

  private propsDecls = new Map<string, NodePath<t.VariableDeclaration>>()

  private isInternalComponent = (element: t.JSXOpeningElement) => {
    return (
      t.isJSXIdentifier(element.name) &&
      !DEFAULT_Component_SET.has(element.name.name) &&
      !DEFAULT_Component_SET_COPY.has(element.name.name) &&
      /[A-Z]/.test(element.name.name.charAt(0))
    )
  }

  private addIdToElement(jsxElementPath: NodePath<t.JSXElement>) {
    const openingElement = jsxElementPath.node.openingElement
    if (
      openingElement.attributes.find((attr) => {
        return t.isJSXAttribute(attr) && attr.name.name === 'compid'
      })
    ) {
      return
    }
    if (this.isInternalComponent(openingElement)) {
      if (this.isEmptyProps(openingElement.attributes) && Adapter.type !== Adapters.swan) {
        return
      }
      const compId = genCompid()
      const prevName = `${PREV_COMPID}__${compId}`
      const name = `${COMPID}__${compId}`
      const variableName = t.identifier(name)
      this.referencedIdentifiers.add(variableName)
      const idExpr = t.variableDeclaration('const', [
        t.variableDeclarator(
          t.arrayPattern([t.identifier(prevName), variableName]),
          t.callExpression(t.identifier(GEN_COMP_ID), [
            t.binaryExpression('+', this.prefixExpr(), t.stringLiteral(name)),
          ])
        ),
      ])

      // createData 中设置 props
      const properties = this.getPropsFromAttrs(openingElement)
      const propsId = `$props__${compId}`
      const collectedProps = buildConstVariableDeclaration(propsId, t.objectExpression(properties as any))
      const result = jsxElementPath.getStatementParent()?.insertBefore(collectedProps) as any
      this.propsDecls.set(propsId, result[0])
      const propsSettingExpr = this.genPropsSettingExpression(
        t.identifier(propsId),
        variableName,
        t.identifier(prevName)
      )
      this.genCompidExprs.add(idExpr)
      const expr = setAncestorCondition(jsxElementPath as any, propsSettingExpr)
      this.ancestorConditions.add(expr)
      const ifStatement = jsxElementPath.findParent((p) => p.isIfStatement())
      const blockStatement = jsxElementPath.findParent((p) => p.isBlockStatement()) as NodePath<t.BlockStatement>
      let blockStem = this.renderPath.node.body
      if (ifStatement && blockStatement) {
        const consequent = ifStatement.get('consequent')
        const alternate = ifStatement.get('alternate')
        if (blockStatement === consequent || blockStatement === alternate) {
          blockStem = blockStatement.node
        }
      }
      const funcs = this.propsSettingExpressions.get(blockStem)
      const func = () => t.expressionStatement(expr)
      this.propsSettingExpressions.set(blockStem, funcs ? [...funcs, func] : [func])

      // xml 中打上组件 ID
      setJSXAttr(jsxElementPath.node, 'compid', t.jSXExpressionContainer(variableName))
    }
  }

  private handleComponents(renderBody: NodePath<t.Node>) {
    renderBody.traverse({
      JSXElement: (jsxElementPath) => this.addIdToElement(jsxElementPath as any),
    })
  }

  private jsxElementVisitor: Visitor = {
    JSXElement: (jsxElementPath) => {
      this.handleJSXElement(jsxElementPath as any, (options) => {
        this.handleConditionExpr(options, jsxElementPath)
        this.handleJSXInIfStatement(jsxElementPath, options)
      })

      // handle jsx attrs
      jsxElementPath.traverse(this.jsxAttrVisitor)
    },
  }

  private jsxAttrVisitor: Visitor = {
    JSXExpressionContainer: (path) => {
      if (!isChildrenOfJSXAttr(path as any)) {
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
          const JSXElement = path.findParent((p) => p.isJSXElement())?.node as t.JSXElement
          const componentName = JSXElement.openingElement.name
          if (isNewPropsSystem() && t.isJSXIdentifier(componentName)) {
            if (THIRD_PARTY_COMPONENTS.has(componentName.name)) {
              //
            } else if (!DEFAULT_Component_SET.has(componentName.name)) {
              return
            }
          }

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
            ;(args as NodePath<t.Node>[]).forEach((arg, index) => {
              const node = arg.node
              const argName = generate(node as any).code
              if (index === 0) {
                setJSXAttr(JSXElement, `data-e-${bindEventName}-so`, t.stringLiteral(argName))
              } else {
                let expr: any = null
                if (t.isIdentifier(node) && path.scope.hasBinding(argName)) {
                  this.addRefIdentifier(path as any, node)
                  expr = t.jSXExpressionContainer(node)
                } else if (t.isMemberExpression(node)) {
                  const id = findFirstIdentifierFromMemberExpression(node)
                  this.addRefIdentifier(path as any, id)
                  expr = t.jSXExpressionContainer(node)
                } else if (
                  node.type === 'NumericLiteral' ||
                  t.isStringLiteral(node) ||
                  t.isBooleanLiteral(node) ||
                  t.isNullLiteral(node)
                ) {
                  expr = t.jSXExpressionContainer(node as any)
                } else if (hasComplexExpression(arg)) {
                  const isCookedLoop = JSXElement.openingElement.attributes.some(
                    (attr) => t.isJSXAttribute(attr) && attr.name.name === Adapter.for
                  )
                  if (isCookedLoop) {
                    throw codeFrameError(
                      arg.node,
                      '在循环中使用 bind 时，需要声明将此复杂表达式声明为一个变量再放入 bind 参数中。'
                    )
                  } else {
                    const id = generateAnonymousState(this.renderScope, arg as any, this.referencedIdentifiers)
                    expr = t.jSXExpressionContainer(id)
                  }
                } else {
                  expr = t.jSXExpressionContainer(t.identifier(argName))
                }
                setJSXAttr(JSXElement, `data-e-${bindEventName}-a-${toLetters(index)}`, expr)
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
      if (t.isJSXIdentifier(name) && jsxElementPath?.isJSXElement()) {
        const componentName = (jsxElementPath.node.openingElement as any).name.name
        const isThirdPartyKey = name.name === 'taroKey'
        if (name.name === 'key' || isThirdPartyKey) {
          if (THIRD_PARTY_COMPONENTS.has(componentName as string) && !isThirdPartyKey) {
            return
          }
          const jsx = path.findParent((p) => p.isJSXElement())
          const loopBlock = jsx?.findParent((p) => {
            if (p.isJSXElement()) {
              const element = p.get('openingElement') as NodePath<t.JSXOpeningElement>
              if (element.get('name').isJSXIdentifier({ name: 'block' })) {
                const attrs = element.node.attributes
                const hasWXForLoop = attrs.some(
                  (attr) => t.isJSXAttribute(attr) && t.isJSXIdentifier(attr.name, { name: Adapter.for })
                )
                const hasWXKey = attrs.some(
                  (attr) => t.isJSXAttribute(attr) && t.isJSXIdentifier(attr.name, { name: Adapter.key })
                )
                return hasWXForLoop && !hasWXKey
              }
            }
            return false
          }) as NodePath<t.JSXElement>
          if (loopBlock) {
            setJSXAttr(
              loopBlock.node,
              Adapter.key,
              (value as t.StringLiteral | t.JSXExpressionContainer | t.JSXElement)!
            )
            path.remove()
          } else {
            path.get('name').replaceWith(t.jSXIdentifier(Adapter.key))
          }
        } else if (name.name.startsWith('on')) {
          if (t.isJSXExpressionContainer(value)) {
            const methodName = findMethodName(value.expression as any)
            methodName && this.usedEvents.add(methodName)
            const method = this.methods.get(methodName)
            const classDecl = path.findParent((p) => p.isClassDeclaration())
            const componentName = jsxElementPath.node.openingElement.name
            // if (method && t.isIdentifier(method.node.key)) {
            //   this.usedEvents.add(methodName)
            // } else if (method === null) {
            //   this.usedEvents.add(methodName)
            // }
            if (
              !generate(value.expression as any).code.includes('.bind') &&
              (!isNewPropsSystem() ||
                (t.isJSXIdentifier(componentName) && DEFAULT_Component_SET.has(componentName.name)))
            ) {
              path.node.value = t.stringLiteral(`${methodName}`)
            }
            if (this.methods.has(methodName)) {
              eventShouldBeCatched = isContainStopPropagation(method as any)
            }
            if (classDecl && classDecl.isClassDeclaration()) {
              const superClass = getSuperClassCode(classDecl as any)
              if (superClass) {
                try {
                  const ast = parse(superClass.code, buildBabelTransformOptions())?.ast as t.File
                  traverse(ast, {
                    ClassMethod(p) {
                      if (!p.get('key').isIdentifier({ name: methodName })) {
                        return
                      }
                      eventShouldBeCatched = isContainStopPropagation(method as any)
                    },
                    ClassProperty(p) {
                      if (!p.get('key').isIdentifier({ name: methodName })) {
                        return
                      }
                      eventShouldBeCatched = isContainStopPropagation(method as any)
                    },
                  })
                } catch (error) {
                  //
                }
              }
            }
            if (t.isJSXIdentifier(componentName) && !DEFAULT_Component_SET.has(componentName.name)) {
              const element = path.parent as t.JSXOpeningElement
              if (process.env.NODE_ENV !== 'test' && Adapter.type !== Adapters.alipay) {
                const fnName = `${FN_PREFIX}${name.name}`
                element.attributes = element.attributes.concat([t.jSXAttribute(t.jSXIdentifier(fnName))])
              }
            }
          }
          if (t.isJSXIdentifier(jsxElementPath.node.openingElement.name)) {
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
            } else if (Adapter.type === Adapters.quickapp) {
              const transformName = name.name
              path.node.name = t.jSXIdentifier(transformName)
            } else if (DEFAULT_Component_SET.has(componentName)) {
              let transformName = `${eventShouldBeCatched ? 'catch' : 'bind'}` + name.name.slice(2).toLowerCase()
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
          const view = t.jSXElement(
            t.jSXOpeningElement(t.jSXIdentifier('View'), []),
            t.jSXClosingElement(t.jSXIdentifier('View')),
            []
          )
          view.children.push(slot)
          setJSXAttr(view, 'slot', t.stringLiteral(slotName))
          jsxElementPath.node.children.push(view)
          path.remove()
        }
      }
    },
    Identifier: (path) => {
      if (!isChildrenOfJSXAttr(path as any)) {
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
        this.addRefIdentifier(path as any, path.node as any)
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
        const reserves = new Set(['state', 'props', ...this.methods.keys()])
        if (t.isIdentifier(property) || t.isMemberExpression(property)) {
          const id = t.isIdentifier(property) ? property : findFirstIdentifierFromMemberExpression(property)
          if (reserves.has(id.name)) {
            return
          }
          const jsxAttr = path.findParent((p) => p.isJSXAttribute()) as NodePath<t.JSXAttribute>
          if (jsxAttr && t.isJSXIdentifier(jsxAttr.node.name) && jsxAttr.node.name.name.startsWith('on')) {
            return
          }
          if (t.isIdentifier(id) && !(id.name.startsWith('_create') && id.name.endsWith('Data'))) {
            this.referencedIdentifiers.add(id)
            this.usedThisProperties.add(id.name)
          }
        }
      },
      enter: (path) => {
        if (!isChildrenOfJSXAttr(path as any)) {
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
        const code = generate(path.node as any).code
        if (code.includes('this.$router.params') && t.isIdentifier(property)) {
          const name = this.renderScope.generateUid(property.name)
          const dcl = buildConstVariableDeclaration(name, path.node as any)
          this.renderPath.node.body.body.unshift(dcl)
          path.replaceWith(t.identifier(name))
        }
        const parentPath = path.parentPath
        const id = findFirstIdentifierFromMemberExpression(path.node as any)
        if (t.isThisExpression(id)) {
          return
        }
        if (
          parentPath.isConditionalExpression() ||
          parentPath.isLogicalExpression() ||
          parentPath.isJSXExpressionContainer() ||
          parentPath.isBinaryExpression() ||
          this.renderScope.hasOwnBinding(id.name)
        ) {
          this.addRefIdentifier(path as any, id)
        }
      },
    },
    ArrowFunctionExpression: (path) => {
      if (!isChildrenOfJSXAttr(path as any)) {
        return
      }
      const uid = path.scope.generateUid('_anonymous_function_')
      const c = t.classProperty(t.identifier(uid), path.node as any)
      this.classProperties.add(c)
    },
  }

  private visitors: Visitor = {
    MemberExpression: (path) => {
      const { object, property } = path.node
      if (t.isThisExpression(object) && t.isIdentifier(property) && property.name.startsWith('renderClosure')) {
        const parentPath = path.parentPath
        if (parentPath.isVariableDeclarator()) {
          const id = parentPath.node.id
          if (t.isIdentifier(id) && id.name.startsWith('renderClosure')) {
            this.deferedHandleClosureJSXFunc.push(() => {
              const classMethod = this.methods.get(id.name)
              if (classMethod && classMethod.isClassMethod()) {
                path.replaceWith(
                  t.arrowFunctionExpression(
                    [t.identifier(CLASS_COMPONENT_UID)],
                    t.blockStatement([
                      t.returnStatement(
                        t.arrowFunctionExpression(classMethod.node.params as any, classMethod.node.body)
                      ),
                    ])
                  )
                )
                // classMethod.node.body.body = []
              }
            })
          }
        }
      }

      if (t.isThisExpression(object) && t.isIdentifier(property) && /^render[A-Z]/.test(this.renderMethodName)) {
        const s = new Set(['state', 'props'])
        if (s.has(property.name) && path.parentPath.isMemberExpression()) {
          const p = path.parentPath.node.property
          let id = { name: 'example' }
          if (t.isIdentifier(p)) {
            id = p
          } else if (t.isMemberExpression(p)) {
            id = findFirstIdentifierFromMemberExpression(p)
          }
          // tslint:disable-next-line: no-console
          console.warn(
            codeFrameError(
              path.parentPath.node,
              `\n 在形如以 render 开头的 ${this.renderMethodName}() 类函数中，请先把 this.${property.name} 解构出来才进行使用。\n 例如： const { ${id.name} } = this.${property.name}`
            ).message
          )
        }
      }
    },
    VariableDeclarator: (path) => {
      const init = path.get('init')
      const id = path.get('id')
      const ifStem = init.findParent((p) => p.isIfStatement())
      // tslint:disable-next-line: strict-type-predicates
      if (ifStem && init.node === null) {
        init.replaceWith(t.identifier('undefined'))
      }
      let isDerivedFromState = false
      if (init.isMemberExpression()) {
        const object = init.get('object')
        if (
          t.isMemberExpression(object) &&
          t.isThisExpression(object.object) &&
          t.isIdentifier(object.property, { name: 'state' })
        ) {
          isDerivedFromState = true
        }
        if (t.isThisExpression(object) && t.isIdentifier(init.get('property'), { name: 'state' })) {
          isDerivedFromState = true
        }
      }
      if (!isDerivedFromState) {
        const errMsg =
          'Warning: render 函数定义一个不从 this.state 解构或赋值而来的变量，此变量又与 this.state 下的变量重名可能会导致无法渲染。'
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
              // @ts-ignore
              if (this.initState.has(p.name)) {
                // tslint:disable-next-line
                console.log(codeFrameError(id.node, errMsg).message)
              }
            }
            // @ts-ignore
            if (t.isSpreadProperty(p) && t.isIdentifier(p.argument)) {
              // @ts-ignore
              if (this.initState.has(p.argument.name)) {
                // tslint:disable-next-line
                console.log(codeFrameError(id.node, errMsg).message)
              }
            }
          }
        }
      }
    },
    JSXEmptyExpression(path) {
      const parent = path.parentPath
      if (path.parentPath.isJSXExpressionContainer()) {
        parent.remove()
      }
    },
    NullLiteral(path) {
      const statementParent = path.getStatementParent()
      const callExprs = findParents<t.CallExpression>(path as any, (p) => p.isCallExpression())
      if (
        callExprs.some(
          (callExpr) => callExpr && t.isIdentifier(callExpr.node.callee) && /^use[A-Z]/.test(callExpr.node.callee.name)
        )
      ) {
        return
      }
      if (
        statementParent &&
        statementParent.isReturnStatement() &&
        !t.isBinaryExpression(path.parent) &&
        !isChildrenOfJSXAttr(path as any)
      ) {
        path.replaceWith(t.jSXElement(t.jSXOpeningElement(t.jSXIdentifier('View'), []), undefined, [], true))
      }
    },
    ReturnStatement: (path) => {
      const parentPath = path.parentPath
      if (
        parentPath.parentPath?.isClassMethod() ||
        (parentPath.parentPath?.isIfStatement() && parentPath.parentPath.parentPath.isClassMethod())
      ) {
        this.replaceIdWithTemplate()(path as any)
      }
    },

    ...this.jsxElementVisitor,
    JSXExpressionContainer: this.replaceIdWithTemplate(true) as any,
  }

  handleQuickappProps() {
    if (Adapter.type !== Adapters.quickapp) {
      return
    }

    this.renderPath.traverse({
      Identifier: (path) => {
        if (!this.upperCaseComponentProps.has(path.node.name)) {
          return
        }

        if (isDerivedFromProps(this.renderScope, path.node.name)) {
          this.renderScope.rename(path.node.name, snakeCase(path.node.name))
          path.replaceWith(t.identifier(snakeCase(path.node.name)))
        }

        const sibling = path.getSibling('object')
        if (
          sibling &&
          sibling.isMemberExpression() &&
          t.isThisExpression(sibling.get('object')) &&
          t.isIdentifier(sibling.get('property'), { name: 'props' })
        ) {
          path.replaceWith(t.identifier(snakeCase(path.node.name)))
        }
      },
    })
  }

  /**
   *
   * @param renderPath
   * @param referencedIdentifiers
   * 这三个属性是需要单独传入的
   */
  constructor(
    renderPath: NodePath<t.ClassMethod>,
    methods: ClassMethodsMap,
    initState: Set<string>,
    referencedIdentifiers: Set<t.Identifier>,
    usedState: Set<string>,
    customComponentNames: Set<string>,
    componentProperies: Set<string>,
    loopRefs: Map<t.JSXElement, LoopRef>,
    refObjExpr: t.ObjectExpression[],
    methodName: string
  ) {
    this.renderPath = renderPath
    this.methods = methods
    this.initState = initState
    this.referencedIdentifiers = referencedIdentifiers
    this.usedState = usedState
    this.customComponentNames = customComponentNames
    this.componentProperies = componentProperies
    this.loopRefs = loopRefs
    this.refObjExpr = refObjExpr
    const renderBody = renderPath.get('body')
    this.renderScope = renderBody.scope
    this.isDefaultRender = methodName === 'render'
    this.upperCaseComponentProps = new Set(
      Array.from(this.componentProperies).filter((p) => /[A-Z]/.test(p) && !p.startsWith('on'))
    )

    const [, error] = renderPath.node.body.body.filter((s) => t.isReturnStatement(s))
    if (error) {
      throw codeFrameError(error.loc, 'render 函数顶级作用域暂时只支持一个 return')
    }

    if (t.isIdentifier(this.renderPath.node.key)) {
      this.renderMethodName = this.renderPath.node.key.name
    } else {
      throw codeFrameError(this.renderPath.node, '类函数对象必须指明函数名')
    }

    this.handleQuickappProps()

    renderBody.traverse(this.loopComponentVisitor)
    if (this.hasNoReturnLoopStem) {
      renderBody.traverse({
        JSXElement: (this.loopComponentVisitor.JSXElement as any).exit[0],
      })
    }
    this.handleLoopComponents()
    if (isNewPropsSystem()) {
      this.handleComponents(renderBody as any)
    }
    renderBody.traverse(this.visitors)
    if (Adapter.type === Adapters.quickapp) {
      renderBody.traverse(this.quickappVistor)
    }

    if (t.isIdentifier(this.renderPath.node.key)) {
      this.renderPath.node.key.name = this.getCreateJSXMethodName(this.renderMethodName)
    }

    this.setOutputTemplate()
    this.checkDuplicateName()
    this.removeJSXStatement()
    this.setUsedState()
    this.setPendingState()
    this.setCustomEvent()
    this.createData()
    if (Adapter.type === Adapters.quickapp) {
      this.setProperies()
    }
    this.setLoopRefFlag()
    this.handleClosureComp()
  }

  private handleClosureComp() {
    this.deferedHandleClosureJSXFunc.forEach((func) => func())
  }

  private quickappVistor: Visitor = {
    JSXExpressionContainer(path) {
      if (path.parentPath.isJSXAttribute() || isContainJSXElement(path as any)) {
        return
      }
      replaceJSXTextWithTextComponent(path as any)
    },
  }

  checkDuplicateData() {
    this.initState.forEach((stateName) => {
      if (this.templates.has(stateName)) {
        throw codeFrameError(
          this.templates.get(stateName)!,
          `自定义变量组件名: \`${stateName}\` 和已有 this.state.${stateName} 重复。请使用另一个变量名。`
        )
      }
    })

    this.componentProperies.forEach((componentName) => {
      if (this.componentProperies.has(componentName)) {
        throw codeFrameError(
          this.renderPath.node,
          `state: \`${componentName}\` 和已有 this.props.${componentName} 重复。请使用另一个变量名。`
        )
      }
      if (this.templates.has(componentName)) {
        throw codeFrameError(
          this.templates.get(componentName)!,
          `自定义变量组件名: \`${componentName}\` 和已有 this.props.${componentName} 重复。请使用另一个变量名。`
        )
      }
    })
  }

  addRefIdentifier(path: NodePath<t.Node>, id: t.Identifier) {
    const arrayMap = path.findParent((p) => isArrayMapCallExpression(p as any))
    if (arrayMap && arrayMap.isCallExpression()) {
      this.loopRefIdentifiers.set(id.name, arrayMap)
    } else {
      id && this.referencedIdentifiers.add(id)
    }
  }

  isEmptyProps = (attrs: (t.JSXAttribute | t.JSXSpreadAttribute)[]) =>
    attrs.filter((a) => {
      if (t.isJSXSpreadAttribute(a)) return true
      const list = [Adapter.for, Adapter.forIndex, Adapter.forItem, 'id']
      Adapter.type === Adapters.weapp && list.push('extraProps')
      return !list.includes(a.name.name as string)
    }).length === 0

  findParentIndices(callee: NodePath<t.CallExpression>, indexId: t.Identifier) {
    const loopIndices: string[] = []
    const loops = t.arrayExpression([])
    findParentLoops(callee, this.loopComponentNames, loops)
    for (const el of loops.elements) {
      if (t.isObjectExpression(el)) {
        for (const prop of el.properties) {
          if (t.isObjectProperty(prop) && t.isIdentifier(prop.key, { name: 'indexId' }) && t.isIdentifier(prop.value)) {
            loopIndices.push(prop.value.name)
          }
        }
      }
    }

    if (loopIndices.length === 0) {
      if (t.isIdentifier(indexId!)) {
        loopIndices.push(indexId!.name)
      } else {
        throw codeFrameError(callee.node, '循环中使用自定义组件需要暴露循环的 index')
      }
    }

    return loopIndices
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
    const replaceQueue: Function[] = []
    let hasLoopRef = false
    this.loopComponents.forEach((component, callee) => {
      if (!callee.isCallExpression()) {
        return
      }
      if (this.loopIfStemComponentMap.has(callee)) {
        const block = this.loopIfStemComponentMap.get(callee)!
        const attrs = component.node.openingElement.attributes
        const wxForDirectives = new Set([Adapter.for, Adapter.forIndex, Adapter.forItem])
        const ifAttrs = attrs.filter((a) => t.isJSXAttribute(a) && wxForDirectives.has(a.name.name as string))
        if (ifAttrs.length) {
          block.openingElement.attributes.push(...ifAttrs)
          component.node.openingElement.attributes = attrs.filter(
            (a) => t.isJSXAttribute(a) && !wxForDirectives.has(a.name.name as string)
          )
        }
        setJSXAttr(component.node, Adapter.else)
        block.children.push(component.node)
        component.replaceWith(block)
      }
      for (const dcl of this.jsxDeclarations) {
        const isChildren = dcl && dcl.findParent((d) => d === callee)
        if (isChildren) {
          this.jsxDeclarations.delete(dcl)
          dcl.remove()
        }
      }
      const blockStatementPath = component.findParent((p) => p.isBlockStatement()) as NodePath<t.BlockStatement>
      const body = blockStatementPath.node.body
      let loopRefComponent: t.JSXElement | null = null
      this.loopRefs.forEach((ref, jsx) => {
        if (ref.component.findParent((p) => p === component)) {
          loopRefComponent = jsx
        }
      })
      const [func] = callee.node.arguments
      let indexId: t.Identifier | null = null
      let itemId: t.Identifier | null = null
      if (t.isFunctionExpression(func) || t.isArrowFunctionExpression(func)) {
        const params = func.params as t.Identifier[]
        if (Array.isArray(params)) {
          indexId = params[1]
          itemId = params[0]
        }
      }
      if (this.loopRefs.has(component.node) || loopRefComponent!) {
        hasLoopRef = true
        const ref = this.loopRefs.get(component.node)! || this.loopRefs.get(loopRefComponent!)
        if (indexId === null || !t.isIdentifier(indexId)) {
          throw codeFrameError(component.node, '在循环中使用 ref 必须暴露循环的第二个参数 `index`')
        }
        const id = typeof ref.id === 'string' ? t.binaryExpression('+', t.stringLiteral(ref.id), indexId) : ref.id
        const args: any[] = [t.identifier('__scope'), t.binaryExpression('+', t.stringLiteral('#'), id)]
        if (ref.type === 'component') {
          args.push(t.stringLiteral('component'))
        } else {
          args.push(t.stringLiteral('dom'))
        }
        args.push(ref.fn)
        const callHandleLoopRef = t.callExpression(t.identifier(HANDLE_LOOP_REF), args)

        const loopRefStatement = t.expressionStatement(
          t.logicalExpression(
            '&&',
            t.logicalExpression('&&', t.identifier('__scope'), t.identifier('__isRunloopRef')),
            callHandleLoopRef
          )
        )

        body.splice(body.length - 1, 0, !isTestEnv ? loopRefStatement : t.expressionStatement(callHandleLoopRef))
      }

      if (isNewPropsSystem()) {
        const loopIndices: string[] = this.findParentIndices(callee, indexId!)
        const deferCallBack: Function[] = []

        blockStatementPath.traverse({
          CallExpression(path) {
            const pathCallee = path.node.callee
            if (
              t.isMemberExpression(pathCallee) &&
              t.isThisExpression(pathCallee.object) &&
              t.isIdentifier(pathCallee.property) &&
              pathCallee.property.name.startsWith('_create') &&
              pathCallee.property.name.endsWith('Data')
            ) {
              const arg = path.node.arguments[0]
              if (t.isBinaryExpression(arg)) {
                deferCallBack.push(() => {
                  path.node.arguments = [
                    t.binaryExpression(
                      '+',
                      arg,
                      t.templateLiteral(
                        [t.templateElement({ raw: '' }), ...loopIndices.map(() => t.templateElement({ raw: '' }))],
                        loopIndices.map((l) => t.identifier(l))
                      )
                    ),
                  ]
                })
              }
            }
          },
          JSXElement: (path) => {
            const element = path.node.openingElement
            if (this.isInternalComponent(element)) {
              if (this.isEmptyProps(element.attributes) && Adapter.type !== Adapters.swan) {
                return
              }

              // createData 函数里加入 compid 相关逻辑
              const compid = genCompid()
              const prevVariableName = `${PREV_COMPID}__${compid}`
              const variableName = `${COMPID}__${compid}`
              const tpmlExprs: t.Expression[] = []
              for (let index = 0; index < loopIndices.length; index++) {
                const element = loopIndices[index]
                tpmlExprs.push(t.identifier(element))
                if (loopIndices[index + 1]) {
                  tpmlExprs.push(t.stringLiteral('-'))
                }
              }
              const compidTempDecl = t.variableDeclaration('const', [
                t.variableDeclarator(
                  t.arrayPattern([t.identifier(prevVariableName), t.identifier(variableName)]),
                  t.callExpression(t.identifier(GEN_COMP_ID), [
                    t.templateLiteral(
                      [
                        t.templateElement({ raw: '' }),
                        t.templateElement({ raw: createRandomLetters(10) }),
                        ...tpmlExprs.map(() => t.templateElement({ raw: '' })),
                      ],
                      [this.prefixExpr(), ...tpmlExprs]
                    ),
                    t.booleanLiteral(true),
                  ])
                ),
              ])

              const properties = this.getPropsFromAttrs(element)
              const propsSettingExpr = this.genPropsSettingExpression(
                properties,
                t.identifier(variableName),
                t.identifier(prevVariableName)
              )
              const expr = setAncestorCondition(path as any, propsSettingExpr)
              this.ancestorConditions.add(expr)

              body.splice(body.length - 1, 0, compidTempDecl, t.expressionStatement(expr))

              // wxml 组件打上 compid
              const [func] = callee.node.arguments
              let forItem: t.Identifier | null = null
              if (t.isFunctionExpression(func) || t.isArrowFunctionExpression(func)) {
                forItem = func.params[0] as t.Identifier
              }
              if (forItem === null || !t.isIdentifier(forItem)) {
                throw codeFrameError(callee.node, '在循环中使用自定义组件时必须暴露循环的第一个参数 `item`')
              }
              element.attributes.push(
                t.jSXAttribute(
                  t.jSXIdentifier('compid'),
                  t.jSXExpressionContainer(t.memberExpression(forItem, t.identifier(variableName)))
                )
              )
            }
          },
        })

        deferCallBack.forEach((cb) => cb())
      }

      let stateToBeAssign = new Set<string>(
        difference(
          Object.keys(blockStatementPath.scope.getAllBindings()),
          Object.keys(this.renderScope.getAllBindings())
        )
          .filter((i) => {
            return !this.methods.has(i)
          })
          .filter((i) => !this.loopScopes.has(i))
          .filter((i) => !this.initState.has(i))
          .filter((i) => !this.templates.has(i))
          .filter((i) => !i.includes('.'))
          .filter((i) => i !== MAP_CALL_ITERATOR)
      )
      if (body.length > 1) {
        const [func] = callee.node.arguments
        if (t.isFunctionExpression(func) || t.isArrowFunctionExpression(func)) {
          const [item, indexParam] = func.params as t.Identifier[]
          const parents = findParents(callee as any, (p) => isArrayMapCallExpression(p))
          const iterators = new Set<string>([
            item.name,
            ...parents.map((p) => safeGet(p, 'node.arguments[0].params[0].name', '')).filter(Boolean),
          ])
          for (const [index, statement] of body.entries()) {
            if (t.isVariableDeclaration(statement)) {
              for (const dcl of statement.declarations) {
                if (t.isIdentifier(dcl.id)) {
                  const name = dcl.id.name
                  if (
                    name.startsWith(LOOP_STATE) ||
                    name.startsWith(LOOP_CALLEE) ||
                    name.startsWith(COMPID) ||
                    name.startsWith('_$indexKey')
                  ) {
                    stateToBeAssign.add(name)
                    dcl.id = t.identifier(name)
                  }
                } else if (t.isArrayPattern(dcl.id)) {
                  dcl.id.elements.forEach((stm) => {
                    if (t.isIdentifier(stm)) {
                      const name = stm.name
                      if (
                        name.startsWith(LOOP_STATE) ||
                        name.startsWith(LOOP_CALLEE) ||
                        name.startsWith(COMPID) ||
                        name.startsWith('_$indexKey')
                      ) {
                        stateToBeAssign.add(name)
                      }
                    }
                  })
                }
              }
            }
            if (t.isReturnStatement(statement)) {
              body.splice(index, 1)
            }
          }
          stateToBeAssign.forEach((s) => this.loopRefIdentifiers.set(s, callee))
          const properties = Array.from(stateToBeAssign).map((state) =>
            t.objectProperty(t.identifier(state), t.identifier(state))
          )
          // tslint:disable-next-line:no-inner-declarations
          function replaceOriginal(path, parent, name) {
            if (
              (path.isReferencedIdentifier() || t.isAssignmentExpression(parent)) &&
              iterators.has(name) &&
              !(t.isMemberExpression(parent) && t.isIdentifier(parent.property, { name: LOOP_ORIGINAL })) &&
              !(
                t.isMemberExpression(parent) &&
                t.isIdentifier(parent.property) &&
                (parent.property.name.startsWith(LOOP_STATE) ||
                  parent.property.name.startsWith(LOOP_CALLEE) ||
                  parent.property.name.startsWith(COMPID))
              )
            ) {
              path.replaceWith(t.memberExpression(t.identifier(name), t.identifier(LOOP_ORIGINAL)))
            }
          }
          const bodyPath = (callee.get('arguments') as any)[0].get('body')
          bodyPath.traverse({
            Identifier(path) {
              const name = path.node.name
              const parent = path.parent
              replaceOriginal(path, parent, name)
            },
          })
          const replacements = new Set()
          component.traverse({
            JSXAttribute: !t.isIdentifier(indexParam)
              ? noop
              : (path: NodePath<t.JSXAttribute>) => {
                const { value } = path.node
                if (
                  t.isJSXExpressionContainer(value) &&
                    t.isJSXIdentifier(path.node.name, { name: 'key' }) &&
                    t.isIdentifier(value.expression, { name: indexParam.name })
                ) {
                  if (process.env.TERM_PROGRAM || isTestEnv) {
                    // 无法找到 cli 名称的工具（例如 idea/webstorm）显示这个报错可能会乱码
                    // tslint:disable-next-line:no-console
                    console.log(
                      codeFrameError(
                        value.expression,
                        '建议修改：使用循环的 index 变量作为 key 是一种反优化。参考：https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-array-index-key.md'
                      ).message
                    )
                  }
                }
              },
            JSXExpressionContainer: this.replaceIdWithTemplate() as any,
            Identifier: (path) => {
              const name = path.node.name
              const parent = path.parent
              const parentCallExpr = path.findParent((p) => p.isCallExpression())
              if (
                replacements.has(parent) ||
                (this.renderScope.hasOwnBinding(name) &&
                  (this.loopCalleeId.has(path.node as any) ||
                    (parentCallExpr && this.loopCalleeId.has(parentCallExpr.node as any))))
              ) {
                return
              }

              if (stateToBeAssign.has(name) && path.isReferencedIdentifier()) {
                if (t.isMemberExpression(parent) && t.isIdentifier(parent.property, { name: 'map' })) {
                  const grandParentPath = path.parentPath.parentPath
                  if (grandParentPath?.isCallExpression() && this.loopComponents.has(grandParentPath)) {
                    return
                  }
                }
                if (path.findParent((p) => this.loopCallees.has(p.node as any))) {
                  return
                }
                const parentCondition = path.findParent((p) => p.isConditionalExpression() || p.isLogicalExpression())
                if (parentCondition) {
                  const varDecl = parentCondition.findParent((p) => p.isVariableDeclarator())
                  if (varDecl && varDecl.isVariableDeclarator()) {
                    const init = varDecl.node.id
                    if (t.isIdentifier(init) && init.name.startsWith(LOOP_STATE)) {
                      return
                    }
                  }
                  if (path.findParent((p) => this.ancestorConditions.has(p.node as any))) {
                    return
                  }
                }
                const replacement = t.memberExpression(t.identifier(item.name), path.node)
                path.replaceWith(replacement)
                replacements.add(replacement)
              } else {
                replaceOriginal(path, parent, name)
              }
            },
            MemberExpression(path) {
              const { object, property } = path.node
              if (t.isThisExpression(object) && t.isIdentifier(property)) {
                if (
                  property.name === 'state' &&
                  path.parentPath.isMemberExpression() &&
                  path.parentPath.parentPath.isMemberExpression()
                ) {
                  // tslint:disable-next-line
                  console.warn(
                    codeFrameError(
                      path.parentPath.parentPath.node,
                      `在循环中使用 this.state.xx.xx 可能会存在问题，请给 xx 起一个别名，例如 const { xx } = this.state`
                    )
                  )
                }
              }
            },
          })
          const originalProp = t.objectProperty(
            t.identifier(LOOP_ORIGINAL),
            t.memberExpression(t.identifier(item.name), t.identifier(LOOP_ORIGINAL))
          )
          properties.push(originalProp)
          body.unshift(
            t.expressionStatement(
              t.assignmentExpression(
                '=',
                t.identifier(item.name),
                t.objectExpression([
                  t.objectProperty(
                    t.identifier(LOOP_ORIGINAL),
                    t.callExpression(t.identifier(INTERNAL_GET_ORIGNAL), [t.identifier(item.name)])
                  ),
                ])
              )
            )
          )
          const returnStatement = t.returnStatement(properties.length ? t.objectExpression(properties) : item)
          const parentCallee = callee.findParent((c) => isArrayMapCallExpression(c as any))
          if (isArrayMapCallExpression(parentCallee as NodePath<t.Node>)) {
            const [func] = (parentCallee?.node as t.CallExpression).arguments
            const { object } = callee.node.callee as t.MemberExpression
            if (t.isFunctionExpression(func) || t.isArrowFunctionExpression(func)) {
              const funcBody = func.body
              if (t.isBlockStatement(funcBody)) {
                if (t.isIdentifier(object) || t.isMemberExpression(object)) {
                  const variableName = this.loopComponentNames.get(callee) as string
                  funcBody.body.splice(
                    funcBody.body.length - 1,
                    0,
                    buildConstVariableDeclaration(variableName, setParentCondition(component as any, callee.node, true))
                  )
                  const iterator = func.params[0]
                  component.node.openingElement.attributes.forEach((attr) => {
                    if (t.isJSXAttribute(attr) && attr.name.name === Adapter.for && t.isIdentifier(iterator)) {
                      attr.value = t.jSXExpressionContainer(t.memberExpression(iterator, t.identifier(variableName)))
                    }
                  })
                } else {
                  throw codeFrameError(
                    object.loc,
                    '多层循环中循环的数组只能是一个变量或成员表达式，可以尝试把该表达式赋值给循环内部的一个新变量。'
                  )
                }
              }
            }
            body.push(returnStatement)
          } else {
            body.push(returnStatement)
            const stateName = this.loopComponentNames.get(callee) as string
            // setJSXAttr(returned, Adapter.for, t.identifier(stateName))
            this.addRefIdentifier(callee as any, t.identifier(stateName))
            // this.referencedIdentifiers.add(t.identifier(stateName))
            if (Adapters.quickapp === Adapter.type) {
              let itemName = itemId!.name
              let indexName = indexId!.name
              if (itemName || indexName) {
                let forExpr: string
                if (itemName && !indexName) {
                  forExpr = `${itemName} in ${stateName}`
                } else {
                  forExpr = `(${indexName}, ${itemName}) in ${stateName}`
                }
                setJSXAttr(component.node, Adapter.for, t.stringLiteral(`{{${forExpr}}}`))
              }
            } else if (Adapters.swan === Adapter.type) {
              const attributes = component.node.openingElement.attributes
              const keyAttribute: t.JSXAttribute | undefined = attributes.find(
                (a) => t.isJSXAttribute(a) && t.isJSXIdentifier(a.name, { name: 'key' })
              ) as t.JSXAttribute | undefined
              if (keyAttribute && t.isJSXExpressionContainer(keyAttribute.value)) {
                let itemName = itemId!.name
                const expressionArray = generateMemberExpressionArray(
                  keyAttribute.value.expression as t.MemberExpression
                )
                expressionArray[0] = itemName // 将key属性的值MemberExpression的首位（对象）替换成forItem
                const memberExpressionString = expressionArray.join('.')
                const forExpr = `${stateName} trackBy ${memberExpressionString}`
                setJSXAttr(component.node, Adapter.for, t.stringLiteral(forExpr))
              } else {
                setJSXAttr(component.node, Adapter.for, t.jSXExpressionContainer(t.identifier(stateName)))
              }
            } else {
              setJSXAttr(component.node, Adapter.for, t.jSXExpressionContainer(t.identifier(stateName)))
            }
            const returnBody = this.renderPath.node.body.body
            const ifStem = callee.findParent((p) => p.isIfStatement())
            // @TEST
            if (ifStem && ifStem.isIfStatement()) {
              const consequent = ifStem.get('consequent')
              if (t.isBlockStatement(consequent)) {
                const assignment = t.expressionStatement(
                  t.assignmentExpression(
                    '=',
                    t.identifier(stateName),
                    setParentCondition(component as any, callee.node, true)
                  )
                )
                returnBody.unshift(t.variableDeclaration('let', [t.variableDeclarator(t.identifier(stateName))]))
                if (callee.findParent((p) => p === consequent)) {
                  (consequent as any).node.body.push(assignment)
                } else {
                  const alternate = ifStem.get('alternate')
                  if (t.isBlockStatement(alternate)) {
                    (alternate as any).node.body.push(assignment)
                  } else {
                    (consequent as any).node.body.push(assignment)
                  }
                }
              }
            } else {
              const decl = buildConstVariableDeclaration(
                stateName,
                setParentCondition(component as any, callee.node, true)
              )
              returnBody.push(decl)
            }
          }
        }
      }
      replaceQueue.push(() => {
        const statement = component.getStatementParent()
        callee.replaceWith(
          statement?.isReturnStatement() ? (statement.get('argument') as NodePath<t.Node>).node : component.node
        )
      })
    })
    if (hasLoopRef) {
      const scopeDecl = template('const __scope = this.$scope')()
      this.renderPath.node.body.body.unshift(scopeDecl)
    }
    replaceQueue.forEach((func) => func())
  }

  setOutputTemplate() {
    if (Adapter.type === Adapters.quickapp && transformOptions.rootProps && transformOptions.isRoot) {
      const attrs: t.JSXAttribute[] = []
      for (const key in transformOptions.rootProps) {
        if (transformOptions.rootProps.hasOwnProperty(key)) {
          const value = transformOptions.rootProps[key]
          const keyName = key + '__temp'
          const decl = buildConstVariableDeclaration(keyName, t.identifier(JSON.stringify(value)))
          this.referencedIdentifiers.add(t.identifier(keyName))
          this.renderPath.node.body.body.push(decl)
          attrs.push(t.jSXAttribute(t.jSXIdentifier(key), t.jSXExpressionContainer(t.identifier(keyName))))
        }
      }
      this.finalReturnElement.openingElement.attributes.push(...attrs)
    }
    if (!this.finalReturnElement) {
      throw codeFrameError(this.renderPath.node, '没有找到返回的 JSX 元素，你是不是忘记 return 了？')
    }
    this.outputTemplate = parseJSXElement(this.finalReturnElement, true)
    if (!this.isDefaultRender) {
      this.outputTemplate = `<template name="${this.renderMethodName}">${this.outputTemplate}</template>`
    }
  }

  removeJSXStatement() {
    this.jsxDeclarations.forEach((d) => d && !d.removed && isContainJSXElement(d) && d.remove())
    this.returnedPaths.forEach((p: NodePath<t.ReturnStatement>) => {
      if (p.removed) {
        return
      }
      const ifStem = p.findParent((_) => _.isIfStatement())
      if (ifStem) {
        const node = p.node
        if (!node) {
          return
        }
        if (t.isJSXElement(node.argument)) {
          const jsx = node.argument
          if (
            jsx.children.length === 0 &&
            jsx.openingElement.attributes.length === 0 &&
            !this.isIfStemInLoop(p.get('argument') as any)
          ) {
            node.argument = t.nullLiteral()
          } else {
            p.remove()
          }
        } else {
          const isValid = p.get('argument').evaluateTruthy()
          if (isValid === false) {
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
      const id = path.get('id') as NodePath<t.Node>
      const init = path.get('init')
      if (t.isThisExpression(init)) {
        return hasStateId
      }
      if (id.isObjectPattern()) {
        hasStateId = (id.node.properties as (t.RestProperty | t.ObjectProperty)[]).some((p) => {
          return (
            (t.isObjectProperty(p) && t.isIdentifier(p.key, { name: word })) ||
            (t.isRestProperty(p) && t.isIdentifier((p as t.RestProperty).argument, { name: word }))
          )
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

  setCustomEvent() {
    const classPath = this.renderPath.findParent(isClassDcl as any) as NodePath<t.ClassDeclaration>
    const eventPropName = Adapter.type === Adapters.quickapp ? 'privateTaroEvent' : '$$events'
    const body = classPath.node.body.body.find(
      (b) => t.isClassProperty(b) && (b.key as t.Identifier).name === eventPropName
    ) as t.ClassProperty
    const usedEvents = Array.from(this.usedEvents).map((s) => t.stringLiteral(s))
    if (body && t.isArrayExpression(body.value)) {
      body.value = t.arrayExpression(uniq(body.value.elements.concat(usedEvents)))
    } else {
      let classProp = t.classProperty(t.identifier(eventPropName), t.arrayExpression(usedEvents)) as any // babel 6 typing 没有 static
      classProp.static = true
      classPath.node.body.body.unshift(classProp)
    }
  }

  setUsedState() {
    if (!this.isDefaultRender) {
      return
    }
    for (const [key, method] of this.methods) {
      if (method) {
        if (method.isClassMethod()) {
          const kind = method.node.kind
          if (kind === 'get') {
            this.classComputedState.add(key)
          }
        }
      }
    }

    let componentProperies = cloneDeep(this.componentProperies)

    componentProperies.forEach((s) => {
      if (s.startsWith(FN_PREFIX)) {
        const eventName = s.slice(5)
        if (componentProperies.has(eventName)) {
          componentProperies.delete(s)
          componentProperies.delete(eventName)
        }
      }
    })

    if (Adapter.type === Adapters.quickapp) {
      componentProperies = new Set(
        Array.from(componentProperies).map((p) =>
          this.upperCaseComponentProps.has(p) && !p.startsWith('on') && !p.startsWith('prv-fn') ? snakeCase(p) : p
        )
      )
    }

    Array.from(this.reserveStateWords).forEach(this.setReserveWord)
    let usedState = Array.from(
      new Set(
        Array.from(this.referencedIdentifiers)
          .map((i) => i.name)
          .concat([...this.initState, ...this.usedThisState, ...componentProperies, ...this.classComputedState])
      )
    )
      .concat(...this.usedState)
      // .filter(i => {
      //   return !methods.has(i)
      // })
      .filter((i) => !this.loopScopes.has(i))
      .filter((i) => !this.templates.has(i))
      .filter(Boolean)

    if (Adapter.type === Adapters.quickapp) {
      usedState = usedState
        .filter((i) => !new Set([...this.upperCaseComponentProps].map((i) => i.toLowerCase())).has(i))
        .filter((i) => !this.upperCaseComponentProps.has(i))
    }

    const classPath = this.renderPath.findParent(isClassDcl as any) as NodePath<t.ClassDeclaration>
    classPath.node.body.body.unshift(
      t.classProperty(
        t.identifier('$usedState'),
        t.arrayExpression(
          [
            ...new Set(
              usedState
                .filter((s) => !this.loopScopes.has(s.split('.')[0]))
                .filter((i) => i !== MAP_CALL_ITERATOR && !this.reserveStateWords.has(i))
                .filter((i) => isVarName(i))
                .filter((i) => !this.loopRefIdentifiers.has(i))
                .concat(Array.from(this.customComponentNames))
            ),
          ].map((s) => t.stringLiteral(s))
        )
      )
    )
  }

  checkDuplicateName() {
    this.loopScopes.forEach((s) => {
      if (s.includes('anonIdx')) {
        return
      }
      if (this.renderPath.scope.hasBinding(s)) {
        const err = codeFrameError(
          this.renderPath.scope.getBinding(s)!.path.node,
          '此变量声明与循环变量冲突，可能会造成问题。'
        )
        // tslint:disable-next-line: no-console
        console.warn('Warning: ', err.message)
        this.loopScopes.delete(s)
      }
    })
  }

  setPendingState() {
    let propertyKeys = Array.from(new Set(Array.from(this.referencedIdentifiers).map((i) => i.name)))
      .filter((i) => {
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
      .filter((i) => !this.loopScopes.has(i))
      .filter((i) => !this.templates.has(i))
      .filter((i) => isVarName(i))
      .filter((i) => i !== MAP_CALL_ITERATOR && !this.reserveStateWords.has(i))
      .filter((i) => !i.startsWith('$$'))
      .filter((i) => !i.startsWith('_$indexKey'))
      .filter((i) => !this.loopRefIdentifiers.has(i))

    if (this.isDefaultRender) {
      propertyKeys = propertyKeys.filter((i) => !this.initState.has(i))
    }

    let properties = propertyKeys.map((i) => t.objectProperty(t.identifier(i), t.identifier(i)))
    const pendingState = t.objectExpression(
      properties.concat(
        Array.from(this.classComputedState)
          .filter((i) => {
            return !propertyKeys.includes(i)
          })
          .map((i) => {
            return t.objectProperty(t.identifier(i), t.memberExpression(t.thisExpression(), t.identifier(i)))
          })
      )
    )
    this.propsSettingExpressions.forEach((exprs, stem) => {
      stem.body.push(...exprs.map((e) => e()))
    })
    this.renderPath.node.body.body.unshift(...Array.from(this.genCompidExprs))
    if (this.isDefaultRender) {
      if (this.refObjExpr && this.refObjExpr.length) {
        this.renderPath.node.body.body.push(
          t.expressionStatement(
            t.callExpression(
              t.memberExpression(
                t.memberExpression(t.thisExpression(), t.identifier('$$refs')),
                t.identifier('pushRefs')
              ),
              [t.arrayExpression(this.refObjExpr)]
            )
          )
        )
      }
      this.renderPath.node.body.body = this.renderPath.node.body.body.concat(
        // ...propsStatement,
        buildAssignState(pendingState),
        t.returnStatement(t.memberExpression(t.thisExpression(), t.identifier('state')))
      )
    } else {
      const usedState = Array.from(this.usedThisState).map((s) =>
        t.objectProperty(
          t.identifier(s),
          t.memberExpression(t.memberExpression(t.thisExpression(), t.identifier('state')), t.identifier(s))
        )
      )
      this.renderPath.node.body.body.push(
        // ...propsStatement,
        t.returnStatement(t.objectExpression(pendingState.properties.concat(usedState)))
      )

      const { async, body, params } = this.renderPath.node
      this.renderPath.replaceWith(
        t.classMethod(
          'method',
          t.identifier(`_create${this.renderMethodName.slice(6)}Data`),
          [t.identifier(CLASS_COMPONENT_UID)],
          t.blockStatement([t.returnStatement(t.arrowFunctionExpression(params as any, body, async))])
        )
      )
    }
    this.renderPath.traverse({
      Identifier: (path) => {
        if (this.propsDecls.has(path.node.name) && path.parentPath.isCallExpression()) {
          const { callee } = path.parentPath.node
          if (
            t.isMemberExpression(callee) &&
            t.isIdentifier(callee.object, { name: PROPS_MANAGER }) &&
            t.isIdentifier(callee.property, { name: 'set' })
          ) {
            const decl = this.propsDecls.get(path.node.name)!
            path.replaceWith(decl.node.declarations[0].init as any)
            this.propsDecls.delete(path.node.name)
            !decl.removed && decl.remove()
          }
        }
      },
    })
  }

  getCreateJSXMethodName = (name: string) => `_create${name.slice(6)}Data`

  createData() {
    if (!this.isDefaultRender) {
      return
    }
    const renderBody = this.renderPath.get('body')
    renderBody.traverse({
      ThisExpression(path) {
        const property = path.getSibling('property')
        if (property.isIdentifier({ name: 'state' })) {
          property.replaceWith(t.identifier('__state'))
        }
        if (property.isIdentifier({ name: 'props' })) {
          property.replaceWith(t.identifier('__props'))
        }
      },
    })

    this.usedThisProperties.forEach((prop) => {
      if (this.renderScope.hasBinding(prop)) {
        const binding = this.renderScope.getBinding(prop)!
        throw codeFrameError(
          binding.path.node,
          `此变量声明与 this.${prop} 的声明冲突，请更改其中一个变量名。详情见：https://github.com/NervJS/taro/issues/822`
        )
      }
    })

    this.renderPath.node.body.body.unshift(
      template(`this.__state = arguments[0] || this.state || {};`)(),
      template(`this.__props = arguments[1] || this.props || {};`)(),
      template(`const __isRunloopRef = arguments[2];`)(),
      template(`const __prefix = this.$prefix`)(),
      this.usedThisProperties.size
        ? t.variableDeclaration('const', [
          t.variableDeclarator(
            t.objectPattern(
              Array.from(this.usedThisProperties).map(
                (p) => t.objectProperty(t.identifier(p), t.identifier(p)) as any
              )
            ),
            t.thisExpression()
          ),
        ])
        : t.emptyStatement()
    )

    if (t.isIdentifier(this.renderPath.node.key)) {
      this.renderPath.node.key.name = '_createData'
    }
  }
}
