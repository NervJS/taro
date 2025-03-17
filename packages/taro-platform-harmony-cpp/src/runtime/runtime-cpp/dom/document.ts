import { Current } from '../current'
import { TaroNativeModule } from '../harmony-library'
import { getPageScrollerOrNode } from '../utils'
import { TaroComment } from './comment'
import { TaroElement } from './element/element'
import { NodeType, TaroNode, TaroTextNode } from './node'

import type { Window } from '../bom/window'

class TaroDocument extends TaroNode {
  public documentElement: TaroElement
  public head: TaroElement
  public body: TaroElement
  public container: TaroElement
  public app: TaroElement
  public entryAsync: TaroElement
  public cookie = ''
  private _win: Window

  constructor(window: Window) {
    super('#document', NodeType.DOCUMENT_NODE)
    this._win = window
    window._doc = this
    TaroNativeModule.createTaroNode(this)
  }

  get defaultView (): Window {
    return this._win
  }

  get currentPageNode (): TaroElement {
    const taro = Current.taro
    const page = taro.getCurrentInstance().page
    return getPageScrollerOrNode(page?.node, page)
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
    if (Current?.createHarmonyElement) {
      node = Current.createHarmonyElement(tagName)
    } else {
      node = new TaroElement(tagName)
    }
    node._doc = this
    return node
  }

  public createTextNode (value: string): TaroTextNode | void {
    if (!Current?.createTextNode) return

    const node = Current.createTextNode(value)
    node._doc = this
    return node
  }

  public createComment (data: string): TaroComment {
    return new TaroComment(data)
  }

  public getElementById<T extends TaroNode = TaroElement> (id?: string): T | null {
    // FIXME 使用页面实例，将会导致组件模式注入的节点无法获取
    console.warn('getElementById: 在 document 上查询所有元素性能较差，请谨慎使用！')
    return super.getElementById.call(this, id)
  }

  public getElementsByTagName<T extends TaroNode = TaroElement>(tagName: string): T[] {
    console.error('getElementsByTagName: 不支持在 document 上查询所有元素，自动降级到当前页面内查询！')
    if (!this.currentPageNode) {
      console.error('getElementsByTagName: 当前页面不存在！')
      return []
    }
    return super.getElementsByTagName.call(this.currentPageNode, tagName)
  }

  public getElementsByClassName<T extends TaroNode = TaroElement>(className: string): T[] {
    console.error('getElementsByClassName: 不支持在 document 上查询所有元素，自动降级到当前页面内查询！')
    if (!this.currentPageNode) {
      console.error('getElementsByClassName: 当前页面不存在！')
      return []
    }
    return super.getElementsByClassName.call(this.currentPageNode, className)
  }

  public querySelector (selectors: string): TaroElement | null {
    console.warn('querySelector: 在 document 上查询所有元素性能较差，请谨慎使用！')
    return super.querySelector.call(this, selectors)
  }

  public querySelectorAll (selectors: string): TaroElement[] {
    console.error('querySelectorAll: 不支持在 document 上查询所有元素，自动降级到当前页面内查询！')
    if (!this.currentPageNode) {
      console.error('querySelectorAll: 当前页面不存在！')
      return []
    }
    return super.querySelectorAll.call(this.currentPageNode, selectors)
  }

  // TODO public createElementNS
  public getComputedStyle (): any {
    return super.getComputedStyle.call(this)
  }
}

export { TaroDocument }
