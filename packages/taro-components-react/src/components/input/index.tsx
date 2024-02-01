import './style/index.scss'

import classNames from 'classnames'
import React from 'react'

import { omit } from '../../utils'

function getTrueType (type: string | undefined, confirmType: string, password: boolean) {
  if (confirmType === 'search') type = 'search'
  if (password) type = 'password'
  if (typeof type === 'undefined') {
    return 'text'
  }
  if (!type) {
    throw new Error('unexpected type')
  }
  if (type === 'digit') type = 'number'

  return type
}

function fixControlledValue (value) {
  return value ?? ''
}

interface IProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  password?: boolean
  disabled?: boolean
  maxlength?: number
  placeholder?: string
  value?: string
  focus?: boolean
  confirmType?: string
  name?: string
  type?: string
  onConfirm?: (e) => void
}

class Input extends React.Component<IProps, null> {
  constructor (props) {
    super(props)
    this.handleInput = this.handleInput.bind(this)
    this.handlePaste = this.handlePaste.bind(this)
    this.handleFocus = this.handleFocus.bind(this)
    this.handleBlur = this.handleBlur.bind(this)
    this.handleKeyDown = this.handleKeyDown.bind(this)
    this.handleComposition = this.handleComposition.bind(this)
    this.handleBeforeInput = this.handleBeforeInput.bind(this)
    this.isOnComposition = false
    this.onInputExcuted = false
  }

  inputRef: HTMLInputElement
  isOnComposition: boolean
  onInputExcuted: boolean

  componentDidMount () {
    // 修复无法选择文件
    if (this.props.type === 'file') {
      this.inputRef?.addEventListener('change', this.handleInput)
    } else {
      this.inputRef?.addEventListener('textInput', this.handleBeforeInput)
    }

    // 处理初始化是否 focus
    if (this.props.focus && this.inputRef) this.inputRef.focus()
  }


  componentWillUnmount () {
    // 修复无法选择文件
    if (this.props.type === 'file') {
      this.inputRef.removeEventListener('change', this.handleInput)
    } else {
      this.inputRef?.removeEventListener('textInput', this.handleBeforeInput)
    }
  }

  UNSAFE_componentWillReceiveProps (nextProps: Readonly<IProps>) {
    if (!this.props.focus && nextProps.focus && this.inputRef) this.inputRef.focus()
  }


  handleInput (e) {
    e.stopPropagation()
    const {
      type,
      maxlength = 140,
      confirmType = 'done',
      password = false,
      onInput
    } = this.props

    if (!this.isOnComposition && !this.onInputExcuted) {
      let { value } = e.target
      const inputType = getTrueType(type, confirmType, password)
      this.onInputExcuted = true
      /* 修复 number 类型 maxLength 无效 */
      if (inputType === 'number' && value && maxlength <= value.length) {
        value = value.substring(0, maxlength)
        e.target.value = value
      }

      Object.defineProperty(e, 'detail', {
        value: { value, cursor: value.length }
      })
      // // 修复 IOS 光标跳转问题
      // if (!(['number', 'file'].indexOf(inputType) >= 0)) {
      //   const pos = e.target.selectionEnd
      //   setTimeout(
      //     () => {
      //       e.target.selectionStart = pos
      //       e.target.selectionEnd = pos
      //     }
      //   )
      // }

      typeof onInput === 'function' && onInput(e)
      this.onInputExcuted = false
    }
  }


  handlePaste (e) {
    e.stopPropagation()
    const { onPaste } = this.props
    this.onInputExcuted = false
    Object.defineProperty(e, 'detail', {
      value: {
        value: e.target.value
      }
    })
    typeof onPaste === 'function' && onPaste(e)
  }

  handleFocus (e) {
    e.stopPropagation()
    const { onFocus } = this.props
    this.onInputExcuted = false
    Object.defineProperty(e, 'detail', {
      value: {
        value: e.target.value
      }
    })
    onFocus && onFocus(e)
  }

  handleBlur (e) {
    e.stopPropagation()
    const { onBlur } = this.props
    Object.defineProperty(e, 'detail', {
      value: {
        value: e.target.value
      }
    })
    onBlur && onBlur(e)
  }

  handleKeyDown (e) {
    e.stopPropagation()
    const { onConfirm, onKeyDown } = this.props
    const { value } = e.target
    const keyCode = e.keyCode || e.code
    this.onInputExcuted = false

    if (typeof onKeyDown === 'function') {
      Object.defineProperty(e, 'detail', {
        value: {
          value,
          cursor: value.length,
          keyCode
        }
      })
      onKeyDown(e)
    }

    if (e.keyCode === 13 && typeof onConfirm === 'function') {
      Object.defineProperty(e, 'detail', {
        value: {
          value
        }
      })
      onConfirm(e)
    }
  }

  handleComposition (e) {
    e.stopPropagation()
    if (!(e.target instanceof HTMLInputElement)) return

    if (e.type === 'compositionend') {
      this.isOnComposition = false
      this.handleInput(e)
    } else {
      this.isOnComposition = true
    }
  }

  handleBeforeInput = (e) => {
    if (!e.data) return
    const isNumber = e.data && /[0-9]/.test(e.data)
    if (this.props.type === 'number' && !isNumber) {
      e.preventDefault()
    }
    if (this.props.type === 'digit' && !isNumber) {
      if (e.data !== '.' || (e.data === '.' && e.target.value.indexOf('.') > -1)) {
        e.preventDefault()
      }
    }
  }

  render () {
    const {
      className = '',
      placeholder,
      type,
      password = false,
      disabled = false,
      maxlength = 140,
      confirmType = 'done',
      name,
      value
    } = this.props
    const cls = classNames('taro-input-core', 'weui-input', className)

    const otherProps = omit(this.props, [
      'className',
      'placeholder',
      'disabled',
      'password',
      'type',
      'maxlength',
      'confirmType',
      'focus',
      'name'
    ])

    if ('value' in this.props) {
      otherProps.value = fixControlledValue(value)
    }

    return (
      <input
        ref={(input: HTMLInputElement) => {
          this.inputRef = input
        }}
        {...otherProps}
        className={cls}
        type={getTrueType(type, confirmType, password)}
        placeholder={placeholder}
        disabled={disabled}
        maxLength={maxlength}
        name={name}
        onInput={this.handleInput}
        onPaste={this.handlePaste}
        onFocus={this.handleFocus}
        onBlur={this.handleBlur}
        onKeyDown={this.handleKeyDown}
        onCompositionStart={this.handleComposition}
        onCompositionEnd={this.handleComposition}
        onBeforeInput={this.handleBeforeInput}
      />
    )
  }
}

export default Input
