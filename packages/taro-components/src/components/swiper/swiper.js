import Nerv from 'nervjs'
import classNames from 'classnames'
import './style/swiper.scss'
import { isNumber } from '../../../utils/parse-type'

/**
 * props 类型检测
 *
 * @param {Object} props
 */
function parseType (props) {
  const {
    current
  } = props

  // 抛出错误信息
  const throwErrorMsg = type => {
    throw new TypeError(type + ' must be number')
  }

  if (current) isNumber(current) ? '' : throwErrorMsg('current')
}
class Swiper extends Nerv.Component {
  constructor (props) {
    super(props)
    parseType(this.props)

    this.state = {
      currentIndex: parseInt(this.props.current),
      containerWidth: 0,
      containerHeight: 0,
      // touch
      touching: false,
      og: 0,
      ogTranslate: 0,
      touchId: undefined,
      translate: 0,
      animating: false
    }
    this.SwiperTimer = null
    this.handleTouchStart = this.handleTouchStart.bind(this)
    this.handleTouchMove = this.handleTouchMove.bind(this)
    this.handleTouchEnd = this.handleTouchEnd.bind(this)
    this.pauseAutoPlay = this.pauseAutoPlay.bind(this)
    this.autoplay = this.autoplay.bind(this)
    this.computedChangeContainer = this.computedChangeContainer.bind(this)
    this.updateContainerBox = this.updateContainerBox.bind(this)
  }

  componentDidMount () {
    this.updateContainerBox(this.props.children)

    if (this.props.autoplay) this.autoplay(this.props.interval)
  }

  componentWillReceiveProps (nextProps) {
    this.updateContainerBox(nextProps.children)
    const { interval, autoplay, circular, current } = nextProps
    this.pauseAutoPlay()
    this.updateCurrentIndex(current)
    if (!circular) {
      this.computedChangeContainer()
    }
    if (!autoplay) return

    this.autoplay(interval)
  }

  componentWillUnmount () {
    this.pauseAutoPlay()
  }

  // 在开关衔接滑动的时候，计算当前下标
  computedChangeContainer () {
    if (this.props.children.length - 1 === this.state.currentIndex) {
      this.pauseAutoPlay()
      return true
    }
    return false
  }

  // 更新容器的宽高
  updateContainerBox (children) {
    let $container = Nerv.findDOMNode(this.SwiperWp)
    let childLen = children.length || 1
    let currentIndex = this.state.currentIndex
    // 默认偏移量
    let offsetVal = this.props.vertical
      ? -$container.offsetHeight * (currentIndex + 1)
      : -$container.offsetWidth * (currentIndex + 1)
    childLen = childLen + 2

    this.setState({
      containerWidth: $container.offsetWidth, // 外层容器宽
      containerHeight: $container.offsetHeight, // 外层容器高
      wrapperWidth: !this.props.vertical // 轮播容器 是否纵向滑动，不是的话计算总宽度
        ? $container.offsetWidth * childLen
        : $container.offsetWidth,
      wrapperHeight: this.props.vertical // 轮播容器 是否纵向滑动，是的话计算总高度
        ? $container.offsetHeight * childLen
        : $container.offsetHeight,
      // 计算指定下标位置
      translate: offsetVal
    })
  }

  // 更新下标
  updateCurrentIndex (currentIndex) {
    let tr = this.state.translate
    let slideVal // 纵向还是横向滚动长度

    if (currentIndex < 0) currentIndex = this.props.children.length - 1
    if (currentIndex >= this.props.children.length) currentIndex = 0

    if (!this.props.vertical) {
      slideVal = this.state.containerWidth * (currentIndex - this.state.currentIndex)
    } else {
      slideVal = this.state.containerHeight * (currentIndex - this.state.currentIndex)
    }

    this.setState(
      {
        animating: true,
        translate: tr - slideVal,
        currentIndex: currentIndex
      },
      () => {
        setTimeout(() => {
          this.computedTranslate()
        }, this.props.duration)
      }
    )
  }

  // 判断当前是否在最后一页
  isLastIndex () {
    return this.state.currentIndex === this.props.children.length - 1
  }

  // 判断当前是否在第一页
  isFirstIndex () {
    return this.state.currentIndex === 0
  }

