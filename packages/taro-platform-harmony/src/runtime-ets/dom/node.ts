import { eventSource } from '@tarojs/runtime/dist/runtime.esm'

import TaroDataSourceElement from './dataSource'

import type { StandardProps } from '@tarojs/components/types'
import type { TaroAny } from '../utils'
import type { TaroDocument } from './document'
import type { TaroElement } from './element/element'

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

export class TaroNode extends TaroDataSourceElement {
  public readonly nodeName: string
  public readonly nodeType: NodeType
  public childNodes: TaroNode[] = []
  public parentNode: TaroNode | null = null
  public _nid: string = genId()

  public _doc: TaroDocument | null = null
  // 是否为半编译模板下的节点
  public _isCompileMode = false
  // 是否为半编译模板下拥有自主更新权的节点
  public _isDynamicNode = false

  public _updateTrigger = 0
  private _textContent = ''

  constructor(nodeName: string, nodeType = NodeType.ELEMENT_NODE) {
    super()

    this.nodeType = nodeType
    this.nodeName = nodeName
    eventSource.set(this._nid, this as TaroAny)
  }

  totalCount(): number {
    return this.childNodes?.length || 0
  }

  getData(index: number): TaroElement<StandardProps> {
    return this.childNodes[index] as TaroElement
  }

  public findIndex (refChild: TaroNode): number {
    return this.childNodes.findIndex(node => node._nid === refChild._nid)
  }

  // 更新对应的 ArkUI 组件
  public updateComponent () {
    if (!this.parentNode || !this.parentNode.listeners?.length) return

    const idx = this.parentNode.findIndex(this)
      
    if (idx >= 0) {
      this._updateTrigger++
      this.parentNode.notifyDataChange(idx)
    } else {
      this.parentNode.notifyDataReload()
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
      this.parentNode?.updateComponent()
    } else if (this.nodeType === NodeType.ELEMENT_NODE) {
      const node = new TaroTextNode(value)
      node._doc = this.ownerDocument
      this.childNodes = [node]
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

  public set nodeValue (value: string | null) {
    if (this.nodeType === NodeType.TEXT_NODE && value) {
      this.textContent = value
      this.parentNode?.updateComponent()
    }
  }

  public get ownerDocument (): TaroDocument | null {
    return this._doc
  }

  public hasChildNodes (): boolean {
    return this.childNodes.length > 0
  }

  // TODO cloneNode()、contains()

  public appendChild (child: TaroNode): TaroNode {
    child.parentNode?.removeChild(child)
    child.parentNode = this

    this.childNodes.push(child)
    this.notifyDataAdd(this.childNodes.length - 1)

    checkIsCompileModeAndInstallAfterDOMAction(child, this)
    return child
  }

  public insertBefore (newNode: TaroNode, referenceNode: TaroNode | null): TaroNode {
    newNode.parentNode?.removeChild(newNode)

    if (referenceNode === null) {
      this.appendChild(newNode)
    } else {
      const idxOfRef = this.findIndex(referenceNode)
      this.childNodes.splice(idxOfRef, 0, newNode)
      // TODO: 优化
      this.notifyDataReload()
    }

    checkIsCompileModeAndInstallAfterDOMAction(newNode, this)

    return newNode
  }

  public replaceChild (newChild: TaroNode, oldChild: TaroNode): TaroNode {
    newChild.parentNode?.removeChild(newChild)

    const idxOfRef = this.findIndex(oldChild)

    if (idxOfRef < 0) throw new Error('TaroNode:replaceChild NotFoundError')

    this.childNodes[idxOfRef] = newChild
    oldChild.dispose()
    this.notifyDataChange(idxOfRef)

    checkIsCompileModeAndInstallAfterDOMAction(newChild, this)

    return oldChild
  }

  public removeChild (child: TaroNode): TaroNode {
    if (!child) throw new Error('TaroNode:removeChild TypeError')

    const idx = this.findIndex(child)
    if (idx < 0) throw new Error('TaroNode:removeChild NotFoundError')

    this.childNodes.splice(idx, 1)
    child.dispose()
    this.notifyDataDelete(idx)

    checkIsCompileModeAndUninstallAfterDOMAction(child)

    return child
  }

  public dispose () {
    this.parentNode = null
    this.childNodes = []
  }
}

export class TaroTextNode extends TaroNode {
  constructor(value = '', nodeName = '#text', nodeType: NodeType = NodeType.TEXT_NODE) {
    super(nodeName, nodeType)
    this.textContent = value
  }

  public get data (): string {
    return this.textContent
  }

  public set data (value: string) {
    this.textContent = value
  }
}

function checkIsCompileModeAndInstallAfterDOMAction (_node: TaroNode, _parentNode: TaroNode) {
  // if (!parentNode._isCompileMode) return

  // parentNode._instance?.dynamicCenter?.install?.(node, parentNode)
}

function checkIsCompileModeAndUninstallAfterDOMAction (_node: TaroNode) {
  // if (!node._isCompileMode) return

  // node._instance?.dynamicCenter?.uninstall?.(node)
}
