import { NodeType } from '../../dom/node_types'
import { unquote } from './utils'

import type { ParsedTaroElement } from './parser'

const LEFT_BRACKET = '{'
const RIGHT_BRACKET = '}'
const CLASS_SELECTOR = '.'
const ID_SELECTOR = '#'
const CHILD_COMBINATOR = '>'
const GENERAL_SIBLING_COMBINATOR = '~'
const ADJACENT_SIBLING_COMBINATOR = '+'

interface ISelector {
  isChild: boolean
  isGeneralSibling: boolean
  isAdjacentSibling: boolean
  tag: string | null
  id: string | null
  class: string[]
  attrs: {
    all: boolean
    key: string
    value?: string | null
  }[]
}

interface IStyle {
  content: string
  selectorList: ISelector[]
}

export default class StyleTagParser {
  styles: IStyle[] = []

  extractStyle (src: string) {
    const REG_STYLE = /<style\s?[^>]*>((.|\n|\s)+?)<\/style>/g
    let html = src
    // let html = src.replace(/\n/g, '')

    html = html.replace(REG_STYLE, (_, $1: string) => {
      const style = $1.trim()
      this.stringToSelector(style)
      return ''
    })

    return html.trim()
  }

  stringToSelector (style: string) {
    let lb = style.indexOf(LEFT_BRACKET)

    while (lb > -1) {
      const rb = style.indexOf(RIGHT_BRACKET)
      const selectors = style.slice(0, lb).trim()

      let content = style.slice(lb + 1, rb)
      content = content.replace(/:(.*);/g, function (_, $1) {
        const t = $1.trim().replace(/ +/g, '+++')
        return `:${t};`
      })
      content = content.replace(/ /g, '')
      content = content.replace(/\+\+\+/g, ' ')

      if (!(/;$/.test(content))) {
        content += ';'
      }
      selectors.split(',').forEach(src => {
        const selectorList = this.parseSelector(src)
        this.styles.push({
          content,
          selectorList
        })
      })
      style = style.slice(rb + 1)
      lb = style.indexOf(LEFT_BRACKET)
    }
    // console.log('res this.styles: ', this.styles)
  }

