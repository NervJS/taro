import 'weui'
import './style/index.css'

import classNames from 'classnames'
import React from 'react'

interface IProps extends React.HTMLAttributes<HTMLSpanElement> {
  selectable?: boolean
}

class Text extends React.Component<IProps, Record<string, unknown>> {
  render () {
    const { className, selectable = false, ...restProps } = this.props
    const cls = classNames(
      'taro-text',
      {
        'taro-text__selectable': selectable
      },
      className
    )
    return (
      <span {...restProps} className={cls}>
        {this.props.children}
      </span>
    )
  }
}

export default Text
