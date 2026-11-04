import { View, Text } from '@tarojs/components'
import './SharedBySub1Sub2.scss'

export default function SharedBySub1Sub2() {
  return (
    <View className="shared-sub1sub2-panel">
      <Text className="shared-sub1sub2-title">SharedBySub1Sub2 组件</Text>
      <Text className="shared-sub1sub2-desc">
        Sub1 与 Sub2 共同动态引入，chunk 打在 pages/shared-async，只保留一份。
      </Text>
    </View>
  )
}
