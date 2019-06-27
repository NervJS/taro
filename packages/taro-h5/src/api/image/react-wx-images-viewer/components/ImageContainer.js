import Nerv, { PropTypes, PureComponent } from 'nervjs'
import raf from 'raf'

import Loading from './Loading'

/**
 * t: current time（当前时间）；
 * b: beginning value（初始值）；
 * c: change in value（变化量）；
 * _c: final value (最后值)
 * d: duration（持续时间）。
 */
const easeOutQuart = function (t, b, _c, d) {
  const c = _c - b
  return -c * ((t = t / d - 1) * t * t * t - 1) + b
}

/**
 *
 * @param {number} value
 * @param {number} min
 * @param {number} max
 */
function setScope (value, min, max) {
  if (value < min) { return min }
  if (value > max) { return max }
  return value
}

function getDistanceBetweenTouches (e) {
  if (e.touches.length < 2) return 1
  const x1 = e.touches[0].clientX
  const y1 = e.touches[0].clientY
  const x2 = e.touches[1].clientX
  const y2 = e.touches[1].clientY
  const distance = Math.sqrt(((x2 - x1) ** 2) + ((y2 - y1) ** 2))
  return distance
}

// const msPerFrame = 1000 / 60;
const maxAnimateTime = 1000
const minTapMoveValue = 5
const maxTapTimeValue = 300

/**
 * 图片默认展示模式：宽度等于屏幕宽度，高度等比缩放；水平居中，垂直居中或者居顶（当高度大于屏幕高度时）
 * 图片实际尺寸： actualWith, actualHeight
 * 图片初始尺寸： originWidth, originHeight
 * 坐标位置：left, top
 * 放大倍数：zoom
 * 最大放大倍数：maxZoomNum
 * 坐标关系：-(maxZoomNum - 1) * originWidth / 2 < left < 0
 *         -(maxZoomNum - 1) * originHeight / 2 < top < 0
 * 尺寸关系：width = zoom * originWidth
 *         heigth = zoom * originHeight
 *
 * 放大点位置关系：
 * 初始点位置：oldPointLeft, oldPointTop
 * 放大后位置：newPointLeft, newPointTop
 * 对应关系： newPointLeft = zoom * oldPointLeft
 *          newPointTop = zoom * oldPointTop
 *
 * 坐标位置：-1*left = -1*startLeft + (newPointLeft - oldPointLeft) =-1*startLeft (zoom - 1) * oldPointLeft
 *         -1*top = -1*startTop + (newPointTop - oldPointTop) =-1*startLeft (zoom - 1) * oldPointTop
 * =>
 * left = startLeft + (1 - zoom) * oldPointLeft
 * top = startTop + (1 - zoom) * oldPointTop
 */

class ImageContainer extends PureComponent {
  static propTypes = {
    maxZoomNum: PropTypes.number.isRequired,
    handleStart: PropTypes.func.isRequired,
    handleMove: PropTypes.func.isRequired,
    handleEnd: PropTypes.func.isRequired
  }

  static contextTypes = {
    onClose: PropTypes.func
  };

  constructor (props, context) {
    super(props, context)
    this.actualHeight = 0 // 图片实际高度
    this.actualWith = 0 // 图片实际宽度

    this.originHeight = 0 // 图片默认展示模式下高度
    this.originWidth = 0 // 图片默认展示模式下宽度
    this.originScale = 1 // 图片初始缩放比例

    this.startLeft = 0 // 开始触摸操作时的 left 值
    this.startTop = 0 // 开始触摸操作时的 top 值
    this.startScale = 1 // 开始缩放操作时的 scale 值

    this.onTouchStartTime = 0 // 单指触摸开始时间

    this.isTwoFingerMode = false // 是否为双指模式
    this.oldPointLeft = 0// 计算手指中间点在图片上的位置（坐标值）
    this.oldPointTop = 0// 计算手指中间点在图片上的位置（坐标值）
    this._touchZoomDistanceStart = 0 // 用于记录双指距离
    this.haveCallMoveFn = false

    this.diffX = 0// 记录最后 move 事件 移动距离
    this.diffY = 0// 记录最后 move 事件 移动距离

    this.animationID = 0
    this.animateStartTime = 0
    this.animateStartValue = {
      x: 0,
      y: 0
    }
    this.animateFinalValue = {
      x: 0,
      y: 0
    }
  }

