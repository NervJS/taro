import { Component, ComponentInterface, Element, Event, EventEmitter, h, Method, Prop, State, Watch } from '@stencil/core'

import { TaroEvent } from '../../../types'

function fixControlledValue(value?: string) {
  return value ?? ''
}

type SelectionRange = {
  selectionStart: number
  selectionEnd: number
}

@Component({
  tag: 'taro-textarea-core',
  styleUrl: './style/index.scss'
})
export class Textarea implements ComponentInterface {
  private textareaRef: HTMLTextAreaElement
  private isComposing = false
  private onInputExecuted = false
  private lastSelectionRange?: SelectionRange

  @Element() el: HTMLElement

  @Prop({ mutable: true }) value: string = ''
  @Prop() placeholder: string
  @Prop() disabled = false
  @Prop() maxlength = 140
  @Prop({ attribute: 'focus' }) autoFocus = false
  @Prop() autoHeight = false
  @Prop() name: string
  @Prop() nativeProps = {}
  @State() line = 1
  @State() compositionValue?: string

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

  @Watch('value')
  watchValue (newValue: string) {
    // hack: 在事件回调中，props.value 变化不知为何不会触发 Stencil 更新，因此这里手动更新一下
    if (this.isComposing) return
    const value = fixControlledValue(newValue)
    if (this.textareaRef.value !== value) {
      const isActive = typeof document !== 'undefined' && document.activeElement === this.textareaRef
      const selection = isActive ? (this.lastSelectionRange || this.getSelectionSnapshot(this.textareaRef)) : null
      this.textareaRef.value = value
      if (selection) {
        this.restoreSelection(this.textareaRef, selection)
      }
    }
  }

  @Method()
  async focus() {
    this.textareaRef.focus()
  }

  componentDidLoad () {
    this.textareaRef?.addEventListener('compositionstart', this.handleComposition)
    this.textareaRef?.addEventListener('compositionend', this.handleComposition)
  }

  disconnectedCallback () {
    this.textareaRef?.removeEventListener('compositionstart', this.handleComposition)
    this.textareaRef?.removeEventListener('compositionend', this.handleComposition)
  }

  handleInput = (e: TaroEvent<HTMLTextAreaElement>) => {
    e.stopPropagation()
    this.handleLineChange()
    if (this.onInputExecuted) {
      this.onInputExecuted = false
      return
    }
    const value = e.target.value || ''
    const cursor = this.getCursorFromTarget(e.target, value.length)
    if (this.isComposing) {
      this.compositionValue = value
      return
    }
    this.onInputExecuted = true
    if (this.compositionValue !== undefined) {
      this.compositionValue = undefined
    }
    this.value = value
    this.onInput.emit({
      value,
      cursor
    })
    this.onInputExecuted = false
  }

  handleComposition = (e: Event) => {
    e.stopPropagation()
    if (!(e.target instanceof HTMLTextAreaElement)) return

    if (e.type === 'compositionend') {
      this.isComposing = false
      const value = e.target.value || ''
      const cursor = this.getCursorFromTarget(e.target, value.length)
      this.compositionValue = undefined
      this.handleLineChange()
      this.value = value
      this.onInput.emit({
        value,
        cursor
      })
    } else {
      this.isComposing = true
    }
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
    this.lastSelectionRange = undefined
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

  handleKeyDown = (e: TaroEvent<HTMLTextAreaElement> & KeyboardEvent) => {
    e.stopPropagation()
    const { value } = e.target
    const cursor = this.getCursorFromTarget(e.target, value.length)
    const keyCode = e.keyCode || e.code

    this.onKeyDown.emit({
      value,
      cursor,
      keyCode
    })

    keyCode === 13 && this.onConfirm.emit({ value })
  }

  private getSelectionSnapshot (target: HTMLTextAreaElement) {
    if (!target) return null
    const { selectionStart, selectionEnd } = target
    if (selectionStart === null || selectionEnd === null) return null
    this.lastSelectionRange = { selectionStart, selectionEnd }
    return { selectionStart, selectionEnd }
  }

  private getCursorFromTarget (target: HTMLTextAreaElement, fallback: number) {
    if (!target) return fallback
    const { selectionEnd } = target
    if (typeof selectionEnd === 'number') {
      const selectionStart = target.selectionStart ?? selectionEnd
      this.lastSelectionRange = { selectionStart, selectionEnd }
      return selectionEnd
    }
    return fallback
  }

  private restoreSelection (target: HTMLTextAreaElement, selection: SelectionRange | null) {
    if (!target) return
    const range = selection || this.lastSelectionRange || null
    if (!range) return
    const max = target.value.length
    const start = Math.min(range.selectionStart, max)
    const end = Math.min(range.selectionEnd, max)
    if (typeof target.setSelectionRange === 'function') {
      target.setSelectionRange(start, end)
    }
  }

  calculateContentHeight = (ta, scanAmount) => {
    const origHeight = ta.style.height
    let height = ta.offsetHeight
    const scrollHeight = ta.scrollHeight
    const overflow = ta.style.overflow
    const originMinHeight = ta.style.minHeight || null

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
    const ta = this.textareaRef
    const style = window.getComputedStyle ? window.getComputedStyle(ta) : ta.style
    // This will get the line-height only if it is set in the css,
    // otherwise it's "normal"
    const taLineHeight = parseInt(style.lineHeight, 10)
    // Get the scroll height of the textarea
    const taHeight = this.calculateContentHeight(ta, taLineHeight)
    // calculate the number of lines
    const numberOfLines = Math.floor(taHeight / taLineHeight)

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
      handleChange,
      compositionValue
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
        value={compositionValue !== undefined ? compositionValue : fixControlledValue(value)}
        placeholder={placeholder}
        name={name}
        disabled={disabled}
        maxLength={maxlength}
        autoFocus={autoFocus}
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
