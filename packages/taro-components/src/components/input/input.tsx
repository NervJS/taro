import { Component, h, ComponentInterface, Prop, Event, EventEmitter, Element, State, Watch } from '@stencil/core'
import { EventHandler, TaroEvent } from '../../../types'

function getTrueType (type: string | undefined, confirmType: string, password: boolean) {
  if (confirmType === 'search') type = 'search'
  if (password) type = 'password'
  if (typeof type === 'undefined') {
    return 'text';
  }
  if (!type) {
    throw new Error('unexpected type')
  }
  if (type === 'digit') type = 'number'

  return type
}

function fixControlledValue (value?: string) {
  return value ?? ''
}

@Component({
  tag: 'taro-input-core',
  styleUrl: 'index.scss'
})
export class Input implements ComponentInterface {
  private inputRef: HTMLInputElement
  private isOnComposition = false
  private onInputExcuted = false
  private fileListener: EventHandler

  @Prop() value: string
  @Prop() type: string
  @Prop() password = false
  @Prop() placeholder: string
  @Prop() disabled = false
  @Prop() maxlength = 140
  @Prop() autoFocus = false
  @Prop() confirmType = 'done'
  @Prop() name: string

  @State() _value: string

  @Element() el: HTMLElement

  @Watch('value')
  watchHandler (newValue: string, oldValue: string) {
    if (newValue !== oldValue) {
      this._value = newValue
    }
  }

  @Watch('autoFocus')
  watchFocus (newValue: boolean, oldValue: boolean) {
    if (!oldValue && newValue) {
      this.inputRef.focus()
    }
  }

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
    eventName: 'confirm'
  }) onConfirm: EventEmitter

  @Event({
    eventName: 'change'
  }) onChange: EventEmitter

  @Event({
    eventName: 'keydown'
  }) onKeyDown: EventEmitter

  componentWillLoad () {
    this._value = this.value
  }

  componentDidLoad () {
    if (this.type === 'file') {
      this.fileListener = () => {
        this.onInput.emit()
      }
      this.inputRef.addEventListener('change', this.fileListener)
    } else {
      this.inputRef.addEventListener('compositionstart', this.handleComposition)
      this.inputRef.addEventListener('compositionend', this.handleComposition)
    }

    Object.defineProperty(this.el, 'value', {
      get: () => this.inputRef.value,
      set: value => {
        this._value = value
      },
      configurable: true
    })
  }

  disconnectedCallback () {
    if (this.type === 'file') {
      this.inputRef.removeEventListener('change', this.fileListener)
    }
  }

  handleInput = (e: TaroEvent<HTMLInputElement>) => {
    e.stopPropagation()
    const {
      type,
      maxlength,
      confirmType,
      password
    } = this
    if (!this.isOnComposition && !this.onInputExcuted) {
      let value = e.target.value
      const inputType = getTrueType(type, confirmType, password)
      this.onInputExcuted = true
      /* 修复 number 类型 maxlength 无效 */
      if (inputType === 'number' && value && maxlength <= value.length) {
        value = value.substring(0, maxlength)
        e.target.value = value
      }

      // 修复 IOS 光标跳转问题
      // if (!(['number', 'file'].indexOf(inputType) >= 0)) {
      //   const pos = e.target.selectionEnd
      //   setTimeout(
      //     () => {
      //       e.target.selectionStart = pos
      //       e.target.selectionEnd = pos
      //     }
      //   )
      // }

      this._value = value

      this.onInput.emit({
        value,
        cursor: value.length
      })
    }
  }

  handleFocus = (e: TaroEvent<HTMLInputElement> & FocusEvent) => {
    this.onInputExcuted = false
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

  handleKeyDown = (e: TaroEvent<HTMLInputElement> & KeyboardEvent) => {
    const { value } = e.target
    this.onInputExcuted = false
    e.stopPropagation()

    this.onKeyDown.emit({ value })

    e.keyCode === 13 && this.onConfirm.emit({ value })
  }

  handleComposition = (e) => {
    if (!(e.target instanceof HTMLInputElement)) return

    if (e.type === 'compositionend') {
      this.isOnComposition = false
      this.onInput.emit({ value: e.target.value })
    } else {
      this.isOnComposition = true
    }
  }

  render () {
    const {
      _value,
      type,
      password,
      placeholder,
      disabled,
      maxlength,
      autoFocus,
      confirmType,
      name
    } = this

    return (
      <input
        ref={input => {
          this.inputRef = input!
          autoFocus && input?.focus()
        }}
        class='weui-input'
        value={fixControlledValue(_value)}
        type={getTrueType(type, confirmType, password)}
        placeholder={placeholder}
        disabled={disabled}
        maxlength={maxlength}
        autofocus={autoFocus}
        name={name}
        onInput={this.handleInput}
        onFocus={this.handleFocus}
        onBlur={this.handleBlur}
        onChange={this.handleChange}
        onKeyDown={this.handleKeyDown}
      />
    )
  }
}
