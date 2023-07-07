import { isElement } from '../utils/index'
import { NodeType, TaroNode } from './Node'

import type { ICSSStyleDeclaration } from './CSSStyleDeclaration'

type NamedNodeMap = ({ name: string, value: string })[]

class TaroElement extends TaroNode {
  public _attrs: Record<string, string> = {}
  public readonly tagName: string
  public innerHTML: string

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
    this._attrs = { ...this._attrs, [name]: String(value) }
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
  // innerHTML

  public _st: Record<string, string | number> = {}

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
export class TaroFormElement extends TaroElement {
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
  TaroElement,
  TaroImageElement,
  TaroTextElement,
  TaroViewElement }