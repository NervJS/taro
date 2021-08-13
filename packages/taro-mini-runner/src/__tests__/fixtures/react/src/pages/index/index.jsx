import React, { Component } from 'react'
import { View, Text, Input, Textarea } from '@tarojs/components'
import './index.css'

export default class Index extends Component {

  async componentWillMount () {
    await Promise.resolve(1)
  }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  render () {
    return (
      <View className='index'>
        <Text>Hello world!</Text>
        <Input placeholder='input' value='' />
        <Textarea value=''></Textarea>
      </View>
    )
  }
}
