import React from 'react'
import { View } from '@tarojs/components'

import './component_state.scss'

export default class ComponentState extends React.Component {
  static options = {
    addGlobalClass: true,
  }

  render() {
    return (
      <View className='page-state'>
        <View className='page-state-platform'>组件类型：{this.props.platform}</View>
        <View className='page-state-rate'>适配进度：{this.props.rate}%</View>
      </View>
    )
  }
}
