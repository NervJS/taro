import './style/index.scss'

import classNames from 'classnames'
import React from 'react'

import { createForwardRefComponent,omit } from '../../utils'


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
    <i {...omit(props, ['type', 'className', 'forwardedRef'])} className={cls} style={style} ref={forwardedRef} />
  )
}
export default createForwardRefComponent(Icon)
