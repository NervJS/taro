import './cover-image.scss'

import React from 'react'
import { View, Text, Image, CoverImage } from '@tarojs/components'

import nervLogo from './nerv_logo.png'

import Header from '../../../components/head/head'
import ComponentState from "../../../components/component_state/component_state";

export default class PageView extends React.Component {
  render() {
    return (
      <View className='components-page'>
        <View className='components-page__header'>
          <Header title='CoverImage'></Header>
           <ComponentState platform='H5' rate='100'> </ComponentState>
        </View>
        <View className='components-page__body'>
          <View className='components-page__body-example example'>
            <View className='example-header'>
              <Text>Local Image</Text>
            </View>
            <View className='example-body'>
              <CoverImage
                style={{display: 'flex'}}
                src={nervLogo}
                referrerPolicy='origin'
                fixedTop='1px'
                fixedBottom='1px'
                fixedRight='1px'
                fixedLeft='1px'
                ariaRole='角色'
                ariaLabel='属性'
                onLoad={() => {
                  console.log('CoverImage onLoad success')
                }}
                onError={() => {
                  console.log('CoverImage onError success')
                }}
                onTap={() => {
                  console.log('CoverImage onTap success')
                }}
                ></CoverImage>
            </View>
          </View>
          <View className='components-page__body-example example'>
            <View className='example-header'>
              <Text>Internet Image</Text>
            </View>
            <View className='example-body'>
              <CoverImage
                style={{display: 'flex'}}
                src='https://camo.githubusercontent.com/3e1b76e514b895760055987f164ce6c95935a3aa/687474703a2f2f73746f726167652e333630627579696d672e636f6d2f6d74642f686f6d652f6c6f676f2d3278313531333833373932363730372e706e67'>
              </CoverImage>
            </View>
          </View>
        </View>
      </View>
    )
  }
}
