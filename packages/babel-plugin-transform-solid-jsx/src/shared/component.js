import * as t from '@babel/types'
import { decode } from 'html-entities'

import { getCreateTemplate, transformNode } from './transform'
import {
  convertJSXIdentifier,
  filterChildren,
  getConfig,
  isDynamic,
  registerImportMethod,
  transformCondition,
  trimWhitespace,
} from './utils'

function convertComponentIdentifier(node) {
  if (t.isJSXIdentifier(node)) {
    if (node.name === 'this') return t.thisExpression()
    if (t.isValidIdentifier(node.name)) node.type = 'Identifier'
    else return t.stringLiteral(node.name)
  } else if (t.isJSXMemberExpression(node)) {
    const prop = convertComponentIdentifier(node.property)
    const computed = t.isStringLiteral(prop)
    return t.memberExpression(convertComponentIdentifier(node.object), prop, computed)
  }

  return node
}

export default function transformComponent(path) {
  let exprs = []
  const config = getConfig(path)
  const tagId = convertComponentIdentifier(path.node.openingElement.name)
  let props = []
  let runningObject = []
  let dynamicSpread = false
  const hasChildren = path.node.children.length > 0

  if (config.builtIns.indexOf(tagId.name) > -1 && !path.scope.hasBinding(tagId.name)) {
    const newTagId = registerImportMethod(path, tagId.name)
    tagId.name = newTagId.name
  }

  path
    .get('openingElement')
    .get('attributes')
    .forEach((attribute) => {
      const node = attribute.node
      if (t.isJSXSpreadAttribute(node)) {
        if (runningObject.length) {
          props.push(t.objectExpression(runningObject))
          runningObject = []
        }
        props.push(
          isDynamic(attribute.get('argument'), {
            checkMember: true,
          }) && (dynamicSpread = true)
            ? t.isCallExpression(node.argument) &&
              !node.argument.arguments.length &&
              !t.isCallExpression(node.argument.callee) &&
              !t.isMemberExpression(node.argument.callee)
              ? node.argument.callee
              : t.arrowFunctionExpression([], node.argument)
            : node.argument
        )
      } else {
        // handle weird babel bug around HTML entities
        const value =
          (t.isStringLiteral(node.value) ? t.stringLiteral(node.value.value) : node.value) || t.booleanLiteral(true)
        const id = convertJSXIdentifier(node.name)
        const key = id.name
        if (hasChildren && key === 'children') return
        if (t.isJSXExpressionContainer(value)) {
          if (key === 'ref') {
            if (config.generate === 'ssr') return
            // Normalize expressions for non-null and type-as
            while (
              t.isTSNonNullExpression(value.expression) ||
              t.isTSAsExpression(value.expression) ||
              t.isTSSatisfiesExpression(value.expression)
            ) {
              value.expression = value.expression.expression
            }
            let binding
            const isFunction =
              t.isIdentifier(value.expression) &&
              (binding = path.scope.getBinding(value.expression.name)) &&
              binding.kind === 'const'
            if (!isFunction && t.isLVal(value.expression)) {
              const refIdentifier = path.scope.generateUidIdentifier('_ref$')
              runningObject.push(
                t.objectMethod(
                  'method',
                  t.identifier('ref'),
                  [t.identifier('r$')],
                  t.blockStatement([
                    t.variableDeclaration('var', [t.variableDeclarator(refIdentifier, value.expression)]),
                    t.expressionStatement(
                      t.conditionalExpression(
                        t.binaryExpression(
                          '===',
                          t.unaryExpression('typeof', refIdentifier),
                          t.stringLiteral('function')
                        ),
                        t.callExpression(refIdentifier, [t.identifier('r$')]),
                        t.assignmentExpression('=', value.expression, t.identifier('r$'))
                      )
                    ),
                  ])
                )
              )
            } else if (isFunction || t.isFunction(value.expression)) {
              runningObject.push(t.objectProperty(t.identifier('ref'), value.expression))
            } else if (t.isCallExpression(value.expression)) {
              const refIdentifier = path.scope.generateUidIdentifier('_ref$')
              runningObject.push(
                t.objectMethod(
                  'method',
                  t.identifier('ref'),
                  [t.identifier('r$')],
                  t.blockStatement([
                    t.variableDeclaration('var', [t.variableDeclarator(refIdentifier, value.expression)]),
                    t.expressionStatement(
                      t.logicalExpression(
                        '&&',
                        t.binaryExpression(
                          '===',
                          t.unaryExpression('typeof', refIdentifier),
                          t.stringLiteral('function')
                        ),
                        t.callExpression(refIdentifier, [t.identifier('r$')])
                      )
                    ),
                  ])
                )
              )
            }
          } else if (
            isDynamic(attribute.get('value').get('expression'), {
              checkMember: true,
              checkTags: true,
            })
          ) {
            if (
              config.wrapConditionals &&
              config.generate !== 'ssr' &&
              (t.isLogicalExpression(value.expression) || t.isConditionalExpression(value.expression))
            ) {
              const expr = transformCondition(attribute.get('value').get('expression'), true)

              runningObject.push(
                t.objectMethod(
                  'get',
                  id,
                  [],
                  t.blockStatement([t.returnStatement(expr.body)]),
                  !t.isValidIdentifier(key)
                )
              )
            } else if (t.isCallExpression(value.expression) && t.isArrowFunctionExpression(value.expression.callee)) {
              const callee = value.expression.callee
              const body = t.isBlockStatement(callee.body)
                ? callee.body
                : t.blockStatement([t.returnStatement(callee.body)])

              runningObject.push(t.objectMethod('get', id, [], body, !t.isValidIdentifier(key)))
            } else {
              runningObject.push(
                t.objectMethod(
                  'get',
                  id,
                  [],
                  t.blockStatement([t.returnStatement(value.expression)]),
                  !t.isValidIdentifier(key)
                )
              )
            }
          } else runningObject.push(t.objectProperty(id, value.expression))
        } else runningObject.push(t.objectProperty(id, value))
      }
    })

  const childResult = transformComponentChildren(path.get('children'), config)
  if (childResult && childResult[0]) {
    if (childResult[1]) {
      const body =
        t.isCallExpression(childResult[0]) && t.isFunction(childResult[0].arguments[0])
          ? childResult[0].arguments[0].body
          : childResult[0].body
            ? childResult[0].body
            : childResult[0]
      runningObject.push(
        t.objectMethod(
          'get',
          t.identifier('children'),
          [],
          t.isExpression(body) ? t.blockStatement([t.returnStatement(body)]) : body
        )
      )
    } else runningObject.push(t.objectProperty(t.identifier('children'), childResult[0]))
  }
  if (runningObject.length || !props.length) props.push(t.objectExpression(runningObject))

  if (props.length > 1 || dynamicSpread) {
    props = [t.callExpression(registerImportMethod(path, 'mergeProps'), props)]
  }
  const componentArgs = [tagId, props[0]]
  exprs.push(t.callExpression(registerImportMethod(path, 'createComponent'), componentArgs))

  // handle hoisting conditionals
  if (exprs.length > 1) {
    const ret = exprs.pop()
    exprs = [t.callExpression(t.arrowFunctionExpression([], t.blockStatement([...exprs, t.returnStatement(ret)])), [])]
  }
  return { exprs, template: '', component: true }
}

