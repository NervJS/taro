import * as t from 'babel-types'
import generate from 'babel-generator'
import { codeFrameColumns } from '@babel/code-frame'
import { NodePath, Scope } from 'babel-traverse'
import { LOOP_STATE } from './constant'
import * as fs from 'fs'
import * as path from 'path'
import { buildBlockElement } from './jsx'

export const incrementId = () => {
  let id = 0
  return () => id++
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
  if (!callExpr) {
    refIds.add(t.identifier(variableName))
    statementParent.insertBefore(
      buildConstVariableDeclaration(variableName, expression.node)
    )
  } else {
    variableName = `${LOOP_STATE}_${callExpr.scope.generateUid()}`
    const func = callExpr.node.arguments[0]
    if (t.isArrowFunctionExpression(func)) {
      if (!t.isBlockStatement(func.body)) {
        func.body = t.blockStatement([
          buildConstVariableDeclaration(variableName, expression.node),
          t.returnStatement(func.body)
        ])
      } else {
        statementParent.insertBefore(
          buildConstVariableDeclaration(variableName, expression.node)
        )
      }
    }
  }
  expression.replaceWith(
    t.identifier(variableName)
  )
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

export function pathResolver (p: string, location: string) {
  const extName = path.extname(p)
  const promotedPath = p
  if (extName === '') {
    try {
      const pathExist = fs.existsSync(path.resolve(path.dirname(location), p, 'index.js'))
      const tsxPathExist = fs.existsSync(path.resolve(path.dirname(location), p, 'index.tsx'))
      const baseNameExist = fs.existsSync(path.resolve(path.dirname(location), p) + '.js')
      if (pathExist || tsxPathExist) {
        return slash(path.join(promotedPath, 'index.wxml'))
      } else if (baseNameExist) {
        return slash(promotedPath + '.wxml')
      }
    } catch (error) {
      return slash(promotedPath + '.wxml')
    }
    return slash(promotedPath + '.wxml')
  }
  return slash(promotedPath.slice(0, promotedPath.length - extName.length) + '.wxml')
}

export function codeFrameError (loc: t.SourceLocation, msg: string) {
  return new Error(`${msg}
-----
${codeFrameColumns(setting.sourceCode, loc)}`)
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
    element.attributes.push(buildJSXAttr('wx:if', value))
  } else {
    const block = buildBlockElement()
    newJSXIfAttr(block, value)
    block.children = [jsx]
    path.node = block
  }
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
  if (path.isTemplateLiteral() || path.isCallExpression()) {
    return true
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

export function findFirstIdentifierFromMemberExpression (node: t.MemberExpression): t.Identifier {
  let id
  let object = node.object as any
  while (true) {
    if (t.identifier(object) && !t.isMemberExpression(object)) {
      id = object
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
