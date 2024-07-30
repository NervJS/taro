import * as t from '@babel/types'

import { transformNode } from '../shared/transform'
import {
  canNativeSpread,
  checkLength,
  convertCamelToKebabCase,
  convertJSXIdentifier,
  escapeStringForTemplate,
  filterChildren,
  getConfig,
  getRendererConfig,
  getTagName,
  getTaroComponentsMap,
  isDynamic,
  registerImportMethod,
  transformCondition,
} from '../shared/utils'

export function transformElement(path) {
  let tagName = getTagName(path.node)
  const config = getConfig(path)
  if (config.uniqueTransform) {
    const taroComponent = getTaroComponentsMap(path).get(tagName)
    if (taroComponent) {
      tagName = convertCamelToKebabCase(taroComponent)
    }
  }
  const results = {
    id: path.scope.generateUidIdentifier('el$'),
    declarations: [],
    exprs: [],
    dynamics: [],
    postExprs: [],
    tagName,
    renderer: 'universal',
  }

  results.declarations.push(
    t.variableDeclarator(
      results.id,
      t.callExpression(registerImportMethod(path, 'createElement', getRendererConfig(path, 'universal').moduleName), [
        t.stringLiteral(tagName),
      ])
    )
  )

  transformAttributes(path, results)
  transformChildren(path, results)

  return results
}

function transformAttributes(path, results) {
  let children, spreadExpr
  let attributes = path.get('openingElement').get('attributes')
  const elem = results.id
  const hasChildren = path.node.children.length > 0
  const config = getConfig(path)

  // preprocess spreads
  if (attributes.some((attribute) => t.isJSXSpreadAttribute(attribute.node))) {
    [attributes, spreadExpr] = processSpreads(path, attributes, {
      elem,
      hasChildren,
      wrapConditionals: config.wrapConditionals,
    })
    path.get('openingElement').set(
      'attributes',
      attributes.map((a) => a.node)
    )
  }

  path
    .get('openingElement')
    .get('attributes')
    .forEach((attribute) => {
      const node = attribute.node

      let value = node.value
      const key = t.isJSXNamespacedName(node.name)
        ? `${node.name.namespace.name}:${node.name.name.name}`
        : node.name.name
      const reservedNameSpace = t.isJSXNamespacedName(node.name) && node.name.namespace.name === 'use'
      if (t.isJSXNamespacedName(node.name) && reservedNameSpace && !t.isJSXExpressionContainer(value)) {
        node.value = value = t.jsxExpressionContainer(value || t.jsxEmptyExpression())
      }
      if (t.isJSXExpressionContainer(value)) {
        if (key === 'ref') {
          // Normalize expressions for non-null and type-as
          while (t.isTSNonNullExpression(value.expression) || t.isTSAsExpression(value.expression)) {
            value.expression = value.expression.expression
          }
          if (t.isLVal(value.expression)) {
            const refIdentifier = path.scope.generateUidIdentifier('_ref$')
            results.exprs.unshift(
              t.variableDeclaration('var', [t.variableDeclarator(refIdentifier, value.expression)]),
              t.expressionStatement(
                t.conditionalExpression(
                  t.binaryExpression('===', t.unaryExpression('typeof', refIdentifier), t.stringLiteral('function')),
                  t.callExpression(registerImportMethod(path, 'use', getRendererConfig(path, 'universal').moduleName), [
                    refIdentifier,
                    elem,
                  ]),
                  t.assignmentExpression('=', value.expression, elem)
                )
              )
            )
          } else if (t.isFunction(value.expression)) {
            results.exprs.unshift(
              t.expressionStatement(
                t.callExpression(registerImportMethod(path, 'use', getRendererConfig(path, 'universal').moduleName), [
                  value.expression,
                  elem,
                ])
              )
            )
          } else if (t.isCallExpression(value.expression)) {
            const refIdentifier = path.scope.generateUidIdentifier('_ref$')
            results.exprs.unshift(
              t.variableDeclaration('var', [t.variableDeclarator(refIdentifier, value.expression)]),
              t.expressionStatement(
                t.logicalExpression(
                  '&&',
                  t.binaryExpression('===', t.unaryExpression('typeof', refIdentifier), t.stringLiteral('function')),
                  t.callExpression(registerImportMethod(path, 'use', getRendererConfig(path, 'universal').moduleName), [
                    refIdentifier,
                    elem,
                  ])
                )
              )
            )
          }
        } else if (key.startsWith('use:')) {
          // Some trick to treat JSXIdentifier as Identifier
          node.name.name.type = 'Identifier'
          results.exprs.unshift(
            t.expressionStatement(
              t.callExpression(registerImportMethod(path, 'use', getRendererConfig(path, 'universal').moduleName), [
                node.name.name,
                elem,
                t.arrowFunctionExpression(
                  [],
                  t.isJSXEmptyExpression(value.expression) ? t.booleanLiteral(true) : value.expression
                ),
              ])
            )
          )
        } else if (key === 'children') {
          children = value
        } else if (
          config.effectWrapper &&
          isDynamic(attribute.get('value').get('expression'), {
            checkMember: true,
          })
        ) {
          results.dynamics.push({ elem, key, value: value.expression })
        } else {
          results.exprs.push(t.expressionStatement(setAttr(attribute, elem, key, value.expression)))
        }
      } else {
        results.exprs.push(t.expressionStatement(setAttr(attribute, elem, key, value)))
      }
    })
  if (spreadExpr) results.exprs.push(spreadExpr)
  if (!hasChildren && children) {
    path.node.children.push(children)
  }
}

