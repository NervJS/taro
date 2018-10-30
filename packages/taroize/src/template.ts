import { NodePath } from 'babel-traverse'
import * as t from 'babel-types'
import { camelCase, capitalize } from 'lodash'
import { buildRender, buildBlockElement } from './utils'
import { relative } from 'path'
import * as fs from 'fs'
import { parseWXML } from './wxml'

export function parseTemplate (path: NodePath<t.JSXElement>) {
  const openingElement = path.get('openingElement')
  const attrs = openingElement.get('attributes')
  const is = attrs.find(attr => attr.get('name').isJSXIdentifier({ name: 'is' }))
  const data = attrs.find(attr => attr.get('name').isJSXIdentifier({ name: 'data' }))
  // const spread = attrs.find(attr => attr.get('name').isJSXIdentifier({ name: 'spread' }))
  const name = attrs.find(attr => attr.get('name').isJSXIdentifier({ name: 'name' }))
  const refIds = new Set<string>()
  if (name) {
    const value = name.node.value
    if (value === null || !t.isStringLiteral(value)) {
      throw new Error('template 的 `name` 属性只能是字符串')
    }
    const className = capitalize(camelCase(value.value))
    path.traverse({
      Identifier (p) {
        if (!p.isReferencedIdentifier()) {
          return
        }
        const jsxExprContainer = p.findParent(p => p.isJSXExpressionContainer())
        if (!jsxExprContainer || !jsxExprContainer.isJSXExpressionContainer()) {
          return
        }
        refIds.add(p.node.name)
      }
    })

    const block = buildBlockElement()
    block.children = path.node.children
    let render: t.ClassMethod
    if (refIds.size === 0) {
      // 无状态组件
      render = buildRender(block, [], [])
    } else if (refIds.size === 1) {
      // 只有一个数据源
      render = buildRender(block, [], Array.from(refIds), Array.from(refIds)[0])
    } else {
      // 使用 ...spread
      render = buildRender(block, [], Array.from(refIds), [])
    }

    const classDecl = t.classDeclaration(
      t.identifier(className),
      t.memberExpression(t.identifier('Taro'), t.identifier('Component')),
      t.classBody([render!]),
      []
    )
    path.remove()
    return {
      name: className,
      ast: classDecl
    }
  } else if (is) {
    const value = is.node.value
    if (!value) {
      throw new Error('template 的 `is` 属性不能为空')
    }
    if (t.isStringLiteral(value)) {
      const className = capitalize(camelCase(value.value))
      let attributes: t.JSXAttribute[] = []
      if (data) {
        attributes.push(data.node)
      }
      path.replaceWith(t.jSXElement(
        t.jSXOpeningElement(t.jSXIdentifier(className), attributes),
        t.jSXClosingElement(t.jSXIdentifier(className)),
        [],
        true
      ))
    } else if (t.isJSXExpressionContainer(value)) {
      if (t.isStringLiteral(value.expression)) {
        const className = capitalize(camelCase(value.expression.value))
        let attributes: t.JSXAttribute[] = []
        if (data) {
          attributes.push(data.node)
        }
        path.replaceWith(t.jSXElement(
          t.jSXOpeningElement(t.jSXIdentifier(className), attributes),
          t.jSXClosingElement(t.jSXIdentifier(className)),
          [],
          true
        ))
      } else if (t.isConditional(value.expression)) {
        const { test, consequent, alternate } = value.expression
        if (!t.isStringLiteral(consequent) || !t.isStringLiteral(alternate)) {
          throw new Error('当 template is 标签是三元表达式时，他的两个值都必须为字符串')
        }
        let attributes: t.JSXAttribute[] = []
        if (data) {
          attributes.push(data.node)
        }
        const block = buildBlockElement()
        block.children = [t.jSXExpressionContainer(t.conditionalExpression(
          test,
          t.jSXElement(
            t.jSXOpeningElement(t.jSXIdentifier('Template'), attributes.concat(
              [t.jSXAttribute(t.jSXIdentifier('is'), consequent)]
            )),
            t.jSXClosingElement(t.jSXIdentifier('Template')),
            [],
            true
          ),
          t.jSXElement(
            t.jSXOpeningElement(t.jSXIdentifier('Template'), attributes.concat(
              [t.jSXAttribute(t.jSXIdentifier('is'), alternate)]
            )),
            t.jSXClosingElement(t.jSXIdentifier('Template')),
            [],
            true
          )
        ))]
        path.replaceWith(block)
      }
    }
    return
  }

  throw new Error('template 标签必须指名 `is` 或 `name` 任意一个标签')
}

export function parseImport (jsx: NodePath<t.JSXElement>, dirPath: string) {
  const openingElement = jsx.get('openingElement')
  const attrs = openingElement.get('attributes')
  const src = attrs.find(attr => attr.get('name').isJSXIdentifier({ name: 'src' }))
  if (!src) {
    throw new Error('import 标签必须包含 `src` 属性')
  }
  const value = src.get('value')
  if (!value.isStringLiteral()) {
    throw new Error('import 标签的 src 属性值必须是一个字符串')
  }
  const srcValue = value.node.value
  const wxml = getWXMLsource(dirPath, srcValue)
  const { imports } = parseWXML(dirPath, wxml)
  return imports
}

function getWXMLsource (dirPath: string, src: string) {
  try {
    return fs.readFileSync(relative(dirPath, src), 'utf-8')
  } catch (e) {
    throw new Error(e)
  }
}

export function parseInclude (jsx: NodePath<t.JSXElement>, dirPath: string) {
  //
}
