import React from 'react'
import Taro, { Component } from '@tarojs/taro-rn'
import { View, Text, StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  index: {
    fontSize: 24
  }
})

export default class Index extends Component {

  componentWillMount () { }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  render () {
    return (
      <View style={{paddingTop: 20}}>
        <Text style={styles.index}>Hello world!</Text>
      </View>
    )
  }
}
