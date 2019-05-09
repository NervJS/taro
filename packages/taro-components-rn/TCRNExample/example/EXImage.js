import React, { Component } from 'react'
import { StyleSheet } from 'react-native'
import { View, Image } from '../../dist'

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
      src: 'https://storage.360buyimg.com/mtd/home/jdlogo1529462435227.png'
    }
  }

  componentDidMount () {
    setTimeout(() => {
      this.setState({
        src: 'https://static.360buyimg.com/mtd/pc/fresh_v3/1.0.0/gb/images/mod_header_logo@2x.png'
      })
    }, 3000)
  }

  render () {
    return (
      <View style={{ width: 200 }}>
        <Image
          src={this.state.src}
          // src={require('./jdlogo.png')}
          mode="widthFix"
          onClick={(ret) => {
            // alert('click me')
            console.log(ret)
          }}
          style={{
            width: '100%',
            // height: 500
          }}
          hoverStyle={{
            backgroundColor: 'red'
          }}
        />
      </View>
    )
  }
}
