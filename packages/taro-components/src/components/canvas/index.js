import Taro from '@tarojs/taro-h5'
import Nerv, { findDOMNode } from 'nervjs'
import touchable from '../../utils/touchable'
import classnames from 'classnames'

import './style/index.css'

// canvas-id String canvas 组件的唯一标识符
// disable-scroll Boolean false 当在 canvas 中移动时且有绑定手势事件时，禁止屏幕滚动以及下拉刷新
// bindtouchstart EventHandle 手指触摸动作开始
// bindtouchmove EventHandle 手指触摸后移动
// bindtouchend EventHandle 手指触摸动作结束
// bindtouchcancel EventHandle 手指触摸动作被打断，如来电提醒，弹窗
// bindlongtap EventHandle 手指长按 500ms 之后触发，触发了长按事件后进行移动不会触发屏幕的滚动
// binderror EventHandle 当发生错误时触发 error 事件，detail = {errMsg: 'something wrong'}

@touchable()
export default class Canvas extends Taro.PureComponent {
  static defaultProps = {
    canvasId: '',
    disableScroll: false,
    bindError: null
  }
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
    const bindError = this.props.bindError
    bindError && bindError({
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
