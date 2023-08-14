import React from 'react'
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import ButtonList from '@/components/buttonList'
import { TestConsole } from '@/util/util'
import './index.scss'

/**
 * 界面-字体
 * @returns
 */

export default class Index extends React.Component {
  state = {
    list: [
      {
        id: 'loadFontFace',
        func: () => {
          TestConsole.consoleTest('Taro.loadFontFace')
          Taro.loadFontFace({
            global: true,
            family: 'WenYue',
            source: 'url("https://static.heytea.com/taro_trial/v1/font/WenYue-XinQingNianTi-NC-W8_1.otf")',
            success: (res) => {
              TestConsole.consoleSuccess(res)
            },
            fail: (res) => {
              TestConsole.consoleFail(res)
            },
            complete: (res) => {
              TestConsole.consoleComplete(res)
            },
          })
        },
      },
    ],
  }
  render() {
    const { list } = this.state
    return (
      <View className='api-page' style={{ fontFamily: 'WenYue' }}>
        <ButtonList buttonList={list} />
      </View>
    )
  }
}
