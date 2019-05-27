import React, { Component } from 'react'
import { View, Progress } from '../../dist'

export default class EXProgress extends Component {
  state = {
    progressPercent: 70
  }

  componentDidMount () {
    setInterval(() => {
      this.setState({
        progressPercent: Math.floor(Math.random() * 100)
      })
    }, 5000)
  }

  render () {
    return (
      <View style={{ width: 300 }}>
        <Progress
          percent={this.state.progressPercent}
          activeColor="orange"
          backgroundColor="pink"
          showInfo={true}
        />
        <Progress
          percent={this.state.progressPercent}
          active={true}
          style={{ marginTop: 10 }}
        />
        <Progress
          percent={this.state.progressPercent}
          active={true}
          activeMode="forwards"
          style={{ marginTop: 10 }}
        />
      </View>
    )
  }
}
