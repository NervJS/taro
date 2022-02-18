import { View, Text } from '@tarojs/components'
import { printCommon } from '../../common'
import { printTool } from '../../common/tools'

import './index.scss'

export default function () {
  printCommon()
  printTool()

  return (
    <View className='index'>
      <Text className='blue'>Page bar: <Text className='red'>red</Text></Text>
    </View>
  )
}
