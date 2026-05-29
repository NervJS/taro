import window from '@ohos.window'
import { isNumber } from '@tarojs/shared'

import { Current } from '../../current'
import { TaroNativeModule } from '../../harmony-library'
import { createTaroEvent, eventHandler, TaroEvent } from '../event'
import { TaroElement } from './element'

import type { common } from '@kit.AbilityKit'
import type {
  CheckboxGroupProps,
  CheckboxProps,
  InputProps,
  LabelProps,
  PickerDateProps,
  PickerMultiSelectorProps,
  PickerSelectorProps, PickerTimeProps,
  RadioGroupProps,
  RadioProps,
  RichTextProps,
  SliderProps,
  StandardProps,
  SwitchProps,
  TextareaProps
} from '@tarojs/components/types'
import type { TaroAny } from '../../interface'

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

    this._name = this._attrs.name || ''
    this._nodeInfo._value = this._attrs.value || ''
  }

  // FIXME ets form 组件移除后，此方法应该移除
  public setAttribute (name: string, value: any): void {
    super.setAttribute(name, value)

    if (name === 'name') {
      this.updateFormWidgetName(value)
    }

    if (name === 'value') {
      this.updateFormWidgetValue(value)

      if (this._instance) {
        this._instance.value = value
      }
    }
  }

  public removeAttribute(name: string): void {
    if (name === 'value') {
      this.value = ''
    }
  }

  public get name () {
    return this.getAttribute('name') || ''
  }

  public set name (val: string) {
    this.setAttribute('name', val)
  }

  public get value () {
    return this.getAttribute('value') || ''
  }

  public set value (val: TaroAny) {
    this.setAttribute('value', val)
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

  public focus () {
    return TaroNativeModule.executeNodeFunc(this, 'focus', [])
  }

  public blur () {
    return TaroNativeModule.executeNodeFunc(this, 'blur', [])
  }
}

class TaroCheckedElement<T extends StandardProps & { checked?: boolean } = StandardProps & { checked?: boolean }> extends TaroFormWidgetElement<T> {
  _checked = false

  constructor(tagName: string) {
    super(tagName)

    this._checked = this._attrs.checked || false
  }

  get checked () {
    return this.getAttribute('checked') || false
  }

  set checked (val: boolean) {
    this.setAttribute('checked', val)
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

export class TaroInputElement<T extends FormWidgetProps = InputProps> extends TaroFormWidgetElement<T> {
  _height = 0

  heightChange?: (height: number) => void

  windowClass?: window.Window

  controller = {
    /** @deprecated */
    stopEditing: () => {
      if (typeof this.blur === 'function') this.blur()
    }
  }

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

  private onKeyboardHeightChange (height: number) {
    const event: TaroEvent = createTaroEvent('keyboardHeightChange', { detail: { height: height, duration: 0 } }, this)

    eventHandler(event, 'keyboardHeightChange', this)
  }

  public dispose () {
    if (this.windowClass) {
      try {
        this.windowClass.off('keyboardHeightChange', this.heightChange)
      } catch (err) {
        console.error('Failed to obtain the top window. Cause: ' + JSON.stringify(err))
      }
    }
  }
}

export class TaroTextAreaElement extends TaroInputElement<TextareaProps> {
  constructor() {
    super('TextArea')
  }
}

export class TaroCheckboxElement extends TaroCheckedElement<CheckboxProps> {
  constructor() {
    super('Checkbox')
  }
}

export class TaroRadioElement extends TaroCheckedElement<RadioProps> {
  public group?: string

  constructor() {
    super('Radio')
  }
}

export class TaroSliderElement extends TaroFormWidgetElement<SliderProps> {
  constructor() {
    super('Slider')

    this._nodeInfo._value = Number(this._attrs.value || 0)
  }

  public setAttribute(name: string, value: TaroAny): void {
    super.setAttribute(name, value)

    // Note: 使用 @ComponentV2 时，需要在 struct 将参数声明为 @Local 并在此更新
    if (this._instance) {
      const attrName = `attr${name.charAt(0).toUpperCase()}${name.slice(1)}`
      this._instance[attrName] = value
    }
  }
}

export class TaroPickerElement extends TaroFormWidgetElement<PickerSelectorProps | PickerTimeProps | PickerDateProps | PickerMultiSelectorProps> {
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
export class TaroSwitchElement extends TaroCheckedElement<SwitchProps> {
  constructor() {
    super('Switch')
  }
}

export class TaroCheckboxGroupElement extends TaroFormWidgetElement<CheckboxGroupProps> {
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

export class TaroRadioGroupElement extends TaroFormWidgetElement<RadioGroupProps> {
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

export class TaroLabelElement extends TaroElement<LabelProps> {
  constructor() {
    super('Label')
  }
}

@Observed
export class TaroRichTextElement extends TaroElement<RichTextProps> {
  isETS = true

  constructor() {
    super('RichText')
  }
}

export class TaroFormElement extends TaroFormWidgetElement {
  constructor() {
    super('Form')

    // 监听submit冒泡
    // this.addEventListener('submit-btn', (e: TaroEvent) => {
    // })

    // 监听reset冒泡
    // this.addEventListener('reset-btn', (e: TaroEvent) => {
    // })
  }
}

export const FormElement = TaroFormElement
