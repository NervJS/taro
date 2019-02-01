import * as t from 'babel-types'
import generate from 'babel-generator'
import { codeFrameColumns } from '@babel/code-frame'
import { NodePath, Scope } from 'babel-traverse'
import { LOOP_STATE, TARO_PACKAGE_NAME } from './constant'
import { cloneDeep } from 'lodash'
import * as fs from 'fs'
import * as path from 'path'
import { buildBlockElement } from './jsx'
import { Adapter } from './adapter'
import { transformOptions } from './options'
const template = require('babel-template')

export const incrementId = () => {
  let id = 0
  return () => id++
}

export function getSuperClassCode (path: NodePath<t.ClassDeclaration>) {
  const superClass = path.node.superClass
  if (t.isIdentifier(superClass)) {
    const binding = path.scope.getBinding(superClass.name)
    if (binding && binding.kind === 'module') {
      const bindingPath = binding.path.parentPath
      if (bindingPath.isImportDeclaration()) {
        const source = bindingPath.node.source
        if (source.value === TARO_PACKAGE_NAME) {
          return
        }
        try {
          const p = pathResolver(source.value, transformOptions.sourcePath) + (transformOptions.isTyped ? '.tsx' : '.js')
          const code = fs.readFileSync(p, 'utf8')
          return {
            code,
            sourcePath: source.value
          }
        } catch (error) {
          return
        }
      }
    }
  }
}

