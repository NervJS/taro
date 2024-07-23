import * as t from '@babel/types'
import { decode } from 'html-entities'

import { Aliases, BooleanAttributes, ChildProperties, SVGElements } from '../constants'
import { getCreateTemplate, transformNode } from '../shared/transform'
import {
  checkLength,
  convertJSXIdentifier,
  escapeHTML,
  filterChildren,
  getConfig,
  getTagName,
  isComponent,
  isDynamic,
  registerImportMethod,
  reservedNameSpaces,
  trimWhitespace,
} from '../shared/utils'
import VoidElements from '../VoidElements'
import { createTemplate } from './template'

function appendToTemplate(template, value) {
  let array
  if (Array.isArray(value)) {
    [value, ...array] = value
  }
  template[template.length - 1] += value
  if (array && array.length) template.push.apply(template, array)
}

export function transformElement(path, info) {
  const config = getConfig(path)
  // contains spread attributes
  if (path.node.openingElement.attributes.some((a) => t.isJSXSpreadAttribute(a))) {
    return createElement(path, { ...info, ...config })
  }

  const tagName = getTagName(path.node)
  const voidTag = VoidElements.indexOf(tagName) > -1
  const results = {
    template: [`<${tagName}`],
    templateValues: [],
    declarations: [],
    exprs: [],
    dynamics: [],
    tagName,
    wontEscape: path.node.wontEscape,
    renderer: 'ssr',
  }
  if (tagName === 'script' || tagName === 'style') path.doNotEscape = true

  if (info.topLevel && config.hydratable) {
    if (tagName === 'head') {
      registerImportMethod(path, 'NoHydration')
      registerImportMethod(path, 'createComponent')
      const child = transformElement(path, { ...info, topLevel: false })
      results.template = ''
      results.exprs.push(
        t.callExpression(t.identifier('_$createComponent'), [
          t.identifier('_$NoHydration'),
          t.objectExpression([
            t.objectMethod(
              'get',
              t.identifier('children'),
              [],
              t.blockStatement([t.returnStatement(createTemplate(path, child))])
            ),
          ]),
        ])
      )
      return results
    }
    results.template.push('')
    results.templateValues.push(t.callExpression(registerImportMethod(path, 'ssrHydrationKey'), []))
  }
  transformAttributes(path, results, { ...config, ...info })
  appendToTemplate(results.template, '>')
  if (!voidTag) {
    transformChildren(path, results, { ...config, ...info })
    appendToTemplate(results.template, `</${tagName}>`)
  }
  return results
}

function toAttribute(key, isSVG) {
  key = Aliases[key] || key
  !isSVG && (key = key.toLowerCase())
  return key
}

function setAttr(attribute, results, name, value, isSVG) {
  // strip out namespaces for now, everything at this point is an attribute
  let parts
  if ((parts = name.split(':')) && parts[1] && reservedNameSpaces.has(parts[0])) {
    name = parts[1]
  }

  name = toAttribute(name, isSVG)
  const attr = t.callExpression(registerImportMethod(attribute, 'ssrAttribute'), [
    t.stringLiteral(name),
    value,
    t.booleanLiteral(false),
  ])
  if (results.template[results.template.length - 1].length) {
    results.template.push('')
    results.templateValues.push(attr)
  } else {
    const last = results.templateValues.length - 1
    results.templateValues[last] = t.binaryExpression('+', results.templateValues[last], attr)
  }
}

