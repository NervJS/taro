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

import { Component, h, ComponentInterface, Prop, State, Event, EventEmitter, Watch, Element } from '@stencil/core'

@Component({
  tag: 'taro-switch-core',
  styleUrl: './style/index.scss'
})
export class Switch implements ComponentInterface {
  @Prop() type = 'switch'
  @Prop() checked = false
  @Prop() color = '#04BE02'
  @Prop() name: string
  @Prop() disabled = false
  @Prop() nativeProps = {}

  @State() isChecked: boolean
  @State() isWillLoadCalled = false

  @Element() el: HTMLElement

  @Watch('checked')
  function (newVal: boolean, oldVal: boolean) {
    if (!this.isWillLoadCalled) return
    if (newVal !== oldVal) this.isChecked = newVal
  }

  @Event({
    eventName: 'change'
  })
  onChange: EventEmitter

  componentWillLoad () {
    this.isWillLoadCalled = true
    this.isChecked = this.checked
  }

  componentDidLoad () {
    Object.defineProperty(this.el, 'value', {
      get: () => this.isChecked,
      configurable: true
    })
  }

  switchChange = e => {
    e.stopPropagation()
    const value = e.target.checked
    this.isChecked = value
    this.onChange.emit({
      value
    })
  }

  render () {
    const {
      type,
      color,
      isChecked,
      name,
      disabled,
      nativeProps
    } = this

    const style = isChecked
      ? {
        borderColor: color || '04BE02',
        backgroundColor: color || '04BE02'
      }
      : {}

    return (
      <input
        type='checkbox'
        class={`weui-${type}`}
        style={style}
        checked={isChecked}
        name={name}
        disabled={disabled}
        onChange={this.switchChange}
        {...nativeProps}
      />
    )
  }
}
