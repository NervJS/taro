// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Component, h, ComponentInterface, Prop, Event, EventEmitter, Watch, Host } from '@stencil/core'
import Swipers from 'swiper'
import classNames from 'classnames'

let INSTANCE_ID = 0

@Component({
  tag: 'taro-swiper-core',
  styleUrls: [
    '../../../node_modules/swiper/dist/css/swiper.min.css',
    './style/index.scss'
  ]
})
export class Swiper implements ComponentInterface {
  private _id = INSTANCE_ID++
  private swiper

  /**
   * 是否显示面板指示点
   */
  @Prop() indicatorDots = false

  /**
   * 指示点颜色
   */
  @Prop() indicatorColor = 'rgba(0, 0, 0, .3)'

  /**
   * 当前选中的指示点颜色
   */
  @Prop() indicatorActiveColor = '#000000'

  /**
   * 是否自动切换
   */
  @Prop() autoplay = false

  /**
   * 当前所在滑块的 index
   */
  @Prop() current = 0

  /**
   * 自动切换时间间隔
   */
  @Prop() interval = 5000

  /**
   * 滑动动画时长
   */
  @Prop() duration = 500

  /**
   * 是否采用衔接滑动
   */
  @Prop() circular = false

  /**
   * 滑动方向是否为纵向
   */
  @Prop() vertical = false

  /**
   * 前边距，可用于露出前一项的一小部分，接受 px 值
   */
  @Prop() previousMargin = '0px'

  /**
   * 同时显示的滑块数量
   */
  @Prop() displayMultipleItems = 1

  /**
   * 给 prewviewImage API 使用，全屏显示 swiper
   */
  @Prop() full = false

  @Event({
    eventName: 'change'
  }) onChange: EventEmitter

  @Event({
    eventName: 'animationfinish'
  }) onAnimationFinish: EventEmitter

  @Watch('current')
  watchCurrent (newVal) {
    if (typeof newVal !== 'number' && !isNaN(newVal)) return

    if (this.circular) {
      this.swiper.slideToLoop(newVal)
    } else {
      this.swiper.slideTo(newVal)
    }
  }

  @Watch('autoplay')
  watchAutoplay (newVal) {
    if (this.swiper.autoplay.running === newVal) return

    if (newVal) {
      if (this.swiper.params.autoplay.disableOnInteraction === true) {
        this.swiper.params.autoplay.disableOnInteraction = false
      }
      this.swiper.params.autoplay.delay = this.interval
      this.swiper.autoplay.start()
    } else {
      this.swiper.autoplay.stop()
    }
  }

  @Watch('duration')
  watchDuration (newVal) {
    this.swiper.params.speed = newVal
  }

  @Watch('interval')
  watchInterval (newVal) {
    this.swiper.params.autoplay.delay = newVal
  }

  componentDidLoad () {
    const {
      autoplay,
      current,
      interval,
      duration,
      circular,
      vertical,
      displayMultipleItems
    } = this

    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this

    const options: any = {
      pagination: { el: `.taro-swiper-${this._id} .swiper-pagination` },
      direction: vertical ? 'vertical' : 'horizontal',
      loop: circular,
      slidesPerView: displayMultipleItems,
      initialSlide: current,
      speed: duration,
      observer: true,
      on: {
        // slideChange 事件在 swiper.slideTo 改写 current 时不触发，因此用 slideChangeTransitionEnd 事件代替
        slideChangeTransitionEnd () {
          that.onChange.emit({
            current: this.realIndex,
            source: ''
          })
        },
        transitionEnd () {
          that.onAnimationFinish.emit({
            current: this.realIndex,
            source: ''
          })
        }
      }
    }

    const previousMargin = /^(\d+)px/.exec(this.previousMargin)
    if (previousMargin?.length && !isNaN(parseInt(previousMargin[1]))) {
      options.slidesOffsetBefore = parseInt(previousMargin[1])
    }

    // 自动播放
    if (autoplay) {
      options.autoplay = {
        delay: interval,
        disableOnInteraction: false
      }
    }

    this.swiper = new Swipers(`.taro-swiper-${this._id}`, options)
  }

  render () {
    const {
      indicatorDots,
      indicatorColor,
      indicatorActiveColor
    } = this

    const cls = classNames(`taro-swiper-${this._id}`, 'swiper-container')
    const paginationCls = classNames(
      'swiper-pagination',
      {
        'swiper-pagination-hidden': !indicatorDots,
        'swiper-pagination-bullets': indicatorDots
      }
    )

    const hostStyle: Record<string, string> = {}
    const style: Record<string, string> = {}
    if (this.full) {
      hostStyle.height = '100%'
      style.height = '100%'
    }

    return (
      <Host style={hostStyle}>
        <div class={cls} style={style}>
          <style type='text/css'>
            {`
              .taro-swiper-${this._id} .swiper-pagination-bullet { background: ${indicatorColor} }
              .taro-swiper-${this._id} .swiper-pagination-bullet-active { background: ${indicatorActiveColor} }
            `}
          </style>
          <div class='swiper-wrapper'>
            <slot />
          </div>
          <div class={paginationCls} />
        </div>
      </Host>
    )
  }
}