function escapeExpression(path, expression, attr, escapeLiterals) {
  if (
    t.isStringLiteral(expression) ||
    t.isNumericLiteral(expression) ||
    (t.isTemplateLiteral(expression) && expression.expressions.length === 0)
  ) {
    if (escapeLiterals) {
      if (t.isStringLiteral(expression)) return t.stringLiteral(escapeHTML(expression.value, attr))
      else if (t.isTemplateLiteral(expression)) return t.stringLiteral(escapeHTML(expression.quasis[0].value.raw, attr))
    }
    return expression
  } else if (t.isFunction(expression)) {
    if (t.isBlockStatement(expression.body)) {
      expression.body.body = expression.body.body.map((e) => {
        if (t.isReturnStatement(e)) e.argument = escapeExpression(path, e.argument, attr, escapeLiterals)
        return e
      })
    } else expression.body = escapeExpression(path, expression.body, attr, escapeLiterals)
    return expression
  } else if (t.isTemplateLiteral(expression)) {
    expression.expressions = expression.expressions.map((e) => escapeExpression(path, e, attr, escapeLiterals))
    return expression
  } else if (t.isUnaryExpression(expression)) {
    return expression
  } else if (t.isBinaryExpression(expression)) {
    expression.left = escapeExpression(path, expression.left, attr, escapeLiterals)
    expression.right = escapeExpression(path, expression.right, attr, escapeLiterals)
    return expression
  } else if (t.isConditionalExpression(expression)) {
    expression.consequent = escapeExpression(path, expression.consequent, attr, escapeLiterals)
    expression.alternate = escapeExpression(path, expression.alternate, attr, escapeLiterals)
    return expression
  } else if (t.isLogicalExpression(expression)) {
    expression.right = escapeExpression(path, expression.right, attr, escapeLiterals)
    if (expression.operator !== '&&') {
      expression.left = escapeExpression(path, expression.left, attr, escapeLiterals)
    }
    return expression
  } else if (t.isCallExpression(expression) && t.isFunction(expression.callee)) {
    if (t.isBlockStatement(expression.callee.body)) {
      expression.callee.body.body = expression.callee.body.body.map((e) => {
        if (t.isReturnStatement(e)) e.argument = escapeExpression(path, e.argument, attr, escapeLiterals)
        return e
      })
    } else expression.callee.body = escapeExpression(path, expression.callee.body, attr, escapeLiterals)
    return expression
  } else if (t.isJSXElement(expression) && !isComponent(getTagName(expression))) {
    expression.wontEscape = true
    return expression
  }

  return t.callExpression(
    registerImportMethod(path, 'escape'),
    [expression].concat(attr ? [t.booleanLiteral(true)] : [])
  )
}

function transformToObject(attrName, attributes, selectedAttributes) {
  const properties = []
  const existingAttribute = attributes.find((a) => a.node.name.name === attrName)
  for (let i = 0; i < selectedAttributes.length; i++) {
    const attr = selectedAttributes[i].node
    const computed = !t.isValidIdentifier(attr.name.name.name)
    if (!computed) {
      attr.name.name.type = 'Identifier'
    }
    properties.push(
      t.objectProperty(
        computed ? t.stringLiteral(attr.name.name.name) : attr.name.name,
        t.isJSXExpressionContainer(attr.value) ? attr.value.expression : attr.value
      )
    )
    ;(existingAttribute || i) && attributes.splice(selectedAttributes[i].key, 1)
  }
  if (
    existingAttribute &&
    t.isJSXExpressionContainer(existingAttribute.node.value) &&
    t.isObjectExpression(existingAttribute.node.value.expression)
  ) {
    existingAttribute.node.value.expression.properties.push(...properties)
  } else {
    selectedAttributes[0].node = t.jsxAttribute(
      t.jsxIdentifier(attrName),
      t.jsxExpressionContainer(t.objectExpression(properties))
    )
  }
}

