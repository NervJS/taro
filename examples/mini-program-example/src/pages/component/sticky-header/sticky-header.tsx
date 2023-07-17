import { View, StickyHeader, StickySection, CoverImage } from '@tarojs/components'
import { useLoad } from '@tarojs/taro'
import './sticky-header.scss'
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
        <Header title='StickyHeader'></Header>
        <ComponentState platform='H5' rate='100'> </ComponentState>
      </View>
      <StickyHeader>
        <StickySection style={{ background: '#aaaaaa' }}>
          我是吸顶容器
        </StickySection>
      </StickyHeader>
      <CoverImage
        style={{ display: 'flex' }}
        src='https://camo.githubusercontent.com/3e1b76e514b895760055987f164ce6c95935a3aa/687474703a2f2f73746f726167652e333630627579696d672e636f6d2f6d74642f686f6d652f6c6f676f2d3278313531333833373932363730372e706e67'>
      </CoverImage>
      <CoverImage
        style={{ display: 'flex' }}
        src='https://camo.githubusercontent.com/3e1b76e514b895760055987f164ce6c95935a3aa/687474703a2f2f73746f726167652e333630627579696d672e636f6d2f6d74642f686f6d652f6c6f676f2d3278313531333833373932363730372e706e67'>
      </CoverImage>
      <CoverImage
        style={{ display: 'flex' }}
        src='https://camo.githubusercontent.com/3e1b76e514b895760055987f164ce6c95935a3aa/687474703a2f2f73746f726167652e333630627579696d672e636f6d2f6d74642f686f6d652f6c6f676f2d3278313531333833373932363730372e706e67'>
      </CoverImage>
      <CoverImage
        style={{ display: 'flex' }}
        src='https://camo.githubusercontent.com/3e1b76e514b895760055987f164ce6c95935a3aa/687474703a2f2f73746f726167652e333630627579696d672e636f6d2f6d74642f686f6d652f6c6f676f2d3278313531333833373932363730372e706e67'>
      </CoverImage>
      <CoverImage
        style={{ display: 'flex' }}
        src='https://camo.githubusercontent.com/3e1b76e514b895760055987f164ce6c95935a3aa/687474703a2f2f73746f726167652e333630627579696d672e636f6d2f6d74642f686f6d652f6c6f676f2d3278313531333833373932363730372e706e67'>
      </CoverImage>

    </View>
  )
}
