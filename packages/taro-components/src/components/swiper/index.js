import Nerv from 'nervjs'
import classNames from 'classnames'
import { throttle } from '../../../utils/index'
import './style/index.scss'

class Swiper extends Nerv.Component {
  constructor () {
    super(...arguments)
    this.state = {
      current: this.props.current
    }
    this.isSliding = false
  }

  initSwiper (nextProps) {
    this.autoplay()
    this.bindEvent()
    this.setSwiperWpStyle(this.getSwiperStyle(false, parseInt(this.state.current) + 1, nextProps))
  }

  getSwiperStyle (isAni, idx, props) {
    const {duration, easeType, children} = props || this.props
    const showCount = children.length + 2
    const wrapperStyle = {
      width: `${showCount * 100}%`,
      WebkitTransition: isAni ? `webkitTransform ${duration}ms ${easeType}` : 'none',
      transition: isAni ? `transform ${duration}ms ${easeType}` : 'none',
      WebkitTransform: `translate3d(${-100 / showCount * idx}%, 0, 0)`,
      transiform: `translate3d(${-100 / showCount * idx}%, 0, 0)`
    }
    return wrapperStyle
  }

  setSwiperWpStyle (wrapperStyle) {
    for (let i in wrapperStyle) {
      this.SwiperWp.style[i] = wrapperStyle[i]
    }
  }

  // 判断左滑还是右滑
  getSwiperDirection (e) {
    // 禁止快速滑动
    if (this.isSliding) return
    let touchEndX = e.changedTouches[0].pageX
    let touchEndY = e.changedTouches[0].pageY
    let offsetMoveX = Math.abs(touchEndX - this.touchStartX)
    let offsetMoveY = Math.abs(touchEndY - this.touchStartY)
    if (offsetMoveY > offsetMoveX) {
      this.autoplay()
      return
    }
    // 根据方向进行滑动
    if (this.SwiperDirection === 'pre') {
      this.slidePre()
    } else if (this.SwiperDirection === 'next') {
      this.slideNext('touch')
    }

    this.autoplay()
  }

  removeEvent () {
    this.SwiperWp.removeEventListener('touchstart', this.touchstartFn.bind(this))
    this.SwiperWp.removeEventListener('touchmove', this.touchMoveFn, false)
    this.SwiperWp.removeEventListener('touchend', this.touchendFn)
  }

  isPreventDefault (e) {
    // 左右滑动时禁止滑动页面
    let offsetMoveX = e.targetTouches[0].pageX - this.touchStartX
    let offsetMoveY = e.targetTouches[0].pageY - this.touchStartY
    if (Math.abs(offsetMoveX) > Math.abs(offsetMoveY)) {
      e.preventDefault()
      // 同时判断y属性，小于某个值才认为是滑动
      if (offsetMoveX > this.SwiperGap) {
        this.SwiperDirection = 'pre'
      } else if (-offsetMoveX > this.SwiperGap) {
        this.SwiperDirection = 'next'
      } else {
        this.SwiperDirection = 'none'
      }
    }
  }

  bindEvent () {
    const { slideMult } = this.props
    let SwiperWidth = this.child && this.child.getBoundingClientRect().width
    this.SwiperGap = (SwiperWidth || 0) / slideMult

    this.touchstartFn = function (e) {
      e.preventDefault()
      this.SwiperDirection = 'none'
      this.pauseAutoPlay()
      this.touchStartX = e.changedTouches[0].pageX
      this.touchStartY = e.changedTouches[0].pageY
    }
    this.touchendFn = this.getSwiperDirection.bind(this)
    this.touchMoveFn = throttle(this.isPreventDefault.bind(this), 150)

    this.SwiperWp.addEventListener('touchstart', this.touchstartFn.bind(this), false)
    this.SwiperWp.addEventListener('touchmove', this.touchMoveFn)
    this.SwiperWp.addEventListener('touchend', this.touchendFn, false)
  }