function normalizeAttributes(path) {
  const attributes = path.get('openingElement').get('attributes')
  const styleAttributes = attributes.filter(
    (a) => t.isJSXNamespacedName(a.node.name) && a.node.name.namespace.name === 'style'
  )
  const classNamespaceAttributes = attributes.filter(
    (a) => t.isJSXNamespacedName(a.node.name) && a.node.name.namespace.name === 'class'
  )
  if (classNamespaceAttributes.length) transformToObject('classList', attributes, classNamespaceAttributes)
  const classAttributes = attributes.filter(
    (a) =>
      a.node.name &&
      (a.node.name.name === 'class' || a.node.name.name === 'className' || a.node.name.name === 'classList')
  )
  // combine class propertoes
  if (classAttributes.length > 1) {
    const first = classAttributes[0].node
    const values = []
    const quasis = [t.templateElement({ raw: '' })]
    for (let i = 0; i < classAttributes.length; i++) {
      const attr = classAttributes[i].node
      const isLast = i === classAttributes.length - 1
      if (!t.isJSXExpressionContainer(attr.value)) {
        const prev = quasis.pop()
        quasis.push(
          t.templateElement({
            raw: (prev ? prev.value.raw : '') + `${attr.value.value}` + (isLast ? '' : ' '),
          })
        )
      } else {
        let expr = attr.value.expression
        if (attr.name.name === 'classList') {
          if (t.isObjectExpression(expr) && !expr.properties.some((p) => t.isSpreadElement(p))) {
            transformClasslistObject(path, expr, values, quasis)
            if (!isLast) quasis[quasis.length - 1].value.raw += ' '
            i && attributes.splice(attributes.indexOf(classAttributes[i]), 1)
            continue
          }
          expr = t.callExpression(registerImportMethod(path, 'ssrClassList'), [expr])
        }
        values.push(t.logicalExpression('||', expr, t.stringLiteral('')))
        quasis.push(t.templateElement({ raw: isLast ? '' : ' ' }))
      }
      i && attributes.splice(attributes.indexOf(classAttributes[i]), 1)
    }
    first.name = t.jsxIdentifier('class')
    first.value = t.jsxExpressionContainer(t.templateLiteral(quasis, values))
  }
  if (styleAttributes.length) transformToObject('style', attributes, styleAttributes)
  return attributes
}

function transformAttributes(path, results, info) {
  const tagName = getTagName(path.node)
  const isSVG = SVGElements.has(tagName)
  const hasChildren = path.node.children.length > 0
  const attributes = normalizeAttributes(path)
  let children

  attributes.forEach((attribute) => {
    const node = attribute.node

    let value = node.value
    let key = t.isJSXNamespacedName(node.name) ? `${node.name.namespace.name}:${node.name.name.name}` : node.name.name
    const reservedNameSpace = t.isJSXNamespacedName(node.name) && reservedNameSpaces.has(node.name.namespace.name)
    if (
      ((t.isJSXNamespacedName(node.name) && reservedNameSpace) || ChildProperties.has(key)) &&
      !t.isJSXExpressionContainer(value)
    ) {
      node.value = value = t.jsxExpressionContainer(value || t.jsxEmptyExpression())
    }

    if (
      t.isJSXExpressionContainer(value) &&
      (reservedNameSpace ||
        ChildProperties.has(key) ||
        !(
          t.isStringLiteral(value.expression) ||
          t.isNumericLiteral(value.expression) ||
          t.isBooleanLiteral(value.expression)
        ))
    ) {
      if (key === 'ref' || key.startsWith('use:') || key.startsWith('prop:') || key.startsWith('on')) return false
      else if (ChildProperties.has(key)) {
        if (info.hydratable && key === 'textContent' && value && value.expression) {
          value.expression = t.logicalExpression('||', value.expression, t.stringLiteral(' '))
        }
        if (key === 'innerHTML') path.doNotEscape = true
        children = value
      } else {
        let doEscape = true
        if (BooleanAttributes.has(key)) {
          results.template.push('')
          const fn = t.callExpression(registerImportMethod(attribute, 'ssrAttribute'), [
            t.stringLiteral(key),
            value.expression,
            t.booleanLiteral(true),
          ])
          results.templateValues.push(fn)
          return
        }
        if (key === 'style') {
          if (
            t.isJSXExpressionContainer(value) &&
            t.isObjectExpression(value.expression) &&
            !value.expression.properties.some((p) => t.isSpreadElement(p))
          ) {
            const props = value.expression.properties.map((p, i) =>
              t.binaryExpression(
                '+',
                t.stringLiteral((i ? ';' : '') + (t.isIdentifier(p.key) ? p.key.name : p.key.value) + ':'),
                escapeExpression(path, p.value, true, true)
              )
            )
            let res = props[0]
            for (let i = 1; i < props.length; i++) {
              res = t.binaryExpression('+', res, props[i])
            }
            value.expression = res
          } else {
            value.expression = t.callExpression(registerImportMethod(path, 'ssrStyle'), [value.expression])
          }
          doEscape = false
        }
        if (key === 'classList') {
          if (
            t.isObjectExpression(value.expression) &&
            !value.expression.properties.some((p) => t.isSpreadElement(p))
          ) {
            const values = []
            const quasis = [t.templateElement({ raw: '' })]
            transformClasslistObject(path, value.expression, values, quasis)
            if (!values.length) value.expression = t.stringLiteral(quasis[0].value.raw)
            else if (values.length === 1 && !quasis[0].value.raw && !quasis[1].value.raw) {
              value.expression = values[0]
            } else value.expression = t.templateLiteral(quasis, values)
          } else {
            value.expression = t.callExpression(registerImportMethod(path, 'ssrClassList'), [value.expression])
          }
          key = 'class'
          doEscape = false
        }
        if (doEscape) value.expression = escapeExpression(path, value.expression, true)

        if (!doEscape || t.isLiteral(value.expression)) {
          key = toAttribute(key, isSVG)
          appendToTemplate(results.template, ` ${key}="`)
          results.template.push(`"`)
          results.templateValues.push(value.expression)
        } else setAttr(attribute, results, key, value.expression, isSVG)
      }
    } else {
      if (key === '$ServerOnly') return
      if (t.isJSXExpressionContainer(value)) value = value.expression
      key = toAttribute(key, isSVG)
      const isBoolean = BooleanAttributes.has(key)
      if (isBoolean && value && value.value !== '' && !value.value) return
      appendToTemplate(results.template, ` ${key}`)
      if (!value) return
      let text = isBoolean ? '' : value.value
      if (key === 'style' || key === 'class') {
        text = trimWhitespace(text)
        if (key === 'style') {
          text = text.replace(/; /g, ';').replace(/: /g, ':')
        }
      }
      appendToTemplate(results.template, `="${escapeHTML(text, true)}"`)
    }
  })
  if (!hasChildren && children) {
    path.node.children.push(children)
  }
}

