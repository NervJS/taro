import { View, Image, MatchMedia, GridView, Text, ScrollView, Button } from '@tarojs/components'
import { useLoad } from '@tarojs/taro'
import './grid-view.scss'
import React from 'react'
import Header from '../../../components/head/head'
import ComponentState from '../../../components/component_state/component_state'
import { generateGridList } from './utils'
import { GridTile } from './grid-tile'

const grid_data = generateGridList(1000, 4)

export default function PageView() {
  useLoad(() => {
    console.log('Page loaded.')

  })

  const gridView = grid_data.map((childItem) => (
    <GridTile index={childItem.id} height={100 * childItem.sub}/>
  ))

  return (
    <View className='components-page'>
      <View className='components-page__header'>
        <Header title='GridView'></Header>
        <ComponentState platform='H5' rate='100'>
          {' '}
        </ComponentState>
      </View>
      <View className="grid-aligned-title">
        <View>grid-view高度由同行最大高度子节点决定</View>
        <Button className="btn" type="primary" onClick={() => {
          Taro.navigateTo({url: "/pages/component/grid-view/demo1"})
        }}>grid aligned网格布局</Button>
      </View>

      <View className="grid-aligned-title">
        <View>grid-view根据子元素高度自动布局(瀑布流)</View>
        <Button className="btn" type="primary" onClick={() => {
          Taro.navigateTo({url: "/pages/component/grid-view/demo2"})
        }}>grid masonry瀑布流</Button>
      </View>
    </View>
  )
}
