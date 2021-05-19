import React, { Component } from 'react'
import ReactDOM from 'react-dom'

import WrapViewer from './WrapViewer'
import WXImageContext from './WXImageContext'

import './WxImageViewer.css'

export interface WxImageViewerProps {
  maxZoomNum?: number // 最大放大倍数
  zIndex?: number // 组件图层深度
  index?: number // 当前显示图片的http链接
  urls: string[] // 需要预览的图片http链接列表
  gap?: number // 间隙
  speed?: number // Duration of transition between slides (in ms)
  onClose: () => void // 关闭组件回调
  onError: (reason: any) => void
}

class WxImageViewer extends Component<WxImageViewerProps> {
  static defaultProps = {
    maxZoomNum: 4,
    zIndex: 510,
    index: 0,
    gap: 10,
    speed: 300
  }

  render () {
    return (
      <WXImageContext.Provider value={{ onClose: this.props.onClose, onError: this.props.onError }}>
        {ReactDOM.createPortal(<WrapViewer {...(this.props as Required<WxImageViewerProps>)} />, document.body)}
      </WXImageContext.Provider>
    )
  }
}

export default WxImageViewer
