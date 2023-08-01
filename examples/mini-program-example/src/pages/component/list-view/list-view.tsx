import { View, Image, Text, ListView } from '@tarojs/components'
import { useLoad } from '@tarojs/taro'
import './list-view.scss'
import React from 'react'
import Header from '../../../components/head/head'
import ComponentState from '../../../components/component_state/component_state'

export default function PageView() {
  useLoad(() => {
    console.log('Page loaded.')
  })

  return (
    <View className='components-page'>
      <View className='components-page__header'>
        <Header title='ListView'></Header>
        <ComponentState platform='H5' rate='100'>
          {' '}
        </ComponentState>
      </View>
      <View className='index'>
        <ListView padding={[10, 10, 10, 100]} className='listStyle'>
          <View>AAAAAAAAAAAA</View>
          <View>BBBBBBB</View>
          <View>CCCCCCCCCCCC</View>
        </ListView>
      </View>
    </View>
  )
}