function transformClasslistObject(path, expr, values, quasis) {
  expr.properties.forEach((prop, i) => {
    const isLast = expr.properties.length - 1 === i
    let key = prop.key
    if (t.isIdentifier(prop.key) && !prop.computed) key = t.stringLiteral(key.name)
    else if (prop.computed) {
      key = t.callExpression(registerImportMethod(path, 'escape'), [prop.key, t.booleanLiteral(true)])
    } else key = t.stringLiteral(escapeHTML(prop.key.value))
    if (t.isBooleanLiteral(prop.value)) {
      if (prop.value.value === true) {
        if (!prop.computed) {
          const prev = quasis.pop()
          quasis.push(
            t.templateElement({
              raw: (prev ? prev.value.raw : '') + (i ? ' ' : '') + `${key.value}` + (isLast ? '' : ' '),
            })
          )
        } else {
          values.push(key)
          quasis.push(t.templateElement({ raw: isLast ? '' : ' ' }))
        }
      }
    } else {
      values.push(t.conditionalExpression(prop.value, key, t.stringLiteral('')))
      quasis.push(t.templateElement({ raw: isLast ? '' : ' ' }))
    }
  })
}

function transformChildren(path, results, { hydratable }) {
  const doNotEscape = path.doNotEscape
  const filteredChildren = filterChildren(path.get('children'))
  const multi = checkLength(filteredChildren)
  const markers = hydratable && multi
  filteredChildren.forEach((node) => {
    if (t.isJSXElement(node.node) && getTagName(node.node) === 'head') {
      const child = transformNode(node, { doNotEscape, hydratable: false })
      registerImportMethod(path, 'NoHydration')
      registerImportMethod(path, 'createComponent')
      results.template.push('')
      results.templateValues.push(
        t.callExpression(t.identifier('_$createComponent'), [
          t.identifier('_$NoHydration'),
          t.objectExpression([
            t.objectMethod(
              'get',
              t.identifier('children'),
              [],
              t.blockStatement([t.returnStatement(createTemplate(path, child))])
            ),
          ]),
        ])
      )
      return
    }
    const child = transformNode(node, { doNotEscape })
    if (!child) return
    appendToTemplate(results.template, child.template)
    results.templateValues.push.apply(results.templateValues, child.templateValues || [])
    if (child.exprs.length) {
      if (!doNotEscape && !child.spreadElement) child.exprs[0] = escapeExpression(path, child.exprs[0])

      // boxed by textNodes
      if (markers && !child.spreadElement) {
        appendToTemplate(results.template, `<!--$-->`)
        results.template.push('')
        results.templateValues.push(child.exprs[0])
        appendToTemplate(results.template, `<!--/-->`)
      } else {
        results.template.push('')
        results.templateValues.push(child.exprs[0])
      }
    }
  })
}

