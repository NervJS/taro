import React, { Component } from 'react'
import { View, Image } from '../src'

import { StyleSheet } from 'react-native'

const temp = StyleSheet.create({
  img: {
    width: 240,
    height: 500
  }
})

export default class EXImage extends Component {
  constructor () {
    super()
    this.state = {
      src: null
    }
  }

  componentDidMount () {
    setTimeout(() => {
      this.setState({
        src: 'https://storage.360buyimg.com/mtd/home/jdlogo1529462435227.png'
      })
    }, 0)
  }

  render () {
    return (
      <View style={{ width: 100 }}>
        <Image
          src={this.state.src}
          // src={require('./jdlogo.png')}
          mode="widthFix"
          style={{
            width: '100%',
            // height: 500
          }}
        />
      </View>
    )
  }
}
