import { View, Text } from '@tarojs/components'
import { useLoad } from '@tarojs/taro'
import './index.scss'
import {TestBlock} from "taro-components-mpharmony/src/components";

export default function Index() {

  useLoad(() => {
    console.log('Page loaded.')
  })

  return (
    <View className='index'>
      <Text>Hello world!</Text>
      <TestBlock><Text>Hello world!</Text></TestBlock>
    </View>
  )
}
