import { inject, injectable } from 'inversify'
import { Shortcuts, ensure } from '@tarojs/shared'
import SERVICE_IDENTIFIER from '../constants/identifiers'
import { NodeType } from './node_types'
import { incrementId } from '../utils'
import { TaroEventTarget } from './event-target'
import { hydrate } from '../hydrate'
import { eventSource } from './event-source'
import { ElementNames } from '../interface'
import {
  STYLE,
  DATASET,
  PROPS,
  OBJECT
} from '../constants'

import type { UpdatePayload, InstanceNamedFactory } from '../interface'
import type { TaroDocument } from './document'
import type { TaroRootElement } from './root'
import type { TaroElement } from './element'
import type { TaroNodeImpl } from '../dom-external/node-impl'
import type { Hooks } from '../hooks'

const nodeId = incrementId()

@injectable()
export class TaroNode extends TaroEventTarget {
  public uid: string
  public nodeType: NodeType
  public nodeName: string
  public parentNode: TaroNode | null = null
  public childNodes: TaroNode[] = []

  protected _getElement: InstanceNamedFactory

  public constructor (// eslint-disable-next-line @typescript-eslint/indent
    @inject(SERVICE_IDENTIFIER.TaroNodeImpl) impl: TaroNodeImpl,
    @inject(SERVICE_IDENTIFIER.TaroElementFactory) getElement: InstanceNamedFactory,
    @inject(SERVICE_IDENTIFIER.Hooks) hooks: Hooks
  ) {
    super(hooks)
    impl.bind(this)
    this._getElement = getElement
    this.uid = `_n_${nodeId()}`
    eventSource.set(this.uid, this)
  }

  private hydrate = (node: TaroNode) => () => hydrate(node as TaroElement)

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
      const indexOfNode = parentNode.findIndex(this)
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

    this.enqueueUpdate(payload)

    if (!eventSource.has(newChild.uid)) {
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
    this.parentNode?.removeChild(this, isReplace)
  }

  public hasChildNodes () {
    return this.childNodes.length > 0
  }

  public enqueueUpdate (payload: UpdatePayload) {
    this._root?.enqueueUpdate(payload)
  }

  public cloneNode (isDeep = false) {
    const document = this._getElement<TaroDocument>(ElementNames.Document)()
    let newNode

    if (this.nodeType === NodeType.ELEMENT_NODE) {
      newNode = document.createElement(this.nodeName)
    } else if (this.nodeType === NodeType.TEXT_NODE) {
      newNode = document.createTextNode('')
    }

    for (const key in this) {
      const value: any = this[key]
      if ([PROPS, DATASET].includes(key) && typeof value === OBJECT) {
        newNode[key] = { ...value }
      } else if (key === '_value') {
        newNode[key] = value
      } else if (key === STYLE) {
        newNode.style._value = { ...value._value }
        newNode.style._usedStyleProp = new Set(Array.from(value._usedStyleProp))
      }
    }

    if (isDeep) {
      newNode.childNodes = this.childNodes.map(node => node.cloneNode(true))
    }

    return newNode
  }

  public contains (node: TaroNode & { id?: string }): boolean {
    let isContains = false
    this.childNodes.some(childNode => {
      const { uid } = childNode
      if (uid === node.uid || uid === node.id || childNode.contains(node)) {
        isContains = true
        return true
      }
    })
    return isContains
  }
}
