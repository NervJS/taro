import { View, Button } from '@tarojs/components'
import Taro, { useLoad, useDidShow } from '@tarojs/taro'
import './index.scss'
import { TestConsole } from '@/util/util'
import nativeApi from "@/util/nativeApi";

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
      <Button
        className='buttonStyle'
        onClick={()=>{
            Taro.navigateTo({
              url: 'pages/performance/index/index'
            })
        }}>
        性能测试
      </Button>
      <Button
        onClick={()=>{
          nativeApi.harmonyNavigateTo({
            indexHtmlPath: '/spa/new/index.html',
            taroPath: 'pages/performance/index/index'
          })
        }}>
        多实例（多SPA跳转）：性能列表页
      </Button>
      <Button
        onClick={()=>{
          nativeApi.harmonyNavigateTo({
            indexHtmlPath: '/spa/new/index.html',
            taroPath: 'pages/api/index/index'
          })
        }}>
        单实例（单SPA）：接口列表页
      </Button>
    </View>
  )
}
