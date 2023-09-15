import { NodePath } from '@babel/traverse'
import * as t from '@babel/types'
import * as fs from 'fs'
import { dirname, extname, relative, resolve } from 'path'

import { errors } from './global'
import { buildBlockElement, buildRender, pascalName, setting } from './utils'
import { createWxmlVistor, parseWXML } from './wxml'

function isNumeric (n) {
  return !isNaN(parseFloat(n)) && isFinite(n)
}

const NumberWords = ['z', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k']

export function buildTemplateName (name: string, pascal = true): string {
  if (/wx/i.test(name)) {
    return buildTemplateName('taro-' + name.slice(2, name.length))
  }
  const words = pascal ? pascalName(name + '-tmpl') : name + '-tmpl'
  // return words
  const str: string[] = []
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
  const is = attrs.find(
    (attr) =>
      t.isJSXAttribute(attr) &&
      t.isJSXIdentifier(attr.get('name')) &&
      t.isJSXAttribute(attr.node) &&
      attr.node.name.name === 'is'
  )
  const data = attrs.find(
    (attr) =>
      t.isJSXAttribute(attr) &&
      t.isJSXIdentifier(attr.get('name')) &&
      t.isJSXAttribute(attr.node) &&
      attr.node.name.name === 'data'
  )
  const name = attrs.find(
    (attr) =>
      t.isJSXAttribute(attr) &&
      t.isJSXIdentifier(attr.get('name')) &&
      t.isJSXAttribute(attr.node) &&
      attr.node.name.name === 'name'
  )

  const refIds = new Set<string>()
  const loopIds = new Set<string>()
  const imports: any[] = []
  if (name && t.isJSXAttribute(name.node)) {
    const value = name.node.value
    if (value === null || !t.isStringLiteral(value)) {
      throw new Error('template 的 `name` 属性只能是字符串')
    }
    const className = buildTemplateName(value.value)

    path.traverse(createWxmlVistor(loopIds, refIds, dirPath, [], imports))
    const firstId = Array.from(refIds)[0]
    refIds.forEach((id) => {
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
      render = buildRender(block, [], Array.from(refIds), [])
    } else {
      // 使用 ...spread
      render = buildRender(block, [], Array.from(refIds), [])
    }
    const classDecl = t.classDeclaration(
      t.identifier(className),
      t.memberExpression(t.identifier('React'), t.identifier('Component')),
      t.classBody([render]),
      []
    )
    // 添加withWeapp装饰器
    classDecl.decorators = [t.decorator(t.callExpression(t.identifier('withWeapp'), [t.objectExpression([])]))]
    path.remove()
    return {
      name: className,
      ast: classDecl,
    }
  } else if (is && t.isJSXAttribute(is.node)) {
    const value = is.node.value
    if (!value) {
      throw new Error('template 的 `is` 属性不能为空')
    }
    if (t.isStringLiteral(value)) {
      const className = buildTemplateName(value.value)
      const attributes: t.JSXAttribute[] = []
      if (data && t.isJSXAttribute(data.node)) {
        attributes.push(data.node)
      }
      path.replaceWith(
        t.jSXElement(
          t.jSXOpeningElement(t.jSXIdentifier(className), attributes),
          t.jSXClosingElement(t.jSXIdentifier(className)),
          [],
          true
        )
      )
    } else if (t.isJSXExpressionContainer(value)) {
      if (t.isStringLiteral(value.expression)) {
        const className = buildTemplateName(value.expression.value)
        const attributes: t.JSXAttribute[] = []
        if (data && t.isJSXAttribute(data.node)) {
          attributes.push(data.node)
        }
        path.replaceWith(
          t.jSXElement(
            t.jSXOpeningElement(t.jSXIdentifier(className), attributes),
            t.jSXClosingElement(t.jSXIdentifier(className)),
            [],
            true
          )
        )
      } else if (t.isConditional(value.expression)) {
        const { test, consequent, alternate } = value.expression
        if (!t.isStringLiteral(consequent) || !t.isStringLiteral(alternate)) {
          throw new Error('当 template is 标签是三元表达式时，他的两个值都必须为字符串')
        }
        const attributes: t.JSXAttribute[] = []
        if (data && t.isJSXAttribute(data.node)) {
          attributes.push(data.node)
        }
        const block = buildBlockElement()
        block.children = [
          t.jSXExpressionContainer(
            t.conditionalExpression(
              test,
              t.jSXElement(
                t.jSXOpeningElement(
                  t.jSXIdentifier('Template'),
                  attributes.concat([t.jSXAttribute(t.jSXIdentifier('is'), consequent)])
                ),
                t.jSXClosingElement(t.jSXIdentifier('Template')),
                [],
                true
              ),
              t.jSXElement(
                t.jSXOpeningElement(
                  t.jSXIdentifier('Template'),
                  attributes.concat([t.jSXAttribute(t.jSXIdentifier('is'), alternate)])
                ),
                t.jSXClosingElement(t.jSXIdentifier('Template')),
                [],
                true
              )
            )
          ),
        ]
        path.replaceWith(block)
      }
    }
    return
  }

  throw new Error('template 标签必须指名 `is` 或 `name` 任意一个标签')
}

export function getWXMLsource (dirPath: string, src: string, type: string) {
  try {
    let filePath = resolve(dirPath, src)
    if (!extname(filePath)) {
      filePath = filePath + '.wxml'
    }
    const file = fs.readFileSync(filePath, 'utf-8')
    return file
  } catch (e) {
    errors.push(`找不到这个路径的 wxml: <${type} src="${src}" />，该标签将会被忽略掉`)
    return ''
  }
}

export function parseModule (jsx: NodePath<t.JSXElement>, dirPath: string, type: 'include' | 'import') {
  const openingElement = jsx.get('openingElement')
  const attrs = openingElement.get('attributes')
  // const src = attrs.find(attr => t.isJSXAttribute(attr) && t.isJSXIdentifier(attr.name) && attr.name.name === 'src')
  // Fix
  const src = attrs.find(
    (attr) =>
      t.isJSXAttribute(attr) &&
      t.isJSXIdentifier(attr.get('name')) &&
      t.isJSXAttribute(attr.node) &&
      attr.node.name.name === 'src'
  )
  if (!src) {
    throw new Error(`${type} 标签必须包含 \`src\` 属性`)
  }
  if (extname(dirPath)) {
    dirPath = dirname(dirPath)
  }
  if (!t.isJSXAttribute(src.node)) {
    throw new Error(`${type} 标签src AST节点 必须包含node`)
  }
  const value = src.node.value
  if (!t.isStringLiteral(value)) {
    throw new Error(`${type} 标签的 src 属性值必须是一个字符串`)
  }
  let srcValue = value.value
  // 判断是否为绝对路径
  if (srcValue.startsWith('/')) {
    const absolutPath = resolve(setting.rootPath, srcValue.substr(1))
    if (!fs.existsSync(absolutPath) && !fs.existsSync(`${absolutPath}.wxml`)) {
      throw new Error(`import/include 的 src 请填入正确路径再进行转换：src="${srcValue}"`)
    }
    let relativePath = relative(dirPath, absolutPath)
    relativePath = relativePath.replace(/\\/g, '/')
    if (relativePath.indexOf('.') !== 0) {
      srcValue = './' + relativePath
    } else {
      srcValue = relativePath
    }
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
    const wxmlStr = getWXMLsource(dirPath, srcValue, type)
    const block = buildBlockElement()
    if (wxmlStr === '') {
      if (jsx.node.children.length) {
        console.error(
          `标签: <include src="${srcValue}"> 没有自动关闭。形如：<include src="${srcValue}" /> 才是标准的 wxml 格式。`
        )
      }
      jsx.remove()
      return
    }
    const { wxml } = parseWXML(resolve(dirPath, srcValue), wxmlStr, true)
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
