import { isElement } from '../utils'
import { NodeType, TaroNode } from './node'

import type { ICSSStyleDeclaration } from './cssStyleDeclaration'

type NamedNodeMap = ({ name: string, value: string })[]

class TaroElement extends TaroNode {
  public _attrs: Record<string, string> = {}
  public props: Record<string, any> = {}
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
    this._attrs[name] = String(value)
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
class TaroView extends TaroElement {
  constructor() {
    super('View')
  }
}

@Observed
class TaroText extends TaroElement {
  constructor() {
    super('Text')
  }
}

@Observed
class TaroImage extends TaroElement {
  constructor() {
    super('Image')
  }
}

export {
  TaroElement,
  TaroImage,
  TaroText,
  TaroView,
}
