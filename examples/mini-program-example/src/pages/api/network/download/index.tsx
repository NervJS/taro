import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import ButtonList from '@/components/buttonList'
import './index.scss'

/**
 * 网络-下载
 * @returns
 */

export default class Index extends React.Component {
  state = {
    list: [
      {
        id: 'downloadFile',
        func: null,
      },
      {
        id: 'DownloadTask',
        func: null,
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
