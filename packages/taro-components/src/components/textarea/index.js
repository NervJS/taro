import Nerv from 'nervjs'
import omit from 'omit.js'
import classNames from 'classnames'
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
      autofocus
    } = this.props
    const cls = classNames('weui-textarea', className)
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
        className={cls}
        placeholder={placeholder}
        disabled={disabled}
        maxlength={maxlength}
        autofocus={autofocus}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
      />
    )
  }
}

export default Textarea
