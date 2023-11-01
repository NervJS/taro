/* eslint-disable camelcase */
import traverse, { NodePath, Visitor } from '@babel/traverse'
import * as t from '@babel/types'
import * as fs from 'fs'
import { parse, stringify } from 'himalaya-wxml'
import { kebabCase } from 'lodash'
import { relative, resolve } from 'path'

import { replaceIdentifier, replaceMemberExpression } from './script'
import { buildTemplateName, getWXMLsource } from './template'
import { buildImportStatement, codeFrameError, parseCode, setting } from './utils'
import {
  AllKindNode,
  Attribute,
  Element,
  NodeType,
  parseContent,
  Text,
  WX_ELSE,
  WX_ELSE_IF,
  WX_FOR,
  WX_FOR_INDEX,
  WX_FOR_ITEM,
  WX_IF,
  WX_KEY,
} from './wxml'

const { prettyPrint } = require('html')

interface Result {
  ast: t.File
  template: string
  imports: VueImport[]
}

export function parseVue (dirPath: string, wxml: string, jsCode = ''): Result {
  let ast = parseCode(jsCode)
  let foundWXInstance = false
  const vistor: Visitor = {
    BlockStatement (path) {
      path.scope.rename('wx', 'Taro')
    },
    Identifier (path) {
      if (path.isReferenced() && path.node.name === 'wx') {
        path.replaceWith(t.identifier('Taro'))
      }
    },
    CallExpression (path) {
      const callee = path.get('callee')
      replaceIdentifier(callee as NodePath<t.Node>)
      replaceMemberExpression(callee as NodePath<t.Node>)
      if (
        callee.isIdentifier({ name: 'Page' }) ||
        callee.isIdentifier({ name: 'Component' }) ||
        callee.isIdentifier({ name: 'App' })
      ) {
        foundWXInstance = true
        const componentType = callee.node.name
        ast.program.body.push(
          t.exportDefaultDeclaration(
            t.callExpression(t.identifier('withWeapp'), [path.node.arguments[0], t.stringLiteral(componentType)])
          )
        )
        // path.insertAfter(t.exportDefaultDeclaration(t.identifier(defaultClassName)))
        path.remove()
      }
    },
  }

  traverse(ast, vistor)

  if (!foundWXInstance) {
    ast = parseCode(jsCode + ';Component({})')
    traverse(ast, vistor)
  }

  const taroImport = buildImportStatement('@tarojs/taro', [], 'Taro')

  const withWeappImport = buildImportStatement('@tarojs/with-weapp', [], 'withWeapp')

  ast.program.body.unshift(
    taroImport,
    withWeappImport
    // ...wxses.filter(wxs => !wxs.src.startsWith('./wxs__')).map(wxs => buildImportStatement(wxs.src, [], wxs.module))
  )

  const { imports, template } = parseWXML(dirPath, wxml, [])

  return {
    ast,
    imports,
    template,
  }
}

export function parseWXML (dirPath: string, wxml: string, imports: VueImport[]) {
  // const parseResult = getCacheWxml(dirPath)
  // if (parseResult) {
  //   return parseResult
  // }

  try {
    wxml = prettyPrint(wxml, {
      max_char: 0,
      indent_char: 0,
      unformatted: ['text', 'wxs'],
    })
  } catch (error) {
    //
  }

  const nodes: AllKindNode[] = parse(wxml.trim()).map((node) => parseNode(node, dirPath, imports))
  const template = generateVueFile(nodes)
  return {
    nodes,
    template,
    imports,
  }
}

