import './style/index.css'

import classNames from 'classnames'
import React from 'react'

import { omit } from '../../utils'

interface IProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: string
  plain?: boolean
  hoverClass?: string
  hoverStartTime?: number
  hoverStayTime?: number
  loading?: boolean
}
 
interface IState {
  hover:boolean
  touch: boolean
}

class Button extends  React.Component<IProps, IState> {
    
  constructor (props) {
    super(props)
    this.state = {
      hover: false,
      touch: false
    }
  }
  
  startTimer
  endTimer

  componentWillUnmount () {
    this.startTimer && clearTimeout(this.startTimer)
    this.endTimer && clearTimeout(this.endTimer)
  }

  render () {
    const {
      children,
      disabled,
      className,
      style,
      onClick,
      onTouchStart,
      onTouchEnd,
      hoverClass = 'button-hover',
      hoverStartTime = 20,
      hoverStayTime = 70,
      size,
      plain,
      loading = false,
      type = 'default'
    } = this.props
    const cls = className || classNames(
      'weui-btn',
      {
        [`${hoverClass}`]: this.state.hover && !disabled && hoverClass !== 'none',
        [`weui-btn_plain-${type}`]: plain,
        [`weui-btn_${type}`]: !plain && type,
        'weui-btn_mini': size === 'mini',
        'weui-btn_loading': loading,
        'weui-btn_disabled': disabled
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
        {...omit(this.props, ['hoverClass', 'onTouchStart', 'onTouchEnd'])}
        className={cls}
        style={style}
        onClick={onClick}
        disabled={disabled}
        onTouchStart={_onTouchStart}
        onTouchEnd={_onTouchEnd}
      >
        {loading && <i className='weui-loading' />}
        {children}
      </button>
    )
  }
}

export default Button