function createElement(path, { topLevel, hydratable }) {
  const tagName = getTagName(path.node)
  const config = getConfig(path)
  const attributes = normalizeAttributes(path)

  const filteredChildren = filterChildren(path.get('children'))
  const multi = checkLength(filteredChildren)
  const markers = hydratable && multi
  const childNodes = filteredChildren.reduce((memo, path) => {
    if (t.isJSXText(path.node)) {
      const v = decode(trimWhitespace(path.node.extra.raw))
      if (v.length) memo.push(t.stringLiteral(v))
    } else {
      const child = transformNode(path)
      if (markers && child.exprs.length && !child.spreadElement) memo.push(t.stringLiteral('<!--$-->'))
      if (child.exprs.length && !child.spreadElement) child.exprs[0] = escapeExpression(path, child.exprs[0])
      memo.push(getCreateTemplate(config, path, child)(path, child, true))
      if (markers && child.exprs.length && !child.spreadElement) memo.push(t.stringLiteral('<!--/-->'))
    }
    return memo
  }, [])

  let props
  if (attributes.length === 1) {
    props = [attributes[0].node.argument]
  } else {
    props = []
    let runningObject = []
    let dynamicSpread = false
    const hasChildren = path.node.children.length > 0

    attributes.forEach((attribute) => {
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
        const value = node.value || t.booleanLiteral(true)
        const id = convertJSXIdentifier(node.name)
        const key = t.isJSXNamespacedName(node.name) ? `${node.name.namespace.name}:${node.name.name.name}` : node.name.name

        if (hasChildren && key === 'children') return
        if (key === 'ref' || key.startsWith('use:') || key.startsWith('prop:') || key.startsWith('on')) return
        if (t.isJSXExpressionContainer(value)) {
          if (
            isDynamic(attribute.get('value').get('expression'), {
              checkMember: true,
              checkTags: true,
            })
          ) {
            const expr = t.arrowFunctionExpression([], value.expression)
            runningObject.push(
              t.objectMethod('get', id, [], t.blockStatement([t.returnStatement(expr.body)]), !t.isValidIdentifier(key))
            )
          } else runningObject.push(t.objectProperty(id, value.expression))
        } else runningObject.push(t.objectProperty(id, value))
      }
    })

    if (runningObject.length || !props.length) props.push(t.objectExpression(runningObject))

    if (props.length > 1 || dynamicSpread) {
      props = [t.callExpression(registerImportMethod(path, 'mergeProps'), props)]
    }
  }

  const exprs = [
    t.callExpression(registerImportMethod(path, 'ssrElement'), [
      t.stringLiteral(tagName),
      props[0],
      childNodes.length
        ? hydratable
          ? t.arrowFunctionExpression([], childNodes.length === 1 ? childNodes[0] : t.arrayExpression(childNodes))
          : childNodes.length === 1
            ? childNodes[0]
            : t.arrayExpression(childNodes)
        : t.identifier('undefined'),
      t.booleanLiteral(Boolean(topLevel && config.hydratable)),
    ]),
  ]
  return { exprs, template: '', spreadElement: true }
}
