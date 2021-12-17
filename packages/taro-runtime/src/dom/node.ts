import { injectable } from 'inversify'
import { Shortcuts, ensure } from '@tarojs/shared'
import { NodeType } from './node_types'
import { incrementId, isComment } from '../utils'
import { TaroEventTarget } from './event-target'
import { hydrate } from '../hydrate'
import { eventSource } from './event-source'
import { ElementNames } from '../interface'
import { getElementFactory, getNodeImpl } from '../container/store'
import {
  DOCUMENT_FRAGMENT
} from '../constants'

import type { UpdatePayload } from '../interface'
import type { TaroDocument } from './document'
import type { TaroRootElement } from './root'
import type { TaroElement } from './element'

const nodeId = incrementId()

@injectable()
export class TaroNode extends TaroEventTarget {
  public uid: string
  public sid: string
  public nodeType: NodeType
  public nodeName: string
  public parentNode: TaroNode | null = null
  public childNodes: TaroNode[] = []

  protected _getElement = getElementFactory()

  public constructor () {
    super()
    const impl = getNodeImpl()
    impl.bind(this)
    this.uid = `_n_${nodeId()}` // dom 节点 id，开发者可修改
    this.sid = this.uid // dom 节点全局唯一 id，不可被修改
    eventSource.set(this.sid, this)
  }

  private hydrate = (node: TaroNode) => () => hydrate(node as TaroElement)

  /**
   * like jQuery's $.empty()
   */
  private _empty () {
    while (this.childNodes.length > 0) {
      const child = this.childNodes[0]
      child.parentNode = null
      eventSource.delete(child.sid)
      eventSource.delete(child.uid)
      this.childNodes.shift()
    }
  }

  protected get _root (): TaroRootElement | null {
    return this.parentNode?._root || null
  }

  protected findIndex (refChild: TaroNode): number {
    const index = this.childNodes.indexOf(refChild)

    ensure(index !== -1, 'The node to be replaced is not a child of this node.')

    return index
  }

  public get _path (): string {
    const parentNode = this.parentNode

    if (parentNode) {
      // 计算路径时，先过滤掉 comment 节点
      const list = parentNode.childNodes.filter(node => !isComment(node))
      const indexOfNode = list.indexOf(this)
      const index = this.hooks.getPathIndex(indexOfNode)

      return `${parentNode._path}.${Shortcuts.Childnodes}.${index}`
    }

    return ''
  }

  public get nextSibling (): TaroNode | null {
    const parentNode = this.parentNode
    return parentNode?.childNodes[parentNode.findIndex(this) + 1] || null
  }

  public get previousSibling (): TaroNode | null {
    const parentNode = this.parentNode
    return parentNode?.childNodes[parentNode.findIndex(this) - 1] || null
  }

  public get parentElement (): TaroElement | null {
    const parentNode = this.parentNode
    if (parentNode?.nodeType === NodeType.ELEMENT_NODE) {
      return parentNode as TaroElement
    }
    return null
  }

  public get firstChild (): TaroNode | null {
    return this.childNodes[0] || null
  }

  public get lastChild (): TaroNode | null {
    const childNodes = this.childNodes
    return childNodes[childNodes.length - 1] || null
  }

  /**
   * @textContent 目前只能置空子元素
   * @TODO 等待完整 innerHTML 实现
   */
  public set textContent (text: string) {
    this._empty()
    if (text === '') {
      this.enqueueUpdate({
        path: `${this._path}.${Shortcuts.Childnodes}`,
        value: () => []
      })
    } else {
      const document = this._getElement<TaroDocument>(ElementNames.Document)()
      this.appendChild(document.createTextNode(text))
    }
  }

  public insertBefore<T extends TaroNode> (newChild: T, refChild?: TaroNode | null, isReplace?: boolean): T {
    if (newChild.nodeName === DOCUMENT_FRAGMENT) {
      newChild.childNodes.reduceRight((previousValue, currentValue) => {
        this.insertBefore(currentValue, previousValue)
        return currentValue
      }, refChild)
      return newChild
    }

    newChild.remove()
    newChild.parentNode = this
    let payload: UpdatePayload

    if (refChild) {
      const index = this.findIndex(refChild)
      this.childNodes.splice(index, 0, newChild)
      if (isReplace) {
        payload = {
          path: newChild._path,
          value: this.hydrate(newChild)
        }
      } else {
        payload = {
          path: `${this._path}.${Shortcuts.Childnodes}`,
          value: () => {
            const childNodes = this.childNodes.filter(node => !isComment(node))
            return childNodes.map(hydrate)
          }
        }
      }
    } else {
      this.childNodes.push(newChild)
      payload = {
        path: newChild._path,
        value: this.hydrate(newChild)
      }
    }

    this.enqueueUpdate(payload)

    // 修复列表顺序变化时，部分列表项点击事件失效的问题：https://github.com/NervJS/taro/pull/7968
    // insertBefore 时会先调用新节点的 remove 方法，此时会把此节点从 eventSource 删除，从而导致事件因 getElementById 找不到对应节点而不触发。
    if (!eventSource.has(newChild.sid)) {
      eventSource.set(newChild.sid, newChild)
      eventSource.set(newChild.uid, newChild)
    }

    return newChild
  }

  public appendChild (child: TaroNode) {
    this.insertBefore(child)
  }

  public replaceChild (newChild: TaroNode, oldChild: TaroNode) {
    if (oldChild.parentNode === this) {
      this.insertBefore(newChild, oldChild, true)
      oldChild.remove(true)
      return oldChild
    }
  }

  public removeChild<T extends TaroNode> (child: T, isReplace?: boolean): T {
    const index = this.findIndex(child)
    this.childNodes.splice(index, 1)
    if (!isReplace) {
      this.enqueueUpdate({
        path: `${this._path}.${Shortcuts.Childnodes}`,
        value: () => {
          const childNodes = this.childNodes.filter(node => !isComment(node))
          return childNodes.map(hydrate)
        }
      })
    }
    child.parentNode = null
    eventSource.delete(child.sid)
    eventSource.delete(child.uid)
    // @TODO: eventSource memory overflow
    // child._empty()
    return child
  }

  public remove (isReplace?: boolean) {
    this.parentNode?.removeChild(this, isReplace)
  }

  public hasChildNodes () {
    return this.childNodes.length > 0
  }

  public enqueueUpdate (payload: UpdatePayload) {
    this._root?.enqueueUpdate(payload)
  }

  public get ownerDocument () {
    const document = this._getElement<TaroDocument>(ElementNames.Document)()
    return document
  }
}
