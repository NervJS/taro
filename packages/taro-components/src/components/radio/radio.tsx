/*
 *  MIT License
 *  
 *  Copyright (c) 2018 O2Team
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
  tag: 'taro-radio-core'
})
export class Radio implements ComponentInterface {
  private inputEl: HTMLInputElement
  @Prop() name: string
  @Prop() value = ''
  @Prop({ mutable: true }) id: string
  @Prop({ mutable: true, reflect: true }) checked = false
  @Prop() disabled: boolean = false
  @Prop() nativeProps = {}

  @State() isWillLoadCalled = false

  @Element() el: HTMLElement

  @Watch('checked')
  watchChecked (newVal) {
    if (!this.isWillLoadCalled) return
    newVal && this.onChange.emit({ value: this.value })
  }

  @Watch('id')
  watchId (newVal) {
    if (!this.isWillLoadCalled) return
    if (newVal) this.inputEl.setAttribute('id', newVal)
  }

  @Event({
    eventName: 'radiochange'
  })
  onChange: EventEmitter

  componentDidRender () {
    this.id && this.el.removeAttribute('id')
  }

  componentWillLoad () {
    this.isWillLoadCalled = true
  }

  handleClick = (e: Event) => {
    e.stopPropagation()
    if (this.disabled) return
    if (!this.checked) this.checked = true
  }

  render () {
    const { checked, name, value, disabled, nativeProps } = this

    return (
      <Host
        className='weui-cells_checkbox'
        onClick={this.handleClick}
      >
        <input
          ref={dom => {
            if (!dom) return
            this.inputEl = dom
            if (this.id) dom.setAttribute('id', this.id)
          }}
          type='radio'
          name={name}
          value={value}
          class='weui-check'
          checked={checked}
          disabled={disabled}
          onChange={e => e.stopPropagation()}
          {...nativeProps}
        />
        <i class='weui-icon-checked' />
        <slot />
      </Host>
    )
  }
}
