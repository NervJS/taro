import Nerv, { findDOMNode } from 'nervjs'
import touchable from '../../utils/touchable'
import classnames from 'classnames'
import { isNumber } from '../../utils/index'

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
export default class Canvas extends Nerv.Component {
  static defaultProps = {
    canvasId: '',
    disableScroll: false,
    bindError: null
  }
  state = {
    width: null,
    height: null
  }
  getRef = ref => { 
    const dom = findDOMNode(ref)
    this.canvasDom = dom
  }
  shouldComponentUpdate (nProps, nState) {
    if (nState.width !== this.state.width
      || nState.height !== this.state.height) {
      return true
    }
    return false
  }
  componentDidMount () {
    if (!this.canvasDom) return
    const { width, height } = this.canvasDom.getBoundingClientRect()
    this.setState({
      width,
      height
    })
  }
  render () {
    const { canvasId, onTouchStart, onTouchMove, onTouchEnd, onTouchCancel, className } = this.props
    const { width, height } = this.state
    const props = {
      canvasId,
      onTouchStart,
      onTouchMove,
      onTouchEnd,
      onTouchCancel
    }
    if (isNumber(width)) {
      props.width = width
    }
    if (isNumber(height)) {
      props.height = height
    }
    return (
      <div
        className={classnames(
          'taro-canvas',
          className
        )}
        ref={this.getRef}>
        <canvas {...props} />
      </div>
    )
  }
}
