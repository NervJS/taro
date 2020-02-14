// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Component, h, ComponentInterface, Prop, Event, EventEmitter } from '@stencil/core'
import { TaroEvent } from '@tarojs/components'

function fixControlledValue (value?: string) {
  return value ?? ''
}

@Component({
  tag: 'taro-textarea',
  styleUrl: './style/index.scss'
})
export class Textarea implements ComponentInterface {
  @Prop() value: string
  @Prop() placeholder: string
  @Prop() disabled = false
  @Prop() maxLength = 140
  @Prop() autoFocus = false

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
      maxLength,
      autoFocus,
      hanldeInput,
      handleFocus,
      handleBlur,
      handleChange
    } = this

    return (
      <textarea
        ref={input => autoFocus && input?.focus()}
        class='taro-textarea'
        value={fixControlledValue(value)}
        placeholder={placeholder}
        disabled={disabled}
        maxlength={maxLength}
        autofocus={autoFocus}
        onInput={hanldeInput}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={handleChange}
      />
    )
  }
}
