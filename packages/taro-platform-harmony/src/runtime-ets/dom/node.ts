import { eventSource } from '@tarojs/runtime/dist/runtime.esm'

import { DynamicCenter } from '../utils'
import { TaroEventTarget } from './eventTarget'

import type { TaroDocument } from './document'
import type { TaroElement } from './element'

export enum NodeType {
  ELEMENT_NODE = 1,
  ATTRIBUTE_NODE = 2,
  TEXT_NODE = 3,
  CDATA_SECTION_NODE = 4,
  ENTITY_REFERENCE_NODE = 5,
  PROCESSING_INSTRUCTION_NODE = 7,
  COMMENT_NODE = 8,
  DOCUMENT_NODE = 9,
  DOCUMENT_TYPE_NODE = 10,
  DOCUMENT_FRAGMENT_NODE = 11
}

let _id = 0
function genId (): string {
  return `_n_${_id++}`
}

export class TaroNode extends TaroEventTarget {
  public readonly nodeName: string
  public readonly nodeType: NodeType
  public childNodes: TaroNode[] = []
  public parentNode: TaroNode | null = null
  public _nid: string = genId()

  public _doc: TaroDocument
  // 是否为半编译模板下的节点
  public _isCompileMode = false
  // 是否为半编译模板下拥有自主更新权的节点
  public _isDynamicNode = false
  public _instance: any

  private _updateTrigger = 0
  private _textContent = ''

  constructor(nodeName, nodeType = NodeType.ELEMENT_NODE) {
    super()
    this.nodeType = nodeType
    this.nodeName = nodeName
    eventSource.set(this._nid, this as any)
  }

  protected findIndex (refChild: TaroNode): number {
    // @Observe 会影响 === 判断，只能比较 _nid
    return this.childNodes.findIndex(node => node._nid === refChild._nid)
  }

  // 更新对应的 ArkUI 组件
  public updateComponent () {
    if (this._isDynamicNode || !this._isCompileMode) {
      this._updateTrigger += 1
    } else {
      this.parentNode?.updateComponent()
    }
  }

  public get firstChild (): TaroNode | null{
    return this.childNodes[0] || null
  }

  public get lastChild (): TaroNode | null {
    return this.childNodes[this.childNodes.length - 1] || null
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

  public get textContent (): string {
    if (this.nodeType === NodeType.TEXT_NODE) {
      return this._textContent
    } else if (this.nodeType === NodeType.ELEMENT_NODE) {
      const content = this.childNodes.reduce((prev, node) => {
        return prev + node.textContent
      }, '')
      return content
    }
    return ''
  }

  public set textContent (value: string) {
    if (this.nodeType === NodeType.TEXT_NODE) {
      this._textContent = value
      // if (this.parentNode && this.ownerDocument) {
      //   const text = this.ownerDocument.createTextNode(value)
      //   this.parentNode.replaceChild(text, this)
      // } else {
      //   this._textContent = value
      // }
    } else if (this.nodeType === NodeType.ELEMENT_NODE) {
      const text = this.ownerDocument.createTextNode(value)
      this.childNodes = [text]
    }
  }

  public get nodeValue (): string | null {
    switch (this.nodeType) {
      case NodeType.TEXT_NODE:
        return this.textContent
      case NodeType.COMMENT_NODE:
        return 'comment'
      default:
        return null
    }
  }

  public set nodeValue (value: string) {
    if (this.nodeType === NodeType.TEXT_NODE) {
      this.textContent = value
    }
  }

  public get ownerDocument (): TaroDocument {
    return this._doc
  }

  public hasChildNodes (): boolean {
    return this.childNodes.length > 0
  }

  // TODO cloneNode()、contains()

  public appendChild (child: TaroNode): TaroNode {
    child.parentNode?.removeChild(child)
    child.parentNode = this
    // this.childNodes.push(child)
    this.childNodes = [...this.childNodes, child]

    DynamicCenter.checkIsCompileModeAndInstallAfterDOMAction(child, this)
    return child
  }

  public insertBefore (newNode: TaroNode, referenceNode: TaroNode | null): TaroNode {
    newNode.parentNode?.removeChild(newNode)

    if (referenceNode === null) {
      this.appendChild(newNode)
    } else {
      const idxOfRef = this.findIndex(referenceNode)
      this.childNodes = [
        ...this.childNodes.slice(0, idxOfRef),
        newNode,
        ...this.childNodes.slice(idxOfRef)
      ]
    }

    DynamicCenter.checkIsCompileModeAndInstallAfterDOMAction(newNode, this)

    return newNode
  }

  public replaceChild (newChild: TaroNode, oldChild: TaroNode): TaroNode {
    newChild.parentNode?.removeChild(newChild)

    const idxOfRef = this.findIndex(oldChild)

    if (idxOfRef < 0) throw new Error('TaroNode:replaceChild NotFoundError')

    this.childNodes = [
      ...this.childNodes.slice(0, idxOfRef),
      newChild,
      ...this.childNodes.slice(idxOfRef + 1)
    ]

    DynamicCenter.checkIsCompileModeAndInstallAfterDOMAction(newChild, this)

    return oldChild
  }

  public removeChild (child: TaroNode): TaroNode {
    if (!child) throw new Error('TaroNode:removeChild TypeError')

    const idx = this.findIndex(child)
    if (idx < 0) throw new Error('TaroNode:removeChild NotFoundError')

    this.childNodes = this.childNodes.filter((_, index) => index !== idx)

    DynamicCenter.checkIsCompileModeAndUninstallAfterDOMAction(child)

    return child
  }
}