function parseElement (element: Element, dirPath: string, imports: VueImport[]): Element | Text {
  let forItem = 'item'
  let forIndex = 'index'

  switch (element.tagName) {
    case 'template':
      parseTemplate(element, imports)
      break
    case 'wxs':
      parseWXS(element, imports)
      break
    case 'import':
    case 'include':
      parseModule(element, dirPath, imports)
      return {
        type: NodeType.Text,
        content: '',
      }
    default:
      break
  }

  return {
    tagName: element.tagName,
    type: element.type,
    children: element.children.map((child) => parseNode(child, dirPath, imports)),
    attributes: element.attributes
      .filter((a) => {
        let match = true
        if (a.key === WX_FOR_ITEM) {
          match = false
          // 这里用 `||` 不用 `??` 是因为用户可能会填一个空字符串
          forItem = a.value || forItem
        } else if (a.key === WX_FOR_INDEX) {
          match = false
          forIndex = a.value || forIndex
        }
        return match
      })
      .map((a) => {
        return parseAttribute(a, forItem, forIndex)
      }),
  }
}

function parseNode (node: AllKindNode, dirPath: string, imports: VueImport[]): AllKindNode {
  if (node.type === NodeType.Text) {
    return node
  } else if (node.type === NodeType.Comment) {
    return node
  }

  return parseElement(node, dirPath, imports)
}

const VUE_IF = 'v-if'
const VUE_ELSE_IF = 'v-else-if'
const VUE_FOR = 'v-for'
const VUE_ELSE = 'v-else'
const VUE_KEY = 'key'
const WX_FOR_2 = 'wx:for-items'

function parseAttribute (attr: Attribute, forItem: string, forIndex: string): Attribute {
  let { key, value } = attr
  let isVueDirectives = true
  const isBind = key.startsWith('bind')
  const isCatch = key.startsWith('catch')
  const isEvent = isBind || isCatch

  switch (key) {
    case WX_IF:
      key = VUE_IF
      break
    case WX_ELSE_IF:
      key = VUE_ELSE_IF
      break
    case WX_ELSE:
      key = VUE_ELSE
      break
    case WX_FOR:
    case WX_FOR_2:
      key = VUE_FOR
      break
    case WX_KEY:
      key = VUE_KEY
      value = value || forIndex
      isVueDirectives = false
      break
    default:
      isVueDirectives = false
      break
  }

  const { type, content } = parseContent(value ?? '', true)
  if (type === 'expression') {
    if (content?.startsWith('(') && content.endsWith(')')) {
      value = content.slice(1, content.length - 1)
    } else {
      value = content
    }

    if (key === VUE_FOR) {
      value = `(${forItem}, ${forIndex}) in ${value}`
    }

    if (key === 'data') {
      if (value.includes(':') || (value.includes('...') && value.includes(','))) {
        value = `{ ${value} }`
      }
    }

    if (!isVueDirectives && !isEvent) {
      key = ':' + key
    }
  }

  if (key === VUE_KEY) {
    // 微信小程序真的太多没在文档里的用法了
    if (value?.includes('this') || value?.includes('*item')) {
      value = forItem
    }

    if (value !== forItem || value !== forIndex) {
      value = `${forItem}.${value} || ${value} || ${forIndex}`
    }

    key = ':' + key
  }

  if (value === null && key !== VUE_ELSE) {
    value = 'true'
  }

  if (isBind) {
    key = key.replace(/^bind/g, '@')
  }

  if (isCatch) {
    key = key.replace(/^catch/g, '@') + '.stop'
  }

  if (isEvent && value === 'true') {
    value = 'emptyHandler'
  }

  if (key.startsWith(':')) {
    key = ':' + kebabCase(key.slice(1))
  } else {
    key = kebabCase(key)
  }

  return {
    key,
    value,
  }
}

function createElement (tagName: string): Element {
  return {
    tagName,
    type: NodeType.Element,
    children: [],
    attributes: [],
  }
}

export function generateVueFile (children: AllKindNode[]): string {
  const template = createElement('template')
  const container = createElement('block')
  container.children = children
  template.children = [container]

  return stringify([template])
}

interface VueImport {
  name?: string
  template?: string
  ast?: t.File
  wxs?: boolean
}

