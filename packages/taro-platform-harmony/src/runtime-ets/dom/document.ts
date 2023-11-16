import { eventSource } from '@tarojs/runtime/dist/runtime.esm'
import { isUndefined } from '@tarojs/shared'

import { TaroComment } from './comment'
import { createCSSStyleDeclaration } from './cssStyleDeclaration'
import { TaroButtonElement, TaroElement, TaroIgnoreElement, TaroImageElement, TaroTextElement, TaroVideoElement, TaroViewElement } from './element'
import { NodeType, TaroNode } from './node'
import { TaroTextNode } from './text'

import type { Window } from '../bom/window'

class TaroDocument extends TaroNode {
  public documentElement: TaroElement
  public head: TaroElement
  public body: TaroElement
  public cookie = ''
  private _win: Window

  constructor(window: Window) {
    super('#document', NodeType.DOCUMENT_NODE)
    this._win = window
    window._doc = this
  }

  get defaultView (): Window {
    return this._win
  }

  public createElement (tagName: string): TaroElement {
    let node: TaroElement

    switch (tagName) {
      case 'view':
        node = new TaroViewElement()
        break
      case 'text':
        node = new TaroTextElement()
        break
      case 'image':
        node = new TaroImageElement()
        break
      case 'button':
        node = new TaroButtonElement()
        break
      case 'video':
        node = new TaroVideoElement()
        break
      case 'ignore':
        node = new TaroIgnoreElement()
        break
      default:
        node = new TaroElement(tagName)
    }
    node._doc = this
    // Hack: 此 Proxy 不能放在 Element 类内定义，否则响应式更新会失效
    node._style = createCSSStyleDeclaration(node)
    return node
  }

  public createTextNode (value: string): TaroTextNode {
    const node = new TaroTextNode(value)
    node._doc = this
    return node
  }

  public createComment (data: string): TaroComment {
    return new TaroComment(data)
  }


  public getElementById<T extends TaroElement> (id: string | undefined | null): T | null {
    const el = eventSource.get(id)
    return isUndefined(el) ? null : el as unknown as T
  }

  // @Todo
  // public getElementsByClassName (names: string): TaroElement[]
  // public querySelector (selectors: string): TaroElement | null
  // public querySelectorAll (selectors: string): TaroElement[]
  // public createElementNS
}

export { TaroDocument }
