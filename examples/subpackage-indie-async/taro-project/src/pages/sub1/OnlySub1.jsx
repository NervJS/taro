import { View, Text } from '@tarojs/components'
import './OnlySub1.scss'

export default function OnlySub1() {
  return (
    <View className="only-sub1-panel">
      <Text className="only-sub1-title">OnlySub1 组件</Text>
      <Text className="only-sub1-desc">
        只有 Sub1 页面动态引入，chunk 打在 pages/sub1-async。
      </Text>
      {/* 异步 chunk 内的深层选择器：样式随 chunk 打进页面时深层命中不退化 */}
      <View className="only-sub1-deep">
        <Text className="only-sub1-deep-title">深层样式演示（异步 chunk）</Text>
        <View className="only-sub1-deep-inner">
          <View className="only-sub1-deep-inner">
            <Text className="only-sub1-deep-leaf">
              3 层后代选择器 / 层级缩进应稳定命中
            </Text>
          </View>
        </View>
      </View>
    </View>
  )
}
