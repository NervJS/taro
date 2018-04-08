import Nerv from 'nervjs'
import omit from 'omit.js'
import classNames from 'classnames'
import './style'

function parseKey (key) {
  if (typeof key === 'undefined') {
    throw new Error('Checkbox undefined key')
  }
  return key
}

class Checkbox extends Nerv.Component {
  constructor () {
    super(...arguments)
  }

  render () {
    const { onChange, className, checked, name, color } = this.props
    const key = this.props.for
    const cls = classNames('taro-checkbox_checked ', className)
    const style = { color: color }
    return (
      <label className='weui-cells_checkbox' for={parseKey(key)}>
        <input
          {...omit(this.props, [
            'className',
            'checked',
            'onChange',
            'name',
            'type',
            'id',
            'style'
          ])}
          id={key}
          type='checkbox'
          name={name}
          class={cls}
          checked={checked}
          onChange={onChange}
          style={style}
        />
        {this.props.children}
      </label>
    )
  }
}

export default Checkbox
