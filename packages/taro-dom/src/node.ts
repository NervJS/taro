import { NodeType } from './node_types'
import { requestUpdate } from './render'

export class MpNode {
  public nodeType: NodeType

  public nodeName: string

  public parentNode: MpNode | null

  public childNodes: MpNode[] = []

  public constructor (nodeType: NodeType, nodeName: string) {
    this.nodeType = nodeType
    this.nodeName = nodeName
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
    requestUpdate(this)
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
    requestUpdate(this)
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
}
