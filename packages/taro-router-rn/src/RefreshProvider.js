import React from 'react'
import { ScrollView, RefreshControl } from 'react-native'

class RefreshProvider extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      refreshing: false
    }
    this.handlePullDownRefresh = this.handlePullDownRefresh.bind(this)
    this.stopPullDownRefresh = this.stopPullDownRefresh.bind(this)
    this.onScroll = this.onScroll.bind(this)
  }

  render () {
    return (
      <ScrollView
        style={{flex: 1}}
        onScroll={this.onScroll}
        scrollEventThrottle={5}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this.handlePullDownRefresh}
          />
        }
      >
        {this.props.children && this.props.children}
      </ScrollView>
    )
  }

  onScroll (e) {
    this.props.onScroll && this.props.onScroll(e.nativeEvent.contentOffset.y)
  }

  handlePullDownRefresh () {
    this.setState({refreshing: true})
    try {
      // TODO 处理异步的情况
      this.props.onPullDownRefresh && this.props.onPullDownRefresh()
    } catch (e) {
      throw new Error(e)
    } finally {
      this.setState({refreshing: false})
    }
  }

  stopPullDownRefresh () {
    this.setState({refreshing: false})
  }
}

export default RefreshProvider
