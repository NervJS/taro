import { codeFrameColumns } from '@babel/code-frame'
import generate from '@babel/generator'
import { NodePath, Scope } from '@babel/traverse'
import * as t from '@babel/types'
import * as fs from 'fs'
import { cloneDeep } from 'lodash'
import * as path from 'path'

import { Adapter, Adapters } from './adapter'
import { IS_TARO_READY, LOOP_STATE, TARO_PACKAGE_NAME } from './constant'
import { buildBlockElement } from './jsx'
import { transformOptions } from './options'
// const template = require('babel-template')
const template = require('@babel/template')

export function replaceJSXTextWithTextComponent(path: NodePath<t.JSXText | t.JSXExpressionContainer>) {
  const parent = path.findParent((p) => p.isJSXElement())
  if (
    parent &&
    parent.isJSXElement() &&
    t.isJSXIdentifier(parent.node.openingElement.name) &&
    parent.node.openingElement.name.name !== 'Text'
  ) {
    path.replaceWith(
      t.jSXElement(t.jSXOpeningElement(t.jSXIdentifier('Text'), []), t.jSXClosingElement(t.jSXIdentifier('Text')), [
        path.isJSXText() ? t.jSXText(path.node.value) : path.node,
      ])
    )
  }
}

export function isDerivedFromProps(scope: Scope, bindingName: string) {
  const binding = scope.getBinding(bindingName)
  if (binding && binding.path.isVariableDeclarator()) {
    const init = binding.path.get('init') as any
    if (t.isMemberExpression(init)) {
      const { object, property } = init
      if (t.isThisExpression(object) && t.isIdentifier(property, { name: 'props' })) {
        return true
      }
    }
    if (t.isIdentifier(init)) {
      return isDerivedFromProps(scope, init.name)
    }
  }
  return false
}

export function isDerivedFromThis(scope: Scope, bindingName: string) {
  const binding = scope.getBinding(bindingName)
  if (binding && binding.path.isVariableDeclarator()) {
    const init = binding.path.get('init')
    if (t.isThisExpression(init)) {
      return true
    }
  }
  return false
}

export const incrementId = () => {
  let id = 0
  return () => id++
}

// tslint:disable-next-line:no-empty
export const noop = function () {}

export function getSuperClassCode(path: NodePath<t.ClassDeclaration>) {
  const obj = getSuperClassPath(path)
  if (obj) {
    const { sourceValue, resolvePath } = obj
    try {
      const code = fs.readFileSync(resolvePath + (transformOptions.isTyped ? '.tsx' : '.js'), 'utf8')
      return {
        code,
        sourcePath: sourceValue,
      }
    } catch (error) {}
  }
}

export function getSuperClassPath(path: NodePath<t.ClassDeclaration>) {
  const superClass = path.node.superClass
  if (t.isIdentifier(superClass)) {
    const binding = path.scope.getBinding(superClass.name)
    if (binding && binding.kind === 'module') {
      const bindingPath = binding.path.parentPath
      if (t.isImportDeclaration(bindingPath)) {
        const source = (bindingPath.node as any).source
        if (source.value === TARO_PACKAGE_NAME) {
          return
        }
        return {
          sourceValue: source.value,
          resolvePath: pathResolver(source.value, transformOptions.sourcePath),
        }
      }
    }
  }
}

export function isContainStopPropagation(path: NodePath<t.Node> | null | undefined) {
  let matched = false
  if (path) {
    const visitor = {
      Identifier(p) {
        if (p.node.name === 'stopPropagation' && p.parentPath.parentPath.isCallExpression()) {
          matched = true
        }
      },
    }
    if (path.isIdentifier()) {
      const binding = path.scope.getBinding(path.node.name)
      if (binding) {
        binding.path.traverse(visitor)
      }
    } else {
      path.traverse(visitor)
    }
  }
  return matched
}

export function decodeUnicode(s: string) {
  return unescape(s.replace(/\\(u[0-9a-fA-F]{4})/gm, '%$1'))
}

export function isVarName(str: string | unknown) {
  if (typeof str !== 'string') {
    return false
  }

  if (str.trim() !== str) {
    return false
  }

  try {
    // tslint:disable-next-line:no-unused-expression
    new Function(str, 'var ' + str)
  } catch (e) {
    return false
  }

  return true
}

