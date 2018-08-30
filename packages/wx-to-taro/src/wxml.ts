import { parse } from 'himalaya'
import * as t from '@babel/types'
import { camelCase } from 'lodash'
import template from '@babel/template'
// const template = require('@babel/template')

const buildTemplate = (str: string) => template(str)().expression as t.Expression
const allCamelCase = (str: string) => str.charAt(0).toUpperCase() + camelCase(str.substr(1))

enum NodeType {
  Element = 'element',
  Comment = 'comment',
  Text = 'text'
}

interface Element {
  type: NodeType.Element
  tagName: string
  children: Node[]
  attributes: Attribute[]
}

interface Attribute {
  key: string
  value: string | null
}

interface Comment {
  type: NodeType.Comment
  content: string
}

interface Text {
  type: NodeType.Text
  content: string
}

type AllKindNode = Element | Comment | Text
type Node = Element | Text

export function parseWXML (wxml: string) {
  const nodes = (parse(wxml.trim()) as AllKindNode[]).filter(node => node.type !== NodeType.Comment) as Node[]
  return nodes.map(parseNode).find(node => t.isJSXElement(node))
}

function parseNode (node: Node, index: number, nodes: Node[]) {
  if (node.type === NodeType.Text) {
    return parseText(node)
  }
  return parseElement(node, nodes[index + 1])
}

function parseElement (element: Element, nextElement?: Node): t.JSXElement {
  const tagName = t.jsxIdentifier(
    allCamelCase(element.tagName)
  )
  return t.jsxElement(
    t.jsxOpeningElement(tagName, element.attributes.map(parseAttribute)),
    t.jsxClosingElement(tagName),
    element.children.map(parseNode),
    false
  )
}

function parseText (node: Text) {
  const { type, content } = parseContent(node.content)
  if (type === 'raw') {
    return t.jsxText(content)
  }
  return t.jsxExpressionContainer(buildTemplate(content))
}

const handlebarsRE = /\{\{((?:.|\n)+?)\}\}/g

function parseContent (content: string) {
  if (!handlebarsRE.test(content)) {
    return {
      type: 'raw',
      content
    }
  }
  const tokens: string[] = []
  let lastIndex = handlebarsRE.lastIndex = 0
  let match
  let index
  let tokenValue
  // tslint:disable-next-line
  while ((match = handlebarsRE.exec(content))) {
    index = match.index
    // push text token
    if (index > lastIndex) {
      tokenValue = content.slice(lastIndex, index)
      tokens.push(JSON.stringify(tokenValue))
    }
    // tag token
    const exp = match[1].trim()
    tokens.push(`(${exp})`)
    lastIndex = index + match[0].length
  }
  if (lastIndex < content.length) {
    tokenValue = content.slice(lastIndex)
    tokens.push(JSON.stringify(tokenValue))
  }
  return {
    type: 'expression',
    content: tokens.join('+')
  }
}


function parseAttribute (attr: Attribute) {
  const { key, value } = attr

  const jsxKey = handleAttrKey(key)
  let jsxValue: null | t.JSXExpressionContainer | t.StringLiteral = null

  if (value) {
    const { type, content } = parseContent(value)
    jsxValue = type === 'raw' ? t.stringLiteral(content) : t.jsxExpressionContainer(buildTemplate(content))
  }

  return t.jsxAttribute(t.jsxIdentifier(jsxKey), jsxValue)
}

function handleAttrKey (key: string) {
  if (key.startsWith('wx:') || key.startsWith('wx-')) {
    return key
  }

  let jsxKey = camelCase(key)

  switch (jsxKey) {
    case 'onClick':
      jsxKey = 'onClick'
      break
    case 'class':
      jsxKey = 'className'
      break
    default:
      jsxKey = jsxKey.replace(/^(bind|catch)/, 'on')
      if (jsxKey.startsWith('on') && jsxKey.length > 2) {
        jsxKey = jsxKey.substr(0, 2) + jsxKey[2].toUpperCase() + jsxKey.substr(3)
      }
      break
  }

  return jsxKey
}
