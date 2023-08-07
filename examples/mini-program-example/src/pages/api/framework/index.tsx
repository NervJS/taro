import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import ButtonList from '@/components/buttonList'
import withWeapp from '@tarojs/with-weapp'
import './index.scss'

/**
 * 框架
 * @returns
 */

export default class Index extends React.Component {
  state = {
    list: [
      {
        id: 'App',
        func: null,
      },
      {
        id: 'getApp',
        func: () => {
          const app = Taro.getApp()
          console.log('getApp success ', app)
        },
      },
      {
        id: 'getCurrentPages',
        func: () => {
          const pages = Taro.getCurrentPages()
          console.log('getCurrentPages success ', pages)
        },
      },
      {
        id: 'Page',
        func: () => {
          const pages = Taro.getCurrentPages()
          console.log('pages...')
        },
      },
    ],
  }
  render() {
    const { list } = this.state
    return (
      <View className='api-page'>
        <ButtonList buttonList={list} />
      </View>
    )
  }
}
