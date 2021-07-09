import { parser } from '../dom-external/inner-html/parser'
import { GetDoc } from '../interface'

export type IPosition = 'beforebegin' | 'afterbegin' | 'beforeend' | 'afterend'

/**
 * An implementation of `Element.insertAdjacentHTML()`
 * to support Vue 3 with a version of or greater than `vue@3.1.2`
 */
export function insertAdjacentHTMLImpl (
  position: IPosition,
  html: string,
  getDoc: GetDoc
) {
  const parsedNodes = parser(html, getDoc())

  for (let i = 0; i < parsedNodes.length; i++) {
    const n = parsedNodes[i]

    switch (position) {
      case 'beforebegin':
        this.parentNode?.insertBefore(n, this)
        break
      case 'afterbegin':
        if (this.hasChildNodes()) {
          this.childNodes[0].insertBefore(n)
        } else {
          this.appendChild(n)
        }
        break
      case 'beforeend':
        this.appendChild(n)
        break
      case 'afterend':
        this.parentNode?.appendChild(n)
        break
    }
  }
}
