import { View, Text, Button } from '@tarojs/components'
import { useState } from 'react'
import './index.scss'

export default function Index() {
  const [count, setCount] = useState(0)

  return (
    <View className="index">
      <View className="header">
        <Text className="title">共享运行时（split 模式）示例</Text>
      </View>

      <View className="desc">
        <Text>
          本页面的业务代码不再打包 Taro / React 运行时。运行时被 external 到独立的
          shared-async-v1 异步核分包统一提供，业务包内只保留一个同步核
          taro-shared-sync.js。下面的计数器验证 React hooks 正常工作。
        </Text>
      </View>

      <View className="counter">
        <Text className="count">count: {count}</Text>
        <Button onClick={() => setCount(count + 1)}>+1</Button>
      </View>
    </View>
  )
}
