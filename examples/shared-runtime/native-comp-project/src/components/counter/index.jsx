import { View, Text, Button } from '@tarojs/components'
import { useState } from 'react'
import './index.scss'

export default function Counter (props) {
  const [count, setCount] = useState(0)
  const initial = Number(props.initial) || 0

  return (
    <View className="counter">
      <View className="header">
        <Text className="title">共享运行时 · native-component 示例</Text>
      </View>
      <View className="desc">
        <Text>
          本组件被独立编译为微信原生自定义组件,不再打包 Taro / React 运行时,
          与 pages 模式业务包共享同一份 shared-async-v1 异步核分包。
          下面的计数器验证 useState / setState 走的是共享全局 react 单例。
        </Text>
      </View>
      <View className="count-row">
        <Text className="count">count: {count + initial}</Text>
        <Button size="mini" onClick={() => setCount(c => c + 1)}>+1</Button>
      </View>
    </View>
  )
}
