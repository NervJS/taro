import { document, TaroElement } from '@tarojs/runtime'

import parseHTML, { TTreeNode } from './HarmonyHTMLParser'

// 构建harmony的dom树
function buildDomTree(dom: TTreeNode) {
  const { name, attributes, children } = dom
  let tagName = ''
  // TODO: 仍需补充更多节点解析和它默认样式行为的转换，比如h1\h2
  switch (name) {
    case 'root': tagName = 'view'; break
    case 'img': tagName = 'image'; break
    case 'div': tagName = 'view'; break
    case 'p': tagName = 'text'; break
    case 'span': tagName = 'text'; break
  }
  if (!tagName) return null

  const ele = document.createElement(tagName)
  attributes && Object.keys(attributes).forEach(key => {
    if (key === 'style') {
      ele.style.cssText = attributes[key]
    } else {
      ele.setAttribute(key, attributes[key])
    }
  })

  if (children && children.length) {
    children.forEach(child => {
      let childEle
      if (child.type === 'element') {
        childEle = buildDomTree(child)
      } else if (child.type === 'text') {
        childEle = document.createTextNode(child.content)
      }
      childEle && ele.appendChild(childEle)
    })
  }
  return ele
}

// 净化常见错别标签如：<br> <hr>
function fixBrokenTags(htmlString) {
  const selfClosingTags = ['br', 'hr']
  // 匹配容易忘记闭合的标签
  const pattern = new RegExp(`<(${selfClosingTags.join('|')})\\b[^>]*>`, 'gi')
  // 修复匹配到的标签
  const fixedHTML = htmlString.replace(pattern, '<$1/>')
  return fixedHTML
}

export default function htmlParser(htmlString: string): TaroElement {
  htmlString = fixBrokenTags(htmlString)
  const trees = parseHTML(`<root>${htmlString}</root>`)
  return buildDomTree(trees[0])
}
