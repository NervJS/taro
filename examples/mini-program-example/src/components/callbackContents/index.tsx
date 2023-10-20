import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './index.scss'

/**
 * 回调结构内容
 * @returns
 */

interface Props {
  testApi: string
  callbackRes: any
}

export default class Index extends React.Component<Props> {
  state = {}
  stringify = (object) => {
    // console.log(object)
    const cache = new Map()
    const JSONStr = JSON.stringify(object, (key, value) => {
      if (value === undefined) {
        return 'undefined'
      }
      if (typeof value === 'object' && value !== null) {
        if (cache.has(value)) {
          return
        }
        cache.set(value, value)
      }
      return value
    })
    cache.clear()
    return JSONStr
  }
  render() {
    const { testApi, callbackRes } = this.props
    return (
      <View className='callback-content'>
        <View className='callback-res' id={`${testApi}-callback`}>
          {this.stringify(callbackRes)}
        </View>
      </View>
    )
  }
}
