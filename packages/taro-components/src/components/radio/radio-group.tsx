/*
 *  MIT License
 *  
 *  Copyright (c) 2018 O2Team、58.com、other contributors
 *  
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *  
 *  The above copyright notice and this permission notice shall be included in all
 *  copies or substantial portions of the Software.
 *  
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
*/

import { Component, h, ComponentInterface, Host, Prop, Event, EventEmitter, Listen, Element } from '@stencil/core'

@Component({
  tag: 'taro-radio-group-core'
})
export class RadioGroup implements ComponentInterface {
  private uniqueName = Date.now().toString(36)
  private value: string

  @Prop() name

  @Element() el: HTMLElement

  @Event({
    eventName: 'change'
  })
  onChange: EventEmitter

  @Listen('radiochange')
  function (e: CustomEvent<{ value: string }>) {
    e.stopPropagation()
    if ((e.target as Element).tagName !== 'TARO-RADIO-CORE') return

    const target = e.target as HTMLTaroRadioCoreElement
    if (target.checked) {
      const childList = this.el.querySelectorAll('taro-radio-core')

      childList.forEach(element => {
        if (element !== target) {
          element.checked = false
        }
      })

      this.value = e.detail.value

      this.onChange.emit({
        value: this.value
      })
    }
  }

  componentDidLoad () {
    const childList = this.el.querySelectorAll('taro-radio-core')

    childList.forEach((element) => {
      element.setAttribute('name', this.name || this.uniqueName)
    })

    Object.defineProperty(this.el, 'value', {
      get: () => {
        if (!this.value) {
          const childList = this.el.querySelectorAll('taro-radio-core')
          this.value = this.getValues(childList)
        }
        return this.value
      },
      configurable: true
    })
  }

  getValues (childList: NodeListOf<HTMLTaroRadioCoreElement>) {
    let val = ''
    Array.from(childList)
      .forEach(element => {
        const checkbox: HTMLInputElement | null = element.querySelector('input')
        if (checkbox?.checked) {
          val = checkbox.value || ''
        }
      })
    return val
  }

  render () {
    return (
      <Host class='weui-cells_radiogroup' />
    )
  }
}
