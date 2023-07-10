import './scroll-view.scss'
import React from 'react'
import { View, Text, ScrollView, Button } from '@tarojs/components'

import Header from '../../../components/head/head'

export default class PageView extends React.Component {
  render() {
    return (
      <View className='components-page'>
        <View className='components-page__header'>
          <Header title='ScrollView'></Header>
        </View>
        <View className='components-page__body'>
          <View className='components-page__body-example example scroll-view'>
            <View className='example-header'>
              <Text> Horizontal 横向滚动</Text>
            </View>
            <View className='example-body'>
              <ScrollView
                scrollX
                className='example-body__scroll-view example-body__scroll-view--H'
              >
                <View className='example-body__scroll-view-item demo-text-1'></View>
                <View className='example-body__scroll-view-item demo-text-2'></View>
                <View className='example-body__scroll-view-item demo-text-3'></View>
              </ScrollView>
            </View>
          </View>

          <View className='components-page__body-example example scroll-view'>
            <View className='example-header'>
              <Text>Vertical 纵向滚动</Text>
            </View>
            <View className='example-body'>
              <ScrollView
                scrollY
                scrollWithAnimation
                className='example-body__scroll-view example-body__scroll-view--V'
              >
                <View className='example-body__scroll-view-item demo-text-1'></View>
                <View className='example-body__scroll-view-item demo-text-2'></View>
                <View className='example-body__scroll-view-item demo-text-3'></View>
              </ScrollView>
            </View>
          </View>
        </View>
      </View>
    )
  }
}