export function isContainStopPropagation (path: NodePath<t.Node> | null | undefined) {
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

export function decodeUnicode (s: string) {
  return unescape(s.replace(/\\(u[0-9a-fA-F]{4})/gm, '%$1'))
}

export function isVarName (str: string) {
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

export function findMethodName (expression: t.Expression): string {
  let methodName
  if (
    t.isIdentifier(expression) ||
    t.isJSXIdentifier(expression)
  ) {
    methodName = expression.name
  } else if (t.isStringLiteral(expression)) {
    methodName = expression.value
  } else if (
    t.isMemberExpression(expression) &&
    t.isIdentifier(expression.property)
  ) {
    const { code } = generate(expression)
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
    throw codeFrameError(expression.loc, '当 props 为事件时(props name 以 `on` 开头)，只能传入一个 this 作用域下的函数。')
  }
  return methodName
}

export function setParentCondition (jsx: NodePath<t.Node>, expr: t.Expression, array = false) {
  const conditionExpr = jsx.findParent(p => p.isConditionalExpression())
  const logicExpr = jsx.findParent(p => p.isLogicalExpression({ operator: '&&' }))
  if (array) {
    const ifAttrSet = new Set<string>([
      Adapter.if,
      Adapter.else
    ])
    const logicalJSX = jsx.findParent(p => p.isJSXElement() && p.node.openingElement.attributes.some(a => ifAttrSet.has(a.name.name as string))) as NodePath<t.JSXElement>
    if (logicalJSX) {
      const attr = logicalJSX.node.openingElement.attributes.find(a => ifAttrSet.has(a.name.name as string))
      if (attr) {
        if (attr.name.name === Adapter.else) {
          const prevElement: NodePath<t.JSXElement | null> = (logicalJSX as any).getPrevSibling()
          if (prevElement && prevElement.isJSXElement()) {
            const attr = prevElement.node.openingElement.attributes.find(a => a.name.name === Adapter.if)
            if (attr && t.isJSXExpressionContainer(attr.value)) {
              expr = t.conditionalExpression(reverseBoolean(cloneDeep(attr.value.expression)), expr, t.arrayExpression())
              return expr
            }
          }
        } else if (t.isJSXExpressionContainer(attr.value)) {
          expr = t.conditionalExpression(cloneDeep(attr.value.expression), expr, t.arrayExpression())
          return expr
        }
      }
    }
  }
  if (conditionExpr && conditionExpr.isConditionalExpression()) {
    const consequent = conditionExpr.get('consequent')
    if (consequent === jsx || jsx.findParent(p => p === consequent)) {
      expr = t.conditionalExpression(cloneDeep(conditionExpr.get('test').node) as any, expr, array ? t.arrayExpression([]) : t.nullLiteral())
    }
  }
  if (logicExpr && logicExpr.isLogicalExpression({ operator: '&&' })) {
    const consequent = logicExpr.get('right')
    if (consequent === jsx || jsx.findParent(p => p === consequent)) {
      expr = t.conditionalExpression(cloneDeep(logicExpr.get('left').node) as any, expr, array ? t.arrayExpression([]) : t.nullLiteral())
    }
  }
  return expr
}

export function generateAnonymousState (
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
  const jsx = isLogical ? expression : expression.findParent(p => p.isJSXElement())
  const callExpr = jsx.findParent(p => p.isCallExpression() && isArrayMapCallExpression(p)) as NodePath<t.CallExpression>
  const ifExpr = jsx.findParent(p => p.isIfStatement())
  const blockStatement = jsx.findParent(p => p.isBlockStatement() && p.parentPath === ifExpr) as NodePath<t.BlockStatement>
  const expr = setParentCondition(jsx, cloneDeep(expression.node))
  if (!callExpr) {
    refIds.add(t.identifier(variableName))
    statementParent.insertBefore(
      buildConstVariableDeclaration(variableName, expr)
    )
    if (blockStatement && blockStatement.isBlockStatement()) {
      blockStatement.traverse({
        VariableDeclarator: (p) => {
          const { id, init } = p.node
          if (t.isIdentifier(id) && !id.name.startsWith(LOOP_STATE)) {
            const newId = scope.generateDeclaredUidIdentifier('$' + id.name)
            refIds.forEach((refId) => {
              if (refId.name === variableName && !variableName.startsWith('_$')) {
                refIds.delete(refId)
              }
            })
            variableName = newId.name
            refIds.add(t.identifier(variableName))
            blockStatement.scope.rename(id.name, newId.name)
            p.parentPath.replaceWith(
              template('ID = INIT;')({ ID: newId, INIT: init })
            )
          }
        }
      })
    }
  } else {
    variableName = `${LOOP_STATE}_${callExpr.scope.generateUid()}`
    const func = callExpr.node.arguments[0]
    if (t.isArrowFunctionExpression(func)) {
      if (!t.isBlockStatement(func.body)) {
        func.body = t.blockStatement([
          buildConstVariableDeclaration(variableName, expr),
          t.returnStatement(func.body)
        ])
      } else {
        func.body.body.splice(func.body.body.length - 1, 0, buildConstVariableDeclaration(variableName, expr))
      }
    }
  }
  const id = t.identifier(variableName)
  expression.replaceWith(id)
  return id
}

export function isArrayMapCallExpression (callExpression: NodePath<t.Node>): callExpression is NodePath<t.CallExpression> {
  return callExpression &&
    t.isCallExpression(callExpression.node) &&
    t.isMemberExpression(callExpression.node.callee) &&
    t.isIdentifier(callExpression.node.callee.property, { name: 'map' })
}

export function buildConstVariableDeclaration (
  variableName: string,
  expresion: t.Expression
) {
  return t.variableDeclaration('const', [
    t.variableDeclarator(t.identifier(variableName), expresion)
  ])
}

export function setTemplate (name: string, path: NodePath<t.Node>, templates) {
  const parentPath = path.parentPath
  const jsxChildren = parentPath.findParent(p => p.isJSXElement())
  if (name && !jsxChildren) {
    templates.set(name, path.node)
  }
}

export function isContainFunction (p: NodePath<t.Node>) {
  let bool = false
  p.traverse({
    CallExpression () {
      bool = true
    }
  })
  return bool
}

function slash (input: string) {
  const isExtendedLengthPath = /^\\\\\?\\/.test(input)
  const hasNonAscii = /[^\u0000-\u0080]+/.test(input)
  const hasChinese = /[^\u4e00-\u9fa5]+/.test(input)  // has Chinese characters

  if (isExtendedLengthPath || (hasNonAscii && !hasChinese)) {
    return input
  }

  return input.replace(/\\/g, '/')
}

export function pathResolver (source: string, location: string) {
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

export function codeFrameError (node, msg: string) {
  let errMsg = ''
  try {
    errMsg = codeFrameColumns(setting.sourceCode, node && node.type && node.loc ? node.loc : node, {
      highlightCode: true
    })
  } catch (error) {
    errMsg = 'failed to locate source'
  }
  return new Error(`${msg}
-----
${errMsg}`)
}

export const setting = {
  sourceCode: ''
}

export function createUUID () {
  return '$' + 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    let r = Math.random() * 16 | 0
    let v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  }).replace(/-/g, '').slice(0, 8)
}

export function createRandomLetters (n: number) {
  const str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
  return Array(n).join().split(',').map(function () { return str.charAt(Math.floor(Math.random() * str.length)) }).join('')
}

export function isBlockIfStatement (ifStatement, blockStatement): ifStatement is NodePath<t.IfStatement> {
  return ifStatement && blockStatement &&
  ifStatement.isIfStatement() &&
  blockStatement.isBlockStatement()
}

export function buildCodeFrame (code: string) {
  return (loc: t.SourceLocation) => codeFrameColumns(code, loc) as string
}

export function isNumeric (n) {
  return !isNaN(parseFloat(n)) && isFinite(n)
}

export function buildJSXAttr (name: string, value: t.Identifier | t.Expression) {
  return t.jSXAttribute(t.jSXIdentifier(name), t.jSXExpressionContainer(value))
}

export function newJSXIfAttr (jsx: t.JSXElement, value: t.Identifier | t.Expression, path?: NodePath<t.JSXElement>) {
  const element = jsx.openingElement
  if (!t.isJSXIdentifier(element.name)) {
    return
  }
  if (element.name.name === 'Block' || element.name.name === 'block' || !path) {
    element.attributes.push(buildJSXAttr(Adapter.if, value))
  } else {
    const block = buildBlockElement()
    newJSXIfAttr(block, value)
    block.children.push(jsx)
    path.node = block
  }
}

export function getSlotName (name: string) {
  return name.slice(6).toLowerCase()
}

export function isContainJSXElement (path: NodePath<t.Node>) {
  let matched = false
  path.traverse({
    JSXElement (p) {
      matched = true
      p.stop()
    }
  })
  return matched
}

export function hasComplexExpression (path: NodePath<t.Node>) {
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
    if (elements.some(el => t.isObjectExpression(el as any) || t.isArrayExpression(el))) {
      return true
    }
  }
  path.traverse({
    CallExpression: (p) => {
      matched = true
      p.stop()
    },
    TemplateLiteral (p) {
      matched = true
      p.stop()
    },
    ObjectExpression (p) {
      matched = true
      p.stop()
    },
    ArrayExpression (p) {
      const { elements } = p.node
      if (elements.some(el => t.isObjectExpression(el as any))) {
        return true
      }
    },
    TaggedTemplateExpression (p) {
      matched = true
      p.stop()
    },
    MemberExpression (path) {
      const jsxElement = path.findParent(p => p.isJSXExpressionContainer())
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
    }
  })
  return matched
}

export function findFirstIdentifierFromMemberExpression (node: t.MemberExpression, member?): t.Identifier {
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

export function getArgumentName (arg) {
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

export function isAllLiteral (...args) {
  return args.every(p => t.isLiteral(p))
}

export function reverseBoolean (expression: t.Expression) {
  return t.unaryExpression(
    '!',
    expression
  )
}

export function isEmptyDeclarator (node: t.Node) {
  if (
    t.isVariableDeclarator(node) &&
    (node.init === null ||
    t.isNullLiteral(node.init))
  ) {
    return true
  }
  return false
}

export function toLetters (num: number): string {
  let mod = num % 26
  let pow = num / 26 | 0
  let out = mod ? String.fromCharCode(64 + mod) : (--pow, 'Z')
  const letter = pow ? toLetters(pow) + out : out
  return letter.toLowerCase()
}

export function findIdentifierFromStatement (statement: t.Node) {
  if (t.isVariableDeclaration(statement)) {
    const declarator = statement.declarations.find(s => t.isIdentifier(s.id))
    if (declarator && t.isIdentifier(declarator.id)) {
      return declarator.id.name
    }
  }
  return '__return'
}
