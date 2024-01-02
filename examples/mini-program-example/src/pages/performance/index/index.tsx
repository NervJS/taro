import React from 'react'
// import Taro from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
// import { TestConsole } from '@/util/util'
import './index.scss'

/**
 * 框架
 * @returns
 */

export default class Index extends React.Component {
  state = {
    result: ''
  }
  requestPressureTest = ()=>{
    console.log('压测：requestPressureTest')
  }
  syncPressureTest = ()=>{
    console.log('压测：syncPressureTest')
  }
  asyncPressureTest=()=>{
    console.log('压测：asyncPressureTest')
  }
  render() {
    const { result } = this.state
    return (
      <View className='api-page'>
        <Text>
          {result}
        </Text>
        <Button
          onClick={this.requestPressureTest}>
          压测：网络请求
        </Button>
        <Button
          onClick={this.syncPressureTest}>
          压测：同步调用
        </Button>
        <Button
          onClick={this.asyncPressureTest}>
          压测：异步调用
        </Button>
      </View>
    )
  }
}
