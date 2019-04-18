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
      src: null
    }
  }

  // componentDidMount () {
  //   setTimeout(() => {
  //     this.setState({
  //       src: 'https://storage.360buyimg.com/mtd/home/jdlogo1529462435227.png'
  //     })
  //   }, 0)
  // }

  render () {
    return (
      <View style={{ width: 200 }}>
        <Image
          src={'https://storage.360buyimg.com/mtd/home/jdlogo1529462435227.png'}
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
