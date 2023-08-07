import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import ButtonList from '@/components/buttonList'
import './index.scss'

/**
 * 转发
 * @returns
 */

export default class Index extends React.Component {
  state = {
    list: [
      {
        id: 'updateShareMenu',
        func: null,
      },
      {
        id: 'showShareMenu',
        func: null,
      },
      {
        id: 'showShareImageMenu',
        func: null,
      },
      {
        id: 'shareVideoMessage',
        func: null,
      },
      {
        id: 'shareFileMessage',
        func: null,
      },
      {
        id: 'onCopyUrl',
        func: null,
      },
      {
        id: 'offCopyUrl',
        func: null,
      },
      {
        id: 'hideShareMenu',
        func: null,
      },
      {
        id: 'getShareInfo',
        func: null,
      },
      {
        id: 'authPrivateMessage',
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
