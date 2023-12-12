// @ts-nocheck
import { eventSource } from '@tarojs/runtime/dist/runtime.esm'

import { StandardProps } from '../../components/types'
import { ATTRIBUTES_CALLBACK_TRIGGER_MAP, ID } from '../constant'
import { findChildNodeWithDFS, isElement } from '../utils'
import { triggerAttributesCallback } from '../utils/info'
import { ClassList } from './class-list'
import { NodeType, TaroNode } from './node'

import type { TaroAny } from '../utils'
import type { ICSSStyleDeclaration } from './cssStyleDeclaration'

type NamedNodeMap = ({ name: string, value: string })[]

interface TaroAttributeProps extends StandardProps {
  compileMode?: string | boolean
  compileIf?: boolean
  disabled?: boolean
}

export class TaroElement<T extends TaroAttributeProps = TaroAttributeProps> extends TaroNode {
  public _attrs: T = {}
  // eslint-disable-next-line no-new-object
  public _nodeInfo: TaroAny = new Object()
  public _innerHTML = ''
  public readonly tagName: string

  constructor(tagName: string) {
    super(tagName.replace(/(?<=.)([A-Z])/g, '-$1').toUpperCase(), NodeType.ELEMENT_NODE)
    this.tagName = this.nodeName
  }

  public set id (value: string) {
    this.setAttribute('id', value)
  }

  public get id (): string {
    return this.getAttribute('id') || this._nid
  }

  public set className (value: string) {
    this.setAttribute('class', value)
  }

  public get className (): string {
    return this.getAttribute('class') || ''
  }

  public get classList (): ClassList {
    return new ClassList(this.className, this)
  }

  public get attributes (): NamedNodeMap {
    const list: NamedNodeMap = []
    for (const name in this._attrs) {
      const value = this._attrs[name]
      list.push({ name, value })
    }
    return list
  }

  public get children (): TaroElement[] {
    return this.childNodes.filter(isElement)
  }

  public setAttribute (name: string, value: any): void {
    if (name === ID) {
      eventSource.delete(this._attrs.id)
      eventSource.set(value, this as any)
    }

    this._attrs[name] = value

    const attributeTriggerValue = ATTRIBUTES_CALLBACK_TRIGGER_MAP[name]
    if (attributeTriggerValue) {
      const { triggerName, valueInspect } = attributeTriggerValue

      if (valueInspect && !valueInspect(value)) return

      triggerAttributesCallback(this, triggerName)
    }
  }

  public getAttribute (name: string): string {
    return this._attrs[name]
  }

  public removeAttribute (name: string): void {
    delete this._attrs[name]
  }

  public hasAttribute (name: string): boolean {
    return this._attrs.hasOwnProperty(name)
  }

  public hasAttributes (): boolean {
    return Object.keys(this._attrs).length > 0
  }

  public getElementById (id: string | undefined | null): TaroElement | null {
    return findChildNodeWithDFS(this, (el) => {
      return el.id === id
    }, false)
  }

  public getElementsByTagName<T> (tagName: string): T[] {
    return findChildNodeWithDFS(this, (el) => {
      return el.nodeName === tagName || (tagName === '*' && this !== el)
    }, true) || []
  }

  public getElementsByClassName (className: string): TaroElement[] {
    const classNames = className.trim().split(/\s+/)

    return findChildNodeWithDFS(this, (el) => {
      const classList = el.classList
      return classNames.every(c => classList.contains(c))
    }, true) || []
  }

  // TODO dataset

  public set innerHTML (value: string) {
    if (this.nodeType === NodeType.ELEMENT_NODE) {
      const ele = this.ownerDocument.createElement('inner-html')
      ele._innerHTML = value
      this.appendChild(ele)
    }
  }

  public get innerHTML (): string {
    return this._innerHTML
  }

  public _st: Record<string, string | number | object> = {}

  public _style: ICSSStyleDeclaration

  public get style (): ICSSStyleDeclaration {
    return this._style
  }
}

// React-Reconciler 需要用到 FormElement，但 FormElement 在 element.ets 中生成的，React-Reconciler 无法引入，因此在此处生成 FormElement 的基类，供后续使用
export class FormElement extends TaroElement {
  constructor () {
    super('Form')
  }
}