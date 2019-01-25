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

  render () {
    const {
      hoverClass,
      onTouchStart,
      onTouchEnd,
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
    }
    const _onTouchEnd = e => {
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
          'className',
          'hoverStartTime',
          'hoverStayTime'
        ])}
        {...other}
        className={cls}
        onTouchStart={_onTouchStart}
        onTouchEnd={_onTouchEnd}
      >
        {this.props.children}
      </div>
    )
  }
}

export default View
