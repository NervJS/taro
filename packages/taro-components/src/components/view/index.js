import 'weui'
import Nerv from 'nervjs'
import omit from 'omit.js'
import classNames from 'classnames'
import './style/index.scss'

class View extends Nerv.Component {
  constructor () {
    super(...arguments)
    this.state = {
      hover: false,
      touch: false
    }
  }

  timeoutEvent = 0;
  startTime = 0;
  render () {
    const {
      hoverClass,
      onTouchStart,
      onTouchEnd,
      onTouchMove,
      className,
      hoverStartTime = 50,
      hoverStayTime = 400,
      ...other
    } = this.props
    const cls = classNames(
      '',
      {
        [`${hoverClass}`]: this.state.hover
      },
      className
    )

    const _onTouchStart = e => {
      if (hoverClass) {
        this.setState(() => ({
          touch: true
        }))
        setTimeout(() => {
          if (this.state.touch) {
            this.setState(() => ({
              hover: true
            }))
          }
        }, hoverStartTime)
      }
      onTouchStart && onTouchStart(e)
      if (this.props.onLongPress) {
        this.timeoutEvent = setTimeout(() => {
          this.props.onLongPress()
        }, 350)
        this.startTime = (new Date()).getTime()
      }
    }
    const _onTouchMove = e => {
      clearTimeout(this.timeoutEvent)
      onTouchMove && onTouchMove(e)
    }

    const _onTouchEnd = e => {
      const spanTime = (new Date().getTime()) - this.startTime
      if (spanTime < 350) {
        clearTimeout(this.timeoutEvent)
      }
      if (hoverClass) {
        this.setState(() => ({
          touch: false
        }))
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
      <div
        {...omit(this.props, [
          'hoverClass',
          'onTouchStart',
          'onTouchEnd',
          'onTouchMove',
          'className',
          'hoverStartTime',
          'hoverStayTime'
        ])}
        {...other}
        className={cls}
        onTouchStart={_onTouchStart}
        onTouchEnd={_onTouchEnd}
        onTouchMove={_onTouchMove}
      >
        {this.props.children}
      </div>
    )
  }
}

export default View
