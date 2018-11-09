import React from 'react'
import { ScrollView, RefreshControl } from 'react-native'

class RefreshProvider extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      refreshing: false
    }
  }

  render () {
    const {enablePullDownRefresh, disableScroll} = this.props
    if (disableScroll) {
      return this.props.children
    } else {
      return (
        <ScrollView
          style={{flex: 1}}
          scrollEventThrottle={5}
          alwaysBounceVertical={false}
          onScroll={this.onScroll}
          refreshControl={
            enablePullDownRefresh
              ? <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this.handlePullDownRefresh}
              />
              : null
          }
        >
          {this.props.children && this.props.children}
        </ScrollView>
      )
    }
  }

  onScroll = (e) => {
    this.props.onScroll && this.props.onScroll(e.nativeEvent.contentOffset.y)
  }

  // TODO 滚动到底部事件
  handleReachBottom = () => {
    this.props.onReachBottom && this.props.onReachBottom()
  }

  handlePullDownRefresh = (callback) => {
    this.setState({refreshing: true}, callback)
    try {
      // TODO 处理异步的情况
      this.props.onPullDownRefresh && this.props.onPullDownRefresh()
    } catch (e) {
      throw new Error(e)
    } finally {
      this.setState({refreshing: false})
    }
  }

  stopPullDownRefresh = (callback) => {
    this.setState({refreshing: false}, callback)
  }
}

export default RefreshProvider
