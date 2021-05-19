import React, { Component } from 'react'

import ListContainer from './ListContainer'

const screenWidth = document.documentElement.clientWidth
const screenHeight = document.documentElement.clientHeight

export interface WrapViewerProps {
  index: number // 当前显示图片的http链接
  urls: string[] // 需要预览的图片http链接列表
  maxZoomNum: number // 最大放大倍数
  zIndex: number // 组件图层深度
  gap: number // 间隙
  speed: number // Duration of transition between slides (in ms)
}

interface State {
  index: number
}

class WrapViewer extends Component<WrapViewerProps, State> {
  state = {
    index: 0
  }

  componentDidMount () {
    const { index } = this.props

    this.setState({
      index
    })
  }

  changeIndex = (index) => {
    // console.info('changeIndex index = ', index)
    this.setState({
      index
    })
  }

  render () {
    const { zIndex, urls, maxZoomNum, gap, speed } = this.props

    const { index } = this.state

    return (
      <div className="wx-image-viewer" style={{ zIndex }}>
        {/* root */}
        <div className="viewer-cover" />
        <ListContainer
          screenWidth={screenWidth}
          screenHeight={screenHeight}
          changeIndex={this.changeIndex}
          urls={urls}
          maxZoomNum={maxZoomNum}
          gap={gap}
          speed={speed}
          index={index}
        />
      </div>
    )
  }
}

export default WrapViewer
