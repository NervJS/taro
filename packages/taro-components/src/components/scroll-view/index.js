import Nerv from 'nervjs'
import omit from 'omit.js'
import classNames from 'classnames'
import './style/index.scss'
function easeOutScroll (from, to, callback) {
  if (from === to || typeof from !== 'number') {
    return
  }
  let change = to - from
  const dur = 500
  const sTime = +new Date()
  function linear (t, b, c, d) {
    return c * t / d + b
  }
  function step () {
    from = linear(+new Date() - sTime, from, change, dur)
    if (from >= to) {
      callback(to, true)
      return
    }
    callback(from, false)
    requestAnimationFrame(step)
  }
  step()
}
function throttle (fn, delay) {
  let timer = null
  return function () {
    clearTimeout(timer)
    timer = setTimeout(function () {
      fn()
    }, delay)
  }
}
class ScrollView extends Nerv.Component {
  constructor () {
    super(...arguments)
  }
  componentDidMount () {
    setTimeout(() => {
      const props = this.props
      if (props.scrollY && props.scrollTop) {
        if ('scrollWithAnimation' in props) {
          easeOutScroll(0, props.scrollTop, pos => {
            this.container.scrollTop = pos
          })
        } else {
          this.container.scrollTop = props.scrollTop
        }
      }
      if (props.scrollX && props.scrollLeft) {
        if ('scrollWithAnimation' in props) {
          easeOutScroll(0, props.scrollLeft, pos => {
            this.container.scrollLeft = pos
          })
        } else {
          this.container.scrollLeft = props.scrollLeft
        }
      }
    }, 10)
  }

  componentWillReceiveProps (nextProps) {
    setTimeout(() => {
      const props = nextProps
      if (props.scrollY && props.scrollTop && this.props.scrollTop !== props.scrollTop) {
        if ('scrollWithAnimation' in props) {
          easeOutScroll(0, props.scrollTop, pos => {
            this.container.scrollTop = pos
          })
        } else {
          this.container.scrollTop = props.scrollTop
        }
      }
      if (props.scrollX && props.scrollLeft && this.props.scrollLeft !== props.scrollLeft) {
        if ('scrollWithAnimation' in props) {
          easeOutScroll(0, props.scrollLeft, pos => {
            this.container.scrollLeft = pos
          })
        } else {
          this.container.scrollLeft = props.scrollLeft
        }
      }
    }, 10)
  }
  render () {
    const {
      className,
      onScroll,
      onScrolltoupper,
      onScrolltolower,
      scrollX,
      scrollY,
      upperThreshold = 0,
      lowerThreshold = 0
    } = this.props
    const cls = classNames(
      'taro-scroll',
      {
        [`taro-scroll-view__scroll-x`]: scrollX,
        [`taro-scroll-view__scroll-y`]: scrollY
      },
      className
    )
    const uperAndLower = () => {
      const {
        offsetWidth,
        offsetHeight,
        scrollLeft,
        scrollTop,
        scrollHeight,
        scrollWidth
      } = this.container
      if (
        onScrolltolower &&
        ((this.props.scrollY &&
          offsetHeight + scrollTop + lowerThreshold >= scrollHeight) ||
          (this.props.scrollX &&
            offsetWidth + scrollLeft + lowerThreshold >= scrollWidth))
      ) {
        onScrolltolower()
      }
      if (
        onScrolltoupper &&
        ((this.props.scrollY && scrollTop <= upperThreshold) ||
          (this.props.scrollX && scrollLeft <= upperThreshold))
      ) {
        onScrolltoupper()
      }
    }
    const uperAndLowerThrottle = throttle(uperAndLower, 200)
    const _onScroll = e => {
      const {
        scrollLeft,
        scrollTop,
        scrollHeight,
        scrollWidth
      } = this.container
      e.detail = {
        scrollLeft,
        scrollTop,
        scrollHeight,
        scrollWidth
      }
      uperAndLowerThrottle()
      onScroll && onScroll(e)
    }
    return (
      <div
        ref={container => {
          this.container = container
        }}
        {...omit(this.props, ['className'])}
        className={cls}
        onScroll={_onScroll}
      >
        {this.props.children}
      </div>
    )
  }
}

export default ScrollView
