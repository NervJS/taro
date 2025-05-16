import type { TaroElement } from '../dom/element'
import type { TaroText } from '../dom/text'
import type { Element, Text } from '../dom-external/inner-html/parser'

export interface Options {
  prerender: boolean
  debug: boolean
  perfConfig: {
    /** setData数据路径的最大长度
     * @default 10
     */
    maxDataPathLength: number
    /** 单次setData最大数据量
     * @default 256
     */
    maxDataSize: number
    /** 每秒setData最多次数
     * @default 3
     */
    maxSetDataFrequency: number
  }
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
