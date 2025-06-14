import { isString } from '@tarojs/shared'

import { TaroNativeModule } from '../harmony-library'
import { printInfo, runInDebug } from '../utils/info'
import { TaroEventTarget } from './eventTarget'

import type { TaroAny } from '../interface'
import type { TaroDocument } from './document'
import type { TaroElement } from './element/element'

const registry = new FinalizationRegistry((val) => {
  runInDebug(() => {
    printInfo('FinalizationRegistry', val)
  })
})

export enum NodeType {
  ELEMENT_NODE = 1,
  ATTRIBUTE_NODE = 2,
  TEXT_NODE = 3,
  CDATA_SECTION_NODE = 4,
  PROCESSING_INSTRUCTION_NODE = 7,
  COMMENT_NODE = 8,
  DOCUMENT_NODE = 9,
  DOCUMENT_TYPE_NODE = 10,
  DOCUMENT_FRAGMENT_NODE = 11
}

let _id = 0
function genId (): number {
  return ++_id
}

export class TaroNode extends TaroEventTarget {
  public readonly nodeName: string
  public readonly nodeType: NodeType
  public _nid: number = genId()
  public _doc: TaroDocument | null = null
  public get _instance (): TaroAny {
    return null
  }

  public set _instance (_) {}

  private _textContent = ''
  private _childNodes: TaroNode[] | null = null
  private _parentNode: TaroNode | null = null

  // 以下属性为原生混写组件才有意义的属性
  public _nativeUpdateTrigger = 0

  constructor(nodeName: string, nodeType = NodeType.ELEMENT_NODE) {
    super()

    this.nodeType = nodeType
    this.nodeName = nodeName
    registry.register(this, `nodeName: ${nodeName}; nid: ${this._nid}; nodeType: ${nodeType};`)
  }

  public getStrNid() {
    return `n_${this._nid}`
  }

  public getNumNid(id) {
    return +id.slice(2)
  }

  // 提供唯一标识，方便与小程序一致，能根据 uid 获取到对应的节点
  public get uid (): string {
    return `${this._nid}`
  }

  public get firstChild (): TaroNode | null {
    return TaroNativeModule.getTaroNodeProperty(this, 'firstChild') || null
  }

  public get firstElementChild (): TaroElement | null {
    return TaroNativeModule.getTaroNodeProperty(this, 'firstElementChild') || null
  }

  public get lastChild (): TaroNode | null {
    return TaroNativeModule.getTaroNodeProperty(this, 'lastChild') || null
  }

  public get lastElementChild (): TaroElement | null {
    return TaroNativeModule.getTaroNodeProperty(this, 'lastElementChild') || null
  }

  public get nextSibling (): TaroNode | null {
    return TaroNativeModule.getTaroNodeProperty(this, 'nextSibling') || null
  }

  public get previousSibling (): TaroNode | null {
    return TaroNativeModule.getTaroNodeProperty(this, 'previousSibling') || null
  }

  public get parentElement (): TaroElement | null {
    return TaroNativeModule.getTaroNodeProperty(this, 'parentElement') || null
  }

  public get textContent (): string {
    return this._textContent || ''
  }

  public set textContent (value: string) {
    // APP 节点在缓存的情况下会被手动 append 到页面上，因此 APP 不能清空内容，否则会导致页面 crash
    if (this.nodeName === 'APP') return

    if (this.nodeType === NodeType.TEXT_NODE) {
      this._textContent = value
      runInDebug(() => {
        printInfo('setAttribute', 'textContent', this._nid, this.parentNode?.nodeName, this.nodeName, this._textContent)
      })
      TaroNativeModule.setTaroNodeAttribute(this, 'textContent', this._textContent)
    } else if (this.nodeType === NodeType.ELEMENT_NODE) {
      const node = new TaroTextNode(value)
      node._doc = this.ownerDocument
      runInDebug(() => {
        printInfo('appendChild', 'textContent', this._nid, node._nid, this.parentNode?.nodeName, this.nodeName, value)
      })
      TaroNativeModule.appendTaroNode(this, node)
    }
  }

  public get childNodes (): TaroNode[] {
    if (this._childNodes) {
      return this._childNodes!
    }

    this._childNodes = TaroNativeModule.getTaroNodeProperty(this, 'childNodes')

    return this._childNodes! || []
  }

