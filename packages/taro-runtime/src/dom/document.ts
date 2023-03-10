/* 
 *  MIT License
 *  
 *  Copyright (c) 2018 O2Team、58.com、other contributors
 *  
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *  
 *  The above copyright notice and this permission notice shall be included in all
 *  copies or substantial portions of the Software.
 *  
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 */

import { controlledComponent, isUndefined } from '@tarojs/shared'

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
