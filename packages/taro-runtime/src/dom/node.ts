import { NodeType } from './node_types'
import { incrementId } from '../utils'
import { TaroEventTarget } from './event_target'
import { eventSource } from './event'
import { Current } from '../current'

const nodeId = incrementId()

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
    this.uid = `taro_node_${nodeId()}`
    eventSource.set(this.uid, this)
  }

  public get nextSibling () {
    const parentNode = this.parentNode
    if (parentNode) {
      return parentNode.childNodes[this.findIndex(parentNode.childNodes, this) + 1]
    }
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
    if (refChild) {
      const index = this.findIndex(this.childNodes, refChild)
      this.childNodes.splice(index, 0, newChild)
    } else {
      this.childNodes.push(newChild)
    }
    this.enqueueUpdate()
    return newChild
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
    child.parentNode = null
    this.childNodes.splice(index, 1)
    this.enqueueUpdate()
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

  public enqueueUpdate () {
    if (Current.root === null) {
      return
    }

    Current.root.performUpdate()
  }
}