export function findMethodName(expression: t.Expression): string {
  let methodName
  if (t.isIdentifier(expression) || t.isJSXIdentifier(expression)) {
    methodName = expression.name
  } else if (t.isStringLiteral(expression)) {
    methodName = expression.value
  } else if (t.isMemberExpression(expression) && t.isIdentifier(expression.property)) {
    const { code } = generate(expression as any)
    const ids = code.split('.')
    if (ids[0] === 'this' && ids[1] === 'props' && ids[2]) {
      methodName = code.replace('this.props.', '')
    } else {
      methodName = expression.property.name
    }
  } else if (
    t.isCallExpression(expression) &&
    t.isMemberExpression(expression.callee) &&
    t.isIdentifier(expression.callee.object)
  ) {
    methodName = expression.callee.object.name
  } else if (
    t.isCallExpression(expression) &&
    t.isMemberExpression(expression.callee) &&
    t.isMemberExpression(expression.callee.object) &&
    t.isIdentifier(expression.callee.property) &&
    expression.callee.property.name === 'bind' &&
    t.isIdentifier(expression.callee.object.property)
  ) {
    methodName = expression.callee.object.property.name
  } else {
    throw codeFrameError(
      expression.loc,
      '当 props 为事件时(props name 以 `on` 开头)，只能传入一个 this 作用域下的函数。'
    )
  }
  return methodName
}

export function setParentCondition(jsx: NodePath<t.Node>, expr: t.Expression, array = false) {
  const conditionExpr = jsx.findParent((p) => p.isConditionalExpression())
  const logicExpr = jsx.findParent((p) => p.isLogicalExpression({ operator: '&&' }))
  if (array) {
    const ifAttrSet = new Set<string>([Adapter.if, Adapter.else])
    const logicalJSX = jsx.findParent(
      (p) =>
        p.isJSXElement() &&
        p.node.openingElement.attributes.some(
          (a) => t.isJSXAttribute(a) && t.isJSXIdentifier(a.name) && ifAttrSet.has(a.name.name)
        )
    ) as NodePath<t.JSXElement>
    if (logicalJSX) {
      const attr = logicalJSX.node.openingElement.attributes.find(
        (a) => t.isJSXAttribute(a) && ifAttrSet.has(a.name.name as string)
      )
      if (attr) {
        if (t.isJSXAttribute(attr) && attr.name.name === Adapter.else) {
          const prevElement: NodePath<t.JSXElement | null> = (logicalJSX as any).getPrevSibling()
          if (prevElement && prevElement.isJSXElement()) {
            const attr = prevElement.node.openingElement.attributes.find(
              (a) => t.isJSXAttribute(a) && a.name.name === Adapter.if
            )
            if (attr && t.isJSXAttribute(attr) && t.isJSXExpressionContainer(attr.value)) {
              expr = t.conditionalExpression(
                reverseBoolean(cloneDeep((attr.value as any).expression)),
                expr,
                t.arrayExpression()
              )
              return expr
            }
          }
        } else if (
          t.isJSXAttribute(attr) &&
          t.isJSXExpressionContainer(attr.value) &&
          !t.isJSXEmptyExpression(attr.value)
        ) {
          expr = t.conditionalExpression(cloneDeep((attr.value as any).expression), expr, t.arrayExpression())
          return expr
        }
      }
    }
  }
  if (conditionExpr && conditionExpr.isConditionalExpression()) {
    const consequent = conditionExpr.get('consequent')
    if (consequent === jsx || jsx.findParent((p) => p === consequent)) {
      expr = t.conditionalExpression(
        cloneDeep((conditionExpr.get('test') as NodePath<t.Node>).node) as any,
        expr,
        array ? t.arrayExpression([]) : t.nullLiteral()
      )
    }
  }
  if (logicExpr && logicExpr.isLogicalExpression({ operator: '&&' })) {
    const consequent = logicExpr.get('right')
    if (consequent === jsx || jsx.findParent((p) => p === consequent)) {
      expr = t.conditionalExpression(
        cloneDeep((logicExpr.get('left') as NodePath<t.Node>).node) as any,
        expr,
        array ? t.arrayExpression([]) : t.nullLiteral()
      )
    }
  }
  return expr
}

