import { View, Text } from '@tarojs/components'
import './OnlySub1.scss'

export default function OnlySub1() {
  return (
    <View className="only-sub1-panel">
      <Text className="only-sub1-title">OnlySub1 组件</Text>
      <Text className="only-sub1-desc">
        只有 Sub1 页面动态引入，chunk 打在 pages/sub1-async。
      </Text>
    </View>
  )
}
