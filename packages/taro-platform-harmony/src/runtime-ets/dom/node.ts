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

  private _textContent = ''

  // 以下属性为半编译模式下才会赋值和使用的属性
  // 半编译节点更新触发器
  public _updateTrigger = 0
  // 是否为半编译模板下的节点
  public _isCompileMode = false
  // 是否为半编译模板下拥有自主更新权的节点
  public _isDynamicNode = false

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

  public findIndex (refChild?: TaroNode): number {
    return this.childNodes.findIndex(node => node._nid === refChild?._nid)
  }

  public updateTextNode () {
    // @ts-ignore
    if (this.childNodes.length <= 0 || this.tagName !== 'VIEW') return

    // TextNode 不具备 props 更新能力，需要由父节点来进行触发
    this.childNodes.forEach(item => {
      if (item.nodeType !== NodeType.TEXT_NODE) return

      item._updateTrigger++
    })
  }

  // 更新对应的 ArkUI 组件
  public updateComponent () {
    // 非半编译模式或者半编译模式下拥有自主更新权力的节点走 @State 的更新模式
    if (this._isDynamicNode || !this._isCompileMode) {
      this._updateTrigger++
    } else {
      this.parentNode?.updateComponent()
    }
  }

  // 提供唯一标识，方便与小程序一致，能根据uid获取到对应的节点
  public get uid (): string {
    return this._nid
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
    } else if (this.nodeType === NodeType.ELEMENT_NODE) {
      const node = new TaroTextNode(value)
      node._doc = this.ownerDocument
      node.parentNode = this
      this.childNodes.length = 0
      this.childNodes.push(node)
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
    }
  }

  public get ownerDocument (): TaroDocument | null {
    return this._doc
  }

  public hasChildNodes (): boolean {
    return this.childNodes.length > 0
  }

  // TODO cloneNode()、contains()
  public connectParentNode (child: TaroNode) {
    child.parentNode?.removeChild(child)
    child.parentNode = this
  }

  public appendChild (child: TaroNode): TaroNode {
    this.connectParentNode(child)
    this.childNodes.push(child)
    this.notifyDataAdd(this.childNodes.length - 1)

    checkIsCompileModeAndInstallAfterDOMAction(child, this)
    return child
  }

  public insertBefore (newNode: TaroNode, referenceNode?: TaroNode): TaroNode {
    newNode.parentNode?.removeChild(newNode)

    if (!referenceNode) {
      this.appendChild(newNode)
    } else {
      const idxOfRef = this.findIndex(referenceNode)
      this.childNodes.splice(idxOfRef, 0, newNode)
      this.connectParentNode(newNode)
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

    // 渲染，层级大于0的节点需要让其回到正常层级，然后删掉
    // @ts-ignore
    if (child._nodeInfo?.layer > 0) {
      // @ts-ignore
      child.setLayer(0) // 删除固定层级上的节点
    }

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

@Observed
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

function checkIsCompileModeAndInstallAfterDOMAction (node: TaroNode, parentNode: TaroNode) {
  if (!parentNode._isCompileMode || !parentNode._instance) return

  parentNode._instance.dynamicCenter?.install?.(node, parentNode)
  node.updateComponent()
}

function checkIsCompileModeAndUninstallAfterDOMAction (node: TaroNode) {
  if (!node._isCompileMode || !parentNode._instance) return

  node._instance.dynamicCenter?.uninstall?.(node)
}