export function generateAnonymousState(
  scope: Scope,
  expression: NodePath<t.Expression>,
  refIds: Set<t.Identifier>,
  isLogical?: boolean
) {
  let variableName = `anonymousState_${scope.generateUid()}`
  let statementParent = expression.getStatementParent()
  if (!statementParent) {
    throw codeFrameError(expression.node.loc, '无法生成匿名 State，尝试先把值赋到一个变量上再把变量调换。')
  }
  const jsx = isLogical ? expression : expression.findParent((p) => p.isJSXElement())
  const callExpr = jsx?.findParent(
    (p) => p.isCallExpression() && isArrayMapCallExpression(p as any)
  ) as NodePath<t.CallExpression>
  const ifExpr = jsx?.findParent((p) => p.isIfStatement())
  const blockStatement = jsx?.findParent(
    (p) => p.isBlockStatement() && p.parentPath === ifExpr
  ) as NodePath<t.BlockStatement>
  const expr = setParentCondition(jsx as any, cloneDeep(expression.node))
  if (!callExpr) {
    refIds.add(t.identifier(variableName))
    statementParent.insertBefore(buildConstVariableDeclaration(variableName, expr))
    if (blockStatement && blockStatement.isBlockStatement()) {
      blockStatement.traverse({
        VariableDeclarator: (path) => {
          const { id, init } = path.node
          const isArrowFunctionInJSX = path.findParent(
            (p) =>
              p.isJSXAttribute() ||
              (p.isAssignmentExpression() &&
                t.isMemberExpression(p.node.left) &&
                t.isThisExpression(p.node.left.object) &&
                t.isIdentifier(p.node.left.property) &&
                p.node.left.property.name.startsWith(''))
          )
          if (isArrowFunctionInJSX) {
            return
          }
          // tslint:disable-next-line: strict-type-predicates
          if (t.isIdentifier(id) && !id.name.startsWith(LOOP_STATE) && !id.name.startsWith('_$') && init != null) {
            const newId = scope.generateDeclaredUidIdentifier('$' + id.name)
            refIds.forEach((refId) => {
              if (refId.name === variableName && !variableName.startsWith('_$')) {
                refIds.delete(refId)
              }
            })
            variableName = newId.name
            if (Adapter.type === Adapters.quickapp && variableName.startsWith('_$')) {
              const newVarName = variableName.slice(2)
              scope.rename(variableName, newVarName)
              variableName = newVarName
            }
            refIds.add(t.identifier(variableName))
            blockStatement.scope.rename(id.name, newId.name)
            path.parentPath.replaceWith(template('ID = INIT;')({ ID: newId, INIT: init }))
          }
        },
      })
    }
  } else {
    variableName = `${LOOP_STATE}_${callExpr.scope.generateUid()}`
    const func = callExpr.node.arguments[0]
    if (t.isArrowFunctionExpression(func)) {
      if (!t.isBlockStatement(func.body)) {
        func.body = t.blockStatement([buildConstVariableDeclaration(variableName, expr), t.returnStatement(func.body)])
      } else {
        if (ifExpr && ifExpr.isIfStatement() && ifExpr.findParent((p) => p === callExpr)) {
          const consequent = ifExpr.get('consequent') as NodePath<t.Node>
          const test = ifExpr.get('test')
          if (t.isBlockStatement(consequent)) {
            if ((jsx != null && jsx === test) || jsx?.findParent((p) => p === test)) {
              func.body.body.unshift(buildConstVariableDeclaration(variableName, expr))
            } else {
              // func.body.body.unshift(t.variableDeclaration('let', [t.variableDeclarator(t.identifier(variableName), t.nullLiteral())]))
              (consequent.node as any).body.push(
                t.expressionStatement(t.assignmentExpression('=', t.identifier(variableName), expr))
              )
            }
          } else {
            throw codeFrameError(consequent.node, 'if 表达式的结果必须由一个花括号包裹')
          }
        } else {
          func.body.body.splice(func.body.body.length - 1, 0, buildConstVariableDeclaration(variableName, expr))
        }
      }
    }
  }
  const id = t.identifier(variableName)
  expression.replaceWith(id)
  return id
}