  public get parentNode (): TaroNode | null {
    if (this._parentNode) {
      return this._parentNode
    }

    this._parentNode = TaroNativeModule.getTaroNodeProperty(this, 'parentNode')

    return this._parentNode
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

  public appendChild (child: TaroElement): TaroNode {
    // FIXME: 后续移除
    if ((this as any).isETS) {
      (this as any).notifyDataAdd?.(this.childNodes.length - 1)
    }

    runInDebug(() => {
      printInfo('appendChild', this._nid, child._nid, this.parentNode?.nodeName, this.nodeName, child.nodeName)
    })
    TaroNativeModule.appendTaroNode(this, child)

    child._parentNode = this
    this._childNodes = null
    return child
  }

  public insertBefore (newNode: TaroElement, referenceNode?: TaroNode): TaroNode {
    if (!referenceNode) {
      this.appendChild(newNode)
    } else {
      // FIXME: 后续移除
      if ((this as any).isETS) {
        (this as any).notifyDataReload?.()
      }

      runInDebug(() => {
        printInfo('insertBefore', this.parentNode?.nodeName, this._nid, referenceNode._nid, this.nodeName)
      })
      TaroNativeModule.insertBeforeTaroNode(this, newNode, referenceNode)
    }

    newNode._parentNode = this
    this._childNodes = null
    return newNode
  }

  public replaceChild (newChild: TaroNode, oldChild: TaroNode): TaroNode {
    // FIXME: 后续移除
    if ((this as any).isETS) {
      (this as any).notifyDataChange?.((this as any).findIndex(oldChild))
    }

    runInDebug(() => {
      printInfo('replaceChild', this.parentNode?.nodeName, this._nid, newChild._nid, this.nodeName)
    })
    TaroNativeModule.replaceTaroNode(this, newChild, oldChild)
    newChild._parentNode = this
    oldChild._parentNode = null
    this._childNodes = null
    return oldChild
  }

  public removeChild (child: TaroNode): TaroNode {
    // FIXME: 后续移除
    if ((this as any).isETS) {
      (this as any).notifyDataChange?.((this as any).findIndex(child))
    }

    runInDebug(() => {
      // @ts-ignore
      printInfo('removeChild', this.parentNode?.nodeName, this._nid, child._nid, this.nodeName, '-', this.className, '-', child.className)
    })
    TaroNativeModule.removeTaroNode(this, child)
    child._parentNode = this
    this._childNodes = null
    return child
  }

  public getElementById<T extends TaroNode = TaroElement> (id?: string): T | null {
    runInDebug(() => {
      printInfo('getElementById', this._nid, this.nodeName, 'id:', id)
    })
    return isString(id) ? TaroNativeModule.getTaroNodeById(this, id) : null
  }

  public getElementsByTagName<T extends TaroNode = TaroElement>(tagName: string): T[] {
    runInDebug(() => {
      printInfo('getElementsByTagName', this._nid, this.nodeName, 'tagName:', tagName)
    })
    return (isString(tagName) ? TaroNativeModule.getTaroNodesByTagName(this, tagName) : null) || []
  }

  public getElementsByClassName<T extends TaroNode = TaroElement>(className: string): T[] {
    runInDebug(() => {
      printInfo('getElementsByClassName', this._nid, this.nodeName, 'className:', className)
    })
    return (isString(className) ? TaroNativeModule.getTaroNodesByClassName(this, className) : null) || []
  }

  public querySelector (selectors: string): TaroElement | null {
    runInDebug(() => {
      printInfo('querySelector', this._nid, this.nodeName, 'selectors:', selectors)
    })
    const result = isString(selectors) ? TaroNativeModule.querySelectDOMSync(this, selectors, false) : null

    return !result || !result.length ? null : result[0]
  }

  public querySelectorAll (selectors: string): TaroElement[] {
    runInDebug(() => {
      printInfo('querySelectorAll', this._nid, this.nodeName, 'selectors:', selectors)
    })
    const result = isString(selectors) ? TaroNativeModule.querySelectDOMSync(this, selectors, true) : null

    return !result || !result.length ? [] : result
  }

  public getComputedStyle () {
    // Note: HiLog 直接输出 Proxy 对象会崩溃，后续切换到 JSVM 如果还存在这个问题可以再做优化
    return new Proxy({}, {
      get: (_, name = '') => {
        runInDebug(() => {
          printInfo('getComputedStyle', this._nid, this.nodeName, 'name:', name)
        })
        return isString(name) ? TaroNativeModule.getComputedStyle(this, name) : null
      }
    })
  }
}

export class TaroTextNode extends TaroNode {
  constructor(value = '', nodeName = '#text', nodeType: NodeType = NodeType.TEXT_NODE) {
    super(nodeName, nodeType)
    TaroNativeModule.createTaroNode(this)
    this.textContent = value
  }

  public get data (): string {
    return this.textContent
  }

  public set data (value: string) {
    this.textContent = value
  }
}
