import React from 'react'
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import { TestConsole } from '@/util/util'
import ButtonList from '@/components/buttonList'
import './index.scss'

/**
 * 云开发
 * @returns
 */

export default class Index extends React.Component {
  state = {
    list: [
      {
        id: 'cloud',
        func: (apiIndex) => {
          TestConsole.consoleTest('Taro.cloud')
          // @ts-ignore
          const myCloudInstance = new Taro.cloud({
            env: 'your-env-id',
          })
          TestConsole.consoleSuccess.call(this, myCloudInstance, apiIndex)
        },
      },
      {
        id: 'DB',
        func: null,
      },
    ],
  }
  render() {
    const { list } = this.state
    return (
      <View className='api-page'>
        <ButtonList buttonList={list} />
      </View>
    )
  }
}
