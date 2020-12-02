import { TaroText } from './dom/text'
import { Text, Element } from './dom/html/parser'
import { TaroElement } from './dom/element'
import { Reconciler, CurrentReconciler } from './reconciler'

export interface Options {
  prerender: boolean
  debug: boolean
  html: {
    skipElements: Set<string>
    voidElements: Set<string>
    closingElements: Set<string>
    transformText?: (taroText: TaroText, text: Text) => TaroText
    transformElement?: (taroElement: TaroElement, element: Element) => TaroElement
    renderHTMLTag: boolean
  },
  reconciler: (reconciler: Reconciler<any>) => void
}

export const options: Options = {
  prerender: true,
  debug: false,
  // html 只影响 Element#innerHTML API
  html: {
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
  },
  reconciler<T> (reconciler: Reconciler<T>) {
    Object.assign(CurrentReconciler, reconciler)
  }
}
