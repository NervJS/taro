import { convertNumber2VP } from '@tarojs/runtime'
import { isNumber, isUndefined } from '@tarojs/shared'

import type { RichTextProps } from '@tarojs/components/types/RichText'
import type { TaroRichTextElement } from '@tarojs/runtime'

export function getSingleSelector(range, rangeKey): any[] {
  return range.map((data) => data[rangeKey])
}

export function getMultiSelector(ctx, range, rangeKey, value) {
  return range.map((arr, arrIndex) => arr.map((data, i) => {
    const columnValue = value[arrIndex]
    if (columnValue === data) {
      ctx.showSelector[arrIndex] = i
    }
    if (rangeKey && typeof range[0][0] === 'object') {
      return data[rangeKey]
    }
    return data
  }))
}

export function getUnit (val: string | number): string {
  if (isNumber(val) || /\d+px$/.test(val)) {
    return convertNumber2VP(parseFloat(val as string))
  } else if (/\d+(vp)$/.test(val)) {
    return val
  }
  return val
}

export function generateText (node: TaroRichTextElement): string {
  return parseHtmlNode(node._attrs.nodes || '')
}

// 将nodeTree转换成harmony需要的string结构
function nodeToHtml(node: RichTextProps.Text | RichTextProps.HTMLElement): string {
  if (node.type === 'text') {
    return node.text
  }
  if (node.attrs) {
    const attributes = Object.entries(node.attrs)
      .map((item: [string, string]) => `${item[0]}="${item[1]}"`)
      .join(' ')
    const childrenHtml: string = typeof node.children === 'string' ? node.children : (node.children || []).map((child: RichTextProps.Text | RichTextProps.HTMLElement) => nodeToHtml(child)).join('')
    return `<${node.name}${attributes ? ' ' + attributes : ''}>${childrenHtml}</${node.name}>`
  }
  return ''
}

function parseHtmlNode (nodes: Array<RichTextProps.Text | RichTextProps.HTMLElement> | string) {
  return typeof nodes === 'string' ? nodes : `<div>${nodes.map(node => nodeToHtml(node)).join('')}</div>`
}

// 背景偏移算法：https://developer.mozilla.org/zh-CN/docs/Web/CSS/background-position
export function computeBackgroundPosition(style) {
  let offsetX = style.backgroundPosition?.x || 0
  let offsetY = style.backgroundPosition?.y || 0
  if (style.backgroundSize && typeof style.backgroundSize !== 'number') {
    if (!isUndefined(style.backgroundSize.width) && style.width) {
      if (typeof style.backgroundPosition.x === 'string' && style.backgroundPosition.x.indexOf('%') > 0) {
        // (container width - image width) * (position x%) = (x offset value)
        const width = parseFloat(style.width)
        const bgWidth = parseFloat(style.backgroundSize.width)
        const bgOffsetX = parseFloat(style.backgroundPosition.x)
        offsetX = Number((width - bgWidth) * (bgOffsetX) / 100) || 0
      }
    }
    if (!isUndefined(style.backgroundSize.height) && style.height) {
      if (typeof style.backgroundPosition.y === 'string' && style.backgroundPosition.y.indexOf('%') > 0) {
        // (container height - image height) * (position y%) = (y offset value)
        const height = parseFloat(style.height)
        const bgHeight = parseFloat(style.backgroundSize.height)
        const bgOffsetY = parseFloat(style.backgroundPosition.y)
        offsetY = Number((height - bgHeight) * (bgOffsetY) / 100) || 0
      }
    }
  }

  return { offsetX, offsetY }
}

export function convertVp2Px(val: string | number) {
  const vp = parseFloat(`${val}`)
  return vp2px(vp)
}
