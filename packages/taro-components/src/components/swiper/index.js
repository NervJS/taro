import 'weui'
import Nerv from 'nervjs'
import classNames from 'classnames'
import Swipers from 'swiper'

import 'swiper/dist/css/swiper.min.css'
import './style/index.scss'

let INSTANCE_ID = 0

class SwiperItem extends Nerv.Component {
  render () {
    const { className, style, itemId, children, ...restProps } = this.props
    const cls = classNames('swiper-slide', className)
    return <div
      className={cls}
      style={style}
      item-id={itemId}
      {...restProps}>
      {children}
    </div>
  }
}

const createEvent = type => {
  let e
  try {
    e = new TouchEvent(type)
  } catch (err) {
    e = document.createEvent('Event')
    e.initEvent(type, true, true)
  }
  return e
}

class Swiper extends Nerv.Component {
  constructor () {
    super(...arguments)
    this.$el = null
    this._id = INSTANCE_ID + 1
    INSTANCE_ID++
    this._$current = 0
    this._$width = 0
    this._$height = 0
  }

  componentDidMount () {
    const {
      autoplay = false,
      interval = 5000,
      duration = 500,
      current = 0,
      displayMultipleItems = 1,
      circular,
      vertical,
      spaceBetween
    } = this.props

    const that = this
    const opt = {
      // 指示器
      pagination: { el: `.taro-swiper-${this._id} .swiper-container .swiper-pagination` },
      direction: vertical ? 'vertical' : 'horizontal',
      loop: circular,
      slidesPerView: parseFloat(displayMultipleItems, 10),
      initialSlide: parseInt(current, 10),
      speed: parseInt(duration, 10),
      observer: true,
      observeParents: true,
      on: {
        slideChange () {
          const e = createEvent('touchend')
          try {
            Object.defineProperty(e, 'detail', {
              enumerable: true,
              value: {
                current: this.realIndex
              }
            })
          } catch (err) {}
          that._$current = this.realIndex
          that.handleOnChange(e)
        },
        transitionEnd () {
          const e = createEvent('touchend')
          try {
            Object.defineProperty(e, 'detail', {
              enumerable: true,
              value: {
                current: this.realIndex
              }
            })
          } catch (err) {}
          that.handleOnAnimationFinish(e)
        },
        observerUpdate: (e) => {
          if (e.target && e.target.className === 'taro_page' && e.target.style.display === 'block' && e.target.contains(this.$el)) {
            if (this.props.autoplay) {
              setTimeout(() => {
                this.mySwiper.slideTo(this._$current)
              }, 1000)
            }
          }
        }
      }
    }

    // 自动播放
    if (autoplay) {
      opt.autoplay = {
        delay: parseInt(interval, 10),
        stopOnLastSlide: true,
        disableOnInteraction: false
      }
    }

    // 两端距离
    if (spaceBetween) {
      opt.spaceBetween = spaceBetween
    }

    this.mySwiper = new Swipers(this.$el, opt)
    setTimeout(() => {
      this.mySwiper.update()
    }, 500)
  }

  componentWillReceiveProps (nextProps) {
    if (this.mySwiper) {
      const nextCurrent = typeof nextProps.current === 'number' ? nextProps.current : this._$current || 0

      if (!this.mySwiper.isBeginning && !this.mySwiper.isEnd) {
        // 是否衔接滚动模式
        if (nextProps.circular) {
          this.mySwiper.loopDestroy()
          this.mySwiper.loopCreate()
          this.mySwiper.slideToLoop(parseInt(nextCurrent, 10)) // 更新下标
        } else {
          this.mySwiper.slideTo(parseInt(nextCurrent, 10)) // 更新下标
        }
      }

      const autoplay = this.mySwiper.autoplay
      // 判断是否需要停止或开始自动轮播
      if (autoplay.running !== nextProps.autoplay) {
        if (nextProps.autoplay) {
          autoplay.start()
        } else {
          autoplay.stop()
        }
      }
      if (nextProps.autoplay && !autoplay.paused) {
        autoplay.run()
        autoplay.paused = false
      }

      this.mySwiper.update() // 更新子元素
    }
  }

  componentDidUpdate () {
    if (!this.mySwiper) return
    if (this.props.autoplay) {
      if (this._$width !== this.mySwiper.width || this._$height !== this.mySwiper.height) {
        this.mySwiper.autoplay.run()
      }
    }
    this._$width = this.mySwiper.width
    this._$height = this.mySwiper.height
  }

  componentWillUnmount () {
    this.$el = null
    if (this.mySwiper) this.mySwiper.destroy()
  }

  handleOnChange (e) {
    const func = this.props.onChange
    typeof func === 'function' && func(e)
  }

  handleOnAnimationFinish (e) {
    const func = this.props.onAnimationFinish
    typeof func === 'function' && func(e)
  }

  parsePX (s = '0px') {
    return parseFloat(s.replace(/r*px/i, ''), 10)
  }

  render () {
    const { className, style, vertical, previousMargin, nextMargin, indicatorColor, indicatorActiveColor } = this.props
    const defaultIndicatorColor = indicatorColor || 'rgba(0, 0, 0, .3)'
    const defaultIndicatorActiveColor = indicatorActiveColor || '#000'
    const cls = classNames(`taro-swiper-${this._id}`, className)
    const sty = Object.assign({
      paddingTop: vertical ? this.parsePX(previousMargin) : 0,
      paddingRight: vertical ? 0 : this.parsePX(nextMargin),
      paddingBottom: vertical ? this.parsePX(nextMargin) : 0,
      paddingLeft: vertical ? 0 : this.parsePX(previousMargin),
      overflow: 'hidden'
    }, style)
    const paginationCls = classNames(
      'swiper-pagination',
      {
        'swiper-pagination-hidden': !this.props.indicatorDots,
        'swiper-pagination-bullets': this.props.indicatorDots
      }
    )
    return (
      <div className={cls} style={sty}>
        <div className='swiper-container' style={{ overflow: 'visible' }} ref={(el) => { this.$el = el }}>
          <div
            dangerouslySetInnerHTML={{
              __html: `<style type='text/css'>
              .taro-swiper-${this._id} .swiper-container .swiper-pagination-bullet { background: ${defaultIndicatorColor} }
              .taro-swiper-${this._id} .swiper-container .swiper-pagination-bullet-active { background: ${defaultIndicatorActiveColor} }
              </style>`
            }}
          />
          <div className='swiper-wrapper'>{this.props.children}</div>
          <div className={paginationCls} />
        </div>
      </div>
    )
  }
}

export { Swiper, SwiperItem }
