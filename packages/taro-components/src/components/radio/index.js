import Nerv from 'nervjs'
import omit from 'omit.js'
import classNames from 'classnames'

function parseKey (key) {
  if (typeof key === 'undefined') {
    throw new Error('Radio undefined key')
  }
  return key
}

class Radio extends Nerv.Component {
  constructor () {
    super(...arguments)
  }

  render () {
    const { onChange, className, checked, name } = this.props
    const key = this.props.for
    const cls = classNames('weui-check', className)
    return (
      <label className='weui-cells_checkbox' for={parseKey(key)}>
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
      </label>
    )
  }
}

export default Radio
