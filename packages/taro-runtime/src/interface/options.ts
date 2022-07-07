import type { TaroElement } from '../dom/element'
import type { TaroText } from '../dom/text'
import type { Element, Text } from '../dom-external/inner-html/parser'

export interface Options {
  prerender: boolean
  debug: boolean
  html?: {
    skipElements: Set<string>
    voidElements: Set<string>
    closingElements: Set<string>
    transformText?: (taroText: TaroText, text: Text) => TaroText
    transformElement?: (taroElement: TaroElement, element: Element) => TaroElement
    renderHTMLTag: boolean
  }
  miniGlobal?: any
}
