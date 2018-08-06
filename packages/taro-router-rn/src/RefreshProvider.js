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
        {this.props.chldren && this.props.chldren}
      </ScrollView>
    )
  }

  onRefresh () {
    console.log('onRefresh')
    this.setState({refreshing: true})
    try {
      this.props.onPullDownRefresh && this.props.onPullDownRefresh()
    } catch (e) {
      throw new Error(e)
    } finally {
      this.setState({refreshing: false})
    }
  }
}

export default RefreshProvider
