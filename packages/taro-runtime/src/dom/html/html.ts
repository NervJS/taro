import { parser } from './parser'
import { TaroNode } from '../node'
import { NodeType } from '../node_types'
import { isText, escapeForHtmlGeneration, toDash } from '../../utils'
import { options } from '../../options'

export function setInnerHTML (element: TaroNode, html: string) {
  element.childNodes.forEach(node => {
    element.removeChild(node)
  })
  const children = parser(html)

  for (let i = 0; i < children.length; i++) {
    element.appendChild(children[i])
  }
}

export function getInnerHTML (element: TaroNode): string {
  return element.childNodes.map(child => generateHtml(child)).join('')
}

function generateHtml (node: TaroNode | any): string {
  if (isText(node)) {
    return node.textContent
  } else if (node.nodeType === NodeType.ELEMENT_NODE) {
    // 元素
    const tagName = node.nodeName.toLowerCase()
    let html = `<${tagName}`

    // 属性
    if (node.behavior) html += ` behavior="${escapeForHtmlGeneration(node.behavior)}"`
    if (node.id) html += ` id="${escapeForHtmlGeneration(node.id)}"`
    if (node.className) html += ` class="${escapeForHtmlGeneration(node.className)}"`

    const styleText = node.style.cssText
    if (styleText) html += ` style="${escapeForHtmlGeneration(styleText)}"`

    const src = node.src
    if (src) html += ` src=${escapeForHtmlGeneration(src)}`

    const dataset = node.dataset
    Object.keys(dataset).forEach(name => {
      html += ` data-${toDash(name)}="${escapeForHtmlGeneration(dataset[name])}"`
    })

    // 自定义属性处理
    // html = node.$$dealWithAttrsForGenerateHtml(html)

    if (options.html.voidElements.has(node.nodeName.toLowerCase())) {
      // 空标签
      return `${html} />`
    } else {
      const childrenHtml = node.childNodes.map((child: TaroNode) => generateHtml(child)).join('')
      return `${html}>${childrenHtml}</${tagName}>`
    }
  }
  return ''
}
