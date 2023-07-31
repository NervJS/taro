import Taro from '@tarojs/taro'
import { useState } from 'react'
import { View, Button, Text } from '@tarojs/components'
import './tabBarApis.scss'

function randomColor() {
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`
}

/**
 * 界面-菜单栏
 * @returns
 */
const TabBarApis = () => {
  const [count1, setCount1] = useState(0)
  const [count2, setCount2] = useState(0)
  return (
    <View className='api-page'>
      <View className='page-sub-title'>
        <Text className='page-sub-title_text'>以下为 TabBar 相关接口</Text>
      </View>
      <View className='view-item'>
        <Button
          className='btn'
          onClick={() =>
            Taro.hideTabBar({
              animation: true,
              success: () => {
                console.log('成功')
              },
              fail: (err) => {
                console.log('失败：', err)
              },
              complete: () => {
                console.log('完成')
              },
            })
          }
        >
          hideTabBar
        </Button>

        <Button
          className='btn'
          onClick={() =>
            Taro.showTabBar({
              animation: true,
              success: () => {
                console.log('成功')
              },
              fail: (err) => {
                console.log('失败：', err)
              },
              complete: () => {
                console.log('完成')
              },
            })
          }
        >
          showTabBar
        </Button>

        <Button
          className='btn'
          onClick={() =>
            Taro.showTabBarRedDot({
              index: 3,
              success: () => {
                console.log('成功')
              },
              fail: (err) => {
                console.log('失败：', err)
              },
              complete: () => {
                console.log('完成')
              },
            })
          }
        >
          showTabBarRedDot
        </Button>

        <Button
          className='btn'
          onClick={() =>
            Taro.hideTabBarRedDot({
              index: 3,
              success: () => {
                console.log('成功')
              },
              fail: (err) => {
                console.log('失败：', err)
              },
              complete: () => {
                console.log('完成')
              },
            })
          }
        >
          hideTabBarRedDot
        </Button>

        <Button
          className='btn'
          onClick={() => {
            const randomStyle = `${Math.random() > 0.5 ? 'white' : 'black'}`
            Taro.setTabBarStyle({
              color: randomColor(),
              selectedColor: randomColor(),
              backgroundColor: randomColor(),
              borderStyle: randomStyle,
              success: () => {
                console.log('成功')
              },
              fail: (err) => {
                console.log('失败：', err)
              },
              complete: () => {
                console.log('完成')
              },
            })
          }}
        >
          setTabBarStyle
        </Button>

        <Button
          className='btn'
          onClick={() =>
            Taro.setTabBarItem({
              index: 3,
              text: '接口' + count1,
              iconPath: 'https://pic2.58cdn.com.cn/nowater/frs/n_v2177d0d75bccb451690a05b095f65c9b9.png',
              selectedIconPath: 'https://pic4.58cdn.com.cn/nowater/frs/n_v2fe166220239544f19c736d76357a991a.png',
              success: () => {
                setCount1((c) => c + 1)
                console.log('成功')
              },
              fail: (err) => {
                console.log('失败：', err)
              },
            })
          }
        >
          setTabBarItem
        </Button>

        <Button
          className='btn'
          onClick={() =>
            Taro.setTabBarBadge({
              index: 3,
              text: '' + count2,
              success: () => {
                setCount2((c) => c + 1)
                console.log('成功')
              },
              fail: (err) => {
                console.log('失败：', err)
              },
            })
          }
        >
          setTabBarBadge
        </Button>

        <Button
          className='btn'
          onClick={() =>
            Taro.removeTabBarBadge({
              index: 3,
              success: () => {
                setCount2(0)
                console.log('成功')
              },
              fail: (err) => {
                console.log('失败：', err)
              },
            })
          }
        >
          removeTabBarBadge
        </Button>
      </View>
    </View>
  )
}

export default TabBarApis
