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

  return type
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
        type={getTrueType(type, confirmType, password)}
      />
    )
  }
}

export default Input
