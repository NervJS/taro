import Nerv, { Component, PropTypes } from 'nervjs'

import WrapViewer from './WrapViewer'

import './WxImageViewer.css'

class WxImageViewer extends Component {
  static propTypes = {
    maxZoomNum: PropTypes.number, // 最大放大倍数
    zIndex: PropTypes.number, // 组件图层深度
    index: PropTypes.number, // 当前显示图片的http链接
    urls: PropTypes.array.isRequired, // 需要预览的图片http链接列表
    gap: PropTypes.number, // 间隙
    speed: PropTypes.number, // Duration of transition between slides (in ms)
    onClose: PropTypes.func.isRequired // 关闭组件回调
  }

  static childContextTypes = {
    onClose: PropTypes.func
  };

  static defaultProps = {
    maxZoomNum: 4,
    zIndex: 510,
    index: 0,
    gap: 10,
    speed: 300
  }

  getChildContext () {
    return { onClose: this.props.onClose }
  }

  render () {
    return Nerv.createPortal(
      <WrapViewer
        {...this.props}
      />,
      document.body
    )
  }
}

export default WxImageViewer
