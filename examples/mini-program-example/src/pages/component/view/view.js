import './view.scss'

import React from 'react'
import { View, Text } from '@tarojs/components'

import Header from '../../../components/head/head'
import ComponentState from '../../../components/component_state/component_state'

export default class PageView extends React.Component {
  render() {
    return (
      <View className='components-page'>
        <View className='components-page__header'>
          <Header title='View'></Header>
          <ComponentState platform='H5' rate='100'>
            {' '}
          </ComponentState>
        </View>
        <View className='components-page__body'>
          <View className='components-page__body-example example'>
            <View className='example-header'>
              <Text>flex-direction: row 横向布局</Text>
            </View>
            <View className='example-body'>
              <View className='example-body__list'>
                <View className='example-body__list-item demo-text-1'></View>
                <View className='example-body__list-item demo-text-2'></View>
                <View className='example-body__list-item demo-text-3'></View>
              </View>
            </View>
          </View>
          <View className='components-page__body-example example'>
            <View className='example-header'>
              <Text>flex-direction: column 纵向布局</Text>
            </View>
            <View className='example-body'>
              <View className='example-body__list example-body__list--vertical'>
                <View className='example-body__list-item demo-text-1'></View>
                <View className='example-body__list-item demo-text-2'></View>
                <View className='example-body__list-item demo-text-3'></View>
              </View>
            </View>
          </View>
        </View>
      </View>
    )
  }
}
