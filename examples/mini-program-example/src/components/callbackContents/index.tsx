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
  //   componentDidMount (): void {
  //       console.log(this.props)
  //   }
  render() {
    const { testApi, callbackRes } = this.props
    return (
      <View className='callback-content'>
        {Object.keys(callbackRes).map((key, index) => {
          console.log(key)
          const resId = `${testApi}-${key}`
          return (
            <View key={key} className='callback-res' id={resId}>
              {JSON.stringify(callbackRes[key])}
            </View>
          )
        })}
      </View>
    )
  }
}