  // 滑动到某个idx的item中
  SwiperTo (realIdx, type) {
    const {duration, children, circular, autoplay} = this.props
    const SwiperCount = children.length
    const SwiperIdx = realIdx + 1
    this.isSliding = true

    if (realIdx >= SwiperCount && circular) {
      // 切换到下一张
      this.setSwiperWpStyle(this.getSwiperStyle(true, SwiperIdx))
      this.setState({current: 0}, () => {
        // 回复原位
        setTimeout(() => {
          this.setSwiperWpStyle(this.getSwiperStyle(false, 1))
          this.isSliding = false
          let e = {}
          Object.defineProperty(e, 'current', {
            enumerable: true,
            value: this.state.current + 1
          })
          Object.defineProperty(e, 'source', {
            enumerable: true,
            value: type
          })
          this.props.bindchange(e)
        }, duration)
      })
    } else if (realIdx <= -1 && circular) {
      // 切换到下一张
      this.setSwiperWpStyle(this.getSwiperStyle(true, SwiperIdx))
      this.setState({current: SwiperCount - 1}, () => {
        setTimeout(() => {
          // 回复原位
          this.setSwiperWpStyle(this.getSwiperStyle(false, SwiperCount))
          this.isSliding = false
          let e = {}
          Object.defineProperty(e, 'current', {
            enumerable: true,
            value: this.state.current + 1
          })
          Object.defineProperty(e, 'source', {
            enumerable: true,
            value: type
          })
          this.props.bindchange(e)
        }, duration)
      })
    } else if (realIdx > -1 && realIdx < SwiperCount) {
      // 切换到下一张
      this.setSwiperWpStyle(this.getSwiperStyle(true, SwiperIdx))
      this.setState({current: realIdx}, () => {
        setTimeout(() => {
          this.isSliding = false
          let e = {}
          Object.defineProperty(e, 'current', {
            enumerable: true,
            value: realIdx + 1
          })
          Object.defineProperty(e, 'source', {
            enumerable: true,
            value: type
          })
          this.props.bindchange(e)
        }, duration)
      })
    } else if (realIdx >= SwiperCount || realIdx < 0) {
      if (autoplay) {
        const cur = realIdx >= SwiperCount ? 1 : SwiperCount
        this.setSwiperWpStyle(this.getSwiperStyle(true, cur))

        this.setState({current: cur - 1}, () => {
          setTimeout(() => {
            this.isSliding = false

            let e = {}
            Object.defineProperty(e, 'current', {
              enumerable: true,
              value: cur
            })
            Object.defineProperty(e, 'source', {
              enumerable: true,
              value: type
            })
            this.props.bindchange(e)
          }, duration)
        })
      }
    } else {
      this.isSliding = false
    }
  }

  slideNext (type) {
    let idx = this.state.current
    const {children, circular, autoplay} = this.props
    const SwiperCount = children.length
    if (idx >= SwiperCount - 1 && !circular && !autoplay) { return }
    idx++
    this.SwiperTo(idx, type)
  }

  slidePre () {
    let idx = this.state.current
    const {circular, autoplay} = this.props
    if (idx <= 0 && !circular && !autoplay) { return }
    idx--
    this.SwiperTo(idx, 'touch')
  }

  autoplay () {
    const {interval, autoplay} = this.props
    this.SwiperTimer = null
    if (!autoplay) return
    this.SwiperTimer = setInterval(() => {
      this.slideNext('aotuplay')
    }, interval)
  }

  // 停止自动轮播
  pauseAutoPlay () {
    clearInterval(this.SwiperTimer)
  }

