import { isUndefined } from '@tarojs/shared'

import { Current } from '../current'
import { findChildNodeWithDFS, getPageScrollerOrNode } from '../utils'
import { TaroComment } from './comment'
import { TaroElement } from './element/element'
import { eventSource } from './event-source'
import { NodeType, TaroNode, TaroTextNode } from './node'

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
    // TODO: 仍需补充更多节点解析和它默认样式行为的转换，比如h1\h2
    switch (tagName) {
      case 'root': tagName = 'view'; break
      case 'img': tagName = 'image'; break
      case 'div': tagName = 'view'; break
      case 'p': tagName = 'text'; break
      case 'span': tagName = 'text'; break
      case 'a': tagName = 'text'; break
    }
    // @ts-ignore
    if (Current?.createHarmonyElement) {
      // @ts-ignore
      node = Current.createHarmonyElement(tagName)
    } else {
      node = new TaroElement(tagName)
    }
    node._doc = this
    return node
  }

  public createTextNode (value: string): TaroTextNode {
    // @ts-ignore
    if (!Current?.createTextNode) return

    const node = Current.createTextNode(value)
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

  public querySelector (selectors: string): TaroElement | null {
    const taro = (Current as any).taro
    const page = taro.getCurrentInstance().page
    const element = getPageScrollerOrNode(page?.node, page)

    if (!element) return null

    return findChildNodeWithDFS(element, selectors)
  }

  public querySelectorAll (selectors: string): TaroElement[] {
    const taro = (Current as any).taro
    const page = taro.getCurrentInstance().page
    const element = getPageScrollerOrNode(page?.node, page)

    if (element == null) return []

    return findChildNodeWithDFS(element, selectors, true) || []
  }
  // @Todo
  // public getElementsByClassName (names: string): TaroElement[]
  // public createElementNS
}

export { TaroDocument }
