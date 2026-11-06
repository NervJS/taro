import { View, Text } from '@tarojs/components'
import './SharedBySub1Sub2.scss'

export default function SharedBySub1Sub2() {
  return (
    <View className="shared-sub1sub2-panel">
      <Text className="shared-sub1sub2-title">SharedBySub1Sub2 组件</Text>
      <Text className="shared-sub1sub2-desc">
        Sub1 与 Sub2 共同动态引入，chunk 打在 pages/shared-async，只保留一份。
      </Text>
      <View className="shared-sub1sub2-deep">
        <Text className="shared-sub1sub2-deep-title">深层样式演示（共享异步 chunk）</Text>
        <View className="shared-sub1sub2-deep-inner">
          <View className="shared-sub1sub2-deep-inner">
            <Text className="shared-sub1sub2-deep-leaf">
              共享 chunk 的深层选择器应同时命中两个页面
            </Text>
          </View>
        </View>
      </View>
    </View>
  )
}
