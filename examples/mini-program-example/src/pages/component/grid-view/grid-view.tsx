import { View, Image, MatchMedia, GridView, Text } from '@tarojs/components'
import { useLoad } from '@tarojs/taro'
import './grid-view.scss'
import React from 'react'
import Header from '../../../components/head/head'
import ComponentState from '../../../components/component_state/component_state'

const grid_data = [
  {
    image: 'https://img12.360buyimg.com/jdphoto/s72x72_jfs/t6160/14/2008729947/2754/7d512a86/595c3aeeNa89ddf71.png',
    value: '领取中心',
    w: 300,
    h: 100,
  },
  {
    image: 'https://img20.360buyimg.com/jdphoto/s72x72_jfs/t15151/308/1012305375/2300/536ee6ef/5a411466N040a074b.png',
    value: '找折扣',
    w: 300,
    h: 50,
  },
  {
    image: 'https://img10.360buyimg.com/jdphoto/s72x72_jfs/t5872/209/5240187906/2872/8fa98cd/595c3b2aN4155b931.png',
    value: '领会员',
    w: 300,
    h: 100,
  },
  {
    image: 'https://img12.360buyimg.com/jdphoto/s72x72_jfs/t10660/330/203667368/1672/801735d7/59c85643N31e68303.png',
    value: '新品首发',
    w: 300,
    h: 300,
  },
  {
    image: 'https://img14.360buyimg.com/jdphoto/s72x72_jfs/t17251/336/1311038817/3177/72595a07/5ac44618Na1db7b09.png',
    value: '领京豆',
    w: 300,
    h: 100,
  },
  {
    image: 'https://img30.360buyimg.com/jdphoto/s72x72_jfs/t5770/97/5184449507/2423/294d5f95/595c3b4dNbc6bc95d.png',
    value: '手机馆',
    w: 200,
    h: 50,
  },
]

export default function PageView() {
  useLoad(() => {
    console.log('Page loaded.')
  })

  const gridView = grid_data.map((childItem, index) => (
    <View
      key={index}
      style={{ display: 'flex', height: childItem.h, width: childItem.w }}
      onClick={() => {
        console.log('w ' + index + ' w ' + childItem.w + ' h ' + childItem.h)
      }}
    >
      {childItem.image && <Image style={{ width: 60, height: 60 }} src={childItem.image} mode='scaleToFill' />}
      <Text>{childItem.value}</Text>
    </View>
  ))

  return (
    <View className='components-page'>
      <View className='components-page__header'>
        <Header title='GridView'></Header>
        <ComponentState platform='H5' rate='100'>
          {' '}
        </ComponentState>
      </View>
      <View className='index'>
        <GridView className='gridStyle' crossAxisCount={3} mainAxisGap={10} crossAxisGap={10} type='masonry'>
          {gridView}
        </GridView>
      </View>
    </View>
  )
}
