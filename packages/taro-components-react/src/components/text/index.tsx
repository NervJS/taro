import './style/index.css'

import classNames from 'classnames'
import React from 'react'

import { createForwardRefComponent } from '../../utils/index'

interface IProps extends React.HTMLAttributes<HTMLSpanElement> {
  selectable?: boolean
  forwardedRef?: React.MutableRefObject<HTMLSpanElement>
}

class Text extends React.Component<IProps, Record<string, unknown>> {
  render () {
    const { className, forwardedRef, selectable = false, ...restProps } = this.props
    const cls = classNames(
      'taro-text',
      {
        'taro-text__selectable': selectable
      },
      className
    )
    return (
      <span {...restProps} className={cls} ref={forwardedRef}>
        {this.props.children}
      </span>
    )
  }
}

export default createForwardRefComponent(Text)