  state = {
    width: 0,
    height: 0,
    scale: 1,
    left: 0,
    top: 0,
    isLoaded: false
  }

  componentWillMount () {
    this.loadImg(this.props.src)
  }

  componentWillUnmount () {
    this.unloadImg()
    if (this.animationID) {
      raf.cancel(this.animationID)
    }
  }

  onLoad = () => {
    this.actualWith = this.img.width
    this.actualHeight = this.img.height

    const {
      screenHeight,
      screenWidth
    } = this.props

    const left = 0
    let top = 0

    this.originWidth = screenWidth
    this.originHeight = (this.actualHeight / this.actualWith) * screenWidth
    this.originScale = 1

    if (this.actualHeight / this.actualWith < screenHeight / screenWidth) {
      top = parseInt((screenHeight - this.originHeight) / 2, 10)
    }
    this.originTop = top

    this.setState({
      width: this.originWidth,
      height: this.originHeight,
      scale: 1,
      left,
      top,
      isLoaded: true
    })
  }

  onError = () => {
    this.setState({
      isLoaded: true
    })
  }

  loadImg = (url) => {
    this.img = new Image()
    this.img.src = url
    this.img.onload = this.onLoad
    this.img.onerror = this.onError

    this.setState({
      isLoaded: false
    })
  }

  unloadImg = () => {
    delete this.img.onerror
    delete this.img.onload
    delete this.img.src
    delete this.img
  }

  handleTouchStart = (event) => {
    // console.info('handleTouchStart')
    // event.preventDefault()
    // event.stopPropagation()
    if (this.animationID) {
      raf.cancel(this.animationID)
    }
    switch (event.touches.length) {
      case 1: {
        const targetEvent = event.touches[0]
        this.startX = targetEvent.clientX
        this.startY = targetEvent.clientY
        this.diffX = 0
        this.diffY = 0

        this.startLeft = this.state.left
        this.startTop = this.state.top

        // console.info('handleTouchStart this.startX = %s, this.startY = %s, this.startLeft = %s, this.startTop = %s', this.startX, this.startY, this.startLeft, this.startTop)

        this.onTouchStartTime = (new Date()).getTime()
        this.haveCallMoveFn = false
        break
      }
      case 2: { // 两个手指
        // 设置手双指模式
        this.isTwoFingerMode = true

        // 计算两个手指中间点屏幕上的坐标
        const middlePointClientLeft = Math.abs(Math.round((event.touches[0].clientX + event.touches[1].clientX) / 2))
        const middlePointClientTop = Math.abs(Math.round((event.touches[0].clientY + event.touches[1].clientY) / 2))

        // 保存图片初始位置和尺寸
        this.startLeft = this.state.left
        this.startTop = this.state.top
        this.startScale = this.state.scale

        // 计算手指中间点在图片上的位置（坐标值）
        this.oldPointLeft = middlePointClientLeft - this.startLeft
        this.oldPointTop = middlePointClientTop - this.startTop

        this._touchZoomDistanceStart = getDistanceBetweenTouches(event)
        break
      }
      default:
        break
    }
  }

