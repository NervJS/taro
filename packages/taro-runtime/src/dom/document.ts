import { controlledComponent, isUndefined, toCamelCase } from '@tarojs/shared'

import {
  A,
  COMMENT,
  DOCUMENT_ELEMENT_NAME,
  ROOT_STR
} from '../constants'
import { TaroElement } from '../dom/element'
import { createEvent } from '../dom/event'
import { eventSource } from '../dom/event-source'
import { FormElement } from '../dom/form'
import { NodeType } from '../dom/node_types'
import { TaroRootElement } from '../dom/root'
import { TaroText } from '../dom/text'
import env from '../env'
import { AnchorElement } from './anchor-element'
import { TransferElement } from './transfer'

export class TaroDocument extends TaroElement {
  public documentElement: TaroElement
  public head: TaroElement
  public body: TaroElement
  public createEvent = createEvent

  public constructor () {
    super()
    this.nodeType = NodeType.DOCUMENT_NODE
    this.nodeName = DOCUMENT_ELEMENT_NAME
  }

  public createElement (type: string): TaroElement | TaroRootElement | FormElement {
    const nodeName = type.toLowerCase()

    let element: TaroElement
    switch (true) {
      case nodeName === ROOT_STR:
        element = new TaroRootElement()
        return element
      case controlledComponent.has(nodeName):
        element = new FormElement()
        break
      case nodeName === A:
        element = new AnchorElement()
        break
      case nodeName === 'page-meta':
      case nodeName === 'navigation-bar':
        element = new TransferElement(toCamelCase(nodeName))
        break
      default:
        element = new TaroElement()
        break
    }

    element.nodeName = nodeName
    element.tagName = type.toUpperCase()

    return element
  }

  // an ugly fake createElementNS to deal with @vue/runtime-dom's
  // support mounting app to svg container since vue@3.0.8
  public createElementNS (_svgNS: string, type: string): TaroElement | TaroRootElement | FormElement {
    return this.createElement(type)
  }

  public createTextNode (text: string): TaroText {
    return new TaroText(text)
  }

  public getElementById<T extends TaroElement> (id: string | undefined | null): T | null {
    const el = eventSource.get(id)
    return isUndefined(el) ? null : el as T
  }

  public querySelector<T extends TaroElement> (query: string): T | null {
    // 为了 Vue3 的乞丐版实现
    if (/^#/.test(query)) {
      return this.getElementById<T>(query.slice(1))
    }
    return null
  }

  public querySelectorAll () {
    // fake hack
    return []
  }

  // @TODO: @PERF: 在 hydrate 移除掉空的 node
  public createComment (): TaroText {
    const textnode = new TaroText('')
    textnode.nodeName = COMMENT
    return textnode
  }

  get defaultView () {
    return env.window
  }
}
