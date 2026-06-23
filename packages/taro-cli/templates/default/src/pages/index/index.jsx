import { View, Text } from '@tarojs/components'
import { useLoad } from '@tarojs/taro'
import './index.{{ cssExt }}'

export default function {{ to_pascal_case pageName }} () {
  useLoad(() => {
    console.log('Page loaded.')
  })

  return (
    <View className='{{ pageName }}'>
      <Text>Hello world!</Text>
    </View>
  )
}