export function setAttr(path, elem, name, value, { prevId } = {}) {
  if (!value) value = t.booleanLiteral(true)
  return t.callExpression(
    registerImportMethod(path, 'setProp', getRendererConfig(path, 'universal').moduleName),
    prevId ? [elem, t.stringLiteral(name), value, prevId] : [elem, t.stringLiteral(name), value]
  )
}

function transformChildren(path, results) {
  const filteredChildren = filterChildren(path.get('children'))
  const multi = checkLength(filteredChildren)
  const childNodes = filteredChildren.map(transformNode).reduce((memo, child) => {
    if (!child) return memo
    const i = memo.length
    if (child.text && i && memo[i - 1].text) {
      memo[i - 1].template += child.template
    } else memo.push(child)
    return memo
  }, [])

  const appends = []
  childNodes.forEach((child, index) => {
    if (!child) return
    if (child.tagName && child.renderer !== 'universal') {
      throw new Error(`<${child.tagName}> is not supported in <${getTagName(path.node)}>.
        Wrap the usage with a component that would render this element, eg. Canvas`)
    }
    if (child.id) {
      const insertNode = registerImportMethod(path, 'insertNode', getRendererConfig(path, 'universal').moduleName)
      let insert = child.id
      if (child.text) {
        const createTextNode = registerImportMethod(
          path,
          'createTextNode',
          getRendererConfig(path, 'universal').moduleName
        )
        if (multi) {
          results.declarations.push(
            t.variableDeclarator(
              child.id,
              t.callExpression(createTextNode, [
                t.templateLiteral([t.templateElement({ raw: escapeStringForTemplate(child.template) })], []),
              ])
            )
          )
        } else {
          insert = t.callExpression(createTextNode, [
            t.templateLiteral([t.templateElement({ raw: escapeStringForTemplate(child.template) })], []),
          ])
        }
      }
      appends.push(t.expressionStatement(t.callExpression(insertNode, [results.id, insert])))
      results.declarations.push(...child.declarations)
      results.exprs.push(...child.exprs)
      results.dynamics.push(...child.dynamics)
    } else if (child.exprs.length) {
      const insert = registerImportMethod(path, 'insert', getRendererConfig(path, 'universal').moduleName)
      if (multi) {
        results.exprs.push(
          t.expressionStatement(
            t.callExpression(insert, [results.id, child.exprs[0], nextChild(childNodes, index) || t.nullLiteral()])
          )
        )
      } else {
        results.exprs.push(t.expressionStatement(t.callExpression(insert, [results.id, child.exprs[0]])))
      }
    }
  })
  results.exprs.unshift(...appends)
}

function nextChild(children, index) {
  return children[index + 1] && (children[index + 1].id || nextChild(children, index + 1))
}

function processSpreads(path, attributes, { elem, hasChildren, wrapConditionals }) {
  // TODO: skip but collect the names of any properties after the last spread to not overwrite them
  const filteredAttributes = []
  const spreadArgs = []
  let runningObject = []
  let dynamicSpread = false
  let firstSpread = false
  attributes.forEach((attribute) => {
    const node = attribute.node
    const key =
      !t.isJSXSpreadAttribute(node) &&
      (t.isJSXNamespacedName(node.name) ? `${node.name.namespace.name}:${node.name.name.name}` : node.name.name)
    if (t.isJSXSpreadAttribute(node)) {
      firstSpread = true
      if (runningObject.length) {
        spreadArgs.push(t.objectExpression(runningObject))
        runningObject = []
      }
      spreadArgs.push(
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
    } else if (
      (firstSpread ||
        (t.isJSXExpressionContainer(node.value) &&
          isDynamic(attribute.get('value').get('expression'), { checkMember: true }))) &&
      canNativeSpread(key, { checkNameSpaces: true })
    ) {
      const isContainer = t.isJSXExpressionContainer(node.value)
      const dynamic = isContainer && isDynamic(attribute.get('value').get('expression'), { checkMember: true })
      if (dynamic) {
        const id = convertJSXIdentifier(node.name)
        const expr =
          wrapConditionals &&
          (t.isLogicalExpression(node.value.expression) || t.isConditionalExpression(node.value.expression))
            ? transformCondition(attribute.get('value').get('expression'), true)
            : t.arrowFunctionExpression([], node.value.expression)
        runningObject.push(
          t.objectMethod('get', id, [], t.blockStatement([t.returnStatement(expr.body)]), !t.isValidIdentifier(key))
        )
      } else {
        runningObject.push(
          t.objectProperty(
            t.stringLiteral(key),
            isContainer ? node.value.expression : node.value || t.booleanLiteral(true)
          )
        )
      }
    } else filteredAttributes.push(attribute)
  })

  if (runningObject.length) {
    spreadArgs.push(t.objectExpression(runningObject))
  }

  const props =
    spreadArgs.length === 1 && !dynamicSpread
      ? spreadArgs[0]
      : t.callExpression(registerImportMethod(path, 'mergeProps'), spreadArgs)

  return [
    filteredAttributes,
    t.expressionStatement(
      t.callExpression(registerImportMethod(path, 'spread', getRendererConfig(path, 'universal').moduleName), [
        elem,
        props,
        t.booleanLiteral(hasChildren),
      ])
    ),
  ]
}
