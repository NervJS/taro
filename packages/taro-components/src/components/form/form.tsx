import { Component, h, ComponentInterface, Event, EventEmitter, Element, Listen, State, Watch } from '@stencil/core'

@Component({
  tag: 'taro-form-core'
})
export class Form implements ComponentInterface {
  private form: HTMLFormElement
  private value: {[propName: string]: any} = {}
  private orginalAppendChild: <T extends Node>(newChild: T) => T
  private orginalInsertBefore: <T extends Node>(newChild: T, refChild: Node | null) => T
  private orginalReplaceChild: <T extends Node>(newChild: Node, oldChild: T) => T
  private orginalRemoveChild: <T extends Node>(oldChild: T) => T

  @Element() el: HTMLElement

  @State() slotParent: HTMLElement | null

  @Event({
    eventName: 'submit'
  }) onSubmit: EventEmitter

  @Watch('slotParent')
  watchSlotParent (newParent: HTMLElement | null) {
    if (!this.orginalAppendChild) {
      this.orginalAppendChild = this.el.appendChild
      this.orginalInsertBefore = this.el.insertBefore
      this.orginalReplaceChild = this.el.replaceChild
      this.orginalRemoveChild = this.el.removeChild
    }
    if (!newParent) {
      this.el.appendChild = this.orginalAppendChild
      this.el.insertBefore = this.orginalInsertBefore
      this.el.replaceChild = this.orginalReplaceChild
      this.el.removeChild = this.orginalRemoveChild
      return
    }
    this.el.appendChild = <T extends Node>(newChild: T): T => {
      return newParent.appendChild(newChild)
    }
    this.el.insertBefore = <T extends Node>(newChild: T, refChild: Node | null): T => {
      return newParent.insertBefore(newChild, refChild)
    }
    this.el.replaceChild = <T extends Node>(newChild: Node, oldChild: T): T => {
      return newParent.replaceChild(newChild, oldChild)
    }
    this.el.removeChild = <T extends Node>(oldChild: T): T => {
      return newParent.removeChild(oldChild)
    }
  }

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

  componentDidRender () {
    this.setSlotParent(this.form)
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

  setSlotParent (el: HTMLElement | null) {
    this.slotParent = el
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
