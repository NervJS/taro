import Nerv from 'nervjs'
import omit from 'omit.js'
import classNames from 'classnames'

class Radio extends Nerv.Component {
  constructor () {
    super(...arguments)
  }

  render () {
    const { onChange, className, checked, name } = this.props
    const key = this.props.for
    const cls = classNames('weui-check', className)
    return (
      <span className='weui-cells_checkbox'>
        <input
          {...omit(this.props, [
            'className',
            'checked',
            'onChange',
            'name',
            'id',
            'type'
          ])}
          id={key}
          type='radio'
          name={name}
          class={cls}
          checked={checked}
          onChange={onChange}
        />
        <i className='weui-icon-checked' />
        {this.props.children}
      </span>
    )
  }
}

export default Radio
