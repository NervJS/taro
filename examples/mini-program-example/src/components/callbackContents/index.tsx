/*
 * @Author: Vector-Hope 297893@whut.edu.cn
 * @Date: 2023-08-10 17:13:12
 * @LastEditors: Vector-Hope 297893@whut.edu.cn
 * @LastEditTime: 2023-11-14 15:30:55
 * @FilePath: \taro\examples\mini-program-example\src\components\callbackContents\index.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './index.scss'

/**
 * 回调结构内容
 * @returns
 */

interface Props {
  testApi: string
  callbackRes: any
}

export default class Index extends React.Component<Props> {
  state = {}
  stringify = (object) => {
    // console.log(object)
    const cache = new Map()
    const JSONStr = JSON.stringify(object, (key, value) => {
      if (value === undefined) {
        return 'undefined'
      }
      if (typeof value == 'function') {
        return 'function';
      }
      if (typeof value === 'object' && value !== null) {
        if (cache.has(value)) {
          return
        }
        cache.set(value, value)
      }
      return value
    })
    cache.clear()
    return JSONStr
  }
  render() {
    const { testApi, callbackRes } = this.props
    return (
      <View className='callback-content'>
        <View className='callback-res' id={`${testApi}-callback`}>
          {this.stringify(callbackRes)}
        </View>
      </View>
    )
  }
}
