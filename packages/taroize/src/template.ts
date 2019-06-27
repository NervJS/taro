import { NodePath } from 'babel-traverse'
import * as t from 'babel-types'
import { buildRender, buildBlockElement, pascalName } from './utils'
import { resolve } from 'path'
import * as fs from 'fs'
import { parseWXML, createWxmlVistor } from './wxml'
import { errors } from './global'

function isNumeric (n) {
  return !isNaN(parseFloat(n)) && isFinite(n)
}

const NumberWords = ['z', 'b','c','d','e', 'f','g','h','i','j','k']

function buildTemplateName (name: string) {
  if (/wx/i.test(name)) {
    return buildTemplateName('taro-' + name.slice(2, name.length))
  }
  const words = pascalName(name + '-tmpl')
  // return words
  let str: string[] = []
  for (const word of words) {
    if (isNumeric(word)) {
      str.push(NumberWords[word])
    } else {
      str.push(word)
    }
  }
  return str.join('')
}

export function parseTemplate (path: NodePath<t.JSXElement>, dirPath: string) {
  if (!path.container) {
    return
  }
  const openingElement = path.get('openingElement')
  const attrs = openingElement.get('attributes')
  const is = attrs.find(attr => attr.get('name').isJSXIdentifier({ name: 'is' }))
  const data = attrs.find(attr => attr.get('name').isJSXIdentifier({ name: 'data' }))
  // const spread = attrs.find(attr => attr.get('name').isJSXIdentifier({ name: 'spread' }))
  const name = attrs.find(attr => attr.get('name').isJSXIdentifier({ name: 'name' }))
  const refIds = new Set<string>()
  const loopIds = new Set<string>()
  let imports: any[] = []
  if (name) {
    const value = name.node.value
    if (value === null || !t.isStringLiteral(value)) {
      throw new Error('template 的 `name` 属性只能是字符串')
    }
    const className = buildTemplateName(value.value)

    path.traverse(createWxmlVistor(loopIds, refIds, dirPath, [], imports))
    const firstId = Array.from(refIds)[0]
    refIds.forEach(id => {
      if (loopIds.has(id) && id !== firstId) {
        refIds.delete(id)
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
      render = buildRender(block, [], Array.from(refIds), firstId)
    } else {
      // 使用 ...spread
      render = buildRender(block, [], Array.from(refIds), [])
    }
    const classProp = t.classProperty(t.identifier('options'), t.objectExpression([
      t.objectProperty(
        t.identifier('addGlobalClass'),
        t.booleanLiteral(true)
      )
    ])) as any
    classProp.static = true
    const classDecl = t.classDeclaration(
      t.identifier(className),
      t.memberExpression(t.identifier('Taro'), t.identifier('Component')),
      t.classBody([render, classProp]),
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
      const className = buildTemplateName(value.value)
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
        const className = buildTemplateName(value.expression.value)
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

function getWXMLsource (dirPath: string, src: string, type: string) {
  try {
    return fs.readFileSync(resolve(dirPath, src), 'utf-8')
  } catch (e) {
    errors.push(`找不到这个路径的 wxml: <${type} src="${src}" />，该标签将会被忽略掉`)
    return ''
  }
}

export function parseModule (jsx: NodePath<t.JSXElement>, dirPath: string, type: 'include' | 'import') {
  const openingElement = jsx.get('openingElement')
  const attrs = openingElement.get('attributes')
  const src = attrs.find(attr => attr.get('name').isJSXIdentifier({ name: 'src' }))
  if (!src) {
    throw new Error(`${type} 标签必须包含 \`src\` 属性`)
  }
  const value = src.get('value')
  if (!value.isStringLiteral()) {
    throw new Error(`${type} 标签的 src 属性值必须是一个字符串`)
  }
  const srcValue = value.node.value
  if (srcValue.startsWith('/')) {
    throw new Error(`import/include 的 src 请填入相对路径再进行转换：src="${srcValue}"`)
  }
  if (type === 'import') {
    const wxml = getWXMLsource(dirPath, srcValue, type)
    const { imports } = parseWXML(resolve(dirPath, srcValue), wxml, true)
    try {
      jsx.remove()
    } catch (error) {
     //
    }
    return imports
  } else {
    const { wxml } = parseWXML(dirPath, getWXMLsource(dirPath, srcValue, type), true)
    const block = buildBlockElement()
    try {
      if (wxml) {
        block.children = [wxml as any]
        jsx.replaceWith(wxml)
      } else {
        block.children = [t.jSXExpressionContainer(t.jSXEmptyExpression())]
        jsx.replaceWith(block)
      }
    } catch (error) {
      //
    }
  }
}