  handleTouchStart (e) {
    if (this.state.animating) return
    if (this.state.touching || this.props.children.length <= 1) return
    if (this.props.autoplay) this.pauseAutoPlay()
    let og = 0

    if (!this.props.vertical) {
      og = e.targetTouches[0].pageX - this.state.translate
    } else {
      og = e.targetTouches[0].pageY - this.state.translate
    }

    this.touchStartX = e.touches[0].pageX
    this.touchStartY = e.touches[0].pageY
    this.setState({
      touching: true,
      ogTranslate: this.state.translate,
      touchId: e.targetTouches[0].identifier,
      og: og,
      animating: false
    })
  }
  handleTouchMove (e) {
    // 非衔接滑动的时候 判断首尾页的时候禁止拖动
    if (!this.props.circular) {
      // 计算偏移量、 判断左滑右滑动
      let touchEndX = e.touches[0].pageX
      let touchEndY = e.touches[0].pageY
      let offsetMoveX = touchEndX - this.touchStartX
      let offsetMoveY = touchEndY - this.touchStartY
      if (this.isFirstIndex()) {
        if (
          (this.props.vertical && offsetMoveY > 0) ||
          (!this.props.vertical && offsetMoveX > 0)
        ) {
          return
        }
      }
      if (this.isLastIndex()) {
        if (
          (this.props.vertical && offsetMoveY < 0) ||
          (!this.props.vertical && offsetMoveX < 0)
        ) {
          return
        }
      }
    }
    if (!this.state.touching || this.props.children.length <= 1) return
    if (e.targetTouches[0].identifier !== this.state.touchId) return

    e.preventDefault()

    let diff = this.state.translate

    if (!this.props.vertical) {
      const pageX = e.targetTouches[0].pageX
      diff = pageX - this.state.og
    } else {
      // vertical
      const pageY = e.targetTouches[0].pageY
      diff = pageY - this.state.og
    }

    this.setState({
      translate: diff
    })
  }

  handleTouchEnd (e) {
    if (!this.state.touching || this.props.children.length <= 1) return
    let translate = this.state.translate
    let max = !this.props.vertical
      ? this.state.wrapperWidth - this.state.containerWidth
      : this.state.wrapperHeight - this.state.containerHeight
    let currentIndex = this.state.currentIndex
    if (translate > 0) {
      // start
      translate = 0
    } else if (translate < -max) {
      translate = -max
    } else {
      // default case
      let changeV = this.isChangeSlide(translate, currentIndex)
      translate = changeV.translate
      currentIndex = changeV.currentIndex
    }

    this.setState(
      {
        touching: false,
        og: 0,
        touchId: undefined,
        ogTranslate: 0,
        animating: true,
        translate,
        currentIndex
      },
      () =>
        setTimeout(() => {
          this.computedTranslate()
        }, this.props.duration)
    )

    if (this.props.onChange) {
      Object.defineProperty(e, 'detail', {
        enumerable: true,
        value: {
          current: currentIndex,
          source: 'touch'
        }
      })
      this.props.onChange(e)
    }
    if (this.props.autoplay) this.pauseAutoPlay()
  }

  computedTranslate () {
    // if (this.props.circular) {
    let prvTranslate = this.state.translate
    // 横纵向
    if (!this.props.vertical) {
      if (prvTranslate === 0) {
        prvTranslate = -(
          this.state.wrapperWidth -
          this.state.containerWidth * 2
        )
      }
      // 减一个宽度是因为最后的静默回滚到最前面 滑块本身还有一个 translate位移量
      if (
        prvTranslate === -(this.state.wrapperWidth - this.state.containerWidth)
      ) {
        prvTranslate = -this.state.containerWidth
      }
    } else {
      if (prvTranslate === 0) {
        prvTranslate = -(
          this.state.wrapperHeight -
          this.state.containerHeight * 2
        )
      }
      // 减一个宽度是因为最后的静默回滚到最前面 滑块本身还有一个 translate位移量
      if (
        prvTranslate ===
        -(this.state.wrapperHeight - this.state.containerHeight)
      ) {
        prvTranslate = -this.state.containerHeight
      }
    }

    this.setState({
      animating: false,
      translate: prvTranslate
    })
    // } else {
    //   this.setState({animating: false})
    // }
  }

  // 自增下标点计算
  addCurrentIndex (currentIndex) {
    return currentIndex === this.props.children.length - 1
      ? 0
      : (currentIndex += 1)
  }

  autoplay (interval) {
    this.SwiperTimer = setInterval(() => {
      this.slideNext()
    }, interval)
  }

  pauseAutoPlay () {
    clearInterval(this.SwiperTimer)
  }

  slideNext () {
    if (!this.props.circular) {
      if (this.computedChangeContainer()) {
        return
      }
    }
    let cur = this.addCurrentIndex(this.state.currentIndex)
    let tr = this.state.translate
    let slideVal // 纵向还是横向滚动长度

    if (!this.props.vertical) {
      slideVal = this.state.containerWidth
    } else {
      slideVal = this.state.containerHeight
    }
    this.setState(
      {
        animating: true,
        translate: tr - slideVal,
        currentIndex: cur
      },
      () => {
        setTimeout(() => {
          this.computedTranslate()
        }, this.props.duration)
      }
    )
    if (this.props.onChange) {
      let e = new TouchEvent('touchend')
      Object.defineProperty(e, 'detail', {
        enumerable: true,
        value: {
          current: cur,
          source: 'autoplay'
        }
      })
      this.props.onChange(e)
    }
  }

