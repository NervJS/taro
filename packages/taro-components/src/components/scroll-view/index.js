import 'weui'
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
  return function (...arrs) {
    clearTimeout(timer)
    timer = setTimeout(function () {
      fn(...arrs)
    }, delay)
  }
}
class ScrollView extends Nerv.Component {
  constructor () {
    super(...arguments)
  }

  onTouchMove = e => {
    e.stopPropagation()
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
        this._scrollTop = props.scrollTop
      }
      if (props.scrollX && typeof props.scrollLeft === 'number') {
        if ('scrollWithAnimation' in props) {
          easeOutScroll(0, props.scrollLeft, pos => {
            this.container.scrollLeft = pos
          })
        } else {
          this.container.scrollLeft = props.scrollLeft
        }
        this._scrollLeft = props.scrollLeft
      }
    }, 10)
  }

  componentWillReceiveProps (nextProps) {
    const props = this.props
    // Y 轴滚动
    if (
      nextProps.scrollY &&
      typeof nextProps.scrollTop === 'number' &&
      nextProps.scrollTop !== this._scrollTop
    ) {
      if ('scrollWithAnimation' in nextProps) {
        easeOutScroll(this._scrollTop, nextProps.scrollTop, pos => {
          if (this.container) this.container.scrollTop = pos
        })
      } else {
        if (this.container) this.container.scrollTop = nextProps.scrollTop
      }
      this._scrollTop = nextProps.scrollTop
    }
    // X 轴滚动
    if (
      nextProps.scrollX &&
      typeof props.scrollLeft === 'number' &&
      nextProps.scrollLeft !== this._scrollLeft
    ) {
      if ('scrollWithAnimation' in nextProps) {
        easeOutScroll(this._scrollLeft, nextProps.scrollLeft, pos => {
          if (this.container) this.container.scrollLeft = pos
        })
      } else {
        if (this.container) this.container.scrollLeft = nextProps.scrollLeft
      }
      this._scrollLeft = nextProps.scrollLeft
    }
    // scrollIntoView
    if (
      nextProps.scrollIntoView &&
      typeof nextProps.scrollIntoView === 'string' &&
      document &&
      document.querySelector &&
      document.querySelector(`#${nextProps.scrollIntoView}`)
    ) {
      document.querySelector(`#${nextProps.scrollIntoView}`).scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'start'
      })
    }
  }

  render () {
    const {
      className,
      onScroll,
      onScrollToUpper,
      onScrollToLower,
      onTouchMove,
      scrollX,
      scrollY
    } = this.props
    let { upperThreshold = 50, lowerThreshold = 50 } = this.props
    const cls = classNames(
      'taro-scroll',
      {
        [`taro-scroll-view__scroll-x`]: scrollX,
        [`taro-scroll-view__scroll-y`]: scrollY
      },
      className
    )
    upperThreshold = parseInt(upperThreshold)
    lowerThreshold = parseInt(lowerThreshold)
    const uperAndLower = (e) => {
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
        onScrollToLower(e)
      }
      if (
        onScrollToUpper &&
        ((this.props.scrollY && scrollTop <= upperThreshold) ||
          (this.props.scrollX && scrollLeft <= upperThreshold))
      ) {
        onScrollToUpper(e)
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
      this._scrollLeft = scrollLeft
      this._scrollTop = scrollTop
      Object.defineProperty(e, 'detail', {
        enumerable: true,
        writable: true,
        value: {
          scrollLeft,
          scrollTop,
          scrollHeight,
          scrollWidth
        }
      })
      uperAndLowerThrottle(e)
      onScroll && onScroll(e)
    }
    const _onTouchMove = e => {
      onTouchMove ? onTouchMove(e) : this.onTouchMove(e)
    }
    return (
      <div
        ref={container => {
          this.container = container
        }}
        {
        ...omit(this.props, ['className', 'scrollTop', 'scrollLeft'])
        }
        className={cls}
        onScroll={_onScroll}
        onTouchMove={
          _onTouchMove
        } >
        {this.props.children}
      </div>
    )
  }
}

export default ScrollView
