import './style/index.css'

import classNames from 'classnames'
import React from 'react'

interface IProps extends React.HTMLAttributes<HTMLSpanElement> {
  selectable?: boolean
}

function Text (props: IProps) {
  const { className, selectable = false, ...restProps } = props
  const cls = classNames(
    'taro-text',
    {
      'taro-text__selectable': selectable
    },
    className
  )
  return (
    <span {...restProps} className={cls}>
      {props.children}
    </span>
  )
}

export default Text
