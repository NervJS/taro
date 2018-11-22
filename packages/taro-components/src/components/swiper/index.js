import Nerv from 'nervjs'
import classNames from 'classnames'
import Swipers from 'swiper/dist/js/swiper.min.js'

import 'swiper/dist/css/swiper.min.css'
import './style/index.scss'

class SwiperItem extends Nerv.Component {
  render () {
    const cls = classNames('swiper-slide', this.props.className)
    return <div className={cls}>{this.props.children}</div>
  }
}

class Swiper extends Nerv.Component {
  constructor () {
    super(...arguments)
  }

  componentDidMount () {
    const {
      indicatorDots,
      autoplay = false,
      interval = 5000,
      duration = 500,
      current = 0,
      displayMultipleItems = 1,
      onChange,
      circular,
      vertical,
      onAnimationfinish
    } = this.props

    const opt = {
      direction: vertical ? 'vertical' : 'horizontal',
      loop: circular,
      slidesPerView: parseInt(displayMultipleItems),
      initialSlide: parseInt(current),
      speed: parseInt(duration),
      on: {
        slideChange () {
          let e = new TouchEvent('touchend')
          Object.defineProperty(e, 'detail', {
            enumerable: true,
            value: {
              current: this.activeIndex
            }
          })
          onChange && onChange(e)
        },
        transitionEnd () {
          let e = new TouchEvent('touchend')
          Object.defineProperty(e, 'detail', {
            enumerable: true,
            value: {
              current: this.activeIndex
            }
          })
          onAnimationfinish && onAnimationfinish(e)
        }
      }
    }

    // 指示器
    if (indicatorDots) opt.pagination = { el: '.swiper-pagination' }

    // 自动播放
    if (autoplay) {
      opt.autoplay = {
        delay: parseInt(interval),
        stopOnLastSlide: true,
        disableOnInteraction: false
      }
    }

    this.mySwiper = new Swipers('.swiper-container', opt)
  }

  componentWillReceiveProps (nextPorps) {
    this.mySwiper.updateSlides() // 更新子元素
    this.mySwiper.slideTo(nextPorps.currentIndex) // 更新下标
  }

  componentWillUnmount () {
    this.mySwiper.destroy()
  }

  render () {
    const { className, indicatorColor, indicatorActiveColor } = this.props
    let defaultIndicatorColor = indicatorColor || 'rgba(0, 0, 0, .3)'
    let defaultIndicatorActiveColor = indicatorActiveColor || '#000'
    const cls = classNames('swiper-container', className)
    return (
      <div className={cls}>
        <div
          dangerouslySetInnerHTML={{
            __html: `<style type='text/css'>
            .swiper-pagination-bullet { background: ${defaultIndicatorColor} }
            .swiper-pagination-bullet-active { background: ${defaultIndicatorActiveColor} } 
            </style>`
          }}
        />
        <div className='swiper-wrapper'>{this.props.children}</div>
        <div className='swiper-pagination' />
      </div>
    )
  }
}

export { Swiper, SwiperItem }
