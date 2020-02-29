import Taro from '@tarojs/taro-h5'
import omit from 'omit.js'
import Nerv, { findDOMNode } from 'nervjs'

function getOffset (el) {
  const rect = el.getBoundingClientRect()
  const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop
  return { offsetY: rect.top + scrollTop, offsetX: rect.left + scrollLeft }
}

/**
 * 将DOM标准的touches转换为wx的标准
 * @param {TouchList} touches
 */

const transformTouches = (touches, { offsetX, offsetY }) => {
  const wxTouches = []
  const touchCnt = touches.length
  for (let idx = 0; idx < touchCnt; idx++) {
    const touch = touches.item(idx)
    wxTouches.push({
      x: touch.pageX - offsetX,
      y: touch.pageY - offsetY,
      identifier: touch.identifier
    })
  }
  return wxTouches
}

const touchable = (opt = {
  longTapTime: 500
}) => {
  return ComponentClass => {
    return class TouchableComponent extends Taro.Component {
      static defaultProps = {
        onTouchStart: null,
        onTouchMove: null,
        onTouchEnd: null,
        onTouchCancel: null,
        onLongTap: null
      }
      touchableRef
      timer = null
      offset = {
        offsetX: 0,
        offsetY: 0
      }

      onTouchStart = e => {
        const { onTouchStart, onLongTap } = this.props
        Object.defineProperty(e, 'touches', { value: transformTouches(e.touches, this.offset) })
        onTouchStart && onTouchStart(e)
        this.timer = setTimeout(() => {
          onLongTap && onLongTap(e)
        }, opt.longTapTime)
      }
      onTouchMove = e => {
        this.timer && clearTimeout(this.timer)
        const { onTouchMove } = this.props
        Object.defineProperty(e, 'touches', { value: transformTouches(e.touches, this.offset) })
        onTouchMove && onTouchMove(e)
      }
      onTouchEnd = e => {
        this.timer && clearTimeout(this.timer)
        const { onTouchEnd } = this.props
        Object.defineProperty(e, 'touches', { value: transformTouches(e.touches, this.offset) })
        onTouchEnd && onTouchEnd(e)
      }
      onTouchCancel = e => {
        this.timer && clearTimeout(this.timer)
        const { onTouchCancel } = this.props
        Object.defineProperty(e, 'touches', { value: transformTouches(e.touches, this.offset) })
        onTouchCancel && onTouchCancel(e)
      }
      getTouchableRef = ref => {
        if (ref) {
          this.touchableRef = ref
        }
      }
      updatePos = () => {
        if (!this.touchableRef) return

        const { offsetX, offsetY } = getOffset(findDOMNode(this.touchableRef))
        this.offset.offsetX = offsetX
        this.offset.offsetY = offsetY
      }
      componentDidMount () {
        this.updatePos()
      }
      componentDidUpdate () {
        this.updatePos()
      }
      render () {
        const props = {
          onTouchStart: this.onTouchStart,
          onTouchMove: this.onTouchMove,
          onTouchEnd: this.onTouchEnd,
          onTouchCancel: this.onTouchCancel,
          ...omit(this.props, [
            'onTouchStart',
            'onTouchMove',
            'onTouchEnd',
            'onTouchCancel',
            'onLongTap'
          ])
        }
        return <ComponentClass {...props} ref={this.getTouchableRef} />
      }
    }
  }
}

export default touchable
