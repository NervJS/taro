import Taro from '@tarojs/taro-h5'
import Nerv, { findDOMNode } from 'nervjs'
import touchable from '../../utils/touchable'
import classnames from 'classnames'

import './style/index.css'

/**
 * Canvas组件参数
 * @typedef CanvasProps
 * @param {String} [canvasId=canvas] 组件的唯一标识符
 * @param {Boolean} [disableScroll=false] 当在 canvas 中移动时且有绑定手势事件时，禁止屏幕滚动以及下拉刷新
 * @param {EventHandle} onTouchstart 手指触摸动作开始
 * @param {EventHandle} onTouchmove 手指触摸后移动
 * @param {EventHandle} onTouchend 手指触摸动作结束
 * @param {EventHandle} onTouchcancel 手指触摸动作被打断，如来电提醒，弹窗
 * @param {EventHandle} onLongtap 手指长按 500ms 之后触发，触发了长按事件后进行移动不会触发屏幕的滚动
 * @param {EventHandle} onError 当发生错误时触发 error 事件，detail = {errMsg: 'something wrong'}
 */

@touchable()
class Canvas extends Taro.PureComponent {
  /** @type {CanvasProps} */
  static defaultProps = {
    canvasId: '',
    disableScroll: false,
    onError: null
  }

  /** @type {CanvasProps} */
  props
  width = 300
  height = 150
  getWrapRef = ref => { 
    const dom = findDOMNode(ref)
    this.wrapDom = dom
  }
  getCanvasRef = ref => {
    const dom = findDOMNode(ref)
    this.canvasDom = dom
  }
  componentDidMount () {
    if (!this.wrapDom) return
    const { width, height } = this.wrapDom.getBoundingClientRect()
    this.canvasDom.setAttribute('width', width)
    this.canvasDom.setAttribute('height', height)
    this.width = width
    this.height = height
  }
  componentDidCatch (e) {
    const onError = this.props.onError
    onError && onError({
      errMsg: e.message
    })
  }
  render () {
    const { canvasId, onTouchStart, onTouchMove, onTouchEnd, onTouchCancel, className } = this.props
    const wrapProps = {
      className: classnames('taro-canvas', className),
      ref: this.getWrapRef
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
