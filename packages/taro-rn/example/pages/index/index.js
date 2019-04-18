import React from 'react'
import Taro, { Component } from '@tarojs/taro-rn'
import { View, Text, StyleSheet, Button } from 'react-native'
import { chooseImage } from '../../../src/api/image'
import * as toast from '../../../src/api/interface'

console.log('toast', toast)

const styles = StyleSheet.create({
  index: {
    fontSize: 18,
    textAlign: 'center'
  }
})

export default class Index extends Component {
  componentWillMount () { }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  chooseImage () {
    console.log('chooseImage')
    chooseImage({
      count: 2,
      success (res) {
        console.log('success')
      },
      fail (res) {
        console.log('fail')
      }
    }).then(res => console.log(res)).catch(e => console.log(e))
  }

  render () {
    return (
      <View style={{paddingTop: 20}}>
        <Text style={styles.index}>Hello world!</Text>
        <Button onPress={this.chooseImage.bind(this)} title='chooseImage' color='#841584' />
      </View>
    )
  }
}
