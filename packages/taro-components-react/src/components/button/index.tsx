import './style/index.scss'

import classNames from 'classnames'
import React from 'react'

import { omit } from '../../utils'

interface IProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  size?: string
  plain?: boolean
  hoverClass?: string
  hoverStartTime?: number
  hoverStayTime?: number
  disabled?: boolean
  loading?: boolean
  type?: string
  className?: string
}

interface IState {
  hover:boolean
  touch: boolean
}

class Button extends React.Component<IProps, IState> {
  constructor (props) {
    super(props)
    this.state = {
      hover: false,
      touch: false
    }
  }

  startTimer: ReturnType<typeof setTimeout>
  endTimer: ReturnType<typeof setTimeout>

  componentWillUnmount () {
    this.startTimer && clearTimeout(this.startTimer)
    this.endTimer && clearTimeout(this.endTimer)
  }

  render () {
    const {
      plain = false,
      children,
      disabled = false,
      className,
      style,
      onClick,
      onTouchStart,
      onTouchEnd,
      hoverClass = 'button-hover',
      hoverStartTime = 20,
      hoverStayTime = 70,
      loading = false,
      type,
    } = this.props
    const cls = classNames(
      className,
      'taro-button-core',
      {
        [`${hoverClass}`]: this.state.hover && !disabled
      }
    )

    const _onTouchStart = e => {
      this.setState(() => ({
        touch: true
      }))
      if (hoverClass && hoverClass !== 'none' && !disabled) {
        this.startTimer = setTimeout(() => {
          if (this.state.touch) {
            this.setState(() => ({
              hover: true
            }))
          }
        }, hoverStartTime)
      }
      onTouchStart && onTouchStart(e)
    }
    const _onTouchEnd = e => {
      this.setState(() => ({
        touch: false
      }))
      if (hoverClass && hoverClass !== 'none' && !disabled) {
        this.endTimer = setTimeout(() => {
          if (!this.state.touch) {
            this.setState(() => ({
              hover: false
            }))
          }
        }, hoverStayTime)
      }
      onTouchEnd && onTouchEnd(e)
    }

    return (
      <button
        {...omit(this.props, ['hoverClass', 'onTouchStart', 'onTouchEnd', 'type', 'loading'])}
        type={type}
        className={cls}
        style={style}
        onClick={onClick}
        disabled={disabled}
        onTouchStart={_onTouchStart}
        onTouchEnd={_onTouchEnd}
        loading={loading.toString()}
        plain={plain.toString()}
      >
        {!!loading && <i className='weui-loading' />}
        {children}
      </button>
    )
  }
}

export default Button
