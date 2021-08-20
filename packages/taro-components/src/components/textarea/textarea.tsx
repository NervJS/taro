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
import { Component, h, ComponentInterface, Prop, Event, EventEmitter, Element } from '@stencil/core'
import { TaroEvent } from '../../../types'

function fixControlledValue (value?: string) {
  return value ?? ''
}

@Component({
  tag: 'taro-textarea-core',
  styleUrl: './style/index.scss'
})
export class Textarea implements ComponentInterface {
  private textareaRef: HTMLTextAreaElement

  @Element() el: HTMLElement

  @Prop() value: string
  @Prop() placeholder: string
  @Prop() disabled = false
  @Prop() maxlength = 140
  @Prop() autoFocus = false
  @Prop() name: string

  @Event({
    eventName: 'input'
  }) onInput: EventEmitter

  @Event({
    eventName: 'focus'
  }) onFocus: EventEmitter

  @Event({
    eventName: 'blur'
  }) onBlur: EventEmitter

  @Event({
    eventName: 'change'
  }) onChange: EventEmitter

  componentDidLoad () {
    Object.defineProperty(this.el, 'value', {
      get: () => this.textareaRef.value,
      set: value => (this.value = value),
      configurable: true
    })
    this.autoFocus && this.textareaRef.focus()
  }

  hanldeInput = (e: TaroEvent<HTMLInputElement>) => {
    e.stopPropagation()
    this.onInput.emit({
      value: e.target.value,
      cursor: e.target.value.length
    })
  }

  handleFocus = (e: TaroEvent<HTMLInputElement> & FocusEvent) => {
    this.onFocus.emit({
      value: e.target.value
    })
  }

  handleBlur = (e: TaroEvent<HTMLInputElement> & FocusEvent) => {
    this.onBlur.emit({
      value: e.target.value
    })
  }

  handleChange = (e: TaroEvent<HTMLInputElement>) => {
    e.stopPropagation()
    this.onChange.emit({
      value: e.target.value
    })
  }

  render () {
    const {
      value,
      placeholder,
      disabled,
      maxlength,
      autoFocus,
      name,
      hanldeInput,
      handleFocus,
      handleBlur,
      handleChange
    } = this

    return (
      <textarea
        ref={input => {
          if (input) {
            this.textareaRef = input
          }
        }}
        class='taro-textarea'
        value={fixControlledValue(value)}
        placeholder={placeholder}
        name={name}
        disabled={disabled}
        maxlength={maxlength}
        autofocus={autoFocus}
        onInput={hanldeInput}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={handleChange}
      />
    )
  }
}
