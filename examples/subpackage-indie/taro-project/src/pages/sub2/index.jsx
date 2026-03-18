import { View, Text } from '@tarojs/components'
import './index.scss'

export default function Sub2Detail() {
  return (
    <View className="sub2-detail">
      <View className="detail-header">
        <Text className="title">订单详情 (Sub2 子分包组件)</Text>
      </View>
      <View className="detail-content">
        <View className="detail-row">
          <Text className="label">订单号:</Text>
          <Text className="value">#1001</Text>
        </View>
        <View className="detail-row">
          <Text className="label">下单时间:</Text>
          <Text className="value">2026-03-16 14:30</Text>
        </View>
        <View className="detail-row">
          <Text className="label">订单状态:</Text>
          <Text className="value">已完成</Text>
        </View>
        <View className="detail-row">
          <Text className="label">订单金额:</Text>
          <Text className="value price">¥ 199.00</Text>
        </View>
      </View>
    </View>
  )
}