export function isArrayMapCallExpression(callExpression: NodePath<t.Node>): callExpression is NodePath<t.Node> {
  return (
    callExpression &&
    t.isCallExpression(callExpression.node) &&
    t.isMemberExpression(callExpression.node.callee) &&
    t.isIdentifier(callExpression.node.callee.property, { name: 'map' })
  )
}

export function buildConstVariableDeclaration(variableName: string, expresion: t.Expression) {
  return t.variableDeclaration('const', [t.variableDeclarator(t.identifier(variableName), expresion)])
}

export function setTemplate(name: string, path: NodePath<t.Node>, templates) {
  const parentPath = path.parentPath
  const jsxChildren = parentPath?.findParent((p) => p.isJSXElement())
  if (name && !jsxChildren) {
    templates.set(name, path.node)
  }
}

export function isContainFunction(p: NodePath<t.Node>) {
  let bool = false
  p.traverse({
    CallExpression() {
      bool = true
    },
  })
  return bool
}

function slash(input: string) {
  const isExtendedLengthPath = /^\\\\\?\\/.test(input)
  const hasNonAscii = /[^\u0000-\u0080]+/.test(input)
  const hasChinese = /[^\u4e00-\u9fa5]+/.test(input) // has Chinese characters

  if (isExtendedLengthPath || (hasNonAscii && !hasChinese)) {
    return input
  }

  return input.replace(/\\/g, '/')
}

export function pathResolver(source: string, location: string) {
  const extName = path.extname(source)
  const promotedPath = source
  if (!['js', 'tsx'].includes(extName)) {
    try {
      const pathExist = fs.existsSync(path.resolve(path.dirname(location), source, 'index.js'))
      const tsxPathExist = fs.existsSync(path.resolve(path.dirname(location), source, 'index.tsx'))
      if (pathExist || tsxPathExist) {
        let p = path.join(promotedPath, 'index')
        if (!p.startsWith('.')) {
          p = './' + p
        }
        return slash(p)
      }
      return slash(promotedPath)
    } catch (error) {
      return slash(promotedPath)
    }
  }
  return slash(promotedPath.split('.').slice(0, -1).join('.'))
}

export const setting = {
  sourceCode: '',
}

export function codeFrameError(node, msg: string) {
  let errMsg = ''
  try {
    errMsg = codeFrameColumns(setting.sourceCode, node && node.type && node.loc ? node.loc : node, {
      highlightCode: true,
    })
  } catch (error) {
    errMsg = 'failed to locate source'
  }
  return new Error(`${msg}
-----
${errMsg}`)
}

export function createUUID() {
  return (
    '$' +
    'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
      .replace(/[xy]/g, function (c) {
        let r = (Math.random() * 16) | 0
        let v = c === 'x' ? r : (r & 0x3) | 0x8
        return v.toString(16)
      })
      .replace(/-/g, '')
      .slice(0, 8)
  )
}

let count = 0
export function createRandomLetters(n: number) {
  const countStr = (count++).toString()
  let letters = ''
  for (const s of countStr) {
    letters += String.fromCharCode(97 + parseInt(s, 10))
  }
  const padding = n - letters.length
  for (let i = 0; i < padding; i++) {
    letters += 'z'
  }
  return letters
}

export function isBlockIfStatement(ifStatement, blockStatement): ifStatement is NodePath<t.IfStatement> {
  return ifStatement && blockStatement && ifStatement.isIfStatement() && blockStatement.isBlockStatement()
}

export function buildCodeFrame(code: string) {
  return (loc: t.SourceLocation) => codeFrameColumns(code, loc) as string
}

export function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n)
}

export function buildJSXAttr(name: string, value: t.Identifier | t.Expression) {
  return t.jSXAttribute(t.jSXIdentifier(name), t.jSXExpressionContainer(value))
}

