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

  handleChange = e => {
    e.stopPropagation()
    this.onChange.emit({
      value: this.value
    })
  }

  render () {
    const { checked, name, color, value } = this

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
          onChange={this.handleChange}
        />
        <slot />
      </Host>
    )
  }
}
