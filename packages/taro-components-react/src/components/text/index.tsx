import 'weui'
import React from 'react'
import classNames from 'classnames'
import './style/index.css'

interface IProps {
  className?: string
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
