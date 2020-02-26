import 'weui'
import Nerv from 'nervjs'
import omit from 'omit.js'
import classNames from 'classnames'

class Radio extends Nerv.Component {
  constructor () {
    super(...arguments)
  }

  render () {
    const { onChange, className, checked, name, style } = this.props
    const key = this.props.for
    const cls = classNames('weui-check', className)
    return (
      <span className='weui-cells_checkbox' onClick={onChange && (e => onChange(e, key))} style={style}>
        <input
          {...omit(this.props, [
            'className',
            'checked',
            'onChange',
            'name',
            'id',
            'type',
            'style'
          ])}
          id={key}
          type='radio'
          name={name}
          className={cls}
          checked={checked}
        />
        {className ? (false) : (<i className='weui-icon-checked' />) }
        {this.props.children}
      </span>
    )
  }
}

export default Radio
