// @ts-nocheck
import { eventSource } from '@tarojs/runtime/dist/runtime.esm'

import { 
  ButtonProps,
  CheckboxGroupProps,
  CheckboxProps,
  FormProps,
  IconProps,
  ImageProps, InputProps,
  LabelProps,
  PickerDateProps,
  PickerMultiSelectorProps,
  PickerSelectorProps,
  PickerTimeProps,
  RadioGroupProps,
  RadioProps,
  RichTextProps,
  ScrollViewProps,
  SliderProps,
  StandardProps,
  SwiperItemProps,
  SwiperProps,
  SwitchProps,
  TextareaProps,
  TextProps,
  VideoProps
} from '../../components/types'
import { ATTRIBUTES_CALLBACK_TRIGGER_MAP, ID } from '../constant'
import { findChildNodeWithDFS, isElement, TaroAny } from '../utils'
import { triggerAttributesCallback } from '../utils/info'
import { ClassList } from './class-list'
import { NodeType, TaroNode } from './node'
import StyleSheet from './stylesheet'

import type { ICSSStyleDeclaration } from './cssStyleDeclaration'

type NamedNodeMap = ({ name: string, value: string })[]

interface TaroAttributeProps extends StandardProps {
  compileMode?: string | boolean
  compileIf?: boolean
  disabled?: boolean
}

export class TaroElement<T extends TaroAttributeProps = TaroAttributeProps> extends TaroNode {

  public _attrs: T = {}

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

  public _st = new StyleSheet()

  public _style: ICSSStyleDeclaration

  public get style (): ICSSStyleDeclaration {
    return this._style
  }
}

export class TaroViewElement extends TaroElement {
  constructor() {
    super('View')
  }
}

export class TaroTextElement extends TaroElement<TextProps> {
  constructor() {
    super('Text')
  }
}

export class TaroImageElement extends TaroElement<ImageProps> {
  constructor() {
    super('Image')
  }
}

export class TaroButtonElement extends TaroElement<ButtonProps> {
  constructor() {
    super('Button')
  }
}


export class TaroFormWidgetElement<T extends TaroAttributeProps = TaroAttributeProps> extends TaroElement<T> {

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

export class TaroInputElement extends TaroFormWidgetElement<InputProps> {
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

export class TaroSliderElement extends TaroFormWidgetElement<SliderProps> {
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

export class TaroSwitchElement extends TaroFormWidgetElement<SwitchProps> {
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

export class TaroCheckboxGroupElement extends TaroFormWidgetElement<CheckboxGroupProps> {
  constructor() {
    super('CheckboxGroup')
  }

  public get value () {
    if (this._instance) {
      return this._instance.getValues()
    }
  }
}

export class TaroRadioGroupElement extends TaroFormWidgetElement<RadioGroupProps> {
  constructor() {
    super('RadioGroup')
  }

  public get value () {
    if (this._instance) {
      return this._instance.getValue()
    }
  }

}

export class TaroPickerElement extends TaroFormWidgetElement<PickerSelectorProps | PickerTimeProps | PickerDateProps | PickerMultiSelectorProps> {
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

export class TaroVideoElement extends TaroElement<VideoProps> {
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

export class TaroScrollViewElement extends TaroElement<ScrollViewProps> {
  constructor() {
    super('ScrollView')
  }
}
export class TaroCheckboxElement extends TaroElement<CheckboxProps> {
  constructor() {
    super('Checkbox')
  }
}
export class TaroRadioElement extends TaroElement<RadioProps> {
  constructor() {
    super('Radio')
  }
  
  public group?: string
}
export class TaroIconElement extends TaroElement<IconProps> {
  constructor() {
    super('Icon')
  }
}
export class TaroLabelElement extends TaroElement<LabelProps> {
  constructor() {
    super('Label')
  }
}
export class TaroRichTextElement extends TaroElement<RichTextProps> {
  constructor() {
    super('RichText')
  }
}
export class TaroSwiperElement extends TaroElement<SwiperProps> {
  constructor() {
    super('Swiper')
  }
}
export class TaroSwiperItemElement extends TaroElement<SwiperItemProps> {
  constructor() {
    super('SwiperItem')
  }
}
export class TaroTextAreaElement extends TaroElement<TextareaProps> {
  constructor() {
    super('TextArea')
  }
}

export class TaroIgnoreElement extends TaroElement {
  isIgnore = true

  constructor() {
    super('Ignore')
  }
}

export class FormElement extends TaroElement<FormProps> {
  constructor() {
    super('Form')
  }
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

