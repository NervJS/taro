import { eventSource } from '@tarojs/runtime/dist/runtime.esm'

import { ID } from '../constant'
import { isElement } from '../utils'
import { NodeType, TaroNode } from './node'

import type { ICSSStyleDeclaration } from './cssStyleDeclaration'

type NamedNodeMap = ({ name: string, value: string })[]

@Observed
class TaroElement extends TaroNode {
  public _attrs: Record<string, string> = {}
  private _innerHTML = ''
  public readonly tagName: string
  // 动画函数回掉绑定
  public _animationCb?: (value: Record<string, any>) => void
  // public changeRecord = ''

  constructor(tagName: string) {
    super(tagName.toUpperCase(), NodeType.ELEMENT_NODE)
    this.tagName = this.nodeName
  }

  public set id (value: string) {
    this.setAttribute('id', value)
  }

  public get id (): string {
    return this.getAttribute('id') || ''
  }

  public set className (value: string) {
    this.setAttribute('class', value)
  }

  public get className (): string {
    return this.getAttribute('class') || ''
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

    // 监听动画设置
    if (name === 'animation') {
      typeof this._animationCb === 'function' && this._animationCb(value)
    }
    // if (!this.changeRecord.includes(`${name}-${value}`)) {
    //   this.changeRecord += `${name}-${value};`
    // }
  }

  public getAttribute (name: string): string | null {
    return this._attrs[name] || null
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

  // @Todo
  // dataset

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

@Observed
class TaroViewElement extends TaroElement {
  constructor() {
    super('View')
  }
}

@Observed
class TaroTextElement extends TaroElement {
  constructor() {
    super('Text')
  }
}

@Observed
class TaroImageElement extends TaroElement {
  constructor() {
    super('Image')
  }
}

@Observed
class TaroButtonElement extends TaroElement {
  constructor() {
    super('Button')
  }
}

@Observed
export class FormElement extends TaroElement {
  public get type () {
    return this._attrs.type ?? ''
  }

  public set type (val: string) {
    this.setAttribute('type', val)
  }

  public get value () {
    // eslint-disable-next-line dot-notation
    const val = this._attrs.value
    return val == null ? '' : val
  }

  public set value (val: string | boolean | number | any[]) {
    this.setAttribute('value', val)
  }
}


export {
  TaroButtonElement,
  TaroElement,
  TaroImageElement,
  TaroTextElement,
  TaroViewElement
}
