import 'weui'
import Nerv from 'nervjs'
import omit from 'omit.js'
import classNames from 'classnames'

import './style/index.scss'

class Button extends Nerv.Component {
  constructor () {
    super(...arguments)
    this.state = {
      hover: false,
      touch: false
    }
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
        [`${hoverClass}`]: this.state.hover && !disabled,
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
      if (hoverClass && !disabled) {
        setTimeout(() => {
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
      if (hoverClass && !disabled) {
        setTimeout(() => {
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
        {loading && <i class='weui-loading' />}
        {children}
      </button>
    )
  }
}

export default Button
