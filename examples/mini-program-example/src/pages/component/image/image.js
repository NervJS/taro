import './image.scss'

import React from 'react'
import { View, Text, Image } from '@tarojs/components'

import nervLogo from './nerv_logo.png'

import Header from '../../../components/head/head'
import ComponentState from '../../../components/component_state/component_state'

export default class PageView extends React.Component {
  render() {
    return (
      <View className='components-page'>
        <View className='components-page__header'>
          <Header title='Image'></Header>
          <ComponentState platform='H5' rate='40'>
            {' '}
          </ComponentState>
        </View>
        <View className='components-page__body'>
          <View className='components-page__body-example example'>
            <View className='example-header'>
              <Text>Local Image</Text>
            </View>
            <View className='example-body'>
              <Image style={{ width: '300px', height: '300px' }} src={nervLogo}></Image>
            </View>
          </View>
          <View className='components-page__body-example example'>
            <View className='example-header'>
              <Text>Internet Image</Text>
            </View>
            <View className='example-body'>
              <Image
                style={{ width: '300px', height: '300px' }}
                src='https://camo.githubusercontent.com/3e1b76e514b895760055987f164ce6c95935a3aa/687474703a2f2f73746f726167652e333630627579696d672e636f6d2f6d74642f686f6d652f6c6f676f2d3278313531333833373932363730372e706e67'
              ></Image>
            </View>
          </View>
        </View>
      </View>
    )
  }
}
