import Taro from '@tarojs/taro-h5'
import omit from 'omit.js'
import Nerv from 'nervjs'

const touchable = (opt = {
  longTapTime: 500
}) => {
  return ComponentClass => {
    return class TouchableComponent extends Taro.Component {
      static defaultProps = {
        bindTouchStart: null,
        bindTouchMove: null,
        bindTouchEnd: null,
        bindTouchCancel: null,
        bindLongTap: null
      }
      timer = null

      onTouchStart = e => {
        const { bindTouchStart, bindLongTap } = this.props
        bindTouchStart && bindTouchStart(e)
        this.timer = setTimeout(() => {
          bindLongTap && bindLongTap(e)
        }, opt.longTapTime)
      }
      onTouchMove = e => {
        this.timer && clearTimeout(this.timer)
        const { bindTouchMove } = this.props
        bindTouchMove && bindTouchMove(e)
      }
      onTouchEnd = e => {
        this.timer && clearTimeout(this.timer)
        const { bindTouchEnd } = this.props
        bindTouchEnd && bindTouchEnd(e)
      }
      onTouchCancel = e => {
        this.timer && clearTimeout(this.timer)
        const { bindTouchCancel } = this.props
        bindTouchCancel && bindTouchCancel(e)
      }
      render () {
        const props = {
          onTouchStart: this.onTouchStart,
          onTouchMove: this.onTouchMove,
          onTouchEnd: this.onTouchEnd,
          onTouchCancel: this.onTouchCancel,
          ...omit(this.props, [
            'bindTouchStart',
            'bindTouchMove',
            'bindTouchEnd',
            'bindTouchCancel',
            'bindLongTap'
          ])
        }
        return <ComponentClass {...props} />
      }
    }
  }
}

export default touchable