function transformComponentChildren(children, config) {
  const filteredChildren = filterChildren(children)
  if (!filteredChildren.length) return
  let dynamic = false
  const pathNodes = []

  let transformedChildren = filteredChildren.reduce((memo, path) => {
    if (t.isJSXText(path.node)) {
      const v = decode(trimWhitespace(path.node.extra.raw))
      if (v.length) {
        pathNodes.push(path.node)
        memo.push(t.stringLiteral(v))
      }
    } else {
      const child = transformNode(path, {
        topLevel: true,
        componentChild: true,
        lastElement: true,
      })
      dynamic = dynamic || child.dynamic
      if (config.generate === 'ssr' && filteredChildren.length > 1 && child.dynamic && t.isFunction(child.exprs[0])) {
        child.exprs[0] = child.exprs[0].body
      }
      pathNodes.push(path.node)
      memo.push(getCreateTemplate(config, path, child)(path, child, filteredChildren.length > 1))
    }
    return memo
  }, [])

  if (transformedChildren.length === 1) {
    transformedChildren = transformedChildren[0]
    if (!t.isJSXExpressionContainer(pathNodes[0]) && !t.isJSXSpreadChild(pathNodes[0]) && !t.isJSXText(pathNodes[0])) {
      transformedChildren =
        t.isCallExpression(transformedChildren) &&
        !transformedChildren.arguments.length &&
        !t.isIdentifier(transformedChildren.callee)
          ? transformedChildren.callee
          : t.arrowFunctionExpression([], transformedChildren)
      dynamic = true
    }
  } else {
    transformedChildren = t.arrowFunctionExpression([], t.arrayExpression(transformedChildren))
    dynamic = true
  }
  return [transformedChildren, dynamic]
}
