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
  const isLarger = to >= from

  function step () {
    from = linear(+new Date() - sTime, from, change, dur)
    if ((isLarger && from >= to) || (!isLarger && to >= from)) {
      callback(to)
      return
    }
    callback(from)
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
      if (props.scrollY && typeof props.scrollTop === 'number') {
        if ('scrollWithAnimation' in props) {
          easeOutScroll(0, props.scrollTop, pos => {
            this.container.scrollTop = pos
          })
        } else {
          this.container.scrollTop = props.scrollTop
        }
      }
      if (props.scrollX && typeof props.scrollLeft === 'number') {
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
    const props = this.props
    // Y 轴滚动
    if (
      nextProps.scrollY &&
      typeof props.scrollTop === 'number' &&
      nextProps.scrollTop !== props.scrollTop
    ) {
      if ('scrollWithAnimation' in nextProps) {
        easeOutScroll(props.scrollTop, nextProps.scrollTop, pos => {
          this.container.scrollTop = pos
        })
      } else {
        this.container.scrollTop = nextProps.scrollTop
      }
    }
    // X 轴滚动
    if (
      nextProps.scrollX &&
      typeof props.scrollLeft === 'number' &&
      nextProps.scrollLeft !== props.scrollLeft
    ) {
      if ('scrollWithAnimation' in nextProps) {
        easeOutScroll(props.scrollLeft, nextProps.scrollLeft, pos => {
          this.container.scrollLeft = pos
        })
      } else {
        this.container.scrollLeft = nextProps.scrollLeft
      }
    }
  }

  render () {
    const {
      className,
      onScroll,
      onScrollToUpper,
      onScrollToLower,
      scrollX,
      scrollY
    } = this.props
    let { upperThreshold = 0, lowerThreshold = 0 } = this.props
    const cls = classNames(
      'taro-scroll',
      {
        [`taro-scroll-view__scroll-x`]: scrollX,
        [`taro-scroll-view__scroll-y`]: scrollY
      },
      className
    )
    upperThreshold = parseInt(upperThreshold)
    lowerThreshold = parseInt(upperThreshold)
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
        onScrollToLower &&
        ((this.props.scrollY &&
          offsetHeight + scrollTop + lowerThreshold >= scrollHeight) ||
          (this.props.scrollX &&
            offsetWidth + scrollLeft + lowerThreshold >= scrollWidth))
      ) {
        onScrollToLower()
      }
      if (
        onScrollToUpper &&
        ((this.props.scrollY && scrollTop <= upperThreshold) ||
          (this.props.scrollX && scrollLeft <= upperThreshold))
      ) {
        onScrollToUpper()
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
