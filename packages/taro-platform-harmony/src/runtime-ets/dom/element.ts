import { eventSource } from '@tarojs/runtime/dist/runtime.esm'

import { ATTRIBUTES_CALLBACK_TRIGGER_MAP, ID } from '../constant'
import { isElement } from '../utils'
import { triggerAttributesCallback } from '../utils/info'
import { ClassList } from './class-list'
import { NodeType, TaroNode } from './node'
import { treeToArray } from './tree'

import type { ICSSStyleDeclaration } from './cssStyleDeclaration'

type NamedNodeMap = ({ name: string, value: string })[]

class TaroElement extends TaroNode {

  public _attrs: Record<string, any> = {}

  private _innerHTML = ''
  public readonly tagName: string

  // 用于标记元素是否已经出现
  private _appearResolve: (value?: unknown) => void
  public awaitAppear: Promise<unknown> 
  public resolveAppear = () => this._appearResolve()

  // public changeRecord = ''

  constructor(tagName: string) {
    super(tagName.replace(/(?<=.)([A-Z])/g, '-$1').toUpperCase(), NodeType.ELEMENT_NODE)
    this.tagName = this.nodeName
    
    this.awaitAppear = new Promise(resolve => { this._appearResolve = resolve })
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

  public getElementById (id: string | undefined | null): TaroElement {
    const arr = treeToArray(this, (el) => {
      return el.id === id
    })
    return arr[0]
  }

  public getElementsByTagName (tagName: string): TaroElement[] {
    return treeToArray(this, (el) => {
      return el.nodeName === tagName || (tagName === '*' && this !== el)
    })
  }

  public getElementsByClassName (className: string): TaroElement[] {
    const classNames = className.trim().split(/\s+/)

    return treeToArray(this, (el) => {
      const classList = el.classList
      return classNames.every(c => classList.contains(c))
    })
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

class TaroViewElement extends TaroElement {
  constructor() {
    super('View')
  }
}

class TaroTextElement extends TaroElement {
  constructor() {
    super('Text')
  }
}

class TaroImageElement extends TaroElement {
  constructor() {
    super('Image')
  }
}

class TaroButtonElement extends TaroElement {
  constructor() {
    super('Button')
  }
}


class TaroFormWidgetElement extends TaroElement {

  public get name () {
    return this._attrs.name
  }
  
  public set name (val) {
    this._attrs.name = val
  }

  public get value () {
    return ''
  }

  public set value (val: any) {
    if (this._instance) {
      this._instance.value = val
    }
    this._attrs.value = val
  }
}

class TaroInputElement extends TaroFormWidgetElement {
  constructor() {
    super('Input')
  }

  public get value () {
    if (this._instance) {
      return this._instance.text
    } else {
      return this._attrs.value || ''
    }
  }

  public set value (val) {
    if (this._instance) {
      this._instance.text = val
    }
    this._attrs.value = val
  }
}

class TaroSliderElement extends TaroFormWidgetElement {
  constructor() {
    super('Slider')
  }

  public get value () {
    if (this._instance) {
      return this._instance.value
    } else {
      return this._attrs.value || ''
    }
  }

  public set value (val) {
    if (this._instance) {
      this._instance.value = val
    }
  }
}

class TaroSwitchElement extends TaroFormWidgetElement {
  constructor() {
    super('Switch')
  }

  public get value () {
    if (this._instance) {
      return this._instance.value
    } else {
      return this._attrs.checked || ''
    }
  }

  public set value (val) {
    if (this._instance) {
      this._instance.value = val
    }
  }
}

class TaroCheckboxGroupElement extends TaroFormWidgetElement {
  constructor() {
    super('CheckboxGroup')
  }

  public get value () {
    if (this._instance) {
      return this._instance.getValues()
    }
  }
}

class TaroRadioGroupElement extends TaroFormWidgetElement {
  constructor() {
    super('RadioGroup')
  }

  public get value () {
    if (this._instance) {
      return this._instance.getValue()
    }
  }

}

class TaroPickerElement extends TaroFormWidgetElement {
  constructor() {
    super('Picker')
  }

  public get value () {
    if (this._instance) {
      if (this._instance.select instanceof Array) {
        return this._instance.select.join(',')
      }
      return this._instance.select
    }
  }

  public set value (val) {
    if (this._instance) {
      this._instance.select = val
    }
  }
}

class TaroVideoElement extends TaroElement {
  constructor() {
    super('Video')
  }

  async play() {
    try {
      this._instance.controller.start()
      return Promise.resolve()
    } catch (e) {
      return Promise.reject(e)
    }
  }

  pause() {
    try {
      this._instance.controller.pause()
      return Promise.resolve()
    } catch (e) {
      return Promise.reject(e)
    }
  }

  stop() {
    try {
      this._instance.controller.stop()
      return Promise.resolve()
    } catch (e) {
      return Promise.reject(e)
    }
  }

  get currentTime() {
    return this._instance.nodeInfoMap[this._nid].currentTime || 0
  }

  set currentTime(val: number) {
    this._instance.nodeInfoMap[this._nid].currentTime = val
    this._instance.controller.setCurrentTime(val)
  }
}

class TaroIgnoreElement extends TaroElement {
  isIgnore = true

  constructor() {
    super('Ignore')
  }
}

class FormElement extends TaroElement {

  // public get type () {
  //   return this._attrs.type ?? ''
  // }
  //
  // public set type (val: string) {
  //   this.setAttribute('type', val)
  // }

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
  FormElement,
  TaroButtonElement,
  TaroCheckboxGroupElement,
  TaroElement,
  TaroFormWidgetElement,
  TaroIgnoreElement,
  TaroImageElement,
  TaroInputElement,
  TaroPickerElement,
  TaroRadioGroupElement,
  TaroSliderElement,
  TaroSwitchElement,
  TaroTextElement,
  TaroVideoElement,
  TaroViewElement 
}

