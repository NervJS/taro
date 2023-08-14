import { View, Button } from '@tarojs/components'
import Taro, { useLoad, useDidShow } from '@tarojs/taro'
import './index.scss'
import { TestConsole } from '@/util/util'

export default function Index() {
  useLoad(() => {
    console.log('Page loaded.')
  })
  useDidShow(() => {
    if (Taro.getCurrentInstance().preloadData) {
      TestConsole.consoleSuccess(
        '接收来至pages/api/basics/index页面 Taro。preload传递的参数：' +
          JSON.stringify(Taro.getCurrentInstance().preloadData)
      )
    }
  })
  return (
    <View className='index'>
      <Button
        className='buttonStyle'
        onClick={() => {
          Taro.switchTab({
            url: '/pages/component/index/index',
          })
        }}
      >
        组件示例
      </Button>
      <Button
        className='buttonStyle'
        onClick={() => {
          Taro.switchTab({
            url: '/pages/api/index/index',
          })
        }}
      >
        Api示例
      </Button>
    </View>
  )
}
