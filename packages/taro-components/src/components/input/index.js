import 'weui'
import Nerv from 'nervjs'
import omit from 'omit.js'
import classNames from 'classnames'

import './index.scss'

function getTrueType (type, confirmType, password) {
  if (!type) {
    throw new Error('unexpected type')
  }
  if (confirmType === 'search') type = 'search'
  if (password) type = 'password'
  if (type === 'digit') type = 'number'

  return type
}

function fixControlledValue (value) {
  if (typeof value === 'undefined' || value === null) {
    return ''
  }
  return value
}

class Input extends Nerv.Component {
  constructor () {
    super(...arguments)
    this.onInput = this.onInput.bind(this)
    this.onFocus = this.onFocus.bind(this)
    this.onBlur = this.onBlur.bind(this)
    this.onKeyDown = this.onKeyDown.bind(this)
    this.handleComposition = this.handleComposition.bind(this)

    // input hook
    this.isOnComposition = false
    this.onInputExcuted = false
  }

  componentDidMount () {
    // 修复无法选择文件
    if (this.props.type === 'file') {
      this.inputRef.addEventListener('change', this.onInput)
    }
  }

  componentWillUnmount () {
    // 修复无法选择文件
    if (this.props.type === 'file') {
      this.inputRef.removeEventListener('change', this.onInput)
    }
  }

  onInput (e) {
    const {
      type,
      maxLength,
      confirmType,
      password,
      onInput = '',
      onChange = ''
    } = this.props
    if (!this.isOnComposition && !this.onInputExcuted) {
      let value = e.target.value
      const inputType = getTrueType(type, confirmType, password)
      this.onInputExcuted = true
      /* 修复 number 类型 maxLength 无效 */
      if (inputType === 'number' && value && maxLength <= value.length) {
        value = value.substring(0, maxLength)
        e.target.value = value
      }

      Object.defineProperty(e, 'detail', {
        enumerable: true,
        value: { value }
      })
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

      if (onChange) return onChange(e)
      if (onInput) return onInput(e)
    }
  }

  onFocus (e) {
    const { onFocus } = this.props
    this.onInputExcuted = false
    Object.defineProperty(e, 'detail', {
      enumerable: true,
      value: {
        value: e.target.value
      }
    })
    onFocus && onFocus(e)
  }

  onBlur (e) {
    const { onBlur } = this.props
    Object.defineProperty(e, 'detail', {
      enumerable: true,
      value: {
        value: e.target.value
      }
    })
    onBlur && onBlur(e)
  }

  onKeyDown (e) {
    const { onConfirm, onKeyDown } = this.props
    this.onInputExcuted = false
    onKeyDown && onKeyDown(e)
    if (e.keyCode === 13 && onConfirm) {
      Object.defineProperty(e, 'detail', {
        enumerable: true,
        value: {
          value: e.target.value
        }
      })
      onConfirm(e)
    }
  }

  handleComposition (e) {
    if (!(e.target instanceof HTMLInputElement)) return

    if (e.type === 'compositionend') {
      this.isOnComposition = false
      this.onInputExcuted = false
      this.onInput(e)
    } else {
      this.isOnComposition = true
    }
  }

  render () {
    const {
      className = '',
      placeholder,
      type = 'text',
      password,
      disabled,
      maxLength,
      confirmType = '',
      focus = false,
      value
    } = this.props
    const cls = classNames('weui-input', className)

    const otherProps = omit(this.props, [
      'className',
      'placeholder',
      'disabled',
      'max',
      'onChange',
      'onFocus',
      'onBlur',
      'type',
      'focus'
    ])

    if ('value' in this.props) {
      otherProps.value = fixControlledValue(value)
    }

    return (
      <input
        ref={input => {
          this.inputRef = input
        }}
        {...otherProps}
        className={cls}
        placeholder={placeholder}
        disabled={disabled}
        maxlength={maxLength}
        onInput={this.onInput}
        onFocus={this.onFocus}
        onBlur={this.onBlur}
        autofocus={focus}
        onKeyDown={this.onKeyDown}
        type={getTrueType(type, confirmType, password)}
        onCompositionStart={this.handleComposition}
        onCompositionEnd={this.handleComposition}
      />
    )
  }
}

Input.defaultProps = {
  type: 'text'
}

export default Input
