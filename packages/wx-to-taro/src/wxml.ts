import { parse } from 'himalaya'
import * as t from '@babel/types'
const template = require('@babel/template')

const buildTemplate = (str: string) => template(str)() as t.Expression

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

interface List<T extends t.JSXElement | t.JSXText> {
  prev: T | null,
  value: T,
  next: T | null
}

function parseWXML (wxml: string) {
  const nodes = parse(wxml)
    .filter(node => node.type !== NodeType.Comment) as Node[]
}

function parseNode (node: Node) {
  return node.type === NodeType.Element ? parseElement(node) : parseText(node)
}

function parseElement (element: Element): t.JSXElement {
  return
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
  const tokens = []
  let lastIndex = handlebarsRE.lastIndex = 0
  let match, index, tokenValue
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

  let jsxValue: null | t.JSXExpressionContainer | t.StringLiteral = null
  const { type, content } = parseContent(value)
  if (value) {
    jsxValue = type === 'raw' ? t.stringLiteral(content) : t.jsxExpressionContainer(buildTemplate(content))
  }

  return t.jsxAttribute(t.jsxIdentifier(key), jsxValue)
}
