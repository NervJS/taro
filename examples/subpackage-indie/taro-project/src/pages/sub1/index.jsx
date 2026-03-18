import { View, Text, Image } from '@tarojs/components'
import img from '../../assets/no_wifi.png'
import './index.scss'

export default function Sub1List() {
  const items = [
    { id: 1, name: '订单 #1001', status: '已完成' },
    { id: 2, name: '订单 #1002', status: '进行中' },
    { id: 3, name: '订单 #1003', status: '待支付' },
  ]

  return (
    <View className="sub1-list">
      <Image src={img} className="sub1-image" />
      <View className="list-header">
        <Text className="title">订单列表 (Sub1 子分包组件)</Text>
      </View>
      <View className="list-items">
        {items.map((item) => (
          <View key={item.id} className="list-item">
            <Text className="item-name">{item.name}</Text>
            <Text className="item-status">{item.status}</Text>
          </View>
        ))}
      </View>
    </View>
  )
}