export function newJSXIfAttr(jsx: t.JSXElement, value: t.Identifier | t.Expression, path?: NodePath<t.JSXElement>) {
  const element = jsx.openingElement
  if (!t.isJSXIdentifier(element.name)) {
    return
  }
  if (element.name.name === 'Block' || element.name.name === 'block' || !path) {
    const attrs = element.attributes
    if (!attrs.some((a) => t.isJSXAttribute(a) && a.name.name === Adapter.for)) {
      element.attributes.push(buildJSXAttr(Adapter.if, value))
    } else if (path) {
      const block = buildBlockElement()
      newJSXIfAttr(block, value)
      block.children.push(jsx)
      path.node = block
    }
  } else {
    const block = buildBlockElement()
    newJSXIfAttr(block, value)
    block.children.push(jsx)
    path.node = block
  }
}

export function getSlotName(name: string) {
  return name.slice(6).toLowerCase()
}

export function isContainJSXElement(path: NodePath<t.Node>) {
  let matched = false
  path.traverse({
    JSXElement(p) {
      matched = true
      p.stop()
    },
  })
  return matched
}

export function hasComplexExpression(path: NodePath<t.Node>) {
  let matched = false
  if (isContainJSXElement(path)) {
    return false
  }
  if (path.isObjectExpression()) {
    return true
  }
  if (path.isTemplateLiteral() || path.isCallExpression()) {
    return true
  }
  if (path.isArrayExpression()) {
    const { elements } = path.node
    if (elements.some((el) => t.isObjectExpression(el as any) || t.isArrayExpression(el))) {
      return true
    }
  }
  path.traverse({
    CallExpression: (p) => {
      matched = true
      p.stop()
    },
    TemplateLiteral(p) {
      matched = true
      p.stop()
    },
    ObjectExpression(p) {
      matched = true
      p.stop()
    },
    ArrayExpression(p) {
      const { elements } = p.node
      if (elements.some((el) => t.isObjectExpression(el as any))) {
        return true
      }
    },
    TaggedTemplateExpression(p) {
      matched = true
      p.stop()
    },
    MemberExpression(path) {
      const jsxElement = path.findParent((p) => p.isJSXExpressionContainer())
      const object = path.get('object')
      const property = path.get('property')
      const parentPath = path.parentPath
      if (
        jsxElement &&
        object.isThisExpression() &&
        property.isIdentifier({ name: 'state' }) &&
        parentPath.isMemberExpression() &&
        parentPath.parentPath.isMemberExpression()
      ) {
        const sourceCode = parentPath.parentPath.getSource()
        if (sourceCode.includes('[') && sourceCode.includes(']')) {
          matched = true
          path.stop()
        }
      }
    },
  })
  return matched
}

export function findFirstIdentifierFromMemberExpression(node: t.MemberExpression, member?): t.Identifier {
  let id
  let object = node.object as any
  while (true) {
    if (t.identifier(object) && !t.isMemberExpression(object)) {
      id = object
      if (member) {
        object = member
      }
      break
    }
    object = object.object
  }
  return id
}

export function generateMemberExpressionArray(node: t.MemberExpression): string[] {
  let { object, property }: { object: any, property: any } = node
  let result = [property]
  while (true) {
    if (t.identifier(object) && !t.isMemberExpression(object)) {
      result.push(object)
      break
    }
    property = object.property
    result.push(property)
    object = object.object
  }
  return result.reverse().map((a: t.Identifier) => a.name)
}

export function getArgumentName(arg) {
  if (t.isThisExpression(arg)) {
    return 'this'
  } else if (t.isNullLiteral(arg)) {
    return 'null'
  } else if (t.isStringLiteral(arg) || t.isNumericLiteral(arg)) {
    return arg.value
  } else if (t.isIdentifier(arg)) {
    return arg.name
  } else {
    return generate(arg).code
  }
  throw new Error(`bind 不支持传入该参数: ${arg}`)
}

export function isAllLiteral(...args) {
  return args.every((p) => t.isLiteral(p))
}

export function reverseBoolean(expression: t.Expression) {
  return t.unaryExpression('!', expression)
}

export function isEmptyDeclarator(node: t.Node) {
  if (
    t.isVariableDeclarator(node) &&
    // tslint:disable-next-line: strict-type-predicates
    (node.init === null || t.isNullLiteral(node.init))
  ) {
    return true
  }
  return false
}

