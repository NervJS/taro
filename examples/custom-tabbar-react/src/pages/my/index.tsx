import { useMemo } from 'react'
import Taro, { useDidShow } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'

import type CustomTabBar from '../../custom-tab-bar'

export default function Index () {
  const page = useMemo(() => Taro.getCurrentInstance().page, [])

  useDidShow(() => {
    const tabbar = Taro.getTabBar<CustomTabBar>(page)
    tabbar?.setSelected(3)
  })

  return (
    <View className='index'>
      <Text>我是个人中心！</Text>
    </View>
  )
}
