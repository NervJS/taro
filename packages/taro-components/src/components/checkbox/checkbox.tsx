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

import { Component, h, ComponentInterface, Prop, Event, EventEmitter, Host, Watch, Element, State } from '@stencil/core'

@Component({
  tag: 'taro-checkbox-core',
  styleUrl: './style/index.scss'
})
export class Checkbox implements ComponentInterface {
  private inputEl: HTMLInputElement
  @Prop() name: string
  @Prop() value = ''
  @Prop() color: string
  @Prop({ mutable: true }) id: string
  @Prop() checked = false
  @Prop() disabled = false
  @Prop() nativeProps = {}

  @State() isWillLoadCalled = false

  @Element() el: HTMLElement

  @Watch('id')
  watchId (newVal) {
    if (!this.isWillLoadCalled) return
    if (newVal) this.inputEl.setAttribute('id', newVal)
  }

  @Event({
    eventName: 'checkboxchange'
  })
  onChange: EventEmitter

  componentWillLoad () {
    this.isWillLoadCalled = true
  }

  componentDidRender () {
    this.id && this.el.removeAttribute('id')
  }

  handleChange = (e: Event) => {
    e.stopPropagation()
    this.onChange.emit({
      value: this.value
    })
  }

  render () {
    const { checked, name, color, value, disabled, nativeProps } = this

    return (
      <Host
        className='weui-cells_checkbox'
      >
        <input
          ref={dom => {
            if (!dom) return
            this.inputEl = dom
            if (this.id) dom.setAttribute('id', this.id)
          }}
          type='checkbox'
          value={value}
          name={name}
          class='taro-checkbox_checked'
          style={{ color }}
          checked={checked}
          disabled={disabled}
          onChange={this.handleChange}
          {...nativeProps}
        />
        <slot />
      </Host>
    )
  }
}
