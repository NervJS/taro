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
  if (type === 'number') type = 'number'

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
  }

  onInput (e) {
    const { onInput, onChange = '' } = this.props
    if (!this.isOnComposition) {
      Object.defineProperty(e, 'detail', {
        enumerable: true,
        value: {
          value: e.target.value
        }
      })
      if (onChange) {
        onChange && onChange(e)
      } else {
        onInput && onInput(e)
      }
    }
  }

  onFocus (e) {
    const { onFocus } = this.props
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
    const { onConfirm } = this.props
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
    } else {
      this.isOnComposition = true
    }
    this.onInput(e)
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
        ref={input => input && focus && input.focus()}
        {...otherProps}
        className={cls}
        placeholder={placeholder}
        disabled={disabled}
        max={maxLength}
        onChange={this.onInput}
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

export default Input
