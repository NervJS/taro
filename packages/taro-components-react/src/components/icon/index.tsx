import './style/index.scss'

import classNames from 'classnames'

import { createForwardRefComponent, omit } from '../../utils'

interface IProps {
  type: string
  color: string
  size?: number | string
  className?: string
  forwardedRef?: React.MutableRefObject<HTMLLIElement>
}

const Icon = (props: IProps) => {
  let { type, className = '', size = '23', color, forwardedRef } = props
  if (type) type = type.replace(/_/g, '-')
  const cls = classNames(
    {
      [`weui-icon-${type}`]: true
    },
    className
  )
  const style = { 'font-size': size + 'px', color: color }

  return (
    // eslint-disable-next-line react/react-in-jsx-scope
    <i ref={forwardedRef} {...omit(props, ['type', 'className', 'forwardedRef'])} className={cls} style={style} />
  )
}
export default createForwardRefComponent(Icon)
