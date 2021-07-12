import { parser } from './parser'
import { options } from '../../options'

import type { TaroNode } from '../../dom/node'
import type { TaroDocument } from '../../dom/document'

options.html = {
  skipElements: new Set(['style', 'script']),
  voidElements: new Set([
    '!doctype', 'area', 'base', 'br', 'col', 'command',
    'embed', 'hr', 'img', 'input', 'keygen', 'link',
    'meta', 'param', 'source', 'track', 'wbr'
  ]),
  closingElements: new Set([
    'html', 'head', 'body', 'p', 'dt', 'dd', 'li', 'option',
    'thead', 'th', 'tbody', 'tr', 'td', 'tfoot', 'colgroup'
  ]),
  renderHTMLTag: false
}

export function setInnerHTML (element: TaroNode, html: string, getDoc: () => TaroDocument) {
  element.childNodes.forEach(node => {
    element.removeChild(node)
  })
  const children = parser(html, getDoc())

  for (let i = 0; i < children.length; i++) {
    element.appendChild(children[i])
  }
}
