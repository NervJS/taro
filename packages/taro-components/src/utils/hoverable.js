import Taro from '@tarojs/taro-h5'
import Nerv from 'nervjs'
import omit from 'omit.js'

/**
 * 添加touch能力
 * @param {Object} Options hoverable的默认配置
 * @param {String} [Options.hoverClass] 指定点击时的样式类，当hover-class="none"时，没有点击态效果
 * @param {Boolean} [Options.hoverStopPropergation] 指定是否阻止本节点的祖先节点出现点击态
 * @param {Number} [Options.hoverStartTime] 按住后多久出现点击态，单位毫秒
 * @param {Number} [Options.hoverStayTime] 手指松开后点击态保留时间，单位毫秒
 */
const hoverable = ({
  hoverClass,
  hoverStopPropergation,
  hoverStartTime,
  hoverStayTime
}) => {
  return ComponentClass => {
    return class HoverableComponent extends Taro.Component {
      static defaultProps = {
        hoverClass,
        hoverStopPropergation,
        hoverStartTime,
        hoverStayTime
      }
      constructor (props, ctx) {
        super(props, ctx)
        this.state = this.getInitState(this.props)
      }

      touchStartTimer = null
      touchEndTimer = null

      state = {
        isHover: false,
        onTouchStart: null,
        onTouchEnd: null
      }

      getInitState = ({ hoverClass, hoverStartTime, hoverStayTime, hoverStopPropergation, onTouchStart, onTouchEnd }) => {
        if (hoverClass === 'none') return {}
        return {
          onTouchStart: this.getOnTouchStart({ hoverStartTime, hoverStopPropergation, onTouchStart }),
          onTouchEnd: this.getOnTouchEnd({ hoverStayTime, hoverStopPropergation, onTouchEnd })
        }
      }
      getOnTouchStart = ({ hoverStartTime, hoverStopPropergation, onTouchStart }) => {
        return e => {
          onTouchStart && onTouchStart(e)
          hoverStopPropergation && e.stopPropergation()
          this.touchStartTimer && clearTimeout(this.touchStartTimer)
          this.touchEndTimer && clearTimeout(this.touchEndTimer)
          this.touchStartTimer = setTimeout(() => {
            this.setState({
              isHover: true
            })
          }, hoverStartTime)
        }
      }
      getOnTouchEnd = ({ hoverStayTime, hoverStopPropergation, onTouchEnd }) => {
        return e => {
          onTouchEnd && onTouchEnd(e)
          hoverStopPropergation && e.stopPropergation()
          this.touchStartTimer && clearTimeout(this.touchStartTimer)
          this.touchEndTimer && clearTimeout(this.touchEndTimer)
          this.touchEndTimer = setTimeout(() => {
            this.setState({
              isHover: false
            })
          }, hoverStayTime)
        }
      }
      reset = () => {
        this.setState({
          isHover: false
        })
      }
      componentWillMount () {
        document.body.addEventListener('touchstart', this.reset)
      }
      componentWillReceiveProps (nProps, nCtx) {
        if (
          nProps.hoverClass !== this.props.hoverClass ||
          nProps.hoverStopPropergation !== this.props.hoverStopPropergation ||
          nProps.hoverStartTime !== this.props.hoverStartTime ||
          nProps.hoverStayTime !== this.props.hoverStayTime
        ) {
          const stateObj = this.getInitState(nProps)
          this.setState(stateObj)
        }
      }
      componentWillUnmount () {
        document.body.removeEventListener('touchstart', this.reset)
      }
      render () {
        const { isHover, onTouchStart, onTouchEnd } = this.state
        const props = {
          ...omit(this.props, [
            'hoverStopPropergation',
            'hoverStartTime',
            'hoverStayTime'
          ]),
          isHover,
          onTouchStart,
          onTouchEnd
        }
        return <ComponentClass {...props} />
      }
    }
  }
}

export default hoverable
