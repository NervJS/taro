import { GridView, ScrollView } from '@tarojs/components'
import { useLoad } from '@tarojs/taro'
import './grid-view.scss'
import React from 'react'
import { generateGridList } from './utils'
import { GridTile } from './grid-tile'

const grid_data = generateGridList(1000, 4)

export default function PageView() {
  useLoad(() => {
    console.log('Page loaded.')
  })

  const gridView = grid_data.map((childItem, index) => (
    <GridTile index={childItem.id} height={100 * childItem.sub} key={index} />
  ))

  return (
    <ScrollView className='index' scrollY>
      <GridView className='gridStyle' crossAxisCount={4} mainAxisGap={4} crossAxisGap={8} type='aligned'>
        {gridView}
      </GridView>
    </ScrollView>
  )
}