  cloneChild (child, props) {
    const clone = Nerv.cloneElement(child, props)
    if (!clone) {
      return clone
    }
    if (Array.isArray(clone.children)) {
      const children = clone.children.map(child => {
        return this.cloneChild(child, child.props)
      })
      clone.children = children
    } else if (clone.children) {
      clone.children = this.cloneChild(clone.children, clone.children.props)
    }
    if (clone.props && clone.props.children) {
      if (Array.isArray(clone.props.children)) {
        const children = clone.props.children.map(child => {
          return this.cloneChild(child, child.props)
        })
        clone.props.children = children
      } else if (clone.props.children) {
        clone.props.children = this.cloneChild(
          clone.props.children,
          clone.props.children.props
        )
      }
    }
    return clone
  }

  renderSwipers () {
    const {children} = this.props
    const SwiperCount = children.length
    const showCount = children.length + 2
    let Swipers = []
    let preSwiper = []
    let lastSwiper = []
    children.forEach((child, idx) => {
      let dom1 = {
        'data-index': idx,
        style: {
          width: `${100 / showCount}%`
        },
        ref: (childDom) => {
          if (!this.child) this.child = childDom
        }
      }

      const res = Object.assign(
        dom1,
        child.props
      )
      const cloneChild = this.cloneChild(child, res)
      Swipers.push(cloneChild)

      let dom2 = {
        'data-index': SwiperCount,
        style: {
          width: `${100 / showCount}%`
        }
      }
      const res1 = Object.assign(
        dom2,
        child.props
      )

      // 复制最后一个
      if (idx === 0) {
        lastSwiper.push(this.cloneChild(child, res1))
      }

      let dom3 = {
        'data-index': -1,
        style: {
          width: `${100 / showCount}%`
        }
      }
      const res2 = Object.assign(
        dom3,
        child.props
      )
      // 复制第一个
      if (idx === SwiperCount - 1) {
        preSwiper.push(this.cloneChild(child, res2))
      }
    })

    return preSwiper.concat(Swipers, lastSwiper)
  }

  componentDidMount () {
    this.initSwiper()
  }

  render () {
    const {
      wrapperClass,
      children,
      indicatorClass,
      indicatorItemClass,
      indicatorDots,
      indicatorColor,
      indicatorActiveColor
    } = this.props
    const {current} = this.state
    const SwiperCount = children.length
    const Swipers = this.renderSwipers()
    return <div className={wrapperClass}>
      <div
        className='swiper'
        ref={(SwiperWp) => { this.SwiperWp = SwiperWp }}>
        {Swipers}
      </div>
      {indicatorDots ? <IndicatorDots
        SwiperCount={SwiperCount}
        activeIdx={current}
        indicatorClass={indicatorClass}
        indicatorItemClass={indicatorItemClass}
        indicatorColor={indicatorColor}
        indicatorActiveColor={indicatorActiveColor} /> : null}
    </div>
  }
}

// 默认配置
Swiper.defaultProps = {
  wrapperClass: 'swiper_wrapper',
  indicatorClass: 'swiper_indicators',
  indicatorItemClass: 'swiper_indicators_item',
  easeType: 'ease-in-out',
  autoplay: false,
  interval: 5000,
  indicatorDots: false,
  duration: 500,
  indicatorColor: 'rgba(0, 0, 0, .3)',
  indicatorActiveColor: '#000',
  slideMult: 5,
  current: 0,
  circular: false
}

class IndicatorDots extends Nerv.Component {
  render () {
    const {activeIdx, SwiperCount, indicatorClass, indicatorItemClass, indicatorColor, indicatorActiveColor} = this.props
    const indicatorsArr = Array.apply(null, {length: SwiperCount})
    const activeColor = `background: ${indicatorActiveColor}`
    const color = `background: ${indicatorColor}`

    return <div className={indicatorClass}>
      {indicatorsArr.map((item, idx) => {
        return <i
          className={classNames(indicatorItemClass, {'active': idx === activeIdx})}
          key={idx}
          style={idx === activeIdx ? activeColor : color}
        />
      })}
    </div>
  }
}

export default Swiper
