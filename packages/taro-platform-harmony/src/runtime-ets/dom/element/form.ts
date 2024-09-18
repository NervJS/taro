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
  SliderProps,
  StandardProps,
  SwitchProps,
  TextareaProps
} from '@tarojs/components/types'
import type { TaroAny } from '../../utils'

interface FormWidgetProps extends StandardProps {
  name?: string
  value?: string | number | number[] | string[] | Record<string, TaroAny>[]
}

class TaroFormWidgetElement<T extends FormWidgetProps = FormWidgetProps> extends TaroElement<T> {
  _isInit = false

  _name = ''

  _reset: TaroAny = ''

  constructor (tagName: string) {
    super(tagName)

    bindFocus(this)

    this._name = this._attrs.name || ''
    this._nodeInfo._value = this._attrs.value || ''
  }

  public setAttribute (name: string, value: any): void {
    super.setAttribute(name, value)

    if (name === 'name') {
      this.name = value
    }

    if (name === 'value') {
      this.value = value
    }
  }

  public removeAttribute(name: string): void {
    if (name === 'value') {
      this.value = ''
    }
  }

  public get name () {
    return this._attrs.name || ''
  }

  public set name (val: string) {
    this.updateFormWidgetName(val)
  }

  public get value () {
    return this._nodeInfo._value
  }

  public set value (val: TaroAny) {
    this.updateFormWidgetValue(val)

    if (this._instance) {
      this._instance.value = val
    }
  }

  public updateFormWidgetName (val: string) {
    this._name = val
    this._attrs.name = val
  }

  public updateFormWidgetValue (val: TaroAny) {
    this._nodeInfo._value = val
    this._attrs.value = val
  }

  public reset () {
    this.value = this._reset
  }
}

class TaroCheckedElement<T extends StandardProps & { checked?: boolean } = StandardProps & { checked?: boolean }> extends TaroFormWidgetElement<T> {
  _checked = false

  constructor(tagName: string) {
    super(tagName)

    this._checked = this._attrs.checked || false
  }

  public setAttribute (name: string, value: any): void {
    super.setAttribute(name, value)

    if (name === 'checked') {
      this.checked = value
    }
  }

  get checked () {
    return this._checked || false
  }

  set checked (val: boolean) {
    this.updateCheckedValue(val)
  }

  public updateCheckedValue (val: boolean) {
    this._checked = val
    this._attrs.checked = val
  }

  public reset () {
    this.checked = this._reset
  }
}

@Observed
class TaroInputElement<T extends FormWidgetProps = InputProps> extends TaroFormWidgetElement<T> {
  _height = 0

  heightChange?: (height: number) => void

  windowClass?: window.Window

  controller: TextInputController = new TextInputController()

  constructor(tagName = 'Input') {
    super(tagName)

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

  public get value () {
    return super.value
  }

  public set value (val: TaroAny) {
    super.value = `${val}`
  }

  private onKeyboardHeightChange (height: number) {
    const event: TaroEvent = createTaroEvent('keyboardHeightChange', { detail: { height: height, duration: 0 } }, this)

    eventHandler(event, 'keyboardHeightChange', this)
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

@Observed
class TaroTextAreaElement extends TaroInputElement<TextareaProps> {
  controller: TextAreaController = new TextAreaController()

  constructor() {
    super('TextArea')
  }
}
@Observed
class TaroCheckboxElement extends TaroCheckedElement<CheckboxProps> {
  constructor() {
    super('Checkbox')
  }
}

@Observed
class TaroRadioElement extends TaroCheckedElement<RadioProps> {
  public group?: string

  constructor() {
    super('Radio')
  }
}

@Observed
class TaroSliderElement extends TaroFormWidgetElement<SliderProps> {
  constructor() {
    super('Slider')

    this._nodeInfo._value = Number(this._attrs.value || 0)
  }
}
@Observed
class TaroPickerElement extends TaroFormWidgetElement<PickerSelectorProps | PickerTimeProps | PickerDateProps | PickerMultiSelectorProps> {
  constructor() {
    super('Picker')
  }

  public getCurrentSelect () {
    switch (this._attrs.mode) {
      case 'time':
      case 'date':
        return this.value
      case 'selector': {
        const key = this._attrs.rangeKey
        const item = this._attrs.range[this.value]

        if (key) {
          return item[key]
        } else {
          return item
        }
      }
      case 'multiSelector': {
        const key = this._attrs.rangeKey

        return this._attrs.range.map((rangeList: TaroAny[], index: number) => {
          const obj = rangeList[this.value[index]]

          if (key) {
            return obj[key]
          } else {
            return obj
          }
        }).join(',')
      }
      default:
        return ''
    }
  }

  public reset() {
    super.reset()

    const event: TaroEvent = createTaroEvent('change', { detail: { value: this._reset } }, this)

    event.stopPropagation()
    eventHandler(event, 'change', this)
  }
}

@Observed
class TaroSwitchElement extends TaroCheckedElement<SwitchProps> {
  constructor() {
    super('Switch')
  }
}
@Observed
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

  public set value (_) { }

  public reset () {
    this.getElementsByTagName<TaroCheckboxElement>('CHECKBOX').forEach((element) => {
      element.reset()
    })
  }
}

@Observed
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

  public set value (_) { }

  public reset () {
    this.getElementsByTagName<TaroCheckboxElement>('RADIO').forEach((element) => {
      element.reset()
    })
  }
}

@Observed
class TaroFormElement extends TaroFormWidgetElement {
  constructor() {
    super('Form')

    // 监听submit冒泡
    this.addEventListener('submit-btn', (e: TaroEvent) => {
      e.stopPropagation()
      const formResult: Record<string, any> = {}

      findChildNodeWithDFS<TaroFormWidgetElement>(this, item => {
        if (!item.name) return false

        switch (item.nodeName) {
          case 'INPUT':
          case 'RADIO':
          case 'SLIDER':
          case 'TEXTAREA':
          case 'CHECKBOX':
          case 'RADIO-GROUP':
          case 'CHECKBOX-GROUP': {
            formResult[item.name] = item.value
            break
          }
          case 'SWITCH':
            formResult[item.name] = (item as TaroSwitchElement).checked
            break
          case 'PICKER':
            formResult[item.name] = (item as TaroPickerElement).getCurrentSelect()
            break
        }
        return false
      }, true)
      const event: TaroEvent = createTaroEvent('submit', { detail: { value: formResult } }, this)
      eventHandler(event, 'submit', this)
    })

    // 监听reset冒泡
    this.addEventListener('reset-btn', (e: TaroEvent) => {
      findChildNodeWithDFS<TaroFormWidgetElement>(this, item => {
        e.stopPropagation()
        switch (item.nodeName) {
          case 'INPUT':
          case 'SLIDER':
          case 'PICKER':
          case 'RADIO':
          case 'SWITCH':
          case 'CHECKBOX':
          case 'TEXTAREA':
          case 'RADIO-GROUP':
          case 'CHECKBOX-GROUP': {
            item.reset()
            break
          }
        }
        return false
      }, true)
    })
  }
}

const FormElement = TaroFormElement

export {
  FormElement,
  TaroCheckboxElement,
  TaroCheckboxGroupElement,
  TaroFormElement,
  TaroInputElement,
  TaroPickerElement,
  TaroRadioElement,
  TaroRadioGroupElement,
  TaroSliderElement,
  TaroSwitchElement,
  TaroTextAreaElement
}
