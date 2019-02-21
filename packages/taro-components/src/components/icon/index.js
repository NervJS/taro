import 'weui'
import Nerv from 'nervjs'
import classNames from 'classnames'
import omit from 'omit.js'
const Icon = props => {
  let { type, className = '', size = '23', color } = props
  if (type) type = type.replace(/_/g, '-')
  const cls = classNames(
    {
      [`weui-icon-${type}`]: true
    },
    className
  )
  const style = { 'font-size': size + 'px', color: color }

  return (
    <i {...omit(props, ['type', 'className'])} className={cls} style={style} />
  )
}
export default Icon