  handleTouchMove = (event) => {
    // event.preventDefault()
    // event.stopPropagation()

    switch (event.touches.length) {
      case 1: {
        const targetEvent = event.touches[0]
        const diffX = targetEvent.clientX - this.startX
        const diffY = targetEvent.clientY - this.startY

        this.diffX = diffX
        this.diffY = diffY
        // console.info('handleTouchMove one diffX=%s, diffY=%s', diffX, diffY)
        // 判断是否为点击
        if (Math.abs(diffX) < minTapMoveValue && Math.abs(diffY) < minTapMoveValue) {
          return
        }

        const { scale } = this.state
        const width = scale * this.originWidth
        if (Math.abs(diffX) > Math.abs(diffY)) {
          // 水平移动
          if (this.state.scale === this.originScale && Math.abs(diffX) > minTapMoveValue) {
            this.haveCallMoveFn = true
            this.callHandleMove(diffX)
            return
          }

          // console.info('handleMove one left=%s, this.startLeft=%s,this.originWidth=%s, width=%s', left, this.startLeft, this.originWidth, width)
          if (diffX < 0 && this.startLeft <= this.originWidth - width) {
            this.haveCallMoveFn = true
            this.callHandleMove(diffX)
            return
          }

          if (diffX > 0 && this.startLeft >= 0) {
            this.haveCallMoveFn = true
            this.callHandleMove(diffX)
            return
          }
        }

        const { screenHeight } = this.props
        const height = scale * this.originHeight
        let newTop = (screenHeight - height) / 2
        const newLeft = this.startLeft + diffX

        if (height > screenHeight || this.state.scale === this.originScale) {
          newTop = this.startTop + diffY
        }
        // console.info('handleTouchMove one newLeft=%s, newTop=%s', newLeft, newTop)
        this.setState({
          left: newLeft,
          top: newTop
        })

        break
      }
      case 2: { // 两个手指
        this._touchZoomDistanceEnd = getDistanceBetweenTouches(event)

        const zoom = Math.sqrt(this._touchZoomDistanceEnd / this._touchZoomDistanceStart)
        const scale = zoom * this.startScale
        const left = this.startLeft + ((1 - zoom) * this.oldPointLeft)
        const top = this.startTop + ((1 - zoom) * this.oldPointTop)

        this.setState({
          left,
          top,
          scale
        })
        break
      }
      default:
        break
    }
  }

  handleTouchEnd = (event) => {
    // console.info('handleTouchEnd', event.touches.length)
    event.preventDefault()

    if (this.isTwoFingerMode) { // 双指操作结束
      const touchLen = event.touches.length
      this.isTwoFingerMode = false

      if (touchLen === 1) {
        const targetEvent = event.touches[0]
        this.startX = targetEvent.clientX
        this.startY = targetEvent.clientY
        this.diffX = 0
        this.diffY = 0
      }

      this.setState((prevState, props) => {
        const scale = setScope(prevState.scale, 1, props.maxZoomNum)
        const width = scale * this.originWidth
        const height = scale * this.originHeight
        const zoom = scale / this.startScale
        const left = setScope(this.startLeft + ((1 - zoom) * this.oldPointLeft), this.originWidth - width, 0)

        let top
        if (height > props.screenHeight) {
          top = setScope(this.startTop + ((1 - zoom) * this.oldPointTop), props.screenHeight - height, 0)
        } else {
          top = (props.screenHeight - height) / 2
        }

        if (touchLen === 1) {
          this.startLeft = left
          this.startTop = top
          this.startScale = scale
          // console.info('this.startX = %s, this.startY = %s, this.startLeft = %s, this.startTop = %s', this.startX, this.startY, this.startLeft, this.startTop)
        }

        // console.info('zoom = %s, left = %s, top = %s, width=%s, height= %s', zoom, left, top, width, height)
        return {
          left,
          top,
          scale
        }
      })
    } else { // 单指结束（ontouchend）
      const diffTime = (new Date()).getTime() - this.onTouchStartTime
      const { diffX, diffY } = this

      // console.info('handleTouchEnd one diffTime = %s, diffX = %s, diffy = %s', diffTime, diffX, diffY)
      // 判断为点击则关闭图片浏览组件
      if (diffTime < maxTapTimeValue && Math.abs(diffX) < minTapMoveValue && Math.abs(diffY) < minTapMoveValue) {
        this.context.onClose()
        return
      }

      // 水平移动
      if (this.haveCallMoveFn) {
        const isChangeImage = this.callHandleEnd(diffY < 30)
        if (isChangeImage) { // 如果切换图片则重置当前图片状态
          setTimeout(() => {
            this.setState({
              scale: this.originScale,
              left: 0,
              top: this.originTop
            })
          }, maxAnimateTime / 3)
          return
        }
      }
      // TODO 下拉移动距离超过屏幕高度的 1/3 则关闭
      // console.info(Math.abs(diffY) > (this.props.screenHeight / 2), this.startTop, this.originTop);
      // if (Math.abs(diffX) < Math.abs(diffY) && Math.abs(diffY) > (this.props.screenHeight / 3) && this.startTop === this.originTop) {
      //   this.context.onClose();
      //   return;
      // }

      let x
      let y
      const { scale } = this.state
      // const width = scale * this.originWidth;
      const height = scale * this.originHeight

      // 使用相同速度算法
      x = ((diffX * maxAnimateTime) / diffTime) + this.startLeft
      y = ((diffY * maxAnimateTime) / diffTime) + this.startTop

      if (this.state.scale === this.originScale) {
        x = 0
        if (height > this.props.screenHeight) {
          y = setScope(y, this.props.screenHeight - height, 0)
        } else {
          y = this.originTop
        }
      }

      // x = setScope(x, this.originWidth - width, 0);

      // if (height > this.props.screenHeight) {
      // y = setScope(y, this.props.screenHeight - height, 0);
      // } else {
      //   y = this.state.top;
      // }

      this.animateStartValue = {
        x: this.state.left,
        y: this.state.top
      }
      this.animateFinalValue = {
        x,
        y
      }
      this.animateStartTime = Date.now()
      this.startAnimate()
    }
  }

