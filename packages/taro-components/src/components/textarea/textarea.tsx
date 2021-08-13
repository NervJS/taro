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
