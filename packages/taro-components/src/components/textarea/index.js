import Nerv from 'nervjs'
import omit from 'omit.js'
class Textarea extends Nerv.Component {
  constructor () {
    super(...arguments)
  }

  onChange (e) {
    const { onChange, onInput } = this.props
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

  render () {
    const {
      className = '',
      placeholder = '',
      disabled,
      maxLength = 140,
      onChange,
      onFocus,
      onBlur,
      autoFocus = false
    } = this.props
    return (
      <textarea
        {...omit(this.props, [
          'className',
          'placeholder',
          'disabled',
          'maxlength',
          'onChange',
          'onFocus',
          'onBlur',
          'autofocus'
        ])}
        className={className}
        placeholder={placeholder}
        disabled={disabled}
        maxlength={maxLength}
        autofocus={autoFocus}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
      />
    )
  }
}

export default Textarea
