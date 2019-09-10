import { NodeType } from './node_types'
import { hydrate, MpInstance } from './render'
import { incrementId } from './utils'
import { eventSource, EventTarget } from './event_target'

const nodeId = incrementId()

export class MpNode extends EventTarget {
  public nodeType: NodeType

  public nodeName: string

  public uid: string

  public parentNode: MpNode | null = null

  public childNodes: MpNode[] = []

  public ctx: null | MpInstance = null

  private pendingUpdate: boolean = false

  private isRoot: boolean = false

  public constructor (nodeType: NodeType, nodeName: string) {
    super()
    this.nodeType = nodeType
    this.nodeName = nodeName
    this.isRoot = nodeName === 'root'
    this.uid = `taro_${nodeId()}`
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

  public insertBefore<T extends MpNode> (newChild: T, refChild?: MpNode | null): T {
    newChild.remove()
    newChild.parentNode = this
    if (refChild) {
      const index = this.findIndex(this.childNodes, refChild)
      this.childNodes.splice(index, 0, newChild)
    } else {
      this.childNodes.push(newChild)
    }
    this.performUpdate()
    return newChild
  }

  public appendChild (child: MpNode) {
    this.insertBefore(child)
  }

  public replaceChild (newChild: MpNode, oldChild: MpNode) {
    if (oldChild.parentNode === this) {
      this.insertBefore(newChild, oldChild)
      oldChild.remove()
      return oldChild
    }
  }

  public removeChild<T extends MpNode> (child: T): T {
    const index = this.findIndex(this.childNodes, child)
    this.childNodes.splice(index, 1)
    this.performUpdate()
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

  protected findIndex (childeNodes: MpNode[], refChild: MpNode | null) {
    const index = childeNodes.indexOf(refChild)
    if (index === -1) {
      throw new Error('refChild 不属于') // 改进报错
    }

    return index
  }

  public performUpdate () {
    if (this.pendingUpdate) {
      return
    }

    if (this.isRoot) {
      if (this.ctx === null) {
        return
      }

      this.pendingUpdate = true

      setTimeout(() => {
        this.ctx.setData({
          root: hydrate(this as any)
        }, () => {
          this.pendingUpdate = false
        })
      }, 1)
    } else if (this.parentNode !== null) {
      this.parentNode.performUpdate()
    }
  }
}