  parseSelector (src: string) {
    const list = src
      .trim()
      .replace(/ *([>~+]) */g, ' $1')
      .replace(/ +/g, ' ')
      .replace(/\[\s*([^[\]=\s]+)\s*=\s*([^[\]=\s]+)\s*\]/g, '[$1=$2]')
      .split(' ')
    const selectors = list.map(item => {
      const firstChar = item.charAt(0)
      const selector: ISelector = {
        isChild: firstChar === CHILD_COMBINATOR,
        isGeneralSibling: firstChar === GENERAL_SIBLING_COMBINATOR,
        isAdjacentSibling: firstChar === ADJACENT_SIBLING_COMBINATOR,
        tag: null,
        id: null,
        class: [],
        attrs: []
      }

      item = item.replace(/^[>~+]/, '')

      // 属性选择器
      item = item.replace(/\[(.+?)\]/g, function (_, $1: string) {
        const [key, value] = $1.split('=')
        const all = $1.indexOf('=') === -1

        const attr = {
          all,
          key,
          value: all ? null : value
        }
        selector.attrs.push(attr)
        return ''
      })

      item = item.replace(/([.#][A-Za-z0-9-_]+)/g, function (_, $1: string) {
        if ($1[0] === ID_SELECTOR) {
          // id 选择器
          selector.id = $1.substr(1)
        } else if ($1[0] === CLASS_SELECTOR) {
          // class 选择器
          selector.class.push($1.substr(1))
        }
        return ''
      })

      // 标签选择器
      if (item !== '') {
        selector.tag = item
      }

      return selector
    })
    return selectors
  }

  matchStyle (tagName: string, el: ParsedTaroElement, list: number[]): string {
    const res = sortStyles(this.styles).reduce((str, { content, selectorList }, i) => {
      let idx = list[i]
      let selector = selectorList[idx]
      const nextSelector = selectorList[idx + 1]

      if (nextSelector?.isGeneralSibling || nextSelector?.isAdjacentSibling) {
        selector = nextSelector
        idx += 1
        list[i] += 1
      }

      let isMatch = this.matchCurrent(tagName, el, selector)

      if (isMatch && selector.isGeneralSibling) {
        let prev: ParsedTaroElement | null = getPreviousElement(el)
        while (prev) {
          if (prev.h5tagName && this.matchCurrent(prev.h5tagName, prev, selectorList[idx - 1])) {
            isMatch = true
            break
          }
          prev = getPreviousElement(prev)
          isMatch = false
        }
      }
      if (isMatch && selector.isAdjacentSibling) {
        const prev: ParsedTaroElement | null = getPreviousElement(el)
        if (!prev || !prev.h5tagName) {
          isMatch = false
        } else {
          const isSiblingMatch = this.matchCurrent(prev.h5tagName, prev, selectorList[idx - 1])
          if (!isSiblingMatch) {
            isMatch = false
          }
        }
      }

      if (isMatch) {
        if (idx === selectorList.length - 1) {
          return str + content
        } else if (idx < selectorList.length - 1) {
          list[i] += 1
        }
      } else {
        // 直接子代组合器: >
        if (selector.isChild && idx > 0) {
          list[i] -= 1
          if (this.matchCurrent(tagName, el, selectorList[list[i]])) {
            list[i] += 1
          }
        }
      }

      return str
    }, '')
    return res
  }

  matchCurrent (tagName: string, el: ParsedTaroElement, selector: ISelector): boolean {
    // 标签选择器
    if (selector.tag && selector.tag !== tagName) return false

    // id 选择器
    if (selector.id && selector.id !== el.id) return false

    // class 选择器
    if (selector.class.length) {
      const classList = el.className.split(' ')
      for (let i = 0; i < selector.class.length; i++) {
        const cls = selector.class[i]
        if (classList.indexOf(cls) === -1) {
          return false
        }
      }
    }

    // 属性选择器
    if (selector.attrs.length) {
      for (let i = 0; i < selector.attrs.length; i++) {
        const { all, key, value } = selector.attrs[i]
        if (all && !el.hasAttribute(key)) {
          return false
        } else {
          const attr = el.getAttribute(key)
          if (attr !== unquote(value || '')) {
            return false
          }
        }
      }
    }

    return true
  }
}

function getPreviousElement (el: ParsedTaroElement): ParsedTaroElement | null {
  const parent = el.parentElement
  if (!parent) return null

  const prev = el.previousSibling as ParsedTaroElement
  if (!prev) return null

  if (prev.nodeType === NodeType.ELEMENT_NODE) {
    return prev
  } else {
    return getPreviousElement(prev)
  }
}

// 根据 css selector 权重排序: 权重大的靠后
// @WARN 不考虑伪类
// https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Cascade_and_inheritance#specificity_2
function sortStyles (styles: IStyle[]) {
  return styles.sort((s1, s2) => {
    const hundreds1 = getHundredsWeight(s1.selectorList)
    const hundreds2 = getHundredsWeight(s2.selectorList)

    if (hundreds1 !== hundreds2) return hundreds1 - hundreds2

    const tens1 = getTensWeight(s1.selectorList)
    const tens2 = getTensWeight(s2.selectorList)

    if (tens1 !== tens2) return tens1 - tens2

    const ones1 = getOnesWeight(s1.selectorList)
    const ones2 = getOnesWeight(s2.selectorList)

    return ones1 - ones2
  })
}

function getHundredsWeight (selectors: ISelector[]) {
  return selectors.reduce((pre, cur) => pre + (cur.id ? 1 : 0), 0)
}

function getTensWeight (selectors: ISelector[]) {
  return selectors.reduce((pre, cur) => pre + cur.class.length + cur.attrs.length, 0)
}

function getOnesWeight (selectors: ISelector[]) {
  return selectors.reduce((pre, cur) => pre + (cur.tag ? 1 : 0), 0)
}
