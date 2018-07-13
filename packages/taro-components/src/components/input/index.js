import Nerv from 'nervjs'
import omit from 'omit.js'
import classNames from 'classnames'

import './index.scss'

const types = {
  text: 'text',
  number: 'number',
  idcard: 'idcard',
  digit: 'digit',
  password: 'password'
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
  }

  render () {
    const {
      className = '',
      placeholder,
      type = 'text',
      password,
      disabled,
      maxlength,
      onInput,
      onFocus,
      onBlur,
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
        onChange={onInput}
        onInput={onInput}
        onFocus={onFocus}
        onBlur={onBlur}
        type={parseType(type, password, confirmType)}
      />
    )
  }
}

export default Input
