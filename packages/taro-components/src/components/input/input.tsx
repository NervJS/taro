// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Component, h, ComponentInterface, Prop, Event, EventEmitter } from '@stencil/core'
import { EventHandler, TaroEvent } from '@tarojs/components'

function getTrueType (type: string, confirmType: string, password: string) {
  if (!type) {
    throw new Error('unexpected type')
  }
  if (confirmType === 'search') type = 'search'
  if (password) type = 'password'
  if (type === 'digit') type = 'number'

  return type
}

function fixControlledValue (value?: string) {
  return value ?? ''
}

@Component({
  tag: 'taro-input',
  styleUrl: 'index.scss'
})
export class Input implements ComponentInterface {
  private inputRef: HTMLInputElement
  private isOnComposition = false
  private onInputExcuted = false
  private fileListener: EventHandler

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

  componentDidLoad () {
    if (this.type === 'file') {
      this.fileListener = () => {
        this.onInput.emit()
      }
      this.inputRef.addEventListener('change', this.fileListener)
    }
  }

  componentDidUnload () {
    if (this.type === 'file') {
      this.inputRef.removeEventListener('change', this.fileListener)
    }
  }

  hanldeInput = (e: TaroEvent<HTMLInputElement>) => {
    e.stopPropagation()
    const {
      type,
      maxLength,
      confirmType,
      password
    } = this
    if (!this.isOnComposition && !this.onInputExcuted) {
      let value = e.target.value
      const inputType = getTrueType(type, confirmType, password)
      this.onInputExcuted = true
      /* 修复 number 类型 maxLength 无效 */
      if (inputType === 'number' && value && maxLength <= value.length) {
        value = value.substring(0, maxLength)
        e.target.value = value
      }

      // 修复 IOS 光标跳转问题
      if (!(['number', 'file'].indexOf(inputType) >= 0)) {
        const pos = e.target.selectionEnd
        setTimeout(
          () => {
            e.target.selectionStart = pos
            e.target.selectionEnd = pos
          }
        )
      }

      this.onChange.emit({
        value
      })

      this.onInput.emit({
        value
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

  handleKeyDown = (e: TaroEvent<HTMLInputElement> & KeyboardEvent) => {
    const value = e.target.value
    this.onInputExcuted = false
    e.stopPropagation()

    this.onKeyDown.emit({
      value
    })

    if (e.keyCode === 13) {
      this.onConfirm.emit({
        value
      })
    }
  }

  handleComposition = (e) => {
    if (!(e.target instanceof HTMLInputElement)) return

    if (e.type === 'compositionend') {
      this.isOnComposition = false
      this.onInput.emit()
    } else {
      this.isOnComposition = true
    }
  }

  render () {
    const {
      placeholder,
      type = 'text',
      password,
      disabled,
      maxLength,
      confirmType = '',
      value
    } = this

    return (
      <input
        ref={input => {
          this.inputRef = input!
          input && this.autoFocus && input.focus()
        }}
        class='weui-input'
        value={fixControlledValue(value)}
        placeholder={placeholder}
        disabled={disabled}
        maxlength={maxLength}
        onInput={this.hanldeInput}
        onFocus={this.handleFocus}
        autofocus={this.autoFocus}
        onBlur={this.handleBlur}
        onKeyDown={this.handleKeyDown}
        type={getTrueType(type, confirmType, password)}
        onCompositionStart={this.handleComposition}
        onCompositionEnd={this.handleComposition}
      />
    )
  }
}
