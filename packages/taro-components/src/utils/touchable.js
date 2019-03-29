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

      onTouchStart () {
        const { bindTouchStart, bindLongTap } = this.props
        bindTouchStart && bindTouchStart()
        setTimeout(() => {
          bindLongTap && bindLongTap()
        }, opt.longTapTime)
      }
      onTouchMove () {
        const { bindTouchMove } = this.props
        bindTouchMove && bindTouchMove()
      }
      onTouchEnd () {
        this.timer && clearTimeout(this.timer)
        const { bindTouchEnd } = this.props
        bindTouchEnd && bindTouchEnd()
      }
      onTouchCancel () {
        this.timer && clearTimeout(this.timer)
        const { bindTouchCancel } = this.props
        bindTouchCancel && bindTouchCancel()
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
