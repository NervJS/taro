import { View, Text, Button } from '@tarojs/components'
import { useState } from 'react'
import './index.scss'

export default function OrderIndex() {
  const [showList, setShowList] = useState(false)
  const [showDetail, setShowDetail] = useState(false)

  return (
    <View className="order-index">
      <View className="header">
        <Text className="title">订单入口组件 (主包)</Text>
      </View>

      <View className="actions">
        <Button onClick={() => setShowList(!showList)}>
          {showList ? '隐藏' : '显示'} List 组件 (sub1)
        </Button>
        <Button onClick={() => setShowDetail(!showDetail)}>
          {showDetail ? '隐藏' : '显示'} Detail 组件 (sub2)
        </Button>
      </View>

      <View className="content">
        {/* sub1 组件 - 通过 componentPlaceholder 异步加载 */}
        {showList && <list />}

        {/* sub2 组件 - 通过 componentPlaceholder 异步加载 */}
        {showDetail && <detail />}
      </View>
    </View>
  )
}
