import 'weui'
import Nerv from 'nervjs'
import omit from 'omit.js'
import BScroll from 'better-scroll'
import classNames from 'classnames'

import './style/index.scss'

class ScrollView extends Nerv.Component {
  constructor () {
    super(...arguments)
    this._cacheLastX = 0
    this._cacheLastY = 0
  }

  componentDidMount () {
    this.initScroll()
  }

  componentDidUpdate () {
    if (!this.refs.wrapperScroll) {
      return
    }
    this._scroll.destroy()
    this.initScroll()
  }

  componentWillUnmount () {
    this._scroll.destroy()
  }

  initScroll () {
    if (!this.refs.wrapperScroll) {
      return
    }
    const {
      onScroll,
      onScrollToUpper,
      upperThreshold = 50,
      onScrollToLower,
      lowerThreshold = 50,
      scrollWithAnimation,
      scrollX,
      scrollY,
      scrollTop,
      scrollLeft,
      scrollIntoView
    } = this.props
    let opt = {
      probeType: onScroll ? 3 : 0,
      bounce: false,
      click: true,
      scrollX,
      scrollY,
      pullDownRefresh: {
        threshold: 50,
        stop: 20
      }
    }

    if (scrollX) {
      this.refs.contentScroll.style.width =
        this.computedWidth(this.props.children) + 'px'
    }

    this._scroll = new BScroll(this.refs.wrapperScroll, opt)

    if (onScroll) {
      this._scroll.on('scroll', pos => {
        const absX = Math.ceil(Math.abs(pos.x))
        const absY = Math.ceil(Math.abs(pos.y))

        const absMaxX = Math.abs(this._scroll.maxScrollX)
        const absMaxY = Math.abs(this._scroll.maxScrollY)

        const detail = {
          scrollLeft: absX,
          scrollTop: absY,
          scrollHeight: this._scroll.scrollerHeight,
          scrollWidth: this._scroll.scrollerWidth,
          deltaX: this._scroll.directionX,
          deltaY: this._scroll.directionY
        }
        onScroll({ detail })

        // 滚动到顶部/左边触发
        if (onScrollToUpper) {
          // 顶部
          if (upperThreshold > absY && this._cacheLastY !== absY) {
            this._cacheLastY = absY
            this.throttle(onScrollToUpper, 200)()
          } else if (upperThreshold > absX && this._cacheLastX !== absX) {
            // 左边
            this._cacheLastX = absX
            this.throttle(onScrollToUpper, 200)()
          }
        }

        // 滚动到底部右边触发
        if (onScrollToLower) {
          // 底部
          if (
            lowerThreshold > Math.ceil(absMaxY) - absY &&
            this._cacheLastY !== absY
          ) {
            this._cacheLastY = absY
            this.throttle(onScrollToLower, 200)()
          } else if (
            lowerThreshold > Math.ceil(absMaxX) - absX &&
            this._cacheLastX !== absX
          ) {
            // 右边
            this._cacheLastX = absX
            this.throttle(onScrollToLower, 200)()
          }
        }
      })
    }

    const scrollWithAnimationTime = scrollWithAnimation ? 400 : 0
    scrollTop &&
      this._scroll.scrollTo(
        0,
        (scrollTop / this._scroll.scrollerHeight) * this._scroll.maxScrollY,
        scrollWithAnimationTime
      )
    scrollLeft &&
      this._scroll.scrollTo(
        (scrollLeft / this._scroll.scrollerWidth) * this._scroll.maxScrollX,
        0,
        scrollWithAnimationTime
      )

    if (scrollIntoView) {
      // 第一个子元素滚动不到，Hack 一下
      const firstChildId = this.refs.contentScroll.firstChild && this.refs.contentScroll.firstChild.getAttribute('id')
      const posX = scrollX ? 1 : 0
      const posY = scrollY ? 1 : 0
      firstChildId === scrollIntoView ? this._scroll.scrollTo(posX, posY, scrollWithAnimationTime) : this._scroll.scrollToElement(`#${scrollIntoView}`, scrollWithAnimationTime)
    }
  }

  computedWidth (children) {
    let contentW = 0
    if (Array.isArray(children) && children.length) {
      contentW += this.parseComponentsArr(children)
    } else if (!Array.isArray(children)) {
      contentW += children.dom.getBoundingClientRect().width
    }
    return contentW
  }

  parseComponentsArr (children) {
    let contentW = 0
    if (Array.isArray(children) && children.length) {
      children.forEach(ele => {
        contentW += this.parseComponentsArr(ele)
      })
    } else if (!Array.isArray(children)) {
      contentW += children.dom.getBoundingClientRect().width
    }
    return contentW
  }

  throttle (fn, delay) {
    if (this._timer) clearTimeout(this._timer)
    this._timer = null
    return () => {
      this._timer = setTimeout(() => fn(), delay)
    }
  }

  render () {
    const { className, style, scrollX } = this.props
    const cls = classNames('taro-scroll', className)
    const contentScroll = classNames('taro-scroll-content', {
      'taro-scroll-content-x': scrollX
    })
    return (
      <div
        ref='wrapperScroll'
        {...omit(this.props, [
          'className',
          'scrollX',
          'scrollY',
          'scrollTop',
          'scrollLeft',
          'scrollWithAnimation',
          'onScrollToUpper',
          'onScrollToLower',
          'onScroll',
          'style'
        ])}
        style={style}
        className={cls}
      >
        <div ref='contentScroll' className={contentScroll}>
          {this.props.children}
        </div>
      </div>
    )
  }
}

export default ScrollView
