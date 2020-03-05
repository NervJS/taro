/* eslint-disable camelcase */
import { parse, stringify } from 'himalaya-wxml'
import { AllKindNode, Attribute, WX_IF, WX_ELSE_IF, WX_ELSE, WX_FOR, parseContent, WX_KEY, Element, WX_FOR_ITEM, WX_FOR_INDEX, NodeType } from './wxml'
import { usedComponents, errors } from './global'
import { getCacheWxml } from './cache'

const { prettyPrint } = require('html')

export function parseWXML (dirPath: string, wxml?: string, parseImport?: boolean) {
  const parseResult = getCacheWxml(dirPath)
  if (parseResult) {
    return parseResult
  }

  try {
    wxml = prettyPrint(wxml, {
      max_char: 0,
      indent_char: 0,
      unformatted: ['text', 'wxs']
    })
  } catch (error) {
    //
  }

  if (!parseImport) {
    errors.length = 0
    usedComponents.clear()
  }

  if (wxml == null) {
    return
  }

  return stringify(
    parse(wxml.trim()).map(node => parseNode(node))
  )
}

function parseElement (element: Element): Element {
  let forItem = 'item'
  let forIndex = 'index'

  return {
    tagName: element.tagName,
    type: element.type,
    children: element.children.map(child => parseNode(child)),
    attributes: element.attributes
      .filter(a => {
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
      }).map(a => {
        return parseAttribute(a, forItem, forIndex)
      })
  }
}

function parseNode (node: AllKindNode): AllKindNode {
  if (node.type === NodeType.Text) {
    return node
  } else if (node.type === NodeType.Comment) {
    return node
  }

  return parseElement(node)
}

const VUE_IF = 'v-if'
const VUE_ELSE_IF = 'v-else-if'
const VUE_FOR = 'v-for'
const VUE_ELSE = 'v-else'
const VUE_KEY = 'key'

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

    if (!isVueDirectives && !isEvent) {
      key = ':' + key
    }
  }

  if (key === VUE_KEY) {
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

  return {
    key,
    value
  }
}

function createElement (tagName: string): Element {
  return {
    tagName,
    type: NodeType.Element,
    children: [],
    attributes: []
  }
}

export function generateVueFile (children: AllKindNode[], jsCode: string): string {
  const template = createElement('template')
  const container = createElement('block')
  container.children = children
  template.children = [container]

  const script = createElement('script')
  script.children = [{
    type: NodeType.Text,
    content: jsCode
  }]

  return stringify([template, script])
}