  startAnimate = () => {
    this.animationID = raf(() => {
      // calculate current time
      const curTime = Date.now() - this.animateStartTime
      let left
      let top

      // animate complete
      if (curTime > maxAnimateTime) {
        this.setState((prevState, props) => {
          const width = prevState.scale * this.originWidth
          const height = prevState.scale * this.originHeight
          left = setScope(prevState.left, this.originWidth - width, 0)

          if (height > props.screenHeight) {
            top = setScope(prevState.top, props.screenHeight - height, 0)
          } else {
            top = (props.screenHeight - height) / 2
          }
          // console.info('end animate left= %s, top = %s', left, top)
          return {
            left,
            top
          }
        })
      } else {
        left = easeOutQuart(curTime, this.animateStartValue.x, this.animateFinalValue.x, maxAnimateTime)
        top = easeOutQuart(curTime, this.animateStartValue.y, this.animateFinalValue.y, maxAnimateTime)

        // console.info('startAnimate left= %s, top = %s, curTime = %s', left, top, curTime)
        this.setState({
          left,
          top
        })
        this.startAnimate()
      }
    })
  }

  callHandleMove = (diffX) => {
    if (!this.isCalledHandleStart) {
      this.isCalledHandleStart = true
      if (this.props.handleStart) {
        this.props.handleStart()
      }
    }
    this.props.handleMove(diffX)
  }

  callHandleEnd = (isAllowChange) => {
    if (this.isCalledHandleStart) {
      this.isCalledHandleStart = false
      if (this.props.handleEnd) {
        return this.props.handleEnd(isAllowChange)
      }
    }
  }

  render () {
    const {
      screenWidth,
      screenHeight,
      src,
      left: divLeft
    } = this.props

    const {
      isLoaded,
      left,
      top,
      scale,
      width,
      height
    } = this.state

    const ImageStyle = {
      width,
      height
    }

    const translate = `translate3d(${left}px, ${top}px, 0) scale(${scale})`
    ImageStyle.WebkitTransform = translate
    ImageStyle.transform = translate

    const defaultStyle = {
      left: divLeft,
      width: screenWidth,
      height: screenHeight
    }
    // console.info('ImageContainer render');
    return (
      <div
        className='viewer-image-container'
        onTouchStart={this.handleTouchStart}
        onTouchMove={this.handleTouchMove}
        onTouchEnd={this.handleTouchEnd}
        style={defaultStyle}
      >
        {
          isLoaded ? <img src={src} style={ImageStyle} alt='' /> : <Loading />
        }
      </div>
    )
  }
}

export default ImageContainer
