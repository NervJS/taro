// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Component, h, ComponentInterface, Event, EventEmitter, Element, Listen } from '@stencil/core'

@Component({
  tag: 'taro-form-core'
})
export class Form implements ComponentInterface {
  private form: HTMLFormElement
  private value: {[propName: string]: any} = {}

  @Element() el: HTMLElement

  @Event({
    eventName: 'submit'
  }) onSubmit: EventEmitter

  @Listen('tarobuttonsubmit')
  onButtonSubmit (e: Event) {
    e.stopPropagation()

    this.value = this.getFormValue()

    this.onSubmit.emit({
      value: this.value
    })
  }

  @Listen('tarobuttonreset')
  onButtonReset (e: Event) {
    e.stopPropagation()
    this.form.reset()
  }

  componentDidLoad () {
    this.value = this.getFormValue()

    Object.defineProperty(this.el, 'value', {
      get: () => this.value,
      configurable: true
    })
  }

  getFormValue () {
    const el = this.el
    const elements: HTMLInputElement[] = []
    const tagElements = el.getElementsByTagName('input')
    for (let j = 0; j < tagElements.length; j++) {
      elements.push(tagElements[j])
    }
    const formItem = {}
    const hash = {}
    elements.forEach(item => {
      if (item.className.indexOf('weui-switch') !== -1) {
        formItem[item.name] = item.checked
        return
      }
      if (item.type === 'radio') {
        if (item.checked) {
          hash[item.name] = true
          formItem[item.name] = item.value
        } else {
          if (!hash[item.name]) {
            formItem[item.name] = ''
          }
        }
        return
      }

      if (item.type === 'checkbox') {
        if (item.checked) {
          if (hash[item.name]) {
            formItem[item.name].push(item.value)
          } else {
            hash[item.name] = true
            formItem[item.name] = [item.value]
          }
        } else {
          if (!hash[item.name]) {
            formItem[item.name] = []
          }
        }
        return
      }
      formItem[item.name] = item.value
    })

    const textareaElements = el.getElementsByTagName('textarea')
    const textareaEleArr: HTMLTextAreaElement[] = []

    for (let i = 0; i < textareaElements.length; i++) {
      textareaEleArr.push(textareaElements[i])
    }
    textareaEleArr.forEach(v => {
      formItem[v.name] = v.value
    })
    return formItem
  }

  render () {
    return (
      <form
        ref={dom => {
          if (dom) {
            this.form = dom
          }
        }}
      >
        <slot />
      </form>
    )
  }
}
