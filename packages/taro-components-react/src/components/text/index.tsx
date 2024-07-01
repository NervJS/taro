import './style/index.css'

import classNames from 'classnames'
import React from 'react'

import { createForwardRefComponent } from '../../utils'

interface IProps extends React.HTMLAttributes<HTMLSpanElement> {
  selectable?: boolean
  forwardedRef?: React.MutableRefObject<HTMLSpanElement>
}

function Text (props: IProps) {
  const { className, selectable = false, forwardedRef, ...restProps } = props
  const cls = classNames(
    'taro-text',
    {
      'taro-text__selectable': selectable
    },
    className
  )
  return (
    <span {...restProps} className={cls} ref={forwardedRef}>
      {props.children}
    </span>
  )
}

export default createForwardRefComponent(Text)
