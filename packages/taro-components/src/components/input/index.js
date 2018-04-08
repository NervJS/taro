import Nerv from 'nervjs'
import classNames from 'classnames'
const types = {
  text: 'text',
  number: 'number',
  idcard: 'idcard',
  digit: 'digit'
}
function parseType (type, isPassword) {
  if (!types[type]) {
    throw new Error('unexpected type')
  }
  return isPassword ? 'password' : 'text'
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
      onBlur
    } = this.props
    const cls = classNames('weui-input', className)
    return (
      <input
        className={cls}
        placeholder={placeholder}
        disabled={disabled}
        max={maxlength}
        onChange={onInput}
        onFocus={onFocus}
        onBlur={onBlur}
        type={parseType(type, password)}
      />
    )
  }
}

export default Input
