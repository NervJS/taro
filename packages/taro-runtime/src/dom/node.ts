import { NodeType } from './node_types'
import { incrementId } from '../utils'
import { TaroEventTarget } from './event_target'
import { eventSource } from './event'
import { TaroRootElement } from './root'
import { Shortcuts } from '@tarojs/shared'
import { hydrate } from '../render'
import { TaroElement } from './element'

const nodeId = incrementId()

export interface UpdatePayload {
  path: string;
  value: unknown
}

export class TaroNode extends TaroEventTarget {
  public nodeType: NodeType

  public nodeName: string

  public uid: string

  public parentNode: TaroNode | null = null

  public childNodes: TaroNode[] = []

  protected _root: TaroRootElement | null = null

  public _path = ''

  public constructor (nodeType: NodeType, nodeName: string) {
    super()
    this.nodeType = nodeType
    this.nodeName = nodeName
    this.uid = `taro_node_${nodeId()}`
    eventSource.set(this.uid, this)
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
      return parentNode.childNodes[this.findIndex(parentNode.childNodes, this) - 1]
    }
  }

  public insertBefore<T extends TaroNode> (newChild: T, refChild?: TaroNode | null): T {
    newChild.remove()
    newChild.parentNode = this
    let index = this.childNodes.length

    if (refChild) {
      index = this.findIndex(this.childNodes, refChild)
      this.childNodes.splice(index, 0, newChild)
    } else {
      this.childNodes.push(newChild)
    }

    this.setDataPath(newChild, index, this._path)
    this.enqueueUpdate({
      path: this.getChildPath(index),
      value: this.hydrate(newChild)
    })
    return newChild
  }

  private hydrate = (node: TaroNode) => () => hydrate(node as TaroElement)

  private getChildPath (index: number, path = this._path) {
    return `${path}.${Shortcuts.Childnodes}[${index}]`
  }

  public appendChild (child: TaroNode) {
    this.insertBefore(child)
  }

  public replaceChild (newChild: TaroNode, oldChild: TaroNode) {
    if (oldChild.parentNode === this) {
      this.insertBefore(newChild, oldChild)
      oldChild.remove()
      return oldChild
    }
  }

  public removeChild<T extends TaroNode> (child: T): T {
    const index = this.findIndex(this.childNodes, child)
    this.removeDataPath(child)
    child.parentNode = null
    this.childNodes.splice(index, 1)
    this.enqueueUpdate({
      path: this.getChildPath(index),
      value: []
    })
    eventSource.delete(this.uid)
    return child
  }

  public remove () {
    if (this.parentNode) {
      this.parentNode.removeChild(this)
    }
  }

  public get firstChild () {
    return this.childNodes[0]
  }

  public get lastChild () {
    const c = this.childNodes
    return c[c.length - 1]
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

  private setDataPath (child: TaroNode, index: number, path: string) {
    if (this._root === null || child._root === this._root) {
      return
    } else {
      child._path = this.getChildPath(index, path)
      child._root = this._root
    }

    for (let i = 0; i < child.childNodes.length; i++) {
      this.setDataPath(child.childNodes[i], i, child._path)
    }
  }

  private removeDataPath (node: TaroNode) {
    if (node._root === null) {
      return
    }

    node._root = null
    node._path = ''
    for (let i = 0; i < node.childNodes.length; i++) {
      this.removeDataPath(node.childNodes[i])
    }
  }
}