  isChangeSlide (translate, currentIndex) {
    // 判读滑动到大于一半才过去
    // let threshold = !this.props.vertical
    //   ? this.state.containerWidth / 2
    //   : this.state.containerHeight / 2
    let diff = Math.abs(translate - this.state.ogTranslate)
    let isNext = translate - this.state.ogTranslate < 0

    if (diff > 0) {
      if (isNext) {
        // next slide
        translate =
          this.state.ogTranslate -
          (!this.props.vertical
            ? this.state.containerWidth
            : this.state.containerHeight)
        currentIndex = this.addCurrentIndex(currentIndex)
      } else {
        // prev slide
        translate =
          this.state.ogTranslate +
          (!this.props.vertical
            ? this.state.containerWidth
            : this.state.containerHeight)
        currentIndex =
          currentIndex === 0
            ? (currentIndex = this.props.children.length - 1)
            : (currentIndex -= 1)
      }
    } else {
      // revert back
      translate = this.state.ogTranslate
    }
    return { translate, currentIndex }
  }

  renderPagination (indicatorColor, indicatorActiveColor) {
    if (Array.isArray(this.props.children)) {
      const childs = this.props.children.map((child, i) => {
        let clx = classNames('swiper__pagination-bullet', {
          active: i === this.state.currentIndex
        })
        let indiStyle = {
          background:
            i === this.state.currentIndex ? indicatorActiveColor : indicatorColor
        }
        return <span className={clx} key={i} style={indiStyle} />
      })
      return childs
    } else {
      let indiStyle = {
        background: indicatorActiveColor
      }
      return <span className={'swiper__pagination-bullet active'} key='1' style={indiStyle} />
    }
  }

  render () {
    const {
      className,
      indicatorDots,
      vertical,
      children,
      circular,
      duration,
      style
    } = this.props
    const cls = classNames('swiper__container', className, {
      'swiper__container-vertical': vertical,
      'swiper__container-horizontal': !vertical
    })

    let items = [].concat(children)
    // 衔接滑动增加首尾
    // if (circular) {
    if (items.length !== 0) {
      const firstItem = items[0]
      const lastItem = items[items.length - 1]
      items.push(firstItem)
      items.unshift(lastItem)
    }
    // }
    let wrapperStyle = {
      width: this.state.wrapperWidth,
      height: this.state.wrapperHeight,
      transition: this.state.animating
        ? `transform ${duration}ms ease-in-out`
        : 'none',
      transform: `translate(${!vertical ? this.state.translate : 0}px, ${
        vertical ? this.state.translate : 0
      }px)`
    }

    return (
      <div
        className={cls}
        style={style}
        ref={SwiperWp => {
          this.SwiperWp = SwiperWp
        }}
        onTouchStart={this.handleTouchStart}
        onTouchMove={this.handleTouchMove}
        onTouchEnd={this.handleTouchEnd}
      >
        <div className='swiper__wrapper' style={wrapperStyle}>
          {items.map((child, i) => {
            const c = child.props.children
            // 没有子元素直接返回
            if (c.length === 0) return <div className='swiper__item' />
            const cls = classNames('swiper__item', c.props.className)
            // 样式继承追加。 有可能 Object 或者是 String
            let sty
            if (typeof c.props.style === 'string') {
              let display = !vertical
                ? ';display: inline-block;'
                : ';display: block;'
              let verticalAlign = !vertical
                ? ';vertical-align: top;'
                : ';vertical-align:bottom;'
              let w = `;width: ${this.state.containerWidth}px;`
              let h = `;height: ${this.state.containerHeight}px;`
              sty = c.props.style + verticalAlign + display + w + h
            } else {
              sty = Object.assign({}, c.props.style, {
                display: !vertical ? 'inline-block' : 'block',
                verticalAlign: !vertical ? 'top' : 'bottom',
                width: this.state.containerWidth,
                height: this.state.containerHeight
              })
            }
            if (circular) i = i - 1
            return Nerv.cloneElement(c, {
              key: i,
              className: cls,
              style: sty,
              onClick: child.props.onClick || c.props.onClick
            })
          })}
        </div>

        {indicatorDots ? (
          <div className='swiper__pagination'>
            {this.renderPagination(
              this.props.indicatorColor,
              this.props.indicatorActiveColor
            )}
          </div>
        ) : (
          false
        )}
      </div>
    )
  }
}

// 默认配置
Swiper.defaultProps = {
  indicatorDots: false, // 是否显示面板指示点
  indicatorColor: 'rgba(0, 0, 0, .3)', // 指示点颜色
  indicatorActiveColor: '#000000', // 当前选中的指示点颜色
  autoplay: false, // 自动播放
  current: 0, // 当前滑块位置
  interval: 5000, // 切换时间间隔
  duration: 500, // 滑动动画时长
  circular: false, // 是否采用衔接滑动
  vertical: false // 滑动方向是否为纵向
}

class SwiperItem extends Nerv.Component {
  constructor (props) {
    super(props)
  }

  render () {
    return ''
  }
}

export { SwiperItem, Swiper }
