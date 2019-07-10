import * as t from 'babel-types'
import { buildConstVariableDeclaration, createRandomLetters, codeFrameError } from './utils'
import { NodePath } from 'babel-traverse'
import { buildBlockElement } from './jsx'
import { get as safeGet } from 'lodash'

const renderPropsMap = new Map<string, string>()

const RENDER_PROPS_EVENTS = '$$renderPropsEvents'

export function injectRenderPropsListener (attrPath: NodePath<t.JSXAttribute>, attrName: string, attrExpr: t.ArrowFunctionExpression, componentName: string) {
  const randomLetters = createRandomLetters(5)
  const renderClosureFuncName = attrName + randomLetters
  const jsxDecl = buildConstVariableDeclaration(renderClosureFuncName, attrExpr)
  const block = buildBlockElement([], true)
  const renderPropsArgs = t.memberExpression(t.thisExpression(), t.identifier(renderClosureFuncName))
  renderPropsMap.set(componentName + '_' + attrName, renderClosureFuncName)
  block.children = [
    t.jSXExpressionContainer(t.callExpression(t.identifier(renderClosureFuncName), [renderPropsArgs]))
  ]
  const listener = buildListener(renderClosureFuncName, renderPropsArgs)
  const stemParent = attrPath.getStatementParent()
  stemParent.insertBefore(listener)
  stemParent.insertBefore(jsxDecl)
  attrPath.get('value').replaceWith(t.jSXExpressionContainer(block))
  setRenderPropsEvents(attrPath, renderClosureFuncName)
}

function setRenderPropsEvents (attrPath: NodePath<t.JSXAttribute>, renderClosureFuncName: string) {
  const classDecl = attrPath.findParent(p => p.isClassDeclaration())
  if (classDecl && classDecl.isClassDeclaration()) {
    let hasEvent = false
    for (const s of classDecl.node.body.body) {
      if (t.isClassProperty(s) && s.key.name === RENDER_PROPS_EVENTS && t.isArrayExpression(s.value)) {
        hasEvent = true
        if (s.value.elements.some(e => t.isStringLiteral(e) && e.value === renderClosureFuncName)) {
          break
        }
        s.value.elements.push(t.stringLiteral(renderClosureFuncName))
      }
    }

    if (!hasEvent) {
      classDecl.node.body.body.push(t.classProperty(
        t.identifier(RENDER_PROPS_EVENTS),
        t.arrayExpression([t.stringLiteral(renderClosureFuncName)])
      ))
    }
  }
}

export function injectRenderPropsEmiter (callExpr: NodePath<t.CallExpression>, attrName: string) {
  const classDecl = callExpr.findParent(p => p.isClassDeclaration())
  const classDeclName = classDecl && classDecl.isClassDeclaration() && safeGet(classDecl, 'node.id.name', '')
  if (typeof classDeclName !== 'string') {
    throw codeFrameError(classDecl, '使用 render props 必须指定 class 的名称。')
  }
  const renderClosureFuncName = renderPropsMap.get(classDeclName + '_' + attrName) || ''
  const args: (t.Expression | t.SpreadElement)[] = [t.stringLiteral(renderClosureFuncName)]
  if (Array.isArray(callExpr.node.arguments) && callExpr.node.arguments.length) {
    args.push(callExpr.node.arguments[0])
  }
  const emiter = t.callExpression(
    t.memberExpression(buildEventCenterMemberExpr(), t.identifier('trigger')),
    args
  )
  const stemParent = callExpr.getStatementParent()
  stemParent.insertBefore(t.expressionStatement(emiter))
}

function buildListener (renderClosureFuncName: string, renderPropsArgs: t.MemberExpression) {
  return t.expressionStatement(
    t.callExpression(
      t.memberExpression(
        buildEventCenterMemberExpr(),
        t.identifier('on')
      ),
      [t.stringLiteral(renderClosureFuncName), t.arrowFunctionExpression([t.identifier('e')], t.blockStatement([
        t.ifStatement(
          t.unaryExpression('!', t.callExpression(
            t.memberExpression(t.identifier('Taro'), t.identifier('shallowEqual')),
            [t.identifier('e'), renderPropsArgs]
          )),
          t.blockStatement([
            t.expressionStatement(t.assignmentExpression('=', renderPropsArgs, t.identifier('e'))),
            t.expressionStatement(t.callExpression(
              t.memberExpression(t.thisExpression(), t.identifier('setState')),
              [t.objectExpression([])]
            ))
          ])
        )
      ]))]
    )
  )
}

function buildEventCenterMemberExpr () {
  return t.memberExpression(
    t.identifier('Taro'),
    t.identifier('eventCenter')
  )
}
