// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Component, h, ComponentInterface, Prop, Event, EventEmitter } from '@stencil/core'
import { TaroEvent } from '@tarojs/components'

function fixControlledValue (value?: string) {
  return value ?? ''
}

@Component({
  tag: 'taro-textarea'
})
export class Textarea implements ComponentInterface {
  @Prop() type = 'text'
  @Prop() maxLength: number
  @Prop() confirmType: string
  @Prop() password: string
  @Prop() placeholder: string
  @Prop() autoFocus = false
  @Prop() disabled = false
  @Prop() value: string

  @Event({
    eventName: 'input'
  }) onInput: EventEmitter

  @Event({
    eventName: 'change'
  }) onChange: EventEmitter

  @Event({
    eventName: 'focus'
  }) onFocus: EventEmitter

  @Event({
    eventName: 'blur'
  }) onBlur: EventEmitter

  @Event({
    eventName: 'keydown'
  }) onKeyDown: EventEmitter

  @Event({
    eventName: 'confirm'
  }) onConfirm: EventEmitter

  hanldeInput = (e: TaroEvent<HTMLInputElement>) => {
    const value = e.target.value
    this.onChange.emit({
      value
    })

    this.onInput.emit({
      value
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


  render () {
    const {
      placeholder,
      disabled,
      maxLength,
      value
    } = this

    return (
      <textarea
        ref={input => {
          input && this.autoFocus && input.focus()
        }}
        class='weui-input'
        value={fixControlledValue(value)}
        placeholder={placeholder}
        disabled={disabled}
        maxlength={maxLength}
        onChange={this.hanldeInput}
        onFocus={this.handleFocus}
        autofocus={this.autoFocus}
        onBlur={this.handleBlur}
      />
    )
  }
}
