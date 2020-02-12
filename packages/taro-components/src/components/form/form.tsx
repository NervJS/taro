import { Component, h, ComponentInterface, Event, EventEmitter, Element } from '@stencil/core'

@Component({
  tag: 'taro-form'
})
export class Form implements ComponentInterface {
  @Event({
    eventName: 'submit'
  }) onSubmit: EventEmitter

  @Event({
    eventName: 'reset'
  }) onReset: EventEmitter

  @Element() el: HTMLElement

  submit (e: CustomEvent) {
    e.preventDefault()
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
    this.onSubmit.emit({
      value: formItem
    })
  }


  render () {
    return (
      <form
        onSubmit={this.submit}
        onReset={() => this.onReset.emit()}
      >
        <slot />
      </form>
    )
  }
}