export function toLetters(num: number): string {
  let mod = num % 26
  let pow = (num / 26) | 0
  let out = mod ? String.fromCharCode(64 + mod) : (--pow, 'Z')
  const letter = pow ? toLetters(pow) + out : out
  return letter.toLowerCase()
}

export function findIdentifierFromStatement(statement: t.Node) {
  if (t.isVariableDeclaration(statement)) {
    const declarator = statement.declarations.find((s) => t.isIdentifier(s.id))
    if (declarator && t.isIdentifier(declarator.id)) {
      return declarator.id.name
    }
  }
  return '__return'
}

let id = 0
export function genCompid(): string {
  return String(id++)
}

export function findParentLoops(
  callee: NodePath<t.CallExpression>,
  names: Map<NodePath<t.CallExpression>, string>,
  loops: t.ArrayExpression
) {
  let indexId: t.Identifier | null = null
  let name: string | undefined
  const [func] = callee.node.arguments
  if (t.isFunctionExpression(func) || t.isArrowFunctionExpression(func)) {
    const params = func.params as t.Identifier[]
    indexId = params[1]
    name = names.get(callee)
  }

  if (indexId === null || !t.isIdentifier(indexId)) {
    indexId = t.identifier(callee.scope.generateUid('anonIdx'))
    ;(func as any).params = [(func as any).params[0], indexId]
  }

  if (!name) {
    throw codeFrameError(callee.node, '找不到循环对应的名称')
  }

  loops.elements.unshift(
    t.objectExpression([
      t.objectProperty(t.identifier('indexId'), indexId),
      t.objectProperty(t.identifier('name'), t.stringLiteral(name)),
    ])
  )

  const parentCallExpr = callee.findParent((p) => p.isCallExpression())
  if (parentCallExpr && parentCallExpr.isCallExpression()) {
    const callee = parentCallExpr.node.callee
    if (t.isMemberExpression(callee) && t.isIdentifier(callee.property) && callee.property.name === 'map') {
      findParentLoops(parentCallExpr as any, names, loops)
    }
  }
}

export function setAncestorCondition(jsx: NodePath<t.Node>, expr: t.Expression): t.Expression {
  const ifAttrSet = new Set<string>([Adapter.if, Adapter.else])
  const logicalJSX = jsx.findParent(
    (p) =>
      p.isJSXElement() &&
      p.node.openingElement.attributes.some(
        (a) => t.isJSXAttribute(a) && t.isJSXIdentifier(a.name) && ifAttrSet.has(a.name.name)
      )
  ) as NodePath<t.Node>
  if (logicalJSX) {
    const attr = (logicalJSX.node as any).openingElement.attributes.find(
      (a) => t.isJSXAttribute(a) && ifAttrSet.has(a.name.name as string)
    )
    if (attr && t.isJSXAttribute(attr)) {
      if (attr.name.name === Adapter.else) {
        const prevElement: NodePath<t.JSXElement | null> = (logicalJSX as any).getPrevSibling()
        if (prevElement && prevElement.isJSXElement()) {
          const attr = prevElement.node.openingElement.attributes.find(
            (a) => t.isJSXAttribute(a) && a.name.name === Adapter.if
          )
          if (attr && t.isJSXAttribute(attr) && !t.isJSXElement(attr.value)) {
            const condition = reverseBoolean(cloneDeep((attr.value as any)?.expression))
            expr = t.logicalExpression('&&', setAncestorCondition(logicalJSX, condition), expr)
          }
        }
      } else if (t.isJSXExpressionContainer(attr.value)) {
        const condition = cloneDeep(attr.value.expression)
        if (t.isJSXIdentifier(condition, { name: IS_TARO_READY })) {
          return expr
        }
        const ifStem = logicalJSX.findParent((p) => p.isIfStatement())
        expr = t.logicalExpression(
          '&&',
          setAncestorCondition(
            logicalJSX,
            ifStem && ifStem.isIfStatement() ? (attr.value.expression as any) : (condition as any)
          ),
          expr
        )
      }
    }
  }

  return expr
}
