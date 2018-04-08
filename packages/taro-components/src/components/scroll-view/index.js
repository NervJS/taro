import Nerv from 'nervjs'
import omit from 'omit.js'
import classNames from 'classnames'
import './style'
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
      if (props['scroll-y'] && 'scroll-top' in props) {
        if ('scroll-with-animation' in props) {
          easeOutScroll(0, props['scroll-top'], pos => {
            this.container.scrollTop = pos
          })
        } else {
          this.container.scrollTop = props['scroll-top']
        }
      }
      if (props['scroll-x'] && 'scroll-left' in props) {
        if ('scroll-with-animation' in props) {
          easeOutScroll(0, props['scroll-left'], pos => {
            this.container.scrollLeft = pos
          })
        } else {
          this.container.scrollLeft = props['scroll-left']
        }
      }
    }, 10)
  }
  render () {
    const {
      className,
      onScroll,
      bindscrolltoupper,
      bindscrolltolower,
      upperThreshold = 0,
      lowerThreshold = 0
    } = this.props
    const cls = classNames(
      'taro-scroll',
      {
        [`taro-scroll-view__scroll-x`]: this.props['scroll-x'],
        [`taro-scroll-view__scroll-y`]: this.props['scroll-y']
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
        bindscrolltolower &&
        ((this.props['scroll-y'] &&
          offsetHeight + scrollTop + lowerThreshold >= scrollHeight) ||
          (this.props['scroll-x'] &&
            offsetWidth + scrollLeft + lowerThreshold >= scrollWidth))
      ) {
        bindscrolltolower()
      }
      if (
        bindscrolltoupper &&
        ((this.props['scroll-y'] && scrollTop <= upperThreshold) ||
          (this.props['scroll-x'] && scrollLeft <= upperThreshold))
      ) {
        bindscrolltoupper()
      }
    }
    const uperAndLowerThrottle = throttle(uperAndLower, 200)
    const _onScroll = e => {
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
