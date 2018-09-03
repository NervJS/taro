import { parse } from 'himalaya'
import * as t from 'babel-types'
import { camelCase, cloneDeep } from 'lodash'
import traverse, { NodePath } from 'babel-traverse'
import * as template from 'babel-template'
import generate from 'babel-generator'

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
interface Condition {
  condition: string,
  path: NodePath<t.JSXElement>,
  tester: t.JSXExpressionContainer
}

type Tester = t.StringLiteral | t.JSXElement | t.JSXExpressionContainer | null

const WX_IF = 'wx:if'
const WX_ELSE = 'wx:else'
const WX_ELSE_IF = 'wx:elif'

export function parseWXML (wxml: string) {
  const nodes = (parse(wxml.trim()) as AllKindNode[]).filter(removEmptyText).filter(node => node.type !== NodeType.Comment) as Node[]
  const ast = t.file(t.program([t.expressionStatement(nodes.map(parseNode).find(node => t.isJSXElement(node)) as t.Expression)], []))
  traverse(ast, {
    JSXAttribute (path) {
      const name = path.node.name as t.JSXIdentifier
      const jsx = path.findParent(p => p.isJSXElement()) as NodePath<t.JSXElement>
      const tester = cloneDeep(path.get('value').node)
      const conditions: Condition[] = []
      if (name.name === WX_IF) {
        const siblings = jsx.getAllNextSiblings()
        conditions.push({
          condition: WX_IF,
          path: jsx,
          tester: tester as t.JSXExpressionContainer
        })
        path.remove()
        for (const [ index, sibling ] of siblings.entries()) {
          const next = siblings[index + 1]
          const currMatches = findWXIfProps(sibling)
          const nextMatches = findWXIfProps(next)
          if (currMatches === null) {
            break
          }
          conditions.push({
            condition: currMatches.reg.input as string,
            path: sibling as any,
            tester: currMatches.tester as t.JSXExpressionContainer
          })
          if (nextMatches === null) {
            break
          }
        }
      }
      handleConditions(conditions)
    }
  })

  return ast
}

function handleConditions (conditions: Condition[]) {
  if (conditions.length === 1) {
    const ct = conditions[0]
    ct.path.replaceWith(
      t.jSXExpressionContainer(
        t.logicalExpression('&&', ct.tester.expression, cloneDeep(ct.path.node))
      )
    )
  }
  if (conditions.length > 1) {
    const lastLength = conditions.length - 1
    const lastCon = conditions[lastLength]
    let lastAlternate: t.Expression = cloneDeep(lastCon.path.node)
    if (lastCon.condition === WX_ELSE_IF) {
      lastAlternate = t.logicalExpression('&&', lastCon.tester.expression, lastAlternate)
    }
    const node = conditions.slice(0, lastLength).reduceRight((acc: t.Expression, condition) => {
      return t.conditionalExpression(condition.tester.expression, cloneDeep(condition.path.node), acc)
    }, lastAlternate)
    conditions[0].path.replaceWith(t.jSXExpressionContainer(node))
    conditions.slice(1).forEach(c => c.path.remove())
  }
}

function findWXIfProps (jsx: NodePath<t.Node>): { reg: RegExpMatchArray, tester: Tester } | null {
  let matches: { reg: RegExpMatchArray, tester: Tester } | null = null
  jsx && jsx.isJSXElement() && jsx
    .get('openingElement')
    .get('attributes')
    .some(path => {
      const attr = path.node
      if (t.isJSXIdentifier(attr.name)) {
        const name = attr.name.name
        if (name === WX_IF) {
          return true
        }
        const match = name.match(/wx:else|wx:elif/)
        if (match) {
          path.remove()
          matches = {
            reg: match,
            tester: attr.value
          }
          return true
        }
      }
      return false
    })

  return matches
}

function parseNode (node: Node) {
  if (node.type === NodeType.Text) {
    return parseText(node)
  }
  return parseElement(node)
}

function parseElement (element: Element): t.JSXElement {
  const tagName = t.jSXIdentifier(
    allCamelCase(element.tagName)
  )
  return t.jSXElement(
    t.jSXOpeningElement(tagName, element.attributes.map(parseAttribute)),
    t.jSXClosingElement(tagName),
    element.children.filter(removEmptyText).map(parseNode),
    false
  )
}

function removEmptyText (node: Node) {
  if (node.type === NodeType.Text && node.content.trim().length === 0) {
    return false
  }
  return true
}

function parseText (node: Text) {
  const { type, content } = parseContent(node.content)
  if (type === 'raw') {
    return t.jSXText(content)
  }
  return t.jSXExpressionContainer(buildTemplate(content))
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

  let jsxValue: null | t.JSXExpressionContainer | t.StringLiteral = null

  if (value) {
    const { type, content } = parseContent(value)
    jsxValue = type === 'raw' ? t.stringLiteral(content) : t.jSXExpressionContainer(buildTemplate(content))
  }

  const jsxKey = handleAttrKey(key)
  return t.jSXAttribute(t.jSXIdentifier(jsxKey), jsxValue)
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
