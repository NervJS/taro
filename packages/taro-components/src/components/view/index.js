import Nerv from 'nervjs'
import omit from 'omit.js'
import classNames from 'classnames'

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
      hoverStayTime = 400
    } = this.props
    const cls = classNames(
      '',
      {
        [`${hoverClass}`]: this.state.hover
      },
      className
    )

    const _onTouchStart = e => {
      this.setState(() => ({
        touch: true
      }))
      if (hoverClass) {
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
      if (hoverClass) {
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
