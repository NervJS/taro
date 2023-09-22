import React from 'react'
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import { TestConsole } from '@/util/util'
import ButtonList from '@/components/buttonList'
import './index.scss'

/**
 * 界面-菜单
 * @returns
 */

export default class Index extends React.Component {
  state = {
    list: [
      {
        id: 'getMenuButtonBoundingClientRect',
        func: () => {
          TestConsole.consoleTest('Taro.getMenuButtonBoundingClientRect')
          const rect = Taro.getMenuButtonBoundingClientRect()
          TestConsole.consoleNormal('getMenuButtonBoundingClientRect', rect)
        },
      },
    ],
    style: {
      top: 0,
      left: 0,
    },
  }

  onLoad() {
    try {
      const rect = Taro.getMenuButtonBoundingClientRect()
      this.setState({
        style: {
          top: `${rect.top}px`,
          left: `${rect.right - 87}px`,
          position: 'relative',
          marginBottom: '50px',
          width: '87px',
          borderRadius: `${rect.height}px`,
          height: `${rect.height}px`,
          fontSize: '16fp',
        },
      })
    } catch (err) {
      console.log('getMenuButtonBoundingClientRect failed')
    }
  }

  render() {
    const { list, style } = this.state
    return (
      <>
        <View className='capsule-btn' style={style}>
          胶囊
        </View>
        <View className='api-page'>
          <ButtonList buttonList={list} />
        </View>
      </>
    )
  }
}
