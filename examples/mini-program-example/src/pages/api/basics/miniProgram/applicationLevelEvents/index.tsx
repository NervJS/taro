import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { TestConsole } from '@/util/util'
import ButtonList from '@/components/buttonList'

/**
 * 基础-应用级事件
 * @returns
 */

export default class Index extends React.Component {
  state = {
    list: [
      {
        id: 'onUnhandledRejection',
        func: (apiIndex) => {
          TestConsole.consoleTest('Taro.onUnhandledRejection')
          new Promise((resolve,reject)=>{
            const aa = 'name';
            // @ts-ignore
            if (aa === 'name1') {
              resolve(aa);
            } else {
              reject({message: 'error'});
            }
          })

          Taro.onUnhandledRejection((res)=>{
            TestConsole.consoleOnCallback.call(this, res, 'onUnhandledRejection', apiIndex)
          })
        },
      }, 
      {
        id: 'onThemeChange',
        func: (apiIndex) => {
          TestConsole.consoleTest('Taro.onThemeChange')
          Taro.onThemeChange((res) =>{
            TestConsole.consoleOnCallback.call(this, res, 'onThemeChange', apiIndex)
          })
        },
      }, 
      {
        id: 'onPageNotFound',
        func: (apiIndex) => {
          TestConsole.consoleTest('Taro.onPageNotFound')
          Taro.navigateTo({
            url:'pages/api/index/11'
          })
          Taro.onPageNotFound((res)=>{
            TestConsole.consoleOnCallback.call(this, res, 'onPageNotFound', apiIndex)
              Taro.navigateTo({
                url:'pages/api/index/index'
              })
          })
        },
      }, 
      {
        id: 'onError',
        func: (apiIndex) => {
          TestConsole.consoleTest('Taro.onError')
          Taro.onError((err)=>{
            TestConsole.consoleOnCallback.call(this, err, 'onError', apiIndex)
          })
        },
      }, 
      {
        id: 'onAudioInterruptionEnd',
        func: (apiIndex) => {
          TestConsole.consoleTest('Taro.onAudioInterruptionEnd')
          Taro.onAudioInterruptionEnd((res) => {
            TestConsole.consoleOnCallback.call(this, res, 'onAudioInterruptionEnd', apiIndex)
          })

        },
      }, 
      {
        id: 'onAudioInterruptionBegin',
        func: (apiIndex) => {
          TestConsole.consoleTest('Taro.onAudioInterruptionBegin')
          Taro.onAudioInterruptionBegin((res) => {
            TestConsole.consoleOnCallback.call(this, res, 'onAudioInterruptionBegin', apiIndex)
          })

        },
      }, 
      {
        id: 'onAppShow',
        func: (apiIndex) => {
          TestConsole.consoleTest('Taro.onAppShow')
          Taro.onAppShow((res) => {
            TestConsole.consoleOnCallback.call(this, res, 'onAppShow', apiIndex)
          })

        },
      }, 
      {
        id: 'onAppHide',
        func: (apiIndex) => {
          TestConsole.consoleTest('Taro.onAppHide')
          Taro.onAppHide((res) => {
            TestConsole.consoleOnCallback.call(this, res, 'onAppHide', apiIndex)
          })
        },
      }, 
      {
        id: 'offThemeChange',
        func: (apiIndex) => {
          TestConsole.consoleTest('Taro.offThemeChange')
          Taro.offThemeChange((res) => {
            TestConsole.consoleOnCallback.call(this, res, 'offThemeChange', apiIndex)
          })
        },
      }, 
      {
        id: 'offPageNotFound',
        func: (apiIndex) => {
          TestConsole.consoleTest('Taro.offPageNotFound')
          Taro.offPageNotFound((res)=>{
            TestConsole.consoleOnCallback.call(this, res, 'offPageNotFound', apiIndex)
          })
          Taro.navigateTo({
            url:'pages/api/index/11'
          })
        },
      }, 
      {
        id: 'offError',
        func: (apiIndex) => {
          TestConsole.consoleTest('Taro.offError')
          Taro.offError((res) => {
            TestConsole.consoleOnCallback.call(this, res, 'offError', apiIndex)
          })
        },
      }, 
      {
        id: 'offAudioInterruptionEnd',
        func: (apiIndex) => {
          TestConsole.consoleTest('Taro.offAudioInterruptionEnd')
          Taro.offAudioInterruptionEnd((res) => {
            TestConsole.consoleOnCallback.call(this, res, 'offAudioInterruptionEnd', apiIndex)
          })
        },
      }, 
      {
        id: 'offAudioInterruptionBegin',
        func: (apiIndex) => {
          TestConsole.consoleTest('Taro.offAudioInterruptionBegin')
          Taro.offAudioInterruptionBegin((res) => {
            TestConsole.consoleOnCallback.call(this, res, 'offAudioInterruptionBegin', apiIndex)
          })
        },
      }, 
      {
        id: 'offAppShow',
        func: (apiIndex) => {
          TestConsole.consoleTest('Taro.offAppShow')
          Taro.offAppShow((res) => {
            TestConsole.consoleOnCallback.call(this, res, 'offAppShow', apiIndex)
          })
        },
      }, 
      {
        id: 'offAppHide',
        func: (apiIndex) => {
          TestConsole.consoleTest('Taro.offAppHide')
          Taro.offAppHide((res) => {
            TestConsole.consoleOnCallback.call(this, res, 'offAppHide', apiIndex)
          })
        },
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
