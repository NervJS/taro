import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import ButtonList from '@/components/buttonList'
import { TestConsole } from '@/util/util'
import './index.scss'

/**
 * 界面-字体
 * @returns
 */

const fontUrls = [
  'https://mdn.github.io/css-examples/web-fonts/VeraSeBd.ttf',
  'https://puhuiti.oss-cn-hangzhou.aliyuncs.com/AlimamaShuHeiTi/AlimamaShuHeiTi-Bold/AlimamaShuHeiTi-Bold.ttf',
  'https://mdn.alipayobjects.com/portal_mnwejl/afts/file/A*GG6cQ5B6iMsAAAAAAAAAAAAAAQAAAQ',
]

export default class Index extends React.Component {
  state = {
    list: [
      {
        id: 'loadFontFace0',
        inputData: {
          family: 'My Font',
          source: `url("${fontUrls[0]}")`,
          global: true,
          desc: {
            style: 'normal',
            weight: 'normal',
          },
        },
        func: (apiIndex, data) => {
          TestConsole.consoleTest('Taro.loadFontFace')
          Taro.loadFontFace({
            ...data,
            success: (res) => {
              TestConsole.consoleSuccess.call(this, res, apiIndex)
            },
            fail: (res) => {
              TestConsole.consoleFail.call(this, res, apiIndex)
            },
            complete: (res) => {
              TestConsole.consoleComplete.call(this, res, apiIndex)
            },
          })
        },
      },
      {
        id: 'loadFontFace1',
        inputData: {
          family: 'My Font',
          source: `url("${fontUrls[1]}")`,
          global: true,
          desc: {
            style: 'normal',
            weight: 'Bold',
          },
        },
        func: (apiIndex, data) => {
          TestConsole.consoleTest('Taro.loadFontFace')
          Taro.loadFontFace({
            ...data,
            success: (res) => {
              TestConsole.consoleSuccess.call(this, res, apiIndex)
            },
            fail: (res) => {
              TestConsole.consoleFail.call(this, res, apiIndex)
            },
            complete: (res) => {
              TestConsole.consoleComplete.call(this, res, apiIndex)
            },
          })
        },
      },
      {
        id: 'loadFontFace2',
        inputData: {
          family: 'My Font',
          source: `url("${fontUrls[2]}")`,
          global: true,
          desc: {
            style: 'italic',
            weight: 'normal',
          },
        },
        func: (apiIndex, data) => {
          TestConsole.consoleTest('Taro.loadFontFace')
          Taro.loadFontFace({
            ...data,
            success: (res) => {
              TestConsole.consoleSuccess.call(this, res, apiIndex)
            },
            fail: (res) => {
              TestConsole.consoleFail.call(this, res, apiIndex)
            },
            complete: (res) => {
              TestConsole.consoleComplete.call(this, res, apiIndex)
            },
          })
        },
      },
    ],
  }

  render() {
    const { list } = this.state
    return (
      <View className='api-page'>
        <Text style={{ fontFamily: 'My Font', fontStyle: 'normal', fontWeight: 'normal' }}>
          Taro三方框架(normal, normal)
        </Text>
        <Text style={{ fontFamily: 'My Font', fontStyle: 'normal', fontWeight: 'bold' }}>
          Taro三方框架(normal, bold)
        </Text>
        <Text style={{ fontFamily: 'My Font', fontStyle: 'italic', fontWeight: 'normal' }}>
          Taro三方框架(italic, normal)
        </Text>
        <ButtonList buttonList={list} />
      </View>
    )
  }
}
