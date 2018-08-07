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
    return (
      <ScrollView
        style={{flex: 1}}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this.onRefresh.bind(this)}
          />
        }
      >
        {this.props.children && this.props.children}
      </ScrollView>
    )
  }

  onRefresh () {
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
}

export default RefreshProvider
