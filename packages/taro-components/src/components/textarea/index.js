import Nerv from 'nervjs'
import omit from 'omit.js'
class Textarea extends Nerv.Component {
  constructor () {
    super(...arguments)
  }

  render () {
    const {
      className,
      placeholder,
      disabled,
      maxlength = 140,
      onChange,
      onFocus,
      onBlur,
      autoFocus
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
        maxlength={maxlength}
        autofocus={autoFocus}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
      />
    )
  }
}

export default Textarea
