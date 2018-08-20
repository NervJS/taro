import Nerv from 'nervjs'
import omit from 'omit.js'
import classNames from 'classnames'

import './index.scss'

const types = {
  text: 'text',
  number: 'number',
  idcard: 'idcard',
  digit: 'digit',
  password: 'password',
  file: 'file'
}
function parseType (type, isPassword, confirmType) {
  if (!types[type]) {
    throw new Error('unexpected type')
  }
  if (isPassword) {
    return isPassword ? 'password' : 'text'
  } else if (confirmType) {
    return 'search'
  } else {
    return types[type]
  }
}
class Input extends Nerv.Component {
  constructor () {
    super(...arguments)
    this.onInput = this.onInput.bind(this)
    this.onFocus = this.onFocus.bind(this)
    this.onBlur = this.onBlur.bind(this)
  }

  onInput (e) {
    const { onInput, onChange = '' } = this.props
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

  render () {
    const {
      className = '',
      placeholder,
      type = 'text',
      password,
      disabled,
      maxlength,
      confirmType = ''
    } = this.props
    const cls = classNames('weui-input', className)
    return (
      <input
        {...omit(this.props, [
          'className',
          'placeholder',
          'disabled',
          'max',
          'onChange',
          'onFocus',
          'onBlur',
          'type'
        ])}
        className={cls}
        placeholder={placeholder}
        disabled={disabled}
        max={maxlength}
        onChange={this.onInput}
        onInput={this.onInput}
        onFocus={this.onFocus}
        onBlur={this.onBlur}
        type={parseType(type, password, confirmType)}
      />
    )
  }
}

export default Input
