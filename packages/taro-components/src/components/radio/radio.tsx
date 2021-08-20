/*!
* Licensed to the O2Team under one
* or more contributor license agreements.  See the NOTICE file
* distributed with this work for additional information
* regarding copyright ownership.  The ASF licenses this file
* to you under the Apache License, Version 2.0 (the
* "License"); you may not use this file except in compliance
* with the License.  You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied.  See the License for the
* specific language governing permissions and limitations
* under the License.
*/

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Component, h, ComponentInterface, Prop, Event, EventEmitter, Host, Watch, Element, State } from '@stencil/core'

@Component({
  tag: 'taro-radio-core'
})
export class Radio implements ComponentInterface {
  private inputEl: HTMLInputElement
  @Prop() name: string
  @Prop() value = ''
  @Prop({ mutable: true }) id: string
  @Prop({ mutable: true }) checked = false
  @Prop() disabled: boolean = false
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

  handleClick = () => {
    if (this.disabled) return
    if (!this.checked) this.checked = true
  }

  render () {
    const { checked, name, value, disabled } = this

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
        />
        <i class='weui-icon-checked' />
        <slot />
      </Host>
    )
  }
}
