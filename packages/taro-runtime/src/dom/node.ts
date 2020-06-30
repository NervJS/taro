import { NodeType } from './node_types'
import { incrementId } from '../utils'
import { TaroEventTarget } from './event_target'
import { eventSource } from './event'
import { TaroRootElement } from './root'
import { Shortcuts, ensure } from '@tarojs/shared'
import { hydrate, HydratedData } from '../hydrate'
import { TaroElement } from './element'
import { setInnerHTML } from './html/html'
import { CurrentReconciler } from '../reconciler'
import { document } from '../bom/document'

const nodeId = incrementId()

export interface UpdatePayload {
  path: string;
  value: UpdatePayloadValue
}

export type UpdatePayloadValue = string | boolean | HydratedData
export type DataTree = Record<string, UpdatePayloadValue | ReturnType<HydratedData>>

export class TaroNode extends TaroEventTarget {
  public nodeType: NodeType

  public nodeName: string

  public uid: string

  public parentNode: TaroNode | null = null

  public childNodes: TaroNode[] = []

  public constructor (nodeType: NodeType, nodeName: string) {
    super()
    this.nodeType = nodeType
    this.nodeName = nodeName
    this.uid = `_n_${nodeId()}`
    eventSource.set(this.uid, this)
  }

  public get _path () {
    if (this.parentNode !== null) {
      const index = process.env.TARO_ENV === 'swan'
        ? this.parentNode.childNodes.indexOf(this)
        : '[' + this.parentNode.childNodes.indexOf(this) + ']'

      return `${this.parentNode._path}.${Shortcuts.Childnodes}.${index}`
    }

    return ''
  }

  protected get _root (): TaroRootElement | null {
    if (this.parentNode !== null) {
      return this.parentNode._root
    }

    return null
  }

  public get parentElement (): TaroElement | null {
    const parentNode = this.parentNode
    if (parentNode != null && parentNode.nodeType === NodeType.ELEMENT_NODE) {
      return parentNode as TaroElement
    }
    return null
  }

  public get nextSibling () {
    const parentNode = this.parentNode
    if (parentNode) {
      return parentNode.childNodes[this.findIndex(parentNode.childNodes, this) + 1] || null
    }

    return null
  }

  public get previousSibling () {
    const parentNode = this.parentNode
    if (parentNode) {
      return parentNode.childNodes[this.findIndex(parentNode.childNodes, this) - 1] || null
    }

    return null
  }

  public insertBefore<T extends TaroNode> (newChild: T, refChild?: TaroNode | null, isReplace?: boolean): T {
    newChild.remove()
    newChild.parentNode = this
    let payload: UpdatePayload
    if (refChild) {
      const index = this.findIndex(this.childNodes, refChild)
      this.childNodes.splice(index, 0, newChild)
      if (isReplace === true) {
        payload = {
          path: newChild._path,
          value: this.hydrate(newChild)
        }
      } else {
        payload = {
          path: `${this._path}.${Shortcuts.Childnodes}`,
          value: () => this.childNodes.map(hydrate)
        }
      }
    } else {
      this.childNodes.push(newChild)
      payload = {
        path: newChild._path,
        value: this.hydrate(newChild)
      }
    }

    CurrentReconciler.insertBefore?.(this, newChild, refChild)

    this.enqueueUpdate(payload)
    return newChild
  }

  private hydrate = (node: TaroNode) => () => hydrate(node as TaroElement)

  public appendChild (child: TaroNode) {
    this.insertBefore(child)
    CurrentReconciler.appendChild?.(this, child)
  }

  public replaceChild (newChild: TaroNode, oldChild: TaroNode) {
    if (oldChild.parentNode === this) {
      this.insertBefore(newChild, oldChild, true)
      oldChild.remove(true)
      return oldChild
    }
    CurrentReconciler.removeChild?.(this, newChild, oldChild)
  }

  public removeChild<T extends TaroNode> (child: T, isReplace?: boolean): T {
    const index = this.findIndex(this.childNodes, child)
    this.childNodes.splice(index, 1)
    if (isReplace !== true) {
      this.enqueueUpdate({
        path: `${this._path}.${Shortcuts.Childnodes}`,
        value: () => this.childNodes.map(hydrate)
      })
    }
    child.parentNode = null
    eventSource.delete(child.uid)
    // @TODO: eventSource memory overflow
    // child._empty()
    return child
  }

  public remove (isReplace?: boolean) {
    if (this.parentNode) {
      this.parentNode.removeChild(this, isReplace)
    }
  }

  public get firstChild () {
    return this.childNodes[0] || null
  }

  public get lastChild () {
    const c = this.childNodes
    return c[c.length - 1] || null
  }

  public hasChildNodes () {
    return this.childNodes.length > 0
  }

  public enqueueUpdate (payload: UpdatePayload) {
    if (this._root === null) {
      return
    }

    this._root.enqueueUpdate(payload)
  }

  /**
   * like jQuery's $.empty()
   */
  private _empty () {
    while (this.childNodes.length > 0) {
      const child = this.childNodes[0]
      child.parentNode = null
      eventSource.delete(child.uid)
      this.childNodes.shift()
    }
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
      this.appendChild(document.createTextNode(text))
    }
  }

  public set innerHTML (html: string) {
    setInnerHTML(this, html)
  }

  public get innerHTML () {
    return ''
  }

  protected findIndex (childeNodes: TaroNode[], refChild: TaroNode) {
    const index = childeNodes.indexOf(refChild)
    ensure(index !== -1, 'The node to be replaced is not a child of this node.')

    return index
  }

  public cloneNode (isDeep = false) {
    const constructor: any = this.constructor
    let newNode

    if (this.nodeType === NodeType.ELEMENT_NODE) {
      newNode = new constructor(this.nodeType, this.nodeName)
    } else if (this.nodeType === NodeType.TEXT_NODE) {
      newNode = new constructor('')
    }

    for (const key in this) {
      const value: any = this[key]
      if (['props', 'dataset'].includes(key) && typeof value === 'object') {
        newNode[key] = { ...value }
      } else if (key === '_value') {
        newNode[key] = value
      } else if (key === 'style') {
        newNode.style._value = { ...value._value }
        newNode.style._usedStyleProp = new Set(Array.from(value._usedStyleProp))
      }
    }

    if (isDeep) {
      newNode.childNodes = this.childNodes.map(node => node.cloneNode(true))
    }

    return newNode
  }
}
