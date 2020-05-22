import 'weui'
import Nerv from 'nervjs'
import omit from 'omit.js'
import classNames from 'classnames'
import './style/index.scss'

function easeOutScroll (from = 0, to = 0, callback) {
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
function scrollIntoView (id) {
  document.querySelector(`#${id}`).scrollIntoView({
    behavior: 'smooth',
    block: 'center',
    inline: 'start'
  })
}
function scrollVertical (top, isAnimation) {
  if (isAnimation) {
    easeOutScroll(this._scrollTop, top, pos => {
      if (this.container) this.container.scrollTop = pos
    })
  } else {
    if (this.container) this.container.scrollTop = top
  }
  this._scrollTop = top
}
function scrollHorizontal (left, isAnimation) {
  if (isAnimation) {
    easeOutScroll(this._scrollLeft, left, pos => {
      if (this.container) this.container.scrollLeft = pos
    })
  } else {
    if (this.container) this.container.scrollLeft = left
  }
  this._scrollLeft = left
}
class ScrollView extends Nerv.Component {
  constructor () {
    super(...arguments)
  }

  onTouchMove = e => {
    e.stopPropagation()
  }

  componentDidMount () {
    this.handleScroll(this.props, true)
  }

  componentWillReceiveProps (nextProps) {
    this.handleScroll(nextProps)
  }

  handleScroll (props, isInit = false) {
    // scrollIntoView
    if (
      props.scrollIntoView &&
      typeof props.scrollIntoView === 'string' &&
      document &&
      document.querySelector &&
      document.querySelector(`#${props.scrollIntoView}`)
    ) {
      if (isInit) {
        setTimeout(() => scrollIntoView(props.scrollIntoView), 500)
      } else {
        scrollIntoView(props.scrollIntoView)
      }
    } else {
      const isAnimation = 'scrollWithAnimation' in props
      // Y 轴滚动
      if (
        props.scrollY &&
        typeof props.scrollTop === 'number' &&
        props.scrollTop !== this._scrollTop
      ) {
        if (isInit) {
          setTimeout(() => scrollVertical.bind(this)(props.scrollTop, isAnimation), 10)
        } else {
          scrollVertical.bind(this)(props.scrollTop, isAnimation)
        }
      }
      // X 轴滚动
      if (
        props.scrollX &&
        typeof props.scrollLeft === 'number' &&
        props.scrollLeft !== this._scrollLeft
      ) {
        if (isInit) {
          setTimeout(() => scrollHorizontal.bind(this)(props.scrollLeft, isAnimation), 10)
        } else {
          scrollHorizontal.bind(this)(props.scrollLeft, isAnimation)
        }
      }
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
      if (!this.container) return
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
        }
        onLoad={e => {
          console.log('onload', e)
        }} >
        {this.props.children}
      </div>
    )
  }
}

export default ScrollView
