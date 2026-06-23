import React from 'react'
import { View } from '@tarojs/components'
import './index.scss'

/**
 * 页面未找到
 * @returns
 */

export default class Index extends React.Component {
  render() {
    return <View className='error-page'>页面未找到啦</View>
  }
}
