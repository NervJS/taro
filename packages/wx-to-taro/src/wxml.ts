import { parse } from 'himalaya'
import * as t from '@babel/types'

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

interface List<T> {
  prev?: T,
  value: T,
  next?: T
}

function parseWXML (wxml: string) {
  const nodes = (parse(wxml) as AllKindNode[]).filter(node => node.type !== NodeType.Comment) as Node[]
}

function parseNode (node: Node) {
  return node.type === NodeType.Element ? parseElement(node) : parseText(node)
}

function parseElement (element: Element): t.JSXElement {
  // return t.jsxElement()
}

function parseText (text: Text): t.JSXText {
  return t.jsxText(text.content)
}
