import window from '@ohos.window'
import { isNumber } from '@tarojs/shared'

import { Current } from '../../current'
import { findChildNodeWithDFS } from '../../utils'
import { bindFocus } from '../bind'
import { createTaroEvent, eventHandler, TaroEvent } from '../event'
import { TaroElement } from './element'

import type {
  CheckboxGroupProps,
  CheckboxProps,
  InputProps,
  PickerDateProps,
  PickerMultiSelectorProps,
  PickerSelectorProps, PickerTimeProps,
  RadioGroupProps,
  RadioProps,
  StandardProps,
  TextareaProps,
} from '@tarojs/components/types'
import type { TaroAny } from '../../utils'
import type { TaroSliderElement } from './slider'
import type { TaroSwitchElement } from './switch'

interface FormWidgetProps extends StandardProps {
  name?: string
  value?: string | number | number[] | string[] | Record<string, TaroAny>[]
}

class TaroFormWidgetElement<T extends FormWidgetProps = FormWidgetProps> extends TaroElement<T> {
  _value: TaroAny = ''

  constructor (tagName: string) {
    super(tagName)

    bindFocus(this)
    this._value = this._attrs.value || ''
  }

  public get name () {
    return this._attrs.name || ''
  }

  public set name (val: string) {
    this._attrs.name = val
  }

  public get value () {
    return this._value
  }

  public set value (val: TaroAny) {
    this._value = val
    this._attrs.value = val
    this.updateComponent()
  }
}

class TaroCheckedElement<T extends StandardProps & { checked?: boolean }> extends TaroElement<T> {
  _checked = false

  constructor(tagName: string) {
    super(tagName)

    this._checked = this._attrs.checked || false
  }

  get checked () {
    return this._attrs.checked || false
  }

  set checked (val: boolean) {
    this.updateCheckedValue(val)
    this.updateComponent()
  }

  public updateCheckedValue (val: boolean) {
    this._checked = val
    this._attrs.checked = val
  }
}

class TaroInputElement<T extends FormWidgetProps = InputProps> extends TaroFormWidgetElement<T> {
  _text = ''

  _height = 0

  heightChange?: (height: number) => void

  windowClass?: window.Window

  controller: TextInputController = new TextInputController()

  constructor(tagName = 'Input') {
    super(tagName)

    this._text = this._attrs.value || ''

    try {
      Current.contextPromise
        .then((context: common.BaseContext) => {
          return window.getLastWindow(context, (err, windowClass: window.Window) => {
            const errCode: number = err.code

            if (errCode) {
              console.error('Failed to obtain the top window. Cause: ' + JSON.stringify(err))
              return
            }

            this.windowClass = windowClass
            const heightChange = (height: number) => {
              if (isNumber(height)) {
                if (this._height !== height) {
                  this.onKeyboardHeightChange(height)
                  this._height = height
                }
              }
            }
            windowClass.on('keyboardHeightChange', heightChange)
          })
        })
    } catch (exception) {
      console.error('Failed to obtain the top window. Cause: ' + JSON.stringify(exception))
    }
  }

  private onKeyboardHeightChange (height: number) {
    const event: TaroEvent = createTaroEvent('keyboardHeightChange', { detail: { height: height, duration: 0 } }, this)

    eventHandler(event, 'keyboardHeightChange', this)
  }

  public setAttribute (name: string, value: TaroAny): void {
    super.setAttribute(name, value)

    if (name === 'value') {
      this.value = value
    }
  }

  public get value () {
    return this._text
  }

  public set value (val: string) {
    this._text = val
    this.updateComponent()
  }

  public dispose () {
    super.dispose()

    if (this.windowClass) {
      try {
        this.windowClass.off('keyboardHeightChange', this.heightChange)
      } catch (err) {
        console.error('Failed to obtain the top window. Cause: ' + JSON.stringify(err))
      }
    }
  }
}


class TaroTextAreaElement extends TaroInputElement<TextareaProps>{
  controller: TextAreaController = new TextAreaController()

  constructor() {
    super('TextArea')
  }
}

