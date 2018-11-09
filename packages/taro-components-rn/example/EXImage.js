import React, { Component } from 'react'
import { View, Image } from '../src'

export default class EXImage extends Component {
  render () {
    return (
      <View>
        <Image
          // src="https://storage.360buyimg.com/mtd/home/jdlogo1529462435227.png"
          src={require('./jdlogo.png')}
          mode="widthFix"
          style={{
            width: 240,
            // height: 74
          }}
        />
      </View>
    )
  }
}
