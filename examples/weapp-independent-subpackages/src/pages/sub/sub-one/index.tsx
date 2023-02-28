import Taro from '@tarojs/taro'
import { View, Button } from '@tarojs/components'

import './index.scss'

export default function () {
  return (
    <View>
      <View className='red'>我是独立分包</View>
      <Button
        type="primary"
        onClick={() => {
          Taro.showModal({ content: 'modal', title: 'Tip' });
        }}
      >
        测试事件
      </Button>
    </View>
  )
}