class TaroCheckboxGroupElement extends TaroFormWidgetElement<CheckboxGroupProps> {
  constructor() {
    super('CheckboxGroup')
  }

  public get value () {
    const childList = this.getElementsByTagName<TaroCheckboxElement>('CHECKBOX')
    const result: string[] = []
    childList.forEach(element => {
      if (element.checked) {
        result.push(element._attrs.value)
      }
    })
    return result
  }
}

class TaroRadioGroupElement extends TaroFormWidgetElement<RadioGroupProps> {
  constructor() {
    super('RadioGroup')
  }

  public get value () {
    const childList = this.getElementsByTagName<TaroRadioElement>('RADIO')
    for (let i = 0; i < childList.length; i++) {
      if (childList[i].checked) {
        return childList[i]._attrs.value
      }
    }

    return undefined
  }
}

// TODO: 待 review
class TaroFormElement extends TaroFormWidgetElement {
  constructor() {
    super('Form')

    // 监听submit冒泡
    this.addEventListener('submit-btn', (e: TaroEvent) => {
      e.stopPropagation()
      const formResult: Record<string, string> = {}
      findChildNodeWithDFS<TaroFormWidgetElement>(this as TaroElement, item => {
        switch (item.nodeName) {
          case 'INPUT':
          case 'SLIDER':
          case 'SWITCH':
          case 'RADIO-GROUP':
          case 'CHECKBOX-GROUP':
          case 'PICKER': {
            formResult[item.name] = item.value
            break
          }
        }
        return false
      }, true)
      const event: TaroEvent = createTaroEvent('submit', { detail: { value: formResult } }, this)
      eventHandler(event, 'submit', this)
    })

    // 监听reset冒泡
    this.addEventListener('reset-btn', (e: TaroEvent) => {
      findChildNodeWithDFS(this, (item: TaroFormWidgetElement) => {
        e.stopPropagation()
        switch (item.nodeName) {
          case 'INPUT': {
            item.value = (item as TaroInputElement)._attrs.value
            break
          }
          case 'SLIDER': {
            item.value = (item as TaroSliderElement)._attrs.value
            break
          }
          case 'SWITCH': {
            item.value = (item as TaroSwitchElement)._attrs.checked
            break
          }
          case 'RADIO-GROUP': {
            item.getElementsByTagName<TaroRadioElement>('RADIO').forEach((element: TaroRadioElement) => {
              element.checked = element._attrs.checked || false
              element.updateComponent()
            })
            break
          }
          case 'CHECKBOX-GROUP': {
            item.getElementsByTagName<TaroCheckboxElement>('CHECKBOX').forEach((element: TaroCheckboxElement) => {
              element.checked = element._attrs.checked || false
              element.updateComponent()
            })
            break
          }
          case 'PICKER': {
            item.value = (item as TaroPickerElement)._attrs.value
            break
          }
        }
        return false
      }, true)
    })
  }

  public get value () {
    const val = this._attrs.value
    return val == null ? '' : val
  }

  public set value (val: string | boolean | number | TaroAny[]) {
    this.setAttribute('value', val)
  }
}

class TaroCheckboxElement extends TaroCheckedElement<CheckboxProps>{
  constructor() {
    super('Checkbox')
  }
}

class TaroRadioElement extends TaroCheckedElement<RadioProps>{
  public group?: string

  constructor() {
    super('Radio')
  }
}

// TODO: 待 review
class TaroPickerElement extends TaroFormWidgetElement<PickerSelectorProps | PickerTimeProps | PickerDateProps | PickerMultiSelectorProps> {
  select: TaroAny

  constructor() {
    super('Picker')
  }

  public get value () {
    if (this.select instanceof Array) {
      return this.select.join(',')
    }

    return this.select
  }

  public set value (val: TaroAny) {
    this.select = val
  }
}

const FormElement = TaroFormElement

export {
  FormElement,
  TaroCheckboxElement,
  TaroCheckboxGroupElement,
  TaroFormElement,
  TaroFormWidgetElement,
  TaroInputElement,
  TaroPickerElement,
  TaroRadioElement,
  TaroRadioGroupElement,
  TaroTextAreaElement
}