import { Scaner, Token } from './scaner'
import { options } from '../../options'
import { document } from '../../bom/document'
import { specialMiniElements, isMiniElements, isBlockElements, isInlineElements } from './tags'
import { isFunction } from '@tarojs/shared'

interface State {
  tokens: Token[]
  cursor: number
  stack: Element[]
}

const closingTagAncestorBreakers = {
  li: ['ul', 'ol', 'menu'],
  dt: ['dl'],
  dd: ['dl'],
  tbody: ['table'],
  thead: ['table'],
  tfoot: ['table'],
  tr: ['table'],
  td: ['table']
}

interface Node {
  type: string;
}

interface Comment extends Node {
  type: 'comment'
  content: string
}

export interface Text extends Node {
  type: 'text'
  content: string
}

export interface Element extends Node {
  type: 'element'
  tagName: string
  children: ChildNode[]
  attributes: string[]
}

type ChildNode = Comment | Text | Element

function hasTerminalParent (tagName: string, stack: Element[]) {
  const tagParents: undefined | string[] = closingTagAncestorBreakers[tagName]
  if (tagParents) {
    let currentIndex = stack.length - 1
    while (currentIndex >= 0) {
      const parentTagName = stack[currentIndex].tagName
      if (parentTagName === tagName) {
        break
      }
      if (tagParents && tagParents.includes(parentTagName!)) {
        return true
      }
      currentIndex--
    }
  }
  return false
}

function unquote (str: string) {
  const car = str.charAt(0)
  const end = str.length - 1
  const isQuoteStart = car === '"' || car === "'"
  if (isQuoteStart && car === str.charAt(end)) {
    return str.slice(1, end)
  }
  return str
}

function getTagName (tag: string) {
  if (options.html.renderHTMLTag) {
    return tag
  }

  if (specialMiniElements[tag]) {
    return specialMiniElements[tag]
  } else if (isMiniElements(tag)) {
    return tag
  } else if (isBlockElements(tag)) {
    return 'view'
  } else if (isInlineElements(tag)) {
    return 'text'
  }

  return 'view'
}

function splitEqual (str: string) {
  const sep = '='
  const idx = str.indexOf(sep)
  if (idx === -1) return [str]
  return [str.slice(0, idx), str.slice(idx + sep.length)]
}

function format (children: ChildNode[]) {
  return children.filter(child => {
    if (child.type === 'comment') {
      return false
    } else if (child.type === 'text') {
      return child.content !== ''
    }
    return true
  }).map((child: Text | Element) => {
    if (child.type === 'text') {
      const text = document.createTextNode(child.content)
      if (isFunction(options.html.transformText)) {
        return options.html.transformText(text, child)
      }
      return text
    }

    const el = document.createElement(getTagName(child.tagName))
    if (!options.html.renderHTMLTag) {
      el.className = child.tagName
    }
    for (let i = 0; i < child.attributes.length; i++) {
      const attr = child.attributes[i]
      const [key, value] = splitEqual(attr)
      if (key === 'class') {
        el.className += ' ' + unquote(value)
      } else if (key[0] === 'o' && key[1] === 'n') {
        continue
      } else {
        el.setAttribute(key, value == null ? true : unquote(value))
      }
    }

    const ch = format(child.children)
    for (let i = 0; i < ch.length; i++) {
      el.appendChild(ch[i])
    }

    if (isFunction(options.html.transformElement)) {
      return options.html.transformElement(el, child)
    }

    return el
  })
}

export function parser (html: string) {
  const tokens = new Scaner(html).scan()

  const root: Element = { tagName: '', children: [], type: 'element', attributes: [] }

  const state = { tokens, options, cursor: 0, stack: [root] }
  parse(state)

  return format(root.children)
}

function parse (state: State) {
  const { tokens, stack } = state
  let { cursor } = state

  const len = tokens.length

  let nodes = stack[stack.length - 1].children

  while (cursor < len) {
    const token = tokens[cursor]
    if (token.type !== 'tag-start') {
      // comment or text
      nodes.push(token as ChildNode)
      cursor++
      continue
    }

    const tagToken = tokens[++cursor]
    cursor++
    const tagName = tagToken.content!.toLowerCase()
    if (token.close) {
      let index = stack.length
      let shouldRewind = false
      while (--index > -1) {
        if (stack[index].tagName === tagName) {
          shouldRewind = true
          break
        }
      }
      while (cursor < len) {
        const endToken = tokens[cursor]
        if (endToken.type !== 'tag-end') break
        cursor++
      }
      if (shouldRewind) {
        stack.splice(index)
        break
      } else {
        continue
      }
    }

    const isClosingTag = options.html.closingElements.has(tagName)
    let shouldRewindToAutoClose = isClosingTag
    if (shouldRewindToAutoClose) {
      shouldRewindToAutoClose = !hasTerminalParent(tagName, stack)
    }

    if (shouldRewindToAutoClose) {
      let currentIndex = stack.length - 1
      while (currentIndex > 0) {
        if (tagName === stack[currentIndex].tagName) {
          stack.splice(currentIndex)
          const previousIndex = currentIndex - 1
          nodes = stack[previousIndex].children
          break
        }
        currentIndex = currentIndex - 1
      }
    }

    const attributes: string[] = []
    let attrToken: Token
    while (cursor < len) {
      attrToken = tokens[cursor]
      if (attrToken.type === 'tag-end') break
      attributes.push(attrToken.content!)
      cursor++
    }

    cursor++
    const children: Element[] = []
    const element: Element = {
      type: 'element',
      tagName: tagToken.content!,
      attributes,
      children
    }
    nodes.push(element)

    const hasChildren = !(attrToken!.close || options.html.voidElements.has(tagName))
    if (hasChildren) {
      stack.push({ tagName, children } as any)
      const innerState: State = { tokens, cursor, stack }
      parse(innerState)
      cursor = innerState.cursor
    }
  }

  state.cursor = cursor
}
