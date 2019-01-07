import Nerv from 'nervjs'
import omit from 'omit.js'
class Textarea extends Nerv.Component {
  constructor () {
    super(...arguments)
    this.onChange = this.onChange.bind(this)
  }

  onChange (e) {
    const { onChange = '', onInput = '' } = this.props
    Object.defineProperty(e, 'detail', {
      enumerable: true,
      value: {
        value: e.target.value
      }
    })
    if (onChange) return onChange && onChange(e)
    if (onInput) return onInput && onInput(e)
  }

  render () {
    const {
      className = '',
      placeholder = '',
      disabled,
      maxlength = 140,
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
          'onInput',
          'onFocus',
          'onBlur',
          'autofocus'
        ])}
        className={className}
        placeholder={placeholder}
        disabled={disabled}
        maxlength={maxlength}
        autofocus={autoFocus}
        onChange={this.onChange}
        onFocus={onFocus}
        onBlur={onBlur}
      />
    )
  }
}

export default Textarea