export function parseTemplate (element: Element, imports: VueImport[]) {
  const { attributes, children } = element
  const is = attributes.find((a) => a.key === 'is')
  const data = attributes.find((a) => a.key === 'data')
  const name = attributes.find((a) => a.key === 'name')

  if (name) {
    const value = name.value
    const { type } = parseContent(value ?? '')
    if (type === 'expression') {
      console.warn('template 的属性 name 只能是一个字符串，考虑更改以下源码逻辑：\n', stringify(element))
    }

    const componentName = buildTemplateName(name.key)
    const component = parseWXML('', stringify(children), imports)!
    imports.push({
      name: componentName,
      template: component.template,
    })
  } else if (is) {
    const value = is.value
    if (!value) {
      console.warn('template 的 `is` 属性不能为空', stringify(element))
    }

    const { type } = parseContent(value ?? '')
    if (type === 'expression') {
      console.warn('template 的属性 is 只能是一个字符串，考虑更改以下源码逻辑：\n', stringify(element))
    }

    element.tagName = buildTemplateName(value!, false)
    element.attributes = []
    if (data) {
      element.attributes.push({
        key: 'data',
        value: data.value,
      })
    }
  } else {
    throw new Error('template 标签必须指名 `is` 或 `name` 任意一个标签:\n' + stringify(element))
  }

  return element
}

export function parseModule (element: Element, dirPath: string, imports: VueImport[]) {
  const { attributes, tagName } = element
  const src = attributes.find((a) => a.key === 'src')

  if (!src) {
    throw new Error(`${tagName} 标签必须包含 \`src\` 属性` + '\n' + stringify(element))
  }

  let srcValue = src.value ?? ''
  const { type } = parseContent(srcValue)
  if (type === 'expression') {
    console.warn(tagName + '的属性 src 只能是一个字符串，考虑更改以下源码逻辑：\n', stringify(element))
  }

  if (srcValue.startsWith('/')) {
    const vpath = resolve(setting.rootPath, srcValue.substr(1))
    if (!fs.existsSync(vpath)) {
      throw new Error(`import/include 的 src 请填入相对路径再进行转换：src="${srcValue}"`)
    }
    let relativePath = relative(dirPath, vpath)
    relativePath = relativePath.replace(/\\/g, '/')
    if (relativePath.indexOf('.') !== 0) {
      srcValue = './' + relativePath
    }
    srcValue = relativePath
  }

  if (tagName === 'import') {
    const wxml = getWXMLsource(dirPath, srcValue, tagName)
    const mods = parseWXML(resolve(dirPath, srcValue), wxml, imports || [])?.imports
    imports.push(...(mods || []))
  } else {
    console.warn(`暂不支持 ${tagName} 标签的转换`, '考虑修改源码使用 import 替代\n' + stringify(element))
  }
}

function parseWXS (element: Element, imports: VueImport[]) {
  let moduleName: string | null = null
  let src: string | null = null
  const { attributes } = element

  for (const attr of attributes) {
    const { key, value } = attr
    if (key === 'module') {
      moduleName = value
    }

    if (key === 'src') {
      src = value
    }
  }

  if (!src) {
    const script = element.children.reduce((acc, node) => {
      if (node.type === NodeType.Text) {
        return acc + node.content
      }
      return acc
    }, '')

    src = './wxs__' + moduleName
    const ast = parseCode(script)
    traverse(ast, {
      CallExpression (path) {
        if (t.isIdentifier(path.node.callee, { name: 'getRegExp' })) {
          console.warn(codeFrameError(path.node, '请使用 JavaScript 标准正则表达式把这个 getRegExp 函数重构。'))
        }
      },
    })

    imports.push({
      ast,
      name: moduleName as string,
      wxs: true,
    } as any)
  }

  if (!moduleName || !src) {
    throw new Error('一个 WXS 需要同时存在两个属性：`wxs`, `src`')
  }
}
