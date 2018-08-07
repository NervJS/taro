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
  }

  render () {
    return (
      <ScrollView
        style={{flex: 1}}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this.handlePullDownRefresh.bind(this)}
          />
        }
      >
        {this.props.children && this.props.children}
      </ScrollView>
    )
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
