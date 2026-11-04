import { View, Text } from '@tarojs/components'
import './OnlySub2.scss'

export default function OnlySub2() {
  return (
    <View className="only-sub2-panel">
      <Text className="only-sub2-title">OnlySub2 组件</Text>
      <Text className="only-sub2-desc">
        只有 Sub2 页面动态引入，chunk 打在 pages/sub2-async。
      </Text>
    </View>
  )
}
