import { Component, h, ComponentInterface, Prop, State, Event, EventEmitter, Element, Method, Watch } from '@stencil/core'
import { TaroEvent } from '../../../types'

function fixControlledValue(value?: string) {
  return value ?? ''
}

@Component({
  tag: 'taro-textarea-core',
  styleUrl: './style/index.scss'
})
export class Textarea implements ComponentInterface {
  private textareaRef: HTMLTextAreaElement

  @Element() el: HTMLElement

  @Prop({ mutable: true }) value: string = ''
  @Prop() placeholder: string
  @Prop() disabled = false
  @Prop() maxlength = 140
  @Prop({ attribute: 'focus', reflect: true }) autoFocus = false
  @Prop() autoHeight = false
  @Prop() name: string
  @Prop() nativeProps = {}
  @State() line = 1

  @Event({
    eventName: 'input'
  })
  onInput: EventEmitter

  @Event({
    eventName: 'focus'
  })
  onFocus: EventEmitter

  @Event({
    eventName: 'blur'
  })
  onBlur: EventEmitter

  @Event({
    eventName: 'confirm'
  }) onConfirm: EventEmitter

  @Event({
    eventName: 'change'
  })
  onChange: EventEmitter

  @Event({
    eventName: 'linechange' // 必须全小写
  })
  onLineChange: EventEmitter

  @Event({
    eventName: 'keydown'
  }) onKeyDown: EventEmitter

  @Watch('autoFocus')
  watchAutoFocus (newValue: boolean, oldValue: boolean) {
    if (!oldValue && newValue) {
      this.textareaRef?.focus()
    }
  }

  @Method()
  async focus() {
    this.textareaRef.focus()
  }

  handleInput = (e: TaroEvent<HTMLInputElement>) => {
    e.stopPropagation()
    this.handleLineChange()
    const value = e.target.value || ''
    this.onInput.emit({
      value,
      cursor: value.length
    })
  }

  handleFocus = (e: TaroEvent<HTMLInputElement> & FocusEvent) => {
    e.stopPropagation()
    this.onFocus.emit({
      value: e.target.value
    })
  }

  handleBlur = (e: TaroEvent<HTMLInputElement> & FocusEvent) => {
    e.stopPropagation()
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

  handleLineChange = () => {
    const line = this.getNumberOfLines()
    if (line !== this.line) {
      this.line = line
      this.onLineChange.emit({
        height: this.textareaRef.clientHeight,
        lineCount: this.line
      })
    }
  }

  handleKeyDown = (e: TaroEvent<HTMLInputElement> & KeyboardEvent) => {
    e.stopPropagation()
    const { value } = e.target
    const keyCode = e.keyCode || e.code

    this.onKeyDown.emit({
      value,
      cursor: value.length,
      keyCode
    })

    keyCode === 13 && this.onConfirm.emit({ value })
  }

  calculateContentHeight = (ta, scanAmount) => {
    let origHeight = ta.style.height,
      height = ta.offsetHeight,
      scrollHeight = ta.scrollHeight,
      overflow = ta.style.overflow,
      originMinHeight = ta.style.minHeight || null

    /// only bother if the ta is bigger than content
    if (height >= scrollHeight) {
      ta.style.minHeight = 0
      /// check that our browser supports changing dimension
      /// calculations mid-way through a function call...
      ta.style.height = height + scanAmount + 'px'
      /// because the scrollbar can cause calculation problems
      ta.style.overflow = 'hidden'
      /// by checking that scrollHeight has updated
      if (scrollHeight < ta.scrollHeight) {
        /// now try and scan the ta's height downwards
        /// until scrollHeight becomes larger than height
        while (ta.offsetHeight >= ta.scrollHeight) {
          ta.style.height = (height -= scanAmount) + 'px'
        }
        /// be more specific to get the exact height
        while (ta.offsetHeight < ta.scrollHeight) {
          ta.style.height = height++ + 'px'
        }
        /// reset the ta back to it's original height
        ta.style.height = origHeight
        /// put the overflow back
        ta.style.overflow = overflow
        ta.style.minHeight = originMinHeight
        return height
      }
    } else {
      return scrollHeight
    }
  }

  getNumberOfLines = () => {
    const ta = this.textareaRef,
      style = window.getComputedStyle ? window.getComputedStyle(ta) : ta.style,
      // This will get the line-height only if it is set in the css,
      // otherwise it's "normal"
      taLineHeight = parseInt(style.lineHeight, 10),
      // Get the scroll height of the textarea
      taHeight = this.calculateContentHeight(ta, taLineHeight),
      // calculate the number of lines
      numberOfLines = Math.floor(taHeight / taLineHeight)

    return numberOfLines
  }

  render() {
    const {
      value,
      placeholder,
      disabled,
      maxlength,
      autoFocus,
      autoHeight,
      name,
      nativeProps,
      handleInput,
      handleFocus,
      handleBlur,
      handleChange
    } = this

    const otherProps: {
      [props: string]: any
    } = {}

    if (autoHeight) {
      otherProps.rows = this.line
    }

    return (
      <textarea
        ref={input => {
          if (input) {
            this.textareaRef = input!
            if (autoFocus && input) input.focus()
          }
        }}
        class={`taro-textarea ${autoHeight ? 'auto-height' : ''}`}
        value={fixControlledValue(value)}
        placeholder={placeholder}
        name={name}
        disabled={disabled}
        maxlength={maxlength}
        autofocus={autoFocus}
        onInput={handleInput}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={handleChange}
        onKeyDown={this.handleKeyDown}
        {...nativeProps}
        {...otherProps}
      />
    )
  }
}
