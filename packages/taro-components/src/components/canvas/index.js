import Taro from '@tarojs/taro-h5'
import Nerv from 'nervjs'
import touchable from '../../utils/touchable'
import classnames from 'classnames'

import './style/index.css'

/**
 * Canvas组件参数
 * @typedef CanvasProps
 * @property {String} [canvasId=canvas] 组件的唯一标识符
 * @property {Boolean} [disableScroll=false] 当在 canvas 中移动时且有绑定手势事件时，禁止屏幕滚动以及下拉刷新
 * @property {EventHandle} onTouchstart 手指触摸动作开始
 * @property {EventHandle} onTouchmove 手指触摸后移动
 * @property {EventHandle} onTouchend 手指触摸动作结束
 * @property {EventHandle} onTouchcancel 手指触摸动作被打断，如来电提醒，弹窗
 * @property {EventHandle} onLongtap 手指长按 500ms 之后触发，触发了长按事件后进行移动不会触发屏幕的滚动
 * @property {EventHandle} onError 当发生错误时触发 error 事件，detail = {errMsg: 'something wrong'}
 */

@touchable()
class Canvas extends Taro.PureComponent {
  /** @type {CanvasProps} */
  static defaultProps = {
    canvasId: '',
    disableScroll: false,
    onError: null
  }

  width = 300
  height = 150
  getWrapRef = ref => {
    if (ref) this.wrapDom = ref
  }
  getCanvasRef = ref => {
    if (ref) this.canvasRef = ref
  }
  setSize = (width, height) => {
    this.canvasRef.setAttribute('width', width)
    this.canvasRef.setAttribute('height', height)
    this.width = width
    this.height = height
  }
  componentDidMount () {
    if (!this.wrapDom) return
    const { width, height } = this.wrapDom.getBoundingClientRect()
    this.setSize(width, height)
  }
  componentDidUpdate () {
    const { width, height } = this.wrapDom.getBoundingClientRect()
    if (this.width !== width || this.height !== height) {
      this.setSize(width, height)
    }
  }
  componentDidCatch (e) {
    const onError = this.props.onError
    onError && onError({
      errMsg: e.message
    })
  }
  render () {
    const { canvasId, onTouchStart, onTouchMove, onTouchEnd, onTouchCancel, className, ...restProps } = this.props
    const wrapProps = {
      className: classnames('taro-canvas', className),
      ref: this.getWrapRef,
      ...restProps
    }
    const canvasProps = {
      canvasId,
      onTouchStart,
      onTouchMove,
      onTouchEnd,
      onTouchCancel,
      width: this.width,
      height: this.height,
      ref: this.getCanvasRef
    }
    return (
      <div {...wrapProps}>
        <canvas {...canvasProps} />
      </div>
    )
  }
}

export default Canvas
