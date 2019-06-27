import * as t from 'babel-types'
import { buildConstVariableDeclaration, createRandomLetters, codeFrameError } from './utils'
import { NodePath } from 'babel-traverse'
import { buildBlockElement } from './jsx'
import { get as safeGet } from 'lodash'

const renderPropsMap = new Map<string, string>()

export function injectRenderPropsListener (attrPath: NodePath<t.JSXAttribute>, attrName: string, attrExpr: t.ArrowFunctionExpression, componentName: string) {
  const randomLetters = createRandomLetters(5)
  const renderClosureFuncName = attrName + randomLetters
  const jsxDecl = buildConstVariableDeclaration(renderClosureFuncName, attrExpr)
  const block = buildBlockElement()
  const renderPropsArgs = t.memberExpression(t.thisExpression(), t.identifier(renderClosureFuncName))
  renderPropsMap.set(componentName + '_' + attrName, renderClosureFuncName)
  block.children = [
    t.jSXExpressionContainer(t.callExpression(t.identifier(renderClosureFuncName), [renderPropsArgs]))
  ]
  const listener = buildListener(renderPropsArgs)
  const stemParent = attrPath.getStatementParent()
  stemParent.insertBefore(listener)
  stemParent.insertBefore(jsxDecl)
  attrPath.get('value').replaceWith(t.jSXExpressionContainer(block))
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

function buildListener (renderPropsArgs: t.MemberExpression) {
  return t.expressionStatement(
    t.callExpression(
      t.memberExpression(
        buildEventCenterMemberExpr(),
        t.identifier('only')
      ),
      [t.arrowFunctionExpression([t.identifier('e')], t.blockStatement([
        t.ifStatement(
          t.callExpression(
            t.memberExpression(t.identifier('Taro'), t.identifier('shaowEqual')),
            [t.identifier('e'), renderPropsArgs]
          ),
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
