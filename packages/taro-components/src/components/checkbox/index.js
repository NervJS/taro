import 'weui'
import Nerv from 'nervjs'
import omit from 'omit.js'
import classNames from 'classnames'
import './style/index.scss'

class Checkbox extends Nerv.Component {
  constructor () {
    super(...arguments)
  }

  render () {
    const { onChange, className, checked, name, color } = this.props
    const key = this.props.for
    const cls = classNames('taro-checkbox_checked ', className)
    const style = { color: color }
    const sty = this.props.style
    return (
      <span className='weui-cells_checkbox' style={sty}>
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
          className={cls}
          checked={checked}
          onChange={onChange}
          style={style}
        />
        {this.props.children}
      </span>
    )
  }
}

export default Checkbox
