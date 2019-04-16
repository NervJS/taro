import Taro from '@tarojs/taro-h5'
import omit from 'omit.js'
import Nerv from 'nervjs'

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
      timer = null

      onTouchStart = e => {
        const { onTouchStart, onLongTap } = this.props
        onTouchStart && onTouchStart(e)
        this.timer = setTimeout(() => {
          onLongTap && onLongTap(e)
        }, opt.longTapTime)
      }
      onTouchMove = e => {
        this.timer && clearTimeout(this.timer)
        const { onTouchMove } = this.props
        onTouchMove && onTouchMove(e)
      }
      onTouchEnd = e => {
        this.timer && clearTimeout(this.timer)
        const { onTouchEnd } = this.props
        onTouchEnd && onTouchEnd(e)
      }
      onTouchCancel = e => {
        this.timer && clearTimeout(this.timer)
        const { onTouchCancel } = this.props
        onTouchCancel && onTouchCancel(e)
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
        return <ComponentClass {...props} />
      }
    }
  }
}

export default touchable
