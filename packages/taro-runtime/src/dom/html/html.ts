import { parser } from './parser'
import { TaroNode } from '../node'

export function setInnerHTML (element: TaroNode, html: string) {
  element.textContent = ''
  const children = parser(html)

  for (let i = 0; i < children.length; i++) {
    element.appendChild(children[i])
  }
}
